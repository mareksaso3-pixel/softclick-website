#!/usr/bin/env python3
"""
Generate a weekly SEO blog post for softclick.ai.
Reads next pending topic from blog/topics.json, generates article via OpenAI,
updates blog/index.html and sitemap.xml, marks topic as done.
"""

import json
import os
import sys
import re
from datetime import date
from pathlib import Path
from openai import OpenAI

# ── Paths (relative to repo root) ──────────────────────────────────────────
REPO_ROOT = Path(__file__).parent.parent
TOPICS_FILE = REPO_ROOT / "blog" / "topics.json"
BLOG_INDEX = REPO_ROOT / "blog" / "index.html"
SITEMAP = REPO_ROOT / "sitemap.xml"
BLOG_DIR = REPO_ROOT / "blog"

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

SK_MONTHS = {
    1: "januára", 2: "februára", 3: "marca", 4: "apríla",
    5: "mája", 6: "júna", 7: "júla", 8: "augusta",
    9: "septembra", 10: "októbra", 11: "novembra", 12: "decembra"
}


def format_date_sk(d: date) -> str:
    return f"{d.day}. {SK_MONTHS[d.month]} {d.year}"


def get_next_topic() -> dict:
    topics = json.loads(TOPICS_FILE.read_text(encoding="utf-8"))
    for topic in topics:
        if topic["status"] == "pending":
            return topic
    raise SystemExit("Všetky témy sú hotové. Pridaj nové do blog/topics.json.")


def mark_topic_done(slug: str):
    topics = json.loads(TOPICS_FILE.read_text(encoding="utf-8"))
    today = date.today().isoformat()
    for t in topics:
        if t["slug"] == slug:
            t["status"] = "done"
            t["published"] = today
    TOPICS_FILE.write_text(json.dumps(topics, ensure_ascii=False, indent=2), encoding="utf-8")


def generate_article_content(topic: dict) -> dict:
    """Ask GPT-4 to generate structured article content in Slovak."""
    prompt = f"""Si SEO copywriter pre slovenskú AI automatizačnú agentúru SoftClick.ai (softclick.ai).
Napiš SEO článok v slovenčine na tému: "{topic['title']}"
Cieľové kľúčové slová: {topic['keywords']}

Vráť IBA validný JSON v tomto formáte (bez markdown blokov, bez komentárov):
{{
  "reading_time": "X min čítania",
  "lead": "Úvodný odsek (2-3 vety, zaujmúci, s hlavným kľúčovým slovom)",
  "stats": [
    {{"number": "číslo/skratka", "label": "krátky popis"}},
    {{"number": "číslo/skratka", "label": "krátky popis"}},
    {{"number": "číslo/skratka", "label": "krátky popis"}}
  ],
  "intro_paragraph": "Úvodný odsek článku (2-4 vety)",
  "sections": [
    {{
      "heading": "Názov H2 sekcie",
      "paragraphs": ["Odsek 1", "Odsek 2"],
      "list_items": ["Bod 1", "Bod 2", "Bod 3"],
      "callout": "Text pre callout box (voliteľné, vypusť ak nie je potrebné)"
    }}
  ],
  "steps": [
    {{"title": "Krok 1 – Názov", "content": "Popis kroku"}},
    {{"title": "Krok 2 – Názov", "content": "Popis kroku"}},
    {{"title": "Krok 3 – Názov", "content": "Popis kroku"}}
  ],
  "closing_paragraph": "Záverečný odsek pred CTA (2-3 vety)",
  "cta_heading": "Nadpis výzvy k akcii",
  "cta_text": "Text výzvy (1-2 vety, motivujúce)"
}}

Požiadavky:
- Slovenčina, profesionálny ale prístupný tón (vykanie)
- Minimálne 3 H2 sekcie, každá s 2+ odsekmi
- Reálne čísla a príklady zo SK/CZ trhu kde možné
- Prirodzené použitie kľúčových slov, nie keyword stuffing
- Minimálne 900 slov obsahu celkovo
- Sections: aspoň jedna má mať list_items, aspoň jedna callout"""

    resp = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=3000,
    )
    raw = resp.choices[0].message.content.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw)


def render_sections(sections: list) -> str:
    html = ""
    for sec in sections:
        html += f'\n        <h2>{sec["heading"]}</h2>\n'
        for para in sec.get("paragraphs", []):
            html += f'        <p>{para}</p>\n'
        if sec.get("list_items"):
            html += '        <ul>\n'
            for item in sec["list_items"]:
                html += f'          <li>{item}</li>\n'
            html += '        </ul>\n'
        if sec.get("callout"):
            html += f'''        <div class="callout">
          <p>{sec["callout"]}</p>
        </div>\n'''
    return html


def render_steps(steps: list) -> str:
    items = ""
    for step in steps:
        items += f'''          <li>
            <div>
              <strong>{step["title"]}</strong>
              <span>{step["content"]}</span>
            </div>
          </li>\n'''
    return f'        <ol class="steps">\n{items}        </ol>\n'


def build_article_html(topic: dict, content: dict, today: date) -> str:
    date_sk = format_date_sk(today)
    date_iso = today.isoformat()
    slug = topic["slug"]
    tag = topic["tag"]
    title = topic["title"]
    keywords = topic["keywords"]

    stats_html = "\n".join(
        f'          <div class="stat-card">\n'
        f'            <span class="stat-card__number">{s["number"]}</span>\n'
        f'            <span class="stat-card__label">{s["label"]}</span>\n'
        f'          </div>'
        for s in content.get("stats", [])
    )

    sections_html = render_sections(content.get("sections", []))
    steps_html = render_steps(content.get("steps", [])) if content.get("steps") else ""

    return f"""<!DOCTYPE html>
<html lang="sk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{title} | SoftClick.ai</title>
  <meta name="description" content="{content['lead'][:155]}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://softclick.ai/blog/{slug}.html">
  <meta property="og:title" content="{title} | SoftClick.ai">
  <meta property="og:description" content="{content['lead'][:155]}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="https://softclick.ai/blog/{slug}.html">
  <meta property="og:image" content="https://softclick.ai/assets/og-image.png">
  <meta property="og:locale" content="sk_SK">
  <meta property="og:site_name" content="SoftClick.ai">
  <meta property="article:published_time" content="{date_iso}">
  <meta property="article:author" content="Adam Barbeník">
  <link rel="icon" type="image/png" sizes="32x32" href="../assets/favicon-32.png">
  <link rel="icon" type="image/png" sizes="180x180" href="../assets/favicon.png">

  <script type="application/ld+json">
  {{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": "{title}",
    "description": "{content['lead'][:155]}",
    "author": {{
      "@type": "Person",
      "name": "Adam Barbeník",
      "jobTitle": "Co-Founder",
      "worksFor": {{"@type": "Organization", "name": "SoftClick.ai", "url": "https://softclick.ai"}}
    }},
    "publisher": {{
      "@type": "Organization",
      "name": "SoftClick.ai",
      "url": "https://softclick.ai",
      "logo": {{"@type": "ImageObject", "url": "https://softclick.ai/assets/logo-header.png"}}
    }},
    "datePublished": "{date_iso}",
    "dateModified": "{date_iso}",
    "url": "https://softclick.ai/blog/{slug}.html",
    "inLanguage": "sk",
    "keywords": "{keywords}",
    "articleSection": "{tag}",
    "timeRequired": "{content.get('reading_time', '5 min čítania').replace(' min čítania', 'M').replace(' ', '')}"
  }}
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/variables.css">
  <link rel="stylesheet" href="../css/base.css">
  <link rel="stylesheet" href="../css/header.css">
  <link rel="stylesheet" href="../css/buttons.css">
  <link rel="stylesheet" href="../css/responsive.css">

  <style>
    .article-header {{
      max-width: 760px;
      margin: 0 auto;
      padding: calc(var(--header-height) + var(--space-3xl)) var(--space-lg) var(--space-2xl);
      text-align: center;
    }}
    .article-header__back {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      text-decoration: none;
      margin-bottom: var(--space-xl);
      transition: color var(--transition-fast);
    }}
    .article-header__back:hover {{ color: var(--accent-violet); }}
    .article-header__meta {{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--space-sm);
      font-size: var(--font-size-sm);
      color: var(--text-muted);
      margin-bottom: var(--space-lg);
      flex-wrap: wrap;
    }}
    .article-header__tag {{
      display: inline-block;
      padding: 2px 12px;
      border-radius: var(--radius-full);
      background: rgba(155, 108, 255, 0.15);
      border: 1px solid rgba(155, 108, 255, 0.25);
      color: var(--accent-violet);
      font-size: 0.75rem;
      font-weight: 600;
    }}
    .article-header__dot {{ width: 3px; height: 3px; border-radius: 50%; background: var(--text-muted); opacity: 0.4; }}
    .article-header h1 {{
      font-size: clamp(1.75rem, 3vw + 0.75rem, 2.75rem);
      font-weight: 800;
      color: var(--text-heading);
      line-height: 1.2;
      letter-spacing: -0.03em;
      margin-bottom: var(--space-lg);
    }}
    .article-header__lead {{ font-size: var(--font-size-lg); color: var(--text-muted); line-height: 1.7; max-width: 620px; margin: 0 auto; }}
    .article-body {{ max-width: 760px; margin: 0 auto; padding: var(--space-2xl) var(--space-lg) var(--space-5xl); }}
    .article-body h2 {{ font-size: var(--font-size-2xl); font-weight: 700; color: var(--text-heading); margin: var(--space-3xl) 0 var(--space-md); letter-spacing: -0.02em; }}
    .article-body h3 {{ font-size: var(--font-size-xl); font-weight: 600; color: var(--text-heading); margin: var(--space-2xl) 0 var(--space-sm); }}
    .article-body p {{ font-size: var(--font-size-base); color: var(--text-muted); line-height: 1.8; margin-bottom: var(--space-lg); }}
    .article-body strong {{ color: var(--text-light); font-weight: 600; }}
    .article-body ul, .article-body ol {{ margin: 0 0 var(--space-lg) var(--space-lg); display: flex; flex-direction: column; gap: var(--space-sm); }}
    .article-body li {{ font-size: var(--font-size-base); color: var(--text-muted); line-height: 1.7; }}
    .article-body li::marker {{ color: var(--accent-violet); }}
    .callout {{ background: rgba(155, 108, 255, 0.07); border: 1px solid rgba(155, 108, 255, 0.2); border-left: 3px solid var(--accent-violet); border-radius: var(--radius-md); padding: var(--space-lg) var(--space-xl); margin: var(--space-xl) 0; }}
    .callout p {{ margin: 0; color: var(--text-light); }}
    .stat-grid {{ display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-lg); margin: var(--space-xl) 0; }}
    .stat-card {{ background: var(--card-bg); border: 1px solid var(--card-border); border-radius: var(--radius-md); padding: var(--space-lg); text-align: center; backdrop-filter: blur(8px); }}
    .stat-card__number {{ font-size: var(--font-size-3xl); font-weight: 800; background: var(--cta-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; display: block; line-height: 1.1; margin-bottom: var(--space-xs); }}
    .stat-card__label {{ font-size: var(--font-size-sm); color: var(--text-muted); }}
    .steps {{ counter-reset: steps; list-style: none; margin: 0 0 var(--space-xl); padding: 0; display: flex; flex-direction: column; gap: var(--space-lg); }}
    .steps li {{ counter-increment: steps; display: flex; gap: var(--space-lg); align-items: flex-start; }}
    .steps li::before {{ content: counter(steps); flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background: var(--cta-gradient); color: #fff; font-size: var(--font-size-sm); font-weight: 700; display: flex; align-items: center; justify-content: center; }}
    .steps li > div {{ flex: 1; }}
    .steps li strong {{ display: block; color: var(--text-heading); font-weight: 600; margin-bottom: 4px; }}
    .steps li span {{ color: var(--text-muted); font-size: var(--font-size-base); line-height: 1.65; }}
    .article-cta {{ background: linear-gradient(135deg, rgba(155,108,255,0.12), rgba(61,184,255,0.08)); border: 1px solid rgba(155,108,255,0.25); border-radius: var(--radius-xl); padding: var(--space-2xl); text-align: center; margin-top: var(--space-3xl); }}
    .article-cta h3 {{ font-size: var(--font-size-2xl); font-weight: 700; color: var(--text-heading); margin-bottom: var(--space-sm); }}
    .article-cta p {{ color: var(--text-muted); margin-bottom: var(--space-xl); }}
    .article-divider {{ border: none; border-top: 1px solid rgba(155,108,255,0.1); margin: var(--space-2xl) 0; }}
    @media (max-width: 640px) {{ .stat-grid {{ grid-template-columns: 1fr; }} }}
  </style>
  <noscript><style>body{{opacity:1!important;}}</style></noscript>
</head>
<body>

  <div class="aurora-bg" aria-hidden="true">
    <div class="aurora-layer aurora-layer--1"></div>
    <div class="aurora-layer aurora-layer--2"></div>
    <div class="aurora-layer aurora-layer--3"></div>
    <div class="aurora-layer aurora-layer--4"></div>
  </div>
  <canvas id="stars-canvas" aria-hidden="true"></canvas>

  <div class="page-wrapper">
    <header class="site-header" role="banner">
      <div class="header-inner">
        <a href="/" class="logo" aria-label="SoftClick.ai – Domov">
          <img src="../assets/logo-header.png" alt="SoftClick.ai" class="logo-img">
        </a>
        <nav aria-label="Hlavná navigácia">
          <ul class="nav-links">
            <li><a href="/#sluzby">Služby</a></li>
            <li><a href="/#proces">Ako prebieha spolupráca</a></li>
            <li><a href="/#preco">Prečo my</a></li>
            <li><a href="/#onas">O nás</a></li>
            <li><a href="/#kontakt">Kontakt</a></li>
          </ul>
        </nav>
        <div class="header-cta">
          <a href="/#kontakt" class="btn btn-primary btn-sm">Bezplatná konzultácia</a>
        </div>
        <button class="hamburger" aria-label="Otvoriť menu" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>

    <main id="main">
      <header class="article-header">
        <a href="/blog/" class="article-header__back">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M16 10H4M10 4L4 10l6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Späť na blog
        </a>
        <div class="article-header__meta">
          <span class="article-header__tag">{tag}</span>
          <span class="article-header__dot"></span>
          <span>{date_sk}</span>
          <span class="article-header__dot"></span>
          <span>{content.get('reading_time', '5 min čítania')}</span>
          <span class="article-header__dot"></span>
          <span>Adam Barbeník</span>
        </div>
        <h1>{title}</h1>
        <p class="article-header__lead">{content['lead']}</p>
      </header>

      <article class="article-body">
        <div class="stat-grid">
{stats_html}
        </div>

        <p>{content['intro_paragraph']}</p>
{sections_html}
        <hr class="article-divider">
{steps_html}
        <p>{content['closing_paragraph']}</p>

        <div class="article-cta">
          <h3>{content['cta_heading']}</h3>
          <p>{content['cta_text']}</p>
          <a href="/#kontakt" class="btn btn-primary">
            Dohodnúť bezplatnú konzultáciu
            <svg class="btn-arrow" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 4l6 6-6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10 4l6 6-6 6" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </a>
        </div>
      </article>
    </main>

    <footer class="site-footer" role="contentinfo">
      <div class="container">
        <div class="footer-inner">
          <a href="/" class="footer-logo logo" aria-label="SoftClick.ai">
            <img src="../assets/logo-header.png" alt="SoftClick.ai" class="logo-img">
          </a>
          <ul class="footer-links">
            <li><a href="/#sluzby">Služby</a></li>
            <li><a href="/#preco">Prečo my</a></li>
            <li><a href="/blog/">Blog</a></li>
            <li><a href="/#kontakt">Kontakt</a></li>
          </ul>
          <p class="footer-copy">&copy; 2025 <a href="/">SoftClick.ai</a>. Všetky práva vyhradené.</p>
        </div>
      </div>
    </footer>
  </div>

  <script src="../js/stars.js"></script>
  <script src="../js/main.js"></script>
  <script src="../js/animations.js"></script>
</body>
</html>"""


def add_card_to_blog_index(topic: dict, content: dict, today: date):
    """Insert new article card into blog/index.html after the featured card."""
    html = BLOG_INDEX.read_text(encoding="utf-8")
    date_sk = format_date_sk(today)
    slug = topic["slug"]
    tag = topic["tag"]
    title = topic["title"]
    lead = content["lead"]
    reading_time = content.get("reading_time", "5 min čítania")

    # Truncate lead for card
    excerpt = lead[:140] + ("..." if len(lead) > 140 else "")

    new_card = f"""
          <!-- Article: {slug} -->
          <a href="/blog/{slug}.html" class="blog-card">
            <div class="blog-card__meta">
              <span class="blog-card__tag">{tag}</span>
              <span class="blog-card__dot"></span>
              <span>{date_sk}</span>
              <span class="blog-card__dot"></span>
              <span>{reading_time}</span>
            </div>
            <h2>{title}</h2>
            <p>{excerpt}</p>
            <span class="blog-card__cta">
              Čítať článok
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                <path d="M4 10h12M10 4l6 6-6 6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </a>
"""

    # Insert after the closing tag of the featured card (blog-card--featured)
    marker = "<!-- Article: ai-automatizacia-emailov -->"
    if marker in html:
        html = html.replace(marker, new_card + "\n          " + marker)
    else:
        # Fallback: insert before the first regular (non-featured) blog-card
        html = html.replace(
            '<!-- Article 2 -->',
            new_card + '\n          <!-- Article 2 -->'
        )

    BLOG_INDEX.write_text(html, encoding="utf-8")


def update_sitemap(slug: str, today: date):
    xml = SITEMAP.read_text(encoding="utf-8")
    new_url = f"""  <url>
    <loc>https://softclick.ai/blog/{slug}.html</loc>
    <lastmod>{today.isoformat()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>"""
    xml = xml.replace("</urlset>", new_url + "\n</urlset>")
    # Update blog index lastmod
    xml = re.sub(
        r"(<loc>https://softclick\.ai/blog/</loc>\s*<lastmod>)[^<]*(</lastmod>)",
        rf"\g<1>{today.isoformat()}\g<2>",
        xml
    )
    SITEMAP.write_text(xml, encoding="utf-8")


def main():
    print("── SoftClick.ai Blog Generator ──")

    topic = get_next_topic()
    print(f"Téma: {topic['title']}")

    print("Generujem obsah cez OpenAI...")
    content = generate_article_content(topic)
    print(f"✓ Článok vygenerovaný ({content.get('reading_time', '?')})")

    today = date.today()
    slug = topic["slug"]

    article_path = BLOG_DIR / f"{slug}.html"
    article_html = build_article_html(topic, content, today)
    article_path.write_text(article_html, encoding="utf-8")
    print(f"✓ Súbor uložený: blog/{slug}.html")

    add_card_to_blog_index(topic, content, today)
    print("✓ Blog index aktualizovaný")

    update_sitemap(slug, today)
    print("✓ Sitemap aktualizovaná")

    mark_topic_done(slug)
    print(f"✓ Téma označená ako hotová")

    print(f"\n✅ Hotovo! Článok: https://softclick.ai/blog/{slug}.html")
    return slug


if __name__ == "__main__":
    main()

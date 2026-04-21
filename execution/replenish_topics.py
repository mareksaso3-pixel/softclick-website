#!/usr/bin/env python3
"""
Skontroluje frontu tém v blog/topics.json.
Ak ostáva menej ako THRESHOLD pending tém, vygeneruje nové pomocou GPT-4.
"""

import json
import os
import re
from pathlib import Path
from openai import OpenAI

REPO_ROOT = Path(__file__).parent.parent
TOPICS_FILE = REPO_ROOT / "blog" / "topics.json"
THRESHOLD = 4
NEW_BATCH = 8

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])

TAGS = ["Základy", "Email automatizácia", "CRM", "Predaj", "Produktivita",
        "Nástroje", "Chatbot", "GDPR", "Social Media", "Financie", "Odvetvie", "E-commerce"]


def slugify(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[áä]", "a", text)
    text = re.sub(r"[čč]", "c", text)
    text = re.sub(r"[ď]", "d", text)
    text = re.sub(r"[éě]", "e", text)
    text = re.sub(r"[í]", "i", text)
    text = re.sub(r"[ľĺ]", "l", text)
    text = re.sub(r"[ňn]", "n", text)
    text = re.sub(r"[óô]", "o", text)
    text = re.sub(r"[řŕ]", "r", text)
    text = re.sub(r"[šs]", "s", text)
    text = re.sub(r"[ť]", "t", text)
    text = re.sub(r"[úů]", "u", text)
    text = re.sub(r"[ýy]", "y", text)
    text = re.sub(r"[žz]", "z", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text


def main():
    topics = json.loads(TOPICS_FILE.read_text(encoding="utf-8"))
    pending = [t for t in topics if t["status"] == "pending"]
    print(f"Pending tém: {len(pending)}")

    if len(pending) >= THRESHOLD:
        print("Fronta je dostatočná, nič netreba generovať.")
        return

    existing_titles = [t["title"] for t in topics]
    existing_slugs = [t["slug"] for t in topics]

    print(f"Fronta pod {THRESHOLD}, generujem {NEW_BATCH} nových tém...")

    prompt = f"""Si SEO stratég pre slovenskú AI automatizačnú agentúru SoftClick.ai.
Firma robí: AI asistenti na mieru, automatizácia emailov, CRM, kalendára, sociálnych sietí, interných procesov.
Cieľový trh: Slovensko a Česká republika, malé a stredné firmy.

Tieto témy už existujú (nepridávaj podobné):
{json.dumps(existing_titles, ensure_ascii=False)}

Vygeneruj {NEW_BATCH} NOVÝCH unikátnych tém pre SEO blog v slovenčine.
Zameraj sa na: long-tail kľúčové slová, konkrétne odvetvia (právnici, účtovníci, realitky, lekári, agentúry), konkrétne nástroje, porovnania, návody, prípadové štúdie.

Vráť IBA validný JSON array (bez markdown blokov):
[
  {{
    "slug": "url-friendly-slug-bez-diakritiky",
    "title": "Názov článku v slovenčine",
    "keywords": "3-5 kľúčových slov oddelených čiarkou",
    "tag": "jeden z: {', '.join(TAGS)}"
  }}
]"""

    resp = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.8,
        max_tokens=2000,
    )
    raw = resp.choices[0].message.content.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    new_topics = json.loads(raw)

    added = 0
    for t in new_topics:
        slug = slugify(t.get("slug", t["title"]))
        if slug in existing_slugs:
            continue
        topics.append({
            "slug": slug,
            "title": t["title"],
            "keywords": t["keywords"],
            "tag": t.get("tag", "Základy"),
            "status": "pending"
        })
        existing_slugs.append(slug)
        added += 1

    TOPICS_FILE.write_text(json.dumps(topics, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"✅ Pridaných {added} nových tém do topics.json")


if __name__ == "__main__":
    main()

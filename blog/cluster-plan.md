# SoftClick.ai Blog — Hub & Spoke Cluster Plan
**Seed keyword:** AI automatizácia pre firmy | **Market:** Slovensko + Česko (B2B SME) | **Generated:** 2026-07-27

Machine-readable version: `cluster-plan.json` (same directory).

## 0. Method & honesty note

Keyword expansion and SERP sampling used `WebSearch` (no DataForSEO/paid SERP API configured),
run against ~15 Slovak-language head-term queries. **Finding:** the Slovak B2B AI-automation SERP
is highly fragmented — dozens of small agencies (aiai.sk, slovensko.ai, mrdigital.sk, condu.sk,
metinas.com, itgale.sk, slenk.industries, VoiceFleet, chatbotnamieru.sk...) each rank for slightly
different long-tail phrasing. Real exact-URL overlap between keyword pairs mostly landed in the
**0-3 range** (separate/interlink), never reached the 7-10 same-post merge threshold, and rarely
even hit the 4-6 same-cluster band. **No cannibalization risk exists today** — but it also means
clustering below the pillar level had to lean on the methodology's intent-alignment tiebreak rule
more than on raw overlap counts, since overlap signal for long-tail variants was thin. Two pairs
are flagged for careful differentiation during writing even though overlap was low (see §4).

## 1. Pillar

**`/ai-automatizacia.html`** — "AI automatizácia: kompletný sprievodca pre firmy (2026)"
Keyword: *AI automatizácia pre firmy* · Template: `ultimate-guide` · ~3200 words · **status: written**

This is correctly the broadest, most link-worthy page and already exists with Article + Breadcrumb +
FAQPage schema. It is the only page every spoke must link to (mandatory, bidirectional).

## 2. Existing blog posts — intent classification

| Post | Primary keyword | Intent | Template fit |
|---|---|---|---|
| co-je-ai-asistent | AI asistent pre firmu | Informational (concept) | explainer ✓ |
| navratnost-investicie-do-ai | návratnosť investície do AI | Informational (how) / Commercial (evaluate) | how-to ✓ |
| spracovanie-faktur-ai | spracovanie faktúr AI | Informational (how) | how-to ✓ |
| 5-firemnych-procesov-na-automatizaciu | 5 firemných procesov na automatizáciu | Informational (list) | listicle ✓ |
| ai-automatizacia-emailov | AI automatizácia emailov | Informational (how) | how-to ✓ |
| seo-geo-optimalizacia-pre-firmy | SEO/GEO optimalizácia pre firmy | Informational/Commercial — **out of scope** | n/a — see §6 |

No navigational keywords found in the set (nothing brand-name-seeking); nothing was excluded on
that basis. `seo-geo-optimalizacia-pre-firmy` was excluded on **topical relevance** grounds instead
(see §6) — it is not about process automation and shouldn't be forced into this cluster's mesh.

## 3. Architecture — 5 clusters, 19 spokes + pillar (20 pages total)

### Cluster 0 — Základy a rozhodovanie (Informational, top-of-funnel)
| Post | Keyword | Template | Status |
|---|---|---|---|
| co-je-ai-asistent | AI asistent pre firmu | explainer | written |
| ai-pre-malu-firmu | AI pre malé firmy | how-to | planned |
| kolko-casu-usetri-ai | koľko času ušetrí AI automatizácia | explainer | planned |
| gdpr-a-ai-automatizacia | GDPR AI automatizácia | explainer | planned |

### Cluster 1 — Náklady, návratnosť a nástroje (Commercial, decision-stage)
| Post | Keyword | Template | Status |
|---|---|---|---|
| navratnost-investicie-do-ai | návratnosť investície do AI | how-to | written |
| **kolko-stoji-ai-automatizacia** *(GAP)* | koľko stojí AI automatizácia | comparison | planned — new |
| n8n-vs-make-porovnanie | n8n vs Make.com | comparison | planned |
| ai-chatbot-pre-web | AI chatbot na web stránku | review | planned |

### Cluster 2 — Automatizácia komunikácie so zákazníkmi (Informational, how-to)
| Post | Keyword | Template | Status |
|---|---|---|---|
| ai-automatizacia-emailov | AI automatizácia emailov | how-to | written |
| ai-follow-up-automatizacia | follow-up automatizácia | how-to | planned |
| automatizacia-socialnych-sieti | automatizácia sociálnych sietí AI | how-to | planned |
| **whatsapp-automatizacia-pre-firmy** *(GAP)* | WhatsApp automatizácia pre firmu | how-to | planned — new |

### Cluster 3 — Administratíva a interné procesy (Informational, operational)
| Post | Keyword | Template | Status |
|---|---|---|---|
| spracovanie-faktur-ai | spracovanie faktúr AI | how-to | written |
| 5-firemnych-procesov-na-automatizaciu | 5 firemných procesov na automatizáciu | listicle | written |
| crm-automatizacia | CRM automatizácia | how-to | planned |
| **automatizacia-hr-a-naboru** *(GAP)* | automatizácia HR AI | how-to | planned — new |

### Cluster 4 — AI automatizácia podľa odvetvia (Transactional, bottom-of-funnel)
| Post | Keyword | Template | Status |
|---|---|---|---|
| ai-pre-realitnu-kancelariu | AI automatizácia realitná kancelária | landing-page | planned |
| ai-pre-ecommerce | AI eshop automatizácia | landing-page | planned |
| **ai-pre-gastro-restauracie** *(GAP)* | AI automatizácia reštaurácia gastro | landing-page | planned — new |

Templates for the three industry posts were set to `landing-page` rather than `how-to`/`explainer`
because the actual Slovak SERPs for "AI automatizácia realitná kancelária" / "...gastro" are
dominated by vendor landing pages (mrdigital.sk/ai-agent-gastro, DOMIRE assistant, axisreal.sk-type
pages), not blog articles — matching the methodology's rule to mirror the dominant SERP format.

## 4. Cannibalization check

- **0 duplicate primary keywords.** Highest pairwise SERP overlap found: 3 (pillar vs. "koľko stojí
  AI automatizácia" and vs. "AI automatizácia gastro"). No pair reaches the 7-10 merge threshold.
- **Flagged for careful differentiation during writing** (low SERP overlap but conceptually close,
  real risk is *keyword self-competition* if written carelessly, not duplicate targeting):
  - `navratnost-investicie-do-ai` (how to **calculate** ROI) vs. `kolko-stoji-ai-automatizacia`
    (what it **costs** upfront/monthly). Keep the ROI post formula/calculator-focused and the cost
    post pricing-tier/budget-focused; cross-link heavily instead of merging.
  - `ai-automatizacia-emailov` (inbox triage/reply/escalation) vs. `ai-follow-up-automatizacia`
    (post-first-contact sales nurture). Different funnel stage — keep separate, cross-link.

## 5. Internal link matrix (full detail in `cluster-plan.json` → `links`)

Rules applied:
- **Mandatory:** every spoke ↔ pillar (bidirectional) — 38 links.
- **Recommended:** full sibling mesh within each cluster (2-3 links/post for the 4-post clusters) — 54 links.
- **Optional:** 12 curated cross-cluster bridges where there's a genuine topical bridge, e.g.
  faktúry → cena, follow-up ↔ CRM, GDPR → HR/CRM (osobné údaje), gastro/e-commerce → WhatsApp,
  realitky → chatbot.

**Result: 104 total links, 0 orphan pages, minimum 3 incoming links per post** (industry-vertical
posts sit at the floor of 3; every other post has 4-6). Link density: 4.47 incoming links/post.

## 6. Findings requiring a decision from Marek/Adam

1. **`seo-geo-optimalizacia-pre-firmy` doesn't belong in this cluster.** It currently links to
   `/ai-automatizacia.html` (fine to keep as a light contextual link) but its actual topic — AI
   search visibility / GEO — is a different service line from "process automation." Recommend
   spinning it into its own future pillar ("Viditeľnosť firmy v AI vyhľadávaní") rather than
   diluting the automation pillar's topical focus.
2. **Broken links already exist in `blog/index.html`**: it links to `/blog/automatizacia-crm.html`
   and `/blog/kolko-casu-usetri-ai.html`, neither of which exist yet as files (only `crm-automatizacia`
   is planned in `topics.json`, with a *different* slug than the link uses — `automatizacia-crm` vs
   `crm-automatizacia`). Fix the slug mismatch when this post is written.
3. **Zero spoke-to-spoke internal links exist today** — every published post links only to the
   pillar. This cluster plan's mesh (§5) is the fix; apply it retroactively to the 6 already-written
   posts, not just to new ones.
4. **Real, undeveloped market gap: AI telefonický/hlasový asistent (recepcia, call centrum).**
   Confirmed active Slovak competitors (aireceptionist.sk, VoiceFleet, Zudu AI) with zero SERP
   overlap against every other cluster here — genuinely separate demand. Not currently one of
   SoftClick's 4 homepage services, so this is a product-positioning call, not just a content one.
   If greenlit, it's big enough to be its own future pillar rather than a spoke.
5. Four new gap topics were added beyond the existing `topics.json` backlog because they had
   confirmed, distinct search demand with no SoftClick coverage: **koľko stojí AI automatizácia**
   (pricing/budget query, very commonly searched alongside ROI), **WhatsApp automatizácia**
   (real demand, but thin dedicated SK content = low-competition opportunity), **automatizácia HR
   a náboru** (surfaced repeatedly in GDPR/automation searches), **AI pre gastro/reštaurácie**
   (a full dedicated competitive vertical with zero overlap to anything else, same shape as the
   already-planned realitky/e-commerce verticals).

## 7. Pre-delivery validation

- [x] No two posts share the same primary keyword
- [x] Every spoke has at least 3 incoming internal links (min = 3, on the 3 industry posts)
- [x] Every spoke links to the pillar (mandatory)
- [x] Pillar links to every spoke (mandatory)
- [x] No orphan pages
- [x] Template selection matches intent classification
- [x] Word counts: pillar 3200 (within 2500-4000); spokes 1300-1800 (within 1200-1800)
- [x] 5 clusters (within 2-5), 3-4 posts/cluster (within 2-4)
- [x] SERP data supports groupings; no cluster built on cannibalizing keywords (max overlap found = 3)

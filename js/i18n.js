/**
 * i18n: Language detection, translation engine, and SK/EN dictionary.
 */
var TRANSLATIONS = {
  sk: {
    meta: {
      title: "AI Automatizácia pre Firmy | SoftClick.ai – AI Asistenti na Mieru",
      description: "AI automatizácia pre firmy od SoftClick.ai. Vytvárame AI asistentov na mieru – automatizácia emailov, CRM, kalendára a interných procesov. Ušetrite 2-4 hodiny denne. Bezplatná konzultácia.",
      ogTitle: "AI Automatizácia pre Firmy | SoftClick.ai",
      ogDescription: "Vytvárame AI asistentov na mieru, ktorí pracujú 24/7. Automatizácia emailov, CRM, kalendára a interných procesov. Ušetrite 2-4 hodiny denne.",
      ogImageAlt: "SoftClick.ai – AI automatizácia pre firmy",
      twitterTitle: "AI Automatizácia pre Firmy | SoftClick.ai",
      twitterDescription: "AI asistenti na mieru, ktorí pracujú 24/7. Automatizácia emailov, CRM, kalendára a procesov.",
      ogLocale: "sk_SK"
    },
    skip: "Preskočiť na obsah",
    nav: {
      ariaLabel: "Hlavná navigácia",
      logoAria: "SoftClick.ai – Domov",
      services: "Služby",
      process: "Ako prebieha spolupráca",
      why: "Prečo my",
      pricing: "Cenník",
      about: "O nás",
      faq: "FAQ",
      contact: "Kontakt",
      cta: "Bezplatná konzultácia",
      menuOpen: "Otvoriť menu",
      menuAria: "Mobilné menu"
    },
    hero: {
      headline: "AI automatizácia<br>pre Váš biznis",
      subheadline: "Implementujeme AI riešenia, ktoré zefektívňujú administratívne a vnútopodnikové procesy. Budujeme digitálnu infraštruktúru, ktorá šetrí váš čas a mení váš biznis na moderný, digitálny systém.",
      ctaPrimary: "Dohodnite si bezplatnú konzultáciu",
      ctaSecondary: "Pozrite si naše služby"
    },
    marquee: {
      label: "Technológie s ktorými pracujeme"
    },
    services: {
      title: "Naše služby",
      heading: "Riešenia poháňané umelou inteligenciou",
      text: "Od inteligentných asistentov až po komplexné automatizácie firemných procesov. Navrhujeme systémy, ktoré pracujú za vás.",
      card1Title: "Automatizovaný AI ekosystém",
      card1Text: "Navrhneme Custom AI riešenia pre Vaše špecifické potreby. Zefektívnime vnútrofiremné procesy a prepojíme všetky Vaše systémy do jedného inteligentného a plne automatizovaného celku.",
      card2Title: "Samoobslužné CRM",
      card2Text: "Plne autonómny CRM systém. Vaše kontakty, obchody a kľúčové dáta sa z e-mailov do databázy aktualizujú okamžite a bez Vašej asistencie.",
      card3Title: "Outreach & Follow-up",
      card3Text: "Zabezpečíme automatické oslovovanie Vašej cieľovej skupiny personalizovanými e-mailami vrátane inteligentného follow-upu.",
      card4Title: "Inteligentný e-mailový manažér",
      card4Text: "Samostatne odpovedá na dopyty, koordinuje termíny vo Vašom kalendári a z prichádzajúcich správ vytvára štruktúrované leady v CRM."
    },
    stats: {
      ariaLabel: "Štatistiky",
      stat1Label: "rutinných úloh",
      stat2Label: "Rýchlejšie procesy",
      stat3Label: "Menej nákladov"
    },
    process: {
      label: "Proces",
      title: "Ako prebieha spolupráca",
      subtitle: "Od prvej konzultácie po plnú automatizáciu v 6 jednoduchých krokoch.",
      step1Title: "Bezplatná konzultácia",
      step1Text: "Zistíme, ktoré procesy Vám zaberajú najviac času a kde vidíme najväčší potenciál na automatizáciu.",
      step2Title: "Návrh riešenia",
      step2Text: "Navrhneme AI riešenie presne podľa vašich potrieb. Ukážeme vám, čo zautomatizujeme a aký prínos to prinesie vášmu biznisu.",
      step3Title: "Implementácia",
      step3Text: "Vytvoríme a nasadíme riešenie. Prepojíme ho s Vašimi existujúcimi systémami.",
      step4Title: "Testovanie",
      step4Text: "Otestujeme všetko na reálnych dátach. Uistíme sa, že systém funguje presne ako má.",
      step5Title: "Schvaľovací režim",
      step5Text: "Máte plnú kontrolu. AI systém pracuje pod vaším dohľadom, kým nie ste s výsledkami 100 % spokojní.",
      step6Title: "Plná automatizácia",
      step6Text: "Plne autonómny chod 24/7. Systém funguje spoľahlivo aj bez vašich manuálnych zásahov."
    },
    why: {
      label: "Výhody",
      title: "Prečo SoftClick.ai",
      subtitle: "Meníme zdĺhavú administratívu na bleskové procesy. Ponúkame AI automatizáciu, ktorá nie je experimentom, ale investíciou s návratnosťou.",
      card1Title: "Individuálna AI architektúra",
      card1Text: "Navrhujeme unikátne AI systémy na mieru Vašim potrebám. Získate personalizovaný systém, ktorý sa plne adaptuje na Vaše interné procesy.",
      card2Title: "Osobný prístup",
      card2Text: "S každým klientom komunikujeme priamo a navrhujeme riešenia presne pre jeho potreby. Sme Váš flexibilný partner, ktorý rozumie špecifikám Vášho podnikania.",
      card3Title: "Maximálny dôraz na ochranu dát",
      card3Text: "Bezpečnosť klientskych dát je našou prioritou, preto pracujeme v súlade s GDPR a EU AI Act, uzatvárame prísne zmluvy a Vaše dáta nikdy neukladáme na vlastných serveroch."
    },
    references: {
      label: "REFERENCIE",
      title: "Čo sme realizovali",
      subtitle: "Úspešne sme pomohli firmám z rôznych odvetví zautomatizovať ich každodenné procesy.",
      card1Title: "Komplexná automatizácia fakturácie",
      card1Text: "Implementovali sme systém na kompletnú správu fakturačného cyklu. AI asistent automaticky skenuje doklady, vyčítava dáta, páruje platby a zabezpečuje archiváciu. Výsledkom je nulová chybovosť a eliminácia desiatok hodín manuálnej administratívy.",
      card2Title: "Celopodnikový AI ekosystém",
      card2Text: "Prepojili sme interné systémy do jedného celku. E-mailový asistent autonómne spracováva dopyty a zapisuje informácie do CRM, zatiaľ čo vnútrofiremné automatizácie zrýchľujú komunikáciu medzi oddeleniami a odstraňujú administratívne bariéry.",
      card3Title: "Automatizácia sociálnych sietí",
      card3Text: "Navrhli sme systém pre kompletnú správu sociálnych sietí. AI agent samostatne generuje kreatívne príspevky, prispôsobuje ich rôznym platformám a publikuje podľa strategického harmonogramu."
    },
    pricing: {
      label: "Cenník",
      title: "Individuálny prístup",
      subtitle: "Každé riešenie je unikátne. Ku každému klientovi pristupujeme individuálne a výsledná cena závisí od rozsahu a komplexnosti navrhnutej automatizácie.",
      cardTitle: "Tvorba cenovej ponuky",
      cardText: "Nepracujeme s fixnými balíčkami. Po bezplatnej konzultácii presne pochopíme, čo potrebujete, a pripravíme cenovú ponuku na mieru.",
      feature1: "Bezplatná úvodná konzultácia",
      feature2: "Cenová ponuka do 48 hodín",
      feature3: "Žiadne skryté poplatky",
      feature4: "Platíte len za to, čo využívate",
      feature5: "Priebežná podpora a údržba",
      cta: "Nezáväzná konzultácia zadarmo"
    },
    calc: {
      label: "Cenník",
      title: "Koľko to bude stáť u vás?",
      subtitle: "Nepracujeme s fixnými balíčkami, ale nechceme, aby ste odchádzali bez predstavy. Za minútu dostanete orientačné rozpätie aj odhad, kedy sa vám investícia vráti.",
      tiers: {
        t1Name: "Menšie automatizácie",
        t1Price: "od 200 €",
        t1Unit: "mesačne",
        t1Desc: "Chatbot na web, email asistent, správa sociálnych sietí.",
        t2Name: "Procesné riešenia",
        t2Price: "od 1 500 €",
        t2Unit: "jednorazovo",
        t2Desc: "Spracovanie faktúr, prepojenie CRM, telefonický asistent.",
        t3Name: "Komplexný ekosystém",
        t3Price: "od 6 000 €",
        t3Unit: "jednorazovo",
        t3Desc: "Viac systémov naraz, riešenie na mieru pre celú firmu."
      },
      stepOf: "Krok {n} z {total}",
      back: "Späť",
      next: "Ďalej",
      showResult: "Zobraziť odhad",
      restart: "Prepočítať znova",
      multiHint: "Môžete vybrať aj viac možností.",
      steps: {
        modules: { q: "Čo chcete automatizovať?", hint: "Vyberte, čo vás najviac ťaží." },
        hours: { q: "Koľko hodín denne tomu venuje váš tím dokopy?", hint: "Stačí odhad." },
        volume: { q: "Aký objem spracujete mesačne?", hint: "Emaily, dopyty, faktúry alebo objednávky spolu." },
        systems: { q: "Aké systémy dnes používate?", hint: "Napojíme sa na ne, meniť ich nemusíte." },
        company: { q: "Koľko ľudí vo firme pracuje?", hint: "Ovplyvňuje rozsah nastavenia a zaškolenia." }
      },
      opt: {
        modules: {
          chatbot:  { l: "Chatbot na web", d: "Odpovedá návštevníkom 24/7 a zbiera dopyty." },
          email:    { l: "Emaily a dopyty", d: "Triedi poštu, navrhuje odpovede, nič nezapadne." },
          invoices: { l: "Faktúry a doklady", d: "Vyčíta dáta, páruje platby, archivuje." },
          phone:    { l: "Telefonický asistent", d: "Dvíha hovory, objednáva termíny, pripomína." },
          crm:      { l: "CRM a interné procesy", d: "Zapisuje kontakty a obchody bez ručnej práce." },
          social:   { l: "Sociálne siete", d: "Pripravuje a publikuje príspevky podľa plánu." }
        },
        hours: {
          h1: { l: "Do 2 hodín" },
          h2: { l: "2 až 5 hodín" },
          h3: { l: "5 až 10 hodín" },
          h4: { l: "Viac ako 10 hodín" }
        },
        volume: {
          v1: { l: "Do 100 položiek" },
          v2: { l: "100 až 500" },
          v3: { l: "500 až 2 000" },
          v4: { l: "Viac ako 2 000" }
        },
        systems: {
          mail:       { l: "Gmail alebo Outlook" },
          crm:        { l: "CRM" },
          accounting: { l: "Účtovný softvér" },
          sheets:     { l: "Tabuľky a dokumenty" },
          eshop:      { l: "E-shop alebo rezervačný systém" },
          none:       { l: "Nič z toho" }
        },
        company: {
          c1: { l: "1 až 5 ľudí" },
          c2: { l: "6 až 20 ľudí" },
          c3: { l: "21 až 50 ľudí" },
          c4: { l: "Viac ako 50 ľudí" }
        }
      },
      result: {
        title: "Váš orientačný odhad",
        to: "až",
        implLabel: "Implementácia",
        implNote: "Jednorazovo, platí sa v etapách.",
        monthlyLabel: "Mesačná prevádzka",
        monthlyNote: "Podpora, údržba a úpravy podľa potreby.",
        savingLabel: "Vaša úspora",
        savingNote: "Približne {h} hodín mesačne, ktoré dnes minie tím na rutinu.",
        paybackLabel: "Návratnosť",
        paybackNote: "Odvtedy už riešenie zarába.",
        paybackUnknown: "Prejdeme si to spolu",
        paybackUnknownNote: "Pri tomto objeme sa oplatí začať menším riešením a rozširovať ho postupne.",
        months: "mesiacov",
        disclaimer: "Orientačný odhad na základe vašich odpovedí. Počítame s nákladom 14 € na hodinu administratívnej práce vrátane odvodov. Presnú cenu pripravíme po bezplatnej konzultácii, keď poznáme detaily vašich procesov.",
        formTitle: "Chcete presnú ponuku?",
        formText: "Pošleme vám rozpis do 48 hodín. Vaše odpovede už máme, takže sa nebudeme pýtať dvakrát.",
        name: "Vaše meno",
        email: "vas@email.sk",
        company: "Firma (nepovinné)",
        submit: "Chcem presnú ponuku",
        sending: "Odosielam...",
        success: "Ďakujeme, ozveme sa vám do 48 hodín.",
        error: "Nepodarilo sa odoslať. Skúste to prosím znova alebo napíšte na info@softclick.ai.",
        mailSubject: "Cenová kalkulačka: nový dopyt z webu",
        calendly: "Radšej rovno hovor? Vyberte si termín"
      },
      assurance: {
        a1: "Bezplatná úvodná konzultácia",
        a2: "Presná ponuka do 48 hodín",
        a3: "Žiadne skryté poplatky",
        a4: "Platíte len za to, čo využívate"
      },
      noscript: "Kalkulačka potrebuje zapnutý JavaScript. Menšie automatizácie štartujú na 200 € mesačne, procesné riešenia od 1 500 € a komplexné ekosystémy od 6 000 €. Napíšte nám a pripravíme presnú ponuku do 48 hodín."
    },
    about: {
      label: "O nás",
      title: "Kto za tým stojí",
      adam: {
        role: "Co-Founder",
        bio: "\u201EAk tvoj biznis v roku 2026 stále funguje manuálne, už teraz zaostávaš.\u201C"
      },
      marek: {
        role: "Co-Founder",
        bio: "\u201EVäčšina firiem nepotrebuje viac zamestnancov. Potrebuje lepšie systémy.\u201C"
      }
    },
    faq: {
      label: "FAQ",
      title: "Často kladené otázky",
      q1: "Čo je AI asistent a ako funguje?",
      a1: "AI asistent je softvérový agent poháňaný umelou inteligenciou, ktorý dokáže vykonávať úlohy ako odpovedanie na emaily, zapisovanie do CRM, dohadovanie stretnutí alebo správu sociálnych sietí. Funguje nepretržite, automaticky a bez potreby Vášho zásahu – presne podľa pravidiel, ktoré spolu nastavíme.",
      q2: "Je to bezpečné? Ako je to s GDPR?",
      a2: "Áno, bezpečnosť je naša priorita. Pracujeme v súlade s GDPR, uzatvárame sprostredkovateľskú zmluvu a všetky údaje spracovávame v rámci EÚ. Máte plnú kontrolu nad tým, čo AI asistent robí – nič sa neodošle bez Vášho vedomia.",
      q3: "Koľko času mi to reálne ušetrí?",
      a3: "Záleží od objemu Vašej práce, ale väčšina našich klientov ušetrí 2-4 hodiny denne na rutinnej administratíve. To je 40-80 hodín mesačne, ktoré môžete venovať práci, ktorá Vás naozaj živí.",
      q4: "Čo ak mi riešenie nebude vyhovovať?",
      a4: "Každé riešenie prispôsobujeme presne Vašim potrebám. Ak niečo nefunguje podľa očakávaní, upravíme to. Na začiatku máte plnú kontrolu v schvaľovacom režime, takže vidíte presne, čo AI robí, ešte predtým než ho pustíte plne automaticky.",
      q5: "Ako dlho trvá implementácia?",
      a5: "Jednoduchšie automatizácie (napr. email asistent) vieme nasadiť do niekoľkých dní. Komplexnejšie riešenia s prepojením viacerých systémov zvyčajne trvajú 1-2 týždne. Presný harmonogram dohodneme na úvodnej konzultácii.",
      q6: "Musím niečo meniť vo svojich existujúcich systémoch?",
      a6: "Nie. Naše riešenia sa napájajú na Vaše existujúce nástroje (email, CRM, kalendár, Slack a pod.) bez potreby čokoľvek meniť. Pracujeme s tým, čo už používate.",
      q7: "Koľko to stojí?",
      a7: "Menšie automatizácie ako chatbot na web alebo email asistent štartujú na 200 € mesačne. Procesné riešenia typu spracovanie faktúr alebo prepojenie CRM začínajú na 1 500 € jednorazovo, komplexné firemné ekosystémy na 6 000 €. Orientačné rozpätie pre Vašu situáciu Vám za minútu vypočíta cenová kalkulačka na tejto stránke. Presnú ponuku pripravíme do 48 hodín po bezplatnej konzultácii."
    },
    cta: {
      heading: "Ste pripravení nasadiť nový AI systém do vášho biznisu?",
      text: "Náš ekosystém automaticky odpisuje na e-maily, zapisuje dáta do CRM a plánuje stretnutia. Získate systém, ktorý za vás spoľahlivo vyrieši celú administratívu.",
      button: "Dohodnite si bezplatnú konzultáciu"
    },
    contact: {
      label: "Kontakt",
      title: "Ozvite sa nám",
      subtitle: "Máte otázku alebo chcete vedieť viac? Napíšte nám alebo si rovno dohodnite bezplatnú konzultáciu.",
      location: "Banská Bystrica, Slovakia",
      formName: "Meno",
      formNamePlaceholder: "Vaše meno",
      formEmail: "Email",
      formEmailPlaceholder: "vas@email.sk",
      formMessage: "Správa",
      formMessagePlaceholder: "Opíšte nám, čo by ste chceli automatizovať...",
      formSubject: "Nová správa z webu SoftClick.ai",
      formSubmit: "Odoslať správu"
    },
    footer: {
      services: "Služby",
      process: "Proces",
      why: "Prečo my",
      pricing: "Cenník a kalkulačka",
      about: "O nás",
      faq: "FAQ",
      contact: "Kontakt",
      cookies: "Cookies",
      privacy: "Ochrana údajov",
      cookieSettings: "Nastavenia cookies",
      copy: "Všetky práva vyhradené."
    },
    js: {
      sending: "Odosielam...",
      success: "Správa bola úspešne odoslaná! Ozveme sa Vám čo najskôr.",
      error: "Niečo sa pokazilo. Skúste to znova alebo nám napíšte na info@softclick.ai",
      sendFailed: "Odoslanie zlyhalo"
    }
  },

  en: {
    meta: {
      title: "AI Automation for Business | SoftClick.ai – Custom AI Assistants",
      description: "AI automation for businesses by SoftClick.ai. We build custom AI assistants – email automation, CRM, calendar, and internal process automation. Save 2-4 hours daily. Free consultation.",
      ogTitle: "AI Automation for Business | SoftClick.ai",
      ogDescription: "We build custom AI assistants that work 24/7. Email automation, CRM, calendar, and internal processes. Save 2-4 hours daily.",
      ogImageAlt: "SoftClick.ai – AI automation for business",
      twitterTitle: "AI Automation for Business | SoftClick.ai",
      twitterDescription: "Custom AI assistants that work 24/7. Email automation, CRM, calendar, and process automation.",
      ogLocale: "en_US"
    },
    skip: "Skip to content",
    nav: {
      ariaLabel: "Main navigation",
      logoAria: "SoftClick.ai – Home",
      services: "Services",
      process: "How It Works",
      why: "Why Us",
      pricing: "Pricing",
      about: "About",
      faq: "FAQ",
      contact: "Contact",
      cta: "Free Consultation",
      menuOpen: "Open menu",
      menuAria: "Mobile menu"
    },
    hero: {
      headline: "AI Automation<br>for Your Business",
      subheadline: "We implement AI solutions that streamline administrative and internal business processes. We build digital infrastructure that saves your time and transforms your business into a modern, digital system.",
      ctaPrimary: "Book a Free Consultation",
      ctaSecondary: "See Our Services"
    },
    marquee: {
      label: "Technologies we work with"
    },
    services: {
      title: "Our Services",
      heading: "Solutions Powered by Artificial Intelligence",
      text: "From intelligent assistants to complex business process automation. We design systems that work for you.",
      card1Title: "Automated AI Ecosystem",
      card1Text: "We design custom AI solutions for your specific needs. We streamline internal processes and connect all your systems into one intelligent, fully automated ecosystem.",
      card2Title: "Self-Service CRM",
      card2Text: "A fully autonomous CRM system. Your contacts, deals, and key data are updated from emails to the database instantly and without your assistance.",
      card3Title: "Outreach & Follow-up",
      card3Text: "We provide automated outreach to your target audience with personalized emails including intelligent follow-up sequences.",
      card4Title: "Intelligent Email Manager",
      card4Text: "Independently responds to inquiries, coordinates appointments in your calendar, and creates structured leads in CRM from incoming messages."
    },
    stats: {
      ariaLabel: "Statistics",
      stat1Label: "routine tasks",
      stat2Label: "Faster processes",
      stat3Label: "Less costs"
    },
    process: {
      label: "Process",
      title: "How It Works",
      subtitle: "From the first consultation to full automation in 6 simple steps.",
      step1Title: "Free Consultation",
      step1Text: "We identify which processes take up most of your time and where we see the greatest automation potential.",
      step2Title: "Solution Design",
      step2Text: "We design an AI solution tailored to your needs. We show you what we'll automate and what benefits it will bring to your business.",
      step3Title: "Implementation",
      step3Text: "We build and deploy the solution. We integrate it with your existing systems.",
      step4Title: "Testing",
      step4Text: "We test everything on real data. We make sure the system works exactly as expected.",
      step5Title: "Approval Mode",
      step5Text: "You have full control. The AI system works under your supervision until you are 100% satisfied with the results.",
      step6Title: "Full Automation",
      step6Text: "Fully autonomous operation 24/7. The system runs reliably without any manual intervention."
    },
    why: {
      label: "Benefits",
      title: "Why SoftClick.ai",
      subtitle: "We turn tedious administration into lightning-fast processes. We offer AI automation that is not an experiment, but an investment with proven returns.",
      card1Title: "Custom AI Architecture",
      card1Text: "We design unique AI systems tailored to your needs. You get a personalized system that fully adapts to your internal processes.",
      card2Title: "Personal Approach",
      card2Text: "We communicate directly with every client and design solutions specifically for their needs. We are your flexible partner who understands the specifics of your business.",
      card3Title: "Maximum Focus on Data Protection",
      card3Text: "Client data security is our priority. We comply with GDPR and EU AI Act, sign strict agreements, and never store your data on our own servers."
    },
    references: {
      label: "REFERENCES",
      title: "What We've Delivered",
      subtitle: "We have successfully helped companies from various industries automate their everyday processes.",
      card1Title: "Complete Invoicing Automation",
      card1Text: "We implemented a system for complete invoice cycle management. The AI assistant automatically scans documents, extracts data, matches payments, and handles archiving. The result is zero error rate and elimination of dozens of hours of manual administration.",
      card2Title: "Enterprise-Wide AI Ecosystem",
      card2Text: "We connected internal systems into one unified platform. The email assistant autonomously processes inquiries and records information in CRM, while internal automations accelerate cross-department communication and remove administrative barriers.",
      card3Title: "Social Media Automation",
      card3Text: "We designed a system for complete social media management. The AI agent independently generates creative posts, adapts them to different platforms, and publishes according to a strategic schedule."
    },
    pricing: {
      label: "Pricing",
      title: "Individual Approach",
      subtitle: "Every solution is unique. We approach each client individually and the final price depends on the scope and complexity of the proposed automation.",
      cardTitle: "Custom Quote",
      cardText: "We don't work with fixed packages. After a free consultation, we'll understand exactly what you need and prepare a custom quote.",
      feature1: "Free initial consultation",
      feature2: "Quote within 48 hours",
      feature3: "No hidden fees",
      feature4: "You only pay for what you use",
      feature5: "Ongoing support and maintenance",
      cta: "Free No-Obligation Consultation"
    },
    calc: {
      label: "Pricing",
      title: "What would it cost you?",
      subtitle: "We don't work with fixed packages, but we don't want you leaving with no idea either. In one minute you get an indicative range and an estimate of when the investment pays for itself.",
      tiers: {
        t1Name: "Smaller automations",
        t1Price: "from €200",
        t1Unit: "per month",
        t1Desc: "Website chatbot, email assistant, social media management.",
        t2Name: "Process solutions",
        t2Price: "from €1,500",
        t2Unit: "one-off",
        t2Desc: "Invoice processing, CRM integration, phone assistant.",
        t3Name: "Full ecosystem",
        t3Price: "from €6,000",
        t3Unit: "one-off",
        t3Desc: "Multiple systems at once, a custom solution for the whole company."
      },
      stepOf: "Step {n} of {total}",
      back: "Back",
      next: "Next",
      showResult: "Show my estimate",
      restart: "Start over",
      multiHint: "You can pick more than one.",
      steps: {
        modules: { q: "What do you want to automate?", hint: "Pick what slows you down the most." },
        hours: { q: "How many hours a day does your team spend on it?", hint: "A rough estimate is enough." },
        volume: { q: "What volume do you handle monthly?", hint: "Emails, inquiries, invoices or orders combined." },
        systems: { q: "Which systems do you use today?", hint: "We connect to them, you change nothing." },
        company: { q: "How many people work in your company?", hint: "It affects setup and training scope." }
      },
      opt: {
        modules: {
          chatbot:  { l: "Website chatbot", d: "Answers visitors 24/7 and captures inquiries." },
          email:    { l: "Emails and inquiries", d: "Sorts mail, drafts replies, nothing slips through." },
          invoices: { l: "Invoices and documents", d: "Extracts data, matches payments, archives." },
          phone:    { l: "Phone assistant", d: "Answers calls, books appointments, sends reminders." },
          crm:      { l: "CRM and internal processes", d: "Records contacts and deals without manual work." },
          social:   { l: "Social media", d: "Prepares and publishes posts on schedule." }
        },
        hours: {
          h1: { l: "Up to 2 hours" },
          h2: { l: "2 to 5 hours" },
          h3: { l: "5 to 10 hours" },
          h4: { l: "More than 10 hours" }
        },
        volume: {
          v1: { l: "Up to 100 items" },
          v2: { l: "100 to 500" },
          v3: { l: "500 to 2,000" },
          v4: { l: "More than 2,000" }
        },
        systems: {
          mail:       { l: "Gmail or Outlook" },
          crm:        { l: "CRM" },
          accounting: { l: "Accounting software" },
          sheets:     { l: "Spreadsheets and documents" },
          eshop:      { l: "E-shop or booking system" },
          none:       { l: "None of these" }
        },
        company: {
          c1: { l: "1 to 5 people" },
          c2: { l: "6 to 20 people" },
          c3: { l: "21 to 50 people" },
          c4: { l: "More than 50 people" }
        }
      },
      result: {
        title: "Your indicative estimate",
        to: "to",
        implLabel: "Implementation",
        implNote: "One-off, paid in stages.",
        monthlyLabel: "Monthly running cost",
        monthlyNote: "Support, maintenance and adjustments as needed.",
        savingLabel: "Your saving",
        savingNote: "Roughly {h} hours a month your team spends on routine today.",
        paybackLabel: "Payback",
        paybackNote: "From then on the solution earns money.",
        paybackUnknown: "Let's go through it",
        paybackUnknownNote: "At this volume it pays to start with a smaller solution and expand it gradually.",
        months: "months",
        disclaimer: "An indicative estimate based on your answers. We assume a cost of €14 per hour of administrative work including contributions. We prepare the exact price after a free consultation, once we know the details of your processes.",
        formTitle: "Want an exact quote?",
        formText: "We'll send a breakdown within 48 hours. We already have your answers, so we won't ask twice.",
        name: "Your name",
        email: "you@email.com",
        company: "Company (optional)",
        submit: "Send me the exact quote",
        sending: "Sending...",
        success: "Thank you, we'll get back to you within 48 hours.",
        error: "Sending failed. Please try again or write to info@softclick.ai.",
        mailSubject: "Pricing calculator: new inquiry from the website",
        calendly: "Prefer a call? Pick a time"
      },
      assurance: {
        a1: "Free initial consultation",
        a2: "Exact quote within 48 hours",
        a3: "No hidden fees",
        a4: "You only pay for what you use"
      },
      noscript: "The calculator needs JavaScript enabled. Smaller automations start at €200 per month, process solutions from €1,500 and full ecosystems from €6,000. Write to us and we'll prepare an exact quote within 48 hours."
    },
    about: {
      label: "About",
      title: "Who's Behind It",
      adam: {
        role: "Co-Founder",
        bio: "\"If your business still runs manually in 2026, you're already falling behind.\""
      },
      marek: {
        role: "Co-Founder",
        bio: "\"Most companies don't need more employees. They need better systems.\""
      }
    },
    faq: {
      label: "FAQ",
      title: "Frequently Asked Questions",
      q1: "What is an AI assistant and how does it work?",
      a1: "An AI assistant is a software agent powered by artificial intelligence that can perform tasks such as responding to emails, recording data in CRM, scheduling meetings, or managing social media. It works continuously, automatically, and without your intervention – following the exact rules we set up together.",
      q2: "Is it safe? What about GDPR?",
      a2: "Yes, security is our priority. We comply with GDPR, sign data processing agreements, and process all data within the EU. You have full control over what the AI assistant does – nothing is sent without your knowledge.",
      q3: "How much time will it actually save me?",
      a3: "It depends on your workload, but most of our clients save 2-4 hours daily on routine administration. That's 40-80 hours per month that you can dedicate to work that truly matters.",
      q4: "What if the solution doesn't suit me?",
      a4: "We customize every solution to your exact needs. If something doesn't work as expected, we'll adjust it. At the beginning, you have full control in approval mode, so you see exactly what the AI does before letting it run fully automatically.",
      q5: "How long does implementation take?",
      a5: "Simpler automations (e.g., email assistant) can be deployed within a few days. More complex solutions connecting multiple systems typically take 1-2 weeks. We'll agree on the exact timeline during the initial consultation.",
      q6: "Do I need to change anything in my existing systems?",
      a6: "No. Our solutions integrate with your existing tools (email, CRM, calendar, Slack, etc.) without the need to change anything. We work with what you already use.",
      q7: "How much does it cost?",
      a7: "Smaller automations such as a website chatbot or an email assistant start at €200 per month. Process solutions like invoice processing or CRM integration start at €1,500 one-off, and full company ecosystems at €6,000. The pricing calculator on this page gives you an indicative range for your situation in one minute. We prepare the exact quote within 48 hours after a free consultation."
    },
    cta: {
      heading: "Ready to deploy a new AI system in your business?",
      text: "Our ecosystem automatically responds to emails, records data in CRM, and schedules meetings. You get a system that reliably handles all your administration.",
      button: "Book a Free Consultation"
    },
    contact: {
      label: "Contact",
      title: "Get in Touch",
      subtitle: "Have a question or want to learn more? Write to us or book a free consultation right away.",
      location: "Banská Bystrica, Slovakia",
      formName: "Name",
      formNamePlaceholder: "Your name",
      formEmail: "Email",
      formEmailPlaceholder: "your@email.com",
      formMessage: "Message",
      formMessagePlaceholder: "Describe what you'd like to automate...",
      formSubject: "New message from SoftClick.ai website",
      formSubmit: "Send Message"
    },
    footer: {
      services: "Services",
      process: "Process",
      why: "Why Us",
      pricing: "Pricing & calculator",
      about: "About",
      faq: "FAQ",
      contact: "Contact",
      cookies: "Cookies",
      privacy: "Privacy Policy",
      cookieSettings: "Cookie settings",
      copy: "All rights reserved."
    },
    js: {
      sending: "Sending...",
      success: "Message sent successfully! We'll get back to you as soon as possible.",
      error: "Something went wrong. Please try again or email us at info@softclick.ai",
      sendFailed: "Failed to send"
    }
  }
};

/* ===== Structured Data Templates ===== */
var STRUCTURED_DATA = {
  sk: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SoftClick.ai",
      "url": "https://softclick.ai",
      "logo": {"@type": "ImageObject", "url": "https://softclick.ai/assets/favicon.png", "width": 180, "height": 180},
      "description": "AI automatizácia pre firmy. Vytvárame AI asistentov na mieru – automatizácia emailov, CRM, kalendára a interných procesov.",
      "email": "info@softclick.ai",
      "address": {"@type": "PostalAddress", "addressLocality": "Banská Bystrica", "addressCountry": "SK"},
      "founder": [{"@type": "Person", "name": "Adam Barbeník", "jobTitle": "Co-Founder"}, {"@type": "Person", "name": "Marek Sásik", "jobTitle": "Co-Founder"}],
      "contactPoint": {"@type": "ContactPoint", "email": "info@softclick.ai", "contactType": "customer service", "availableLanguage": ["Slovak", "English"]},
      "areaServed": [{"@type": "Country", "name": "Slovakia"}, {"@type": "Country", "name": "Czech Republic"}]
    },
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SoftClick.ai",
      "url": "https://softclick.ai",
      "description": "AI automatizácia pre firmy – AI asistenti na mieru pre automatizáciu emailov, CRM, kalendára a interných procesov.",
      "inLanguage": ["sk", "en"]
    },
    service: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "AI Automatizácia",
      "provider": {"@type": "Organization", "name": "SoftClick.ai", "url": "https://softclick.ai"},
      "name": "AI automatizácia pre firmy",
      "description": "Komplexné AI riešenia pre automatizáciu firemných procesov vrátane emailovej komunikácie, CRM integrácie, správy kalendára, follow-up systémov, outreach automatizácie a správy sociálnych sietí.",
      "areaServed": [{"@type": "Country", "name": "Slovakia"}, {"@type": "Country", "name": "Czech Republic"}],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "AI Automatizačné Služby",
        "itemListElement": [
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Inteligentný e-mailový manažér", "description": "Samostatne odpovedá na dopyty, koordinuje termíny v kalendári a vytvára štruktúrované leady v CRM"}},
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Samoobslužné CRM", "description": "Plne autonómny CRM systém s automatickou aktualizáciou kontaktov a obchodov z e-mailov"}},
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Outreach & Follow-up", "description": "Automatické oslovovanie cieľovej skupiny personalizovanými e-mailami vrátane inteligentného follow-upu"}},
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Automatizovaný AI ekosystém", "description": "Custom AI riešenia, automatizácia vnútrofiremných procesov a prepojenie systémov do jedného celku"}}
        ]
      }
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "Čo je AI asistent a ako funguje?", "acceptedAnswer": {"@type": "Answer", "text": "AI asistent je softvérový agent poháňaný umelou inteligenciou, ktorý dokáže vykonávať úlohy ako odpovedanie na emaily, zapisovanie do CRM, dohadovanie stretnutí alebo správu sociálnych sietí. Funguje nepretržite, automaticky a bez potreby Vášho zásahu – presne podľa pravidiel, ktoré spolu nastavíme."}},
        {"@type": "Question", "name": "Je to bezpečné? Ako je to s GDPR?", "acceptedAnswer": {"@type": "Answer", "text": "Áno, bezpečnosť je naša priorita. Pracujeme v súlade s GDPR, uzatvárame sprostredkovateľskú zmluvu a všetky údaje spracovávame v rámci EÚ. Máte plnú kontrolu nad tým, čo AI asistent robí – nič sa neodošle bez Vášho vedomia."}},
        {"@type": "Question", "name": "Koľko času mi to reálne ušetrí?", "acceptedAnswer": {"@type": "Answer", "text": "Záleží od objemu Vašej práce, ale väčšina našich klientov ušetrí 2-4 hodiny denne na rutinnej administratíve. To je 40-80 hodín mesačne, ktoré môžete venovať práci, ktorá Vás naozaj živí."}},
        {"@type": "Question", "name": "Čo ak mi riešenie nebude vyhovovať?", "acceptedAnswer": {"@type": "Answer", "text": "Každé riešenie prispôsobujeme presne Vašim potrebám. Ak niečo nefunguje podľa očakávaní, upravíme to. Na začiatku máte plnú kontrolu v schvaľovacom režime, takže vidíte presne, čo AI robí, ešte predtým než ho pustíte plne automaticky."}},
        {"@type": "Question", "name": "Ako dlho trvá implementácia?", "acceptedAnswer": {"@type": "Answer", "text": "Jednoduchšie automatizácie (napr. email asistent) vieme nasadiť do niekoľkých dní. Komplexnejšie riešenia s prepojením viacerých systémov zvyčajne trvajú 1-2 týždne. Presný harmonogram dohodneme na úvodnej konzultácii."}},
        {"@type": "Question", "name": "Musím niečo meniť vo svojich existujúcich systémoch?", "acceptedAnswer": {"@type": "Answer", "text": "Nie. Naše riešenia sa napájajú na Vaše existujúce nástroje (email, CRM, kalendár, Slack a pod.) bez potreby čokoľvek meniť. Pracujeme s tým, čo už používate."}},
        {"@type": "Question", "name": "Koľko to stojí?", "acceptedAnswer": {"@type": "Answer", "text": "Menšie automatizácie ako chatbot na web alebo email asistent štartujú na 200 € mesačne. Procesné riešenia typu spracovanie faktúr alebo prepojenie CRM začínajú na 1 500 € jednorazovo, komplexné firemné ekosystémy na 6 000 €. Orientačné rozpätie pre Vašu situáciu Vám za minútu vypočíta cenová kalkulačka na tejto stránke. Presnú ponuku pripravíme do 48 hodín po bezplatnej konzultácii."}}
      ]
    }
  },
  en: {
    organization: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SoftClick.ai",
      "url": "https://softclick.ai",
      "logo": {"@type": "ImageObject", "url": "https://softclick.ai/assets/favicon.png", "width": 180, "height": 180},
      "description": "AI automation for businesses. We build custom AI assistants – email automation, CRM, calendar, and internal process automation.",
      "email": "info@softclick.ai",
      "address": {"@type": "PostalAddress", "addressLocality": "Banská Bystrica", "addressCountry": "SK"},
      "founder": [{"@type": "Person", "name": "Adam Barbeník", "jobTitle": "Co-Founder"}, {"@type": "Person", "name": "Marek Sásik", "jobTitle": "Co-Founder"}],
      "contactPoint": {"@type": "ContactPoint", "email": "info@softclick.ai", "contactType": "customer service", "availableLanguage": ["Slovak", "English"]},
      "areaServed": [{"@type": "Country", "name": "Slovakia"}, {"@type": "Country", "name": "Czech Republic"}]
    },
    website: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "SoftClick.ai",
      "url": "https://softclick.ai",
      "description": "AI automation for businesses – custom AI assistants for email automation, CRM, calendar, and internal process automation.",
      "inLanguage": ["sk", "en"]
    },
    service: {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": "AI Automation",
      "provider": {"@type": "Organization", "name": "SoftClick.ai", "url": "https://softclick.ai"},
      "name": "AI automation for businesses",
      "description": "Comprehensive AI solutions for business process automation including email communication, CRM integration, calendar management, follow-up systems, outreach automation, and social media management.",
      "areaServed": [{"@type": "Country", "name": "Slovakia"}, {"@type": "Country", "name": "Czech Republic"}],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "AI Automation Services",
        "itemListElement": [
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Intelligent Email Manager", "description": "Independently responds to inquiries, coordinates calendar appointments, and creates structured leads in CRM"}},
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Self-Service CRM", "description": "Fully autonomous CRM system with automatic contact and deal updates from emails"}},
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Outreach & Follow-up", "description": "Automated outreach to target audience with personalized emails including intelligent follow-up"}},
          {"@type": "Offer", "itemOffered": {"@type": "Service", "name": "Automated AI Ecosystem", "description": "Custom AI solutions, internal process automation, and system integration into one unified platform"}}
        ]
      }
    },
    faq: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {"@type": "Question", "name": "What is an AI assistant and how does it work?", "acceptedAnswer": {"@type": "Answer", "text": "An AI assistant is a software agent powered by artificial intelligence that can perform tasks such as responding to emails, recording data in CRM, scheduling meetings, or managing social media. It works continuously, automatically, and without your intervention – following the exact rules we set up together."}},
        {"@type": "Question", "name": "Is it safe? What about GDPR?", "acceptedAnswer": {"@type": "Answer", "text": "Yes, security is our priority. We comply with GDPR, sign data processing agreements, and process all data within the EU. You have full control over what the AI assistant does – nothing is sent without your knowledge."}},
        {"@type": "Question", "name": "How much time will it actually save me?", "acceptedAnswer": {"@type": "Answer", "text": "It depends on your workload, but most of our clients save 2-4 hours daily on routine administration. That's 40-80 hours per month that you can dedicate to work that truly matters."}},
        {"@type": "Question", "name": "What if the solution doesn't suit me?", "acceptedAnswer": {"@type": "Answer", "text": "We customize every solution to your exact needs. If something doesn't work as expected, we'll adjust it. At the beginning, you have full control in approval mode, so you see exactly what the AI does before letting it run fully automatically."}},
        {"@type": "Question", "name": "How long does implementation take?", "acceptedAnswer": {"@type": "Answer", "text": "Simpler automations (e.g., email assistant) can be deployed within a few days. More complex solutions connecting multiple systems typically take 1-2 weeks. We'll agree on the exact timeline during the initial consultation."}},
        {"@type": "Question", "name": "Do I need to change anything in my existing systems?", "acceptedAnswer": {"@type": "Answer", "text": "No. Our solutions integrate with your existing tools (email, CRM, calendar, Slack, etc.) without the need to change anything. We work with what you already use."}},
        {"@type": "Question", "name": "How much does it cost?", "acceptedAnswer": {"@type": "Answer", "text": "Smaller automations such as a website chatbot or an email assistant start at €200 per month. Process solutions like invoice processing or CRM integration start at €1,500 one-off, and full company ecosystems at €6,000. The pricing calculator on this page gives you an indicative range for your situation in one minute. We prepare the exact quote within 48 hours after a free consultation."}}
      ]
    }
  }
};

/* ===== Translation Engine ===== */
var I18n = (function () {
  var STORAGE_KEY = 'softclick-lang';

  function resolve(obj, key) {
    return key.split('.').reduce(function (o, k) { return o && o[k]; }, obj);
  }

  // Podstranky s vlastnym SEO textom si jazyk zamknu cez data-i18n-lock="sk"
  // na <html>. Prekladame im len dynamicky obsah, meta tagy nechavame tak.
  function locked() {
    var l = document.documentElement.getAttribute('data-i18n-lock');
    return (l === 'sk' || l === 'en') ? l : null;
  }

  function getLang() {
    var lock = locked();
    if (lock) return lock;
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'sk' || saved === 'en') return saved;
    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return /^(sk|cs)/.test(nav) ? 'sk' : 'en';
  }

  function setLang(lang) {
    var lock = locked();
    if (lock) lang = lock;
    if (lang !== 'sk' && lang !== 'en') lang = 'sk';
    if (!lock) localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
    document.documentElement.dataset.lang = lang;

    var t = TRANSLATIONS[lang];

    // Text content (preserves child elements like SVG arrows)
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var val = resolve(t, el.getAttribute('data-i18n'));
      if (!val) return;
      // Find first text node or create one
      var textNode = null;
      for (var i = 0; i < el.childNodes.length; i++) {
        if (el.childNodes[i].nodeType === 3 && el.childNodes[i].textContent.trim()) {
          textNode = el.childNodes[i];
          break;
        }
      }
      if (textNode) {
        textNode.textContent = val + ' ';
      } else if (!el.querySelector('svg, img')) {
        el.textContent = val;
      } else {
        el.insertBefore(document.createTextNode(val + ' '), el.firstChild);
      }
    });

    // HTML content (for <br> tags)
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var val = resolve(t, el.getAttribute('data-i18n-html'));
      if (val) el.innerHTML = val;
    });

    // Placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
      var val = resolve(t, el.getAttribute('data-i18n-placeholder'));
      if (val) el.placeholder = val;
    });

    // Aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(function (el) {
      var val = resolve(t, el.getAttribute('data-i18n-aria'));
      if (val) el.setAttribute('aria-label', val);
    });

    // Input values (hidden fields)
    document.querySelectorAll('[data-i18n-value]').forEach(function (el) {
      var val = resolve(t, el.getAttribute('data-i18n-value'));
      if (val) el.value = val;
    });

    // Meta tags (na zamknutych podstrankach ich necháme nedotknuté)
    if (lock) {
      document.body.classList.add('i18n-ready');
      return;
    }

    document.title = t.meta.title;
    var metaMap = {
      'meta[name="description"]': t.meta.description,
      'meta[property="og:title"]': t.meta.ogTitle,
      'meta[property="og:description"]': t.meta.ogDescription,
      'meta[property="og:image:alt"]': t.meta.ogImageAlt,
      'meta[property="og:locale"]': t.meta.ogLocale,
      'meta[name="twitter:title"]': t.meta.twitterTitle,
      'meta[name="twitter:description"]': t.meta.twitterDescription
    };
    Object.keys(metaMap).forEach(function (sel) {
      var el = document.querySelector(sel);
      if (el) el.setAttribute('content', metaMap[sel]);
    });

    // Structured data
    var ldMap = { 'ld-organization': 'organization', 'ld-website': 'website', 'ld-service': 'service', 'ld-faq': 'faq' };
    var sd = STRUCTURED_DATA[lang];
    Object.keys(ldMap).forEach(function (id) {
      var el = document.getElementById(id);
      if (el && sd[ldMap[id]]) {
        el.textContent = JSON.stringify(sd[ldMap[id]]);
      }
    });

    // Toggle buttons
    document.querySelectorAll('.lang-toggle__btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });

    // Signal ready
    document.body.classList.add('i18n-ready');
  }

  function init() {
    // Wire toggle buttons
    document.querySelectorAll('.lang-toggle__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var lang = this.getAttribute('data-lang');
        setLang(lang);
      });
    });

    // Apply initial language
    setLang(getLang());
  }

  // Expose for main.js to read current translations
  function t(key) {
    var lang = document.documentElement.dataset.lang || 'sk';
    return resolve(TRANSLATIONS[lang], key) || key;
  }

  return { init: init, setLang: setLang, getLang: getLang, t: t };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', I18n.init);
} else {
  I18n.init();
}

// Safety fallback — always show content after 500ms
setTimeout(function () { document.body.classList.add('i18n-ready'); }, 500);

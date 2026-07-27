# SoftClick.ai - Landing Page

## Spustenie lokálne

Stačí otvoriť `index.html` v prehliadači. Pre live-reload odporúčam VS Code extension "Live Server" - pravý klik na `index.html` → Open with Live Server.

## Deployment na Vercel

1. Vytvorte si účet na [vercel.com](https://vercel.com)
2. Nahrajte tento priečinok na GitHub (nový repozitár)
3. Na Vercel kliknite "Import Project" → vyberte repo
4. Deploy prebehne automaticky

## Napojenie domény (Namecheap → Vercel)

1. Na Vercel: Settings → Domains → pridajte `softclick.ai`
2. Na Namecheap: Domain List → Manage → Advanced DNS
3. Pridajte záznamy podľa Vercel inštrukcií (zvyčajne A record: `76.76.21.21` a CNAME: `cname.vercel-dns.com`)

## Čo treba nahradiť

- **Logo**: Nahraďte SVG v headeri za reálne logo (alebo použite `<img src="assets/logo.svg">`)
- **Fotka Adama**: V sekcii "O nás" nahraďte placeholder `AB` za `<img src="assets/adam.jpg" alt="Adam Barbeník">`
- **Web3Forms**: Zaregistrujte sa na [web3forms.com](https://web3forms.com), získajte access key a nahraďte `YOUR_WEB3FORMS_ACCESS_KEY` v `index.html`
- **Google Analytics**: Vytvorte GA4 property, získajte Measurement ID (G-XXXXXXXXXX) a odkomentujte script v `index.html`
- **Partner logá**: Nahraďte placeholder SVG ikonky za reálne logá technológií v priečinku `assets/partners/`

## Úprava rýchlosti marquee

V `css/marquee.css` zmeňte hodnotu `35s` v `animation: marqueeScroll 35s linear infinite;` - vyššie číslo = pomalšie.

## Úprava farieb

Všetky farby sú v `css/variables.css` ako CSS custom properties. Stačí zmeniť hodnoty tam.

## Odporúčania k assetom

- **Logo**: SVG formát, min. šírka 200px
- **Fotka tímu**: Štvorcová (400x400px+), JPEG/WebP, komprimovaná
- **Partner logá**: SVG (preferované), monochrome/biela verzia, max výška 28px
- **Favicon**: Pripravte 32x32 PNG a pridajte `<link rel="icon" href="assets/favicon.png">` do `<head>`

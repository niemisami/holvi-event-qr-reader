# Holvi-verkkokaupan tapahtumalippujen QR-koodilukija

## Miten käytetään?

- Luo uusi Google sheet (https://sheet.new <- luo nopeasti uuden)
- Tallenna Holvista saadun excelin datat sheettiin
- Lisää kaksi uutta otsikkoa `"Käsittelijä"` sekä `"Käsittelyaika"`. Sarakkeita käytetään tallentamaan tiedot sovelluksen käyttäjästä ongelmien selvittämistä varten
- Ota talteen sheetin ~45 merkkinen id urlista. Esim: `https://docs.google.com/spreadsheets/d/abcde-1245/edit?gid=0#gid=0` -> `abcde-1245`
- Luo uusi [`Google Auth Platform Client`](https://console.cloud.google.com/auth/clients/)
- Ota talteen `clientId`
- Lisää `.env` tiedostoon `VITE_GOOGLE_CLIENT_ID=<clientId>`
- Käännä
- Aja missä haluat

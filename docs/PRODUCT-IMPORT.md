# Uvoz proizvoda

Pripremljeno je 2.456 zapisa s popunjenim barkodom iz dva šifrarnika od 5.10.2026: 2.311 vrste otc i 145 vrste NEPOZNATO. Izostavljeno je 1.557 zapisa bez barkoda. Ovaj filter ne potvrđuje da je artikl aktivan ili na zalihi. MPC se prenosi kao izvorna cijena, bez preračunavanja; potvrditi da odgovara webshop cijeni prije objave.

## Koraci u Supabase dashboardu

1. Ako početna baza nije postavljena, prvo pokrenuti supabase/bootstrap.sql, napraviti korisnika u Authentication > Users i pokrenuti supabase/grant-admin.sql. Odobreni e-mail je apotekaunapharm@gmail.com.
2. Otvoriti SQL Editor > New query. Kopirati cijeli supabase/products.sql, zalijepiti i kliknuti Run. Skripta dodaje tabelu products i zaštićeno spremanje. Ne briše postojeće podatke.
3. Pokrenuti imports/products-import-01.sql do products-import-05.sql redom, svaki u zasebnoj New query. U lokalnom editoru Ctrl+A, Ctrl+C, zatim zalijepiti i kliknuti Run. Prva četiri dijela sadrže po 500 zapisa, peti 456. Veliki products-import.sql može preći ograničenje SQL Editora i zato nije preporučen za dashboard.
4. Rezultat prvog uvoza u novu tabelu treba prikazati imported_products=2456, without_image=2456 i drafts=2456. Provjeriti tabelu products u Table Editoru.
5. Tek nakon uspješnog SQL setupa deployati pripremljene promjene admina putem GitHub main. Za lokalni pregled pokrenuti pnpm dev, otvoriti /admin i prijaviti se.
6. U adminu odabrati Bez slike. Pretraga podržava naziv, brend, šifru, barkod i originalni ID. Otvoriti Uredi, dodati HTTPS URL fotografije i Sačuvati. Slika odmah ulazi u Sa slikom filter. To provjerava da je URL popunjen; ne provjerava dostupnost svih udaljenih slika.
7. Za objavu odabrati kategoriju, potvrditi cijenu veću od 0, odabrati Objavljeno i Sačuvati. Na javnoj stranici osvježiti /proizvodi. Nacrti ostaju dostupni samo odobrenim adminima.

Slike se trenutno unose kao URL; upload fajlova u Supabase Storage nije dio ove promjene. Bez slike prikazuje se neutralni placeholder. Ne dodaju se nasumične fotografije, izmišljeni opisi, proizvođači ili zalihe.

## Podaci i provjere

Primarni ključ je source- plus originalni ID iz programa. Barkod i šifra nisu jedinstveni ključevi. Čuva se originalni barkod kao tekst, uključujući neobične vrijednosti; postojeći duplikati se ne spajaju.

U pripremljenom uvozu 1.300 zapisa nema upotrebljivo popunjenog proizvođača, 137 ima barkod koji ne prolazi provjeru GTIN formata/kontrolne cifre, 27 zapisa dijeli 13 barkodova i 2 zapisa imaju cijenu 0. Oznake se mogu preklapati. Složeni barkodovi mogu imati drugi format i traže pregled, nisu automatski odbačeni.

Kolone izvora čuvaju se u source_data zajedno s nazivom fajla i brojem reda. Proizvodi nemaju dodijeljenu webshop kategoriju jer je GRUPE prazno u izvorima. Uvoz ne mijenja postojeće kategorije ni članke i ne prenosi ranije demo proizvode u novu tabelu.

Ponovno pokretanje istog SQL uvoza ne mijenja postojeće proizvode; čuva njihove uređene slike, opise, cijene i status. Ovo nije automatska sinhronizacija kasnijih cijena/lagera. imports/ je isključen iz Gita, javnog builda i izvornog download arhiva.

Admin učitava proizvode u API serijama od 500, uz prikaz po 8 u tabeli. Spremanje šalje samo izmijenjene proizvode. Kategorije, članci, hero i kontakt ostaju u store_catalog. Jedna transakcija i zajednička verzija sprječavaju tiho prepisivanje paralelnih izmjena.

## Provjereno lokalno

TypeScript, produkcijski build, kombinacije filtera i očuvanje izvornog ID-a/barkoda. Na privremenom PostgreSQL engineu provjereni su SQL setup, kompletan uvoz, ponovni uvoz, čuvanje dopunjenih slika, pristup nacrtima, zabrana neovlaštenog pisanja, objava i odbijanje zastarjelih izmjena. Prava u stvarnom Supabase projektu treba potvrditi nakon izvršavanja skripti.

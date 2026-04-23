# Teljes Kód Audit és Javítási Terv (javitanikene.md)

Az admin felület átvizsgálása alapján a következő problémákat azonosítottam. A "ráhúzott felület" érzés teljesen jogos: a Payload CMS egy nagyon erős, automatikus admin felület generátorral rendelkezik, de a jelenlegi kódban ezt a rendszert teljesen megkerülve, nulláról lettek újraírva a listázó és szerkesztő oldalak. Ez okozza a rengeteg váratlan hibát, a bejelentkezési hurkokat és a kód átláthatatlanságát.

## 1. Hitelesítési és Átirányítási Káosz (Auth & Redirect Loop)
* **Probléma**: A Payload CMS beépítetten, hibátlanul kezeli a beléptetést, a sütiket és a védett útvonalakat. Az egyedi `Sidebar.tsx` komponensünk (ami felülírja a gyári navigációt) azonban megpróbál okosabb lenni, és saját maga is folyamatosan ellenőrzi a felhasználót a háttérben. Ez a két rendszer (a Payload natív és a mi egyedi kódunk) "összeveszik", ami végtelen átirányítási hurkokat és indokolatlan kiléptetéseket okoz.
* **Megoldás**: A `Sidebar.tsx`-ből azonnal el kell távolítani a manuális jogosultság-ellenőrzést és átirányítási logikát. Ezt a feladatot teljes egészében a Payload magjára kell bízni. Ha a felhasználó egyedi kinézetű menüt szeretne, azt a `Sidebar` megtarthatja, de a logikát nem szabad felülírnia.

## 2. Egyedi Nézetek (Custom Views) vs. Beépített Payload Funkciók
* **Probléma**: A teljes admin felület (kategóriák, termékek, étlapok, felhasználók listázása és szerkesztése) egyedi React komponensekkel (`SlideEditView`, `CustomProducts`, stb.) lett "ráhúzva" a rendszerre a `payload.config.ts`-ben. Ezek az egyedi nézetek újra feltalálják a kereket: manuálisan kell leprogramozni a mentést, a képfeltöltést, a kapcsolatokat (relationships), ami rengeteg hibalehetőséget rejt (pl. a 403-as CORS hiba, amit korábban próbáltunk foltozgatni). A Payload natív felülete alapból tud mindent (drag-and-drop, validáció, keresés, lapozás, kapcsolatok kiválasztása), amit mi egyedi kóddal csak hibásan tudtunk leutánozni.
* **Megoldás**: El kell távolítani az egyedi nézeteket (`views` objektum a konfigurációból). Vissza kell térni a Payload gyönyörű és hibamentes natív felületéhez. A mezők elrendezését, a kategóriák közötti kapcsolatokat a sémákban (`collections/*.ts`) fogjuk testreszabni, nem pedig a UI újraírásával. A Payload natív felülete amúgy is nagyon letisztult.

## 3. Adatbázis sémák finomhangolása
* **Probléma**: Mivel visszaállunk a natív felületre, meg kell bizonyosodnunk róla, hogy a mezők (fields) ésszerűen, logikusan jelennek meg a szerkesztőkben. Pl. az "Étlap" (`menu-slides`) esetében a "Tételek" egy beépített "array" (tömb) mező, amit a Payload alapból tud drag-and-drop módon kezelni.
* **Megoldás**: Átnézzük a `Collections` fájlokat (`Categories.ts`, `Slides.ts`, `Products.ts`), és szükség esetén beállítjuk a Payload admin panel konfigurációit (pl. `admin: { position: 'sidebar' }`), hogy a natív szerkesztőfelület a lehető legtisztább legyen.

## 4. Felesleges Kódok Törlése (Cleanup)
* **Probléma**: A `components/Admin` mappa tele van a feleslegessé váló, karbantarthatatlan kódfájlokkal. A `next.config.ts` felesleges átirányításokat tartalmaz (`/admin` -> `/admin/custom-products`).
* **Megoldás**: Törölni kell a `components/Admin` mappát (kivéve a `Sidebar.tsx`-et, ha meg akarjuk tartani az egyedi ikonos bal oldali menüt, de még azt is érdemes megfontolni, hogy a Payload natív menüjét használjuk inkább, ami tökéletesen működik és támogatja a jogosultságokat). Töröljük a felesleges átirányításokat.

---

**Következő lépés**: Elolvasom ezt a tervet, és amint jóváhagyod az `implementation_plan.md`-t, azonnal nekilátok a "nagytakarításnak" és a kód visszarendezésének a letisztult, gyári Payload működésre.

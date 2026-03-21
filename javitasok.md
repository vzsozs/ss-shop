# Projekt Audit és Javítások

Ez a dokumentum tartalmazza a projekt átvilágítása során feltárt fejlesztési lehetőségeket, az eddig elvégzett javításokat és további javaslatokat a stabilitás és a felhasználói élmény javítása érdekében.

## 1. Elvégzett Javítások

### Admin UI: Panelmagasságok szinkronizálása
*   **Hiba**: A kategória szerkesztő nézetben (`CategoryEditView`) a bal oldali űrlap és a jobb oldali képfeltöltő kártya magassága eltért, ami vizuálisan zavaró volt.
*   **Javítás**: Az `AdminStyles.scss` fájlban a `.edit-form-content` grid elemét `align-items: stretch` tulajdonsággal láttam el, így a panelek most már azonos magasságúak.

### Adatkezelés: Magyar ékezetes Slug generálás
*   **Hiba**: A termékek slug generáló függvénye törölte a magyar ékezetes karaktereket (pl. "á" -> ""), ami értelmetlen URL-eket eredményezett (pl. "Sajttál" -> "sjttl").
*   **Javítás**: Beépítettem egy transzliterációs (átírási) logikát a `Products.ts` gyűjteménybe, amely megfelelően kezeli a magyar karaktereket (pl. "á" -> "a", "ő" -> "o").

## 2. Kritikus Javaslatok (Refaktorálás)

### SEO és Teljesítmény: Root Layout optimalizálás
*   **Probléma**: A `app/(site)/layout.tsx` jelenleg `"use client"` jelöléssel rendelkezik. Ez azt jelenti, hogy a teljes weboldal kliens-oldali renderelésre kényszerül, ami rontja az SEO-t és a kezdeti betöltési sebességet.
*   **Javaslat**: A root layout-ot vissza kell állítani Server Component-re, és csak a menü/oldalsáv interakcióit kezelő logikát kell külön Client Componentbe (pl. egy `LayoutProvider`-be) kiszervezni.

### Típusbiztonság (TypeScript)
*   **Probléma**: Több helyen (pl. `CategoryEditView.tsx`, `lib/content.ts`) a `any` vagy `Record<string, any>` típusokat használja a kód, ami kockázatos és csökkenti a fejlesztői élményt.
*   **Javaslat**: A Payload által generált típusokat (`types/payload-types.ts`) következetesen kell használni a frontend lekérések során is.

## 3. Felhasználói Élmény (UX) az Admin felületen

### Visszajelzések finomítása
*   **Javaslat**: A jelenlegi `alert()` alapú visszajelzések helyett javasolt egy modernebb "Toast" értesítési rendszer (pl. `sonner` vagy a Payload beépített `Toast` komponense) használata a sikeres mentéseknél.

### Képkezelési automatizmusok
*   **Javaslat**: Érdemes lenne egy központi `MediaImage` komponenst létrehozni, amely automatikusan kezeli a hiányzó képeket (placeholder), és a Payload API path-jait (`/api/media/file/` -> `/media/`) transzparensen fordítja le a Next.js számára.

---
**Audit állapota**: A kritikus UI és adatkezelési bugok javítva. A szerkezeti refaktorálás (Layout) várakozik.

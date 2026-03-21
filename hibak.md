# Projekthibák - Állapotjelentés (hibak.md)

| ID | Kategória | Fájl | Hiba leírása | Állapot |
|---|---|---|---|---|
| ... | ... | ... | ... | ... |
| 16 | DB | `payload.db` | SQLITE_ERROR: index already exists a slides táblánál. | ✅ JAVÍTVA (Renamed to menu-slides) |
| 17 | UI | `SlideEditView.tsx`| A "Főoldalon megjelenik" kapcsoló egységesítése. | ✅ JAVÍTVA |
| 18 | DB | `payload.db` | no such column: menu_slides_id hiba a lock táblánál. | ✅ JAVÍTVA (Lock tábla törölve, újragenerálva) |

**Megjegyzés:**
A legbiztonságosabb állapotba hoztam az adatbázist azzal, hogy a problémás lock táblát és az összes félresikerült migrációs maradványt kitöröltem. Most már tiszta lappal indul a Payload.

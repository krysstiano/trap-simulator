# Trap Simulator — desktop (Electron) + wydawanie aktualizacji

Aplikacja desktop opakowuje grę (`../index.html`) w natywne okno (.exe).
Gracze pobierają **instalator** ze strony / GitHub Releases, a gra **sama się aktualizuje**
(electron-updater sprawdza GitHub Releases przy starcie).

## Repo / config
- Auto-update czyta release z repo zdefiniowanego w `package.json` → `build.publish`:
  obecnie **`krysstiano/trap-simulator`**. Jeśli repo ma inną nazwę — zmień tam `owner`/`repo`
  ORAZ linki w `../website/index.html` (8 sztuk, szukaj `krysstiano/trap-simulator`).

## Build lokalny (instalator .exe)
```
CSC_IDENTITY_AUTO_DISCOVERY=false  npm --prefix electron run dist
```
> Uwaga (Windows): archiwum `winCodeSign` electron-buildera zawiera macowe symlinki, ktorych
> Windows nie tworzy bez uprawnien. Jesli build padnie z `Cannot create symbolic link`:
> wlacz **Tryb Dewelopera** (Ustawienia → System → Dla deweloperow) i powtorz — ALBO rozpakuj
> raz archiwum bez symlinkow:
> `7za x <cache>\winCodeSign\*.7z -o<cache>\winCodeSign\winCodeSign-2.6.0 -xr!*.dylib -y`
> (cache: `%LOCALAPPDATA%\electron-builder\Cache`). **GitHub Actions (CI) dziala bez tego** —
> runner ma uprawnienia do symlinkow. Dzieki temu ikona jest osadzana w .exe (rcedit).
Powstaje w `electron/dist/`:
- `Trap Simulator Setup <wersja>.exe`  ← instalator dla graczy
- `Trap Simulator Setup <wersja>.exe.blockmap`  ← delta-aktualizacje
- `latest.yml`  ← FEED auto-update (KONIECZNY w Release)

## Gdzie wrzucać aktualizacje (żeby gracze mieli auto-update)
Pliki idą do **GitHub Releases** repo `krysstiano/trap-simulator`. Dwie drogi:

### A) Automatycznie (zalecane) — GitHub Actions
Jednorazowo: utwórz repo na GitHub i wypchnij projekt. Potem każde wydanie:
```
# 1. podnieś wersję w electron/package.json (np. 2.3.35) + dodaj wpis w PATCH_NOTES
# 2. commit
git add -A && git commit -m "v2.3.35"
# 3. tag = wersja z prefiksem v + push
git tag v2.3.35
git push origin main --tags
```
Workflow `.github/workflows/release.yml` zbuduje instalator na czystym Windowsie i sam
opublikuje Release z `.exe` + `latest.yml`. Gracze dostaną aktualizację automatycznie.

### B) Ręcznie
1. `npm --prefix electron run dist`
2. Na GitHub → Releases → "Draft a new release" → tag `v2.3.35`
3. Wgraj 3 pliki z `electron/dist/`: `*.exe`, `*.exe.blockmap`, `latest.yml`
4. Publish. Gotowe.

## Strona z pobieraniem (website/)
Statyczna strona `../website/`. Hosting: **Cloudflare Pages** (`trap-simulator.pages.dev`).
Auto-deploy: każdy push na main → GitHub Actions `.github/workflows/deploy-website.yml` → publikuje sam
(token w GitHub Secrets). Bez ręcznego deployu.

Przyciski "Pobierz" linkują do `releases/latest` repo → zawsze najnowszy instalator.
```

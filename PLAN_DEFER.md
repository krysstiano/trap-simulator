# Plan DEFER — odłożone do realizacji PO skończeniu PLAN_SESJA.md

⚠️ **Te punkty wracają do realizacji DOPIERO gdy ukończę wszystkie zadania z `PLAN_SESJA.md`.**
⚠️ **Po skończeniu PLAN_SESJA.md mam OBOWIĄZKOWO przypomnieć użytkownikowi o tych punktach.**

---

## D1. Beat Sequencer — tryb z podpowiedziami + custom dźwięki

> "Sequencer musi działać kompletnie inaczej, gracz ma mieć wybór: albo tworzy bit sam albo dostaje 'podpowiedzi' które mają podawać sugerowany bpm i podświetlać kwadraty na którch gracz powinien umiejscowić dźwięk. Dźwięki wgramy customowe, pamiętaj o tym żeby o tym mi przypominać."

**Wymagania:**
1. **Wybór trybu na starcie sequencera:**
   - Tryb A: Tworzysz bit sam (dotychczasowy, ale przebudowany wg punktu 29 z PLAN_SESJA)
   - Tryb B: Z podpowiedziami — sequencer sugeruje BPM i podświetla kwadraty na siatce gdzie gracz powinien umieścić dany dźwięk

2. **Tryb B (podpowiedzi):**
   - sugerowany BPM ustawiony automatycznie / pokazany jako "rekomendowany"
   - podświetlone kwadraty na ścieżkach każdego dźwięku (kick, snare, hat, 808, clap, open hat) — gracz wie gdzie kliknąć żeby ułożyć "dobry" bit
   - po ukończeniu układania bit brzmi spójnie/dobrze

3. **Custom dźwięki — PRZYPOMNIENIE:**
   - Użytkownik wgra własne sample (kick, snare, hat, 808, clap, open hat itp.)
   - Przed implementacją zapytać: gdzie sample, w jakim formacie (MP3/WAV/OGG), pod jakimi nazwami plików
   - Zaktualizować ścieżki w sequencerze do customowych dźwięków

# Fall season reel: "How old is your kid?" (all ages, with voiceover)

**Goal:** book the full fall season tonight (first class is tomorrow morning), not a drop-in, for **every age from 12 months to 12 years**.
**File:** `out/esu-fall-season-vo.mp4` (1080×1920, 30 fps, 40.2 s, H.264 + AAC, −14 LUFS). `out/esu-fall-season-vo-IG.mp4` is the upload copy.
**Cover:** `out/cover-esu-fall-season-vo.jpg` (frame 96: the poll with all three ages ticked).
**Audio stem:** `out/esu-fall-season-vo_VO+SFX.wav` (the reel's full soundtrack: voiceover + SFX, mastered, 48 kHz). Drop it on the timeline with your music underneath.
**Composition:** `ESU-GluedToYourLeg` (`src/compositions/ESU_GluedToYourLeg.tsx`; the ID stayed the same, only the hook changed).

**What changed in this version**
- The "glued to your leg" hook only spoke to toddler parents, so it's gone (the Pixar OmniFlash prompt in `GLUED_HOOK_OMNIFLASH.md` is no longer needed). The new hook asks every parent their kid's age and answers "all of them".
- **Voiceover added.** It runs the whole reel, and every cut and text reveal is timed to the spoken words.
- **No music.** The music bed and the clips' field audio are removed, so a custom track can go on top. The audio is the VO plus sound effects only, mastered to −14 LUFS. Keep the music around −20 to −24 LUFS under the voice.
- The body (again → turn → same coach → split → price → CTA → EARLYBIRD25 → end) is the same, just re-timed to the narration. FALL15 is still out, and EARLYBIRD25 now runs 7.3 s.
- Since the reel now speaks to toddler parents too, the price card adds the toddler prices, and the end card carries "AGES 12 MONTHS – 12 YEARS".

## Timeline
| Time | Picture | On screen | Voiceover |
|---|---|---|---|
| 0–4.9 s | **Hook.** Referee whistle on frame 0. Real footage cuts youngest → oldest (group, toddler, 5-year-old on the ladder, older kid on the ball, then the whole group with the coach). An Instagram-style poll card: a finger taps **1–3 YRS**, **4–7 YRS**, **8–12 YRS** on each spoken age, then all three light up yellow with ticks, a red **ALL OF THEM** stamp slams in (screen shake), and **12 MONTHS TO 12 YEARS** appears | HOW OLD IS YOUR **KID?** (from frame 0) · TAP YOUR KID'S AGE · ALL OF THEM · 12 MONTHS TO 12 YEARS · Here's what holds them **all** back. ↓ | "How old is your kid? One? Five? Twelve? Here's what holds them all back." |
| 4.9–7.6 s | Muted grade: coach + new kids, then a kid alone on the ladder that **rewinds** | New coach. New kids. / Start over. **Again.** | "New coach. New kids. Start over… again." |
| 7.6–10.9 s | White flash, full colour. A toddler hops onto the field **ahead of her parents**, then a run with the ball | A FEW WEEKS LATER: / THEY RUN / **AHEAD** OF YOU. | "But a few weeks later? They run ahead of you!" |
| 10.9–14.6 s | Coach sitting with the group (card) + 8 identical WEEK 1–8 tiles | What changed? / THE SAME COACH. / **EVERY WEEK.** | "What changed? The same coach. Every single week." |
| 14.6–19.6 s | Split: kid alone (DROP-IN, greys out) vs the group (SEASON, yellow frame) | Drop-in: a new start each time. / Season: same coach, same group, 8 weeks. | (same words) |
| 19.6–25.1 s | Navy price card | SEASON: $32 A CLASS. / DROP-IN: $37.50, AND $39 FROM MONDAY. / **SAVE $56** / *Prices shown for ages 4–12. Toddlers (12–24 mo): $29 a class vs. $36 drop-in from Monday.* | "Per class, the season costs less. Drop-ins go up Monday. Save fifty-six dollars." |
| 25.1–28.9 s | Boy hugging the ball + red CTA bar | 8 WEEKS · SAME COACH · SAME GROUP / FIRST CLASS IS TOMORROW MORNING. / **BOOK TONIGHT.** / LINK IN BIO. | "First class is tomorrow morning. Book tonight. Link in bio." |
| 28.9–36.2 s | Navy card with floating photo prints | ALSO ENDING SUNDAY: / **25% OFF** / Thanksgiving and Winter Camps. / **EARLYBIRD25** (typed as it's spoken) / ENDS SUNDAY / Expires Sunday, October 4, 2026 at 11:59 PM PT. | "Also ending Sunday: twenty-five percent off Thanksgiving and Winter Camps with code early bird twenty-five." |
| 36.2–40.2 s | Logo lockup | ESU crest · BOOK TONIGHT · LINK IN BIO · **AGES 12 MONTHS – 12 YEARS** · Proudly sponsored by Wateria | "Euro Soccer USA. Twelve months to twelve years." |

ESU crest and the Wateria "Official Sponsor" badge sit in the top corners throughout.

**Sound effects:** whistle (frame 0), a pop + click on each age tap, a rising xylophone when all ages light up, boom + kick on ALL OF THEM, whoosh out of the hook, clicks and a tape-stop rewind on "again", a whoosh into the turn, ticks for the 8 weeks, a ding when SEASON is picked, a ta-da on SAVE $56, typing for the coupon, and a boom on the logo.

## Voiceover
Generated locally with Kokoro TTS (voice `af_heart`, 1.12× speed). It's a synthetic voice, so treat it as a guide track if you'd rather record a real one.
- Script: `scripts/script_glued.json` (`text` is what shows in the timing file; `say` is how it's pronounced).
- Rebuild: `SCRIPT=scripts/script_glued.json OUT_WAV=public/audio/vo_glued.wav OUT_JSON=src/timeline_glued.json KOKORO_DIR=<kokoro model dir> python3 scripts/make_vo.py`. The video re-times itself from `src/timeline_glued.json`.
- **To record a human VO instead:** read the script at the same pace and replace `public/audio/vo_glued.wav`. If the timing shifts, update the line `start`/`end` and word times in `src/timeline_glued.json` (or regenerate them) and re-render.

## Footage (all real Weekend Academy, from the ESU Google Drive)
Clips are kept out of git (`public/footage/glued/`). To re-render on another machine, download these from Drive and run the transcode step below.

| Used as | Drive file | Notes |
|---|---|---|
| `group_play.mp4` (hook opener, SEASON) | IMG_2321.MOV | group play, vertical |
| `run_ahead.mp4` (hook "1–3", the payoff) | IMG_3609.MOV | toddler hops onto the field ahead of her parents |
| `alone_ladder.mp4` (hook "4–7", start over, DROP-IN) | IMG_3588.MOV | one kid on the agility ladder |
| `run_ball.mp4` (hook "8–12", turn) | IMG_3635.MOV | older kid running with the ball |
| `coach_circle.mp4` (hook "all of them", same coach) | 1000034229.MP4 | coach sitting with the group |
| `kids_meet.mp4` (new coach / new kids) | IMG_3620.MOV | coach (Wateria shirt) + two kids meeting |
| `ball_smile.mp4` (CTA) | IMG_3633.MOV | boy hugging the ball; only 0.5–2.3 s is used (the camera pans to a coach after that) |

Transcode: `ffmpeg -i SRC -map 0:v:0 -map 0:a:0? -vf "fps=30,format=yuv420p" -c:v libx264 -crf 16 -c:a aac OUT.mp4`. Stills for the photo prints come from the same clips (`public/footage/glued/stills/`).

**Opt-out screening.** Every clip was checked against the DO-NOT-USE note in `ESU_Footage_Content_Planner_Sep23.md` ("pink pinnie over black tee, chain-link fence"). Three were left out because they came close: IMG_3655, IMG_3660, and the end of aaa48657. Also not used: the captioned school-program photos and the non-Academy venue clips (brief: Weekend Academy only), plus the League clips (IMG_029x/032x).
**Before boosting:** confirm a release is on file for the identifiable kids in IMG_3609, IMG_3620, IMG_3633, IMG_3588 and IMG_3635.

Render: `COMP=ESU-GluedToYourLeg NAME=esu-fall-season-vo COVER=96 bash scripts/render.sh`

## Caption, hashtags and B-roll
The final caption (with exactly 5 hashtags: Instagram's per-post cap), pinned comment, a short TikTok/Facebook version and the OmniFlash B-roll prompts are in `FALL_SEASON_BROLL_OMNIFLASH.md`.

## Numbers check
| | Total | Per class |
|---|---|---|
| Season, ages 4–12 | $256 | $32.00 |
| 8 drop-ins today | $300 | $37.50 |
| 8 drop-ins from Monday | $312 | $39.00 |
| Season, toddlers | $232 | $29.00 |
| 8 toddler drop-ins from Monday | $288 | $36.00 |

Season vs. 8 Monday drop-ins: $312 − $256 = **$56**, and for toddlers $288 − $232 = **$56**, so "Save $56" holds for every age.
"First class is tomorrow morning" is true for a post that goes out **Friday, Oct 2**. October 4, 2026 is a Sunday.

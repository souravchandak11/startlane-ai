# "Glued to your leg": fall season reel (final)

**Goal:** book the full fall season tonight (first class is tomorrow morning), not a drop-in.
**File:** `out/esu-glued-to-your-leg.mp4` (1080×1920, 30 fps, 32 s, H.264 + AAC, −14 LUFS)
**Composition:** `ESU-GluedToYourLeg` (`src/compositions/ESU_GluedToYourLeg.tsx`)
**Changes from the brief:** FALL15 removed (so parents who already paid for the season don't ask for refunds). EARLYBIRD25 now runs 4.5 s instead of 2 s.

## Timeline
| Time | Picture | On screen |
|---|---|---|
| 0–3 s | **Animated hook:** a kid glued to a parent's leg (glue bottle, glue drips). The parent tries to step twice, and the kid comes along. A stopwatch races 00:00 → 20:00 | EVERY NEW THING, / THE FIRST **20 MINUTES** / LOOK LIKE THIS. (on screen from frame 0) |
| 3–5.5 s | Real footage, muted grade: coach + new kids, then a kid alone on the ladder that **rewinds** | New coach. New kids. / Start over. **Again.** |
| 5.5–9.5 s | White flash, full colour, music lifts. A girl hops onto the field **ahead of the parents**, then a run with the ball | A FEW WEEKS LATER: / THEY RUN / **AHEAD** OF YOU. |
| 9.5–13.5 s | Coach sitting with the group (card) + 8 identical "WEEK 1–8" tiles ticking on | What changed? / THE SAME COACH. / **EVERY WEEK.** |
| 13.5–18 s | Split: kid alone (DROP-IN, greys out) vs the group (SEASON, yellow frame) | Drop-in: a new start each time. / Season: same coach, same group, 8 weeks. |
| 18–22 s | Navy price card | SEASON: $32 A CLASS. / DROP-IN: $37.50, AND $39 FROM MONDAY. / **SAVE $56** (8 weeks: $256 season vs. $312 in drop-ins) |
| 22–26 s | Boy hugging the ball, smiling + red CTA bar | 8 WEEKS · SAME COACH · SAME GROUP / FIRST CLASS IS TOMORROW MORNING. / **BOOK TONIGHT.** / LINK IN BIO. |
| 26–30.5 s | Navy card with floating photo prints of the real footage | ALSO ENDING SUNDAY: / **25% OFF** / Thanksgiving and Winter Camps. / **EARLYBIRD25** (typed into a coupon) / ENDS SUNDAY / Expires Sunday, October 4, 2026 at 11:59 PM PT. |
| 30.5–32 s | Logo lockup | ESU crest · BOOK TONIGHT · LINK IN BIO · Proudly sponsored by Wateria |

ESU crest and Wateria "Official Sponsor" in the top corners throughout.
**Sound:** a light procedural track (`scripts/make_music_glued.py`) that's hesitant under the stopwatch and lifts on the 5.5 s turn, with the clips' field audio underneath. The audio hook is the racing stopwatch ticks plus a squeak/boing each time the parent tries to step.

## Footage (all real Weekend Academy, from the ESU Google Drive)
Clips are kept out of git (`public/footage/glued/`). To re-render on another machine, download these from Drive and run the transcode step below.

| Used as | Drive file | Notes |
|---|---|---|
| `kids_meet.mp4` (new coach / new kids) | IMG_3620.MOV | coach (Wateria shirt) + two kids meeting |
| `alone_ladder.mp4` (start over / DROP-IN) | IMG_3588.MOV | one kid on the agility ladder |
| `run_ahead.mp4` (the payoff) | IMG_3609.MOV | girl hops onto the field ahead of the parents |
| `run_ball.mp4` | IMG_3635.MOV | run with the ball |
| `coach_circle.mp4` (same coach) | 1000034229.MP4 | coach sitting with the group |
| `group_play.mp4` (SEASON) | IMG_2321.MOV | group play, vertical |
| `ball_smile.mp4` (CTA) | IMG_3633.MOV | boy hugging the ball; only 0.5–2.3 s is used (the camera pans to a coach after that) |

Transcode: `ffmpeg -i SRC -map 0:v:0 -map 0:a:0? -vf "fps=30,format=yuv420p" -c:v libx264 -crf 16 -c:a aac OUT.mp4`. Stills for the photo prints come from the same clips (`public/footage/glued/stills/`).

**Opt-out screening.** Every clip was checked against the DO-NOT-USE note in `ESU_Footage_Content_Planner_Sep23.md` ("pink pinnie over black tee, chain-link fence"). Three were left out because they came close: IMG_3655, IMG_3660, and the end of aaa48657. Also not used: the captioned school-program photos and the non-Academy venue clips (brief: Weekend Academy only), plus the League clips (IMG_029x/032x).
**Before boosting:** confirm a release is on file for the identifiable kids in IMG_3609, IMG_3620, IMG_3633 and IMG_3588.

Render: `COMP=ESU-GluedToYourLeg NAME=esu-glued-to-your-leg COVER=45 bash scripts/render.sh`

## Caption (paste as-is)
> Every new thing, the first 20 minutes look like this. 🫶
> A few weeks later? They run ahead of you. ⚽
>
> What changed: the same coach and the same group, every single week. That's why the Weekend Academy is a season, not a string of drop-ins.
>
> 🗓️ Fall season: 8 weeks, ages 4–12, first class TOMORROW morning
> 📍 The Sports Park, Playa Vista
> 💲 Season $32 a class vs. $37.50 per drop-in ($39 from Monday). That's $56 less than 8 drop-ins at Monday's price.
>
> Book tonight. Link in bio 👆
>
> 🦃❄️ Also ending Sunday: code **EARLYBIRD25** = 25% off Thanksgiving & Winter Camps. Expires Sunday, Oct 4, 2026 at 11:59 PM PT.
>
> #EuroSoccerUSA #WeekendAcademy #KidsSoccer #YouthSoccer #ShyKids #LAmoms #PlayaVista #WestLA #LAParents #FallSeason

**Pinned comment (for toddler parents):** "Little one aged 12–24 months? The toddler season is $29 a class vs. a $36 drop-in from Monday. 👶⚽"

## Numbers check
| | Total | Per class |
|---|---|---|
| Season, full price | $256 | $32.00 |
| 8 drop-ins today | $300 | $37.50 |
| 8 drop-ins from Monday | $312 | $39.00 |

Season vs. 8 Monday drop-ins: $312 − $256 = **$56**. Toddlers: $232 ÷ 8 = $29 a class, vs. $36 from Monday.
"First class is tomorrow morning" is true for a post that goes out **Friday, Oct 2**. October 4, 2026 is a Sunday.

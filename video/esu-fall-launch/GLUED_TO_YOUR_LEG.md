# "Glued to your leg": fall season reel

**Goal:** book the full fall season this weekend, not a drop-in.
**Composition:** `ESU-GluedToYourLeg` (`src/compositions/ESU_GluedToYourLeg.tsx`), 32 s, 1080×1920, 30 fps.
**Status:** text, cards, timing, music and end card are final. The seven picture slots show labelled
placeholders until the real Weekend Academy clips are added. Preview: `out/esu-glued-to-your-leg-PREVIEW.mp4`.

## Timeline (built exactly to the brief)
| Time | Picture | On screen |
|---|---|---|
| 0–3 s | Clip 1, muted colour | EVERY NEW THING, / THE FIRST **20 MINUTES** / LOOK LIKE THIS. (up from frame 0) |
| 3–6 s | Clip 2, muted colour | New coach. New kids. / Start over. **Again.** |
| 6–10 s | Clip 3, white flash, full colour, music lifts | A FEW WEEKS LATER: / THEY RUN / **AHEAD** OF YOU. |
| 10–14 s | Clip 4 | What changed? / THE SAME COACH. / **EVERY WEEK.** |
| 14–19 s | Split: clip 5 left, clip 6 right | DROP-IN (red) vs SEASON (yellow). "Drop-in: a new start each time." / "Season: same coach, same group, 8 weeks." The SEASON side lights up and DROP-IN greys out at 17.5 s |
| 19–23 s | Navy price card | SEASON: $32 A CLASS. / DROP-IN: $37.50 (counts up from $32), / AND $39 FROM MONDAY. |
| 23–27 s | Navy card, yellow dashed coupon | **FALL15** typed into the coupon / = 15% OFF THE FULL SEASON. / ~~$32~~ **$27.20** a class. / Expires Sunday, October 4, 2026 at 11:59 PM PT. |
| 27–30 s | Clip 7 + red CTA bar | FIRST CLASS IS TOMORROW MORNING. / **BOOK TONIGHT.** / LINK IN BIO. ↑ |
| 30–32 s | Small navy end card over the blurred last frame | ESU crest · Also ending Sunday: · **EARLYBIRD25** · 25% off Thanksgiving and Winter Camps. · Expires Sunday, October 4, 2026 at 11:59 PM PT. |

Type: Oswald uppercase for headlines, Montserrat for the sentence-case lines. Colours: ESU navy, red and yellow.
The ESU crest and Wateria "Official Sponsor" badge sit in the top corners, matching the other reels.
Sound: a light, procedural track (`scripts/make_music_glued.py`) that starts hesitant and lifts on the 6 s cut.
The clips' own field audio plays underneath, and the master is −14 LUFS.

## Footage needed (real Weekend Academy only: no League games, no AI kids)
Name each file with its slot word and drop it in `public/footage/glued/`. Any format works (mp4, mov).

| # | File name contains | Shot | Length to send |
|---|---|---|---|
| 1 | `leg` | Kid holding a parent's leg or hand at the edge of the field | 4 s+ |
| 2 | `watch` | **Same kid** watching the others, not joining | 4 s+ |
| 3 | `run` | Kid running onto the field ahead of the parent. **The payoff: send the clearest one you have** | 5 s+ |
| 4 | `coach` | Coach crouched at the kid's level: high five or fist bump | 5 s+ |
| 5 | `alone` | One kid on their own (DROP-IN side) | 6 s+ |
| 6 | `group` | The group together with the coach (SEASON side) | 6 s+ |
| 7 | `ball` | Kid smiling with the ball, ideally with the face in the top half of the frame (the CTA bar covers the bottom) | 4 s+ |

- Vertical is best. Horizontal also works: the edit crops to the centre, and `src/glued/cuts.json` sets the trim (`in`, in seconds) and framing (`focus`) for each slot.
- Leave the camera's own audio on. Field sound is part of the mix.
- A clip that's a little short is slowed (down to 0.5×) or held on its last frame, so the timing never breaks.
- Only use kids whose parents have signed a photo/video release. This runs as a paid ad.

Then: `COMP=ESU-GluedToYourLeg NAME=esu-glued-to-your-leg COVER=45 bash scripts/render.sh`

## Caption (paste as-is)
> Every new thing, the first 20 minutes look like this. 🫶
> A few weeks later? They run ahead of you. ⚽
>
> What changed: the same coach and the same group, every single week. That's why the Weekend Academy is a season, not a string of drop-ins.
>
> 🗓️ Fall season: 8 weeks, ages 4–12, first class TOMORROW morning
> 📍 The Sports Park, Playa Vista
> 💲 Season $32 a class vs. $37.50 per drop-in ($39 from Monday)
> 🎟️ Code **FALL15** = 15% off the full season → $27.20 a class, $94.40 less than 8 drop-ins at Monday's price
> ⏰ Expires Sunday, Oct 4, 2026 at 11:59 PM PT
>
> Book tonight. Link in bio 👆
>
> Also ending Sunday: **EARLYBIRD25** = 25% off Thanksgiving & Winter Camps.
>
> #EuroSoccerUSA #WeekendAcademy #KidsSoccer #YouthSoccer #LAmoms #PlayaVista #WestLA #LAParents #FallSeason

**Pinned comment (for toddler parents):** "Little one aged 12–24 months? The toddler season is $29 a class, or $24.65 with FALL15, vs. a $36 drop-in from Monday. 👶⚽"

## Numbers check (from the brief, all verified)
| | Total | Per class |
|---|---|---|
| Season, full price | $256 | $32.00 |
| Season with FALL15 (15% off) | $217.60 | $27.20 |
| 8 drop-ins today | $300 | $37.50 |
| 8 drop-ins from Monday | $312 | $39.00 |

Season with FALL15 vs. 8 Monday drop-ins: $312 − $217.60 = **$94.40 saved**.
Toddlers: $232 season = $29 a class, × 0.85 = **$24.65** with FALL15, against a $36 drop-in from Monday.
October 4, 2026 is a Sunday. "First class is tomorrow morning" is true only if the reel goes out on **Friday, Oct 2**.

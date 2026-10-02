# Mommy, Daddy & Me: retro documentary cut (Denver + real ESU footage + OmniFlash)

This is the plan for a second version of the Mommy, Daddy & Me video, edited in the
**Metro Media House retro documentary style**. It keeps the same story and the same 47-second
timeline as the animated cut (`ESU-MommyDaddyMe`), but the picture becomes:

1. **Denver on camera** (talking head) for the hook, the introduction, the jokes and the call to action.
2. **Real ESU footage** shot at this weekend's first classes (Sat Oct 3 / Sun Oct 4, 10:15 AM, The Sports Park).
3. **OmniFlash clips** for the shots that are hard to film for real (the bored Saturday at home and at the playground), and as stand-ins until the real footage arrives.
4. **MMH retro graphics** on top: lower-case captions, huge italic-serif emphasis, black and white for the pain, colour returning on the goal, photo prints on grey paper, white pop-up fact cards, glitch frames and a logo card on black.

Keep the animated cut as its own ad. Running both (animated vs retro documentary) is a clean A/B test.

**Contents**
1. How the Metro Media House reels are made
2. The hybrid edit, beat by beat
3. Denver's talking head: script, shoot setup, edit treatment
4. Real ESU B-roll shot list for this weekend
5. OmniFlash prompts (5 × 10 s, no typography)
6. Hand-off: how to send the footage for the edit

---

## 1. How the Metro Media House reels are made

These figures come from the 11 @metromedia.house reels measured for the Fall Academy reel
(see `README.md` §1). Instagram is blocked from this build environment, so no new reels were
pulled today.

### What the "retro" look actually is
| Ingredient | What they do | How to build it (After Effects / Premiere / CapCut, or our Remotion code) |
|---|---|---|
| **Black & white with one accent** | 8–39% of frames are black and white. The rest is warm, red-leaning colour. About 90% of each frame is neutral (near-black `#07080a`, paper grey `#e5e2e6`), with a single saturated accent. | Desaturate, then an S-curve with crushed blacks and slightly lifted mids. Warm shots: push orange/red, pull teal out of the shadows. |
| **35 mm film texture** | Grain on every frame, soft halation on highlights and a light vignette. | Grain overlay (a 35 mm scan) on Overlay/Soft Light at 15–30%. Halation is a red-orange glow on the brightest areas (a luma key plus blur). Vignette at about −15. |
| **Stepped, "held" motion** | 5–26% of frames are held. Movement looks choppy, like old film. Used in the pain sections. | Posterize Time at 12 fps (AE/Premiere effect). In CapCut, lower the clip frame rate. In Remotion it's `<Freeze>` stepping, already in `ESU_Type.tsx` (`Stepped`). |
| **Slow push-ins and "bumps"** | Nearly every shot creeps from 100% to about 108%. There are tiny 2–4 frame scale bumps on words. | Two scale keyframes with easing. Bumps are 100 → 102 → 100% over 6 frames. |
| **Crop cuts** | One clip becomes 3–4 "shots" by punching in to 120–150% on new words. A new visual every 1–3 spoken words; the median shot is **0.52 s**. | Duplicate the clip on the timeline, scale each copy differently, cut on VO words. |
| **Paper stage + prints** | Footage shrinks from full-bleed into a **photo print with a white border** on pale grey paper, slightly rotated with a soft shadow. Prints also sit inside open books, or float in a cloud with the back row blurred. | Paper texture background. Clip with a 14–20 px white stroke plus a drop shadow; animate scale 100% → 40% and rotation 0° → −4°. |
| **Type** | Captions are white, centred, **lower-case**, about 5% of frame height, appearing 1–4 words at a time. Key words jump to a **huge italic serif** (12–30% of frame height). Full-screen type cards alternate black-on-white and white-on-black. | Instrument Serif Italic (already in `public/fonts`). Word-by-word caption fades keyed to the VO. |
| **Evidence graphics** | Screenshot-style cards: news headlines wiped with a **yellow highlighter**, stacked **white pop-up cards**, UI captures. | A white rounded card with a drop shadow that pops in at about 105% and settles; the highlighter is a yellow rectangle wiping left to right behind the text. |
| **Transitions** | Mostly hard cuts. Every 8–12 s there is a 2–4 frame **glitch** (invert/difference + RGB split + a burst of static sound) or a white flash. | `GlitchCut`, `InvertFlash` and `Flash` in our component library. |
| **Sound** | One continuous, compressed bed (loudness range only 2–5 LU) at **−14 LUFS**. Ticks and whooshes on cuts, a riser into the reveal, a **bass thump on the logo**. | Same pipeline as both ESU videos: ducked bed, SFX kit, two-pass loudnorm. |
| **Structure** | Contrarian or mystery hook on frame 0 → setup → a three-part list → payoff → a call to action tied back to the hook → **logo card on black**. | Our script already follows this: the hook, "same / same / same", "kick / goal / high five", then "book their first class". |

### Their production order (what to copy)
1. **Script and voice first.** One VO track, edited tight with no breaths. The edit is cut to the VO's phrases, not to the music.
2. **Rough cut on words.** Lay a new visual roughly every 1–3 spoken words; use crop cuts to multiply shots.
3. **Grade.** Black and white for the problem, warm colour for the solution. The switch happens on the emotional turn (for us, the first goal).
4. **Texture pass.** Grain, halation, vignette and stepped frames.
5. **Type pass.** Captions, serif emphasis words and type cards.
6. **Graphics pass.** Prints on paper, pull-backs, pop-up cards, highlighter.
7. **Sound pass.** Bed, cut SFX, riser, logo thump, master to −14 LUFS.

**One adaptation:** MMH never shows a talking head. We add Denver because a real coach's
face builds more trust with parents of toddlers than any stock-style footage. To keep the look,
Denver's shots get the same treatment: crop cuts, jump cuts, black and white in the pain half,
and pull-backs into prints.

---

## 2. The hybrid edit, beat by beat

Timings are from the current voiceover. Once Denver records, the edit re-times to Denver's
read automatically, because every cut is keyed to spoken words.
**OC** = Denver on camera · **VO** = Denver's voice over B-roll · **R#** = real-footage shot (§4) · **O#** = OmniFlash shot (§5).

| Time | Line | Picture (first choice → fallback) | Retro treatment |
|---|---|---|---|
| 0.0–1.2 | *(bed + three ball bounces)* | **R1** a ball rolls at the lens and a tiny sneaker taps it → O1 0–1.2 s | Colour. Caption from frame 0: "parents of 1-year-olds" |
| 1.2–3.0 | "Wait… your 1-year-old can play soccer?" | **OC** Denver holding a mini ball, eyebrows up | Freeze-frame with a scratch on "wait…" plus a huge serif *wait…* card. Crop punch-in on "1-year-old"; *soccer?* in serif |
| 3.3–4.7 | "Yep. And you get to play too." | OC → **R3** parent and toddler kicking together | Jump cut on "Yep." *too* in serif |
| 5.0–9.1 | "Because let's be honest… same playground, same swings, same Saturday." | **O1** 5–9 s (playground) → or a staff family filmed at a playground | **Black & white, stepped 12 fps.** Each "same" shows the *same shot again*, pulled back into a print that stacks on grey paper. Type card: *same.* |
| 9.2–11.6 | "All that toddler energy… and nowhere to put it." | **O1/O2** toddler laps around the sofa, climbing cushions | B&W stepped. Cuts every 0.4 s, glitch on "nowhere" |
| 11.9–13.4 | "And they're only this little once." | **R18** tiny hand gripping a parent's finger → O2 | B&W with a warm tint, one slow push, no cuts. *this little once* in serif, with "little" set small |
| 13.9–16.2 | "So this weekend… let's score their very first…" | **R4** Saturday arrival → **R6** parent holds the toddler's hands for the walking kick | Still desaturated. A white pop-up card "sat · oct 3" on "weekend". Riser, slow push |
| 16.2–17.1 | "**goal.** Together." | **R7** ball rolls into the mini goal → **R8** parent scoops up the toddler | **Smash to full colour** with a white flash: the music drop. *together.* in serif |
| 17.3–20.8 | "Meet Mommy, Daddy & Me Soccer at Euro Soccer USA." | **OC** Denver on the field with the class behind | Lower-third "denver · euro soccer usa". **Crest slam** on "Euro Soccer USA" |
| 20.9–25.5 | "30 playful minutes for 12 to 24 month olds, with you right by their side." | **R9** class circle → **R11** three toddlers kicking → **R12** walking hand in hand | White pop-up cards stack: "30 min", "12–24 months", "you + them". Crop cuts |
| 25.6–30.0 | "Imaginative themed games that build balance, coordination and confidence." | **R13/R14** parachute and bubbles → **R15** balance → **R16** coordination → **R17** confidence | Three-part list: each skill word as a full-screen serif card (black/white alternating), one card per shot |
| 30.1–31.5 | "No pressure. Just play." | **OC** Denver, relaxed and smiling → **R20** toddler sits and rolls the ball by hand | Jump cut. Glitch frame at about 30 s |
| 31.7–33.7 | "And yes… one very good nap after." | **R21** toddler asleep in a car seat hugging the ball → O4 | Warm colour, slow push. *nap* in serif |
| 34.0–36.9 | "Their first kick. Their first goal. Their first high five." | **R2, R7, R19** | **Signature MMH move:** each moment pulls back into an instant print that lands on grey paper, building a 3-print stack, with a shutter click on each |
| 37.0–38.4 | "You'll be right there for all of it." | **R22** parent and toddler high-five against the sky → O4 | Warm golden grade, halation |
| 38.7–44.1 | "Fall classes start this weekend at The Sports Park, Playa Vista. Tap the link and book their first class." | **OC** Denver (ends with "see you on the field") over **R23** | White pop-up cards: Sat & Sun · Oct 3 – Nov 22 / 10:15–10:45 AM / ages 12–24 months / The Sports Park / try a class $34. Button: "Book their first class →" |
| 44.1–47.2 | *(bed resolves)* | **Logo card on black** | ESU crest wipe-in, bass thump, "Proudly sponsored by Wateria" |

ESU crest top-left and Wateria **Official Sponsor** top-right throughout, as in both existing videos.

---

## 3. Denver's talking head

### Script (about 47 s, matching the edit)
OC = to camera, VO = voice only (record it as well; it plays over B-roll). Brackets are delivery notes.

```
[OC, curious, eyebrows up, holding a mini ball]   Wait… your one-year-old can play soccer?
[OC, big smile, tosses the ball]                   Yep. And you get to play too.
[VO, knowing, a little dry]                        Because let's be honest… same playground. Same swings. Same Saturday.
[VO, playful]                                      All that toddler energy… and nowhere to put it.
[VO, soft, slower]                                 And they're only this little once.
[VO → OC, building]                                So this weekend… let's score their very first goal. Together.
[OC, warm, proud]                                  I'm Denver, and this is Mommy, Daddy & Me Soccer at Euro Soccer USA.
[VO]                                               Thirty playful minutes for twelve-to-twenty-four-month-olds, with you right by their side.
[VO]                                               Imaginative, themed games that build balance, coordination and confidence.
[OC, relaxed, shrug]                               No pressure. Just play.
[OC, genuine laugh]                                And yes… one very good nap after.
[VO, slower, emotional]                            Their first kick. Their first goal. Their first high five.
[OC, sincere]                                      You'll be right there for all of it.
[OC, bright, inviting]                             Fall classes start this weekend at The Sports Park in Playa Vista.
                                                   Tap the link and book their first class. I'll see you on the field.
```

**Extra lines to record (for hook A/B tests and cutdowns):**
- "Parents of one-year-olds, this one's for you."
- "Your toddler's first soccer class can be this Saturday."
- "This is the only soccer class where the parents play too."
- "Thirty minutes. You, your little one, and a ball."

### Shoot setup (one phone and one lav is enough)
| | |
|---|---|
| **Camera** | Phone or camera **vertical 4K, 30 fps**, on a tripod at Denver's eye level. 4K leaves room for the crop punch-ins. |
| **Framing** | Chest-up, eyes about 38% down the frame. Keep the top 15% clear (the corner logos sit there) and the bottom 30% calm (captions and Reels UI). |
| **Location** | On the turf at The Sports Park, with the class or palm trees 4–6 m behind for depth. Shoot before or after class so other families aren't in the background without consent. |
| **Light** | Sun to Denver's side or behind, never straight into the eyes. A white reflector or open shade fills the face. |
| **Audio** | Wireless lav at mid-chest. Record 10 s of silent room tone. Record the VO-only lines a second time in a parked car, which works as a quiet booth. |
| **Wardrobe** | ESU navy training top. Real ESU logos are welcome in real footage; only the AI prompts avoid logos. |
| **Props** | One mini soccer ball (size 1 or 2) for the hook. |
| **Takes** | Each line 3 times: natural, bigger energy, softer. Then one straight run of the whole script. |

### How Denver's shots are edited (MMH treatment)
- **Jump cuts:** cut out every pause and breath. The rhythm should feel brisk, never rushed.
- **Crop cuts:** alternate 100% and 130% framing every 1–3 words, so one take plays like a multi-camera shoot.
- **Grade:** Denver is in warm colour at the hook and from the goal onward. The pain half (5–13.5 s) is VO over black-and-white B-roll, so Denver never appears in B&W.
- **Pull-back:** the "Meet…" shot ends by shrinking into a print on grey paper as the crest slams in.
- **Lower-third:** "denver · euro soccer usa" in small lower-case white with a thin rule, on "Meet".
- **Cards over Denver:** white pop-up fact cards slide in beside Denver's shoulder rather than covering the face.

---

## 4. Real ESU B-roll shot list (first classes: Sat Oct 3 & Sun Oct 4, 10:15–10:45 AM)

**Before filming:** get a signed photo/video release from every parent whose child appears.
This footage will run as paid ads, so verbal consent is not enough. Give families who opt out a
coloured wristband and frame them out.

**Settings:** vertical 4K. Shots marked **SM** at 60 fps (slow motion); everything else at 30 fps.
Lock exposure and focus. **Kneel to toddler eye level.** Hold each shot 5–8 s and move your feet instead of zooming.

| # | Shot | Beat it serves | Notes |
|---|---|---|---|
| R1 | Camera on the turf at ball height; a small ball rolls toward the lens and a tiny sneaker taps it | Hook frame 0 | **SM.** Several takes; the most important shot of the video |
| R2 | A toddler's first touch on the ball, low wide | "first kick" | **SM** |
| R3 | Parent and toddler kicking the ball back and forth | "you get to play too" | Parent's face visible, laughing |
| R4 | Families arriving with strollers, palm trees, morning sun | "this weekend" / CTA | Wide, from behind |
| R5 | Detail: tiny sneakers next to a small ball on the turf line | Transitions | Static, 8 s |
| R6 | Parent holds the toddler's hands from behind for a "walking kick" toward a mini pop-up goal | "let's score their very first…" | **SM**, low angle from the goal side |
| R7 | The ball rolls into the mini goal and the net moves | "goal." | **SM**, close on the goal mouth |
| R8 | Parent scoops the toddler up and spins, both laughing | "Together." | **SM**, the colour-return hero shot |
| R9 | Class circle: parents sitting on the turf, toddlers on laps, Denver leading | "Meet… / 30 minutes" | High angle from a step or bleachers |
| R10 | Overhead or high wide of the whole class | Crest moment | Drone only if the venue allows it |
| R11 | Three different toddlers kicking a ball, about 3 s each | "12 to 24 month olds" | Same framing each time, so the cuts snap |
| R12 | Parent and toddler walking hand in hand away from camera | "right by their side" | Wide, centred, symmetrical |
| R13 | Themed game: parachute lifted, toddlers running underneath | "imaginative themed games" | **SM** |
| R14 | Props in play: bubbles, cones, hoops, bean bags | Themed games | Colourful details |
| R15 | Toddler stepping over a line or low hurdle, holding a parent's finger | "balance" | Side angle |
| R16 | Toddler kicking a ball through cones or into a hoop | "coordination" | **SM** |
| R17 | Toddler throws arms up after scoring; parents clap | "confidence" | **SM**, toddler-eye level |
| R18 | Macro: a tiny hand wrapped around a parent's index finger | "only this little once" | Quiet moment between drills |
| R19 | Macro: high-five between a big hand and a tiny hand | "first high five" | **SM**, clean background |
| R20 | Toddler sitting on the turf laughing, rolling the ball with their hands | "No pressure. Just play." | Shows there's no "doing it wrong" |
| R21 | After class: toddler asleep in a car seat or stroller holding the ball | "one very good nap" | Ask a willing parent to send a phone clip |
| R22 | Parent and toddler high-five, framed low against open sky | "right there for all of it" | **SM** |
| R23 | Clean wide of the field: families in the lower third, top two-thirds open sky and turf | End-card plate | Locked off, 10 s |
| R24 | Denver greeting a family at check-in, kneeling to say hi to the toddler | Trust cutaway | Natural, unposed |

---

## 5. OmniFlash prompts (5 × 10 s = the 47 s timeline)

**Rules (same as the Fall reel):**
- **No typography in any prompt.** Every clip carries the negative line.
- **Paste the CAST & WORLD block word-for-word at the top of every clip**, so the five generations match.
- 9:16 vertical. Faces sit in the upper 60% and the lower third stays calm for captions. Ambient sound only.
- Generate clip 5 at 10 s and keep the first 7.2 s; the end card is added in the edit.
- **Toddler realism tip:** AI toddlers can look uncanny in long close-ups, and parents notice. The prompts favour hands, feet, silhouettes, backs and medium-wide shots. Replace hero face moments (R7, R8, R17) with real footage whenever you can.
- If any OmniFlash shot makes the final cut, turn on Meta's **AI info** label when posting.

### CAST & WORLD
```
THE TODDLER: a 16-month-old toddler with warm light-brown skin, chubby cheeks, big brown eyes and a soft tuft of dark curly hair on top; wobbly but confident steps. At soccer: a plain navy t-shirt with a thin red collar, navy shorts, red socks and tiny white sneakers. At home: a plain oatmeal-coloured romper.
THE MOM: a woman in her early thirties with dark-brown hair in a messy bun and small gold hoop earrings, wearing a plain coral t-shirt, light-blue jeans and white sneakers.
THE DAD: a man in his mid-thirties with short dark hair and a short neat beard, wearing a plain sky-blue t-shirt, dark jeans and white sneakers.
THE COACH: a friendly adult coach in a plain navy training jacket, seen mostly from behind or at a distance, crouching to toddler height.
OTHER FAMILIES: toddlers aged 12 to 24 months, each with one parent, in plain bright t-shirts.
THE PROPS: small soft soccer balls in white, red and navy, mini pop-up goals with white nets, small orange cones, hula hoops, a large rainbow play parachute, soap bubbles.
THE PLAYGROUND: a plain neighbourhood playground with a small slide and baby swings, under a flat overcast sky.
THE HOME: a small, tidy Los Angeles apartment living room with a grey sofa, a wool throw and toys scattered on a rug.
THE FIELD: an outdoor youth soccer complex in west Los Angeles with bright green artificial turf, crisp white lines, tall palm trees along the edge and low golden morning sun.
LOOK: Metro-Media-House retro documentary style: 35mm film grain, soft halation on highlights, light vignette, near-black shadows, desaturated neutrals with one saturated accent at a time, slow push-ins on every shot, hard cuts only.
NEGATIVE: no text, no letters, no numbers, no logos, no signage, no captions, no subtitles, no watermarks, no readable screens, no jersey numbers, no brand marks.
```

### CLIP 1 · 0:00–0:10 · The hook → "same playground, same swings, same Saturday"
```
Vertical 9:16 documentary-cinematic footage in the LOOK above. Hard cuts only; every shot slowly pushes in.

0.0–1.2s: Warm golden colour at THE FIELD. Camera at ground level on the turf: a small white-and-navy soccer ball rolls and bounces gently toward the lens in slow motion, turf pellets catching the sun; at 1.0s a tiny white sneaker with a red sock steps in and taps the ball. Shallow depth of field, palm trees soft in the background.
1.2–3.0s: Hard cut. Medium-wide, golden colour: THE TODDLER stands on the turf beside the ball, wobbling, looking down at it with wonder, arms slightly out for balance. Hold almost still, very slow push-in.
3.0–5.0s: Hard cut. THE MOM and THE DAD crouch down on either side of THE TODDLER on the turf, both laughing and clapping softly; the toddler taps the ball and it rolls to Dad. Warm backlight, lens flare.
5.0–6.2s: HARD CUT TO HIGH-CONTRAST BLACK AND WHITE with a choppy, stepped, low-frame-rate feel. Wide shot of THE PLAYGROUND on a flat grey Saturday: THE MOM stands behind a baby swing, pushing it with one hand, while looking at a phone in the other (the screen faces away).
6.2–7.4s: Black and white, stepped. The exact same baby swing shot again, from the same angle: same push, same tired posture.
7.4–8.6s: Black and white, stepped. The camera pulls back fast from the swing shot and the whole image shrinks into a small photo print with a thin white border, lying slightly rotated on a pale grey paper surface beside two identical prints, as if the same day was printed three times.
8.6–10.0s: Black and white, stepped. Inside THE HOME: THE TODDLER in the oatmeal romper runs a fast wobbly lap around the grey sofa, toys scattered, while THE DAD sits on the floor looking exhausted, hand on his forehead.

Lighting: warm low golden sun on the field, then flat overcast and hard monochrome contrast. Ambient sound only (ball taps, playground creak, room tone), no dialogue, no music. No text, letters, numbers, logos or readable screens anywhere.
```

### CLIP 2 · 0:10–0:20 · Toddler energy → "only this little once" → the first goal (colour on 16.2 s)
```
Vertical 9:16 documentary footage in the LOOK above. Everything before 16.2s is HIGH-CONTRAST BLACK AND WHITE with a choppy stepped low-frame-rate feel; hard cuts; every shot slowly pushes in.

10.0–11.6s: Black and white, stepped. Three very fast hard cuts, about 0.5s each, inside THE HOME: THE TODDLER climbing onto the sofa cushions; small hands pulling every toy out of a basket; the toddler bouncing in place on the rug, full of energy.
11.6–13.6s: Black and white with a faint warm tint, smooth (not stepped). Extreme close-up: a tiny toddler hand slowly wraps around THE MOM's index finger and holds on. Very slow push-in, soft window light, shallow depth of field. Calm and tender.
13.6–13.9s: Near-black frame, almost silent.
13.9–15.0s: Desaturated, almost black and white. Saturday morning at THE HOME: sunlight pours through the front window onto a pair of tiny white sneakers and a small soccer ball waiting by the door.
15.0–16.2s: Desaturated. At THE FIELD, low angle from beside a mini pop-up goal: THE DAD walks behind THE TODDLER holding both of the toddler's hands, guiding a wobbly walking kick toward a small ball. Slow motion, anticipation.
16.2–17.2s: SMASH CUT TO FULL WARM GOLDEN COLOUR, the emotional turn. Slow motion: the small ball rolls into the mini pop-up goal and the white net billows; turf pellets sparkle in the sun.
17.2–18.4s: Warm colour, slow motion: THE DAD scoops THE TODDLER up high, both laughing; THE MOM runs in clapping. Backlit, lens flare, palm trees behind.
18.4–20.0s: Warm colour. A slow aerial push-in over THE FIELD: a circle of parents sitting on the turf with toddlers in their laps, colourful balls in the middle, palm trees casting long morning shadows. Keep the centre of the frame calm open turf (the crest is added there in the edit).

Lighting: monochrome home light, a tender window glow, then an explosion of golden morning sun on the goal. Ambient sound only, no dialogue, no music. No text, letters, numbers, logos or readable screens anywhere.
```

### CLIP 3 · 0:20–0:30 · 30 playful minutes · 12–24 months · right by their side · themed games
```
Vertical 9:16 sports-documentary footage in the LOOK above, warm golden colour with a red lean. Hard cuts; every shot slowly pushes in or glides sideways. Everything is at THE FIELD on a sunny Saturday morning.

20.0–21.5s: High angle: the class circle. Parents sit cross-legged on the turf with toddlers on their laps while THE COACH, seen from behind, rolls small balls into the middle; the toddlers crawl and toddle after them.
21.5–23.5s: Three hard cuts, about 0.65s each, identical framing at toddler eye level: three different toddlers from OTHER FAMILIES each tap a small ball forward, one after another.
23.5–25.6s: Hard cut. Wide, centred, symmetrical shot from behind: THE MOM and THE TODDLER walk hand in hand across the turf, side by side, the toddler's arm reaching up to hold her finger. Long soft shadows.
25.6–27.0s: Hard cut, slow motion. Parents lift a large rainbow play parachute high; toddlers run and giggle underneath it as it floats down.
27.0–28.0s: Hard cut. Soap bubbles drift over the turf; THE TODDLER reaches up to pop one, delighted.
28.0–30.0s: Three hard cuts, about 0.65s each: THE TODDLER steps carefully over a white line holding THE DAD's finger (balance); a small foot kicks a ball through two orange cones (coordination); a toddler throws both arms up after scoring while parents clap in the background (confidence).

Lighting: bright low golden morning sun, rim light on hair, lens flares, warm skin tones, plain bright clothing. Ambient field sound only (distant giggles, soft ball taps), no dialogue, no music. No text, letters, numbers, logos or signage anywhere.
```

### CLIP 4 · 0:30–0:40 · No pressure → the nap → first kick, first goal, first high five
```
Vertical 9:16 documentary footage in the LOOK above, warm golden colour. Hard cuts, slow push-ins, some slow motion.

30.0–31.6s: At THE FIELD: THE TODDLER plops down to sit on the turf mid-game, laughing, rolling the ball with both hands instead of kicking it; THE MOM kneels beside, laughing too. Relaxed and happy.
31.6–33.8s: Hard cut. Soft warm afternoon light inside a car: THE TODDLER fast asleep in a car seat, cheeks rosy, hugging the small soccer ball. Very slow push-in, peaceful.
33.8–34.8s: Hard cut, slow motion: a tiny white sneaker kicks the ball for the first time; turf pellets fly.
34.8–35.8s: Hard cut, slow motion: the ball rolls into the mini pop-up goal; the net billows.
35.8–36.9s: Hard cut, slow motion: THE DAD's big open hand meets THE TODDLER's tiny hand in a gentle high five against blue sky.
36.9–38.4s: Hard cut, the MMH SIGNATURE SHOT: on a pale grey paper surface, three small instant-photo prints with white borders (a tiny shoe kicking a ball, a ball in a net, a big hand and a tiny hand touching) drop one after another and settle in a loose, slightly rotated stack, soft shadows, slow push-in.
38.4–40.0s: Hard cut. Low angle against open sky in golden backlight: THE MOM kneels and THE TODDLER gives her a high five; halation glows around them.

Lighting: warm golden sun, soft halation, backlit moments, cosy car light. Ambient sound only, no dialogue, no music. No text, letters, numbers, logos or readable screens anywhere.
```

### CLIP 5 · 0:40–0:47 (generate 10 s, keep the first 7.2 s) · Call to action → end-card plate
```
Vertical 9:16 warm cinematic lifestyle footage in the LOOK above, golden-red colour. Hard cuts, slow push-ins.

40.0–41.8s: Saturday morning at THE FIELD entrance: OTHER FAMILIES walk in with strollers and small balls under palm trees, toddlers in parents' arms, sunlight flickering through the fronds. Seen from behind, wide.
41.8–43.2s: Hard cut. Close-up of THE MOM's hand holding a phone, her thumb tapping the screen (the screen faces away from camera, only a soft glow); THE TODDLER on her hip grabs at the phone and laughs.
43.2–44.2s: Hard cut. A full-frame shot of THE MOM, THE DAD and THE TODDLER laughing together on the turf pulls back and shrinks into a small bordered photo print resting inside an open old book on a pale grey paper surface.
44.2–47.2s: Hard cut. A wide, calm, symmetrical locked-off shot of THE FIELD: families and toddlers playing small in the bottom third of the frame, the top two-thirds clean bright sky and turf for the end-card overlay. Hold, slowly darkening toward black at the very end.

Lighting: glowing golden morning, hopeful and calm. Ambient birdsong and distant giggles only, no dialogue, no music. No text, letters, numbers, logos, signage or readable screens anywhere.
```

### Compact fallbacks (if OmniFlash drops details from the long versions)
Paste CAST & WORLD first, then one of these.
1. **0–10 s:** Golden slow motion: a small ball rolls at a ground-level lens and a toddler's tiny sneaker taps it; the toddler wobbles beside the ball; mom and dad crouch, laughing. Hard cut to high-contrast black-and-white stepped footage: a mom pushes a baby swing while looking at her phone, the same shot repeated, then pulled back into identical photo prints on grey paper; a toddler runs laps around a sofa while dad looks exhausted. No text.
2. **10–20 s:** Black-and-white stepped toddler energy at home; an extreme close-up of a tiny hand wrapping around a parent's finger; tiny sneakers and a ball by the door in morning light; dad guides a toddler's walking kick toward a mini goal. Smash to warm golden colour: the ball rolls into the net, dad scoops the toddler up laughing, then an aerial push-in over a circle of parents and toddlers on the turf. No text.
3. **20–30 s:** Warm golden documentary at a palm-lined turf field: a class circle with toddlers on parents' laps; three toddlers each tap a ball; mom and toddler walk hand in hand from behind; a rainbow parachute and bubbles; balance, coordination and arms-up confidence moments. No text.
4. **30–40 s:** A toddler sits and rolls the ball, laughing; the toddler asleep in a car seat hugging the ball; slow motion first kick, ball in the net, a big hand and a tiny hand high-fiving; three instant prints stacking on grey paper; mom and toddler high-five against golden sky. No text.
5. **40–47 s:** Families with strollers arriving under palm trees; mom's thumb taps a phone that faces away while the toddler laughs on her hip; a family photo pulls back into a print inside an open book; a calm symmetrical wide of the field with clean sky for the end card. No text.

---

## 6. Hand-off: how to send the footage for the edit

Put the files in `public/footage/mdm/` (kept out of git) with these names, so each one drops straight into its slot in the edit:

| Material | File name |
|---|---|
| Denver on camera, one file per line or the whole run | `th_denver_01.mp4`, `th_denver_02.mp4`, … |
| Denver VO-only lines (car recording) | `vo_denver.wav` |
| Real B-roll, named by shot number from §4 | `r01.mp4` … `r24.mp4` (a few takes each: `r07_a.mp4`, `r07_b.mp4`) |
| OmniFlash clips | `omni_clip1.mp4` … `omni_clip5.mp4` |

**What happens in the edit:**
1. Denver's audio gets word-level timing (transcription plus alignment), so every cut, caption and sound effect re-times to Denver's real delivery.
2. The best take of each R-shot replaces its OmniFlash stand-in. Anything not shot yet stays OmniFlash.
3. The retro pass is added (grade, grain, stepped frames, prints, serif type, pop-up cards, glitches, logo card on black).
4. The audio is mastered to −14 LUFS, and two files come back: the full-quality master and an Instagram upload copy.

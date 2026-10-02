# Euro Soccer USA: Fall Academy launch reel

A 48-second vertical reel (1080×1920, 30 fps) that uses the editing system of
[@metromedia.house](https://www.instagram.com/metromedia.house/reels/) to sell the ESU
Fall Academy to LA moms who have never heard of Euro Soccer USA.

The reel has three parts. It opens on the pain (weekends lost to screens). It then
sells the outcome (confidence, friends, skills, a kid who can't wait for Saturday).
It ends on a soft call to action ("Fall starts this weekend. Tap the link and find your kid's class").

**Two cuts:** `ESU-FallLaunch` is the final **footage cut**: five OmniFlash clips in `public/footage`, cut on the voiceover, with every MMH graphic layered on top. `ESU-FallLaunch-Graphics` is the motion-graphics-only cut.

| Output | Path |
|---|---|
| Final reel: 48.1 s, H.264 High yuv420p + AAC 320k, −14.1 LUFS / −1.5 dBTP | `out/esu-fall-launch-reel.mp4` |
| Cover frame | `out/cover.jpg` |
| Caption, hashtags, paid setup, fact sources | [`POSTING.md`](POSTING.md) |

---

## 1. Metro Media House: editing-style breakdown

This is based on 11 recent @metromedia.house reels (Jun–Sep 2026, 25K–1.5M plays).
They were pulled through the Instagram API and measured with ffmpeg and OpenCV
(cut detection, colour, held frames, loudness). Captions were measured with OCR.
AI scene analysis was run on 3 reels and on the public "Edit With Madhav" MMH tutorial.

**What they make.** Narrated mini-documentaries. There is no talking head. One voiceover
runs over archival clips, film clips, stills, news screenshots and UI captures.
Each reel tells one story, usually built on a metaphor.

| Dimension | What MMH does (measured) |
|---|---|
| **Hook (0–3 s)** | VO starts on frame 0 with no fade-in. The first line is a contrarian or mystery claim. The opening is an iconic image with a slow push-in, or a supercut. There are 10–18 cuts in the first 5 s. |
| **Pacing** | Median shot is **0.52 s** (range 0.24–1.33). There is a new visual every 1–3 spoken words, and cuts follow the VO phrasing more than the beat. |
| **Captions** | Pure white on dark, **centred**, about 5% of frame height, **71–84% lower-case**. Chunks of 1–4 words fade up with the VO. **There are no coloured keyword boxes.** Emphasis comes from *scale*: key words jump to 12–30% of frame height in an italic serif. |
| **Type cards** | Full-screen word cards alternate between white italic serif on black and black italic serif on white, with an occasional white sans on black. |
| **B-roll** | Archival and interview clips, film clips as punchlines, paintings, news headlines with a **yellow highlighter**, social/UI screen captures, stacked **white pop-up cards**, polaroids, 3×3 grids. |
| **Colour** | 8–39% of frames are **black & white**. The rest are warm and red-dominant, under film grain and a light vignette. |
| **Motion** | Slow Ken Burns push-ins. **Stepped/held frames** (posterize-time feel) make up 5–26% of frames. Small keyframed "bumps". |
| **Transitions** | Mostly **hard cuts**. Every 8–12 s there is a 2–4-frame **glitch** (invert/difference, RGB offset, static sound) or a white flash. |
| **Sound** | **−14 LUFS**, loudness range only 2–5 LU: a compressed, continuous bed. Rhythmic cinematic percussion or fast synth, with ticks and whooshes on cuts, a riser at the end of the hook, and a **bass thump on the logo**. |
| **Structure** | Hook → setup → **three-part list** ("First… Second… Last…") → payoff line → CTA tied back to the metaphor → "link in bio" → **logo card on black**. |

## 2. How the style was applied to ESU

| MMH technique | Where it is in this reel |
|---|---|
| VO on frame 0 + visual hook | Frame 0 already shows **"Moms of kids 4–12"** over a phone *Screen Time* card counting up to **6h 42m ▲38%** |
| Contrarian first line | "If this is your kid's Saturday… **you're not a bad mom.**" This takes on mom guilt instead of shaming her. |
| Crop cuts every 1–3 words | Hard punch-in cuts inside the UI shots: screen-time bars, the tablet autoplay countdown, notifications, the chat, search suggestions, the news clip, the player card and the callback chat |
| Lower-case white captions + serif emphasis | Captions throughout. *saturday*, *iPad*, *screen*, *hundredth*, *believes*, *European-trained*, *notice* and *confidence* jump to a huge Instrument Serif italic |
| Type cards (black/white alternating) | "you're **not** a bad mom." · "…again." · **Every. / Single. / Day.** supercut · "What they *actually* need?" |
| B&W vs warm colour | The **problem half is black & white** with stepped 15 fps motion (lock screen, "Mom I'm bored", googling). **Colour returns on the music drop at "A ball."** That shift is the emotional turn. |
| News headline + yellow highlighter | Common Sense Media stat: "Kids 8–12 now average **5½ hours** of screen time a day" |
| Stacked white pop-up cards | Screen-time notifications, the coach's "That was ALL you!", and program facts (location, days, ages) |
| Three-part lists | Pain: 9 AM screen → "I'm bored" → googling it again. Solution: "A ball. A team. A coach." Outcome: "More confidence. Real friends. Real skills." |
| Payoff tied to the hook | The kid texts "**is it saturday yet?? ⚽⚽**", which calls back to "your kid's Saturday" in frame 1 |
| Paper stage + bordered prints + pull-back | "Mom, I'm bored" and the search screen are tilted prints on the pale grey paper field. The chat is pulled back from full-bleed to print size. |
| Inline sentence | "hand / over / the **[tablet print]** iPad / again." The words sit either side of the image, as in MMH's "The names [photo] from" |
| Card cloud + glowing serif | "*kids coached* / *10,000+*" in glowing Instrument Serif, with kid, medal, trophy and ball cards popping in around it. The back row is blurred and everything drifts. |
| Textured board | "European-trained coaches" runs on a chalk tactics board: pitch, X's and O's, and a yellow run drawn on stroke by stroke |
| Hero word flips to red | "not" and "Day." flip from black or white to brand red on the beat |
| Glitch every ~10 s + white flash | Glitches at 5.6 s, 16.5 s, 31.2 s and 34.8 s. Flashes on the drop (19.2 s) and the brand reveal (22.1 s). |
| Continuous bed, −14 LUFS, bass thump on logo | A tense minor bed (heartbeat kick, 1 Hz clock tick, music box) → tape-stop → riser → **124 BPM drop**. The music ducks about 10 dB under the VO. The reel ends on a logo card on black with a boom. |

**One deliberate deviation: the format.** MMH posts 16:9. This reel is **9:16 full-screen**.
Moms scroll Reels vertically, and a letterboxed 16:9 video gives up about 45% of the screen.

## 3. Script and shot list

Voice: warm female narrator, mom-to-mom (Kokoro TTS `af_heart`, generated offline, royalty-free).

| Time | VO | Picture |
|---|---|---|
| 0.0 | If this is your kid's **Saturday**… | "Moms of kids 4–12" + Screen Time card slams in (6h 42m ▲38%) → crop on the red weekend bars |
| 1.6 | you're **not** a bad mom. | Type card, black serif on white |
| 2.8 | But watch this before you hand over the iPad again. | Tablet autoplay "Next episode in 5…" → crop on countdown → **paper stage: "hand over the [tablet print] iPad again."** |
| 5.6 | It's 9 AM. They're already on a **screen**. | *glitch* → B&W lock screen 9:00 with notification pile-up ("Ignore limit?") |
| 8.1 | "Mom, I'm bored" — for the **hundredth** time. | Chat screenshot as a print on the paper stage, pulled back from full-bleed → crop |
| 10.4 | And you're googling how to get them off it… | Search screenshot as a tilted print on paper: "how to get my kid off the ipad" + autocomplete |
| 12.1 | …again. | Type card |
| 12.6 | Kids 8–12 now average 5½ hours of screens. | News clipping + yellow highlighter → crop → "5½ hours a day." |
| 16.5 | Every. Single. Day. | Three-card word supercut → black + tape-stop |
| 18.0 | What they *actually* need? | Type card, white serif on black, over a riser |
| 19.2 | A ball. A team. A coach who **believes** in them. | **Beat drop.** The ball's first bounce lands on the drop and colour floods out from the impact (shockwave + turf burst) → jerseys → "That was ALL you!" |
| 22.1 | That's Euro Soccer USA's Fall Academy. | Shield + wordmark + *Fall Academy* reveal |
| 24.6 | Weekend soccer classes in LA for ages 4–12, | Stacked white cards: classes · The Sports Park · Sat & Sun, Oct 3–Nov 22 · Ages 4–12 |
| 27.9 | with **European-trained** coaches, grouped by age and ability. | Chalk tactics board drawing itself → "Grouped by age & ability" card |
| 31.2 | Voted #1 in LA, with 10,000+ kids coached. | "#1 voted in Los Angeles" → **card cloud** around a glowing "10,000+" → "20+ years in LA" |
| 34.8 | 8 weeks from now, you'll **notice** it. | Week counter 1 → 8 |
| 36.7 | More **confidence**. Real friends. Real skills. | "YOUR KID" player card: screen time ▼, confidence/friends/skills ▲ |
| 39.5 | And a kid who asks, "Is it **Saturday** yet?" | Chat callback: "is it saturday yet?? ⚽⚽" / "2 more sleeps 😂" |
| 41.8 | Fall starts this weekend. Tap the link and find your kid's class. | End card: dates, location, "Find your kid's class →" |
| 46.6 | — | Logo card on black + bass thump |

## 4. Editing and re-rendering

**Footage (not in git, since the clips are large):** put the five OmniFlash clips in `public/footage/`. Each file name must contain its slot keyword: `sofa`, `kick`, `match`, `winning`, `prep`. `scripts/scan_media.mjs` maps them automatically. The in/out points per shot are listed at the top of `src/compositions/ESU_FallLaunchFootage.tsx`. Photos dropped in `public/photos/` feed the week-counter flash montage.

```bash
npm install
npm run studio                       # live preview / timeline scrubbing
bash scripts/render.sh               # render + -14 LUFS master + cover → out/
```

The voiceover drives everything. Edit `scripts/script.json`, then regenerate:

```bash
pip install kokoro-onnx soundfile numpy scipy
mkdir -p scripts/.kokoro && cd scripts/.kokoro   # one-time model download (~350 MB, gitignored)
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/kokoro-v1.0.onnx
curl -LO https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0/voices-v1.0.bin
cd ../..
python3 scripts/make_vo.py                              # VO + word timings → src/timeline.json
python3 scripts/make_music.py                           # music re-synced to the new timeline
python3 scripts/make_sfx.py                             # (only if you change the SFX kit)
```

Every cut, caption and sound effect is keyed to VO **words** (`W('turn1', 4)`), not to fixed
frames. A new read or a different voice therefore re-times the whole edit automatically.

**Brand assets.**
- The official crest is in use: `public/logos/esu-logo.svg`, a clean vector trace of `esu-logo-source.png` in the three crest colours. Brand navy `#181145` and red `#ED1C24` are sampled from it, in `src/presets/brand.ts`.
- The crest lands three times: a **slam** at 22.1 s (RGB-split ghosts, gold shockwave, particle burst, light rays), the CTA card, and a **wipe-in** on the final black card with a bass thump.
- Real ESU footage is the single biggest upgrade. MMH is built on real clips. The pitch, ball,
  jersey and tactics-board shots (19–31 s) are the slots to replace with kids on the field at The Sports Park.
- A real parent or coach voice (or a human VO) would further raise trust.

## 5. Mommy, Daddy & Me (toddler class) video

`ESU-MommyDaddyMe` is a second, fully animated video for the Parent Assisted Toddler class
(12–24 months). It lives in `src/mdm/` and shares the brand presets, logos and fonts. The posting
kit and the facts used are in `POSTING_MDM.md`.

- `Characters.tsx`: rubber-hose SVG toddler, Mom and Dad. Every limb is a two-bone IK chain,
  so a pose is just hand and foot targets. Also the tiny-hand-holds-finger close-up.
- `World.tsx`: sky, grass, playground, toddler goal, calendar, energy meter, gauge, confetti, iris.
- `Type.tsx`: die-cut stickers, bouncy letters, serif emotion lines, word-synced captions.
- `Scenes1.tsx` / `Scenes2.tsx`: the 13 scenes. `MDM.tsx`: transitions, captions, logos, mix and SFX cues.

```bash
SCRIPT=scripts/script_mdm.json OUT_WAV=public/audio/vo_mdm.wav OUT_JSON=src/timeline_mdm.json \
  python3 scripts/make_vo.py                 # VO + word timings
python3 scripts/make_music_mdm.py            # ukulele/glock score, drop on "goal" → public/audio/music_mdm.wav
python3 scripts/make_sfx_mdm.py              # boing, slide whistle, scratch, net, ta-da…
COMP=ESU-MommyDaddyMe NAME=esu-mommy-daddy-me COVER=96 bash scripts/render.sh
```

## 6. Credits and licences
- Fonts: Instrument Serif, Inter, Oswald, Bebas Neue, Montserrat, Anton, Poppins, Fredoka. All SIL OFL, vendored from google/fonts.
- Icons: Twemoji by Twitter/jdecked, CC-BY 4.0.
- Voice: Kokoro-82M (Apache-2.0), generated locally.
- Music and every sound effect: synthesised from scratch in `scripts/` (no third-party audio).
- Stat: Common Sense Media, *The Common Sense Census: Media Use by Tweens and Teens* (2021). Tweens average 5 h 33 m a day of entertainment screen media.

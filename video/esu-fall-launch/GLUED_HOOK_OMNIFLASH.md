# "Glued to your leg": Pixar-style hook (OmniFlash)

> **Superseded (Oct 2, 2026).** The "glued to your leg" hook only spoke to toddler parents, so the reel now opens with the all-ages "How old is your kid?" poll hook built from real footage (see `GLUED_TO_YOUR_LEG.md`). This prompt is kept only for reference; no OmniFlash clip is needed.

This replaces the motion-graphics hook (0–3 s) of `ESU-GluedToYourLeg`. The animated characters, glue bottle
and stopwatch drawing have been removed. The headline (EVERY NEW THING, THE FIRST 20 MINUTES LOOK LIKE THIS.)
and a red 00:00 → 20:00 timer chip stay on top, added in the edit.

**Settings:** 9:16 vertical · 5 s (if 10 s is the minimum, that's fine: the action is front-loaded and the edit uses the best 3 s) · style 3D animation · no audio needed.

**Framing rule:** the top ~40% of the frame is covered by the headline and timer, so keep it calm sky and palm trees. The characters belong in the lower 55%.

## Main prompt (paste as-is)
```
Vertical 9:16, 5 seconds. Pixar-style 3D animated short film, feature-animation quality: soft subsurface-scattered skin, big expressive eyes, rounded stylized proportions, rich global illumination, gentle depth of field, warm saturated colors, comedic squash-and-stretch timing.

SETTING: the sideline of a bright green artificial-turf youth soccer field in sunny Los Angeles on a Saturday morning. Crisp white field lines, a small goal with a white net, a few orange cones, tall palm trees and a clear blue sky behind. In soft focus in the background, a happy group of 5-to-7-year-old kids in plain navy and plain red training bibs warms up around a friendly coach in a plain navy jacket.

THE KID: a 5-year-old with warm light-brown skin, big brown eyes, chubby cheeks and a tuft of dark curly hair, wearing a plain navy t-shirt with a thin red collar, navy shorts, red socks and tiny black cleats.
THE PARENT: a mom in her mid-thirties with dark-brown hair in a messy bun and small gold hoop earrings, wearing a plain coral t-shirt, light-blue jeans and white sneakers. We see her from the knees up to the face, looking down with warm amusement.

ACTION:
0.0-0.6s: THE KID is wrapped around THE PARENT's leg like a koala, both arms and both legs locked around her shin, one cheek squashed against her jeans, eyes squeezed tightly shut. She stands at the edge of the field smiling down at him.
0.6-1.5s: She tries to take one step toward the field. She lifts her foot and the kid comes along with it, still clamped on, lifted off the ground, cheeks wobbling. She sets the foot down with a heavy comic plop.
1.5-2.4s: She tries again with a big exaggerated step. The kid slides across the turf still hugging the leg, holding even tighter, cheeks puffed, a determined little frown.
2.4-3.0s: THE KID cracks one eye open, peeks at the fun group playing on the field for a beat, then buries his face back into her leg. She laughs softly and gives the camera a gentle "see?" shrug.
3.0-5.0s: Hold the moment with small breathing motion while the kids in the background keep playing.

CAMERA: low angle at the kid's eye height, locked off with a very slow push-in. Both characters fill the lower 55% of the frame, the kid's face near the vertical middle of the frame. The top 40% of the frame stays calm and uncluttered: blue sky and soft-focus palm trees only.

LIGHTING: warm low golden morning sun from behind-left, soft rim light on hair, bright green bounce light from the turf, long soft shadows, cozy and funny mood.

NEGATIVE: no text, no letters, no numbers, no logos, no signage, no captions, no subtitles, no watermark, no jersey numbers, no brand marks, no scoreboard, no clock faces, no phone screens, no extra limbs, no distorted hands or fingers, no photorealistic style.
```

## Compact fallback (if the long one drifts)
```
Vertical 9:16, 5 seconds, Pixar-style 3D animation. At the sideline of a sunny green turf youth soccer field with palm trees, a shy 5-year-old boy in a plain navy t-shirt, navy shorts and red socks clings to his mom's leg like a koala, eyes squeezed shut. She tries to step toward the field and he comes along, lifted off the ground, then slides across the turf still hugging her leg. He peeks one eye at the kids playing behind them, hides again, and she laughs. Low camera at the kid's height, slow push-in, characters in the lower half of the frame, calm blue sky in the top 40%. Warm golden morning light. No text, no letters, no numbers, no logos, no watermark.
```

## Variant B: gentler, for an A/B test
```
Vertical 9:16, 5 seconds, Pixar-style 3D animation. Sunny turf youth soccer field with palm trees and blue sky; kids in plain navy and red bibs play softly out of focus. A shy 5-year-old girl with dark braids, in a plain navy t-shirt and red socks, hides behind her dad's leg (dad in a plain light-blue t-shirt and dark jeans, seen from the waist down). She slowly peeks around his knee at the game, one big eye at a time. A soccer ball rolls gently toward her feet; she gasps and ducks back behind the leg, hugging it tight. Dad's big hand pats her head. Low camera at her eye level, slow push-in, characters in the lower half of the frame, calm sky in the top 40%. Warm golden morning light, comedic timing. No text, no letters, no numbers, no logos, no watermark.
```

## Tips
- If OmniFlash rejects the word "Pixar", replace it with "feature-film 3D animation style, like a modern animated family movie".
- Generate 3–4 takes and pick the one where the kid's face reads clearly at phone size and the lift on the first step is the funniest.
- Characters, kit colours and background stay generic (navy/red with no marks), so the clip matches the real footage that follows.

## Dropping it in
Save the clip as `public/footage/glued/hook_pixar.mp4` (or send it here). The edit trims the best 3 s (`HOOK_IN` in
`src/compositions/ESU_GluedToYourLeg.tsx`), re-times the squeak/boing hits to the two steps, and re-renders:
`COMP=ESU-GluedToYourLeg NAME=esu-glued-to-your-leg COVER=45 bash scripts/render.sh`

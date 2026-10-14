See [AGENTS.md](AGENTS.md) for how to work here alongside the other agents, and
[CLAUDE.md](CLAUDE.md) for how the diorama engine itself works.

Both apply to you. The short version: one city per branch, only one agent in
`src/engine/` at a time, and no video is handed over until a model that did not
build it has checked the contact sheet against the plausibility list in
`CLAUDE.md`.

Before handing anything over, run `npm run check` and fix every error. It
encodes every note the owner has given so far (captions, titles, light, camera
rhythm, scripts); the table in `AGENTS.md` under "Every review becomes a rule"
says where each came from. When you fix a new review note, add its check there
too.

Before building a new city, read `docs/grandeur.md` and fill in the Grandeur
section of the brief: the owner judges every clip against Chiang Mai.

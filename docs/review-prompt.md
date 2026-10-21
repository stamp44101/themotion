# Review prompt — hand this to a model that did not build the city

Attach the 8-12-frame contact sheet of stills (made by hand: `npx remotion still` + ffmpeg hstack/vstack, see `CLAUDE.md`) and paste this.

---

These frames are from a 1080x1920 motion-graphic video: an isometric low-poly
diorama of a real Thai city, evolving across several centuries. The year shown
top-left advances through the clip.

Your job is to find things that **could not exist in the real world**. Be
specific about which frame and where in it. Do not comment on art style, colour
grading or taste — only physical and historical plausibility.

Check for:

1. **Anything built on open water.** Only bridges, boats and floating houses
   belong on a river. Houses, trees, market stalls, roads and towers do not.
2. **A city wall running across a river.** Where water crosses the wall line
   there must be a gap with a water gate — boats had to pass through.
3. **City gates standing in a channel** rather than on the bank.
4. **Buildings intersecting each other** — a hall clipping through its own
   tower, two structures occupying the same ground.
5. **Things that should be visible but are hidden** — e.g. a Buddha image
   enclosed in a building during a shot that is supposed to feature it.
6. **Roads following a riverbed** instead of crossing or running beside it.
7. **Crowds or stalls standing on water.**
8. **Terrain that does not match the province** — mountains behind a city that
   sits on flat central plain.
9. **Anything appearing before it existed**, or surviving after it was
   destroyed, given the year on screen.
10. **Text safety**: the year counter and captions should sit clear of the top
    ~250 px, bottom ~460 px and left ~130 px, and further from the right edge below
    mid-frame (~220 px), which is where TikTok's own interface sits (`SAFE` in
    `src/Overlay.tsx`).

For each problem give: the frame, what is wrong, and why it is impossible.
If a frame is fine, say nothing about it. End with the single most serious
issue, if there is one.

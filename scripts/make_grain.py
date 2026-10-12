"""Generate a tileable film-grain texture (public/grain.png)."""
import numpy as np
from PIL import Image

rng = np.random.default_rng(7)
n = rng.normal(128, 38, (512, 512)).clip(0, 255).astype(np.uint8)
Image.fromarray(n, mode="L").save("public/grain.png")

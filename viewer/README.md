# Naruebi public GLB viewer

Independent viewer authored for GOROman/nullevi03-model using MIT-licensed three.js and @pixiv/three-vrm MToon materials. No Charakuru or donor source is included.

The verified v0.1.0 public GLB contains an eight-second greeting animation, no morph targets and no VRM spring definitions. This deployment therefore exposes playback, pause, reset, time scrub, face zoom, PBR/toon comparison and outline width. Expression sliders, spring controls and texture edits are deliberately pending the updated VRM. The page explains these limitations.

Original model, textures and existing repository files remain unchanged. Toon rendering uses the original maps with anisotropic filtering, stepped MToon lighting and an inverted hull MToon outline pass. It does not claim repaired texture seams or new facial expressions.

Model SHA-256: abeba68d1fd8827aaa1a98aa0251c618ef1d8d0cef4ec24b8bf3607d4f40a8ca (verified against the public release SHA256SUMS.txt).

Build: npm ci, place the public release Naruebi_v01_PBR_approximate.glb at public/models/Naruebi.glb, then npm run build -- --base=/nullevi03-model/. Copy dist into ../docs and add .nojekyll. GitHub Pages serves main:/docs.

No additional model use, modification or redistribution license is granted. Library notices apply only to the viewer dependencies.

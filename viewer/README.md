# Null Evi / ナルエビ VRM viewer

Independent static viewer using MIT-licensed three.js, three-vrm and three-vrm-animation. No Charakuru kit code or donor code is included.

Run `npm ci` then `npm run build` in this directory. The build writes `../docs` with the existing repository Pages base URL. GitHub Actions deploys that directory.

The owner-authorized public viewing copy retains GOROman authorship, personal non-profit commercial scope, restricted avatar use and no redistribution permission. Publication adds no model license. See MODEL_PROVENANCE.json for checksums. Source geometry and embedded texture image bytes remain unchanged; originals are preserved outside this repository.

Controls: playback, pause, reset, time seeking, spring physics, face view, outline width and six real VRM material expression bindings. Eye expressions exclude other eye layers; smile and mouth layers exclude each other to avoid stacked painted facial features. Seeking resets spring history. Texture sampling uses anisotropic trilinear filtering and clamped atlas edges. Transparent facial layers do not write depth or cast shadows and do not receive ink outlines. This does not repaint source textures or turn painted overlays into morph targets.

The render uses standard MToon, opaque surface outlines and a soft floor shadow. Libraries and their licenses are listed in public/THIRD_PARTY_NOTICES.txt. Existing filenames remain stable for compatibility; the character's English display name is Null Evi.

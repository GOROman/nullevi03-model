## Null Evi / ナルエビ 公開VRMビューアー

[ビューアーを開く](https://goroman.github.io/nullevi03-model/) — トゥーン、輪郭、挨拶VRMA、6表情、揺れ物、顔拡大に対応。独立実装で、Charakuruコードは含みません。個人・非営利の範囲を保持し、公開により追加の再配布・利用許諾は付与しません。

# nullevi03-model / Naruebi・ナルエビ

ナルエビのBlenderモデル、互換GLB、テクスチャ、正面プレビューを公開しています。三面図v01を参考に再構築したモデルです。

![ナルエビの正面プレビュー](renders/Naruebi_front.png)

## ダウンロード

[v0.1.0 Release](https://github.com/GOROman/nullevi03-model/releases/tag/v0.1.0)から取得できます。

| ファイル | 内容 | サイズ |
| --- | --- | --- |
| [Naruebi_model_download.zip](https://github.com/GOROman/nullevi03-model/releases/download/v0.1.0/Naruebi_model_download.zip) | Blenderモデル・テクスチャ2枚・正面画像・説明をまとめた配布セット | 13.1 MB |
| [Naruebi_v01_TOON_INK.blend](https://github.com/GOROman/nullevi03-model/releases/download/v0.1.0/Naruebi_v01_TOON_INK.blend) | 基準の見た目を再現するBlender版 | 24.9 MB |
| [Naruebi_v01_PBR_approximate.glb](https://github.com/GOROman/nullevi03-model/releases/download/v0.1.0/Naruebi_v01_PBR_approximate.glb) | 互換用途向けのPBR近似版 | 47.4 MB |

ZIPはZIP/LZMA形式です。対応する展開機能を使用してください。ZIP内のBlenderファイルは圧縮保存を展開したもので、個別配布のBlenderモデルと内容は同一です。GLBは別配布です。

配布ファイルのSHA-256は[SHA256SUMS.txt](https://github.com/GOROman/nullevi03-model/releases/download/v0.1.0/SHA256SUMS.txt)で確認できます。

## Blender版の使い方と仕様

`Naruebi_v01_TOON_INK.blend`が基準の見た目のモデルです。Blender 4.3.2のEEVEEで開き、コンポジターを有効にしてレンダリングしてください。Blender 4.4.1でも読み込みを確認しています。

- 38ボーンのリグ。
- 挨拶の手振りとお辞儀：8秒、24 fps、1〜192フレーム。
- 3段階のトゥーン階調と、形状に追従する黒い輪郭線。Blender固有のマテリアル、AOV、コンポジターで表現します。
- テクスチャはモデル内に同梱し、[textures/](textures/)にも収録しています。
- [renders/Naruebi_front.png](renders/Naruebi_front.png)は確認済みの正面レンダリングです。

元の三面図にはビュー間で形状・比率の差があり、全方向でピクセル単位に一致する再現ではありません。

## GLB版の用途と見た目

`Naruebi_v01_PBR_approximate.glb`は互換ビューアーや他の3Dツール向けのPBR近似版です。38ジョイントのリグ、手振りとお辞儀のアニメーション、テクスチャを含みます。

Blender固有のトゥーン階調、AOV、コンポジターの黒い輪郭線はGLBへ移植されません。輪郭線は含まれず、表示はビューアーや照明によって変わります。Blender版と同じ見た目が必要な場合は`.blend`を使用してください。

## 利用条件

ライセンスは未指定です。この公開に追加の利用・改変・再配布の許諾は含まれません。MIT、Creative Commonsなどの再利用ライセンスは付与していません。

## English

The native Blender asset is the reference appearance. Use Blender 4.3.2, EEVEE and compositing; loading was also checked in Blender 4.4.1. The rig has 38 bones, with a greeting wave and bow over 8 seconds at 24 fps (frames 1–192). Textures are packed and available in `textures/`.

The GLB is a compatibility PBR approximation. It includes the rig, animation and textures, but Blender-specific toon ramps, AOVs and compositor ink are not portable to GLB. There are no outlines in the GLB. The source three-view drawings differ in proportions, so this is not a pixel-perfect match from every direction.

The ZIP uses ZIP/LZMA and contains the native model, textures, preview and documentation; download the GLB separately. The ZIP's uncompressed Blender data matches the standalone compressed `.blend`. License: unspecified. This publication includes no additional grant to use, modify or redistribute the assets.

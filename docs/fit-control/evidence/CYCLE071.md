# C071 — native lock accepted, isolated build recovery

C070 run 46039177792 job 140642209600, workflow SHA 6d94898a51f3e316837ba55deae0178fe95fa739, checkout 7e3476591b6f423c020f9673d05e5728a44c23e0. SOURCE_99_PASS; LICENSE_UNRESOLVED=[]; BUILD_LICENSE_GATE_PASS. 120 license file receipts (may include multiple per package). Lock accepted for internal synthetic build only: SHA256 7f2abd99210915f487ee70f6b646fae4899cb8843caffea1d99cd3e0d88adfc5; canonical lock commit 7d0317e9f22a1fac058a3ed787c03a897a8b5fb9. Original license text pattern check is not full legal clearance; distribution notices/native licenses remain open. Web build failed on malformed legacy root package.json and tsconfig.json, both outside fit-control. Android and APK checks skipped. Recovery: copy verified fit-control tree into isolated RUNNER_TEMP directory outside repo ancestry, preserve root/main/backup. No repeat of license fetch or core test; validate source and lock integrity before use. No upload, production signing, or real data.

```json
[
  {
    "package": "node_modules/@capacitor-community/sqlite",
    "version": "8.1.1",
    "license": "MIT",
    "source": "node_modules/@capacitor-community/sqlite/LICENSE",
    "sha256": "f138ef5563fe07869aeaa54d14117c8a1111656d3a8d274917ec185f1dc02ce3"
  },
  {
    "package": "node_modules/@capacitor/android",
    "version": "8.6.3",
    "license": "MIT",
    "source": "node_modules/@capacitor/android/LICENSE",
    "sha256": "9c6ebf3e5ab832ba4d5af38f340978e1fedbfee6e3d23662dfdb8917a9d864dd"
  },
  {
    "package": "node_modules/@capacitor/cli",
    "version": "8.6.3",
    "license": "MIT",
    "source": "node_modules/@capacitor/cli/LICENSE",
    "sha256": "9c6ebf3e5ab832ba4d5af38f340978e1fedbfee6e3d23662dfdb8917a9d864dd"
  },
  {
    "package": "node_modules/@capacitor/core",
    "version": "8.6.3",
    "license": "MIT",
    "source": "node_modules/@capacitor/core/LICENSE",
    "sha256": "9c6ebf3e5ab832ba4d5af38f340978e1fedbfee6e3d23662dfdb8917a9d864dd"
  },
  {
    "package": "node_modules/@capacitor/ios",
    "version": "8.6.3",
    "license": "MIT",
    "source": "node_modules/@capacitor/ios/LICENSE",
    "sha256": "9c6ebf3e5ab832ba4d5af38f340978e1fedbfee6e3d23662dfdb8917a9d864dd"
  },
  {
    "package": "node_modules/@esbuild/linux-x64",
    "version": "0.28.2",
    "license": "MIT",
    "source": "https://raw.githubusercontent.com/evanw/esbuild/609683d892977362a0f99026cb74b96263d728a9/LICENSE.md",
    "sha256": "b40ec5baec7bb34fa5b1c09521fa3cd52d5fad7adafed74932a2010d3612a681"
  },
  {
    "package": "node_modules/@ionic/cli-framework-output",
    "version": "2.2.8",
    "license": "MIT",
    "source": "node_modules/@ionic/cli-framework-output/LICENSE",
    "sha256": "1200a778976e8bca048d108ffef707ce275ee7922f7b1f9e329ef1c14c283d97"
  },
  {
    "package": "node_modules/@ionic/utils-array",
    "version": "2.1.6",
    "license": "MIT",
    "source": "node_modules/@ionic/utils-array/LICENSE",
    "sha256": "28b5609e1d288da5fda25d2b951bdf829699356f0b9bb411ef40251463f885b0"
  },
  {
    "package": "node_modules/@ionic/utils-fs",
    "version": "3.1.7",
    "license": "MIT",
    "source": "node_modules/@ionic/utils-fs/LICENSE",
    "sha256": "28b5609e1d288da5fda25d2b951bdf829699356f0b9bb411ef40251463f885b0"
  },
  {
    "package": "node_modules/@ionic/utils-fs/node_modules/fs-extra",
    "version": "9.1.0",
    "license": "MIT",
    "source": "node_modules/@ionic/utils-fs/node_modules/fs-extra/LICENSE",
    "sha256": "1e76029602ae9b21cc4e612db2496d92febed882ba13ba745f8b3309e85f9d39"
  },
  {
    "package": "node_modules/@ionic/utils-object",
    "version": "2.1.6",
    "license": "MIT",
    "source": "node_modules/@ionic/utils-object/LICENSE",
    "sha256": "28b5609e1d288da5fda25d2b951bdf829699356f0b9bb411ef40251463f885b0"
  },
  {
    "package": "node_modules/@ionic/utils-process",
    "version": "2.1.12",
    "license": "MIT",
    "source": "node_modules/@ionic/utils-process/LICENSE",
    "sha256": "28b5609e1d288da5fda25d2b951bdf829699356f0b9bb411ef40251463f885b0"
  },
  {
    "package": "node_modules/@ionic/utils-stream",
    "version": "3.1.7",
    "license": "MIT",
    "source": "node_modules/@ionic/utils-stream/LICENSE",
    "sha256": "28b5609e1d288da5fda25d2b951bdf829699356f0b9bb411ef40251463f885b0"
  },
  {
    "package": "node_modules/@ionic/utils-subprocess",
    "version": "3.0.1",
    "license": "MIT",
    "source": "node_modules/@ionic/utils-subprocess/LICENSE",
    "sha256": "28b5609e1d288da5fda25d2b951bdf829699356f0b9bb411ef40251463f885b0"
  },
  {
    "package": "node_modules/@ionic/utils-terminal",
    "version": "2.3.5",
    "license": "MIT",
    "source": "node_modules/@ionic/utils-terminal/LICENSE",
    "sha256": "28b5609e1d288da5fda25d2b951bdf829699356f0b9bb411ef40251463f885b0"
  },
  {
    "package": "node_modules/@isaacs/fs-minipass",
    "version": "4.0.1",
    "license": "ISC",
    "source": "node_modules/@isaacs/fs-minipass/LICENSE",
    "sha256": "4ec3d4c66cd87f5c8d8ad911b10f99bf27cb00cdfcff82621956e379186b016b"
  },
  {
    "package": "node_modules/@isaacs/nonrecursive-glob-match",
    "version": "1.1.0",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/@isaacs/nonrecursive-glob-match/LICENSE.md",
    "sha256": "8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004"
  },
  {
    "package": "node_modules/@rollup/rollup-linux-x64-gnu",
    "version": "4.44.0",
    "license": "MIT",
    "source": "https://raw.githubusercontent.com/rollup/rollup/fa4b2842c823f6a61f6b994a28b7fcb54419b6c6/LICENSE.md",
    "sha256": "b7da2ce13ab5566726b174cd99322fb8c2576f4d47b1393f8eea214928dd89eb"
  },
  {
    "package": "node_modules/@rollup/rollup-linux-x64-musl",
    "version": "4.44.0",
    "license": "MIT",
    "source": "https://raw.githubusercontent.com/rollup/rollup/fa4b2842c823f6a61f6b994a28b7fcb54419b6c6/LICENSE.md",
    "sha256": "b7da2ce13ab5566726b174cd99322fb8c2576f4d47b1393f8eea214928dd89eb"
  },
  {
    "package": "node_modules/@stencil/core",
    "version": "4.45.5",
    "license": "MIT",
    "source": "node_modules/@stencil/core/LICENSE",
    "sha256": "bc40e84d379da4988d8d9bc806eed129f12bbae61c67f54cd9816bd073f92688"
  },
  {
    "package": "node_modules/@types/fs-extra",
    "version": "8.1.5",
    "license": "MIT",
    "source": "node_modules/@types/fs-extra/LICENSE",
    "sha256": "c2cfccb812fe482101a8f04597dfc5a9991a6b2748266c47ac91b6a5aae15383"
  },
  {
    "package": "node_modules/@types/node",
    "version": "26.6.11",
    "license": "MIT",
    "source": "node_modules/@types/node/LICENSE",
    "sha256": "c2cfccb812fe482101a8f04597dfc5a9991a6b2748266c47ac91b6a5aae15383"
  },
  {
    "package": "node_modules/@types/slice-ansi",
    "version": "4.0.0",
    "license": "MIT",
    "source": "node_modules/@types/slice-ansi/LICENSE",
    "sha256": "c2cfccb812fe482101a8f04597dfc5a9991a6b2748266c47ac91b6a5aae15383"
  },
  {
    "package": "node_modules/@xmldom/xmldom",
    "version": "0.9.12",
    "license": "MIT",
    "source": "node_modules/@xmldom/xmldom/LICENSE",
    "sha256": "4da724fc305d81606b245b324d4d2586916b9d248b23d82183df753ace0fdf71"
  },
  {
    "package": "node_modules/ansi-regex",
    "version": "5.0.1",
    "license": "MIT",
    "source": "node_modules/ansi-regex/license",
    "sha256": "48da2f39e100d4085767e94966b43f4fa95ff6a0698fba57ed460914e35f94a0"
  },
  {
    "package": "node_modules/ansi-styles",
    "version": "4.3.0",
    "license": "MIT",
    "source": "node_modules/ansi-styles/license",
    "sha256": "48da2f39e100d4085767e94966b43f4fa95ff6a0698fba57ed460914e35f94a0"
  },
  {
    "package": "node_modules/astral-regex",
    "version": "2.0.0",
    "license": "MIT",
    "source": "node_modules/astral-regex/license",
    "sha256": "69dee148a2cc470554dfa7142e830662062394d0fe67cddd379aba90dc60d6b3"
  },
  {
    "package": "node_modules/at-least-node",
    "version": "1.0.0",
    "license": "ISC",
    "source": "node_modules/at-least-node/LICENSE",
    "sha256": "ecc042b5f1cdc6854fc00486065084bed877daa8a7fadce15ef943a550d1dff0"
  },
  {
    "package": "node_modules/balanced-match",
    "version": "4.0.4",
    "license": "MIT",
    "source": "node_modules/balanced-match/LICENSE.md",
    "sha256": "d408f38ffa3355c5faec517153295338892eb0f1ea43f57874bb23c6075979b5"
  },
  {
    "package": "node_modules/base64-js",
    "version": "1.5.1",
    "license": "MIT",
    "source": "node_modules/base64-js/LICENSE",
    "sha256": "5b37224c080cdcc97c871ada971c224e9926370fe74f11b539aa1cf9f3b1aca1"
  },
  {
    "package": "node_modules/big-integer",
    "version": "1.6.52",
    "license": "Unlicense",
    "source": "node_modules/big-integer/LICENSE",
    "sha256": "e9b0e94f628e00b5ed98046cfa041696ff89eebbbdd54108ee350625bc6d0363"
  },
  {
    "package": "node_modules/bplist-creator",
    "version": "0.1.0",
    "license": "MIT",
    "source": "node_modules/bplist-creator/LICENSE",
    "sha256": "d9bacb8be7c3a210dfe531bde8503eb567f51a8fdbfc438fcf7a171d7ab338d8"
  },
  {
    "package": "node_modules/bplist-parser",
    "version": "0.3.2",
    "license": "MIT",
    "source": "https://raw.githubusercontent.com/nearinfinity/node-bplist-parser/84abe1c3b552a807461b28a5a28084ce4f827ce1/README.md",
    "sha256": "4a09c55c64d57abe284e09318763dcd69795ed7a201a84edf1bf8774c3b91a8e"
  },
  {
    "package": "node_modules/brace-expansion",
    "version": "5.1.0",
    "license": "MIT",
    "source": "node_modules/brace-expansion/LICENSE",
    "sha256": "9c63a23124d68cd30cd316a94a1a0bca34f032786df6df69fc4b5f136bac8d2e"
  },
  {
    "package": "node_modules/browser-fs-access",
    "version": "0.35.0",
    "license": "Apache-2.0",
    "source": "node_modules/browser-fs-access/LICENSE",
    "sha256": "c71d239df91726fc519c6eb72d318ec65820627232b2f796219e87dcf35d0ab4"
  },
  {
    "package": "node_modules/buffer-crc32",
    "version": "0.2.13",
    "license": "MIT",
    "source": "node_modules/buffer-crc32/LICENSE",
    "sha256": "14895b82e3367b66bdb127fe91505f8615491f2a23eb1c0b7d8f7c54be67f57a"
  },
  {
    "package": "node_modules/chownr",
    "version": "3.0.0",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/chownr/LICENSE.md",
    "sha256": "a49c9ba464796f65b59fca3f1e6ca40912df1e859f575383223f7ec6c5baae09"
  },
  {
    "package": "node_modules/color-convert",
    "version": "2.0.1",
    "license": "MIT",
    "source": "node_modules/color-convert/LICENSE",
    "sha256": "693866fc419c6f61c8570438ec00659d156ec2b4d4a4d04091711f5f11a365d4"
  },
  {
    "package": "node_modules/color-name",
    "version": "1.1.4",
    "license": "MIT",
    "source": "node_modules/color-name/LICENSE",
    "sha256": "c064f7a3e353bc1bc977f3c897941c75ef763f44f41677e0a15370ca0853d6e2"
  },
  {
    "package": "node_modules/commander",
    "version": "12.1.0",
    "license": "MIT",
    "source": "node_modules/commander/LICENSE",
    "sha256": "04512a63dce4d2d506ad612dc0bd7681ccf6e3655f7b6eaef7dfac8323d1ec0b"
  },
  {
    "package": "node_modules/core-util-is",
    "version": "1.0.3",
    "license": "MIT",
    "source": "node_modules/core-util-is/LICENSE",
    "sha256": "33b734d60042d0fe0c92dd1fc1e874193a1c899ec3e276a2eb935d2d0bf5b710"
  },
  {
    "package": "node_modules/cross-spawn",
    "version": "7.0.6",
    "license": "MIT",
    "source": "node_modules/cross-spawn/LICENSE",
    "sha256": "aaa78451b6fecd1b9c4594c796c133c0e90cad100372ff8bc6de615e9ef9adf1"
  },
  {
    "package": "node_modules/debug",
    "version": "4.4.3",
    "license": "MIT",
    "source": "node_modules/debug/LICENSE",
    "sha256": "3a61c6c96caf5c1d9b623fb9b04c822b783dfcb78aa7e49c76a3f643e6ed7f95"
  },
  {
    "package": "node_modules/define-lazy-prop",
    "version": "2.0.0",
    "license": "MIT",
    "source": "node_modules/define-lazy-prop/license",
    "sha256": "48da2f39e100d4085767e94966b43f4fa95ff6a0698fba57ed460914e35f94a0"
  },
  {
    "package": "node_modules/elementtree",
    "version": "0.1.7",
    "license": "Apache-2.0",
    "source": "node_modules/elementtree/LICENSE.txt",
    "sha256": "8c6db340475136df3c1201d458fa5755698eace76e510471ecc9d857d6083dac"
  },
  {
    "package": "node_modules/emoji-regex",
    "version": "8.0.0",
    "license": "MIT",
    "source": "node_modules/emoji-regex/LICENSE-MIT.txt",
    "sha256": "483acb265f182907d1caf6cff9c16c96f31325ed23792832cc5d8b12d5f88c8a"
  },
  {
    "package": "node_modules/env-paths",
    "version": "2.2.1",
    "license": "MIT",
    "source": "node_modules/env-paths/license",
    "sha256": "48da2f39e100d4085767e94966b43f4fa95ff6a0698fba57ed460914e35f94a0"
  },
  {
    "package": "node_modules/esbuild",
    "version": "0.28.2",
    "license": "MIT",
    "source": "node_modules/esbuild/LICENSE.md",
    "sha256": "b40ec5baec7bb34fa5b1c09521fa3cd52d5fad7adafed74932a2010d3612a681"
  },
  {
    "package": "node_modules/fd-slicer",
    "version": "1.1.0",
    "license": "MIT",
    "source": "node_modules/fd-slicer/LICENSE",
    "sha256": "176d95320d565cb034d8323797b6cd6160238f625453687f98aad2085c46c3b3"
  },
  {
    "package": "node_modules/fs-extra",
    "version": "11.4.1",
    "license": "MIT",
    "source": "node_modules/fs-extra/LICENSE",
    "sha256": "c6a7de1428955aa5a692f4d3a3d3ede658d959616944713337cda296736442e1"
  },
  {
    "package": "node_modules/glob",
    "version": "14.0.6",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/glob/LICENSE.md",
    "sha256": "a49c9ba464796f65b59fca3f1e6ca40912df1e859f575383223f7ec6c5baae09"
  },
  {
    "package": "node_modules/graceful-fs",
    "version": "4.2.12",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/graceful-fs/LICENSE.md",
    "sha256": "8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004"
  },
  {
    "package": "node_modules/immediate",
    "version": "3.0.6",
    "license": "MIT",
    "source": "node_modules/immediate/LICENSE.txt",
    "sha256": "809e66de579fb7d92503848bbe6d1f348f4f6521a71e5d294fe7cc0c87a3b4ff"
  },
  {
    "package": "node_modules/inherits",
    "version": "2.0.4",
    "license": "ISC",
    "source": "node_modules/inherits/LICENSE",
    "sha256": "5ffe28e7ade7d8f10d85d5337a73fd793dac5c462fb9a28fbf8c5046c7fbca3b"
  },
  {
    "package": "node_modules/ini",
    "version": "4.1.3",
    "license": "ISC",
    "source": "node_modules/ini/LICENSE",
    "sha256": "4ec3d4c66cd87f5c8d8ad911b10f99bf27cb00cdfcff82621956e379186b016b"
  },
  {
    "package": "node_modules/is-docker",
    "version": "2.2.1",
    "license": "MIT",
    "source": "node_modules/is-docker/license",
    "sha256": "5c932d88256b4ab958f64a856fa48e8bd1f55bc1d96b8149c65689e0c61789d3"
  },
  {
    "package": "node_modules/is-fullwidth-code-point",
    "version": "3.0.0",
    "license": "MIT",
    "source": "node_modules/is-fullwidth-code-point/license",
    "sha256": "48da2f39e100d4085767e94966b43f4fa95ff6a0698fba57ed460914e35f94a0"
  },
  {
    "package": "node_modules/is-wsl",
    "version": "2.2.0",
    "license": "MIT",
    "source": "node_modules/is-wsl/license",
    "sha256": "48da2f39e100d4085767e94966b43f4fa95ff6a0698fba57ed460914e35f94a0"
  },
  {
    "package": "node_modules/isarray",
    "version": "1.0.0",
    "license": "MIT",
    "source": "https://raw.githubusercontent.com/juliangruber/isarray/2a23a281f369e9ae06394c0fb4d2381355a6ba33/README.md",
    "sha256": "ff138e683771b187f3629c383db72ee7d632009010a36d08e18e8d2a34222ec7"
  },
  {
    "package": "node_modules/isexe",
    "version": "2.0.0",
    "license": "ISC",
    "source": "node_modules/isexe/LICENSE",
    "sha256": "4ec3d4c66cd87f5c8d8ad911b10f99bf27cb00cdfcff82621956e379186b016b"
  },
  {
    "package": "node_modules/jeep-sqlite",
    "version": "2.8.0",
    "license": "MIT",
    "source": "node_modules/jeep-sqlite/LICENSE",
    "sha256": "9ea8a12deea1b232d639881e35b0540f8678315ebcc27053a9d8359bd78ad040"
  },
  {
    "package": "node_modules/jsonfile",
    "version": "6.2.1",
    "license": "MIT",
    "source": "node_modules/jsonfile/LICENSE",
    "sha256": "a9801fb52ba22ef808682a094da8a7a480584b7ed0dfd0d888ab543616335031"
  },
  {
    "package": "node_modules/jszip",
    "version": "3.10.2",
    "license": "(MIT OR GPL-3.0-or-later)",
    "source": "node_modules/jszip/LICENSE.markdown",
    "sha256": "566c953c6090b1218ca6217dd7359d45dde46581968586dc607d59a78af6a9c4"
  },
  {
    "package": "node_modules/kleur",
    "version": "4.1.5",
    "license": "MIT",
    "source": "node_modules/kleur/license",
    "sha256": "306fa513e39b23a6e8747520de761809d206b99800ef41907b530226574c59ae"
  },
  {
    "package": "node_modules/lie",
    "version": "3.3.0",
    "license": "MIT",
    "source": "node_modules/lie/license.md",
    "sha256": "5c81b0caa98593408b03125efa25efe622341ed87ae55561968828cd887d64a4"
  },
  {
    "package": "node_modules/localforage",
    "version": "1.10.0",
    "license": "Apache-2.0",
    "source": "node_modules/localforage/LICENSE",
    "sha256": "8c3c0576866d6c22f56cbe65b8ef20e63c8aa75ec58f8cd139a242edb42bf8f1"
  },
  {
    "package": "node_modules/localforage/node_modules/lie",
    "version": "3.1.1",
    "license": "MIT",
    "source": "node_modules/localforage/node_modules/lie/license.md",
    "sha256": "2a714679422aa639925ee1f9382e7fc4f9883c8f4b1452a21efe6ba589028484"
  },
  {
    "package": "node_modules/lru-cache",
    "version": "11.5.3",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/lru-cache/LICENSE.md",
    "sha256": "8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004"
  },
  {
    "package": "node_modules/minimatch",
    "version": "11.0.9",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/minimatch/LICENSE.md",
    "sha256": "2c7c5d22ed5a8ee968c64757710979afcd77438c48b4a265b94e615babd8a901"
  },
  {
    "package": "node_modules/minipass",
    "version": "7.1.3",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/minipass/LICENSE.md",
    "sha256": "8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004"
  },
  {
    "package": "node_modules/minizlib",
    "version": "3.1.0",
    "license": "MIT",
    "source": "node_modules/minizlib/LICENSE",
    "sha256": "df05697a04b8997c79d423930534e59cc18828f6e22d0c8c2d62fcbea1c4f50b"
  },
  {
    "package": "node_modules/ms",
    "version": "2.1.3",
    "license": "MIT",
    "source": "node_modules/ms/license.md",
    "sha256": "1662fae9b5314d11cf51284e2dcd1f006a354f7343f08712a730fcff9a359801"
  },
  {
    "package": "node_modules/native-run",
    "version": "2.1.0",
    "license": "MIT",
    "source": "node_modules/native-run/LICENSE",
    "sha256": "377f1a9763b9dd9dad730c1534fe2f215496eda131553a16f3f9251f559e3a59"
  },
  {
    "package": "node_modules/open",
    "version": "8.4.2",
    "license": "MIT",
    "source": "node_modules/open/license",
    "sha256": "5c932d88256b4ab958f64a856fa48e8bd1f55bc1d96b8149c65689e0c61789d3"
  },
  {
    "package": "node_modules/package-json-from-dist",
    "version": "1.0.1",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/package-json-from-dist/LICENSE.md",
    "sha256": "a49c9ba464796f65b59fca3f1e6ca40912df1e859f575383223f7ec6c5baae09"
  },
  {
    "package": "node_modules/pako",
    "version": "1.0.11",
    "license": "(MIT AND Zlib)",
    "source": "node_modules/pako/LICENSE",
    "sha256": "a04665b3b2de56c66730c1f720f528175739e4104f79073614aa611da1e85539"
  },
  {
    "package": "node_modules/path-key",
    "version": "3.1.1",
    "license": "MIT",
    "source": "node_modules/path-key/license",
    "sha256": "48da2f39e100d4085767e94966b43f4fa95ff6a0698fba57ed460914e35f94a0"
  },
  {
    "package": "node_modules/path-scurry",
    "version": "3.0.0",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/path-scurry/LICENSE.md",
    "sha256": "8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004"
  },
  {
    "package": "node_modules/pend",
    "version": "1.2.0",
    "license": "MIT",
    "source": "node_modules/pend/LICENSE",
    "sha256": "7e64acffcb0d20d33f5a86949ffd4a99ae045b10c7332a9c3a58635876c16880"
  },
  {
    "package": "node_modules/plist",
    "version": "3.1.1",
    "license": "MIT",
    "source": "node_modules/plist/LICENSE",
    "sha256": "3677dc86e6e5f119b500c308cc24cf533e2eb44c41050ea64584e049e5b70161"
  },
  {
    "package": "node_modules/process-nextick-args",
    "version": "2.0.1",
    "license": "MIT",
    "source": "node_modules/process-nextick-args/license.md",
    "sha256": "ecdccbcf39024f624ded480c01c0b25458e1eca8f26ecf040933865ce56d9a4f"
  },
  {
    "package": "node_modules/prompts",
    "version": "2.4.2",
    "license": "MIT",
    "source": "node_modules/prompts/license",
    "sha256": "ade66f698fd417addc4d948a85ef33e8abb302daff6453feda18b191d250e54d"
  },
  {
    "package": "node_modules/prompts/node_modules/kleur",
    "version": "3.0.3",
    "license": "MIT",
    "source": "node_modules/prompts/node_modules/kleur/license",
    "sha256": "306fa513e39b23a6e8747520de761809d206b99800ef41907b530226574c59ae"
  },
  {
    "package": "node_modules/readable-stream",
    "version": "2.3.8",
    "license": "MIT",
    "source": "node_modules/readable-stream/LICENSE",
    "sha256": "ec62dc96da0099b87f4511736c87309335527fb7031639493e06c95728dc8c54"
  },
  {
    "package": "node_modules/rimraf",
    "version": "6.1.4",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/rimraf/LICENSE.md",
    "sha256": "8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004"
  },
  {
    "package": "node_modules/safe-buffer",
    "version": "5.1.2",
    "license": "MIT",
    "source": "node_modules/safe-buffer/LICENSE",
    "sha256": "c7cc929b57080f4b9d0c6cf57669f0463fc5b39906344dfc8d3bc43426b30eac"
  },
  {
    "package": "node_modules/sax",
    "version": "1.1.4",
    "license": "ISC",
    "source": "node_modules/sax/LICENSE",
    "sha256": "3098be2717081cfe2b88a0faa221cb4f2326720cb8ce869199a9d6234f219319"
  },
  {
    "package": "node_modules/semver",
    "version": "7.8.6",
    "license": "ISC",
    "source": "node_modules/semver/LICENSE",
    "sha256": "4ec3d4c66cd87f5c8d8ad911b10f99bf27cb00cdfcff82621956e379186b016b"
  },
  {
    "package": "node_modules/setimmediate",
    "version": "1.0.5",
    "license": "MIT",
    "source": "node_modules/setimmediate/LICENSE.txt",
    "sha256": "c4b4ad3a5746f1f5249a6dd90396ec519264e1bb02e01e48a6522c48a3a97cb4"
  },
  {
    "package": "node_modules/shebang-command",
    "version": "2.0.0",
    "license": "MIT",
    "source": "node_modules/shebang-command/license",
    "sha256": "69dee148a2cc470554dfa7142e830662062394d0fe67cddd379aba90dc60d6b3"
  },
  {
    "package": "node_modules/shebang-regex",
    "version": "3.0.0",
    "license": "MIT",
    "source": "node_modules/shebang-regex/license",
    "sha256": "48da2f39e100d4085767e94966b43f4fa95ff6a0698fba57ed460914e35f94a0"
  },
  {
    "package": "node_modules/signal-exit",
    "version": "3.0.7",
    "license": "ISC",
    "source": "node_modules/signal-exit/LICENSE.txt",
    "sha256": "e05b1eaf5b5f99b7ad75cd1f38858ff9a311780b97715ead67936d60bf96aa7e"
  },
  {
    "package": "node_modules/simple-plist",
    "version": "1.3.1",
    "license": "MIT",
    "source": "node_modules/simple-plist/LICENSE",
    "sha256": "9ce8fc28ff49e651f98d6583b41ae1653dafaf6fc7444f3dfd13eb97451084bb"
  },
  {
    "package": "node_modules/simple-plist/node_modules/bplist-parser",
    "version": "0.3.1",
    "license": "MIT",
    "source": "https://raw.githubusercontent.com/nearinfinity/node-bplist-parser/3113315a9bdd8fa83e369d29af8cabfc3eee8f43/README.md",
    "sha256": "4a09c55c64d57abe284e09318763dcd69795ed7a201a84edf1bf8774c3b91a8e"
  },
  {
    "package": "node_modules/sisteransi",
    "version": "1.0.5",
    "license": "MIT",
    "source": "node_modules/sisteransi/license",
    "sha256": "ade66f698fd417addc4d948a85ef33e8abb302daff6453feda18b191d250e54d"
  },
  {
    "package": "node_modules/slice-ansi",
    "version": "4.0.0",
    "license": "MIT",
    "source": "node_modules/slice-ansi/license",
    "sha256": "c91d87c3bca16ab6d96d82da08edc54377d14b679547a331eecc4adef3c353c8"
  },
  {
    "package": "node_modules/split2",
    "version": "4.2.0",
    "license": "ISC",
    "source": "node_modules/split2/LICENSE",
    "sha256": "c372ef2fa1dfcb124ed807609751e75e3a009f108c5724916b489288fcb88a0c"
  },
  {
    "package": "node_modules/sql.js",
    "version": "1.17.0",
    "license": "MIT",
    "source": "node_modules/sql.js/LICENSE",
    "sha256": "60a3f6e4d7b29b4321359e683b36cf198d24f58e24582070f56e6fa89d5ee2be"
  },
  {
    "package": "node_modules/stream-buffers",
    "version": "2.2.0",
    "license": "Unlicense",
    "source": "https://raw.githubusercontent.com/samcday/node-stream-buffer/17024f70e0107175ede0ebcfbe9de7102d8be25f/UNLICENSE",
    "sha256": "ca2abdf695884c77ea4b4a5b64ca7b732d9d9dbade4eebc1c2e76c53e9e3bc83"
  },
  {
    "package": "node_modules/string_decoder",
    "version": "1.1.1",
    "license": "MIT",
    "source": "node_modules/string_decoder/LICENSE",
    "sha256": "11f2aafb37d06b3ee5bdaf06e9811141d0da05263c316f3d627f45c20d43261b"
  },
  {
    "package": "node_modules/string-width",
    "version": "4.2.3",
    "license": "MIT",
    "source": "node_modules/string-width/license",
    "sha256": "48da2f39e100d4085767e94966b43f4fa95ff6a0698fba57ed460914e35f94a0"
  },
  {
    "package": "node_modules/strip-ansi",
    "version": "6.0.1",
    "license": "MIT",
    "source": "node_modules/strip-ansi/license",
    "sha256": "48da2f39e100d4085767e94966b43f4fa95ff6a0698fba57ed460914e35f94a0"
  },
  {
    "package": "node_modules/tar",
    "version": "7.5.24",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/tar/LICENSE.md",
    "sha256": "8a1af140fdfbf5afd3df27f7e662f989c5b963a300020dfafce42033cae9e004"
  },
  {
    "package": "node_modules/through2",
    "version": "4.0.2",
    "license": "MIT",
    "source": "node_modules/through2/LICENSE.md",
    "sha256": "faae57631e1c7d641c3b6f9b110c2a7a28c8b383d08d7796ac472c509f075850"
  },
  {
    "package": "node_modules/through2/node_modules/readable-stream",
    "version": "3.6.2",
    "license": "MIT",
    "source": "node_modules/through2/node_modules/readable-stream/LICENSE",
    "sha256": "ec62dc96da0099b87f4511736c87309335527fb7031639493e06c95728dc8c54"
  },
  {
    "package": "node_modules/tree-kill",
    "version": "1.2.2",
    "license": "MIT",
    "source": "node_modules/tree-kill/LICENSE",
    "sha256": "33eba3cb810ee4b03426ec7fecf22e7529e2fe95f8163e7213016459bee7a276"
  },
  {
    "package": "node_modules/tslib",
    "version": "2.9.1",
    "license": "0BSD",
    "source": "node_modules/tslib/LICENSE.txt",
    "sha256": "210b19e543130388c68654b7497e967119ce17145f66ab7d85688fbd70f08751"
  },
  {
    "package": "node_modules/typescript",
    "version": "5.8.3",
    "license": "Apache-2.0",
    "source": "node_modules/typescript/LICENSE.txt",
    "sha256": "a7d00bfd54525bc694b6e32f64c7ebcf5e6b7ae3657be5cc12767bce74654a47"
  },
  {
    "package": "node_modules/undici-types",
    "version": "8.9.0",
    "license": "MIT",
    "source": "node_modules/undici-types/LICENSE",
    "sha256": "a6db8096b2707bc0102d256917d4d33f298ba36d8c3f25de067a2b5bb379db27"
  },
  {
    "package": "node_modules/universalify",
    "version": "2.0.1",
    "license": "MIT",
    "source": "node_modules/universalify/LICENSE",
    "sha256": "3fda5977c0904e226190b4e21d64340c1731e2142d6fe5f3dee0090a216b8b63"
  },
  {
    "package": "node_modules/untildify",
    "version": "4.0.0",
    "license": "MIT",
    "source": "node_modules/untildify/license",
    "sha256": "48da2f39e100d4085767e94966b43f4fa95ff6a0698fba57ed460914e35f94a0"
  },
  {
    "package": "node_modules/util-deprecate",
    "version": "1.0.2",
    "license": "MIT",
    "source": "node_modules/util-deprecate/LICENSE",
    "sha256": "0154425673db15cdfa80ecba2c9b1f1a867f7197a006764712849bfc3a93cbb7"
  },
  {
    "package": "node_modules/which",
    "version": "2.0.2",
    "license": "ISC",
    "source": "node_modules/which/LICENSE",
    "sha256": "4ec3d4c66cd87f5c8d8ad911b10f99bf27cb00cdfcff82621956e379186b016b"
  },
  {
    "package": "node_modules/wrap-ansi",
    "version": "7.0.0",
    "license": "MIT",
    "source": "node_modules/wrap-ansi/license",
    "sha256": "5c932d88256b4ab958f64a856fa48e8bd1f55bc1d96b8149c65689e0c61789d3"
  },
  {
    "package": "node_modules/xcode",
    "version": "4.0.0",
    "license": "Apache-2.0",
    "source": "node_modules/xcode/LICENSE",
    "sha256": "cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30"
  },
  {
    "package": "node_modules/xml2js",
    "version": "0.6.2",
    "license": "MIT",
    "source": "node_modules/xml2js/LICENSE",
    "sha256": "c51452ef1dfd5606c9fe266930fa6bf7e8a534d52973b6475df5bf212cad5b0a"
  },
  {
    "package": "node_modules/xml2js/node_modules/xmlbuilder",
    "version": "11.0.1",
    "license": "MIT",
    "source": "node_modules/xml2js/node_modules/xmlbuilder/LICENSE",
    "sha256": "e368bc4263b466cf98c225af15e300549e00da8859416a4536109e9654d434a8"
  },
  {
    "package": "node_modules/xmlbuilder",
    "version": "15.1.1",
    "license": "MIT",
    "source": "node_modules/xmlbuilder/LICENSE",
    "sha256": "e368bc4263b466cf98c225af15e300549e00da8859416a4536109e9654d434a8"
  },
  {
    "package": "node_modules/yallist",
    "version": "5.0.0",
    "license": "BlueOak-1.0.0",
    "source": "node_modules/yallist/LICENSE.md",
    "sha256": "a49c9ba464796f65b59fca3f1e6ca40912df1e859f575383223f7ec6c5baae09"
  },
  {
    "package": "node_modules/yauzl",
    "version": "2.10.0",
    "license": "MIT",
    "source": "node_modules/yauzl/LICENSE",
    "sha256": "b303783d5eb7ca50b853ffa5f145e4e7998fab339831d848f507ca6cd970577a"
  }
]
```

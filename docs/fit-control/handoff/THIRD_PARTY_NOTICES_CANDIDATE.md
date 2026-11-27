# Third-party notice inventory — C068
Internal synthetic acceptance only; NOT a complete distribution notice or legal clearance.
Source lock SHA256 7f2abd99210915f487ee70f6b646fae4899cb8843caffea1d99cd3e0d88adfc5. CI run 46009086263, job 140539667370: 120 packages installed with scripts disabled; esbuild API PASS; 112 package directories had matching license filenames, eight did not. npm audit zero findings in C061, not a security guarantee.

Build-only candidates: @esbuild/linux-x64, @rollup/rollup-linux-x64-gnu, @rollup/rollup-linux-x64-musl, bplist-parser (both versions), emoji-regex, stream-buffers. isarray is potential runtime. Verify actual esbuild metafile and native dependency graph; dev flag alone is not proof. JSZip dual license: select MIT and retain original notice. Preserve MIT/ISC/Apache/BlueOak/Unlicense/0BSD/Zlib applicable texts and copyright; no invented copyright holders.

## APK acceptance criteria
- Exact source and lock hashes, synthetic flag 1, no real data, no production signing or publishing.
- Record esbuild metafile inputs and native Gradle runtimeClasspath; map resolved versions to source license texts including native AAR/JAR and shared libraries. Inspect nested license/notice/readme files and upstream exact-version source for eight missing names. Do not assume absent filename means no license.
- Verify APK web payload against generated www using verify_android_apk.py; inspect manifest, application ID, debuggable flag, permissions, native ABIs, signature and SHA256. No unexpected host tooling or credentials in packaged payload.
- Distribution gate remains OPEN until complete original notices and native dependency inventory are reviewed. Internal build gate remains subject to canonical checkpoint and owner restrictions; no APK claim from this inventory.

## Locked npm inventory (metadata only)
```tsv
package	version	license	lock classification	integrity
@capacitor-community/sqlite	8.1.1	MIT	potential-runtime	sha512-wsqscMOMveDeIvB9WHLm38jkUV2317LmuWvvbhvmOB1REdr8GH6weFZpAiKmLimbpP2CQ2eVs8nmRcrTqbd9ng==
@capacitor/android	8.6.3	MIT	potential-runtime	sha512-hTRLGYBUr7UoFSvn+1dnTwgPV7q0FgcTAVA6Y2i0wYzEkq3vR3oSaIs6ERO8WiqeIAupbbL74iG3OwM7BA1bcQ==
@capacitor/cli	8.6.3	MIT	dev	sha512-HBZ5mb9CNv5TzEW+vjB3aWKi7JIZRb7ExxsVaH/OLd19qXlarWxc2vUXAKtM6Zl2LmTb/rX8hN1q1BvwO7gb7w==
@capacitor/core	8.6.3	MIT	potential-runtime	sha512-WJ/DM2OTriEED5sI4jUyJU0NL3QJ/YenS2+SepW/nghMA5ixFJhm8NqGWdqDYYg+eRtJkjD8PcXtIxy4zTP0PA==
@capacitor/ios	8.6.3	MIT	potential-runtime	sha512-6J51zrE2pjH5SuQJ7n8WfffDGKeK1N504cydhxiuY5R0gfndyIajnhmhPlyA6BYKXObVC3ylwXPBdwFiInGvTA==
@esbuild/aix-ppc64	0.28.2	MIT	dev	sha512-XExcO+dvLKvVtNTibSTBej1NCAbaGhWn9Ww1ZPx80qsahhPFe/8jgWP0IchNe0F3HwkU7n8ejhH8bjonqht8mQ==
@esbuild/android-arm	0.28.2	MIT	dev	sha512-kXXoiPVVGQcnIYGOeaovwOURpniDBpSq4A03qkQ+BMQqtGG6HYap3xne9C1O1yo4TR3qxlCX5IqqmX6fFo2Lqg==
@esbuild/android-arm64	0.28.2	MIT	dev	sha512-5YfKeeI8qWfBZIX+u2xZC3Zlb3Os/gLS2sbEKM+I4ZOcsWmHS2WLysCcQZDAFRslDUU5Oiq44gf6PYN1vGwG5A==
@esbuild/android-x64	0.28.2	MIT	dev	sha512-O387ite7SzUyCcy3JQX4P4bLtEA7bLLkx+esve5JHnyYfNTxcVpXZo9jhdB0lTKN44gztELTdU7nS8Nr16Fs1Q==
@esbuild/darwin-arm64	0.28.2	MIT	dev	sha512-n4KqkOQrraxHJcgjM1RvwbigfQKIKJVpM7xp+KsxiyUSrRdIXnt73VhrPAx0fV44hgfmIVKjxMN9J1t5jySVkw==
@esbuild/darwin-x64	0.28.2	MIT	dev	sha512-uq6suIWYP37qzGddBKPw5QEQPi6HiLGsO7UmkpfyaYNQ3D+rN6w6WfwH+nuqcGXWvawGwxOEroO4YGnFh95azw==
@esbuild/freebsd-arm64	0.28.2	MIT	dev	sha512-n+I0BTSRIoy+d6RPKnEVwql5UwBJolytvY4mAOIEJorKlqgPII8ix6slVVrfZ5Tnj7glIZvloylbB/EJPMWEXw==
@esbuild/freebsd-x64	0.28.2	MIT	dev	sha512-78XJTJkvPs0kz2w61301PJjXl4g7q3JqiYMZ/M/yVI73EHBrCRTgkhu9oqG7vPqq+a/yadEW8aD+agKlk5xrmg==
@esbuild/linux-arm	0.28.2	MIT	dev	sha512-XlDnu2q5yoqems+xay6wSAcg9DDD7K9RLKZEBOMZm3ckNpJBvOX20tSfby8KfrrhINDyv9V2YVZKY/SpoGJI8w==
@esbuild/linux-arm64	0.28.2	MIT	dev	sha512-pW4AC0P3it8c7do9MVM4p51FzHzdM/TZrerurgRcHJ2WTa1VQ1CIq18xncfpBJw4ojkiZZrKW2yIBWBP92j6Ug==
@esbuild/linux-ia32	0.28.2	MIT	dev	sha512-CYbnj78HsIeA+DhgUKgFCfvNsTHFhMMrinUrMZpDXJXKN8T3XViTZ/+wtHeVxEWY8ewSzTFN+nRmSwO2tZaLUQ==
@esbuild/linux-loong64	0.28.2	MIT	dev	sha512-buwkd8nsph4R+ajRvw0qM5Hja/TXQow3ptzWO2EbG/cqcIkHloRrdlBtQlshyYGTNFvfkfJ5tpPLVkY4DtsPfQ==
@esbuild/linux-mips64el	0.28.2	MIT	dev	sha512-ZVykbDyk7519VwiNb9Lcj9m8XM6v5V9uKPvrEMkkEedVewf+0itkhahp4HDpgERXhwLRpWFypsGbG/J8s0QjJA==
@esbuild/linux-ppc64	0.28.2	MIT	dev	sha512-CAXl+Dtd9UUuJd8pKKdwh6MLm3MUMiqMPmhZ3tTSXPqfyQ3vDl6R5hZdZ/kYojK4ofXtdfSv1tFq8XzWx3heNQ==
@esbuild/linux-riscv64	0.28.2	MIT	dev	sha512-GeXCej4IQtU1B+QlDV8W/RRvbzI3O/Stss+/bCXv4lZls5WGRtu2a+3JkA3i4qIUlMXpcHebWpF8AkJhATowuA==
@esbuild/linux-s390x	0.28.2	MIT	dev	sha512-3H1weTYZPxt/WOhByszQZybS9w5lKzUn1FDMsgEChbHWQwHYQQRfBxgCcZvPhjHfKyJjIievvMmEUawJrdY9Dg==
@esbuild/linux-x64	0.28.2	MIT	dev	sha512-4xTZr1FUmSoQW4XIWmit3tzQrUTZM+N3P0XV8xROKYF50XfI7xeO90+1bZvNwxIufQ9hDQVRJH5YhgPVF8A/HQ==
@esbuild/netbsd-arm64	0.28.2	MIT	dev	sha512-sSATRjPeDBg3pdgHoQfoYBob11Kk1FGa9lui5RIHZCoCkJa9QKlvl3/vKz2usCmYYjs7ymJR/2Nnsqe+Hjt5nw==
@esbuild/netbsd-x64	0.28.2	MIT	dev	sha512-lqnzCV+mM0gIADaKihiCg6ifgfU2L3h5E33rNQBN1Y4MaVGnzryzmvvf7UHxprpQdE8hpqLolJ9Rl+SkIRDpyw==
@esbuild/openbsd-arm64	0.28.2	MIT	dev	sha512-AL2qJILH7lNjrDmCQDvdxMfAUIv8KMNZOvrwAQ8i8//ntL9FflhOyMJ8OZSMBb8/AWXe3/5v5S20y3zCoZWKoQ==
@esbuild/openbsd-x64	0.28.2	MIT	dev	sha512-QtiuPytchRyC4rwUKhexJdQKvDuZ6hWloi3igqPQNUJCS1/v9EiO3UTOXR6A3FoMo4fnAKbWJdqaIwhOzh8qEw==
@esbuild/openharmony-arm64	0.28.2	MIT	dev	sha512-WkhYDmpTjLvGlScA1rwjRUmhl4k8oXR3cIbtqWmELgU/dFeHHlEllxDvdWcNJV9rbzCexB5vz8gtNewWLgCT7Q==
@esbuild/sunos-x64	0.28.2	MIT	dev	sha512-GPMSkTOtMnv2U2F8gxe4Io6qmVs+YKyp832Etqqxr0hFngmXQ3rzwytelm3GIn7T4VviRUlf3sOgBOiTdvaf7g==
@esbuild/win32-arm64	0.28.2	MIT	dev	sha512-PIhhEkE9uPBleRBrQEJpUn7MBnibZzbGzYWPmY3x+YoVg/95zbjB4CxPPOQ8l5tYYM4mMaCthF8/1DIfBQQyWQ==
@esbuild/win32-ia32	0.28.2	MIT	dev	sha512-YmJbfTlvU7Sdn9BB+4PRES4oB6pxgS37MAONj+hBr/cpXS1aBPKXxNnDbu+QCWPj0o9dgyxeq79g6c5P8KeuYA==
@esbuild/win32-x64	0.28.2	MIT	dev	sha512-5ebpxr3nWMzrL/rnUI755Jkuee0bHL/Gq0WTF9lvcpv73wAp5eu8MfBUgWK9bhWvZjj7yX8etf/8tI8Ney695g==
@ionic/cli-framework-output	2.2.8	MIT	dev	sha512-TshtaFQsovB4NWRBydbNFawql6yul7d5bMiW1WYYf17hd99V6xdDdk3vtF51bw6sLkxON3bDQpWsnUc9/hVo3g==
@ionic/utils-array	2.1.6	MIT	dev	sha512-0JZ1Zkp3wURnv8oq6Qt7fMPo5MpjbLoUoa9Bu2Q4PJuSDWM8H8gwF3dQO7VTeUj3/0o1IB1wGkFWZZYgUXZMUg==
@ionic/utils-fs	3.1.7	MIT	dev	sha512-2EknRvMVfhnyhL1VhFkSLa5gOcycK91VnjfrTB0kbqkTFCOXyXgVLI5whzq7SLrgD9t1aqos3lMMQyVzaQ5gVA==
@ionic/utils-fs/node_modules/fs-extra	9.1.0	MIT	dev	sha512-hcg3ZmepS30/7BSFqRvoo3DOMQu7IjqxO5nCDt+zM9XWjb33Wg7ziNT+Qvqbuc3+gWpzO02JubVyk2G4Zvo1OQ==
@ionic/utils-object	2.1.6	MIT	dev	sha512-vCl7sl6JjBHFw99CuAqHljYJpcE88YaH2ZW4ELiC/Zwxl5tiwn4kbdP/gxi2OT3MQb1vOtgAmSNRtusvgxI8ww==
@ionic/utils-process	2.1.12	MIT	dev	sha512-Jqkgyq7zBs/v/J3YvKtQQiIcxfJyplPgECMWgdO0E1fKrrH8EF0QGHNJ9mJCn6PYe2UtHNS8JJf5G21e09DfYg==
@ionic/utils-stream	3.1.7	MIT	dev	sha512-eSELBE7NWNFIHTbTC2jiMvh1ABKGIpGdUIvARsNPMNQhxJB3wpwdiVnoBoTYp+5a6UUIww4Kpg7v6S7iTctH1w==
@ionic/utils-subprocess	3.0.1	MIT	dev	sha512-cT4te3AQQPeIM9WCwIg8ohroJ8TjsYaMb2G4ZEgv9YzeDqHZ4JpeIKqG2SoaA3GmVQ3sOfhPM6Ox9sxphV/d1A==
@ionic/utils-terminal	2.3.5	MIT	dev	sha512-3cKScz9Jx2/Pr9ijj1OzGlBDfcmx7OMVBt4+P1uRR0SSW4cm1/y3Mo4OY3lfkuaYifMNBW8Wz6lQHbs1bihr7A==
@isaacs/fs-minipass	4.0.1	ISC	dev	sha512-wgm9Ehl2jpeqP3zw/7mo3kRHFp5MEDhqAdwy1fTGkHAwnkGOVsgpvQhL8B5n1qlb01jV3n/bI0ZfZp5lWA1k4w==
@isaacs/nonrecursive-glob-match	1.1.0	BlueOak-1.0.0	dev	sha512-GPm/Dbvk5RLmhRnxXIa7nTpK0xtl4E0wj0MslsuNiJ1FIROU+2+9lgUC/dgF7Ey4QCWhfEsgxilMRMCdHPfDfw==
@rollup/rollup-darwin-arm64	4.44.0	MIT	potential-runtime	sha512-VGF3wy0Eq1gcEIkSCr8Ke03CWT+Pm2yveKLaDvq51pPpZza3JX/ClxXOCmTYYq3us5MvEuNRTaeyFThCKRQhOA==
@rollup/rollup-darwin-x64	4.44.0	MIT	potential-runtime	sha512-fBkyrDhwquRvrTxSGH/qqt3/T0w5Rg0L7ZIDypvBPc1/gzjJle6acCpZ36blwuwcKD/u6oCE/sRWlUAcxLWQbQ==
@rollup/rollup-linux-arm64-gnu	4.44.0	MIT	potential-runtime	sha512-ZTR2mxBHb4tK4wGf9b8SYg0Y6KQPjGpR4UWwTFdnmjB4qRtoATZ5dWn3KsDwGa5Z2ZBOE7K52L36J9LueKBdOQ==
@rollup/rollup-linux-arm64-musl	4.44.0	MIT	potential-runtime	sha512-GFWfAhVhWGd4r6UxmnKRTBwP1qmModHtd5gkraeW2G490BpFOZkFtem8yuX2NyafIP/mGpRJgTJ2PwohQkUY/Q==
@rollup/rollup-linux-x64-gnu	4.44.0	MIT	potential-runtime	sha512-iUVJc3c0o8l9Sa/qlDL2Z9UP92UZZW1+EmQ4xfjTc1akr0iUFZNfxrXJ/R1T90h/ILm9iXEY6+iPrmYB3pXKjw==
@rollup/rollup-linux-x64-musl	4.44.0	MIT	potential-runtime	sha512-PQUobbhLTQT5yz/SPg116VJBgz+XOtXt8D1ck+sfJJhuEsMj2jSej5yTdp8CvWBSceu+WW+ibVL6dm0ptG5fcA==
@rollup/rollup-win32-arm64-msvc	4.44.0	MIT	potential-runtime	sha512-M0CpcHf8TWn+4oTxJfh7LQuTuaYeXGbk0eageVjQCKzYLsajWS/lFC94qlRqOlyC2KvRT90ZrfXULYmukeIy7w==
@rollup/rollup-win32-x64-msvc	4.44.0	MIT	potential-runtime	sha512-Q2Mgwt+D8hd5FIPUuPDsvPR7Bguza6yTkJxspDGkZj7tBRn2y4KSWYuIXpftFSjBra76TbKerCV7rgFPQrn+wQ==
@stencil/core	4.45.5	MIT	potential-runtime	sha512-tz6h9MI/s0WwNsfGbSguo9+xnerWam8NI8/U3VUS9MNMviTYyg3Ymz5XniSM9PGFnbd2xhhmyJhHHaFmy9mYog==
@types/fs-extra	8.1.5	MIT	dev	sha512-0dzKcwO+S8s2kuF5Z9oUWatQJj5Uq/iqphEtE3GQJVRRYm/tD1LglU2UnXi2A8jLq5umkGouOXOR9y0n613ZwQ==
@types/node	26.6.11	MIT	dev	sha512-uUyQ2XLEz+EXh34lmS3GhKrkqn/8FU7KUiKRpk347At2bmnMVWss45yz8b4FG/tUtmV1tV/+TVkITItPROyeeQ==
@types/slice-ansi	4.0.0	MIT	dev	sha512-+OpjSaq85gvlZAYINyzKpLeiFkSC4EsC6IIiT6v6TLSU5k5U83fHGj9Lel8oKEXM0HqgrMVCjXPDPVICtxF7EQ==
@xmldom/xmldom	0.9.12	MIT	dev	sha512-5AXjrcMClTryPe9LgZrygpB1lj7s0S9E0+W+AHaVKAVyHanafK86iPSvG5xHVSp/jC+VH1UXu0TAEmY279xH7A==
ansi-regex	5.0.1	MIT	dev	sha512-quJQXlTSUGL2LH9SUXo8VwsY4soanhgo6LNSm84E1LBcE8s3O0wpdiRzyR9z/ZZJMlMWv37qOOb9pdJlMUEKFQ==
ansi-styles	4.3.0	MIT	dev	sha512-zbB9rCJAT1rbjiVDb2hqKFHNYLxgtk8NURxZ3IZwD3F6NtxbXZQCnnSi1Lkx+IDohdPlFp222wVALIheZJQSEg==
astral-regex	2.0.0	MIT	dev	sha512-Z7tMw1ytTXt5jqMcOP+OQteU1VuNK9Y02uuJtKQ1Sv69jXQKKg5cibLwGJow8yzZP+eAc18EmLGPal0bp36rvQ==
at-least-node	1.0.0	ISC	dev	sha512-+q/t7Ekv1EDY2l6Gda6LLiX14rU9TV20Wa3ofeQmwPFZbOMo9DXrLbOjFaaclkXKWidIaopwAObQDqwWtGUjqg==
balanced-match	4.0.4	MIT	dev	sha512-BLrgEcRTwX2o6gGxGOCNyMvGSp35YofuYzw9h1IMTRmKqttAZZVU67bdb9Pr2vUHA8+j3i2tJfjO6C6+4myGTA==
base64-js	1.5.1	MIT	dev	sha512-AKpaYlHn8t4SVbOHCy+b5+KKgvR4vrsD8vbvrbiQJps7fKDTkjkDry6ji0rUJjC0kzbNePLwzxq8iypo41qeWA==
big-integer	1.6.52	Unlicense	dev	sha512-QxD8cf2eVqJOOz63z6JIN9BzvVs/dlySa5HGSBH5xtR8dPteIRQnBxxKqkNTiT6jbDTF6jAfrd4oMcND9RGbQg==
bplist-creator	0.1.0	MIT	dev	sha512-sXaHZicyEEmY86WyueLTQesbeoH/mquvarJaQNbjuOQO+7gbFcDEWqKmcWA4cOTLzFlfgvkiVxolk1k5bBIpmg==
bplist-parser	0.3.2	MIT	dev	sha512-apC2+fspHGI3mMKj+dGevkGo/tCqVB8jMb6i+OX+E29p0Iposz07fABkRIfVUPNd5A5VbuOz1bZbnmkKLYF+wQ==
brace-expansion	5.1.0	MIT	dev	sha512-aa11Dv491GKnYqxaul3aRJ0szew7yMJMfZPnqD44NjGrZXoj62l41OEDDpdpC4eE2P88vBFfLuSyRhpG91NUvg==
browser-fs-access	0.35.0	Apache-2.0	potential-runtime	sha512-sLoadumpRfsjprP8XzVjpQc0jK8yqHBx0PtUTGYj2fftT+P/t+uyDAQdMgGAPKD011in/O+YYGh7fIs0oG/viw==
buffer-crc32	0.2.13	MIT	dev	sha512-VO9Ht/+p3SN7SKWqcrgEzjGbRSJYTx+Q1pTQC0wrWqHx0vpJraQ6GtHx8tvcg1rlK1byhU5gccxgOgj7B0TDkQ==
chownr	3.0.0	BlueOak-1.0.0	dev	sha512-+IxzY9BZOQd/XuYPRmrvEVjF/nqj5kgT4kEq7VofrDoM1MxoRjEWkrCC3EtLi59TVawxTAn+orJwFQcrqEN1+g==
color-convert	2.0.1	MIT	dev	sha512-RRECPsj7iu/xb5oKYcsFHSppFNnsj/52OVTRKb4zP5onXwVF3zVmmToNcOfGC+CRDpfK/U584fMg38ZHCaElKQ==
color-name	1.1.4	MIT	dev	sha512-dOy+3AuW3a2wNbZHIuMZpTcgjGuLU/uBL/ubcZF9OXbDo8ff4O8yVp5Bf0efS8uEoYo5q4Fx7dY9OgQGXgAsQA==
commander	12.1.0	MIT	dev	sha512-Vw8qHK3bZM9y/P10u3Vib8o/DdkvA2OtPtZvD871QKjy74Wj1WSKFILMPRPSdUSx5RFK1arlJzEtA4PkFgnbuA==
core-util-is	1.0.3	MIT	potential-runtime	sha512-ZQBvi1DcpJ4GDqanjucZ2Hj3wEO5pZDS89BWbkcrvdxksJorwUDDZamX9ldFkp9aw2lmBDLgkObEA4DWNJ9FYQ==
cross-spawn	7.0.6	MIT	dev	sha512-uV2QOWP2nWzsy2aMp8aRibhi9dlzF5Hgh5SHaB9OiTGEyDTiJJyx0uy51QXdyWbtAHNua4XJzUKca3OzKUd3vA==
debug	4.4.3	MIT	dev	sha512-RGwwWnwQvkVfavKVt22FGLw+xYSdzARwm0ru6DhTVA3umU5hZc28V3kO4stgYryrTlLpuvgI9GiijltAjNbcqA==
define-lazy-prop	2.0.0	MIT	dev	sha512-Ds09qNh8yw3khSjiJjiUInaGX9xlqZDY7JVryGxdxV7NPeuqQfplOpQ66yJFZut3jLa5zOwkXw1g9EI2uKh4Og==
elementtree	0.1.7	Apache-2.0	dev	sha512-wkgGT6kugeQk/P6VZ/f4T+4HB41BVgNBq5CDIZVbQ02nvTVqAiVTbskxxu3eA/X96lMlfYOwnLQpN2v5E1zDEg==
emoji-regex	8.0.0	MIT	dev	sha512-MSjYzcWNOA0ewAHpz0MxpYFvwg6yjy1NG3xteoqz644VCo/RPgnr1/GGt+ic3iJTzQ8Eu3TdM14SawnVUmGE6A==
env-paths	2.2.1	MIT	dev	sha512-+h1lkLKhZMTYjog1VEpJNG7NZJWcuc2DDk/qsqSTRRCOXiLjeQ1d1/udrUGhqMxUgAlwKNZ0cf2uqan5GLuS2A==
esbuild	0.28.2	MIT	dev	sha512-HKVLS8dvII+xoKW9kmqxbRKrnWEXfJJr/FZhhJmiqIB0e053QNYFqOBouTMO/k5sID4MvCiUCvv8b9M4h32wIA==
fd-slicer	1.1.0	MIT	dev	sha512-cE1qsB/VwyQozZ+q1dGxR8LBYNZeofhEdUNGSMbQD3Gw2lAzX9Zb3uIU6Ebc/Fmyjo9AWWfnn0AUCHqtevs/8g==
fs-extra	11.4.1	MIT	dev	sha512-KYAb4c9BJQI6QqGKthV68OHe0badztdXJWKo0WtBA9IuCFPTKvE5ZdUBglP833aMjhaSPNO4A5j/EkzZtGlKjA==
glob	14.0.6	BlueOak-1.0.0	dev	sha512-OwXjVP2svY5EyLY75Vek96C8qK43gqrt4xsZ+qSILdnaEiJPXkd62mcfUSNx/TQErQRdu5uM5kF67sfONragKw==
graceful-fs	4.2.12	BlueOak-1.0.0	dev	sha512-iuyGF2E4oafQfPsRrG2wtY2ILupMhvtdrhzrxB+0VcjsPpSPttpfYdjnGFGsTi5MaJFjI1jOKHPQ6UTbTj9TAw==
immediate	3.0.6	MIT	potential-runtime	sha512-XXOFtyqDjNDAQxVfYxuF7g9Il/IbWmmlQg2MYKOH8ExIT1qg6xc4zyS3HaEEATgs1btfzxq15ciUiY7gjSXRGQ==
inherits	2.0.4	ISC	potential-runtime	sha512-k/vGaX4/Yla3WzyMCvTQOXYeIHvqOKtnqBduzTHpzpQZzAskKMhZ2K+EnBiSM9zGSoIFeMpXKxa4dYeZIQqewQ==
ini	4.1.3	ISC	dev	sha512-X7rqawQBvfdjS10YU1y1YVreA3SsLrW9dX2CewP2EbBJM4ypVNLDkO5y04gejPwKIY9lR+7r9gn3rFPt/kmWFg==
is-docker	2.2.1	MIT	dev	sha512-F+i2BKsFrH66iaUFc0woD8sLy8getkwTwtOBjvs56Cx4CgJDeKQeqfz8wAYiSb8JOprWhHH5p77PbmYCvvUuXQ==
is-fullwidth-code-point	3.0.0	MIT	dev	sha512-zymm5+u+sCsSWyD9qNaejV3DFvhCKclKdizYaJUuHA83RLjb7nSuGnddCHGv0hk+KY7BMAlsWeK4Ueg6EV6XQg==
is-wsl	2.2.0	MIT	dev	sha512-fKzAra0rGJUUBwGBgNkHZuToZcn+TtXHpeCgmkMJMMYx1sQDYaCSyjJBSCa2nH1DGm7s3n1oBnohoVTBaN7Lww==
isarray	1.0.0	MIT	potential-runtime	sha512-VLghIWNM6ELQzo7zwmcg0NmTVyWKYjvIeM83yjp0wRDTmUnrM678fQbcKBo6n2CJEF0szoG//ytg+TKla89ALQ==
isexe	2.0.0	ISC	dev	sha512-RHxMLp9lnKHGHRng9QFhRCMbYAcVpn69smSGcq3f36xjgVVWThj4qqLbTLlq7Ssj8B+fIQ1EuCEGI2lKsyQeIw==
jeep-sqlite	2.8.0	MIT	potential-runtime	sha512-FWNUP6OAmrUHwiW7H1xH5YUQ8tN2O4l4psT1sLd7DQtHd5PfrA1nvNdeKPNj+wQBtu7elJa8WoUibTytNTaaCg==
jsonfile	6.2.1	MIT	dev	sha512-zwOTdL3rFQ/lRdBnntKVOX6k5cKJwEc1HdilT71BWEu7J41gXIB2MRp+vxduPSwZJPWBxEzv4yH1wYLJGUHX4Q==
jszip	3.10.2	(MIT OR GPL-3.0-or-later)	potential-runtime	sha512-3l+rb15IOWtUhU0H5MFqES/T6Kh7abYwjosBey/vD6hDt8zoEffkSC5Ws5SGtgVw3gBx2NEbhTeSW1+kWkpyTQ==
kleur	4.1.5	MIT	dev	sha512-o+NO+8WrRiQEE4/7nwRJhN1HWpVmJm511pBHUxPLtp0BUISzlBplORYSmTclCnJvQq2tKu/sgl3xVpkc7ZWuQQ==
lie	3.3.0	MIT	potential-runtime	sha512-UaiMJzeWRlEujzAuw5LokY1L5ecNQYZKfmyZ9L7wDHb/p5etKaxXhohBcrw0EYby+G/NA52vRSN4N39dxHAIwQ==
localforage	1.10.0	Apache-2.0	potential-runtime	sha512-14/H1aX7hzBBmmh7sGPd+AOMkkIrHM3Z1PAyGgZigA1H1p5O5ANnMyWzvpAETtG68/dC4pC0ncy3+PPGzXZHPg==
localforage/node_modules/lie	3.1.1	MIT	potential-runtime	sha512-RiNhHysUjhrDQntfYSfY4MU24coXXdEOgw9WGcKHNeEwffDYbF//u87M1EWaMGzuFoSbqW0C9C6lEEhDOAswfw==
lru-cache	11.5.3	BlueOak-1.0.0	dev	sha512-U4N8FgzmWxc8k1VH8Kr6lQg18U7Fjvby6wXHVRX/ZZ7IwWbRMgrRbP0Wrb5q5NVinryp4SQampHKdvtecItxUg==
minimatch	11.0.9	BlueOak-1.0.0	dev	sha512-KCFkfyjqerNlSstjlhIGNXIKZGA/6O4V4RlhZ+Dsr621SPPw0mzlypE9D9ZOoPiVefHID+j7/XuMMlqfD/F60Q==
minipass	7.1.3	BlueOak-1.0.0	dev	sha512-tEBHqDnIoM/1rXME1zgka9g6Q2lcoCkxHLuc7ODJ5BxbP5d4c2Z5cGgtXAku59200Cx7diuHTOYfSBD8n6mm8A==
minizlib	3.1.0	MIT	dev	sha512-KZxYo1BUkWD2TVFLr0MQoM8vUUigWD3LlD83a/75BqC+4qE0Hb1Vo5v1FgcfaNXvfXzr+5EhQ6ing/CaBijTlw==
ms	2.1.3	MIT	dev	sha512-6FlzubTLZG3J2a/NVCAleEhjzq5oxgHyaCU9yYXvcLsvoVaHJq/s5xXI6/XXP6tz7R9xAOtHnSO/tXtF3WRTlA==
native-run	2.1.0	MIT	dev	sha512-JhEph/fyMwBHmMLiZ1OZX8X92+N1gt5+/ecLtgeRbyDHIyIW7EDt0A3kBZu594y1P4yKDr1CIHe+DDYQ7ZlKjg==
open	8.4.2	MIT	dev	sha512-7x81NCL719oNbsq/3mh+hVrAWmFuEYUqrq/Iw3kUzH8ReypT9QQ0BLoJS7/G9k6N81XjW4qHWtjWwe/9eLy1EQ==
package-json-from-dist	1.0.1	BlueOak-1.0.0	dev	sha512-UEZIS3/by4OC8vL3P2dTXRETpebLI2NiI5vIrjaD/5UtrkFX/tNbwjTSRAGC/+7CAo2pIcBaRgWmcBBHcsaCIw==
pako	1.0.11	(MIT AND Zlib)	potential-runtime	sha512-4hLB8Py4zZce5s4yd9XzopqwVv/yGNhV1Bl8NTmCq1763HeK2+EwVTv+leGeL13Dnh2wfbqowVPXCIO0z4taYw==
path-key	3.1.1	MIT	dev	sha512-ojmeN0qd+y0jszEtoY48r0Peq5dwMEkIlCOu6Q5f41lfkswXuKtYrhgoTpLnyIcHm24Uhqx+5Tqm2InSwLhE6Q==
path-scurry	3.0.0	BlueOak-1.0.0	dev	sha512-1pTbQqH1wIwMi/eleQ5leFTTCkzFsPcgXNjwOA8YGGW/W4/kHT3dssE7Z6NH+zuqNLOzOB0uaD61yl7cAcVhgg==
pend	1.2.0	MIT	dev	sha512-F3asv42UuXchdzt+xXqfW1OGlVBe+mxa2mqI0pg5yAHZPvFmY3Y6drSf/GQ1A86WgWEN9Kzh/WrgKa6iGcHXLg==
plist	3.1.1	MIT	dev	sha512-ZIfcLJC+7E7FBFnDxm9MPmt7D+DidyQ26lewieO75AdhA2ayMtsJSES0iWzqJQbcVRSrTufQoy0DR94xHue0oA==
process-nextick-args	2.0.1	MIT	potential-runtime	sha512-3ouUOpQhtgrbOa17J7+uxOTpITYWaGP7/AhoR3+A+/1e9skrzelGi/dXzEYyvbxubEF6Wn2ypscTKiKJFFn1ag==
prompts	2.4.2	MIT	dev	sha512-NxNv/kLguCA7p3jE8oL2aEBsrJWgAakBpgmgK6lpPWV+WuOmY6r2/zbAVnP+T8bQlA0nzHXSJSJW0Hq7ylaD2Q==
prompts/node_modules/kleur	3.0.3	MIT	dev	sha512-eTIzlVOSUR+JxdDFepEYcBMtZ9Qqdef+rnzWdRZuMbOywu5tO2w2N7rqjoANZ5k9vywhL6Br1VRjUIgTQx4E8w==
readable-stream	2.3.8	MIT	potential-runtime	sha512-8p0AUk4XODgIewSi0l8Epjs+EVnWiK7NoDIEGU0HhE7+ZyY8D1IMY7odu5lRrFXGg71L15KG8QrPmum45RTtdA==
rimraf	6.1.4	BlueOak-1.0.0	dev	sha512-Fk3reQDVPZUMbEm7Zwxz03BWQMW3V5buSk9aU8OckTrO8A1nQtbqvYsAantGNermwsIsXcuOBqcoJ3HuMELctw==
safe-buffer	5.1.2	MIT	potential-runtime	sha512-Gd2UZBJDkXlY7GbJxfsE8/nvKkUEU1G38c1siN6QP6a9PT9MmHB8GnpscSmMJSoF8LOIrt8ud/wPtojys4G6+g==
sax	1.1.4	ISC	dev	sha512-5f3k2PbGGp+YtKJjOItpg3P99IMD84E4HOvcfleTb5joCHNXYLsR9yWFPOYGgaeMPDubQILTCMdsFb2OMeOjtg==
semver	7.8.6	ISC	dev	sha512-9lpSSU4Mly3mrtruwLs1eLK6+gzbzqeBFwRNjIjE+9LuDpWdYctrQlQ3ej1Ilgi7gknpsTRnPoLP8DpCHqHIJw==
setimmediate	1.0.5	MIT	potential-runtime	sha512-MATJdZp8sLqDl/68LfQmbP8zKPLQNV6BIZoIgrscFDQ+RsvK/BxeDQOgyxKKoh0y/8h3BqVFnCqQ/gd+reiIXA==
shebang-command	2.0.0	MIT	dev	sha512-kHxr2zZpYtdmrN1qDjrrX/Z1rR1kG8Dx+gkpK1G4eXmvXswmcE1hTWBWYUzlraYw1/yZp6YuDY77YtvbN0dmDA==
shebang-regex	3.0.0	MIT	dev	sha512-7++dFhtcx3353uBaq8DDR4NuxBetBzC7ZQOhmTQInHEd6bSrXdiEyzCvG07Z44UYdLShWUyXt5M/yhz8ekcb1A==
signal-exit	3.0.7	ISC	dev	sha512-wnD2ZE+l+SPC/uoS0vXeE9L1+0wuaMqKlfz9AMUo38JsyLSBWSFcHR1Rri62LZc12vLr1gb3jl7iwQhgwpAbGQ==
simple-plist	1.3.1	MIT	dev	sha512-iMSw5i0XseMnrhtIzRb7XpQEXepa9xhWxGUojHBL43SIpQuDQkh3Wpy67ZbDzZVr6EKxvwVChnVpdl8hEVLDiw==
simple-plist/node_modules/bplist-parser	0.3.1	MIT	dev	sha512-PyJxiNtA5T2PlLIeBot4lbp7rj4OadzjnMZD/G5zuBNt8ei/yCU7+wW0h2bag9vr8c+/WuRWmSxbqAl9hL1rBA==
sisteransi	1.0.5	MIT	dev	sha512-bLGGlR1QxBcynn2d5YmDX4MGjlZvy2MRBDRNHLJ8VI6l6+9FUiyTFNJ0IveOSP0bcXgVDPRcfGqA0pjaqUpfVg==
slice-ansi	4.0.0	MIT	dev	sha512-qMCMfhY040cVHT43K9BFygqYbUPFZKHOg7K73mtTWJRb8pyP3fzf4Ixd5SzdEJQ6MRUg/WBnOLxghZtKKurENQ==
split2	4.2.0	ISC	dev	sha512-UcjcJOWknrNkF6PLX83qcHM6KHgVKNkV62Y8a5uYDVv9ydGQVwAHMKqHdJje1VTWpljG0WYpCDhrCdAOYH4TWg==
sql.js	1.17.0	MIT	potential-runtime	sha512-HNdo5+2eSTEm7iLcfXUd2mjZX3Oe+5mJ0uDgIpirS7gSLHhZIw9kWDWxNcDVeFGEIBxJlkgo525g0CZJoH8GgA==
stream-buffers	2.2.0	Unlicense	dev	sha512-uyQK/mx5QjHun80FLJTfaWE7JtwfRMKBLkMne6udYOmvH0CawotVa7TfgYHzAnpphn4+TweIx1QKMnRIbipmUg==
string_decoder	1.1.1	MIT	potential-runtime	sha512-n/ShnvDi6FHbbVfviro+WojiFzv+s8MPMHBczVePfUpDJLwoLT0ht1l4YwBCbi8pJAveEEdnkHyPyTP/mzRfwg==
string-width	4.2.3	MIT	dev	sha512-wKyQRQpjJ0sIp62ErSZdGsjMJWsap5oRNihHhu6G7JVO/9jIB6UyevL+tXuOqrng8j/cxKTWyWUwvSTriiZz/g==
strip-ansi	6.0.1	MIT	dev	sha512-Y38VPSHcqkFrCpFnQ9vuSXmquuv5oXOKpGeT6aGrr3o3Gc9AlVa6JBfUSOCnbxGGZF+/0ooI7KrPuUSztUdU5A==
tar	7.5.24	BlueOak-1.0.0	dev	sha512-to/OxuCk5DeVONcjjODT7aeoRq5NIPPlfPc0tNML+wLlnf6u5BcJz97Uukv3pT3jzorkFhUevylkAiBr+ZmV2w==
through2	4.0.2	MIT	dev	sha512-iOqSav00cVxEEICeD7TjLB1sueEL+81Wpzp2bY17uZjZN0pWZPuo4suZ/61VujxmqSGFfgOcNuTZ85QJwNZQpw==
through2/node_modules/readable-stream	3.6.2	MIT	dev	sha512-9u/sniCrY3D5WdsERHzHE4G2YCXqoG5FTHUiCC4SIbr6XcLZBY05ya9EKjYek9O5xOAwjGq+1JdGBAS7Q9ScoA==
tree-kill	1.2.2	MIT	dev	sha512-L0Orpi8qGpRG//Nd+H90vFB+3iHnue1zSSGmNOOCh1GLJ7rUKVwV2HvijphGQS2UmhUZewS9VgvxYIdgr+fG1A==
tslib	2.9.1	0BSD	potential-runtime	sha512-a4Ux9VKuIMHsOS7ENbEq6hK2ZGYIT27Rtl0E4eD9KqwxhKiQeMZE/9xb3IdYwWaSOyIBQLExhQgXDTYoiCxnWA==
typescript	5.8.3	Apache-2.0	dev	sha512-p1diW6TqL9L07nNxvRMM7hMMw4c5XOo/1ibL4aAIGmSAt9slTE1Xgw5KWuof2uTOvCg9BY7ZRi+GaF+7sfgPeQ==
undici-types	8.9.0	MIT	dev	sha512-KTDyRTYX8sWmKXAikPHHSyc63CRPETMctyjKFupcC6OBLXT3xsN0e9aF7m+mIXutFWpUXuedtowG7iLOzp0kQg==
universalify	2.0.1	MIT	dev	sha512-gptHNQghINnc/vTGIk0SOFGFNXw7JVrlRUtConJRlvaw6DuX0wO5Jeko9sWrMBhh+PsYAZ7oXAiOnf/UKogyiw==
untildify	4.0.0	MIT	dev	sha512-KK8xQ1mkzZeg9inewmFVDNkg3l5LUhoq9kN6iWYB/CC9YMG8HA+c1Q8HwDe6dEX7kErrEVNVBO3fWsVq5iDgtw==
util-deprecate	1.0.2	MIT	potential-runtime	sha512-EPD5q1uXyFxJpCrLnCc1nHnq3gOa6DZBocAIiI2TaSCA7VCJ1UJDMagCzIkXNsUYfD1daK//LTEQ8xiIbrHtcw==
which	2.0.2	ISC	dev	sha512-BLI3Tl1TW3Pvl70l3yq3Y64i+awpwXqsGBYWkkqMtnbXgrMD+yj7rhW0kuEDxzJaYXGjEW5ogapKNMEKNMjibA==
wrap-ansi	7.0.0	MIT	dev	sha512-YVGIj2kamLSTxw6NsZjoBxfSwsn0ycdesmc4p+Q21c5zPuZ1pl+NfxVdxPtdHvmNVOQ6XSYG4AUtyt/Fi7D16Q==
xcode	4.0.0	Apache-2.0	dev	sha512-dDaoWzc9EP2fp9FS9PVZUkyvFxY4y1TOV9pcKaKLk++Ei/qb97XDFEVP7GnW7Osii/TzVABJ0jq2F+9/lq0TVA==
xml2js	0.6.2	MIT	dev	sha512-T4rieHaC1EXcES0Kxxj4JWgaUQHDk+qwHcYOCFHfiwKz7tOVPLq7Hjq9dM1WCMhylqMEfP7hMcOIChvotiZegA==
xml2js/node_modules/xmlbuilder	11.0.1	MIT	dev	sha512-fDlsI/kFEx7gLvbecc0/ohLG50fugQp8ryHzMTuW9vSa1GJ0XYWKnhsUx7oie3G98+r56aTQIUB4kht42R3JvA==
xmlbuilder	15.1.1	MIT	dev	sha512-yMqGBqtXyeN1e3TGYvgNgDVZ3j84W4cwkOXQswghol6APgZWaff9lnbvN7MHYJOiXsvGPXtjTYJEiC9J2wv9Eg==
yallist	5.0.0	BlueOak-1.0.0	dev	sha512-YgvUTfwqyc7UXVMrB+SImsVYSmTS8X/tSrtdNZMImM+n7+QTriRXyXim0mBrTXNeqzVF0KWGgHPeiyViFFrNDw==
yauzl	2.10.0	MIT	dev	sha512-p4a9I6X6nu6IhoGmBqAcbJy1mlC4j27vEPZX9F4L4/vZT3Lyq1VkFHw/V/PUcB9Buo+DG3iHkT0x3Qya58zc3g==
```

# C074 — Android first build PASS / delivery OPEN

Run 46056823399 job 140701238391; workflow SHA d4fd9b52dac1994423a774e8bef3b56ff0417625; source checkout 94279362ba405b7f86e5dca6146034418280f6ce. CI completed success. APK bytes 13220612; SHA256 9f52377d7bba4dd9cb10fb1f486f6787c55b3fdf5c59540c4d8d9fcc90aea66a. APK verified on runner only; no artifact uploaded (API total_count=0). No device tests, public distribution or real data authorized. First build binary not recovered. New delivery candidate will require its own hash and verification.

## Signature and manifest receipts
```
{"scope": "payload correspondence only", "web_payload": {"app.js": "43a0339bc3796e464f073e1952ec50ec3e8d1176dcd6e0e083a98218a136a261", "index.html": "36e66667116eb1e0640154711466b830e78ceeee924ff060e09e040f7dbc0456"}}
Verifies
Verified using v1 scheme (JAR signing): false
Verified using v2 scheme (APK Signature Scheme v2): true
Verified using v3 scheme (APK Signature Scheme v3): false
Verified using v3.1 scheme (APK Signature Scheme v3.1): false
Verified using v4 scheme (APK Signature Scheme v4): false
Number of signers: 1
Signer #1 certificate DN: C=US, O=Android, CN=Android Debug
Signer #1 certificate SHA-256 digest: d44228d02fddae2b13673733a5bf719db39adac9ea67d4e392852d65e5a276d1
Signer #1 certificate SHA-1 digest: a385fea83665e9ea0129d5d50f4590ae36c08e54
Signer #1 certificate MD5 digest: 3766b0f1144c778461259d43f6ecb107
Signer #1 key algorithm: RSA
Signer #1 key size (bits): 2048
Signer #1 public key SHA-256 digest: 09acd09f8da9a553bd3ac4a27b601bcf1006909e94e19e66b6c3dcd5c87c1e79
Signer #1 public key SHA-1 digest: 5fa9e435f8b462e5da5b20717efea9a8e1ad4df8
Signer #1 public key MD5 digest: 5f55c5c996c08f08fb4eced00a64fdb4
sdkVersion:'24'
targetSdkVersion:'36'
uses-permission: name='android.permission.INTERNET'
uses-permission: name='android.permission.USE_BIOMETRIC'
uses-permission: name='android.permission.USE_FINGERPRINT'
uses-permission: name='com.vutovka.fitcontrol.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION'
native-code: 'arm64-v8a' 'armeabi-v7a' 'x86' 'x86_64'
uses-permission: name='android.permission.INTERNET'
uses-permission: name='android.permission.USE_BIOMETRIC'
uses-permission: name='android.permission.USE_FINGERPRINT'
uses-permission: name='com.vutovka.fitcontrol.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION'
```

## Web metafile
```json
{"inputs":{"node_modules/@capacitor/core/dist/index.js":{"bytes":24269,"imports":[],"format":"esm"},"node_modules/@capacitor-community/sqlite/dist/esm/definitions.js":{"bytes":29248,"imports":[],"format":"esm"},"node_modules/@capacitor-community/sqlite/dist/esm/web.js":{"bytes":16456,"imports":[{"path":"node_modules/@capacitor/core/dist/index.js","kind":"import-statement","original":"@capacitor/core"}],"format":"esm"},"node_modules/@capacitor-community/sqlite/dist/esm/index.js":{"bytes":354,"imports":[{"path":"node_modules/@capacitor/core/dist/index.js","kind":"import-statement","original":"@capacitor/core"},{"path":"node_modules/@capacitor-community/sqlite/dist/esm/definitions.js","kind":"import-statement","original":"./definitions"},{"path":"node_modules/@capacitor-community/sqlite/dist/esm/web.js","kind":"dynamic-import","original":"./web"}],"format":"esm"},"native-sqlite-driver.mjs":{"bytes":3137,"imports":[],"format":"esm"},"../dist/nutrition.js":{"bytes":2882,"imports":[],"format":"esm"},"../dist/storage.js":{"bytes":6785,"imports":[{"path":"../dist/nutrition.js","kind":"import-statement","original":"./nutrition.js"}],"format":"esm"},"catalog-projection.mjs":{"bytes":4445,"imports":[{"path":"../dist/storage.js","kind":"import-statement","original":"../dist/storage.js"}],"format":"esm"},"nutrition-matcher.mjs":{"bytes":2586,"imports":[{"path":"../dist/storage.js","kind":"import-statement","original":"../dist/storage.js"},{"path":"catalog-projection.mjs","kind":"import-statement","original":"./catalog-projection.mjs"}],"format":"esm"},"sqlite-diary.mjs":{"bytes":28359,"imports":[{"path":"../dist/storage.js","kind":"import-statement","original":"../dist/storage.js"},{"path":"../dist/nutrition.js","kind":"import-statement","original":"../dist/nutrition.js"},{"path":"nutrition-matcher.mjs","kind":"import-statement","original":"./nutrition-matcher.mjs"},{"path":"catalog-projection.mjs","kind":"import-statement","original":"./catalog-projection.mjs"}],"format":"esm"},"recovery-store.mjs":{"bytes":1741,"imports":[],"format":"esm"},"../dist/diary-editor.js":{"bytes":3615,"imports":[{"path":"../dist/nutrition.js","kind":"import-statement","original":"./nutrition.js"},{"path":"../dist/storage.js","kind":"import-statement","original":"./storage.js"}],"format":"esm"},"../dist/diary-view.js":{"bytes":2415,"imports":[{"path":"../dist/nutrition.js","kind":"import-statement","original":"./nutrition.js"},{"path":"../dist/storage.js","kind":"import-statement","original":"./storage.js"}],"format":"esm"},"persistent-diary.mjs":{"bytes":5894,"imports":[{"path":"../dist/diary-editor.js","kind":"import-statement","original":"../dist/diary-editor.js"},{"path":"../dist/diary-view.js","kind":"import-statement","original":"../dist/diary-view.js"},{"path":"../dist/storage.js","kind":"import-statement","original":"../dist/storage.js"}],"format":"esm"},"../preview/diary-preview.mjs":{"bytes":9932,"imports":[{"path":"../dist/diary-view.js","kind":"import-statement","original":"../dist/diary-view.js"},{"path":"../dist/diary-editor.js","kind":"import-statement","original":"../dist/diary-editor.js"}],"format":"esm"},"../preview/transcript.mjs":{"bytes":1357,"imports":[{"path":"../preview/diary-preview.mjs","kind":"import-statement","original":"./diary-preview.mjs"}],"format":"esm"},"nutrition-candidates.mjs":{"bytes":3441,"imports":[{"path":"../preview/transcript.mjs","kind":"import-statement","original":"../preview/transcript.mjs"}],"format":"esm"},"candidate-review.mjs":{"bytes":3593,"imports":[{"path":"nutrition-candidates.mjs","kind":"import-statement","original":"./nutrition-candidates.mjs"}],"format":"esm"},"audio-lease.mjs":{"bytes":453,"imports":[],"format":"esm"},"offline-recognition.mjs":{"bytes":3083,"imports":[],"format":"esm"},"recognition-screen.mjs":{"bytes":3440,"imports":[{"path":"offline-recognition.mjs","kind":"import-statement","original":"./offline-recognition.mjs"},{"path":"audio-lease.mjs","kind":"import-statement","original":"./audio-lease.mjs"}],"format":"esm"},"../preview/voice.mjs":{"bytes":5472,"imports":[],"format":"esm"},"voice-screen.mjs":{"bytes":3108,"imports":[{"path":"audio-lease.mjs","kind":"import-statement","original":"./audio-lease.mjs"},{"path":"../preview/voice.mjs","kind":"import-statement","original":"../preview/voice.mjs"}],"format":"esm"},"encrypted-backup.mjs":{"bytes":2800,"imports":[{"path":"sqlite-diary.mjs","kind":"import-statement","original":"./sqlite-diary.mjs"}],"format":"esm"},"diary-screen.mjs":{"bytes":26193,"imports":[{"path":"persistent-diary.mjs","kind":"import-statement","original":"./persistent-diary.mjs"},{"path":"candidate-review.mjs","kind":"import-statement","original":"./candidate-review.mjs"},{"path":"audio-lease.mjs","kind":"import-statement","original":"./audio-lease.mjs"},{"path":"recognition-screen.mjs","kind":"import-statement","original":"./recognition-screen.mjs"},{"path":"voice-screen.mjs","kind":"import-statement","original":"./voice-screen.mjs"},{"path":"../preview/transcript.mjs","kind":"import-statement","original":"../preview/transcript.mjs"},{"path":"sqlite-diary.mjs","kind":"import-statement","original":"./sqlite-diary.mjs"},{"path":"encrypted-backup.mjs","kind":"import-statement","original":"./encrypted-backup.mjs"}],"format":"esm"},"privacy-gate.mjs":{"bytes":654,"imports":[],"format":"esm"},"native-bootstrap.mjs":{"bytes":2876,"imports":[{"path":"native-sqlite-driver.mjs","kind":"import-statement","original":"./native-sqlite-driver.mjs"},{"path":"sqlite-diary.mjs","kind":"import-statement","original":"./sqlite-diary.mjs"},{"path":"recovery-store.mjs","kind":"import-statement","original":"./recovery-store.mjs"},{"path":"diary-screen.mjs","kind":"import-statement","original":"./diary-screen.mjs"},{"path":"privacy-gate.mjs","kind":"import-statement","original":"./privacy-gate.mjs"}],"format":"esm"},"native-entry.mjs":{"bytes":1210,"imports":[{"path":"node_modules/@capacitor/core/dist/index.js","kind":"import-statement","original":"@capacitor/core"},{"path":"node_modules/@capacitor-community/sqlite/dist/esm/index.js","kind":"import-statement","original":"@capacitor-community/sqlite"},{"path":"native-bootstrap.mjs","kind":"import-statement","original":"./native-bootstrap.mjs"}],"format":"esm"}},"outputs":{"app.js":{"imports":[],"exports":[],"entryPoint":"native-entry.mjs","inputs":{"node_modules/@capacitor/core/dist/index.js":{"bytesInOutput":20249},"node_modules/@capacitor-community/sqlite/dist/esm/web.js":{"bytesInOutput":16223},"native-entry.mjs":{"bytesInOutput":1442},"node_modules/@capacitor-community/sqlite/dist/esm/index.js":{"bytesInOutput":258},"node_modules/@capacitor-community/sqlite/dist/esm/definitions.js":{"bytesInOutput":22579},"native-sqlite-driver.mjs":{"bytesInOutput":3665},"../dist/nutrition.js":{"bytesInOutput":2701},"../dist/storage.js":{"bytesInOutput":2615},"catalog-projection.mjs":{"bytesInOutput":4429},"nutrition-matcher.mjs":{"bytesInOutput":2503},"sqlite-diary.mjs":{"bytesInOutput":30340},"recovery-store.mjs":{"bytesInOutput":1765},"../dist/diary-editor.js":{"bytesInOutput":3303},"../dist/diary-view.js":{"bytesInOutput":2249},"persistent-diary.mjs":{"bytesInOutput":6098},"../preview/diary-preview.mjs":{"bytesInOutput":433},"../preview/transcript.mjs":{"bytesInOutput":1717},"nutrition-candidates.mjs":{"bytesInOutput":4095},"candidate-review.mjs":{"bytesInOutput":5889},"audio-lease.mjs":{"bytesInOutput":489},"offline-recognition.mjs":{"bytesInOutput":3349},"recognition-screen.mjs":{"bytesInOutput":5309},"../preview/voice.mjs":{"bytesInOutput":5680},"voice-screen.mjs":{"bytesInOutput":4240},"encrypted-backup.mjs":{"bytesInOutput":2685},"diary-screen.mjs":{"bytesInOutput":41111},"privacy-gate.mjs":{"bytesInOutput":763},"native-bootstrap.mjs":{"bytesInOutput":3144}},"bytes":200673}}}
```

## Gradle runtime graph
```
debugRuntimeClasspath - Resolved configuration for runtime for variant: debug
+--- androidx.appcompat:appcompat:1.7.1
|    +--- androidx.activity:activity:1.8.0 -> 1.11.0
|    |    +--- androidx.annotation:annotation:1.8.1
|    |    |    \--- androidx.annotation:annotation-jvm:1.8.1
|    |    |         \--- org.jetbrains.kotlin:kotlin-stdlib:1.7.10 -> 2.0.21
|    |    |              +--- org.jetbrains:annotations:13.0 -> 23.0.0
|    |    |              +--- org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.8.0 -> 1.8.22 (c)
|    |    |              \--- org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.8.0 -> 1.8.22 (c)
|    |    +--- androidx.core:core-ktx:1.13.0 -> 1.17.0
|    |    |    +--- androidx.annotation:annotation:1.8.1 (*)
|    |    |    +--- androidx.core:core:1.17.0
|    |    |    |    +--- androidx.annotation:annotation:1.8.1 (*)
|    |    |    |    +--- androidx.annotation:annotation-experimental:1.4.1
|    |    |    |    |    \--- org.jetbrains.kotlin:kotlin-stdlib:1.7.10 -> 2.0.21 (*)
|    |    |    |    +--- androidx.collection:collection:1.4.2
|    |    |    |    |    \--- androidx.collection:collection-jvm:1.4.2
|    |    |    |    |         +--- androidx.annotation:annotation:1.8.1 (*)
|    |    |    |    |         \--- org.jetbrains.kotlin:kotlin-stdlib:1.8.22 -> 2.0.21 (*)
|    |    |    |    +--- androidx.concurrent:concurrent-futures:1.0.0 -> 1.1.0
|    |    |    |    |    +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    |    |    |    |    \--- com.google.guava:listenablefuture:1.0
|    |    |    |    +--- androidx.core:core-viewtree:1.0.0
|    |    |    |    |    +--- org.jetbrains.kotlin:kotlin-stdlib -> 2.0.21 (*)
|    |    |    |    |    \--- org.jetbrains.kotlin:kotlin-stdlib:1.8.22 -> 2.0.21 (c)
|    |    |    |    +--- androidx.interpolator:interpolator:1.0.0
|    |    |    |    |    \--- androidx.annotation:annotation:1.0.0 -> 1.8.1 (*)
|    |    |    |    +--- androidx.lifecycle:lifecycle-common:2.6.2
|    |    |    |    |    +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    |    |    |    |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.8.10 -> 2.0.21 (*)
|    |    |    |    |    +--- org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4 -> 1.8.1
|    |    |    |    |    |    +--- org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1
|    |    |    |    |    |    |    \--- org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.8.1
|    |    |    |    |    |    |         +--- org.jetbrains:annotations:23.0.0
|    |    |    |    |    |    |         +--- org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.8.1
|    |    |    |    |    |    |         |    +--- org.jetbrains.kotlinx:kotlinx-coroutines-android:1.8.1 (c)
|    |    |    |    |    |    |         |    +--- org.jetbrains.kotlinx:kotlinx-coroutines-core-jvm:1.8.1 (c)
|    |    |    |    |    |    |         |    \--- org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1 (c)
|    |    |    |    |    |    |         \--- org.jetbrains.kotlin:kotlin-stdlib:1.9.21 -> 2.0.21 (*)
|    |    |    |    |    |    +--- org.jetbrains.kotlinx:kotlinx-coroutines-bom:1.8.1 (*)
|    |    |    |    |    |    \--- org.jetbrains.kotlin:kotlin-stdlib:1.9.21 -> 2.0.21 (*)
|    |    |    |    |    +--- androidx.lifecycle:lifecycle-livedata-core:2.6.2 (c)
|    |    |    |    |    +--- androidx.lifecycle:lifecycle-process:2.6.2 (c)
|    |    |    |    |    +--- androidx.lifecycle:lifecycle-runtime:2.6.2 (c)
|    |    |    |    |    +--- androidx.lifecycle:lifecycle-viewmodel:2.6.2 (c)
|    |    |    |    |    +--- androidx.lifecycle:lifecycle-viewmodel-savedstate:2.6.2 (c)
|    |    |    |    |    \--- androidx.lifecycle:lifecycle-livedata:2.6.2 (c)
|    |    |    |    +--- androidx.lifecycle:lifecycle-runtime:2.6.2
|    |    |    |    |    +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    |    |    |    |    +--- androidx.arch.core:core-common:2.2.0
|    |    |    |    |    |    \--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    |    |    |    |    +--- androidx.arch.core:core-runtime:2.2.0
|    |    |    |    |    |    +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    |    |    |    |    |    \--- androidx.arch.core:core-common:2.2.0 (*)
|    |    |    |    |    +--- androidx.lifecycle:lifecycle-common:2.6.2 (*)
|    |    |    |    |    +--- androidx.profileinstaller:profileinstaller:1.3.0 -> 1.4.0
|    |    |    |    |    |    +--- androidx.annotation:annotation:1.8.1 (*)
|    |    |    |    |    |    +--- androidx.concurrent:concurrent-futures:1.1.0 (*)
|    |    |    |    |    |    +--- androidx.startup:startup-runtime:1.1.1
|    |    |    |    |    |    |    +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    |    |    |    |    |    |    \--- androidx.tracing:tracing:1.0.0 -> 1.2.0
|    |    |    |    |    |    |         \--- androidx.annotation:annotation:1.2.0 -> 1.8.1 (*)
|    |    |    |    |    |    \--- com.google.guava:listenablefuture:1.0
|    |    |    |    |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.8.10 -> 2.0.21 (*)
|    |    |    |    |    +--- androidx.lifecycle:lifecycle-common:2.6.2 (c)
|    |    |    |    |    +--- androidx.lifecycle:lifecycle-livedata-core:2.6.2 (c)
|    |    |    |    |    +--- androidx.lifecycle:lifecycle-process:2.6.2 (c)
|    |    |    |    |    +--- androidx.lifecycle:lifecycle-viewmodel:2.6.2 (c)
|    |    |    |    |    +--- androidx.lifecycle:lifecycle-viewmodel-savedstate:2.6.2 (c)
|    |    |    |    |    \--- androidx.lifecycle:lifecycle-livedata:2.6.2 (c)
|    |    |    |    +--- androidx.tracing:tracing:1.2.0 (*)
|    |    |    |    +--- androidx.versionedparcelable:versionedparcelable:1.1.1
|    |    |    |    |    +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    |    |    |    |    \--- androidx.collection:collection:1.0.0 -> 1.4.2 (*)
|    |    |    |    +--- com.google.guava:listenablefuture:1.0
|    |    |    |    +--- org.jetbrains.kotlin:kotlin-stdlib -> 2.0.21 (*)
|    |    |    |    +--- org.jetbrains.kotlinx:kotlinx-coroutines-core:1.8.1 (*)
|    |    |    |    +--- org.jspecify:jspecify:1.0.0
|    |    |    |    +--- androidx.core:core-ktx:1.17.0 (c)
|    |    |    |    \--- org.jetbrains.kotlin:kotlin-stdlib:2.0.21 (c)
|    |    |    +--- org.jetbrains.kotlin:kotlin-stdlib -> 2.0.21 (*)
|    |    |    +--- androidx.core:core:1.17.0 (c)
|    |    |    \--- org.jetbrains.kotlin:kotlin-stdlib:2.0.21 (c)
|    |    +--- androidx.core:core-viewtree:1.0.0 (*)
|    |    +--- androidx.lifecycle:lifecycle-common:2.6.1 -> 2.6.2 (*)
|    |    +--- androidx.lifecycle:lifecycle-runtime:2.6.1 -> 2.6.2 (*)
|    |    +--- androidx.lifecycle:lifecycle-viewmodel:2.6.1 -> 2.6.2
|    |    |    +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    |    |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.8.10 -> 2.0.21 (*)
|    |    |    +--- androidx.lifecycle:lifecycle-common:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-livedata:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-livedata-core:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-process:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-runtime:2.6.2 (c)
|    |    |    \--- androidx.lifecycle:lifecycle-viewmodel-savedstate:2.6.2 (c)
|    |    +--- androidx.lifecycle:lifecycle-viewmodel-savedstate:2.6.1 -> 2.6.2
|    |    |    +--- androidx.annotation:annotation:1.0.0 -> 1.8.1 (*)
|    |    |    +--- androidx.core:core-ktx:1.2.0 -> 1.17.0 (*)
|    |    |    +--- androidx.lifecycle:lifecycle-livedata-core:2.6.2
|    |    |    |    +--- androidx.arch.core:core-common:2.1.0 -> 2.2.0 (*)
|    |    |    |    +--- androidx.arch.core:core-runtime:2.1.0 -> 2.2.0 (*)
|    |    |    |    +--- androidx.lifecycle:lifecycle-common:2.6.2 (*)
|    |    |    |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.8.10 -> 2.0.21 (*)
|    |    |    |    +--- androidx.lifecycle:lifecycle-common:2.6.2 (c)
|    |    |    |    +--- androidx.lifecycle:lifecycle-livedata:2.6.2 (c)
|    |    |    |    +--- androidx.lifecycle:lifecycle-process:2.6.2 (c)
|    |    |    |    +--- androidx.lifecycle:lifecycle-runtime:2.6.2 (c)
|    |    |    |    +--- androidx.lifecycle:lifecycle-viewmodel:2.6.2 (c)
|    |    |    |    \--- androidx.lifecycle:lifecycle-viewmodel-savedstate:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-viewmodel:2.6.2 (*)
|    |    |    +--- androidx.savedstate:savedstate:1.2.1
|    |    |    |    +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    |    |    |    +--- androidx.arch.core:core-common:2.1.0 -> 2.2.0 (*)
|    |    |    |    +--- androidx.lifecycle:lifecycle-common:2.6.1 -> 2.6.2 (*)
|    |    |    |    \--- org.jetbrains.kotlin:kotlin-stdlib:1.8.10 -> 2.0.21 (*)
|    |    |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.8.10 -> 2.0.21 (*)
|    |    |    +--- org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.4 -> 1.8.1 (*)
|    |    |    +--- androidx.lifecycle:lifecycle-common:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-livedata:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-livedata-core:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-process:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-runtime:2.6.2 (c)
|    |    |    \--- androidx.lifecycle:lifecycle-viewmodel:2.6.2 (c)
|    |    +--- androidx.profileinstaller:profileinstaller:1.4.0 (*)
|    |    +--- androidx.savedstate:savedstate:1.2.1 (*)
|    |    +--- androidx.tracing:tracing:1.0.0 -> 1.2.0 (*)
|    |    +--- org.jetbrains.kotlin:kotlin-stdlib -> 2.0.21 (*)
|    |    +--- org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3 -> 1.8.1 (*)
|    |    \--- org.jetbrains.kotlin:kotlin-stdlib:2.0.21 (c)
|    +--- androidx.annotation:annotation:1.3.0 -> 1.8.1 (*)
|    +--- androidx.appcompat:appcompat-resources:1.7.1
|    |    +--- androidx.annotation:annotation:1.2.0 -> 1.8.1 (*)
|    |    +--- androidx.collection:collection:1.0.0 -> 1.4.2 (*)
|    |    +--- androidx.core:core:1.6.0 -> 1.17.0 (*)
|    |    +--- androidx.vectordrawable:vectordrawable:1.1.0
|    |    |    +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    |    |    +--- androidx.core:core:1.1.0 -> 1.17.0 (*)
|    |    |    \--- androidx.collection:collection:1.1.0 -> 1.4.2 (*)
|    |    +--- androidx.vectordrawable:vectordrawable-animated:1.1.0
|    |    |    +--- androidx.vectordrawable:vectordrawable:1.1.0 (*)
|    |    |    +--- androidx.interpolator:interpolator:1.0.0 (*)
|    |    |    \--- androidx.collection:collection:1.1.0 -> 1.4.2 (*)
|    |    \--- androidx.appcompat:appcompat:1.7.1 (c)
|    +--- androidx.collection:collection:1.0.0 -> 1.4.2 (*)
|    +--- androidx.core:core:1.13.0 -> 1.17.0 (*)
|    +--- androidx.core:core-ktx:1.13.0 -> 1.17.0 (*)
|    +--- androidx.cursoradapter:cursoradapter:1.0.0
|    |    \--- androidx.annotation:annotation:1.0.0 -> 1.8.1 (*)
|    +--- androidx.drawerlayout:drawerlayout:1.0.0
|    |    +--- androidx.annotation:annotation:1.0.0 -> 1.8.1 (*)
|    |    +--- androidx.core:core:1.0.0 -> 1.17.0 (*)
|    |    \--- androidx.customview:customview:1.0.0
|    |         +--- androidx.annotation:annotation:1.0.0 -> 1.8.1 (*)
|    |         \--- androidx.core:core:1.0.0 -> 1.17.0 (*)
|    +--- androidx.emoji2:emoji2:1.3.0
|    |    +--- androidx.annotation:annotation:1.2.0 -> 1.8.1 (*)
|    |    +--- androidx.collection:collection:1.1.0 -> 1.4.2 (*)
|    |    +--- androidx.core:core:1.3.0 -> 1.17.0 (*)
|    |    +--- androidx.lifecycle:lifecycle-process:2.4.1 -> 2.6.2
|    |    |    +--- androidx.annotation:annotation:1.2.0 -> 1.8.1 (*)
|    |    |    +--- androidx.lifecycle:lifecycle-runtime:2.6.2 (*)
|    |    |    +--- androidx.startup:startup-runtime:1.1.1 (*)
|    |    |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.8.10 -> 2.0.21 (*)
|    |    |    +--- androidx.lifecycle:lifecycle-common:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-livedata:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-livedata-core:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-runtime:2.6.2 (c)
|    |    |    +--- androidx.lifecycle:lifecycle-viewmodel:2.6.2 (c)
|    |    |    \--- androidx.lifecycle:lifecycle-viewmodel-savedstate:2.6.2 (c)
|    |    +--- androidx.startup:startup-runtime:1.0.0 -> 1.1.1 (*)
|    |    \--- androidx.emoji2:emoji2-views-helper:1.3.0 (c)
|    +--- androidx.emoji2:emoji2-views-helper:1.2.0 -> 1.3.0
|    |    +--- androidx.collection:collection:1.1.0 -> 1.4.2 (*)
|    |    +--- androidx.core:core:1.3.0 -> 1.17.0 (*)
|    |    +--- androidx.emoji2:emoji2:1.3.0 (*)
|    |    \--- androidx.emoji2:emoji2:1.3.0 (c)
|    +--- androidx.fragment:fragment:1.5.4 -> 1.8.9
|    |    +--- androidx.activity:activity:1.8.1 -> 1.11.0 (*)
|    |    +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    |    +--- androidx.annotation:annotation-experimental:1.4.0 -> 1.4.1 (*)
|    |    +--- androidx.collection:collection:1.1.0 -> 1.4.2 (*)
|    |    +--- androidx.core:core-ktx:1.2.0 -> 1.17.0 (*)
|    |    +--- androidx.lifecycle:lifecycle-livedata-core:2.6.1 -> 2.6.2 (*)
|    |    +--- androidx.lifecycle:lifecycle-runtime:2.6.1 -> 2.6.2 (*)
|    |    +--- androidx.lifecycle:lifecycle-viewmodel:2.6.1 -> 2.6.2 (*)
|    |    +--- androidx.lifecycle:lifecycle-viewmodel-savedstate:2.6.1 -> 2.6.2 (*)
|    |    +--- androidx.loader:loader:1.0.0
|    |    |    +--- androidx.annotation:annotation:1.0.0 -> 1.8.1 (*)
|    |    |    +--- androidx.core:core:1.0.0 -> 1.17.0 (*)
|    |    |    +--- androidx.lifecycle:lifecycle-livedata:2.0.0 -> 2.6.2
|    |    |    |    +--- androidx.arch.core:core-common:2.1.0 -> 2.2.0 (*)
|    |    |    |    +--- androidx.arch.core:core-runtime:2.1.0 -> 2.2.0 (*)
|    |    |    |    +--- androidx.lifecycle:lifecycle-livedata-core:2.6.2 (*)
|    |    |    |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.8.10 -> 2.0.21 (*)
|    |    |    |    +--- androidx.lifecycle:lifecycle-common:2.6.2 (c)
|    |    |    |    +--- androidx.lifecycle:lifecycle-livedata-core:2.6.2 (c)
|    |    |    |    +--- androidx.lifecycle:lifecycle-process:2.6.2 (c)
|    |    |    |    +--- androidx.lifecycle:lifecycle-runtime:2.6.2 (c)
|    |    |    |    +--- androidx.lifecycle:lifecycle-viewmodel:2.6.2 (c)
|    |    |    |    \--- androidx.lifecycle:lifecycle-viewmodel-savedstate:2.6.2 (c)
|    |    |    \--- androidx.lifecycle:lifecycle-viewmodel:2.0.0 -> 2.6.2 (*)
|    |    +--- androidx.profileinstaller:profileinstaller:1.3.1 -> 1.4.0 (*)
|    |    +--- androidx.savedstate:savedstate:1.2.1 (*)
|    |    +--- androidx.viewpager:viewpager:1.0.0
|    |    |    +--- androidx.annotation:annotation:1.0.0 -> 1.8.1 (*)
|    |    |    +--- androidx.core:core:1.0.0 -> 1.17.0 (*)
|    |    |    \--- androidx.customview:customview:1.0.0 (*)
|    |    \--- org.jetbrains.kotlin:kotlin-stdlib:1.8.22 -> 2.0.21 (*)
|    +--- androidx.lifecycle:lifecycle-runtime:2.6.1 -> 2.6.2 (*)
|    +--- androidx.lifecycle:lifecycle-viewmodel:2.6.1 -> 2.6.2 (*)
|    +--- androidx.profileinstaller:profileinstaller:1.3.1 -> 1.4.0 (*)
|    +--- androidx.resourceinspection:resourceinspection-annotation:1.0.1
|    |    \--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
|    +--- androidx.savedstate:savedstate:1.2.1 (*)
|    +--- org.jetbrains.kotlin:kotlin-stdlib:1.8.22 -> 2.0.21 (*)
|    \--- androidx.appcompat:appcompat-resources:1.7.1 (c)
+--- androidx.coordinatorlayout:coordinatorlayout:1.3.0
|    +--- androidx.annotation:annotation:1.8.1 (*)
|    +--- androidx.collection:collection:1.4.2 (*)
|    +--- androidx.core:core:1.3.0 -> 1.17.0 (*)
|    +--- androidx.customview:customview:1.0.0 (*)
|    \--- org.jspecify:jspecify:1.0.0
+--- androidx.core:core-splashscreen:1.2.0
|    +--- androidx.annotation:annotation:1.8.1 (*)
|    +--- androidx.appcompat:appcompat-resources:1.7.0 -> 1.7.1 (*)
|    +--- org.jetbrains.kotlin:kotlin-stdlib -> 2.0.21 (*)
|    \--- org.jetbrains.kotlin:kotlin-stdlib:2.0.21 (c)
+--- project :capacitor-android
|    +--- androidx.appcompat:appcompat:1.7.1 (*)
|    +--- androidx.core:core:1.17.0 (*)
|    +--- androidx.activity:activity:1.11.0 (*)
|    +--- androidx.fragment:fragment:1.8.9 (*)
|    +--- androidx.coordinatorlayout:coordinatorlayout:1.3.0 (*)
|    +--- androidx.webkit:webkit:1.14.0
|    |    +--- androidx.annotation:annotation:1.8.1 (*)
|    |    +--- androidx.annotation:annotation-experimental:1.4.1 (*)
|    |    +--- androidx.core:core:1.1.0 -> 1.17.0 (*)
|    |    \--- org.jspecify:jspecify:1.0.0
|    \--- org.apache.cordova:framework:14.0.1
|         +--- androidx.webkit:webkit:1.12.1 -> 1.14.0 (*)
|         +--- androidx.core:core-splashscreen:1.0.1 -> 1.2.0 (*)
|         \--- androidx.appcompat:appcompat:1.7.0 -> 1.7.1 (*)
+--- project :capacitor-cordova-android-plugins
|    +--- androidx.appcompat:appcompat:1.7.1 (*)
|    \--- org.apache.cordova:framework:14.0.1 (*)
\--- project :capacitor-community-sqlite
     +--- project :capacitor-android (*)
     +--- androidx.appcompat:appcompat:1.7.1 (*)
     +--- androidx.room:room-runtime:2.6.1
     |    +--- androidx.annotation:annotation-experimental:1.1.0-rc01 -> 1.4.1 (*)
     |    +--- androidx.arch.core:core-runtime:2.2.0 (*)
     |    +--- androidx.room:room-common:2.6.1
     |    |    +--- androidx.annotation:annotation:1.3.0 -> 1.8.1 (*)
     |    |    +--- org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.8.22
     |    |    |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.8.22 -> 2.0.21 (*)
     |    |    |    \--- org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.8.22
     |    |    |         \--- org.jetbrains.kotlin:kotlin-stdlib:1.8.22 -> 2.0.21 (*)
     |    |    \--- androidx.room:room-runtime:2.6.1 (c)
     |    +--- androidx.sqlite:sqlite:2.4.0
     |    |    +--- androidx.annotation:annotation:1.0.0 -> 1.8.1 (*)
     |    |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.8.22 -> 2.0.21 (*)
     |    |    \--- androidx.sqlite:sqlite-framework:2.4.0 (c)
     |    +--- androidx.sqlite:sqlite-framework:2.4.0
     |    |    +--- androidx.annotation:annotation:1.2.0 -> 1.8.1 (*)
     |    |    +--- androidx.sqlite:sqlite:2.4.0 (*)
     |    |    +--- org.jetbrains.kotlin:kotlin-stdlib:1.8.22 -> 2.0.21 (*)
     |    |    \--- androidx.sqlite:sqlite:2.4.0 (c)
     |    \--- androidx.room:room-common:2.6.1 (c)
     +--- androidx.coordinatorlayout:coordinatorlayout:1.2.0 -> 1.3.0 (*)
     +--- net.zetetic:sqlcipher-android:4.17.0
     +--- androidx.sqlite:sqlite:2.4.0 (*)
     +--- androidx.security:security-crypto:1.1.0-alpha06
     |    +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
     |    +--- androidx.annotation:annotation:1.2.0 -> 1.8.1 (*)
     |    +--- androidx.collection:collection:1.1.0 -> 1.4.2 (*)
     |    \--- com.google.crypto.tink:tink-android:1.8.0
     |         \--- com.google.code.gson:gson:2.8.9
     \--- androidx.biometric:biometric:1.1.0
          +--- androidx.activity:activity:1.1.0 -> 1.11.0 (*)
          +--- androidx.appcompat:appcompat:1.2.0 -> 1.7.1 (*)
          +--- androidx.lifecycle:lifecycle-livedata-core:2.2.0 -> 2.6.2 (*)
          +--- androidx.lifecycle:lifecycle-viewmodel:2.2.0 -> 2.6.2 (*)
          +--- androidx.annotation:annotation:1.1.0 -> 1.8.1 (*)
          +--- androidx.core:core:1.3.2 -> 1.17.0 (*)
          \--- androidx.fragment:fragment:1.2.5 -> 1.8.9 (*)

(c) - A dependency constraint, not a dependency. The dependency affected by the constraint occurs elsewhere in the tree.
(*) - Indicates repeated occurrences of a transitive dependency subtree. Gradle expands transitive dependency subtrees only once per project; repeat occurrences only display the root of the subtree, followed by this annotation.

A web-based, searchable dependency report is available by adding the --scan option.

BUILD SUCCESSFUL in 32s
```

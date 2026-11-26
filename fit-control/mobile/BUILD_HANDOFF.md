# Native build handoff — M04B1
Status 2026-11-26: BLOCKED in current Linux runtime (Android SDK, Gradle, adb, sdkmanager, Xcode absent; Node 22.16.0 available). No dependency install, lockfile, native project, build or hosted job attempted in this cycle. No changed condition warrants repeating the blocked operation.
Use an authorized disposable checkout of engineering/fit-control-mvp, record exact HEAD and clean status. No main/backup changes, production publication, paid build/signing, credentials, personal data or recurring schedules. An existing authorized hosted runner is preferable to requiring the user to install desktop software. Runner permissions, cost and availability are not verified; do not trigger a job without those checks.
## Candidate commands (NOT_RUN)
In fit-control/mobile, on an authorized network-enabled builder with Node >=22:
1. npm install --package-lock-only --ignore-scripts
2. Review exact lockfile, registry integrity, platform compatibility, transitive licenses/security and lifecycle scripts. Stop on unresolved dependency/security errors. Preserve and commit reviewed lockfile only to authorized branch.
3. npm ci (after review, on isolated builder; esbuild install scripts need verification).
4. npm run build:web
5. npx --no-install cap add android (only when android project absent); npx --no-install cap sync android
6. On Android SDK/Java 21 builder, cd android; ./gradlew assembleDebug (Windows: gradlew.bat assembleDebug). Record exact SDK/Gradle versions, logs, APK path and SHA256 only if build succeeds.
7. On authorized macOS/Xcode 26+ builder, from mobile, npx --no-install cap add ios (only if absent); npx --no-install cap sync ios. Inspect generated project/workspace and schemes using xcodebuild -list, then build with the actual scheme and simulator destination, CODE_SIGNING_ALLOWED=NO. Simulator build is not installable iPhone IPA. Physical-device distribution requires approved signing and distribution route.
Source requirements: https://capacitorjs.com/docs/getting-started/environment-setup ; pinned versions in mobile/package.json; do not update packages implicitly. Resolve native SDK versions from generated projects and upstream tag 8.6.3. Store exact build logs and artifacts, no secrets. APK debug installation is only for synthetic acceptance; iOS and Android actual M05 device checks required.
## Open gates
No build proof, no lockfile. Goals UI editing, complete backup, ambiguous-commit recovery, app-private storage and encryption policy remain open. Current application must not store real health data. No CI automation added or triggered.

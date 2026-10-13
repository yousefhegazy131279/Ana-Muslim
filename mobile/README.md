# Ana Muslim offline reader

The Android APK bundles the existing site's Quran and tafsir, explained hadith library, prophet stories and WebP images, dhikr, duas, and local fonts. No account, Supabase connection, or audio download is required. The iPhone/iPad and desktop edition is the same reader, installed as a PWA at `/mobile/`.

## Content and build

From the repository root, install dependencies with `npm ci`. Then, inside `mobile/`:

```sh
npm ci
npm run build
npm run publish:web
npx cap sync android
```

`prepare-content.mjs` validates all 114 surahs/6236 verses and every indexed hadith explanation and story before building. It copies the religious texts as provided by the website, preserving their citations and grades. The app does not claim to contain every prophetic hadith. This release has 3582 hadith materials, 25 stories, 345 dhikr entries and 104 duas. Update the root datasets before rebuilding; do not edit generated copies.

`finish-build.mjs` precaches every bundled library file. Installation is atomic: an incomplete download is removed and cannot report "ready". The PWA needs one complete initial download. On iPhone, install from Safari, open the Home Screen icon while still online, and wait for the complete-library status. Browser/OS storage eviction requires downloading it again. The Android APK works offline from its first launch.

## Android release

The GitHub Actions workflow `Build offline Android app` builds an **unsigned** release artifact using Java 21 and Android SDK 36. This artifact is for release preparation, not public installation. The native app ID is `com.hgz.anamuslim`, minimum Android API 24 (Android 7); it uses a local Capacitor WebView with no remote `server.url`.

Download/extract the workflow artifact, then run `node scripts/sign-release.mjs /absolute/path/app-release-unsigned.apk` with `AM_JAVA_HOME` and `AM_APKSIG_JAR` pointing to a Java installation and Google's apksig library. The helper creates a local release key, signs and verifies the APK, copies it to `public/downloads/`, and updates `data/mobile-release.json` with its size and SHA-256. For subsequent releases, increment Android versionCode/versionName and the release filename/metadata together.

**Keep a secure backup of `mobile/.signing/` on the owner's computer.** Its private key and credentials are Git-ignored and must never enter GitHub, public assets, workflow logs, or messages. Android upgrades need this same signing key. The current public APK was generated from the unsigned workflow artifact at commit `65293405b5a7efb9fa05ab8f0c1bb1231544ad27`.

After signing, rebuild the main Next.js site, commit the signed public APK, generated `public/mobile/`, release metadata, and download UI; push to the existing GitHub/Vercel deployment. The homepage and `/download/` read this release metadata. Publishing the website does not update an installed native APK automatically.

## Notifications and saved data

Android offers opt-in daily local reminders for Quran, hadith, and stories, with editable times. These are scheduled by the OS using Capacitor Local Notifications and do not need an internet connection or push server. Notification permission is requested on enabling reminders. The plugin handles boot restoration; Android alarm permissions and battery settings may affect delivery time. No exact delivery guarantee is made.

The PWA cannot schedule reliable offline background notifications on iPhone or desktop. Its settings and installation page disclose this. Web Push would require a network connection and an additional server; it is not implemented here.

Bookmarks, reading progress, theme, font size, dhikr counters, and reminder choices stay on the device. Android mirrors local preferences using Capacitor Preferences. Uninstalling the app or clearing browser/app data removes saved preferences.

## Verification

The web test disconnected the browser after a full cache download and verified a never-opened 286-verse surah, tafsir, explained hadith, prophet story/chapter data, all story image cards, dhikr, duas, bookmarks, persistent dark mode, and mobile overflow. The native release build and APK signature are checked separately; delivery of notifications on a physical phone still needs a device test.

# Super Basic Speed Dial

A minimal Chrome extension that replaces your new tab page with a clean, dark speed dial. Add site shortcuts with auto-fetched favicons, synced across devices via `chrome.storage.sync`.

![Chrome](https://img.shields.io/badge/Chrome-Extension-yellow?logo=googlechrome)
![Manifest](https://img.shields.io/badge/Manifest-v3-blue)

---

## Features

- Replaces the new tab page with a personal speed dial
- Add and remove shortcuts at any time
- Favicons auto-fetched via Google's favicon service
- Shortcuts synced across devices via `chrome.storage.sync`
- Toolbar popup for quick access to your shortcuts
- Dark UI built with Bootstrap 5

---

## Installation

1. Clone or download this repository
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** and select the project folder
5. Open a new tab — you're ready to go

---

## Usage

| Action | How |
|---|---|
| Add a shortcut | Click **+ Add Shortcut** on the new tab page |
| Remove a shortcut | Hover over a tile and click the **✕** button |
| Quick access | Click the extension icon in the Chrome toolbar |

---

## Project Structure

```
super-basic-speed-dial/
├── manifest.json          # Extension config (Manifest v3)
├── newtab.html            # New tab page
├── newtab.js              # New tab logic
├── style-newtab.css       # New tab styles
├── popup.html             # Toolbar popup
├── popup.js               # Popup logic
├── style-popup.css        # Popup styles
├── background.js          # Service worker
├── images/                # Extension icons
└── third-party/           # Bootstrap 5
```

---

## Tech Stack

- Vanilla JS
- Bootstrap 5
- Chrome Extension Manifest v3
- `chrome.storage.sync` for persistent, cross-device storage

---

## License

MIT

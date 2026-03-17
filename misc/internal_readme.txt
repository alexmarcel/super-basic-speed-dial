SUPER BASIC SPEED DIAL
======================
Chrome Extension — Manifest v3
Personal new tab speed dial with add, edit, delete, drag-to-reorder, backup/restore, letter icons, and light/dark mode.


FEATURES
--------
- Replaces new tab page with a speed dial dashboard
- Light and dark mode toggle — preference saved and synced across devices
- Add site shortcuts with auto-fetched favicons
- Edit or delete shortcuts at any time
- Drag and drop to reorder tiles
- Optional letter icon per shortcut (toggle switch in Add/Edit modal)
- Automatic letter fallback if favicon fails to load
- Offline notice shown below the date when there is no internet connection
- Backup shortcuts to a local JSON file
- Restore shortcuts from a backup file
- Shortcuts synced across Chrome devices via chrome.storage.sync
- Toolbar popup for quick access from any tab
- Clicking a shortcut navigates the current tab (does not open a new tab)
- No CDN dependencies — all assets bundled locally


INSTALLATION (Development)
--------------------------
1. Clone or download this repository
2. Open Chrome and go to: chrome://extensions
3. Enable Developer mode (top-right toggle)
4. Click "Load unpacked" and select this project folder
5. Open a new tab to start using the extension


HOW TO USE
----------
Add a shortcut:
  - Click the "+ Add Shortcut" tile on the new tab page
  - Enter a site name and URL (https:// is added automatically if omitted)
  - Optionally enable "Use letter icon" to show a colored letter instead of favicon
  - Press Enter or click "Add Shortcut"

Edit a shortcut:
  - Hover over a tile to reveal the blue (E) button (bottom-right)
  - Click it to open the modal pre-filled with the current name, URL, and icon setting
  - Make changes and press Enter or click "Save"

Delete a shortcut:
  - Hover over a tile to reveal the red (X) button (top-right)
  - Click once — it turns orange as a confirmation prompt
  - Click again within 2 seconds to confirm deletion

Reorder shortcuts:
  - Drag any tile and drop it onto another tile to swap positions
  - New order is saved automatically

Letter icon:
  - Each shortcut has a toggle switch in its Add/Edit modal: "Use letter icon"
  - When enabled, the tile shows a colored circle with the first letter of the site name
  - Color is generated from the site name — consistent across reloads
  - If a favicon fails to load, a letter icon is shown automatically as a fallback

Toggle light/dark mode:
  - Hover over the "+ Add Shortcut" tile to reveal the purple (S) button (below B)
  - Click it to switch between light and dark mode
  - Preference is saved and applied on both the new tab page and the toolbar popup

Backup shortcuts:
  - Hover over the "+ Add Shortcut" tile to reveal the green (B) button
  - Click it to open the Backup & Restore modal
  - Click "Download Backup" to save a JSON file of all current shortcuts

Restore shortcuts:
  - Open the Backup & Restore modal (B button on the Add Shortcut tile)
  - Click "Restore Backup File" and select a previously saved JSON backup
  - Click "Restore" to confirm — this replaces all current shortcuts

Toolbar popup:
  - Click the extension icon in Chrome's toolbar
  - Shows all saved shortcuts as small icons
  - Clicking a shortcut navigates the current tab to that URL


FILE STRUCTURE
--------------
manifest.json           Extension config (permissions, icons, new tab override)
newtab.html             New tab page HTML
newtab.js               New tab page logic
style-newtab.css        New tab page styles
popup.html              Toolbar popup HTML
popup.js                Toolbar popup logic
style-popup.css         Toolbar popup styles
background.js           Service worker
images/                 Extension icons (16, 24, 32, 48, 128px)
third-party/            Bootstrap 5.3.8 (bundled locally)
misc/                   Internal project notes and documentation


PERMISSIONS
-----------
storage — Save and sync shortcuts and theme preference via chrome.storage.sync
tabs    — Navigate the current tab when a shortcut is clicked from the popup


TECH STACK
----------
- Vanilla JavaScript
- Bootstrap 5.3.8 (local, no CDN)
- Chrome Extension Manifest v3
- chrome.storage.sync
- Google Favicon Service for favicon images


NOTES
-----
- Shortcuts are stored as { name, url, useLetter } objects in chrome.storage.sync
- Theme preference is stored as { theme: 'dark' | 'light' } in chrome.storage.sync
- useLetter is optional — existing shortcuts without it default to favicon behavior
- chrome.storage.sync has a quota of ~100KB and ~512 items — sufficient for normal use
- The extension makes no external requests except to Google's favicon service for icons
- No analytics, no tracking, no remote code execution
- Backup files are plain JSON saved locally — nothing is uploaded anywhere
- Offline detection uses a real network probe (fetch to Google favicon service with no-cors)
  rather than navigator.onLine alone, to avoid false positives

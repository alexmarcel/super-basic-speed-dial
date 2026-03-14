SUPER BASIC SPEED DIAL
======================
Chrome Extension — Manifest v3
Personal new tab speed dial with add, edit, delete, drag-to-reorder, and backup/restore shortcuts.


FEATURES
--------
- Replaces new tab page with a dark speed dial dashboard
- Add site shortcuts with auto-fetched favicons
- Edit or delete shortcuts at any time
- Drag and drop to reorder tiles
- Backup shortcuts to a local JSON file
- Restore shortcuts from a backup file
- Shortcuts synced across Chrome devices via chrome.storage.sync
- Toolbar popup for quick access
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
  - Click "Add Shortcut"

Edit a shortcut:
  - Hover over a tile to reveal the blue (E) button (bottom-right)
  - Click it to open the modal pre-filled with the current name and URL
  - Make changes and click "Save"

Delete a shortcut:
  - Hover over a tile to reveal the red (X) button (top-right)
  - Click once — it turns orange as a confirmation prompt
  - Click again within 2 seconds to confirm deletion

Reorder shortcuts:
  - Drag any tile and drop it onto another tile to swap positions
  - New order is saved automatically

Backup shortcuts:
  - Hover over the "+ Add Shortcut" tile to reveal the green (B) button
  - Click it to open the Backup & Restore modal
  - Click "Download Backup" to save a JSON file of all current shortcuts

Restore shortcuts:
  - Open the Backup & Restore modal (B button on the Add Shortcut tile)
  - Click "Restore Backup File" and select a previously saved JSON backup
  - Click "Restore" to confirm — this replaces all current shortcuts


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
third-party/            Bootstrap 5.1.3 (bundled locally)


PERMISSIONS
-----------
storage — Required to save and sync shortcuts via chrome.storage.sync


TECH STACK
----------
- Vanilla JavaScript
- Bootstrap 5.1.3 (local)
- Chrome Extension Manifest v3
- chrome.storage.sync
- Google Favicon Service for favicon images


NOTES
-----
- Shortcuts are stored as an array of { name, url } objects in chrome.storage.sync
- chrome.storage.sync has a quota of ~100KB and ~512 items — sufficient for normal use
- The extension makes no external requests except to Google's favicon service for images
- No analytics, no tracking, no remote code execution
- Backup files are plain JSON saved locally to the user's machine — nothing is uploaded anywhere

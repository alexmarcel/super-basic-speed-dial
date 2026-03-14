let draggedIndex = null;
let editingIndex = null;

constructDate();
loadShortcuts();

function setOfflineNotice(isOffline) {
    document.getElementById('offlineNotice').classList.toggle('d-none', !isOffline);
}

async function checkConnectivity() {
    if (!navigator.onLine) { setOfflineNotice(true); return; }
    try {
        await fetch('https://www.google.com/s2/favicons?domain=google.com', { method: 'GET', mode: 'no-cors', cache: 'no-store' });
        setOfflineNotice(false);
    } catch {
        setOfflineNotice(true);
    }
}

checkConnectivity();
window.addEventListener('online', checkConnectivity);
window.addEventListener('offline', () => setOfflineNotice(true));

function loadShortcuts() {
    chrome.storage.sync.get('shortcuts', (result) => {
        const shortcuts = result.shortcuts || [];
        if (shortcuts.length === 0) {
            constructWelcome();
        } else {
            constructShortcuts(shortcuts);
        }
    });
}

function constructWelcome() {
    const container = document.getElementById('shortcuts');
    container.innerHTML = '';

    const welcome = document.createElement('div');
    welcome.className = 'col-12 text-center mt-5';
    welcome.innerHTML = `
        <p class="text-secondary fs-5">You have no shortcuts yet.</p>
        <p class="text-muted">Click <strong class="text-white">+ Add Shortcut</strong> below to get started.</p>
    `;
    container.appendChild(welcome);
    constructAddButton(container);
}

function nameToColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 50%, 45%)`;
}

function constructShortcuts(data) {
    const container = document.getElementById('shortcuts');
    container.innerHTML = '';

    const fragment = document.createDocumentFragment();

    data.forEach((obj, index) => {
        const col = document.createElement('div');
        col.className = 'shortcut-tile col-1 d-flex justify-content-center text-nowrap mt-3';
        col.dataset.index = index;

        const a = document.createElement('a');
        a.href = obj.url;
        a.target = '_self';
        a.className = 'text-decoration-none';

        const iconWrap = document.createElement('div');
        iconWrap.className = 'd-flex justify-content-center';

        const tile = document.createElement('div');
        tile.className = 'tile-icon p-2';

        if (obj.useLetter) {
            const letter = document.createElement('span');
            letter.className = 'tile-letter';
            letter.textContent = obj.name.charAt(0).toUpperCase();
            letter.style.background = nameToColor(obj.name);
            tile.appendChild(letter);
        } else {
            const img = document.createElement('img');
            img.className = 'tile-icon-rounded';
            img.width = 32;
            img.height = 32;
            img.src = `https://www.google.com/s2/favicons?sz=64&domain=${obj.url}`;
            img.alt = obj.name;
            img.onerror = () => {
                img.style.display = 'none';
                const letter = document.createElement('span');
                letter.className = 'tile-letter';
                letter.textContent = obj.name.charAt(0).toUpperCase();
                letter.style.background = nameToColor(obj.name);
                tile.appendChild(letter);
            };
            tile.appendChild(img);
        }

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'X';
        deleteBtn.title = 'Remove shortcut';
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (deleteBtn.classList.contains('confirm')) {
                removeShortcut(index);
            } else {
                deleteBtn.classList.add('confirm');
                deleteBtn.textContent = '?';
                setTimeout(() => {
                    deleteBtn.classList.remove('confirm');
                    deleteBtn.textContent = 'X';
                }, 2000);
            }
        });

        const label = document.createElement('div');
        label.className = 'mt-2 text-white small text-center tile-label';
        label.textContent = obj.name;

        iconWrap.appendChild(tile);
        a.appendChild(iconWrap);
        a.appendChild(label);
        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'E';
        editBtn.title = 'Edit shortcut';
        editBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            editingIndex = index;
            document.getElementById('modalAddShortcutLabel').textContent = 'Edit Shortcut';
            document.getElementById('btnAddShortcut').textContent = 'Save';
            document.getElementById('modalSiteName').value = obj.name;
            document.getElementById('modalURL').value = obj.url;
            document.getElementById('modalUseLetter').checked = !!obj.useLetter;
            new bootstrap.Modal(document.getElementById('modalAddShortcut')).show();
        });

        col.appendChild(a);
        col.appendChild(deleteBtn);
        col.appendChild(editBtn);

        // Drag and drop
        col.draggable = true;
        col.addEventListener('dragstart', (e) => {
            // Prevent drag from blocking link clicks on the <a> element
            e.dataTransfer.effectAllowed = 'move';
            draggedIndex = index;
            setTimeout(() => col.classList.add('dragging'), 0);
        });
        a.addEventListener('click', (e) => {
            // Cancel click if a drag just happened
            if (col.classList.contains('dragging')) e.preventDefault();
        });
        col.addEventListener('dragend', () => {
            col.classList.remove('dragging');
            document.querySelectorAll('.shortcut-tile').forEach(t => t.classList.remove('drag-over'));
        });
        col.addEventListener('dragover', (e) => {
            e.preventDefault();
            document.querySelectorAll('.shortcut-tile').forEach(t => t.classList.remove('drag-over'));
            col.classList.add('drag-over');
        });
        col.addEventListener('drop', (e) => {
            e.preventDefault();
            const targetIndex = index;
            if (draggedIndex === null || draggedIndex === targetIndex) return;
            chrome.storage.sync.get('shortcuts', (result) => {
                const shortcuts = result.shortcuts || [];
                const [moved] = shortcuts.splice(draggedIndex, 1);
                shortcuts.splice(targetIndex, 0, moved);
                draggedIndex = null;
                chrome.storage.sync.set({ shortcuts }, () => constructShortcuts(shortcuts));
            });
        });

        fragment.appendChild(col);
    });

    container.appendChild(fragment);
    constructAddButton(container);
}

function constructAddButton(container) {
    const col = document.createElement('div');
    col.className = 'shortcut-tile col-1 d-flex justify-content-center text-nowrap mt-3';

    const a = document.createElement('a');
    a.href = '#';
    a.className = 'text-decoration-none';
    a.setAttribute('data-bs-toggle', 'modal');
    a.setAttribute('data-bs-target', '#modalAddShortcut');

    const iconWrap = document.createElement('div');
    iconWrap.className = 'd-flex justify-content-center';

    const tile = document.createElement('div');
    tile.className = 'tile-icon p-2';

    const img = document.createElement('img');
    img.className = 'tile-icon-rounded';
    img.width = 32;
    img.height = 32;
    img.src = 'images/icons8-add-30.png';
    img.alt = 'Add shortcut';

    const label = document.createElement('div');
    label.className = 'mt-2 text-muted small text-center tile-label';
    label.textContent = 'Add Shortcut';

    tile.appendChild(img);
    iconWrap.appendChild(tile);
    a.appendChild(iconWrap);
    a.appendChild(label);
    const backupBtn = document.createElement('button');
    backupBtn.className = 'backup-btn';
    backupBtn.textContent = 'B';
    backupBtn.title = 'Backup & Restore';
    backupBtn.setAttribute('data-bs-toggle', 'modal');
    backupBtn.setAttribute('data-bs-target', '#modalBackup');

    col.appendChild(a);
    col.appendChild(backupBtn);
    container.appendChild(col);
}

function removeShortcut(index) {
    chrome.storage.sync.get('shortcuts', (result) => {
        const shortcuts = result.shortcuts || [];
        shortcuts.splice(index, 1);
        chrome.storage.sync.set({ shortcuts }, () => {
            if (shortcuts.length === 0) {
                constructWelcome();
            } else {
                constructShortcuts(shortcuts);
            }
        });
    });
}

function resetModal() {
    editingIndex = null;
    document.getElementById('modalAddShortcutLabel').textContent = 'Add Shortcut';
    document.getElementById('btnAddShortcut').textContent = 'Add Shortcut';
    document.getElementById('modalSiteName').value = '';
    document.getElementById('modalURL').value = '';
    document.getElementById('modalUseLetter').checked = false;
}

function constructDate() {
    const container = document.getElementById('title');
    container.textContent = new Date().toLocaleDateString('en-my', {
        day: 'numeric', weekday: 'long', year: 'numeric', month: 'long'
    });
}

// ── Backup ──
document.getElementById('btnBackup').addEventListener('click', () => {
    chrome.storage.sync.get('shortcuts', (result) => {
        const shortcuts = result.shortcuts || [];
        const blob = new Blob([JSON.stringify(shortcuts, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'speed-dial-backup.json';
        a.click();
        URL.revokeObjectURL(url);
    });
});

// ── Restore ──
document.getElementById('restoreFileInput').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    document.getElementById('restoreFileName').textContent = file.name;
    document.getElementById('restoreFileName').classList.remove('d-none');
    document.getElementById('restoreWarning').classList.remove('d-none');
    document.getElementById('btnRestoreConfirm').classList.remove('d-none');
});

document.getElementById('btnRestoreConfirm').addEventListener('click', () => {
    const file = document.getElementById('restoreFileInput').files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (!Array.isArray(data) || !data.every(s => s.name && s.url)) {
                alert('Invalid backup file.');
                return;
            }
            chrome.storage.sync.set({ shortcuts: data }, () => {
                bootstrap.Modal.getInstance(document.getElementById('modalBackup')).hide();
                loadShortcuts();
            });
        } catch {
            alert('Could not read backup file. Make sure it is a valid JSON file.');
        }
    };
    reader.readAsText(file);
});

document.getElementById('modalBackup').addEventListener('hidden.bs.modal', () => {
    document.getElementById('restoreFileInput').value = '';
    document.getElementById('restoreFileName').classList.add('d-none');
    document.getElementById('restoreWarning').classList.add('d-none');
    document.getElementById('btnRestoreConfirm').classList.add('d-none');
});

document.getElementById('modalAddShortcut').addEventListener('hidden.bs.modal', resetModal);

document.querySelector('#modalAddShortcut form').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('btnAddShortcut').click();
    }
});

document.getElementById('btnAddShortcut').addEventListener('click', () => {
    const name = document.getElementById('modalSiteName').value.trim();
    let url = document.getElementById('modalURL').value.trim();
    if (!name || !url) return;
    if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
    const useLetter = document.getElementById('modalUseLetter').checked;

    chrome.storage.sync.get('shortcuts', (result) => {
        const shortcuts = result.shortcuts || [];
        if (editingIndex !== null) {
            shortcuts[editingIndex] = { name, url, useLetter };
        } else {
            shortcuts.push({ name, url, useLetter });
        }
        chrome.storage.sync.set({ shortcuts }, () => {
            constructShortcuts(shortcuts);
            resetModal();
            bootstrap.Modal.getInstance(document.getElementById('modalAddShortcut')).hide();
        });
    });
});

constructDate();
loadShortcuts();

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
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'text-decoration-none';

        const iconWrap = document.createElement('div');
        iconWrap.className = 'd-flex justify-content-center';

        const tile = document.createElement('div');
        tile.className = 'tile-icon p-2';

        const img = document.createElement('img');
        img.className = 'tile-icon-rounded';
        img.width = 32;
        img.height = 32;
        img.src = `https://www.google.com/s2/favicons?sz=64&domain=${obj.url}`;
        img.alt = obj.name;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'X';
        deleteBtn.title = 'Remove shortcut';
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            removeShortcut(index);
        });

        const label = document.createElement('div');
        label.className = 'mt-2 text-white small text-center tile-label';
        label.textContent = obj.name;

        tile.appendChild(img);
        iconWrap.appendChild(tile);
        a.appendChild(iconWrap);
        a.appendChild(label);
        col.appendChild(a);
        col.appendChild(deleteBtn);
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
    col.appendChild(a);
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

function constructDate() {
    const container = document.getElementById('title');
    container.textContent = new Date().toLocaleDateString('en-my', {
        day: 'numeric', weekday: 'long', year: 'numeric', month: 'long'
    });
}

document.getElementById('btnAddShortcut').addEventListener('click', () => {
    const name = document.getElementById('modalSiteName').value.trim();
    const url = document.getElementById('modalURL').value.trim();
    if (!name || !url) return;

    chrome.storage.sync.get('shortcuts', (result) => {
        const shortcuts = result.shortcuts || [];
        shortcuts.push({ name, url });
        chrome.storage.sync.set({ shortcuts }, () => {
            constructShortcuts(shortcuts);
            document.getElementById('modalSiteName').value = '';
            document.getElementById('modalURL').value = '';
            bootstrap.Modal.getInstance(document.getElementById('modalAddShortcut')).hide();
        });
    });
});

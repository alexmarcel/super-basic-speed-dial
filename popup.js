chrome.storage.sync.get('shortcuts', (result) => {
    const shortcuts = result.shortcuts || [];
    const container = document.getElementById('shortcuts');

    if (shortcuts.length === 0) {
        const msg = document.createElement('p');
        msg.className = 'text-muted small p-2 mb-0';
        msg.textContent = 'No shortcuts yet. Open a new tab to add some.';
        container.appendChild(msg);
        return;
    }

    const fragment = document.createDocumentFragment();
    shortcuts.forEach((obj) => {
        const col = document.createElement('div');
        col.className = 'col-2 justify-content-center text-nowrap mt-3';

        const a = document.createElement('a');
        a.href = obj.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = 'text-decoration-none';

        const tile = document.createElement('div');
        tile.className = 'tile-icon p-1';
        tile.setAttribute('data-bs-toggle', 'tooltip');
        tile.setAttribute('data-bs-placement', 'bottom');
        tile.title = obj.name;

        const img = document.createElement('img');
        img.className = 'tile-icon-rounded';
        img.width = 32;
        img.height = 32;
        img.src = `https://www.google.com/s2/favicons?sz=64&domain=${obj.url}`;
        img.alt = obj.name;

        tile.appendChild(img);
        a.appendChild(tile);
        col.appendChild(a);
        fragment.appendChild(col);
    });

    container.appendChild(fragment);

    // Init Bootstrap tooltips
    document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach(el => {
        new bootstrap.Tooltip(el);
    });
});

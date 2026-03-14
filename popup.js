function nameToColor(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    return `hsl(${Math.abs(hash) % 360}, 50%, 45%)`;
}

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
        a.target = '_self';
        a.className = 'text-decoration-none';

        const tile = document.createElement('div');
        tile.className = 'tile-icon p-1';
        tile.setAttribute('data-bs-toggle', 'tooltip');
        tile.setAttribute('data-bs-placement', 'bottom');
        tile.title = obj.name;

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

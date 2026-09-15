document.addEventListener('DOMContentLoaded', () => {
    const items = [...document.querySelectorAll('.pub-item')];
    const list = document.getElementById('pub-list');

    // --- venue / tag dropdowns (unchanged logic) ---
    const populate = (selector, attr) => {
        const values = new Set();
        items.forEach(i => {
        const v = i.dataset[attr];
        if (attr === 'tags') v.split(',').forEach(t => t && values.add(t));
        else if (v) values.add(v);
        });
        const sel = document.querySelector(selector);
        [...values].sort().forEach(v => {
        const opt = document.createElement('option');
        opt.value = v; opt.textContent = v;
        sel.appendChild(opt);
        });
    };
    populate('#filter-venue', 'venue');
    populate('#filter-tag', 'tags');

    // --- year range setup ---
    const years = items.map(i => parseInt(i.dataset.year, 10));
    const minYear = Math.min(...years), maxYear = Math.max(...years);
    const yearMin = document.getElementById('year-min');
    const yearMax = document.getElementById('year-max');
    [yearMin, yearMax].forEach(el => { el.min = minYear; el.max = maxYear; });
    yearMin.value = minYear;
    yearMax.value = maxYear;
    const updateYearLabels = () => {
        document.getElementById('year-min-label').textContent = yearMin.value;
        document.getElementById('year-max-label').textContent = yearMax.value;
    };
    updateYearLabels();

    const TYPE_LABELS = {
    conference: 'Conference',
    journal: 'Journal',
    workshop: 'Workshop',
    in_submission: 'In Submission',
    preprint: 'Preprint',
    thesis: 'Thesis',
    patent: 'Patent'
    };

    function matches(item) {
    const lo = Math.min(+yearMin.value, +yearMax.value);
    const hi = Math.max(+yearMin.value, +yearMax.value);
    const y = +item.dataset.year;
    const venue = document.getElementById('filter-venue').value;
    const tag = document.getElementById('filter-tag').value;
    const selectedOnly = document.getElementById('selected-only').checked;

    return y >= lo && y <= hi
        && (venue === 'all' || item.dataset.venue === venue)
        && (tag === 'all' || item.dataset.tags.split(',').includes(tag))
        && (!selectedOnly || item.dataset.selected === 'true');
    }

    function render() {
    const groupBy = document.getElementById('group-by').value;

    list.querySelectorAll('.pub-group-header').forEach(h => h.remove());
    items.forEach(i => { i.style.display = 'none'; });

    const visible = items.filter(matches);

    if (groupBy === 'none') {
        visible.forEach(i => { i.style.display = ''; list.appendChild(i); });
        return;
    }

    const groups = new Map();
    visible.forEach(item => {
        // tags is multi-valued; group by each item's first tag
        const key = groupBy === 'tags'
        ? (item.dataset.tags.split(',')[0] || 'Other')
        : (item.dataset[groupBy] || 'Other');
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(item);
    });

    let keys = [...groups.keys()];
    if (groupBy === 'year') keys.sort((a, b) => b - a);     // newest first
    else keys.sort();                                        // alphabetical

    keys.forEach(key => {
        const header = document.createElement('div');
        header.className = 'pub-group-header';
        header.textContent = groupBy === 'type' ? (TYPE_LABELS[key] || key) : key;
        list.appendChild(header);
        groups.get(key).forEach(item => { item.style.display = ''; list.appendChild(item); });
    });
    }

    [yearMin, yearMax].forEach(el => el.addEventListener('input', () => { updateYearLabels(); render(); }));
    document.getElementById('filter-venue').addEventListener('change', render);
    document.getElementById('filter-tag').addEventListener('change', render);
    document.getElementById('selected-only').addEventListener('change', render);
    document.getElementById('group-by').addEventListener('change', render);
    
    document.querySelectorAll('#view-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#view-toggle button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        list.className = 'pub-list ' + (btn.dataset.view === 'icon' ? 'icon-mode' : 'detail-mode');
        render();
    });
    });
    
    render();
});
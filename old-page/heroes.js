let sortedBy = '';

const ascImg = `<img src="./arrow-asc.png" alt="">`;
const dscImg = `<img src="./arrow-dsc.png" alt="">`;

function removeSortOrder() {
    const headers = document.querySelectorAll('#hero-ranks thead th')
    for (const header of headers)
        header.classList.remove('asc', 'dsc')
}

function compareId(rowA, rowB) {
    const [a, b] = [rowA.id, rowB.id].map(_ => Number.parseInt(_));
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function compareRarity(rowA, rowB) {
    const rarityPriority = ['SSR', 'SR', 'R', 'N'];
    const [a, b] = [rowA, rowB]
        .map(row => row.querySelector(`.rarity`).innerHTML)
        .map(rarity => rarityPriority.indexOf(rarity));
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function compareCriteria(rowA, rowB, criteria) {
    const [a, b] = [rowA, rowB].map(_ => _.querySelector(`.${criteria}`).innerHTML);
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
}

function sortById(rows, sortDescending) {
    rows.sort(compareId);
    if (!sortDescending) rows.reverse();
}

function sortByRarity(rows, sortDescending) {
    rows.sort(compareRarity);
    if (!sortDescending) rows.reverse();
}

function sortByCriteria(rows, criteria, sortDescending) {
    rows.sort((a, b) => compareCriteria(a, b, criteria));
    if (!sortDescending) rows.reverse();
}

function sortRowsBy(sortBy) {
    const th = document.querySelector(`#hero-ranks thead th.${sortBy}`);
    const sortDescending = !th.classList.contains('dsc');
    removeSortOrder();
    th.classList.add(sortDescending ? 'dsc' : 'asc');
    const tbody = document.querySelector('#hero-ranks tbody');
    const rows = [...tbody.querySelectorAll('tr')];
    rows.forEach(row => row.remove());
    sortById(rows, sortDescending);
    if (sortBy === 'rarity') sortByRarity(rows, sortDescending);
    else if (sortBy !== 'rank') sortByCriteria(rows, sortBy, sortDescending);
    rows.forEach(row => tbody.appendChild(row));
}

function toHeader(headerString) {
    const sortBy = headerString.toLowerCase();
    return `
        <th class="${sortBy}" onclick="sortRowsBy('${sortBy}')">
            <div>
                ${headerString}
                <img class="asc" src="./arrow-asc-10px.png" alt="">
                <img class="dsc" src="./arrow-dsc-10px.png" alt="">
            </div>
        </th>`
}

function toRow(heroData, index) {
    const { rank, name, element, rarity } = heroData;
    return `
        <tr id="${index}" class="r${rank} ${rarity} ${element}">
            <td class="rank">${rank}</td>
            <td class="rarity">${rarity}</td>
            <td class="character"><div>
                <div class="portrait"><img class="lazy" data-src="./heroes/portraits/${name}.png" alt="${name}"></div>
                <div class="name">${name}</div>
            </div></td>
            <td class="element">${element}</td>
        </tr>`
}

function createTable(headers, rows) {
    document
        .querySelector('#hero-ranks')
        .innerHTML = `
            <table>
                <thead><tr>${headers}</tr></thead>
                <tbody>${rows}</tbody>
            </table>`;

    document
        .querySelector('#hero-ranks th:first-child')
        .classList.add('dsc');
}

function loadImage(imageNode) {
    imageNode.src = imageNode.dataset.src;
    imageNode.classList.remove('lazy');
}

const tableHeaders =
    ['Rank', 'Rarity', 'Name', 'Element']
        .map(toHeader)
        .join('');

fetch('./heroes/data.json')
    .then(response => response.json())
    .then(data => data.map(toRow).join(''))
    .then(rows => createTable(tableHeaders, rows))
    .then(() => setupLazyLoading('img.lazy', loadImage))
    .catch(e => console.log(e));

let memoizedSorts = new Map();
let sortedBy = 'rank';

function getRowsBy(sortBy) {
    const rows = memoizedSorts.get(sortBy);

    document
        .querySelector('#hero-ranks > table > tbody')
        .innerHTML = (sortBy === sortedBy)
            ? rows.reverse().join('')
            : rows.join('');

    sortedBy = sortBy;
}

function createTable() {
    document
        .querySelector('#hero-ranks')
        .innerHTML = `<table>
            <thead>
                <tr>
                    <th onclick="getRowsBy('rank')">Rank</th>
                    <th onclick="getRowsBy('rarity')">Rarity</th>
                    <th onclick="getRowsBy('name')">Name</th>
                    <th onclick="getRowsBy('element')">Element</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>`;
}

function toRows(heroData) {
    const { rank, name, element, rarity } = heroData;

    return `<tr class="r${rank} ${rarity} ${element}">
        <td class="rank">${rank}</td>
        <td class="rarity">${rarity}</td>
        <td class="name">
            <div>
                <div><img src="./heroes/portraits/${name}.png" alt=""></div>
                <div>${name}</div>
            </div>
        </td>
        <td class="element">${element}</td>
    </tr>`
}

function sortRows(rows, sortBy) {
    return rows.sort((row_a, row_b) => {
        const [a, b] = [row_a[sortBy], row_b[sortBy]];
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
}

function memoizeSortedHeroes(heroList) {
    memoizedSorts.set('rank', heroList.map(toRows));

    ['rarity', 'name', 'element'].forEach(sortBy => {
        memoizedSorts.set(
            sortBy, sortRows(heroList, sortBy).map(toRows)
        );
    });

    return memoizedSorts.get('rank').join('');
}

function setRows(rows) {
    document
        .querySelector('#hero-ranks > table > tbody')
        .innerHTML = rows;
}

createTable();

fetch('./heroes/data.json')
    .then(response => response.json())
    .then(memoizeSortedHeroes)
    .then(setRows)
    .catch(e => console.log(e));


let memoizedSorts = new Map();
let sortedBy = '';

const ascImg = `<img src="./arrow-asc.png" alt="">`;
const dscImg = `<img src="./arrow-dsc.png" alt="">`;

function setRows(rows) {
    document
        .querySelector('#hero-ranks > table > tbody')
        .innerHTML = rows;
}

function sortRowsBy(sortBy) {
    const rows = memoizedSorts.get(sortBy);
    const th = document.querySelector(`#hero-ranks thead th.${sortBy}`);
    const sortDescending = !th.classList.contains('dsc');

    document
        .querySelectorAll('#hero-ranks thead th')
        .forEach(th =>
            th.classList.remove('asc', 'dsc'));

    if (sortDescending) {
        th.classList.add('dsc');
        setRows(rows.join(''));
    } else {
        th.classList.add('asc');
        setRows([...rows].reverse().join(''));
    }
}

function createTable() {
    const cells = ['Rank', 'Rarity', 'Name', 'Element']
        .map(_ => `<th class="${_.toLowerCase()}" onclick="sortRowsBy('${_.toLowerCase()}')">
            <div>
                ${_}
                <img class="asc" src="./arrow-asc-10px.png" alt="">
                <img class="dsc" src="./arrow-dsc-10px.png" alt="">
            </div>
        </th>`)
        .join('');

    document
        .querySelector('#hero-ranks')
        .innerHTML = `<table>
            <thead><tr>${cells}</tr></thead>
            <tbody></tbody>
        </table>`;
}

function toRows(heroData) {
    const { rank, name, element, rarity } = heroData;

    return `<tr class="r${rank} ${rarity} ${element}">
        <td class="rank">${rank}</td>
        <td class="rarity">${rarity}</td>
        <td class="name"><div>
            <div><img src="./heroes/portraits/${name}.png" alt=""></div>
            <div>${name}</div>
        </div></td>
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
}

createTable();

fetch('./heroes/data.json')
    .then(response => response.json())
    .then(memoizeSortedHeroes)
    .then(() => sortRowsBy('rank'))
    .catch(e => console.log(e));

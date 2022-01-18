function toRow(hero) {
    return `<tr>
        <td><img src="./heroes/portraits/${hero.name}.png" alt=""></td>
        <td>${hero.rank}</td>
        <td>${hero.rarity}</td>
        <td>${hero.name}</td>
        <td>${hero.element}</td>
    </tr>`
}

function createTable(rows) {
    const rankingsSection = document.getElementById('hero-ranks');
    rankingsSection.innerHTML = `<table>
        <thead>
            <tr>
                <th>Portrait</th>
                <th>Rank</th>
                <th>Rarity</th>
                <th>Name</th>
                <th>Element</th>
            </tr>
        </thead>
        <tbody>
            ${rows.join('')}
        </tbody>
    </table>`;
}

fetch('./heroes/data.json')
    .then(response => response.json())
    .then(heroList => heroList.map(toRow))
    .then(createTable);

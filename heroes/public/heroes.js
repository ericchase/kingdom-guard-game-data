const skillPowerMap = {}

function updateSkillPowerMap(skill) {
    if (skill.name in skillPowerMap) {
        if (!skillPowerMap[skill.name].includes(skill.power)) {
            skillPowerMap[skill.name].push(skill.power);
            skillPowerMap[skill.name].sort((a, b) => a - b);
        }
    } else {
        skillPowerMap[skill.name] = [skill.power];
    }
}

class Skill {
    constructor(starLevel, data) {
        this.starLevel = starLevel;
        this.support = data.endsWith('*');
        if (this.support)
            data = data.replace('*', '');
        this.name = '';
        this.power = null;
        for (const token of data.split(' '))
            if (Number(token))
                this.power = Number.parseInt(token);
            else
                this.name += token + ' ';
        this.name = this.name.trim();
    }
}

function parseSkills(data) {
    const skillList = [];
    for (let i = 0; i < data.length; i++) {
        const skill = new Skill(i + 1, data[i])
        skillList.push(skill);
        if (skill.name && skill.power)
            updateSkillPowerMap(skill);
    }
    return skillList;
}

class Hero {
    constructor(type, rarity, name, skills) {
        this.type = type;
        this.rarity = rarity;
        this.name = name;
        this.skillList = parseSkills(skills);
        this.rating = this.skillList.reduce((acc, skill) => acc + skill.power, 0);
    }
}

function displayHeroes(heroList) {
    const table = document.createElement('table');
    table.id = 'hero-table';
    table.classList.add('display');
    table.classList.add('compact');
    const theader = document.createElement('thead');
    theader.innerHTML = '<th></th><th>Name</th><th class="type">Type</th><th>Rarity</th><th>* Skill</th><th>** Skill</th><th>*** Skill</th><th>**** Skill</th><th>***** Skill</th><th class="rating">Rating</th>';
    table.appendChild(theader);
    const tbody = document.createElement('tbody');
    for (const hero of heroList) {
        const row = document.createElement('tr');
        row.innerHTML = `<td><div class="portrait"><img src="../portraits/${hero.name}.png" alt=""></div></td><td>${hero.name}</td><td>${hero.type}</td><td>${hero.rarity}</td>`;
        for (const skill of hero.skillList) {
            const cell = document.createElement('td');
            if (skill.name) {
                cell.innerHTML = skill.name;
                if (skill.power) {
                    cell.innerHTML += ` (${skill.power})`;
                }
            }
            if (skill.support)
                cell.classList.add('support');
            row.appendChild(cell);
        }
        row.innerHTML += `<td>${hero.rating}</td>`;
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    container.appendChild(table);
}

fetch('./heroes.csv')
    .then(response => response.text())
    .then(text => {
        const csvObject = Papa.parse(text, { skipEmptyLines: true });
        const [_, ...rows] = csvObject.data;
        const heroList = [];
        for (const row of rows) {
            const [type, rarity, name, ...skills] = row;
            heroList.push(new Hero(type, rarity, name, skills));
        }
        displayHeroes(heroList);

        const heroTable = $('#hero-table').DataTable({ paging: false });

        heroTable
            .column('.rating')
            .order('desc')
            .draw();

        heroTable
            .column('.type')
            .order('asc')
            .draw();
    });
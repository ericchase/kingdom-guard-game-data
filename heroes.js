fetch('./heroes/data.json')
    .then(response => response.json())
    .then(heroList => {
        heroList.map(function (hero) {
            return `<div class="hero-item">
                    <img src="./portraits/${hero.name}.png" alt="${hero.name}">
                    <div class="hero-rank">${hero.rank}</div>
                    <div class="hero-class">${hero.class}</div>
                    <div class="hero-name">${hero.name}</div>
                    <div class="hero-element">${hero.element}</div>
                </div>`
        }).forEach(function (heroCard) {
            document.getElementById('hero-cards').innerHTML += heroCard
        });
    });

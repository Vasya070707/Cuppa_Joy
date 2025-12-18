const teamMembers = [
        {
            img: 'image/team/max.jpg',
            name: 'Максим<br>Тарасенко',
            desc: 'Лучший бариста,<br>27 лет',
            alt: 'Максим Тарасенко'
        },
        {
            img: 'image/team/anna.jpg',
            name: 'Анна<br>Карпова',
            desc: 'Директор, <br>24 года',
            alt: 'Анна Карпова'
        },
        {
            img: 'image/team/marina.jpg',
            name: 'Марина<br>Каравен',
            desc: 'Пекарь,<br>22 года',
            alt: 'Марина Кузнецова'
        },
        {
            img: 'image/team/akir.jpg',
            name: 'Акир<br>Неревич',
            desc: 'Официант,<br>22 года',
            alt: 'Акир Неревич'
        }
    ];
    let teamIndex = 0;
    const card = document.getElementById('team-card');
    const prev = document.getElementById('team-prev');
    const next = document.getElementById('team-next');
    function renderTeam(idx) {
        card.innerHTML = `
            <img src="${teamMembers[idx].img}" alt="${teamMembers[idx].alt}">
            <div class="team-card-info">
                <div class="name">${teamMembers[idx].name}</div>
                <div class="desc">${teamMembers[idx].desc}</div>
            </div>
        `;
    }
    prev.onclick = function() {
        teamIndex = (teamIndex - 1 + teamMembers.length) % teamMembers.length;
        renderTeam(teamIndex);
    };
    next.onclick = function() {
        teamIndex = (teamIndex + 1) % teamMembers.length;
        renderTeam(teamIndex);
    };
    renderTeam(teamIndex);

const offersForm = document.forms.offersForm;

let name = offersForm.elements.name;
let offers = offersForm.elements.offers;

offersForm.addEventListener('submit', async(e)=>{
    e.preventDefault();

    const offersFormData = {
        name: name.value,
        offers: offers.value,
    };

    const res = await fetch('http://localhost:3000/offers', {
        method: 'POST',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(offersFormData)
    })
    
    if (!res.ok) {
        throw new Error(`status ${res.status}`);
    }

    const data = await res.json();

    alert(data.message);
})
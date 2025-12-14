const quest = document.forms.QuestForm;

let fullName = quest.elements.fullName;
let phone = quest.elements.phone;
let email = quest.elements.email;
let question = quest.elements.question;


quest.addEventListener('submit', async (e)=> {
    e.preventDefault();
    const QuestData = {
        fullName: fullName.value,
        phone: phone.value,
        email: email.value,
        question: question.value,
    };

        const response = await fetch('http://localhost:3000/quest', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(QuestData)
    })
    
    if (!response.ok){
        throw new Error(`status ${response.status}`);
    }

    const data = await response.json();
    alert(data.message)

});

        const btn_menu = document.querySelector(".menu-burger");
const menu = document.querySelector(".dropdown-menu");
if (btn_menu && menu) {
    btn_menu.addEventListener('click', function() {
        console.log('Клик! Элемент:', this);
        if (menu.style.display === "flex") {
            menu.style.display = "none";
        } else {
            menu.style.display = "flex";
        }
        menu.style.backgroundColor = "#D5B68A";
    });
} else {
    console.error("Не найдены элементы!");
}
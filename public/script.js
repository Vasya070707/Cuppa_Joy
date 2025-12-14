const form = document.forms.orderForm;

let name = form.elements.name;
let number = form.elements.number;
let adress = form.elements.adress;
let order = form.elements.order;


form.addEventListener('submit', async (e) =>{
    e.preventDefault();
    const FormData = {
        name: name.value,
        number: number.value,
        adress: adress.value,
        order: order.value,
    };

    const res = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(FormData)
    })
    
    if (!res.ok){
        throw new Error(`status ${res.status}`);
    }

    const data = await res.json();
    alert(data.message)

})

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



    

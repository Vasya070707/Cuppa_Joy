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
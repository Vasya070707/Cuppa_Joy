// Для мобильных: открытие меню по клику
const burger = document.getElementById('burger-menu');
const menu = document.getElementById('dropdown-menu');
const container = burger.parentElement;

burger.addEventListener('click', function(e) {
    e.stopPropagation();
    container.classList.toggle('active');
});

// Закрытие меню при клике вне его
document.addEventListener('click', function(e) {
    if (container.classList.contains('active') && !container.contains(e.target)) {
        container.classList.remove('active');
    }
});
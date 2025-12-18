// Скрипт для обработки ссылок на профиль
document.addEventListener('DOMContentLoaded', function() {
    function updateProfileLinks() {
        // Находим все ссылки на профиль/логин
        const profileLinks = document.querySelectorAll('a[href="login.html"], a[href*="profil.html"], a#profile-link');
        
        const userId = localStorage.getItem('userId');
        
        profileLinks.forEach(link => {
            if (userId) {
                // Если пользователь залогинен, меняем ссылку на профиль
                link.href = `profil.html?userId=${userId}`;
            } else {
                // Если не залогинен, оставляем ссылку на страницу входа
                link.href = 'login.html';
            }
        });
    }
    
    // Обновляем ссылки при загрузке страницы
    updateProfileLinks();
    
    // Также обрабатываем клики по ссылкам на профиль
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a');
        if (link && (link.href.includes('login.html') || link.id === 'profile-link')) {
            const userId = localStorage.getItem('userId');
            if (userId) {
                e.preventDefault();
                window.location.href = `profil.html?userId=${userId}`;
            }
        }
    });
    
    // Обновляем ссылки при изменении localStorage (если пользователь залогинился в другой вкладке)
    window.addEventListener('storage', function(e) {
        if (e.key === 'userId') {
            updateProfileLinks();
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    let reviews = [];
    let reviewIndex = 0;
    const slide = document.getElementById('review-slide');
    const prev = document.getElementById('slider-prev');
    const next = document.getElementById('slider-next');

    async function loadReviews() {
    try {
        const response = await fetch('/review');
        reviews = await response.json();
        console.log('Загруженные отзывы с сервера:', reviews); 
        renderReview(0);
    } catch(error) {
        console.error('Ошибка:', error);
        reviews = [
            { name: 'Евгений Валетин', text: 'Очень понравилась атмосфера' },
            { name: 'Валентин Нолен', text: 'Очень вкусный кофе' },
            { name: 'Марина Тумблер', text: 'Невероятно свежая и вкусная выпечка!' },
        ];
        console.log('Используем тестовые отзывы:', reviews); 
        renderReview(0);
    }
}

    function renderReview(idx) {
        slide.innerHTML = `
            <div class="review-card-slider">
                <div class="review-slider-name">${reviews[idx]?.name || ''}</div>
                <div class="review-slider-text">${reviews[idx]?.text || ''}</div>
            </div>
        `;
    }

    prev.onclick = () => {
        reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;
        renderReview(reviewIndex);
    };
    next.onclick = () => {
        reviewIndex = (reviewIndex + 1) % reviews.length;
        renderReview(reviewIndex);
    };

    loadReviews();

    const form = document.querySelector('.reviews-form');

    form.addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = {
        name: form.querySelector('input[name="name"]').value,
        text: form.querySelector('textarea[name="text"]').value
    };
    
    // Если пользователь залогинен, добавляем userId из localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
        formData.userId = userId;
    }
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Отправка...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/review', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (response.ok) {
            alert('Спасибо! Ваш отзыв добавлен.');
            form.reset(); 
            
            await loadReviews();
            reviewIndex = 0; 
        } else {
            alert('Ошибка: ' + (result.err || 'Не удалось отправить отзыв'));
        }
    } catch (error) {
        console.error('Полная ошибка отправки:', error);
    console.error('Ответ сервера:', await response?.text());
    alert('Ошибка: ' + error.message);
    } 
});
});

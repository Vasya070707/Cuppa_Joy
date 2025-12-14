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
            renderReview(0);
        } catch(error) {
            console.error('Ошибка:', error);
            reviews = [
                { name: 'Евгений Валетин', text: 'Очень понравилась атмосфера' },
                { name: 'Валентин Нолен', text: 'Очень вкусный кофе' },
                { name: 'Марина Тумблер', text: 'Невероятно свежая и вкусная выпечка!' },

            ];
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
});

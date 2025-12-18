document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('orderForm');

    if (form) {
        let name = form.elements.name;
        let number = form.elements.number;
        let adress = form.elements.adress;
        let order = form.elements.order;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const FormData = {
                name: name.value,
                number: number.value,
                adress: adress.value,
                order: order.value,
            };

            // Если пользователь залогинен, добавляем userId из localStorage
            const userId = localStorage.getItem('userId');
            console.log('userId из localStorage:', userId);
            if (userId) {
                FormData.userId = userId;
            }
            
            console.log('Отправляемые данные:', FormData);

            try {
                const res = await fetch('/submit', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(FormData)
                });
                
                if (!res.ok){
                    const errorData = await res.json().catch(() => ({ err: 'Ошибка сервера' }));
                    throw new Error(errorData.err || `Ошибка ${res.status}`);
                }

                const data = await res.json();
                alert(data.message);
                form.reset();
            } catch (error) {
                alert('Ошибка: ' + error.message);
            }
        });
    }
});

const quest = document.getElementById('QuestForm');

if (quest) {
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

    // Если пользователь залогинен, добавляем userId из localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
        QuestData.userId = userId;
    }

        try {
            const response = await fetch('/quest', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(QuestData)
            });
            
            if (!response.ok){
                const errorData = await response.json().catch(() => ({ err: 'Ошибка сервера' }));
                throw new Error(errorData.err || `Ошибка ${response.status}`);
            }

            const data = await response.json();
            alert(data.message);
            quest.reset();
        } catch (error) {
            alert('Ошибка: ' + error.message);
        }
    });
}
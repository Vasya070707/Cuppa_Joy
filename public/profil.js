let currentUserId = null;
        let isRegister = false;

        function toggleForm() {
            isRegister = !isRegister;
            document.getElementById('title').textContent = isRegister ? 'Регистрация' : 'Вход';
        }

        async function login() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const endpoint = isRegister ? '/register' : '/login';
            const data = { username, password };

            try {
                const res = await fetch(endpoint, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await res.json();

                if (res.ok) {
                    currentUserId = result.userId;
                    document.getElementById('userName').textContent = result.username || username;
                    document.getElementById('userId').textContent = result.userId;
                    document.getElementById('auth').classList.add('hidden');
                    document.getElementById('profile').classList.remove('hidden');
                } else {
                    alert(result.error);
                }
            } catch (err) {
                alert('Ошибка соединения');
            }
        }

        async function logout() {
            currentUserId = null;
            document.getElementById('auth').classList.remove('hidden');
            document.getElementById('profile').classList.add('hidden');
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
        }
 
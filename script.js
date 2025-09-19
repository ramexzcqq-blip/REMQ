document.addEventListener('DOMContentLoaded', function() {
    const logoBtn = document.getElementById('logo-btn');
    const modal = document.getElementById('modal');
    const closeButton = document.getElementById('close-modal');
    const serverInfo = document.getElementById('server-info');
    const serverStatus = document.getElementById('server-status');
    const serverIp = document.getElementById('server-ip');
    const copyBtn = document.getElementById('copy-btn');
    
    // Обработчик клика по логотипу
    logoBtn.addEventListener('click', function() {
        modal.classList.add('active');
        fetchServerInfo();
    });
    
    // Закрытие модального окна
    closeButton.addEventListener('click', function() {
        modal.classList.remove('active');
    });
    
    // Закрытие при клике вне области контента
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });
    
    // Копирование IP адреса
    serverIp.addEventListener('click', copyIpToClipboard);
    copyBtn.addEventListener('click', copyIpToClipboard);
    
    function copyIpToClipboard() {
        const ip = 'tcp.cloudpub.ru:27271';
        navigator.clipboard.writeText(ip).then(() => {
            showCopyNotification();
        }).catch(err => {
            // Fallback для браузеров без поддержки clipboard API
            const textArea = document.createElement('textarea');
            textArea.value = ip;
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                showCopyNotification();
            } catch (fallbackErr) {
                console.error('Ошибка при копировании: ', fallbackErr);
            }
            document.body.removeChild(textArea);
        });
    }
    
    function showCopyNotification() {
        // Создаем или находим уведомление
        let notification = document.querySelector('.copy-notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'copy-notification';
            notification.textContent = 'IP скопирован в буфер обмена!';
            document.body.appendChild(notification);
        }
        
        // Показываем уведомление
        notification.classList.add('show');
        
        // Скрываем через 3 секунды
        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }
    
    // Проверка статуса сервера при загрузке
    checkServerStatus();
    
    // Функция для проверки статуса сервера
    async function checkServerStatus() {
        try {
            const response = await fetch('/.netlify/functions/server-status');
            const data = await response.json();
            
            if (data.online) {
                serverStatus.innerHTML = `
                    <div class="status-online">
                        <i class="fas fa-check-circle"></i> ${data.message}
                    </div>
                    <div class="players-count">
                        Игроков онлайн: ${data.players || 0}/${data.maxPlayers || 20}
                    </div>
                `;
            } else {
                serverStatus.innerHTML = `
                    <div class="status-offline">
                        <i class="fas fa-times-circle"></i> ${data.message}
                    </div>
                    <div class="players-count">
                        Сервер недоступен
                    </div>
                `;
            }
        } catch (error) {
            serverStatus.innerHTML = `
                <div class="status-error">
                    <i class="fas fa-exclamation-circle"></i> Ошибка при проверке статуса сервера
                </div>
            `;
            console.error('Error:', error);
        }
    }
    
    // Функция для получения информации о сервере
    async function fetchServerInfo() {
        serverInfo.innerHTML = `
            <div class="loading">
                <i class="fas fa-spinner fa-spin"></i> Загрузка информации о сервере...
            </div>
        `;
        
        try {
            // Для Netlify используем статические данные
            const serverData = [
                { title: "Статус сервера", value: "Онлайн" },
                { title: "IP адрес", value: "tcp.cloudpub.ru:27271" },
                { title: "Версия Minecraft", value: "1.21.5" },
                { title: "Модпак", value: "Fabric" },
                { title: "Режим", value: "Выживание" },
                { title: "Игроков онлайн", value: "0/20" },
                { title: "Владелец", value: "REMQ" }
            ];
            
            displayServerInfo(serverData);
        } catch (error) {
            serverInfo.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i> Ошибка при загрузке информации о сервере
                </div>
            `;
            console.error('Error:', error);
        }
    }
    
    // Функция для отображения информации о сервере
    function displayServerInfo(data) {
        if (!data || data.length === 0) {
            serverInfo.innerHTML = `
                <div class="error">
                    <i class="fas fa-exclamation-triangle"></i> Не удалось загрузить информацию о сервере
                </div>
            `;
            return;
        }
        
        let html = '';
        data.forEach((item, index) => {
            html += `
                <div class="info-item">
                    <h3>${item.title}</h3>
                    <p>${item.value}</p>
                </div>
            `;
        });
        
        serverInfo.innerHTML = html;
    }
    
    // Добавляем обработчики для изображений в галерее
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            this.classList.toggle('enlarged');
        });
    });
});

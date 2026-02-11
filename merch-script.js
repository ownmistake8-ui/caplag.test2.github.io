// Данные товаров (с изображениями)
const products = [
    {
        id: 1,
        name: "Игровая форма Caplag Pro",
        category: "jersey",
        price: 4990,
        description: "Официальная игровая форма команды Caplag. Премиум качество, влагоотводящий материал с логотипом команды.",
        image: "T-shirt.webp",
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Черный с зеленым"]
    },
    {
        id: 2,
        name: "Худи Caplag Black Edition",
        category: "hoodie",
        price: 3490,
        description: "Тёплое худи с вышитым логотипом команды. Идеально для тренировок и повседневной носки. Качественный хлопок.",
        image: "Hoodie.webp",
        sizes: ["M", "L", "XL", "XXL"],
        colors: ["Черный"]
    },
    {
        id: 3,
        name: "Футболка Caplag Signature",
        category: "t-shirt",
        price: 1990,
        description: "Классическая футболка с принтом логотипа команды. 100% хлопок, качественная печать, комфортная носка.",
        image: "T-shirt white.webp",
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Черный", "Белый"]
    },
    {
        id: 4,
        name: "Кепка Caplag Performance",
        category: "accessory",
        price: 1290,
        description: "Спортивная кепка с регулируемой застёжкой. Защита от солнца с стилем. Логотип команды спереди.",
        image: "cap.webp",
        sizes: ["ONE SIZE"],
        colors: ["Черный"]
    },
    {
        id: 5,
        name: "Толстовка Caplag Crew",
        category: "hoodie",
        price: 3990,
        description: "Утеплённая толстовка для фанатов команды. С капюшоном и карманом-кенгуру. Вышитый логотип.",
        image: "Hoodie 2.webp",
        sizes: ["S", "M", "L", "XL"],
        colors: ["Черный", "Серый"]
    },
    {
        id: 6,
        name: "Футболка Caplag Retro",
        category: "t-shirt",
        price: 1790,
        description: "Ретро-дизайн с логотипом первого сезона команды. Ограниченная серия. Коллекционный предмет.",
        image: "T-shirt old.webp",
        sizes: ["S", "M", "L"],
        colors: ["Черный"]
    },
    {
        id: 7,
        name: "Кружка Caplag Energy",
        category: "accessory",
        price: 890,
        description: "Керамическая кружка с логотипом команды. Идеально для утреннего кофе или чая во время стримов.",
        image: "cup.webp",
        sizes: ["ONE SIZE"],
        colors: ["Черный"]
    },
    {
        id: 8,
        name: "Рюкзак Caplag Pro Gear",
        category: "accessory",
        price: 5990,
        description: "Вместительный рюкзак для геймеров. Отделение для ноутбука до 17\", мыши и клавиатуры.",
        image: "bag.webp",
        sizes: ["ONE SIZE"],
        colors: ["Черный"]
    }
];

// Корзина
let cart = JSON.parse(localStorage.getItem('capLagCart')) || [];

// Сохранение корзины
function saveCart() {
    localStorage.setItem('capLagCart', JSON.stringify(cart));
}

// Загрузка товаров
function loadProducts(filter = 'all') {
    const container = document.getElementById('products-container');
    if (!container) return;
    
    let filteredProducts = products;
    if (filter !== 'all') {
        filteredProducts = products.filter(product => product.category === filter);
    }
    
    container.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <div class="product-category">${getCategoryName(product.category)}</div>
                <img src="${product.image}" 
                     alt="${product.name}" 
                     loading=""
                     style="max-width: 100%; max-height: 100%;">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <button class="btn-view" onclick="viewProduct(${product.id})">ПОСМОТРЕТЬ</button>
                    <button class="btn-add-to-cart" onclick="addToCart(${product.id})">В КОРЗИНУ</button>
                </div>
            </div>
        </div>
    `).join('');
}

// Настройка фильтров
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем active у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Добавляем active текущей кнопке
            this.classList.add('active');
            
            // Фильтруем товары
            const filter = this.dataset.filter;
            loadProducts(filter);
        });
    });
}

// Просмотр товара
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const modalContent = document.getElementById('modal-product-details');
    
    modalContent.innerHTML = `
        <div class="modal-product-image">
            <img src="${product.image}" alt="${product.name}">
        </div>
        <div class="modal-product-info">
            <h2>${product.name}</h2>
            <div class="modal-product-category">${getCategoryName(product.category)}</div>
            <div class="modal-product-price">${formatPrice(product.price)}</div>
            <p class="modal-product-description">${product.description}</p>
            
            ${product.sizes.length > 0 ? `
                <div class="modal-size-selector">
                    <h4>ВЫБЕРИТЕ РАЗМЕР:</h4>
                    <div class="size-buttons">
                        ${product.sizes.map((size, index) => `
                            <button class="size-btn ${index === 0 ? 'selected' : ''}" 
                                    onclick="selectSize(this)"
                                    data-size="${size}">
                                ${size}
                            </button>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="modal-quantity">
                <h4>КОЛИЧЕСТВО:</h4>
                <div class="modal-quantity-control">
                    <button class="modal-quantity-btn" onclick="changeQuantity(-1)">-</button>
                    <span class="modal-quantity-value">1</span>
                    <button class="modal-quantity-btn" onclick="changeQuantity(1)">+</button>
                </div>
            </div>
            
            <div class="modal-actions">
                <button class="btn-modal-add-to-cart" onclick="addToCartFromModal(${product.id})">
                    ДОБАВИТЬ В КОРЗИНУ
                </button>
                <button class="btn-modal-buy-now" onclick="buyNow(${product.id})">
                    КУПИТЬ СЕЙЧАС
                </button>
            </div>
        </div>
    `;
    
    modal.classList.add('show');
}

// Настройка модального окна
function setupModal() {
    const modal = document.getElementById('product-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    // Закрытие по крестику
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('show');
        });
    }
    
    // Закрытие по клику вне окна
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.classList.remove('show');
        }
    });
    
    // Закрытие по Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            modal.classList.remove('show');
        }
    });
}

// Выбор размера
function selectSize(button) {
    // Убираем selected у всех кнопок
    document.querySelectorAll('.size-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Добавляем selected выбранной кнопке
    button.classList.add('selected');
}

// Изменение количества
function changeQuantity(delta) {
    const quantityElement = document.querySelector('.modal-quantity-value');
    if (!quantityElement) return;
    
    let quantity = parseInt(quantityElement.textContent) + delta;
    if (quantity < 1) quantity = 1;
    if (quantity > 10) quantity = 10;
    
    quantityElement.textContent = quantity;
}

// Добавление в корзину из модального окна
function addToCartFromModal(productId) {
    const modal = document.getElementById('product-modal');
    const selectedSize = modal.querySelector('.size-btn.selected')?.dataset.size || 'M';
    const quantityElement = modal.querySelector('.modal-quantity-value');
    const quantity = quantityElement ? parseInt(quantityElement.textContent) : 1;
    
    addToCart(productId, selectedSize, quantity);
    modal.classList.remove('show');
}

// Добавление в корзину
function addToCart(productId, size = 'M', quantity = 1) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Проверяем, есть ли уже такой товар в корзине
    const existingItem = cart.find(item => 
        item.id === productId && item.size === size
    );
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            category: product.category,
            price: product.price,
            image: product.image,
            size: size,
            quantity: quantity
        });
    }
    
    // Сохраняем корзину в localStorage
    saveCart();
    
    // Обновляем корзину
    updateCartDisplay();
    
    // Показываем уведомление
    showNotification(`${product.name} добавлен в корзину!`);
}

// Загрузка корзины
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const cartEmpty = document.getElementById('cart-empty');
    const cartCount = document.getElementById('cart-count');
    const subtotalElement = document.getElementById('subtotal');
    const totalElement = document.getElementById('total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<div class="cart-empty" id="cart-empty"><i class="fas fa-shopping-cart"></i><p>Корзина пуста</p></div>';
        cartCount.textContent = '(0)';
        subtotalElement.textContent = '0 ₽';
        totalElement.textContent = '500 ₽';
        checkoutBtn.disabled = true;
        return;
    }
    
    // Показываем товары в корзине
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}" data-size="${item.size}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-category">${getCategoryName(item.category)} • Размер: ${item.size}</div>
                <div class="cart-item-controls">
                    <div class="quantity-control">
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, '${item.size}', -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity(${item.id}, '${item.size}', 1)">+</button>
                    </div>
                    <button class="remove-item" onclick="removeFromCart(${item.id}, '${item.size}')">
                        <i class="fas fa-trash"></i> Удалить
                    </button>
                </div>
            </div>
            <div class="cart-item-price">${formatPrice(item.price * item.quantity)}</div>
        </div>
    `).join('');
    
    // Обновляем счетчик
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = `(${totalItems})`;
    
    // Обновляем суммы
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 5000 ? 0 : 500;
    const total = subtotal + shipping;
    
    subtotalElement.textContent = `${formatPrice(subtotal)}`;
    totalElement.textContent = `${formatPrice(total)}`;
    
    // Обновляем стоимость доставки
    document.getElementById('shipping').textContent = shipping === 0 ? 'БЕСПЛАТНО' : `${formatPrice(shipping)}`;
    
    // Активируем кнопку оформления заказа
    checkoutBtn.disabled = false;
}

// Обновление количества товара в корзине
function updateCartQuantity(productId, size, delta) {
    const item = cart.find(item => item.id === productId && item.size === size);
    
    if (item) {
        item.quantity += delta;
        
        if (item.quantity < 1) {
            removeFromCart(productId, size);
        } else {
            saveCart();
            updateCartDisplay();
        }
    }
}

// Удаление из корзины
function removeFromCart(productId, size) {
    cart = cart.filter(item => !(item.id === productId && item.size === size));
    saveCart();
    updateCartDisplay();
    
    // Показываем уведомление
    showNotification('Товар удалён из корзины');
}

// Настройка кнопки оформления заказа
function setupCheckoutButton() {
    const checkoutBtn = document.getElementById('checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) return;
            
            // Здесь можно подключить платежную систему
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 500;
            
            alert(`Оформление заказа!\n\nТоваров в корзине: ${totalItems}\nОбщая сумма: ${formatPrice(total)}`);
            
            // Очищаем корзину после оформления
            cart = [];
            saveCart();
            updateCartDisplay();
        });
    }
}

// Функция "Купить сейчас"
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Добавляем в корзину
    addToCart(productId);
    
    // Показываем сообщение о покупке
    setTimeout(() => {
        alert('Покупка оформлена! В реальном проекте здесь будет переход к оплате.');
        
        // Очищаем корзину (только этот товар)
        cart = cart.filter(item => !(item.id === productId));
        saveCart();
        updateCartDisplay();
    }, 100);
}

// Вспомогательные функции
function getCategoryName(category) {
    const categories = {
        'jersey': 'ФОРМА',
        'hoodie': 'ХУДИ',
        't-shirt': 'ФУТБОЛКИ',
        'accessory': 'АКСЕССУАРЫ'
    };
    return categories[category] || category;
}

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + ' ₽';
}

function showNotification(message) {
    // Создаем уведомление
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #76ff03;
        color: #000;
        padding: 15px 25px;
        border-radius: 4px;
        font-weight: 700;
        z-index: 1000;
        animation: slideIn 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Автоматическое удаление через 3 секунды
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Инициализация магазина
function initMerchStore() {
    // Загружаем товары
    loadProducts();
    
    // Загружаем корзину
    updateCartDisplay();
    
    // Настройка фильтров
    setupFilters();
    
    // Настройка модального окна
    setupModal();
    
    // Настройка кнопки оформления заказа
    setupCheckoutButton();
}

// Добавляем стили для анимации уведомления
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.merch-hero')) {
        initMerchStore();
    }
});
const products = [
  {
    id: 1,
    name: 'iPhone 15 Pro 256GB',
    category: 'Смартфони',
    price: 52999,
    oldPrice: 55999,
    badge: 'Хіт',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 256GB',
    category: 'Смартфони',
    price: 38999,
    oldPrice: 41999,
    badge: 'Акція',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    name: 'Xiaomi 14 512GB',
    category: 'Смартфони',
    price: 29999,
    oldPrice: 32999,
    badge: 'Топ ціна',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    name: 'AirPods Pro 2',
    category: 'Аксесуари',
    price: 9999,
    oldPrice: 11499,
    badge: 'Популярне',
    image: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    name: 'Apple Watch Series 9',
    category: 'Гаджети',
    price: 18999,
    oldPrice: 20999,
    badge: 'Новинка',
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    name: 'Power Bank 20000 mAh',
    category: 'Аксесуари',
    price: 1499,
    oldPrice: 1899,
    badge: 'Must have',
    image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80'
  }
];

const catalogGrid = document.getElementById('catalogGrid');
const searchInput = document.getElementById('searchInput');
const cartCount = document.getElementById('cartCount');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartModal = document.getElementById('cartModal');
const checkoutModal = document.getElementById('checkoutModal');

let cart = JSON.parse(localStorage.getItem('smartzone-cart') || '[]');

function saveCart() {
  localStorage.setItem('smartzone-cart', JSON.stringify(cart));
}

function money(value) {
  return value.toLocaleString('uk-UA') + ' ₴';
}

function renderCatalog(items) {
  catalogGrid.innerHTML = items.map(product => `
    <article class="product-card">
      <img src="${product.image}" alt="${product.name}">
      <div class="product-body">
        <span class="badge">${product.badge}</span>
        <h3>${product.name}</h3>
        <div class="category">${product.category}</div>
        <div class="price-row">
          <div class="price">${money(product.price)}</div>
          <div class="old-price">${money(product.oldPrice)}</div>
        </div>
        <button class="primary full" onclick="addToCart(${product.id})">В кошик</button>
      </div>
    </article>
  `).join('');
}

function updateCartUI() {
  cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  if (!cart.length) {
    cartItems.innerHTML = '<p>У кошику поки немає товарів.</p>';
    cartTotal.textContent = money(0);
    return;
  }

  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item">
      <img src="${item.image}" alt="${item.name}">
      <div>
        <strong>${item.name}</strong>
        <p>Кількість: ${item.qty}</p>
        <p>${money(item.price)}</p>
      </div>
      <button onclick="removeFromCart(${item.id})">Видалити</button>
    </div>
  `).join('');

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  cartTotal.textContent = money(total);
}

window.addToCart = function(id) {
  const product = products.find(p => p.id === id);
  const found = cart.find(item => item.id === id);
  if (found) {
    found.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartUI();
};

window.removeFromCart = function(id) {
  cart = cart.filter(item => item.id !== id);
  saveCart();
  updateCartUI();
};

document.getElementById('openCartBtn').addEventListener('click', () => cartModal.classList.remove('hidden'));
document.getElementById('closeCartBtn').addEventListener('click', () => cartModal.classList.add('hidden'));
document.getElementById('checkoutBtn').addEventListener('click', () => {
  if (!cart.length) {
    alert('Кошик порожній');
    return;
  }
  cartModal.classList.add('hidden');
  checkoutModal.classList.remove('hidden');
});
document.getElementById('closeCheckoutBtn').addEventListener('click', () => checkoutModal.classList.add('hidden'));

document.getElementById('checkoutForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Замовлення оформлено. Для GitHub-версії це демо-режим.');
  cart = [];
  saveCart();
  updateCartUI();
  checkoutModal.classList.add('hidden');
  e.target.reset();
});

searchInput.addEventListener('input', (e) => {
  const query = e.target.value.trim().toLowerCase();
  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(query) || product.category.toLowerCase().includes(query)
  );
  renderCatalog(filtered);
});

renderCatalog(products);
updateCartUI();

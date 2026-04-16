const cartListEl = document.getElementById('cart-items-list');
const cartTotalEl = document.getElementById('cart-total');
const checkoutButtonEl = document.getElementById('checkout-button');

async function cartRequest(path, method = 'GET', payload = null) {
    const options = { method };
    if (payload) {
        options.headers = { 'Content-Type': 'application/json' };
        options.body = JSON.stringify(payload);
    }

    const res = await fetch(path, options);
    if (!res.ok) {
        throw new Error(`Request failed: ${path}`);
    }

    if (method === 'GET') {
        return await res.json();
    }

    return null;
}

async function addToCart(clothesId) {
    await cartRequest('/api/cart/add', 'POST', { clothes_id: clothesId, quantity: 1 });

    await updateCartBadge();
    if (window.location.pathname.toLowerCase().includes('cart.html')) {
        await renderCart();
    }
}

async function getCart() {
    return await cartRequest('/api/cart');
}

async function removeFromCart(clothesId) {
    await cartRequest('/api/cart/remove', 'POST', { clothes_id: clothesId });

    await renderCart();
    await updateCartBadge();
}

async function updateCartBadge() {
    try {
        const cartItems = await getCart();
        const totalCount = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
        document.querySelectorAll('.cartbadge').forEach((badge) => {
            badge.textContent = String(totalCount);
        });
    } catch (error) {

        console.error(error);
    }
}

async function renderCart() {
    if (!cartListEl || !cartTotalEl) {
        return;
    }

    try {
        const cartItems = await getCart();

        if (cartItems.length === 0) {
            cartListEl.innerHTML = '<p class="cartEmpty">Your cart is empty.</p>';
            cartTotalEl.textContent = 'Total: $' + (0).toFixed(2);
            if (checkoutButtonEl) {
                checkoutButtonEl.disabled = true;
            }
            return;
        }

        cartListEl.innerHTML = cartItems.map((item) => `
            <article class="cartItem">
                <img class="cartItemImage" src="${item.image}" alt="${item.name}">
                <div class="cartItemInfo">
                    <h3>${item.name}</h3>
                    <p>Qty: ${item.quantity}</p>
                    <p>$${item.price}</p>
                </div>
                <button class="cartRemoveBtn" data-cart-remove-id="${item.id}">Remove</button>
            </article>
        `).join('');

        const total = cartItems.reduce((sum, item) => {
            return sum + Number(item.price) * Number(item.quantity);
        }, 0);
        cartTotalEl.textContent = 'Total: $' + total.toFixed(2);
        if (checkoutButtonEl) {
            checkoutButtonEl.disabled = false;
        }
    } catch (error) {
        console.error(error);
        cartListEl.innerHTML = '<p class="cartEmpty">Could not load your cart right now.</p>';
        cartTotalEl.textContent = 'Total: $' + (0).toFixed(2);
        if (checkoutButtonEl) {
            checkoutButtonEl.disabled = true;
        }
    }
}

if (cartListEl) {
    cartListEl.addEventListener('click', async (event) => {
        const removeButton = event.target.closest('[data-cart-remove-id]');
        if (!removeButton) {
            return;
        }

        const itemId = Number(removeButton.dataset.cartRemoveId);
        if (Number.isNaN(itemId)) {
            return;
        }

        await removeFromCart(itemId);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await updateCartBadge();
    if (window.location.pathname.toLowerCase().includes('cart.html')) {
        await renderCart();
    }
});


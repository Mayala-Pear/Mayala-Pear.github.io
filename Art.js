// Initialize cart
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartCount = cart.reduce((count, item) => count + item.quantity, 0);

// Function to update the cart count displayed in the header
function updateCartCount() {
    document.getElementById('cart-count').textContent = cartCount;
}

// Function to update the total price in the cart
function updateCartTotal() {
    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total-price').textContent = total.toFixed(2);
}

// Function to display cart items
function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; // Clear previous items
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <div>
                <h3>${item.name}</h3>
                <p>Price: $${item.price.toFixed(2)} x ${item.quantity}</p>
                <button class="remove-item" data-id="${item.name}">Remove</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    attachRemoveItemListeners();
}

// Function to add an item to the cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ name, price: parseFloat(price), quantity: 1 });
    }
    cartCount++;
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateCartTotal();
    displayCartItems();
}

// Function to handle "Add to Cart" button clicks
function handleAddToCartButtons() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-name');
            const price = button.getAttribute('data-price');
            addToCart(name, price);
            alert('Item added to cart!');
        });
    });
}

// Attach the "Remove" button functionality
function attachRemoveItemListeners() {
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', () => {
            const name = button.getAttribute('data-id');
            cart = cart.filter(item => item.name !== name);
            cartCount = cart.reduce((count, item) => count + item.quantity, 0);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            updateCartTotal();
            displayCartItems();
        });
    });
}

// Initialize the cart and setup event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    updateCartTotal();
    displayCartItems();
    handleAddToCartButtons();
});

// Show cart summary when cart button is clicked
document.getElementById('cart-button').addEventListener('click', () => {
    window.location.href = 'cart.html';
});

// Accordion functionality
document.addEventListener('DOMContentLoaded', () => {
    const accordions = document.querySelectorAll('.accordion h3');
    accordions.forEach(accordion => {
        accordion.addEventListener('click', function () {
            this.classList.toggle('active');
            let content = this.nextElementSibling;
            content.style.display = content.style.display === 'block' ? 'none' : 'block';
        });
    });
});

// Sticky navbar functionality
window.onscroll = function () { stickyNavbar(); };

function stickyNavbar() {
    const navbar = document.getElementById('navbar');
    const sticky = navbar.offsetTop;
    if (window.pageYOffset >= sticky) {
        navbar.classList.add('sticky');
    } else {
        navbar.classList.remove('sticky');
    }
}

// Stripe payment integration
const stripe = Stripe('your-public-key');
const elements = stripe.elements();
const card = elements.create('card');
card.mount('#card-element');

document.getElementById('payment-form')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: { name: 'Customer Name' },
        },
    });

    if (error) {
        console.error('Payment failed', error);
    } else {
        console.log('Payment succeeded', paymentIntent);
        window.location.href = 'confirmation.html';
    }
});

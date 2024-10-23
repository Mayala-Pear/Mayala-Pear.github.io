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

// Stripe integration
const stripe = Stripe('your-public-key');  // Replace with your actual public key
const elements = stripe.elements();
const card = elements.create('card');

// Mount the card element in the form
card.mount('#card-element');

// Handle real-time validation errors from the card Element
card.on('change', function(event) {
    const displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});

// Handle form submission
const form = document.getElementById('payment-form');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                address: {
                    line1: document.getElementById('address').value,
                    city: document.getElementById('city').value,
                    state: document.getElementById('state').value,
                    postal_code: document.getElementById('zip').value
                }
            }
        }
    });

    if (error) {
        document.getElementById('card-errors').textContent = error.message;
    } else {
        alert('Payment successful!');
        window.location.href = 'confirmation.html'; // Redirect to confirmation
    }
});

// Cart logic to display items and calculate total
document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    let total = 0;

    cartItems.forEach(item => {
        const itemElement = document.createElement('p');
        itemElement.textContent = `${item.name} - $${item.price.toFixed(2)} x ${item.quantity}`;
        cartContainer.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
});

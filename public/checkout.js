// Stripe integration
const stripe = Stripe('your-public-key');
const elements = stripe.elements();
const card = elements.create('card');
card.mount('#card-element');

const form = document.getElementById('payment-form');
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: card,
            billing_details: {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value
            }
        }
    });

    if (error) {
        document.getElementById('card-errors').textContent = error.message;
    } else {
        alert('Payment successful!');
        // Redirect to a confirmation page
        window.location.href = 'confirmation.html';
    }
});

// Cart logic to display items and calculate total
document.addEventListener('DOMContentLoaded', () => {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    let total = 0;

    cartItems.forEach(item => {
        const itemElement = document.createElement('p');
        itemElement.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
        cartContainer.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    document.getElementById('total-amount').textContent = `$${total.toFixed(2)}`;
});

// Include your Stripe public key here
const stripe = Stripe('your-public-key-here');

// Create an instance of Elements
const elements = stripe.elements();

// Custom styling for the card element
const style = {
    base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

// Create an instance of the card Element
const card = elements.create('card', {style: style});

// Add an instance of the card Element into the `card-element` div
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

    const {paymentMethod, error} = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
        billing_details: {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            address: {
                line1: document.getElementById('address').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                postal_code: document.getElementById('zip').value,
            }
        }
    });

    if (error) {
        // Show error in payment form
        document.getElementById('card-errors').textContent = error.message;
    } else {
        // Successfully created payment method
        console.log('Payment successful!', paymentMethod);
        // Process the payment here (e.g., send paymentMethod.id to your server)
    }
});

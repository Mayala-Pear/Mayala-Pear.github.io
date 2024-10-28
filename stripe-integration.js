// Initialize Stripe with your publishable key
const stripe = Stripe('pk_live_51Q04fiJSApE0H7LayEkLXFtnyR1AwbOqBHHRCuH0vzJ2aVCsNFKT6v9M4JFvigin8xr9RV9i5UmSOSsUEaWUmMEW00PiM7mtKZ');  // Replace with your Stripe Publishable Key
const elements = stripe.elements();

// Create an instance of the card Element.
const card = elements.create('card');

// Add the card Element into the `card-element` div.
card.mount('#card-element');

// Handle real-time validation errors from the card Element.
card.on('change', function(event) {
  const displayError = document.getElementById('card-errors');
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }
});

// Handle form submission.
const form = document.getElementById('payment-form');
form.addEventListener('submit', async function(event) {
  event.preventDefault();

  // Get the payment intent client secret from the server
  const { clientSecret } = await fetch('/create-payment-intent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: 1000 }) // Example amount (in cents)
  }).then(res => res.json());

  const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
      card: card,
      billing_details: {
        name: 'Customer Name'
      }
    }
  });

  if (error) {
    // Show error to your customer (e.g., insufficient funds)
    console.log(error.message);
    document.getElementById('card-errors').textContent = error.message;
  } else {
    if (paymentIntent.status === 'succeeded') {
      // Payment succeeded, redirect or show success message
      console.log('Payment successful!');
    }
  }
});

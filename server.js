const express = require('express');
const stripe = require('stripe')('sk_live_...yj3u'); // Use your actual secret key
const app = express();

app.use(express.json());

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

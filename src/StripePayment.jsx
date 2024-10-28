import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import PaymentForm from './PaymentForm';
import './StripePayment.css';

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is your test publishable API key.
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

export default function StripePayment({ customerData }) {
   const [clientSecret, setClientSecret] = useState('');

   useEffect(() => {
      // Create PaymentIntent as soon as the page loads
      // fetch('/create-payment-intent', {
      fetch('http://localhost:4242/create-payment-intent', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(customerData),
      })
         .then((res) => res.json())
         .then((data) => setClientSecret(data.clientSecret));
   }, [customerData]);

   const appearance = {
      theme: 'stripe',
   };
   const options = {
      clientSecret,
      appearance,
   };

   return (
      <div className="StripePayment" height="100%" width="100%">
         {clientSecret && (
            <Elements options={options} stripe={stripePromise}>
               <PaymentForm />
            </Elements>
         )}
      </div>
   );
}

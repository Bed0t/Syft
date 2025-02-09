import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './supabase';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const createSubscription = async (priceId: string) => {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to load');

  // Create a Checkout Session
  const {
    data: { sessionId },
  } = await supabase.functions.invoke('create-checkout-session', {
    body: { priceId },
  });

  // Redirect to Checkout
  const { error } = await stripe.redirectToCheckout({ sessionId });
  if (error) throw error;
};

export const updateSubscription = async (
  subscriptionId: string,
  action: 'cancel' | 'reactivate'
) => {
  const { data, error } = await supabase.functions.invoke('update-subscription', {
    body: { subscriptionId, action },
  });

  if (error) throw error;
  return data;
};

export const getPaymentMethods = async () => {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .order('is_default', { ascending: false });

  if (error) throw error;
  return data;
};

export const addPaymentMethod = async () => {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe failed to load');

  // Create a SetupIntent
  const {
    data: { clientSecret },
  } = await supabase.functions.invoke('create-setup-intent');

  // Show Stripe Elements
  const { setupIntent, error } = await stripe.confirmCardSetup(clientSecret, {
    payment_method: {
      card: elements.getElement('card'),
      billing_details: {
        name: 'Jenny Rosen', // Replace with actual user name
      },
    },
  });

  if (error) throw error;
  return setupIntent;
};

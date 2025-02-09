/*
  # Add Stripe Tables

  1. New Tables
    - `stripe.customers`: Table for Stripe customers
    - `stripe.subscriptions`: Table for Stripe subscriptions
    - `stripe.prices`: Table for Stripe prices
    - `stripe.products`: Table for Stripe products
    - `stripe.payment_methods`: Table for Stripe payment methods

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

-- Create stripe schema if it doesn't exist
CREATE SCHEMA IF NOT EXISTS stripe;

-- Create tables
CREATE TABLE IF NOT EXISTS stripe.customers (
  id text NOT NULL,
  email text,
  name text,
  description text,
  created timestamptz,
  metadata jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stripe.subscriptions (
  id text NOT NULL,
  customer text,
  status text,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean,
  canceled_at timestamptz,
  created timestamptz,
  metadata jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stripe.prices (
  id text NOT NULL,
  product text,
  active boolean,
  currency text,
  unit_amount bigint,
  type text,
  recurring jsonb,
  metadata jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stripe.products (
  id text NOT NULL,
  name text,
  active boolean,
  description text,
  metadata jsonb,
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS stripe.payment_methods (
  id text NOT NULL,
  customer text,
  type text,
  card jsonb,
  created timestamptz,
  metadata jsonb,
  updated_at timestamptz DEFAULT now()
);

-- Create unique constraints instead of primary keys
ALTER TABLE stripe.customers ADD CONSTRAINT customers_id_key UNIQUE (id);
ALTER TABLE stripe.subscriptions ADD CONSTRAINT subscriptions_id_key UNIQUE (id);
ALTER TABLE stripe.prices ADD CONSTRAINT prices_id_key UNIQUE (id);
ALTER TABLE stripe.products ADD CONSTRAINT products_id_key UNIQUE (id);
ALTER TABLE stripe.payment_methods ADD CONSTRAINT payment_methods_id_key UNIQUE (id);

-- Enable RLS
ALTER TABLE stripe.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe.prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stripe.payment_methods ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own customer data"
  ON stripe.customers
  FOR SELECT
  TO authenticated
  USING (email = auth.email());

CREATE POLICY "Users can view own subscriptions"
  ON stripe.subscriptions
  FOR SELECT
  TO authenticated
  USING (customer IN (
    SELECT id FROM stripe.customers WHERE email = auth.email()
  ));

CREATE POLICY "Users can view active prices"
  ON stripe.prices
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Users can view active products"
  ON stripe.products
  FOR SELECT
  TO authenticated
  USING (active = true);

CREATE POLICY "Users can view own payment methods"
  ON stripe.payment_methods
  FOR SELECT
  TO authenticated
  USING (customer IN (
    SELECT id FROM stripe.customers WHERE email = auth.email()
  ));
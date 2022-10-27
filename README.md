# cryptlex-stripe-integration

## Deployment

- Import the repository in Vercel project
- It will build and deploy the repo
- Add `CRYPTLEX_ACCESS_TOKEN` and `PRODUCT_ID` env variables to the Vercel project

## Configuring webhooks in Stripe:

Stripe Webhook Event: `customer.created`:

https://YOUR_VERCEL_URL/api/create-license

Stripe Webhook Event: `invoice.payment_succeeded`:

https://YOUR_VERCEL_URL/api/renew-license

Stripe Webhook Event: `customer.subscription.updated`:

https://YOUR_VERCEL_URL/api/delete-license

# Lemon Squeezy Integration Setup Guide

Your app has been successfully migrated from Stripe to Lemon Squeezy! Here's how to complete the setup:

## 🍋 Getting Lemon Squeezy Credentials

### 1. Create a Lemon Squeezy Account
- Go to [https://lemonsqueezy.com](https://lemonsqueezy.com)
- Sign up for a free account
- Complete the onboarding process

### 2. Create Your Store
- In your Lemon Squeezy dashboard, create a new store
- Configure your store details (name, currency, etc.)
- Note down your **Store ID** (you'll find this in the store settings)

### 3. Create a Product
- Go to Products > Add Product
- Create a "Digital Product" or "Service"
- Set the name: "Domain Nest Lifetime Access"
- Set the price: $29 (one-time payment)
- Make sure it's set as a **one-time purchase** (not subscription)
- Save the product and note down the **Variant ID**

### 4. Get Your API Key
- Go to Settings > API
- Create a new API key with these permissions:
  - `checkouts:write`
  - `orders:read`
  - `subscriptions:read`
  - `products:read`
- Copy the API key

### 5. Set Up Webhooks
- Go to Settings > Webhooks
- Create a new webhook endpoint: `https://yourdomain.com/api/webhooks/lemonsqueezy`
- Select these events:
  - `order_created`
  - `subscription_created`
  - `subscription_updated`
  - `subscription_cancelled`
- Copy the webhook secret

## 🔧 Environment Variables

Update your `.env.local` file with these values:

```env
# Lemon Squeezy Configuration
LEMONSQUEEZY_API_KEY=your_api_key_here
LEMONSQUEEZY_WEBHOOK_SECRET=your_webhook_secret_here
NEXT_PUBLIC_LEMONSQUEEZY_STORE_ID=your_store_id_here
NEXT_PUBLIC_LEMONSQUEEZY_VARIANT_ID=your_variant_id_here
```

## 🧪 Testing

### Development Mode
The app includes a development mode that works without real Lemon Squeezy credentials:
- When `LEMONSQUEEZY_API_KEY` is not set or equals "your_api_key_here"
- Payment will be simulated and user will get immediate access
- Perfect for development and testing

### Production Mode
Once you add real Lemon Squeezy credentials:
- Real payment processing will be enabled
- Webhooks will handle payment completion
- Users will be redirected to Lemon Squeezy checkout

## 🚀 Features Included

✅ **Complete Stripe Migration**: All Stripe code removed and replaced with Lemon Squeezy
✅ **Database Migration**: New Lemon Squeezy fields added to user table
✅ **Lifetime Access**: $29 one-time payment for unlimited access
✅ **Dashboard Protection**: Only paid users can access dashboard features
✅ **Development Mode**: Test payments without real credentials
✅ **Webhook Handling**: Automatic user access granting on payment
✅ **Error Handling**: Comprehensive error handling and logging

## 📊 Database Schema

The following fields have been added to the `User` table:
- `lemonSqueezyCustomerId`: Customer ID from Lemon Squeezy
- `lemonSqueezySubscriptionId`: Subscription/Order ID
- `lemonSqueezyVariantId`: Product variant ID for access control
- `lemonSqueezyCurrentPeriodEnd`: Access expiration (for future subscriptions)

## 🔄 Migration Status

- ✅ Removed all Stripe dependencies
- ✅ Installed Lemon Squeezy SDK
- ✅ Created new API endpoints
- ✅ Updated database schema
- ✅ Migrated subscription logic
- ✅ Updated environment configuration
- ✅ Added development fallback mode

## 🎯 Next Steps

1. **Get Lemon Squeezy credentials** using the guide above
2. **Update environment variables** in your `.env.local`
3. **Test the payment flow** on `/payment`
4. **Deploy to production** with real credentials
5. **Set up webhook endpoint** for production

## 💡 Notes

- **Development**: Payments are simulated for easy testing
- **Production**: Real Lemon Squeezy integration with $29 lifetime access
- **Security**: All credentials are server-side only
- **Backwards Compatible**: Legacy Stripe users (if any) maintain access

The integration is complete and ready to use! 🎉

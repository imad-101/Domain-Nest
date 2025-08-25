# Production Deployment Checklist for DomNest.app

## Environment Variables
- [ ] NEXTAUTH_URL=https://domnest.app
- [ ] NEXT_PUBLIC_APP_URL=https://domnest.app
- [ ] AUTH_SECRET (generate new one for production)
- [ ] GOOGLE_CLIENT_ID (production OAuth credentials)
- [ ] GOOGLE_CLIENT_SECRET (production OAuth credentials)
- [ ] DATABASE_URL (production database)
- [ ] RESEND_API_KEY (production email service)
- [ ] EMAIL_FROM=noreply@domnest.app

## Google Console Setup
- [ ] Create production OAuth 2.0 Client ID
- [ ] Add https://domnest.app to Authorized JavaScript origins
- [ ] Add https://domnest.app/api/auth/callback/google to Authorized redirect URIs
- [ ] Copy Client ID and Secret to production environment

## Domain & SSL
- [ ] Configure DNS records for domnest.app
- [ ] Ensure SSL certificate is properly configured
- [ ] Test HTTPS redirects

## Database
- [ ] Set up production database
- [ ] Run database migrations
- [ ] Configure database connection pooling if needed

## Email Configuration
- [ ] Configure Resend with production API key
- [ ] Update EMAIL_FROM to use @domnest.app domain
- [ ] Test email delivery in production

## Testing
- [ ] Test Google OAuth login flow
- [ ] Test email magic link authentication
- [ ] Verify all redirects work correctly
- [ ] Test payment flow with Lemon Squeezy

## Security
- [ ] Generate new AUTH_SECRET for production
- [ ] Review CORS settings
- [ ] Ensure all sensitive environment variables are properly secured

## Monitoring
- [ ] Set up error monitoring (Sentry, LogRocket, etc.)
- [ ] Configure analytics if needed
- [ ] Set up uptime monitoring

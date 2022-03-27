# NEST MONGOOSE API TEMPLATE

## CONFIGURED WITH:
- Email Sender with nodemailer
- Email Verification
- Role based authentication
- Secure user and admin routes 
- Jwt authentication with refresh token
- Logging interceptor

## SETUP
  Create a .env file with the following environment variables:
  - dbUrl: Mongo db database url
  - jwtSecret: secret key for jwt
  - refreshTokenSecret: secret key for refresh token
  - apiEmail: email address for email sender configuration
  - apiEmailPassword: email password
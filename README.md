# NEST MONGOOSE API TEMPLATE
  This Template uses MongoDB database with mongoose ORM via [@nestjs/mongoose](https://github.com/nestjs/mongoose "@nestjs/mongoose")

## CONFIGURED WITH:
- Email Sender with nodemailer
- Email Verification
- Role based authentication
- Secure user and admin routes 
- Jwt authentication with refresh token
- Logging Middleware

## SETUP
  After running npm install, create a .env file in the root folder with the following environment variables:
  - dbUrl: Mongo db database url
  - jwtSecret: secret key for jwt
  - refreshTokenSecret: secret key for refresh token
  - apiEmail: email address for email sender configuration
  - apiEmailPassword: email password

### Swagger Documentation
  Swagger documentation can be found at {{baseUrl}}/swagger-ui
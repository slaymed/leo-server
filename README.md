# **npm install**

## **install postgres database in your device**

## Create .env File & copy past the following

## **PORT=**

application port

## **NODE_ENV=**

production or development

## **APP_URL=**

you server url

## **DEV_ORIGIN=**

your front end develoment url

## **ORIGIN=**

live front end url or domain

## **GC_ACCESS_TOKEN=**

access token to access go card less service

## **DIGITAL_WHOLESALE_SOLUTION_URL=**

Digital Wholesale Solution Url For Service to grab addresses and check broadband availability

## **DIGITAL_WHOLESALE_SOLUTION_USERNAME=**

Digital Wholesale Solution username

## **DIGITAL_WHOLESALE_SOLUTION_PASSWORD=**

Digital Wholesale Solution password

## **JWT_SECRET=**

some secret string for json web token

## **MAILER_USER=**

email for mail service

## **MAILER_PASS=**

email password for email service

## **DB_DIALECT=**

database type like postgres mysql sqlite

## **DB_PORT=**

database port

## **DB_HOST=**

database host you can write database url or just localhost if its locally

## **DB_USERNAME=**

database username

## **DB_PASSWORD=**

database password

## **DB_DATABASE=**

create database and put name of database here

## You have the tables migrations already created in the project migrations folder

### if you created any new table with type orm run the following

# **npm run migration:generate** [the name of migration will be here without the brackets and press enter]

## if you in production and you want to run the migration for generating the tables in database run

# **npm run migration:run**

## to run development server run

# **npm run dev**

# To generate the **JS Bundle** run

# **npm run build**

## to run production build server run

# **npm run start**

## Check routes folder to see server end pointes

# **_Happy Hacking_**

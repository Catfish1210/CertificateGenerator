# 📄 CertificateGenerator
#### *PDF Certificate Generator web app using the **[PDF Generator API](https://pdfgeneratorapi.com)** Service.*

## Project Description
Web app which enables the user to enter data to generate a certificate using a template, and download the document as a PDF.

## Setup & Running the Project
### 1. Navigate to the project root directory
```bash
cd CertificateGenerator/
```
---
### 2. Install the required dependencies
```bash
npm install
```
---
### 3. Environment Configuration
To get started, you need to set up the environment variables required by the application. Follow these steps:

##### 3.1) Navigate to the backend directory:
```bash
cd backend/
```
##### 3.2) Create a copy of the `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```
##### 3.3) Open the newly created `.env` file and configure the necessary API keys according to your environment
---
### 4. Running the project
##### 4.1) Navigate back to the project root directory:
```bash
cd ..
```
##### 4.2) Run the project:
```bash
npm run start
```
##### 4.3) Navigate to the app via browser:
``http://localhost:3030/``

---
### Other ways to run the project
>---
> ### Backend
>>```bash
>> npm run backend
>>```
>- *Runs only the backend*
>---

>---
> ### Frontend
>
>>```bash
>> npm run frontend
>>```
>- *Runs only the frontend*
>---

>---
> ### Concurrently
>
>>```bash
>> npm run start
>>```
>- *Runs the backend & frontend concurrently*
>---

>---
> ### Running Tests
>
>>```bash
>> npm run backend-test
>>```
>- *Runs the backend tests with Jest*
>---


## Technologies used
- [**Node.js** *22.13.1*](https://nodejs.org/en/download)
- [**Express.js** *4.21.2*](https://expressjs.com)
- [**nodemon** *3.1.9*](https://www.npmjs.com/package/nodemon)
- [**dotenv** *16.4.7*](https://www.npmjs.com/package/dotenv)
- [**jsonwebtoken** *9.0.2*](https://www.npmjs.com/package/jsonwebtoken)
- [**svelte** *5.19.6*](https://svelte.dev/)
- [**vite** *6.1.0*](https://vite.dev/)
- [**concurrently** *9.1.2*](https://www.npmjs.com/package/concurrently)
- [**better-sqlite3** *11.8.1*](https://www.npmjs.com/package/better-sqlite3)
- [**jest** *29.7.0*](https://www.npmjs.com/package/jest)

## Directory Structure

## Credits
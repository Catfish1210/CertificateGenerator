# Certificate Generator
#### *PDF Certificate Generator web app using the **[PDF Generator API](https://pdfgeneratorapi.com)** Service.*

## Project Description
A web app which enables the user to enter data to generate a certificate using a template, and download the document as a PDF.

## Setup & Running the Project
### 1. Clone the repository
```bash
git clone https://github.com/Catfish1210/CertificateGenerator.git
```
### 2. Navigate to the project root directory
```bash
cd CertificateGenerator/
```

>If you prefer to use Docker, refer to the section on [**Running the Project with Docker**](#running-the-project-with-docker) instead.
---
### 3. Install the required dependencies
```bash
npm install
```
---
### 4. Environment Configuration
To get started, you need to set up the environment variables required by the application. Follow these steps:

##### 4.1) Navigate to the backend directory:
```bash
cd backend/
```
##### 4.2) Create a copy of the `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```
##### 4.3) Open the newly created `.env` file and configure the necessary API keys according to your environment
---
### 5. Running the project
##### 5.1) Navigate back to the project root directory:
```bash
cd ..
```
##### 5.2) Run the project:
```bash
npm run start
```
##### 5.3) Access the application via browser:
[**Certificate Generator App**](http://localhost:8001)

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

### Running the Project with Docker
This project is Dockerized to simplify the development process. **Make sure to complete the [Environment Configuration](#4-environment-configuration) steps before proceeding.**
### 1. Prerequisites
Make sure you have Docker and Docker Compose installed on your system:
- [**Docker**](https://www.docker.com/get-started)
- [**Docker Compose**](https://docs.docker.com/compose)
---
### 2. Build and Run the Container
From the project root directory, execute the following command:
```bash
# Build the Docker image and start the container
docker-compose up --build
```
To stop and remove the container, use:
```bash
# Shutdown the application and clean up the container
docker-compose down
```
### 3. Access the application via browser:
[**Certificate Generator App**](http://localhost:8001)

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
---
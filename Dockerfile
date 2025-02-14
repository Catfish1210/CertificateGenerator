FROM node:22

WORKDIR /CertificateGenerator

COPY package.json package-lock.json ./
COPY backend ./backend
COPY frontend ./frontend

ENV FORCE_COLOR=1

RUN npm install --prefix backend
RUN npm install --prefix frontend
RUN npm install

EXPOSE 8000 8001
CMD ["npm", "run", "start"]
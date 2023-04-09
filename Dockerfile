FROM node:19

WORKDIR /usr/app/server 

COPY package*.json ./

RUN npm install 

COPY . .

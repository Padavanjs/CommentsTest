FROM node:19 
RUN mkdir /usr/app/server 
WORKDIR /usr/app/server 
COPY package*.json .
RUN npm install 
COPY . .
CMD ["npm", "start"]

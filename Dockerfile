FROM node:alpine
WORKDIR /app
COPY /package*.json ./
COPY tsconfig.json ./
RUN npm install
COPY . ./
RUN npm run build
EXPOSE 7080
CMD [ "node", "./build/index.js" ]
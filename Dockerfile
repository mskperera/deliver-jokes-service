FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 3333

CMD ["npm", "run", "start:prod"]


# commands

# if (not working):  docker build -t deliver-jokes-microservice . 
# use this(special for nestJs): docker buildx build --platform linux/amd64 -t deliver-jokes-microservice .

# docker run -d --env-file .env -p 3333:3333 deliver-jokes-microservice

# docker ps -a
# Stop the Running Containers: docker stop deabf4792901
# Remove the Stopped Container: docker rm deabf4792901
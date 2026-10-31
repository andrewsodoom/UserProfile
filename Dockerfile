FROM node:26-alpine3.23

ENV MONGO_DB_USERNAME=admin\
    MONGO_DB_PWD=password

RUN mkdir -p /home/UserProfile

COPY . /home/UserProfile

CMD ["node", "server.js"]
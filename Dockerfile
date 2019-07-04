FROM node:10.16-alpine

RUN mkdir /app
WORKDIR /app
ENV NODE_ENV development

COPY . /app

RUN yarn

CMD [ "npm", "start"]

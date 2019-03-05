FROM node:alpine

RUN apk add --update bash && rm -rf /var/cache/apk/*
RUN mkdir /api
RUN chmod 775 -R /api
COPY . /api/

WORKDIR /api
RUN npm install

EXPOSE 23335
EXPOSE 23336

CMD npm run prod
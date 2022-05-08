FROM node:14 as buildstage

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM nginx:alpine

ARG APP_BASENAME_PATH

COPY --from=buildstage /app/build /usr/share/nginx/html${APP_BASENAME_PATH}

RUN ls /usr/share/nginx/html${APP_BASENAME_PATH}

COPY ./nginx /etc/nginx/

RUN sed -i 's/APP_BASENAME_PATH/tws/' /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]


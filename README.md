# Talk with strangers

Realtime Chat Application - Socket.io, Node.js, and React.js

# Setup your repository

## Server

1. Clone source code

```shell
git clone https://github.com/huunghiaish/talk-with-strangers.git
```

2. Install package

```shell
cd server
npm install
```
3. Start code

```shell
npm start
```
#### Building and running in Docker
```shell
docker build -t  .
docker run -p 3000:3000 talk-with-strangers-server
```
#### Building and publish image to private Docker Registry
```shell
docker build . -t registry.huunghianguyen.com/talk-with-strangers-server:1.0.0
docker push registry.huunghianguyen.com/talk-with-strangers-server:1.0.0
```

## Client

1. Clone source code

```shell
git clone https://github.com/huunghiaish/talk-with-strangers.git
```

2. Install package

```shell
cd client
npm install
```
3. Start code

```shell
npm start
```
#### Building and running in Docker
```shell
docker build -t  .
docker run -p 80:80 talk-with-strangers-client
```
#### Building and publish image to private Docker Registry
```shell
docker build . -t registry.huunghianguyen.com/talk-with-strangers-client:1.0.0
docker push registry.huunghianguyen.com/talk-with-strangers-client:1.0.0
```

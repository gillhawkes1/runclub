# syntax=docker/dockerfile:1
FROM node:latest
WORKDIR /
COPY . .
RUN yarn install --production
#CMD ["node", "deploy-commands.js" && "node", "index.js"]
CMD ["node", "index.js"]
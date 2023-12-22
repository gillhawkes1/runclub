# use node v16
FROM node:16

# set working dir
WORKDIR /Gill/workspace/runclub

# copy package.json and package-lock.json to working dir
COPY package*.json ./

# install node deps
RUN npm install

# Bundle app source
COPY . .

# port
EXPOSE 32773

# run heife
CMD ["node", "index.js"]

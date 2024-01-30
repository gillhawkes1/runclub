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

# health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:32773/ || exit 1

# run heife
CMD ["node", "index.js"]


#create new img:
#docker build -t heife-img:<version number> .
#restart policy:
#docker update --restart=unless-stopped <container-name>

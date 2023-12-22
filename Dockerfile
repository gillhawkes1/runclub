# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /Gill/workspace/runclub

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Expose the port the app runs on
EXPOSE 32773

# Command to run your application
CMD ["node", "index.js"]

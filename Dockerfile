# Use Node v16
FROM node:16

# Set working directory inside the container
WORKDIR /opt/discord-bots/heife/runclub

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Copy entrypoint script and make it executable
COPY entrypoint.sh /opt/discord-bots/heife/runclub/entrypoint.sh
RUN chmod +x /opt/discord-bots/heife/runclub/entrypoint.sh

# Use custom entrypoint instead of CMD
ENTRYPOINT ["/opt/discord-bots/heife/runclub/entrypoint.sh"]

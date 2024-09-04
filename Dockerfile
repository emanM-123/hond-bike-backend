# Use the official Node.js image from the Docker Hub
FROM node:14-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

# Bundle app source
COPY . .

# Expose the port your app runs on (usually 3000)
EXPOSE 3000

# Command to run your app using node
CMD ["node", "index.js"]

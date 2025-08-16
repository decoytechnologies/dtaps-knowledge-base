# Use an official Node.js runtime as a parent image
FROM node:20-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy app source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Bundle your app's source code
EXPOSE 8080
CMD [ "node", "dist/index.js" ]

# Use an official Node.js runtime as the base image
FROM node:14

# Create and set the working directory
WORKDIR /usr/src/app

# Install app dependencies (you may need to modify the package.json filename)
COPY package.json .
COPY package-lock.json .

# Install any global dependencies if required (e.g., gulp, grunt)
# RUN npm install -g gulp

# Install application dependencies
RUN npm install

# Bundle the app source code
COPY . .

# Expose a port (if your app is listening on a specific port)
EXPOSE 3000

# Define the command to run your app
CMD ["node", "app.js"]

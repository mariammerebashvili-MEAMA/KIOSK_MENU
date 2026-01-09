

# Stage 1: Build the React application
FROM node:22 AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker's caching
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Run the production build command
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the production build from the 'builder' stage to the Nginx serving directory
COPY --from=builder /app/build /usr/share/nginx/html

# Expose port 80 for web traffic
EXPOSE 80

# Start Nginx and serve the app
CMD ["nginx", "-g", "daemon off;"]
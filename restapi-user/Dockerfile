FROM node:12

# Set the Working Directory
WORKDIR /usr/src/app

# Copy the package files 
COPY package*.json ./

# Install packages from packages.json
RUN npm ci 

# Copy everything over
COPY . .

# Expose port 8080
EXPOSE 8080

# Execute the server
CMD [ "npm", "run", "prod" ]

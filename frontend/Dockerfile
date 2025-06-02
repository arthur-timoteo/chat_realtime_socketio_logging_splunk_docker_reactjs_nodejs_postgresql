# Use a imagem base do Node.js
FROM node:20 AS BUILD_IMAGE

# Diretório de trabalho dentro do contêiner
WORKDIR /app/react-app

# Copie o package.json
COPY package.json .

# Instale as dependências
RUN npm install

# Copie o restante da aplicação
COPY . .

# Build our project
RUN npm run build

#beginning of second stage
FROM node:20 AS PRODUCTION_IMAGE
WORKDIR /app/react-app

# Copyng /app/react-app/dist/ folder from BUILD_IMAGE to 
# /app/react-app/dist/ in this stage
COPY --from=BUILD_IMAGE /app/react-app/dist/ /app/react-app/dist/

EXPOSE 3002

COPY package.json .
COPY vite.config.ts .

# Install typescript because this project is based on typescript
RUN npm install typescript

EXPOSE 3002

CMD ["npm", "run", "preview"]
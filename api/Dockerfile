# Use a imagem base do Node.js
FROM node:20

# Diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copie o package.json e package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante da aplicação
COPY . .

# Exponha a porta da aplicação
EXPOSE 3001

# Comando para rodar a aplicação
CMD ["npm", "start"]
# Base
FROM node:22-slim AS base

WORKDIR /app

COPY package*.json ./

# Development
FROM base AS development

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm", "run", "start:dev" ]

# Production
FROM base AS production

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["node", "./dist/main"]
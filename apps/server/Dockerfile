FROM node:20-bookworm-slim
WORKDIR /app

# Copy deps
COPY package.json package-lock.json ./

RUN npm ci 

# Now copy the full repo
COPY . .

# Get ffmpeg for HEIC -> JPEG conversion
RUN apt-get update -y && apt-get install -y ffmpeg

WORKDIR /app/apps/server

ENV PRISMA_CLIENT_ENGINE_TYPE=binary
RUN apt-get update -y && apt-get install -y openssl
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

EXPOSE 3000
CMD ["node", "dist/index.js"]


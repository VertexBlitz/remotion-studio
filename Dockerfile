FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends chromium ffmpeg fonts-liberation fonts-noto-color-emoji && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
ENV NODE_ENV=production
EXPOSE 3000
CMD ["npm", "run", "start"]
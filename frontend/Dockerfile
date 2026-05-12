#####################BUILDER#############
FROM node:22-alpine AS builder

WORKDIR /app

ARG VITE_API_URL
ARG VITE_CDN_URL

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CDN_URL=$VITE_CDN_URL

COPY package*.json ./
RUN npm ci
COPY . .

RUN npm run build

RUN rm -rf ./src
#################RUNTIME#################
FROM node:22-alpine AS runtime

WORKDIR /app

COPY --from=builder /app/dist ./dist

CMD ["sh", "-c", "rm -rf /app-dist/* && cp -r /app/dist/. /app-dist && tail -f /dev/null"]



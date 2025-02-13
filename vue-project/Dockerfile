# 1. 使用 Node.js 來建構前端
FROM node:18 AS build
WORKDIR /app                   # Docker 會在該暫時性 Build 容器內創建 /app 目錄，往後指令都在此目錄執行
COPY package.json package-lock.json ./      
RUN npm install
COPY . .             # 將Jenkins 內的 ./frontend/vue-project 目錄複製到 /app
RUN npm run build

# 2. 使用 Nginx 作為前端伺服器
FROM nginx:latest
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

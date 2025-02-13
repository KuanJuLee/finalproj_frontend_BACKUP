# 使用 Nginx 作為前端伺服器
FROM nginx:alpine AS production-stage

# 設定工作目錄
WORKDIR /usr/share/nginx/html

# 複製已經打包好的 `dist/` 到 Nginx
COPY vue-project/dist/ .

# 複製 Nginx 設定檔（如果有特殊需求）
# COPY nginx.conf /etc/nginx/nginx.conf

# 開放 80 埠供外部存取
EXPOSE 80

# 啟動 Nginx
CMD ["nginx", "-g", "daemon off;"]

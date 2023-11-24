# Install

cd /home/paradigma/api/
sudo npm run build
sudo pm2 delete api
sudo API_CONFIG=/home/paradigma/api/config-api.json pm2 start node lib/index.js --name "api"
sudo pm2 save
sudo systemctl restart nginx

---------------------------------------------------
Más Detalles ver README.md de app-paradigma-website
---------------------------------------------------

OJO:
Edit /etc/nginx/nginx.conf and add the following line inside http block:
client_max_body_size 50M;
Then restart Nginx with sudo service nginx restart

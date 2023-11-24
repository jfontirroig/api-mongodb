# API-MONGODB SERVICE WITH NODEJS, EXPRESSJS AND MONGOBD 

## Instalar PM2

```
sudo apt-get update
sudo npm install -g pm2
```

```
sudo pm2 list
sudo pm2 stop app_name_or_id    (según name de sudo pm2 list)
sudo pm2 start app_name_or_id   (según name de sudo pm2 list)
sudo pm2 monit
```

## Instalar Let's Encrypt

```
sudo apt-get update
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d anydomain
```

### Renovación

```
sudo systemctl stop nginx
sudo certbot renew --force-renew
```

## Instalar Nginx

```
sudo apt-get update
sudo apt-get install nginx
sudo ufw allow 'Nginx Full'
```

### sudo nano /etc/nginx/sites-available/default
(Default server configuration)

```
server {
	root /var/www/html;
	index index.html index.htm index.nginx-debian.html;
	server_name anydomain; # managed by Certbot
	
	location /mongodb {
	      proxy_pass https://anydomain:3070;
	      proxy_http_version 1.1;
	      proxy_set_header Upgrade $http_upgrade;
	      proxy_set_header Connection 'upgrade';
	      proxy_set_header Host $host;
	      proxy_cache_bypass $http_upgrade;
	}
	
	listen [::]:443 ssl ipv6only=on; # managed by Certbot
	listen 443 ssl; # managed by Certbot
	ssl_certificate /etc/letsencrypt/live/anydomain/fullchain.pem; # managed by Certbot
	ssl_certificate_key /etc/letsencrypt/live/anydomain/privkey.pem; # managed by Certbot
	include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
	ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}
```

```
server {
       if ($host = anydomain) {
          return 301 https://$host$request_uri;
       } # managed by Certbot

       listen 80 ;
       listen [::]:80 ;
       server_name anydomain;
       return 404; # managed by Certbot
}
```

```
sudo systemctl restart nginx
sudo systemctl reload nginx
sudo systemctl stop nginx
sudo systemctl start nginx
```

## Instalar MONGODB
Instalación en Ubuntu 22.04

```
wget https://repo.mongodb.org/apt/ubuntu/dists/jammy/mongodb-org/6.0/multiverse/binary-amd64/mongodb-org-server_6.0.5_amd64.deb
dpkg -i mongodb-org-server_6.0.5_amd64.deb
systemctl start mongodb.service
systemctl enable mongodb.service
```

## INSTALAR APP

```
cd /home/api-mongodb/
sudo npm run build
sudo pm2 delete api-mongodb
sudo API_CONFIG=/home/api-mongodb/config-api.json pm2 start node lib/index.js --name "api-mongodb"
sudo pm2 save
sudo systemctl restart nginx
```

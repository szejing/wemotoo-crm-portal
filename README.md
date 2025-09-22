# Wemotoo CRM

# download wemotoo-common

run npm link /Users/szejinggo/Documents/Projects/wemotoo-common

docker build -t registry.digitalocean.com/wemotoo/crm-portal:latest .

docker pull registry.digitalocean.com/wemotoo/crm-portal:latest

docker compose down
docker compose up -d

docker rmi

docker-compose up --build wemotoo-crm
docker-compose build --no-cache frontend

docker run -d -p 3000:3000 --name wemotoo-crm registry.digitalocean.com/wemotoo/crm-portal:latest

docker run -d -p 3000:3000 --name wemotoo-crm registry.digitalocean.com/wemotoo/frontend:1.0.0

docker push registry.digitalocean.com/wemotoo/frontend:1.0.0
docker pull registry.digitalocean.com/wemotoo/frontend:1.0.0

server {
listen 443 ssl;
server_name wemotoocrm.com www.wemotoocrm.com;

    ssl_certificate /etc/letsencrypt/live/wemotoocrm.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/wemotoocrm.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # ----------------------
    # Nuxt static assets
    # ----------------------
    location ^~ /_nuxt/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ----------------------
    # Nuxt internal API (icons, etc.)
    # ----------------------
    location ^~ /api/_nuxt_icon/ {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ----------------------
    # NestJS backend API
    # ----------------------
    location /api/ {
        proxy_pass http://127.0.0.1:8888;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_redirect off;
    }

    # ----------------------
    # Nuxt frontend (all other routes)
    # ----------------------
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

}

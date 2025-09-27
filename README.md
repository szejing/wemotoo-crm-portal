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

docker run -d -p 3000:3000 --name wemotoo-crm registry.digitalocean.com/wemotoo/frontend:1.0.0

docker push registry.digitalocean.com/wemotoo/frontend:1.0.0
docker pull registry.digitalocean.com/wemotoo/frontend:1.0.0

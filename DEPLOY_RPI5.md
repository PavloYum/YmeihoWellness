# Production deploy on Raspberry Pi 5 via Cloudflare Tunnel

## Stack
- Raspberry Pi OS 64-bit (Bookworm)
- Docker Compose
- `cloudflared` tunnel container
- Internal Caddy reverse proxy on HTTP only
- Static frontend behind Caddy
- Spring Boot backend behind Caddy on `/api/*`

## Prerequisites
- Domain is managed in Cloudflare DNS
- Tunnel created in Cloudflare Dashboard
- Tunnel setup type: `Docker`
- Tunnel token copied from Cloudflare
- No inbound `80/443` opening is required on the home router

## Cloudflare setup
Create a remotely-managed tunnel and add two public hostnames:
- `yumeihowellness.com` -> service `http://caddy:80`
- `www.yumeihowellness.com` -> service `http://caddy:80`

Important:
- Use `http://caddy:80`, not `http://localhost:80`
- `localhost` inside `cloudflared` is the tunnel container itself
- Cloudflare handles public TLS, so Caddy stays internal HTTP-only

## Install Docker
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker "$USER"
newgrp docker
docker --version
docker compose version
```

## Configure env
```bash
cp .env.pi.example .env.pi
```

Fill in real values in `.env.pi`:
- `SPRING_MAIL_USERNAME`
- `SPRING_MAIL_PASSWORD`
- `APP_NOTIFICATION_EMAIL`
- `CLOUDFLARE_TUNNEL_TOKEN`

## Start
```bash
docker compose -f docker-compose.pi.yml --env-file .env.pi up -d --build
```

## Verify
```bash
docker compose -f docker-compose.pi.yml ps
docker compose -f docker-compose.pi.yml logs cloudflared --tail 100
docker compose -f docker-compose.pi.yml logs caddy --tail 100
docker compose -f docker-compose.pi.yml logs backend --tail 100
docker compose -f docker-compose.pi.yml exec backend wget -q -O - http://127.0.0.1:8080/actuator/health/readiness
curl -I https://yumeihowellness.com
curl -I https://www.yumeihowellness.com
```

## Update
```bash
docker compose -f docker-compose.pi.yml --env-file .env.pi up -d --build --remove-orphans
```

## Safe restart
```bash
docker compose -f docker-compose.pi.yml restart
```

## Windows one-shot deploy
```powershell
Copy-Item .env.pi.example .env.pi
# edit .env.pi
.\deploy\one-shot-deploy.ps1 -Host pi-host-or-dns -User pi
```

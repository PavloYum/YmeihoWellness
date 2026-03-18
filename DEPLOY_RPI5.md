# Production deploy on Raspberry Pi 5

## Stack
- Raspberry Pi OS 64-bit (Bookworm)
- Docker Compose
- Caddy on `80/443`
- Static frontend behind Caddy
- Spring Boot backend behind Caddy on `/api/*`
- IPv6-first public reachability

## DNS
- Create `AAAA` for `yumeihowellness.com` -> your Pi or router public IPv6
- Create `AAAA` for `www.yumeihowellness.com` -> same IPv6
- Create `A` records only if you also have a working public IPv4 path
- If your registrar supports proxied DNS, disable proxying during first certificate issuance

## Router and firewall
- Allow inbound TCP `80` and `443` for IPv6 to the Raspberry Pi
- If your router has IPv6 firewall rules, create explicit allow rules for the Pi
- If `ufw` is enabled on the Pi:
  - `sudo ufw allow 80/tcp`
  - `sudo ufw allow 443/tcp`
  - `sudo ufw status`

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
- `LETSENCRYPT_EMAIL`
- `SPRING_MAIL_USERNAME`
- `SPRING_MAIL_PASSWORD`
- `APP_NOTIFICATION_EMAIL`

## Start
```bash
docker compose -f docker-compose.pi.yml --env-file .env.pi up -d --build
```

## Verify
```bash
docker compose -f docker-compose.pi.yml ps
docker compose -f docker-compose.pi.yml logs caddy --tail 100
docker compose -f docker-compose.pi.yml logs backend --tail 100
curl -I http://localhost
curl -I https://localhost --insecure
docker compose -f docker-compose.pi.yml exec backend wget -q -O - http://127.0.0.1:8080/actuator/health/readiness
```

## External IPv6 checks
```bash
dig +short AAAA yumeihowellness.com
dig +short AAAA www.yumeihowellness.com
curl -6 -I http://yumeihowellness.com
curl -6 -I https://yumeihowellness.com
curl -6 -I https://www.yumeihowellness.com
```

## Update
```bash
docker compose -f docker-compose.pi.yml --env-file .env.pi up -d --build
```

## Safe restart
```bash
docker compose -f docker-compose.pi.yml restart
```

## Windows one-shot deploy
```powershell
Copy-Item .env.pi.example .env.pi
# edit .env.pi
.\deploy\one-shot-deploy.ps1 -Host yumeihowellness.com -User pi
```

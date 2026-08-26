# Pendientes — Integración a GitHub

## Rama `deploy` (no mergeda aún)

### Commits listos para push
```
33b5413 build(deploy): reescribir compose para integrar con proxy-network compartido
315715d feat(nginx): agregar proxy reverso /api al backend en nginx.conf
e790171 chore(deploy): delegar backup-db.sh al script unificado
```

### Pendiente antes de merge
- [ ] Probar `docker compose up -d --build` en el servidor
- [ ] Verificar que el frontend responda por `portfolio.edumathsv.work`
- [ ] Verificar que `/api/projects` retorne JSON
- [ ] Agregar hostname `portfolio.edumathsv.work` → `http://localhost:80` en Zero Trust Dashboard
- [ ] Configurar cron de backups: `0 3 * * * /home/homelab/pruebas/scripts/backup-all.sh >> /backups/backup.log 2>&1`

### Pendiente después de merge
- [ ] Merge `deploy` → `develop`
- [ ] Merge `develop` → `main`
- [ ] Push a origin: `git push origin main develop deploy`

## Archivos en el servidor (fuera de git)
- [ ] `/home/homelab/pruebas/scripts/backup-all.sh` — creado, pendiente cron
- [ ] `/home/homelab/pruebas/guia-despliegue.md` — creado
- [ ] `deploy/.env` — crear en servidor con valores reales (no se commitea)

---
name: safe-gitflow
description: Usar cuando la tarea implique rama, commit, push o pull request.
---

# Git seguro

## Reglas

- Revisa `git status --short` antes de tocar ramas o stage.
- No sobrescribas cambios ajenos.
- Usa ramas de trabajo con nombres en inglés.
- Añade al stage solo rutas explícitas.
- No uses `git add .`, `git add -A`, merge, rebase, force push, stash, `reset --hard` ni limpieza destructiva sin permiso.
- Push o PR solo por petición explícita.

## Validación antes de commit

- `git diff --stat`
- `git diff --name-only`
- Checks proporcionales al cambio
- `git diff --check`

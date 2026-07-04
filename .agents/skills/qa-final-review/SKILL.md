---
name: qa-final-review
description: Usar para una revisión final enfocada antes de cerrar cambios de código, contenido o configuración.
---

# Revisión final

## Procedimiento

1. Revisa `git diff --stat` y `git diff --name-only`.
2. Lee solo los archivos modificados relevantes.
3. Comprueba que el cambio satisface la petición sin ampliar alcance.
4. Verifica checks reales y reporta cualquier check no ejecutado.
5. Para cambios de curso, confirma que `public/content/course-full.md` está alineado.
6. Para cambios de privacidad/despliegue, confirma `noindex, nofollow` y cabeceras relevantes.

Devuelve hallazgos primero. Si no hay problemas, dilo claramente y deja el riesgo residual.

# Problemas conocidos

## Markdown limitado

El renderizador Markdown propio soporta encabezados, listas básicas, negrita, cursiva, código inline y enlaces HTTP/HTTPS. No soporta tablas, blockquotes, HTML passthrough, footnotes ni bloques de código.

Si una lección necesita Markdown complejo, ampliar el renderizador con cuidado o sustituirlo por un parser probado manteniendo salida estática, CSP y validación.

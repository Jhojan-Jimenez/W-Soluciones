<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
# 🛡️ Soluciones W — Plataforma de Asistencias & Afiliaciones

> **Dominio de Producción:** [https://w-soluciones.jhojan.cloud](https://w-soluciones.jhojan.cloud)  
> **Repositorio Oficial:** `git@github.com:Jhojan-Jimenez/W-Soluciones.git`  
> **Infraestructura:** Oracle Cloud Infrastructure ARM64 + Coolify v4 + Docker Compose (UUID: `wopznksncforgq0hrag0hsrh`)

---

## 📱 Especificaciones Clave de UX y Responsive
1. **Identidad Móvil:** En dispositivos móviles (`< 640px`) se renderiza únicamente el isotipo oficial `W` (`/images/logo-w-symbol.png`), permitiendo que el header respire y los CTAs ("Soy Afiliado" y "WhatsApp") no colisionen.
2. **Carrusel de Asistencias Móvil:** Los 5 Pilares de Asistencia en móvil cuentan con navegación guiada por botones interactivos (**Anterior** y **Siguiente**), dots de paginación directa y contador de estado (`Pilar X de 6`), eliminando el scroll libre accidental. En desktop se mantiene la cuadrícula completa de 3 columnas.
3. **Grid 2x2 de Pasarelas de Pago:** En pantallas móviles, los métodos de pago (PSE, Nequi, Tarjetas Visa/Mastercard, Daviplata) se organizan en una cuadrícula simétrica de 2 columnas (`grid-cols-2`), optimizando el espacio visual vertical.
4. **Línea WhatsApp:** Todo punto de contacto y cotización enlaza directamente a la línea oficial `+57 313 4289397`.

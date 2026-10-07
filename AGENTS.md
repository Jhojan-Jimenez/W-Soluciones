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
1. **Identidad Móvil:** En dispositivos móviles (`< 640px`) se renderiza únicamente el isotipo oficial `W` (`/images/logo-w-symbol.png`), permitiendo que el header respire y los CTAs ("Soy Afiliado" y "WhatsApp") no colisionen. En desktop se muestra el logo corporativo horizontal completo (`/images/logo-soluciones-w.png`).
2. **Carrusel de Asistencias Móvil:** Los 5 Pilares de Asistencia en móvil cuentan con navegación guiada por botones interactivos (**Anterior** y **Siguiente**) ubicados a los lados de la card, dots de paginación directa y contador de estado (`Pilar X de 5`), eliminando el scroll libre accidental. En desktop se mantiene la cuadrícula completa de 3 columnas.
3. **Card de Emergencias Separada:** La tarjeta de Atención 24 Horas / Emergencias se presenta en una sección independiente destacada en móvil, no mezclada dentro del carrusel de los 5 pilares.
4. **Grid 2x2 de Pasarelas de Pago:** En pantallas móviles, los métodos de pago (PSE, Nequi, Tarjetas Visa/Mastercard, Daviplata) se organizan en una cuadrícula simétrica de 2 columnas (`grid-cols-2`), optimizando el espacio visual vertical y con textos/logos completamente centrados.
5. **Scroll al tope en Dashboard:** Al autenticarse o entrar a la vista "Soy Afiliado", se fuerza `window.scrollTo({ top: 0, left: 0, behavior: "instant" })` para que el usuario empiece siempre desde el encabezado superior.
6. **Línea WhatsApp:** Todo punto de contacto y cotización enlaza directamente a la línea oficial `+57 313 4289397`.

---

## 🏗️ Estructura del Proyecto & Componentes Clave

```text
Projects/soluciones-w/
├── AGENTS.md                          # ⭐️ Memoria técnica y reglas de operación de Soluciones W
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx             # Root layout con tipografía Inter, metadata y SEO
    │   │   ├── page.tsx               # Landing page principal, Hero, Planes, 5 Pilares y Pasarelas
    │   │   └── globals.css            # Estilos globales y tokens Tailwind CSS v4
    │   └── components/
    │       ├── RappiMemberHub.tsx     # Hub privado de afiliados (estilo Rappi con catálogo de asistencias)
    │       └── MemberLoginModal.tsx   # Modal de login por cédula y acceso rápido demo
    ├── public/
    │   ├── favicon.png                # Favicon oficial HD con la W centrada
    │   └── images/
    │       ├── logo-w-symbol.png      # Isotipo W recortado en alta definición para móvil
    │       ├── logo-soluciones-w.png  # Logo horizontal corporativo para desktop
    │       └── payments/              # Logos oficiales de PSE, Nequi, Visa, Mastercard, Daviplata
    ├── package.json                   # Next.js 16.3.8 + React 19.2.8 + Tailwind CSS 4.3.3 + Lucide
    └── next.config.ts                 # Configuración de compilación Turbopack
```

---

## 🛠️ Comandos de Desarrollo Local

```bash
# Entrar al frontend
cd frontend

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo local
pnpm run dev

# Compilar y validar TypeScript en local (siempre antes de proponer cambios)
pnpm run build
```

---

## ☁️ Despliegue en Servidor OCI ARM64 (Solo bajo confirmación del usuario)

* **Repositorio Remoto:** `git@github.com:Jhojan-Jimenez/W-Soluciones.git` (rama `main`).
* **Coolify API Endpoint:** `http://localhost:8000/api/v1/deploy?uuid=wopznksncforgq0hrag0hsrh&force=false`
* **Coolify Token:** `4|VmCDl5tCTaDYGFQB40YIs9G1vKFprac4gLq5NZH312416449`
* **Trigger vía SSH:**
  ```bash
  ssh -o StrictHostKeyChecking=no -i ~/.ssh/oracle-key ubuntu@150.136.63.103 \
    "curl -s -X POST -H 'Authorization: Bearer 4|VmCDl5tCTaDYGFQB40YIs9G1vKFprac4gLq5NZH312416449' 'http://localhost:8000/api/v1/deploy?uuid=wopznksncforgq0hrag0hsrh&force=false'"
  ```

---

## ⚠️ Regla Operativa Estricta: PRIMERO LOCAL (PROHIBIDO AUTO-PUSH Y DEPLOY)
* **Primero Local:** Todas las modificaciones se programan, verifican y compilan exclusivamente en el entorno local (`pnpm run build` / servidor local).
* **Cero Push Automático:** NO ejecutar `git push` ni disparar despliegues hacia Coolify / OCI a menos que el usuario lo solicite de manera explícita en su mensaje.


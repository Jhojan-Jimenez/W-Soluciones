# 🛡️ Soluciones W — Plataforma Integral B2C & B2B

Arquitectura modular para la digitalización del canal de asistencias familiares de Soluciones W (Dir. Wilson Triana).

---

## 📁 Estructura del Proyecto

```text
soluciones-w/
├── frontend/               # 💻 Aplicación Web B2C en Next.js 16 + Tailwind CSS (App Router)
│   ├── src/app/            # Vistas, cotizador en vivo, registro express y visor de central
│   ├── public/             # Recursos estáticos
│   └── package.json        # Dependencias y scripts de ejecución
│
├── backend/                # ⚙️ Servicios Core, APIs y Workers (Futura implementación)
│   └── README.md           # Especificaciones de webhooks, emisión PDF y pasarela
│
└── docs/                   # 📋 Documentación de Negocio y Metodología
    ├── PREREQUISITES.md    # Prerrequisitos de negocio, legales y técnicos antes de desarrollo
    └── README.md           # Modelos de negocio y flujos de usuario
```

---

## 🚀 Ejecutar el Frontend

```bash
cd frontend
pnpm dev
```

El portal web de autogestión estará disponible en `http://localhost:3000`.

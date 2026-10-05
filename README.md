# 🛡️ Soluciones W — Portal B2C de Autogestión de Asistencias

> Plataforma web transaccional B2C (24/7) para la adquisición autónoma y gestión de programas de asistencia familiar en Colombia (Médica, Ambulancia, Mascotas, Hogar y Odontología).
> Desarrollado bajo la dirección de **Wilson Triana** con arquitectura Next.js 16 + Tailwind CSS y gestión con PNPM.

---

## 🚀 Inicio Rápido

Para ejecutar el entorno local de desarrollo:

```bash
# 1. Entrar al proyecto
cd /home/claude/Workspace/Portafolio/CV/Projects/soluciones-w

# 2. Instalar dependencias con PNPM
pnpm install

# 3. Iniciar servidor de desarrollo
pnpm dev
```

El portal estará disponible en `http://localhost:3000`.

---

## 📦 Estructura del MVP (Los 4 Módulos)

1. **Módulo 1: Portafolio y Cotización Transparente**
   * Vista de las 5 asistencias con sus coberturas, topes anuales y precios unitarios.
   * Cotizador interactivo en tiempo real con descuentos por combo (15% a 25%) y opción de pago anual con 2 meses gratis.
2. **Módulo 2: Registro Express (Fricción Cero)**
   * Formulario optimizado de captura de datos (Cédula, Nombres, Celular, Correo, Dirección) y aceptación de Habeas Data (Ley 1581).
3. **Módulo 3: Checkout Digital & Emisión Instantánea (< 2 min)**
   * Simulación e integración con pasarela de pagos colombiana (Wompi/Mercado Pago) con PSE, Nequi y tarjetas.
   * Generación y entrega instantánea del número de contrato, certificado digital y enlace directo a WhatsApp.
4. **Módulo 4: Operación & Central de Emergencias (Wilson Triana)**
   * Visor rápido para el operador del Call Center: consulta por cédula para validar vigencia, asistencias activas y eventos disponibles en 1 segundo.

---

## 📋 Documentación de Prerrequisitos

Consulta el archivo [`PREREQUISITES.md`](file:///home/claude/Workspace/Portafolio/CV/Projects/soluciones-w/PREREQUISITES.md) para revisar los acuerdos de negocio, marco legal de Habeas Data, trámites de pasarela de pagos y activos de marca requeridos antes de iniciar los sprints técnicos.

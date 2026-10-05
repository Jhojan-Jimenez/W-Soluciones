# ⚙️ Soluciones W — Backend & Servicios Core (Futura Implementación)

Esta carpeta alojará los servicios transaccionales, APIs y motores asíncronos de la plataforma:

## Módulos Planificados
1. **API Gateway / Core Backend (Node.js o FastAPI):**
   * Gestión de pólizas, usuarios y contratos.
   * Endpoints de consulta para la Central Telefónica de Wilson Triana.
2. **Integración con Pasarela de Pagos (Wompi / Mercado Pago):**
   * Endpoint de Webhooks para confirmación de transacciones y conciliación bancaria.
   * Motor de renovación de suscripciones mensuales.
3. **Motor de Generación de Certificados PDF (Worker asíncrono):**
   * Plantillas oficiales en PDF con firma digitalizada y código QR.
   * Almacenamiento seguro en S3/Cloudflare R2.
4. **Notificaciones Omnicanal:**
   * Servicio de despacho automático por Meta Cloud API (WhatsApp) y correo (Resend/SendGrid).

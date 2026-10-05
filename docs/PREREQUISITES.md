# 📋 PRERREQUISITOS Y DEFINICIONES PREVIAS AL DESARROLLO (SOLUCIONES W)

> **Documento Estratégico y Técnico para Dirección (Wilson Triana) y Equipo de Ingeniería.**
> Este documento consolida todo lo que debe estar definido y validado antes de iniciar cada fase del cronograma de 16 semanas para el canal digital B2C.

---

## 🏛️ 1. Definiciones de Negocio y Producto (Con Wilson Triana)

### A. Tarifas y Estructura de Precios (Pricing B2C)
* [ ] **Precio por Asistencia Individual:** Definir el valor mensual unitario (COP) si el cliente solo desea una asistencia (ej. solo Mascotas o solo Hogar).
* [ ] **Precio de Paquete / Combo Familiar:** Definir el valor con descuento para las 5 asistencias agrupadas (ej. $39.900 COP/mes).
* [ ] **Descuento por Pago Anual:** Definir incentivo de pago de contado por 12 meses (ej. 15% de descuento o 2 meses gratis).

### B. Topes, Eventos y Alcances por Asistencia
* [ ] **Asistencia Médica:** Definir si incluye médico domiciliario presencial, número máximo de consultas anuales (ej. 3 al año) y horario de telemedicina (24/7).
* [ ] **Ambulancia:** Definir radio de cobertura geográfica urbana y número de traslados cubiertos al año.
* [ ] **Mascotas:** Topes en dinero por urgencia veterinaria (ej. hasta $250.000 COP por evento, máx. 2 eventos al año) y razas/edades permitidas.
* [ ] **Hogar:** Definir los límites por servicio de plomería, cerrajería y electricidad (ej. hasta $200.000 COP en mano de obra y materiales básicos).
* [ ] **Odontología:** Alcance de la fase preventiva (limpieza profiláctica) y coberturas ante trauma/dolor agudo.

### C. Marco Legal, Términos y Habeas Data
* [ ] **Términos y Condiciones del Servicio:** Redacción legal aprobada que delimite que Soluciones W es un servicio de auxilio y asistencia, **no una compañía de seguros ni una EPS**.
* [ ] **Política de Tratamiento de Datos (Ley 1581 de 2012):** Texto de autorización para captura de cédula, celular, dirección y correo electrónico.
* [ ] **Cláusula de Cancelación:** Definir política de no permanencia y proceso de cancelación transparente.

---

## 💳 2. Herramientas, Accesos y Trámites Comerciales

### A. Pasarela de Pagos Local (Wompi / Mercado Pago)
* [ ] **Creación y Verificación de Cuenta Jurídica:**
  * RUT actualizado (2025/2026).
  * Certificado de Existencia y Representación Legal (Cámara de Comercio < 30 días).
  * Certificación bancaria para desembolsos automáticos.
  * Cédula del representante legal (Wilson Triana).
* [ ] **Habilitación de Métodos de Pago:**
  * PSE (Aprobación ACH Colombia).
  * Tarjetas de crédito/débito (Visa, Mastercard, AMEX).
  * Billeteras digitales (Nequi y Daviplata).
* [ ] **Generación de Llaves API (Sandbox y Producción):**
  * `PUBLIC_KEY` y `PRIVATE_KEY`.
  * `EVENTS_SECRET` (para validación de webhooks seguros).

### B. Canales de Comunicación y Atención
* [ ] **Línea Telefónica de la Central:** Número PBX o línea móvil exclusiva para emergencias.
* [ ] **Número de WhatsApp Business:** Línea verificada para atención de emergencias.
* [ ] **Proveedor de Mensajería Transaccional:**
  * Cuenta de WhatsApp Cloud API (Meta for Developers) o Twilio/Gupshup para envío automatizado de certificados PDF.
  * Proveedor de Email Transaccional (Resend o SendGrid) con dominio autenticado (SPF, DKIM, DMARC).

---

## ⚙️ 3. Operación de la Central de Emergencias (Wilson Triana)

### A. Protocolo del Operador Telefónico
* [ ] Definir los datos mínimos que el operador debe ver al buscar un cliente por cédula:
  * Estado (`ACTIVO`, `MORA`, `CANCELADO`).
  * Asistencias contratadas.
  * Fecha de vencimiento del período actual.
  * Contador de asistencias utilizadas en el año vs. límite disponible.

### B. Coexistencia B2B (Empresas) y B2C (Portal Web)
* [ ] Definir si los clientes B2B que actualmente se cargan en Excel se migrarán a esta misma base de datos unificada para que el operador consulte todo en un solo visor central.

---

## 🎨 4. Activos de Marca y Diseño
* [ ] **Logotipo vectorial de Soluciones W** (formatos SVG / PNG alta resolución).
* [ ] **Manual o colores de identidad corporativa** (paleta de colores primaria y secundaria).
* [ ] **Plantilla oficial del Certificado de Cobertura en PDF:**
  * Encabezado con datos de la empresa (NIT, Dirección, Teléfono).
  * Firma digitalizada de Wilson Triana o Director Operativo.
  * Sello de validez y estructura de póliza.

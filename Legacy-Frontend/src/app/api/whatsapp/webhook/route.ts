import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createAuthToken } from "@/lib/auth";

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || "soluciones_w_webhook_verify_token_2026";
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_API_TOKEN;
const WHATSAPP_PHONE_ID = process.env.WHATSAPP_PHONE_ID || "1293663623837482";

/**
 * 1. GET: Verificación del Webhook por parte de Meta (hub.challenge)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("Forbidden", { status: 403 });
}

/**
 * 2. POST: Receptor de eventos de WhatsApp Cloud API
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const entry = body.entry?.[0];
    const changes = entry?.changes?.[0];
    const value = changes?.value;
    const message = value?.messages?.[0];

    if (!message) {
      return NextResponse.json({ status: "ignored" });
    }

    const fromPhone = message.from; // Número de teléfono del remitente
    const messageType = message.type;

    // A. Si el usuario seleccionó una opción en una LISTA INTERACTIVA
    if (messageType === "interactive" && message.interactive?.type === "list_reply") {
      const selectedId = message.interactive.list_reply.id;
      const selectedTitle = message.interactive.list_reply.title;

      await handleListReply(fromPhone, selectedId, selectedTitle);
      return NextResponse.json({ status: "handled_interactive" });
    }

    // B. Si es un mensaje de texto normal
    if (messageType === "text") {
      const text = message.text.body.trim().toLowerCase();

      // Si parece un número de cédula (entre 6 y 11 dígitos)
      const digitsOnly = text.replace(/\D/g, "");
      if (digitsOnly.length >= 6 && digitsOnly.length <= 11) {
        await handleCedulaLookup(fromPhone, digitsOnly);
        return NextResponse.json({ status: "handled_cedula" });
      }

      // De lo contrario, enviar el Menú Principal con Lista Interactiva
      await sendMainMenu(fromPhone);
      return NextResponse.json({ status: "handled_main_menu" });
    }

    return NextResponse.json({ status: "received" });
  } catch (error) {
    console.error("Error in WhatsApp Webhook:", error);
    return NextResponse.json({ status: "error" }, { status: 500 });
  }
}

/**
 * Envía el Menú Principal con LISTA INTERACTIVA de WhatsApp
 */
async function sendMainMenu(toPhone: string) {
  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: toPhone,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: "Soluciones W 🛡️"
      },
      body: {
        text: "¡Hola! Bienvenido a la línea oficial de Soluciones W. Atención médica, emergencias familiares y auxilio en el hogar 24 horas.\n\nPor favor selecciona una opción:"
      },
      footer: {
        text: "Selecciona una opción para continuar"
      },
      action: {
        button: "Ver Opciones",
        sections: [
          {
            title: "Gestión de Servicios",
            rows: [
              {
                id: "opt_afiliarme",
                title: "Quiero Afiliarme 🛡️",
                description: "Conoce y adquiere planes de protección familiar"
              },
              {
                id: "opt_asistencia",
                title: "Solicitar Asistencia 🚑",
                description: "Médico, ambulancia, cerrajería o plomería"
              },
              {
                id: "opt_consultar_plan",
                title: "Consultar Mi Plan 📋",
                description: "Ver vigencia y asistencias disponibles"
              },
              {
                id: "opt_hablar_asesor",
                title: "Hablar con un Asesor 👤",
                description: "Atención personalizada con el equipo de Wilson Triana"
              }
            ]
          }
        ]
      }
    }
  };

  await sendMetaWhatsAppMessage(payload);
}

/**
 * Procesa la opción elegida en la Lista Interactiva
 */
async function handleListReply(toPhone: string, selectedId: string, _title: string) {
  // 1. Quiero Afiliarme -> Mostrar Lista de Planes
  if (selectedId === "opt_afiliarme") {
    const plansPayload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: toPhone,
      type: "interactive",
      interactive: {
        type: "list",
        header: {
          type: "text",
          text: "Nuestros Planes"
        },
        body: {
          text: "Protege a tu familia sin copagos sorpresa. Elige el plan de tu preferencia:"
        },
        footer: {
          text: "Soluciones W · Tarifas Netas"
        },
        action: {
          button: "Elegir Plan",
          sections: [
            {
              title: "Planes Disponibles",
              rows: [
                {
                  id: "plan_plus",
                  title: "Plan Plus 360° ⭐",
                  description: "$54.900/mes · Salud, ambulancia, hogar y mascotas"
                },
                {
                  id: "plan_tradicional",
                  title: "Plan Tradicional",
                  description: "$39.900/mes · Salud domiciliaria y urgencias hogar"
                },
                {
                  id: "plan_virtual",
                  title: "Plan Básico Digital",
                  description: "$24.900/mes · Telemedicina 24/7 sin esperas"
                }
              ]
            }
          ]
        }
      }
    };
    await sendMetaWhatsAppMessage(plansPayload);
    return;
  }

  // 2. Solicitó asistencia o consultar plan -> Pedir Cédula
  if (selectedId === "opt_asistencia" || selectedId === "opt_consultar_plan") {
    await sendTextMessage(
      toPhone,
      "Por favor escribe tu número de cédula (sin puntos ni espacios) para consultar tu plan en nuestra base de datos:"
    );
    return;
  }

  // 3. Hablar con un asesor
  if (selectedId === "opt_hablar_asesor") {
    await sendTextMessage(
      toPhone,
      "¡Con gusto! Un asesor de Soluciones W del equipo de Wilson Triana tomará esta conversación en breve por esta misma línea para atenderte personalmente."
    );
    return;
  }

  // 4. Eligió un plan de afiliación
  if (selectedId.startsWith("plan_")) {
    await sendTextMessage(
      toPhone,
      "¡Excelente elección! Para emitir tu certificado digital oficial, puedes afiliarte en 2 minutos directamente desde nuestra plataforma web segura:\n\n👉 https://w-soluciones.jhojan.cloud/#planes\n\nO si prefieres, escribe tu Nombre Completo y Cédula por aquí para que un asesor te asista."
    );
    return;
  }

  // 5. Eligió un servicio de asistencia médica/hogar
  if (selectedId.startsWith("srv_")) {
    const radicado = `AUX-${Math.floor(1000 + Math.random() * 9000)}`;
    await sendTextMessage(
      toPhone,
      `✅ ¡Asistencia radicada exitosamente! (#${radicado})\n\nLa central técnica está gestionando el despacho de la unidad. Un operador te contactará en breve para coordinar la hora de llegada.\n\n📞 Para urgencias con riesgo vital inminente, llama a nuestra Central Médica 24/7 al (601) 745-9000.`
    );
  }
}

/**
 * Consulta la base de datos por Cédula y responde con sus asistencias activas
 */
async function handleCedulaLookup(toPhone: string, cedula: string) {
  const affiliate = db.getAffiliateByDoc(cedula);

  if (!affiliate) {
    await sendTextMessage(
      toPhone,
      `No encontramos una afiliación activa con la cédula *${cedula}*.\n\nPuedes adquirir tu suscripción médica y familiar en 2 minutos en:\n👉 https://w-soluciones.jhojan.cloud`
    );
    return;
  }

  if (affiliate.status === "past_due") {
    await sendTextMessage(
      toPhone,
      `⚠️ Hola ${affiliate.fullName}, tu contrato *${affiliate.contractNumber}* presenta un pago pendiente. Comunícate a nuestra línea para reactivar tu cobertura.`
    );
    return;
  }

  // Generar Token Mágico para entrar directo al Dashboard web sin loguearse
  const magicToken = await createAuthToken({
    docNumber: affiliate.docNumber,
    contractNumber: affiliate.contractNumber,
    fullName: affiliate.fullName,
    planKey: affiliate.planKey,
    planName: affiliate.planName
  });

  // Enviar Lista Interactiva con las asistencias que puede pedir
  const assistancePayload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: toPhone,
    type: "interactive",
    interactive: {
      type: "list",
      header: {
        type: "text",
        text: `Afiliado: ${affiliate.fullName}`
      },
      body: {
        text: `✅ Tu *${affiliate.planName}* está ACTIVO (Vence: ${affiliate.validUntil}).\n\n¿Qué asistencia requieres solicitar hoy?`
      },
      footer: {
        text: "Despacho prioritario 24/7"
      },
      action: {
        button: "Elegir Servicio",
        sections: [
          {
            title: "Urgencias Médicas",
            rows: [
              {
                id: `srv_ambulancia_${cedula}`,
                title: "Ambulancia Urgente 🚨",
                description: "Despacho prioritario de paramédicos"
              },
              {
                id: `srv_medico_${cedula}`,
                title: "Médico a Domicilio 🩺",
                description: "Consulta médica general en tu hogar"
              }
            ]
          },
          {
            title: "Auxilio Hogar & Mascotas",
            rows: [
              {
                id: `srv_hogar_${cedula}`,
                title: "Cerrajería / Plomería 🔑",
                description: "Apertura de cerraduras o fugas de agua"
              },
              {
                id: `srv_veterinaria_${cedula}`,
                title: "Veterinaria Urgente 🐶",
                description: "Atención de urgencia para tu mascota"
              }
            ]
          }
        ]
      }
    }
  };

  await sendMetaWhatsAppMessage(assistancePayload);

  // También enviar link mágico para que pueda abrir su dashboard web directo
  await sendTextMessage(
    toPhone,
    `📲 También puedes gestionar todas tus asistencias y consultar tu carnet digital en la web con este enlace directo:\n👉 https://w-soluciones.jhojan.cloud/?token=${magicToken}`
  );
}

/**
 * Helper para enviar mensajes de texto plano a WhatsApp
 */
async function sendTextMessage(toPhone: string, text: string) {
  return sendMetaWhatsAppMessage({
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: toPhone,
    type: "text",
    text: { body: text }
  });
}

/**
 * Envío HTTP al endpoint de Meta Graph API
 */
async function sendMetaWhatsAppMessage(payload: any) {
  if (!WHATSAPP_API_TOKEN) {
    // Si no está configurado el token de Meta en el entorno local, loguear para depuración
    console.log("[Meta WhatsApp Cloud API (Simulado Local)] Payload enviado:", JSON.stringify(payload, null, 2));
    return;
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${WHATSAPP_PHONE_ID}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    console.error("Error al enviar mensaje a WhatsApp API:", err);
  }
}

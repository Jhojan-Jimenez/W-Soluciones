import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createAuthToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { docNumber } = body;

    if (!docNumber || typeof docNumber !== "string" || !docNumber.trim()) {
      return NextResponse.json(
        { error: "Debes ingresar tu número de documento." },
        { status: 400 }
      );
    }

    const affiliate = db.getAffiliateByDoc(docNumber);

    if (!affiliate) {
      return NextResponse.json(
        {
          error: "Documento no encontrado.",
          message: "No encontramos una suscripción activa con esta cédula. Puedes afiliarte en línea en 2 minutos."
        },
        { status: 404 }
      );
    }

    if (affiliate.status === "past_due") {
      return NextResponse.json(
        {
          error: "Suscripción en mora.",
          message: `Tu póliza (${affiliate.contractNumber}) presenta mora en su pago mensual. Comunícate a nuestra central al (601) 745-9000 o vía WhatsApp al +57 313 4289397 para normalizar tu servicio.`,
          affiliate
        },
        { status: 403 }
      );
    }

    if (affiliate.status === "cancelled") {
      return NextResponse.json(
        {
          error: "Suscripción inactiva.",
          message: `El contrato ${affiliate.contractNumber} fue cancelado previamente. Puedes reactivarlo contactando a un asesor comercial.`,
          affiliate
        },
        { status: 403 }
      );
    }

    // Generar Token JWT firmado
    const token = await createAuthToken({
      docNumber: affiliate.docNumber,
      contractNumber: affiliate.contractNumber,
      fullName: affiliate.fullName,
      planKey: affiliate.planKey,
      planName: affiliate.planName
    });

    return NextResponse.json({
      success: true,
      token,
      affiliate
    });
  } catch (error) {
    console.error("Error in /api/auth/login:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el ingreso." },
      { status: 500 }
    );
  }
}

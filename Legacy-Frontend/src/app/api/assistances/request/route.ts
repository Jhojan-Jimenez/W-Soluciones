import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyAuthToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      serviceId,
      serviceTitle,
      destinationAddress,
      phone,
      docNumber,
      channel = "web"
    } = body;

    let targetDoc = docNumber;
    let targetName = "Afiliado";

    // Validar token si viene en los headers
    const authHeader = req.headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7);
      const payload = await verifyAuthToken(token);
      if (payload) {
        targetDoc = payload.docNumber;
        targetName = payload.fullName;
      }
    }

    if (!targetDoc) {
      return NextResponse.json(
        { error: "Se requiere la cédula del afiliado para despachar asistencia." },
        { status: 400 }
      );
    }

    const affiliate = db.getAffiliateByDoc(targetDoc);
    if (!affiliate) {
      return NextResponse.json(
        { error: "No se encontró afiliado con este documento." },
        { status: 404 }
      );
    }

    if (affiliate.status !== "active") {
      return NextResponse.json(
        { error: `El afiliado presenta estado: ${affiliate.status}. No se puede despachar asistencia automática.` },
        { status: 403 }
      );
    }

    const assistance = db.recordAssistance({
      affiliateDoc: affiliate.docNumber,
      affiliateName: affiliate.fullName,
      serviceId: serviceId || "urgencia",
      serviceTitle: serviceTitle || "Asistencia de Urgencia",
      destinationAddress: destinationAddress || body.address || affiliate.address || "Dirección por confirmar",
      phone: phone || affiliate.phone,
      channel: channel as "web" | "whatsapp"
    });

    return NextResponse.json({
      success: true,
      message: "Asistencia radicada y despachada.",
      radicadoNumber: assistance.radicado,
      assistance
    });
  } catch (error) {
    console.error("Error in /api/assistances/request:", error);
    return NextResponse.json(
      { error: "Error al registrar la asistencia." },
      { status: 500 }
    );
  }
}

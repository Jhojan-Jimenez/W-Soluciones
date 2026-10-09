import { NextResponse } from "next/server";
import { db, Affiliate } from "@/lib/db";
import { createAuthToken } from "@/lib/auth";

const PLAN_NAMES = {
  virtual: "Plan Básico Digital",
  tradicional: "Plan Tradicional Hogar & Salud",
  plus: "Plan Plus Familiar 360°"
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      docType = "CC",
      docNumber,
      fullName,
      phone,
      email,
      address = "Dirección no informada",
      city = "Bogotá D.C.",
      planKey = "plus",
      billingPeriod = "monthly"
    } = body;

    if (!docNumber || !fullName || !phone || !email) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para la afiliación." },
        { status: 400 }
      );
    }

    const cleanDoc = docNumber.trim().replace(/\D/g, "");
    if (!cleanDoc) {
      return NextResponse.json(
        { error: "Número de documento inválido." },
        { status: 400 }
      );
    }

    // Calcular vigencia (1 mes o 1 año)
    const validUntilDate = new Date();
    if (billingPeriod === "annual") {
      validUntilDate.setFullYear(validUntilDate.getFullYear() + 1);
    } else {
      validUntilDate.setMonth(validUntilDate.getMonth() + 1);
    }
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const validUntilStr = `${String(validUntilDate.getDate()).padStart(2, "0")} de ${
      months[validUntilDate.getMonth()]
    }, ${validUntilDate.getFullYear()}`;

    // Generar número de contrato único
    const contractNumber = `SW-${Math.floor(100000 + Math.random() * 900000)}`;

    const newAffiliateData: Omit<Affiliate, "id" | "createdAt"> = {
      docType,
      docNumber: cleanDoc,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      city: city.trim(),
      contractNumber,
      planKey: (planKey as any) || "plus",
      planName: PLAN_NAMES[planKey as keyof typeof PLAN_NAMES] || "Plan Plus Familiar 360°",
      status: "active",
      validUntil: validUntilStr,
      paymentMethod: `Wompi Demo (${billingPeriod === "annual" ? "Anual Aprobado" : "Mensual Aprobado"})`,
      eventsRemaining: {
        medica: 2,
        ambulancia: 2,
        hogar: 3,
        mascotas: 2,
        odontologia: 1
      }
    };

    // Guardar en base de datos persistente
    const affiliate = db.createOrUpdateAffiliate(newAffiliateData);

    // Generar Token JWT de sesión
    const token = await createAuthToken({
      docNumber: affiliate.docNumber,
      contractNumber: affiliate.contractNumber,
      fullName: affiliate.fullName,
      planKey: affiliate.planKey,
      planName: affiliate.planName
    });

    return NextResponse.json({
      success: true,
      message: "¡Afiliación y pago demo procesados con éxito!",
      contractNumber,
      token,
      affiliate
    });
  } catch (error) {
    console.error("Error in /api/checkout/demo:", error);
    return NextResponse.json(
      { error: "Error interno al procesar el checkout demo." },
      { status: 500 }
    );
  }
}

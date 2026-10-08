import { NextResponse } from "next/server";
import { verifyAuthToken } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let token = body.token;

    if (!token) {
      const authHeader = req.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json(
        { error: "Token no proporcionado." },
        { status: 401 }
      );
    }

    const payload = await verifyAuthToken(token);

    if (!payload || !payload.docNumber) {
      return NextResponse.json(
        { error: "Token inválido o expirado." },
        { status: 401 }
      );
    }

    // Traer la data fresca del afiliado desde la base de datos
    const affiliate = db.getAffiliateByDoc(payload.docNumber);

    if (!affiliate) {
      return NextResponse.json(
        { error: "Afiliado no encontrado en la base de datos." },
        { status: 404 }
      );
    }

    if (affiliate.status !== "active") {
      return NextResponse.json(
        {
          error: "Afiliado no activo.",
          status: affiliate.status,
          affiliate
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      valid: true,
      payload,
      affiliate
    });
  } catch (error) {
    console.error("Error in /api/auth/verify:", error);
    return NextResponse.json(
      { error: "Error al validar la sesión." },
      { status: 500 }
    );
  }
}

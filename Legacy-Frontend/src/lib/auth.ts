import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.AUTH_SECRET || "soluciones_w_jwt_secret_secure_key_2026_xyz_777"
);

export interface TokenPayload {
  docNumber: string;
  contractNumber: string;
  fullName: string;
  planKey: string;
  planName: string;
  role?: string;
  [key: string]: unknown;
}

/**
 * Genera un token JWT seguro firmado con HMAC SHA-256 (vigencia de 30 días)
 */
export async function createAuthToken(payload: TokenPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .setSubject(payload.docNumber)
    .sign(SECRET_KEY);
}

/**
 * Valida un token JWT y devuelve su payload. Retorna null si es inválido o expiró.
 */
export async function verifyAuthToken(token: string): Promise<TokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as TokenPayload;
  } catch {
    return null;
  }
}

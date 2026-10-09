import fs from "fs";
import path from "path";

export interface Affiliate {
  id: string;
  docType: string;
  docNumber: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  contractNumber: string;
  planKey: "virtual" | "tradicional" | "plus";
  planName: string;
  status: "active" | "past_due" | "cancelled";
  validUntil: string;
  createdAt: string;
  paymentMethod: string;
  eventsRemaining?: {
    medica: number;
    ambulancia: number;
    hogar: number;
    mascotas: number;
    odontologia: number;
  };
}

export interface AssistanceRequest {
  id: string;
  radicado: string;
  affiliateDoc: string;
  affiliateName: string;
  serviceId: string;
  serviceTitle: string;
  destinationAddress: string;
  phone: string;
  channel: "web" | "whatsapp";
  status: "dispatched" | "in_progress" | "completed";
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email: string;
  planKey: string;
  createdAt: string;
  status: "new" | "contacted" | "converted";
}

interface DatabaseSchema {
  affiliates: Affiliate[];
  assistances: AssistanceRequest[];
  leads: Lead[];
}

const DB_PATH = path.join(process.cwd(), "data", "soluciones_w.json");

// Usuarios falsos de prueba predeterminados (Seed)
const INITIAL_AFFILIATES: Affiliate[] = [
  {
    id: "aff-1018492031",
    docType: "CC",
    docNumber: "1018492031",
    fullName: "Carlos Andrés Villamil",
    phone: "313 428 9397",
    email: "carlos.villamil@gmail.com",
    address: "Carrera 15 # 85-30, Bogotá D.C.",
    city: "Bogotá D.C.",
    contractNumber: "SW-849102",
    planKey: "plus",
    planName: "Plan Plus Familiar 360°",
    status: "active",
    validUntil: "04 de Noviembre, 2026",
    createdAt: "2026-01-10T10:00:00.000Z",
    paymentMethod: "Wompi Demo (Aprobado)",
    eventsRemaining: {
      medica: 2,
      ambulancia: 2,
      hogar: 3,
      mascotas: 2,
      odontologia: 1
    }
  },
  {
    id: "aff-1020304050",
    docType: "CC",
    docNumber: "1020304050",
    fullName: "María Fernanda Gómez",
    phone: "320 123 4567",
    email: "mafe.gomez@hotmail.com",
    address: "Calle 127 # 19-45, Apto 502, Bogotá D.C.",
    city: "Bogotá D.C.",
    contractNumber: "SW-651209",
    planKey: "tradicional",
    planName: "Plan Tradicional Hogar & Salud",
    status: "active",
    validUntil: "15 de Diciembre, 2026",
    createdAt: "2026-02-15T14:30:00.000Z",
    paymentMethod: "Wompi Demo (PSE)",
    eventsRemaining: {
      medica: 1,
      ambulancia: 1,
      hogar: 2,
      mascotas: 0,
      odontologia: 1
    }
  },
  {
    id: "aff-80123456",
    docType: "CC",
    docNumber: "80123456",
    fullName: "Wilson Triana",
    phone: "313 428 9397",
    email: "wilson.triana@solucionesw.com",
    address: "Avenida Esperanza # 68-12, Bogotá D.C.",
    city: "Bogotá D.C.",
    contractNumber: "SW-100001",
    planKey: "plus",
    planName: "Plan Plus Familiar 360°",
    status: "active",
    validUntil: "31 de Diciembre, 2027",
    createdAt: "2025-01-01T08:00:00.000Z",
    paymentMethod: "Directorio Directivo",
    eventsRemaining: {
      medica: 5,
      ambulancia: 5,
      hogar: 5,
      mascotas: 5,
      odontologia: 3
    }
  },
  {
    id: "aff-52987654",
    docType: "CC",
    docNumber: "52987654",
    fullName: "Laura Camila Pérez",
    phone: "315 555 1234",
    email: "laura.perez92@gmail.com",
    address: "Carrera 7 # 140-11, Bogotá D.C.",
    city: "Bogotá D.C.",
    contractNumber: "SW-432187",
    planKey: "virtual",
    planName: "Plan Básico Digital",
    status: "past_due", // En mora para prueba de casos borde
    validUntil: "01 de Octubre, 2026",
    createdAt: "2025-10-01T11:00:00.000Z",
    paymentMethod: "Tarjeta Rechazada",
    eventsRemaining: {
      medica: 0,
      ambulancia: 0,
      hogar: 0,
      mascotas: 0,
      odontologia: 0
    }
  }
];

function ensureDb(): DatabaseSchema {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(DB_PATH)) {
      const initial: DatabaseSchema = {
        affiliates: INITIAL_AFFILIATES,
        assistances: [],
        leads: []
      };
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading database file, using in-memory fallback:", err);
    return {
      affiliates: INITIAL_AFFILIATES,
      assistances: [],
      leads: []
    };
  }
}

function saveDb(data: DatabaseSchema): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving database file:", err);
  }
}

export const db = {
  // Afiliados
  getAffiliateByDoc(docNumber: string): Affiliate | null {
    const data = ensureDb();
    const cleanDoc = docNumber.trim().replace(/\D/g, "");
    return (
      data.affiliates.find(
        (a) => a.docNumber.replace(/\D/g, "") === cleanDoc
      ) || null
    );
  },

  getAllAffiliates(): Affiliate[] {
    const data = ensureDb();
    return data.affiliates;
  },

  createOrUpdateAffiliate(affiliateData: Omit<Affiliate, "id" | "createdAt">): Affiliate {
    const data = ensureDb();
    const cleanDoc = affiliateData.docNumber.trim().replace(/\D/g, "");
    const existingIndex = data.affiliates.findIndex(
      (a) => a.docNumber.replace(/\D/g, "") === cleanDoc
    );

    const now = new Date().toISOString();
    let result: Affiliate;

    if (existingIndex >= 0) {
      result = {
        ...data.affiliates[existingIndex],
        ...affiliateData,
        status: "active"
      };
      data.affiliates[existingIndex] = result;
    } else {
      result = {
        ...affiliateData,
        id: `aff-${cleanDoc}-${Date.now()}`,
        createdAt: now,
        eventsRemaining: affiliateData.eventsRemaining || {
          medica: 2,
          ambulancia: 2,
          hogar: 3,
          mascotas: 2,
          odontologia: 1
        }
      };
      data.affiliates.push(result);
    }

    saveDb(data);
    return result;
  },

  // Asistencias
  recordAssistance(req: {
    affiliateDoc: string;
    affiliateName: string;
    serviceId: string;
    serviceTitle: string;
    destinationAddress: string;
    phone: string;
    channel: "web" | "whatsapp";
  }): AssistanceRequest {
    const data = ensureDb();
    const radicado = `AUX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: AssistanceRequest = {
      id: `req-${Date.now()}`,
      radicado,
      ...req,
      status: "dispatched",
      createdAt: new Date().toISOString()
    };

    data.assistances.unshift(newRequest);
    saveDb(data);
    return newRequest;
  },

  getAssistancesByDoc(docNumber: string): AssistanceRequest[] {
    const data = ensureDb();
    const cleanDoc = docNumber.trim().replace(/\D/g, "");
    return data.assistances.filter(
      (r) => r.affiliateDoc.replace(/\D/g, "") === cleanDoc
    );
  },

  // Leads
  createLead(lead: { name: string; phone: string; email: string; planKey: string }): Lead {
    const data = ensureDb();
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      ...lead,
      createdAt: new Date().toISOString(),
      status: "new"
    };
    data.leads.unshift(newLead);
    saveDb(data);
    return newLead;
  }
};

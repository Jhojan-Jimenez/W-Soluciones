"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Ambulance,
  Dog,
  Home,
  Smile,
  PhoneCall,
  MessageCircle,
  AlertTriangle,
  Clock,
  MapPin,
  Wrench,
  Key,
  Zap,
  LogOut,
  Shield,
  Activity,
  X,
  Search,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface MemberData {
  fullName: string;
  docNumber: string;
  phone: string;
  email: string;
  contractNumber: string;
  planName: string;
  validUntil: string;
  address?: string;
}

interface RappiMemberHubProps {
  member: MemberData;
  onLogout: () => void;
}

type CategoryFilter = "all" | "salud" | "hogar" | "mascotas" | "dental";

interface ServiceItem {
  id: string;
  title: string;
  category: CategoryFilter;
  categoryLabel: string;
  eta: string;
  description: string;
  coverage: string;
  icon: any;
  colorBg: string;
  colorText: string;
  badge?: string;
}

const SERVICES: ServiceItem[] = [
  // 1. SALUD
  {
    id: "medico-domicilio",
    title: "Médico General a Domicilio",
    category: "salud",
    categoryLabel: "Salud Familiar",
    eta: "45 a 60 min",
    description: "Atención presencial en cama para cuadros gripales, fiebres, dolores agudos y prescripción de fórmula médica oficial.",
    coverage: "3 visitas al año sin copagos (hasta $250.000 COP c/u)",
    icon: Stethoscope,
    colorBg: "bg-blue-50",
    colorText: "text-blue-700",
    badge: "MÁS SOLICITADO"
  },
  {
    id: "telemedicina",
    title: "Telemedicina 24/7 Inmediata",
    category: "salud",
    categoryLabel: "Salud Virtual",
    eta: "Inmediato · 0 min",
    description: "Consulta médica virtual por videollamada o chat. Emisión instantánea de fórmula médica digital con firma oficial.",
    coverage: "Consultas ilimitadas 24/7 sin costo adicional",
    icon: Activity,
    colorBg: "bg-emerald-50",
    colorText: "text-emerald-700",
    badge: "24/7 ILIMITADO"
  },
  {
    id: "ambulancia",
    title: "Ambulancia de Emergencia",
    category: "salud",
    categoryLabel: "Urgencias Médicas",
    eta: "15 a 25 min",
    description: "Despacho prioritario de ambulancia básica o medicalizada tipo TAB/TAM con paramédicos para estabilización y traslado.",
    coverage: "Hasta 2 traslados anuales 100% cubiertos",
    icon: Ambulance,
    colorBg: "bg-red-50",
    colorText: "text-red-700"
  },

  // 2. HOGAR
  {
    id: "plomeria",
    title: "Plomería & Fugas de Agua",
    category: "hogar",
    categoryLabel: "Asistencia Hogar",
    eta: "Aprox. 45 min",
    description: "Técnico certificado para roturas imprevistas de tuberías, inundaciones, goteras mayores y filtraciones graves en casa.",
    coverage: "Mano de obra y materiales hasta $220.000 COP por evento",
    icon: Wrench,
    colorBg: "bg-cyan-50",
    colorText: "text-cyan-700"
  },
  {
    id: "cerrajeria",
    title: "Cerrajería Urgente (Puerta Principal)",
    category: "hogar",
    categoryLabel: "Asistencia Hogar",
    eta: "Aprox. 35 min",
    description: "Apertura de emergencia por llaves olvidadas adentro, pérdida, robo o cerradura bloqueada de la vivienda.",
    coverage: "Hasta $150.000 COP cubiertos por servicio",
    icon: Key,
    colorBg: "bg-indigo-50",
    colorText: "text-indigo-700"
  },
  {
    id: "electricidad",
    title: "Electricidad Express en Casa",
    category: "hogar",
    categoryLabel: "Asistencia Hogar",
    eta: "Aprox. 45 min",
    description: "Restablecimiento de suministro eléctrico por cortocircuitos, fallas de breakers o corte total imprevisto.",
    coverage: "Hasta $200.000 COP por evento",
    icon: Zap,
    colorBg: "bg-amber-50",
    colorText: "text-amber-700"
  },

  // 3. MASCOTAS
  {
    id: "mascota-urgencia",
    title: "Urgencia Veterinaria (Pet Care)",
    category: "mascotas",
    categoryLabel: "Mascotas",
    eta: "45 a 60 min",
    description: "Atención médica presencial de urgencia para perros y gatos ante accidentes, heridas agudas o intoxicaciones súbitas.",
    coverage: "Hasta $200.000 COP por evento (2 al año)",
    icon: Dog,
    colorBg: "bg-orange-50",
    colorText: "text-orange-700"
  },
  {
    id: "mascota-vacuna",
    title: "Vacunación o Desparasitación Anual Pet",
    category: "mascotas",
    categoryLabel: "Mascotas",
    eta: "Bajo agenda",
    description: "Procedimiento preventivo anual incluido para tu perro o gato registrado: vacuna o desparasitación con carnet clínico.",
    coverage: "1 procedimiento anual incluido sin costo",
    icon: Shield,
    colorBg: "bg-teal-50",
    colorText: "text-teal-700"
  },

  // 4. DENTAL
  {
    id: "odontologia-urgencia",
    title: "Urgencia Odontológica por Dolor Agudo",
    category: "dental",
    categoryLabel: "Salud Oral",
    eta: "Red aliada",
    description: "Alivio inmediato del dolor de muela agudo, traumatismos dentales o infecciones orales en centros clínicos aliados.",
    coverage: "100% cubierto según tope de póliza",
    icon: Smile,
    colorBg: "bg-sky-50",
    colorText: "text-sky-700"
  },
  {
    id: "odontologia-limpieza",
    title: "Profilaxis y Limpieza Dental Anual",
    category: "dental",
    categoryLabel: "Salud Oral",
    eta: "Bajo agenda",
    description: "Limpieza profunda, remoción de placa y valoración clínica anual sin costo adicional en consultorios odontológicos.",
    coverage: "1 profilaxis anual por beneficiario",
    icon: ShieldCheck,
    colorBg: "bg-emerald-50",
    colorText: "text-emerald-700"
  }
];

export default function RappiMemberHub({ member, onLogout }: RappiMemberHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);

  const firstName = member.fullName.split(" ")[0] || "Afiliado";

  const filteredServices = SERVICES.filter((s) => {
    const matchesCat = selectedCategory === "all" || s.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenService = (service: ServiceItem) => {
    setSelectedService(service);
    setConfirmedSuccess(false);
  };

  const handleWhatsAppRequest = () => {
    if (!selectedService) return;
    const text = encodeURIComponent(
      `Hola Soluciones W, soy el afiliado ${member.fullName} (C.C. ${member.docNumber}, Contrato ${member.contractNumber}) y requiero solicitar la asistencia de *${selectedService.title}* en la dirección ${member.address || "Bogotá D.C."}.`
    );
    window.open(`https://wa.me/573134289397?text=${text}`, "_blank");
    setConfirmedSuccess(true);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-24">
      {/* 1. APP BAR LIMPIO & DIRECTO (Tipo SuperApp de Asistencias) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/images/logo-soluciones-w.png"
              alt="Soluciones W"
              className="h-9 w-auto object-contain"
            />
            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <span className="text-[10px] font-bold tracking-widest text-[#167394] uppercase block">
                Portal de Afiliados
              </span>
              <span className="text-xs font-semibold text-slate-700">
                Asistencias Inmediatas
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Botón SOS Urgencias */}
            <a
              href="tel:6017459000"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3 sm:px-4 py-2 rounded-md flex items-center gap-1.5 shadow-sm transition"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span>SOS (601) 745-9000</span>
            </a>

            {/* Perfil Afiliado */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs">
              <div className="w-7 h-7 rounded-md bg-[#063a57] text-white flex items-center justify-center font-bold text-xs">
                {firstName.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <span className="block font-semibold text-slate-900 leading-tight">
                  {firstName}
                </span>
                <span className="block text-[10px] text-emerald-700 font-mono leading-none">
                  Plan Activo ✓
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        
        {/* 2. GREETING & STATUS BANNER (Sencillo, directo y tranquilizador) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#167394]">
                CONTRATO {member.contractNumber}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                COBERTURA ACTIVA
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Hola, {firstName} 👋 ¿Qué asistencia necesitas hoy?
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {member.planName} · Tienes atención médica, asistencias de hogar y veterinaria disponibles sin copagos.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://wa.me/573134289397?text=Hola%20Soluciones%20W,%20necesito%20asesoría%20sobre%20mi%20plan."
              target="_blank"
              rel="noreferrer"
              className="bg-[#063a57] hover:bg-[#0a5278] text-white text-xs font-semibold px-4 py-2.5 rounded-md flex items-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Chatear con Central 24/7</span>
            </a>
          </div>
        </div>

        {/* 3. BUSCADOR RÁPIDO */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar asistencia (ej: médico, plomero, cerrajero, mascota, ambulancia...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:border-[#167394] focus:ring-1 focus:ring-[#167394]"
          />
        </div>

        {/* 4. CATEGORÍAS PRINCIPALES TIPO RAPPI (Salud, Hogar, Mascotas, Dental) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Categorías de Asistencia
            </h3>
            <span className="text-[11px] text-slate-400">
              {filteredServices.length} servicios disponibles
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
            {[
              { id: "all", label: "Todas las Opciones", icon: ShieldCheck, color: "text-slate-700 bg-slate-100" },
              { id: "salud", label: "Salud Familiar", icon: Stethoscope, color: "text-blue-700 bg-blue-50" },
              { id: "hogar", label: "Hogar & Técnicos", icon: Home, color: "text-cyan-700 bg-cyan-50" },
              { id: "mascotas", label: "Mascotas (Pet)", icon: Dog, color: "text-orange-700 bg-orange-50" },
              { id: "dental", label: "Odontología", icon: Smile, color: "text-emerald-700 bg-emerald-50" }
            ].map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                  className={`p-3.5 rounded-lg border text-left transition flex items-center gap-3 ${
                    isSelected
                      ? "bg-[#063a57] border-[#063a57] text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-white/15 text-white" : cat.color
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-xs font-bold leading-tight truncate">
                      {cat.label}
                    </span>
                    <span
                      className={`text-[10px] block mt-0.5 ${
                        isSelected ? "text-white/70" : "text-slate-400"
                      }`}
                    >
                      Ver servicios
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. GRID DE ASISTENCIAS TIPO RAPPI (1-Click Action Cards) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {selectedCategory === "all"
                ? "Todas las Asistencias de tu Plan"
                : `Opciones de ${selectedCategory.toUpperCase()}`}
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              Sin copagos · Cobertura 100%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredServices.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.id}
                  onClick={() => handleOpenService(service)}
                  className="bg-white rounded-lg border border-slate-200 hover:border-[#167394] hover:shadow-md transition p-4 sm:p-5 flex flex-col justify-between cursor-pointer group relative"
                >
                  {service.badge && (
                    <span className="absolute top-3 right-3 text-[9px] font-bold font-mono px-2 py-0.5 rounded-sm bg-blue-50 text-blue-700 border border-blue-200">
                      {service.badge}
                    </span>
                  )}

                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-11 h-11 rounded-md flex items-center justify-center shrink-0 ${service.colorBg} ${service.colorText} group-hover:scale-105 transition`}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="min-w-0 pr-8">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                          {service.categoryLabel}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#063a57] transition leading-snug truncate">
                          {service.title}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mt-1">
                      {service.description}
                    </p>

                    <div className="mt-3 py-2 px-2.5 bg-slate-50 border border-slate-100 rounded-md text-[11px] text-slate-600 flex items-center justify-between">
                      <span className="font-mono text-slate-500">⏱ Llegada: <strong>{service.eta}</strong></span>
                      <span className="text-emerald-700 font-bold">Sin copago</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-slate-500 truncate mr-2">
                      {service.coverage}
                    </span>
                    <span className="text-xs font-bold text-[#167394] group-hover:translate-x-1 transition flex items-center gap-1 shrink-0">
                      <span>Pedir</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* 6. MODAL DE SOLICITUD EXPRESS (Conexión Directa WhatsApp / PBX) */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl border border-slate-300 ring-1 ring-slate-900/10 relative animate-in fade-in zoom-in duration-200 overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="bg-[#063a57] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-white">
                  <selectedService.icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/70 uppercase tracking-wider block">
                    {selectedService.categoryLabel}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {selectedService.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedService(null)}
                className="text-white/70 hover:text-white p-1 rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                {selectedService.description}
              </p>

              {/* Detalle de cobertura */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-1.5 text-[11px] text-slate-700">
                <div className="flex justify-between">
                  <span><strong>Tiempo estimado de llegada:</strong></span>
                  <span className="font-mono font-bold text-[#063a57]">{selectedService.eta}</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Límite de cobertura:</strong></span>
                  <span className="font-semibold">{selectedService.coverage}</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>Dirección de despacho:</strong></span>
                  <span className="font-medium">{member.address || "Carrera 15 # 85-30, Bogotá"}</span>
                </div>
              </div>

              {confirmedSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">
                    Solicitud Enlazada con la Central
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Se abrió tu chat de WhatsApp oficial con los datos de tu contrato. La central y el asistente de Soluciones W coordinarán la asistencia de inmediato.
                  </p>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="mt-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-md text-xs"
                  >
                    Entendido / Cerrar
                  </button>
                </div>
              ) : (
                <div className="space-y-3 pt-1">
                  <p className="text-[11px] text-slate-500">
                    Elige cómo deseas solicitar esta asistencia ahora mismo:
                  </p>

                  {/* Opción 1: WhatsApp Inmediato */}
                  <button
                    onClick={handleWhatsAppRequest}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-md font-bold text-xs shadow flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Solicitar por WhatsApp (Despacho en 1-Click)</span>
                  </button>

                  {/* Opción 2: Llamada PBX 24/7 */}
                  <a
                    href="tel:6017459000"
                    className="w-full bg-[#063a57] hover:bg-[#0a5278] text-white p-3 rounded-md font-bold text-xs flex items-center justify-center gap-2 transition text-center"
                  >
                    <PhoneCall className="w-4 h-4 text-white" />
                    <span>Llamar a Central PBX: (601) 745-9000</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

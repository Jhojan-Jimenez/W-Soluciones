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
  Wrench,
  Key,
  Zap,
  LogOut,
  Shield,
  Activity,
  X,
  Search,
  CheckCircle2,
  Calendar,
  ExternalLink
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
  benefit: string;
  actionLabel: string;
  coverageDetail: string;
  icon: any;
  imageUrl: string;
  isUrgent?: boolean;
}

const URGENT_SERVICES: ServiceItem[] = [
  {
    id: "ambulancia",
    title: "Ambulancia Medicalizada de Urgencia",
    category: "salud",
    categoryLabel: "Emergencias",
    eta: "Despacho Inmediato · 15 a 20 min",
    benefit: "Unidad móvil TAB/TAM con personal paramédico ante crisis cardíacas, asfixia, traumas o pérdida de conciencia.",
    actionLabel: "Solicitar Ambulancia",
    coverageDetail: "Hasta 2 traslados anuales 100% cubiertos",
    icon: Ambulance,
    imageUrl: "https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80",
    isUrgent: true
  }
];

const ON_DEMAND_SERVICES: ServiceItem[] = [
  {
    id: "medico-domicilio",
    title: "Médico General en Casa",
    category: "salud",
    categoryLabel: "Salud Familiar",
    eta: "Llegada en 45 a 60 min",
    benefit: "Valoración presencial y fórmula médica para cuadros gripales, gastroenteritis y malestar general sin salir de casa.",
    actionLabel: "Solicitar Médico",
    coverageDetail: "Hasta 3 visitas al año sin copago",
    icon: Stethoscope,
    imageUrl: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "plomeria",
    title: "Plomería por Fuga o Inundación",
    category: "hogar",
    categoryLabel: "Asistencia Hogar",
    eta: "Llegada en aprox. 45 min",
    benefit: "Técnico en sitio para reparar roturas imprevistas de tuberías, filtraciones mayores y atascos en la vivienda.",
    actionLabel: "Solicitar Plomero",
    coverageDetail: "Mano de obra y materiales cubiertos",
    icon: Wrench,
    imageUrl: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "cerrajeria",
    title: "Cerrajería en Puerta Principal",
    category: "hogar",
    categoryLabel: "Asistencia Hogar",
    eta: "Llegada en aprox. 35 min",
    benefit: "Apertura de emergencia por llaves olvidadas adentro, pérdida, robo o cerradura bloqueada.",
    actionLabel: "Solicitar Cerrajero",
    coverageDetail: "Hasta $150.000 COP cubiertos por servicio",
    icon: Key,
    imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "electricidad",
    title: "Electricidad por Cortocircuito",
    category: "hogar",
    categoryLabel: "Asistencia Hogar",
    eta: "Llegada en aprox. 45 min",
    benefit: "Restablecimiento urgente de suministro eléctrico por averías de breakers o fallas generales en el inmueble.",
    actionLabel: "Solicitar Electricista",
    coverageDetail: "Hasta $200.000 COP cubiertos por evento",
    icon: Zap,
    imageUrl: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mascota-urgencia",
    title: "Urgencia Veterinaria para Mascotas",
    category: "mascotas",
    categoryLabel: "Mascotas",
    eta: "Llegada en 45 a 60 min",
    benefit: "Atención médica presencial para perros y gatos ante accidentes, heridas agudas o intoxicación repentina.",
    actionLabel: "Pedir Veterinario",
    coverageDetail: "Hasta $200.000 COP por evento (2 al año)",
    icon: Dog,
    imageUrl: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80"
  }
];

const SCHEDULED_SERVICES: ServiceItem[] = [
  {
    id: "telemedicina",
    title: "Telemedicina 24/7 con Fórmula Médica",
    category: "salud",
    categoryLabel: "Salud Virtual",
    eta: "Atención Inmediata · 24/7",
    benefit: "Videoconsulta sin esperas con médico general y fórmula digital emitida con firma oficial a tu celular.",
    actionLabel: "Iniciar Consulta",
    coverageDetail: "Consultas ilimitadas sin costo adicional",
    icon: Activity,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "odontologia-urgencia",
    title: "Urgencia Odontológica",
    category: "dental",
    categoryLabel: "Salud Oral",
    eta: "Red aliada inmediata",
    benefit: "Alivio clínico inmediato del dolor de muela agudo, traumatismos dentales o infecciones en consultorio aliado.",
    actionLabel: "Ubicar Consultorio",
    coverageDetail: "100% cubierto según términos de póliza",
    icon: Smile,
    imageUrl: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "odontologia-limpieza",
    title: "Profilaxis y Limpieza Dental Anual",
    category: "dental",
    categoryLabel: "Salud Oral",
    eta: "Servicio preventivo anual",
    benefit: "Limpieza profunda, remoción de placa y valoración diagnóstica sin costo extra en centros odontológicos aliados.",
    actionLabel: "Agendar Limpieza",
    coverageDetail: "1 profilaxis anual por beneficiario",
    icon: Calendar,
    imageUrl: "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=800&q=80"
  },
  {
    id: "mascota-vacuna",
    title: "Vacunación o Desparasitación Pet",
    category: "mascotas",
    categoryLabel: "Mascotas",
    eta: "Servicio preventivo anual",
    benefit: "Procedimiento preventivo anual incluido para tu perro o gato registrado: vacuna o desparasitación con carnet clínico.",
    actionLabel: "Agendar Vacuna",
    coverageDetail: "1 procedimiento anual incluido sin costo",
    icon: Shield,
    imageUrl: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=800&q=80"
  }
];

export default function RappiMemberHub({ member, onLogout }: RappiMemberHubProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [confirmedSuccess, setConfirmedSuccess] = useState(false);

  const firstName = member.fullName.split(" ")[0] || "Afiliado";

  // Filter helper
  const filterList = (list: ServiceItem[]) => {
    return list.filter((s) => {
      const matchesCat = selectedCategory === "all" || s.category === selectedCategory;
      const matchesSearch =
        searchQuery === "" ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.benefit.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  };

  const visibleOnDemand = filterList(ON_DEMAND_SERVICES);
  const visibleScheduled = filterList(SCHEDULED_SERVICES);

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
      {/* 1. HEADER INSTITUCIONAL LIMPIO */}
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
                Soluciones W
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Llamada Directa Emergencias */}
            <a
              href="tel:6017459000"
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-md flex items-center gap-1.5 shadow-sm transition"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span>Emergencias: (601) 745-9000</span>
            </a>

            {/* Identificación de Usuario */}
            <div className="hidden md:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs">
              <span className="font-semibold text-slate-800">{member.fullName}</span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-[11px] font-mono text-emerald-700 font-semibold">Póliza Activa</span>
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
        
        {/* 2. ESTADO REAL DEL USUARIO (Sin clichés, sobrio y claro) */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono font-bold text-[#167394] uppercase tracking-wider">
                CONTRATO {member.contractNumber}
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-xs text-slate-600 font-medium">
                {member.planName}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Bienvenido, {firstName}. Tienes 10 asistencias activas en tu cobertura.
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Todas las coberturas de tu plan familiar están vigentes con atención 100% cubierta sin copagos ni cuotas adicionales.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://wa.me/573134289397?text=Hola%20Soluciones%20W,%20necesito%20coordinar%20una%20asistencia."
              target="_blank"
              rel="noreferrer"
              className="bg-[#063a57] hover:bg-[#0a5278] text-white text-xs font-semibold px-4 py-2.5 rounded-md flex items-center gap-2 transition"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>Central Médica WhatsApp</span>
            </a>
          </div>
        </div>

        {/* 3. BLOQUE PRIORITARIO DE URGENCIAS MÉDICAS (Alta Jerarquía para Emergencias Vitales) */}
        <div className="bg-white border-2 border-red-500/80 rounded-lg p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-md bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Ambulance className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Ambulancia & Urgencia Vital
                  </h3>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-red-100 text-red-800">
                    Prioridad Máxima 24/7
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 max-w-2xl">
                  Despacho prioritario de ambulancia básica o medicalizada tipo TAB/TAM con personal paramédico ante crisis cardíacas, dolor opresivo, traumatismos severos o pérdida de conciencia.
                </p>
                <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                  Tiempo estimado: <strong>15 a 20 minutos</strong> · 2 traslados anuales 100% cubiertos
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 shrink-0">
              <button
                onClick={() => handleOpenService(URGENT_SERVICES[0])}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-5 py-3 rounded-md transition shadow flex items-center justify-center gap-2"
              >
                <Ambulance className="w-4 h-4 text-white" />
                <span>Solicitar Ambulancia Ahora</span>
              </button>
              <a
                href="tel:6017459000"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-3 rounded-md transition border border-slate-300 flex items-center justify-center gap-1.5"
              >
                <PhoneCall className="w-4 h-4 text-slate-700" />
                <span>PBX (601) 745-9000</span>
              </a>
            </div>
          </div>
        </div>

        {/* 4. BUSCADOR LIMPIO */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Busca un servicio, especialidad o síntoma..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-lg pl-11 pr-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:border-[#167394]"
          />
        </div>

        {/* 5. FILTROS RÁPIDOS POR CATEGORÍA */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { id: "all", label: "Todas las Asistencias" },
            { id: "salud", label: "Salud Familiar" },
            { id: "hogar", label: "Hogar & Técnicos" },
            { id: "mascotas", label: "Mascotas (Pet)" },
            { id: "dental", label: "Odontología" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition border ${
                selectedCategory === cat.id
                  ? "bg-[#063a57] text-white border-[#063a57]"
                  : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* 6. SECCIÓN: ASISTENCIAS INMEDIATAS A DOMICILIO (45-60 MIN) */}
        {visibleOnDemand.length > 0 && (
          <div className="space-y-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Asistencias Domiciliarias Inmediatas
              </h3>
              <p className="text-xs text-slate-500">
                Especialistas y técnicos con desplazamiento directo a tu residencia en menos de 60 minutos.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {visibleOnDemand.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between transition group"
                  >
                    {/* Clean Service Image Banner */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    {/* Content Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Categoría y Tiempo de Arribo integrados de forma limpia */}
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-semibold text-[#167394] flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-[#167394]" />
                            {service.categoryLabel}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {service.eta}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#063a57] transition">
                          {service.title}
                        </h4>
                        
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {service.benefit}
                        </p>

                        {/* Detalle de cobertura y $0 Copago */}
                        <div className="mt-3.5 py-1.5 px-2.5 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-between text-[11px] text-slate-600">
                          <span className="truncate">{service.coverageDetail}</span>
                          <span className="font-bold text-emerald-700 shrink-0 ml-2">$0 Copago</span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="mt-5 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleOpenService(service)}
                          className="w-full bg-[#063a57] hover:bg-[#0a5278] text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span>{service.actionLabel}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. SECCIÓN: CONSULTAS VIRTUALES Y SERVICIOS PROGRAMADOS */}
        {visibleScheduled.length > 0 && (
          <div className="space-y-3 pt-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Servicios Virtuales & Cuidado Programado
              </h3>
              <p className="text-xs text-slate-500">
                Consultas inmediatas por telemedicina y procedimientos preventivos incluidos en tu plan.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
              {visibleScheduled.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 shadow-xs hover:shadow-md overflow-hidden flex flex-col justify-between transition group"
                  >
                    {/* Clean Service Image Banner */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="font-semibold text-[#167394] flex items-center gap-1.5">
                            <Icon className="w-3.5 h-3.5 text-[#167394]" />
                            {service.categoryLabel}
                          </span>
                          <span className="font-mono text-[11px] text-slate-500 flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {service.eta}
                          </span>
                        </div>

                        <h4 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#063a57] transition">
                          {service.title}
                        </h4>
                        
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {service.benefit}
                        </p>

                        <div className="mt-3.5 py-1.5 px-2.5 bg-slate-50 border border-slate-100 rounded-md flex items-center justify-between text-[11px] text-slate-600">
                          <span className="truncate">{service.coverageDetail}</span>
                          <span className="font-bold text-emerald-700 shrink-0 ml-2">100% Incluido</span>
                        </div>
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-100">
                        <button
                          onClick={() => handleOpenService(service)}
                          className="w-full bg-[#167394] hover:bg-[#0a5278] text-white font-semibold text-xs py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <span>{service.actionLabel}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      {/* 8. MODAL DE SOLICITUD / DESPACHO LIMPIO */}
      {selectedService && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl border border-slate-300 ring-1 ring-slate-900/10 relative animate-in fade-in zoom-in duration-200 overflow-hidden text-slate-800">
            {/* Modal Service Image Preview */}
            <div className="relative h-36 w-full overflow-hidden bg-slate-100">
              <img
                src={selectedService.imageUrl}
                alt={selectedService.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-black/30"></div>
              
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-3 right-3 text-white/80 hover:text-white bg-black/40 hover:bg-black/60 p-1.5 rounded-full transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <div>
                  <span className="text-[10px] font-mono text-cyan-200 uppercase tracking-wider block">
                    {selectedService.categoryLabel}
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {selectedService.title}
                  </h3>
                </div>
                <span className="bg-emerald-600 font-bold px-2 py-0.5 rounded text-[10px] shadow-xs shrink-0">
                  $0 Copago
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                {selectedService.benefit}
              </p>

              {/* Detalle formal del evento */}
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-2 text-[11px] text-slate-700">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tiempo de arribo estimado:</span>
                  <span className="font-mono font-bold text-[#063a57]">{selectedService.eta}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Tope de cobertura:</span>
                  <span className="font-semibold text-slate-800">{selectedService.coverageDetail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dirección registrada:</span>
                  <span className="font-medium text-slate-800">{member.address || "Carrera 15 # 85-30, Bogotá"}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200">
                  <span className="text-slate-500">Copago del afiliado:</span>
                  <span className="font-bold text-emerald-700">$0 COP (100% Cubierto)</span>
                </div>
              </div>

              {confirmedSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-md text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-bold text-emerald-900">
                    Solicitud Enlazada con la Central
                  </h4>
                  <p className="text-xs text-emerald-800">
                    Se abrió tu chat de WhatsApp oficial con los datos de tu contrato. La central de Soluciones W coordinará el despacho de inmediato.
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
                    Selecciona cómo deseas coordinar esta asistencia:
                  </p>

                  {/* Opción 1: WhatsApp Inmediato */}
                  <button
                    onClick={handleWhatsAppRequest}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-md font-bold text-xs shadow flex items-center justify-center gap-2 transition"
                  >
                    <MessageCircle className="w-4 h-4 text-white" />
                    <span>Confirmar Despacho por WhatsApp (1-Click)</span>
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

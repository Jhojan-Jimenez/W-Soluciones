"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Ambulance,
  Dog,
  Home,
  Smile,
  ShieldCheck,
  PhoneCall,
  MessageCircle,
  Download,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  Wrench,
  Key,
  Zap,
  ChevronRight,
  LogOut,
  User,
  QrCode,
  Shield,
  Activity,
  FileText,
  X,
  Search,
  ClipboardList,
  Users,
  CreditCard,
  ExternalLink,
  ChevronDown
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

type TabType = "poliza" | "asistencias" | "historial" | "beneficiarios";
type ServiceCategory = "all" | "salud" | "hogar" | "mascotas" | "dental";

interface Beneficiary {
  id: string;
  name: string;
  docNumber: string;
  relationship: string;
  category: "humano" | "mascota";
}

const DEFAULT_BENEFICIARIES: Beneficiary[] = [
  {
    id: "ben-1",
    name: "Carlos Andrés Villamil",
    docNumber: "C.C. 1018492031",
    relationship: "Titular del Plan",
    category: "humano"
  },
  {
    id: "ben-2",
    name: "Marcela Ospina Gómez",
    docNumber: "C.C. 1020493812",
    relationship: "Cónyuge",
    category: "humano"
  },
  {
    id: "ben-3",
    name: "Mateo Villamil Ospina",
    docNumber: "T.I. 1109283741",
    relationship: "Hijo",
    category: "humano"
  },
  {
    id: "ben-4",
    name: "Max",
    docNumber: "Chip #982009124",
    relationship: "Mascota (Golden Retriever)",
    category: "mascota"
  },
  {
    id: "ben-5",
    name: "Luna",
    docNumber: "Chip #982009125",
    relationship: "Mascota (Gato Criollo)",
    category: "mascota"
  }
];

interface PastService {
  id: string;
  date: string;
  service: string;
  specialist: string;
  status: "Completado" | "En Curso" | "Cancelado";
  beneficiary: string;
}

const PAST_SERVICES: PastService[] = [
  {
    id: "RAD-2026-9842",
    date: "Hoy · 10:14 AM",
    service: "Médico General a Domicilio",
    specialist: "Dra. Natalia Gómez (Reg. 49102)",
    status: "En Curso",
    beneficiary: "Carlos Andrés Villamil"
  },
  {
    id: "RAD-2026-8104",
    date: "14 Ago 2026 · 04:30 PM",
    service: "Cerrajería de Emergencia (Apertura Chapa)",
    specialist: "Técnico Javier Díaz",
    status: "Completado",
    beneficiary: "Carlos Andrés Villamil"
  },
  {
    id: "RAD-2026-6219",
    date: "02 Jun 2026 · 11:15 AM",
    service: "Telemedicina Pediátrica 24/7",
    specialist: "Dr. Roberto Mendoza",
    status: "Completado",
    beneficiary: "Mateo Villamil Ospina"
  }
];

export default function RappiMemberHub({ member, onLogout }: RappiMemberHubProps) {
  const [activeTab, setActiveTab] = useState<TabType>("asistencias");
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCarnetHolder, setSelectedCarnetHolder] = useState<Beneficiary>(DEFAULT_BENEFICIARIES[0]);

  // Active Live Dispatch Tracker
  const [activeRequest, setActiveRequest] = useState<{
    id: string;
    type: string;
    specialist: string;
    etaMinutes: number;
    currentStep: number; // 1: Solicitud, 2: Asignado, 3: En ruta, 4: Llegada
    phone: string;
    address: string;
    requestedAt: string;
  } | null>({
    id: "RAD-2026-9842",
    type: "Médico General a Domicilio",
    specialist: "Dra. Natalia Gómez · Registro Médico 49102 (Móvil Sanitario W-12)",
    etaMinutes: 42,
    currentStep: 3,
    phone: "3134289397",
    address: member.address || "Carrera 15 # 85-30, Bogotá D.C.",
    requestedAt: "10:14 AM"
  });

  const [modalService, setModalService] = useState<{
    title: string;
    category: string;
    description: string;
    icon: any;
    limit: string;
    eta: string;
  } | null>(null);

  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [sosActivated, setSosActivated] = useState(false);

  const handleRequestService = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setActiveRequest({
        id: "RAD-2026-" + Math.floor(1000 + Math.random() * 9000),
        type: modalService?.title || "Asistencia Express",
        specialist: "Central de Despacho Soluciones W · Unidad Móvil Asignada",
        etaMinutes: 30,
        currentStep: 2,
        phone: "3134289397",
        address: member.address || "Carrera 15 # 85-30, Bogotá D.C.",
        requestedAt: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
      });
      setRequestSubmitted(false);
      setModalService(null);
    }, 1000);
  };

  const handleSosTrigger = () => {
    setSosActivated(true);
    setTimeout(() => {
      setActiveRequest({
        id: "RAD-EMERGENCIA-911",
        type: "Ambulancia Medicalizada de Urgencia (CÓDIGO ROJO)",
        specialist: "Tripulación Paramédica TAM · Móvil 04",
        etaMinutes: 14,
        currentStep: 3,
        phone: "6017459000",
        address: member.address || "Carrera 15 # 85-30, Bogotá D.C.",
        requestedAt: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
      });
      setSosActivated(false);
    }, 1400);
  };

  const ALL_SERVICES = [
    {
      id: "med-domicilio",
      title: "Médico General a Domicilio",
      category: "salud",
      categoryLabel: "Salud Familiar",
      eta: "45 a 60 min",
      description: "Valoración presencial en tu residencia para cuadros agudos, gripes, gastroenteritis y emisión de fórmula médica oficial.",
      limit: "Hasta $250.000 COP cubiertos por consulta (3 al año)",
      icon: Stethoscope
    },
    {
      id: "telemedicina",
      title: "Telemedicina 24/7 con Fórmula Médica",
      category: "salud",
      categoryLabel: "Salud Virtual",
      eta: "Inmediato · 0 min",
      description: "Videoconsulta instantánea con médicos titulados y emisión inmediata de fórmula médica digital con firma oficial.",
      limit: "Consultas ilimitadas sin copago",
      icon: Activity
    },
    {
      id: "ambulancia",
      title: "Ambulancia & Traslado Asistido",
      category: "salud",
      categoryLabel: "Emergencias",
      eta: "15 a 25 min",
      description: "Despacho prioritario de ambulancia básica o medicalizada tipo TAB/TAM con personal paramédico para estabilización y traslado.",
      limit: "Hasta 2 traslados anuales 100% cubiertos",
      icon: Ambulance
    },
    {
      id: "mascotas-urgencia",
      title: "Atención Veterinaria de Urgencia (Pet Care)",
      category: "mascotas",
      categoryLabel: "Mascotas",
      eta: "45 a 60 min",
      description: "Atención médica presencial para perros y gatos ante accidentes, heridas o intoxicaciones repentinas en clínica aliada o domicilio.",
      limit: "Hasta $200.000 COP por evento (2 al año)",
      icon: Dog
    },
    {
      id: "mascotas-vacuna",
      title: "Vacunación o Desparasitación Anual Pet",
      category: "mascotas",
      categoryLabel: "Mascotas",
      eta: "Bajo agenda",
      description: "Procedimiento preventivo anual incluido para 1 mascota registrada: vacuna antirrábica o desparasitación con carnet clínico.",
      limit: "1 procedimiento anual sin costo",
      icon: Shield
    },
    {
      id: "plomeria",
      title: "Plomería & Fugas de Emergencia",
      category: "hogar",
      categoryLabel: "Asistencia Hogar",
      eta: "Aprox. 45 min",
      description: "Técnico certificado para reparación de roturas de tuberías, inundaciones imprevistas o filtraciones mayores en la vivienda.",
      limit: "Mano de obra y repuestos básicos hasta $220.000 COP",
      icon: Wrench
    },
    {
      id: "cerrajeria",
      title: "Cerrajería Urgente en Puerta Principal",
      category: "hogar",
      categoryLabel: "Asistencia Hogar",
      eta: "Aprox. 35 min",
      description: "Apertura de emergencia por robo, pérdida o atasco de llaves en la puerta de acceso al domicilio.",
      limit: "Hasta $150.000 COP por servicio",
      icon: Key
    },
    {
      id: "electricidad",
      title: "Electricidad Express por Cortocircuito",
      category: "hogar",
      categoryLabel: "Asistencia Hogar",
      eta: "Aprox. 45 min",
      description: "Restablecimiento de suministro eléctrico por sobrecargas, averías de breakers o fallas totales en el inmueble.",
      limit: "Hasta $200.000 COP por evento",
      icon: Zap
    },
    {
      id: "odontologia-urgencia",
      title: "Urgencia Odontológica por Dolor Agudo",
      category: "dental",
      categoryLabel: "Salud Oral",
      eta: "Red aliada",
      description: "Atención clínica inmediata para alivio del dolor agudo, trauma dental o infecciones orales en consultorio de la red.",
      limit: "100% cubierto según tope de póliza",
      icon: Smile
    },
    {
      id: "odontologia-limpieza",
      title: "Profilaxis y Limpieza Dental Anual",
      category: "dental",
      categoryLabel: "Salud Oral",
      eta: "Bajo agenda",
      description: "Limpieza profunda y valoración odontológica preventiva sin costo extra en centros odontológicos aliados.",
      limit: "1 profilaxis por beneficiario al año",
      icon: ShieldCheck
    }
  ];

  const filteredServices = ALL_SERVICES.filter((s) => {
    const matchesCategory = activeCategory === "all" || s.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-24">
      {/* 1. TOP INSTITUTIONAL APP BAR */}
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
                Gestión de Póliza & Despacho Asistencial
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* SOS Urgencias — ÚNICO elemento con alarma roja primaria */}
            <button
              onClick={handleSosTrigger}
              disabled={sosActivated}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-3.5 py-2 rounded-md flex items-center gap-1.5 shadow-sm transition"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span>{sosActivated ? "Localizando..." : "SOS Urgencias"}</span>
            </button>

            {/* Member Profile Block */}
            <div className="hidden md:flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs">
              <div className="w-7 h-7 rounded-md bg-[#063a57] text-white flex items-center justify-center font-bold text-xs">
                {member.fullName.charAt(0)}
              </div>
              <div className="text-left">
                <span className="block font-semibold text-slate-900 leading-tight">
                  {member.fullName}
                </span>
                <span className="block text-[10px] font-mono text-emerald-700 leading-none">
                  Póliza {member.contractNumber} · Activa
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

        {/* 2. SUB-NAVIGATION TABS (Dashboard de Operaciones) */}
        <div className="bg-slate-50 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 sm:gap-4 overflow-x-auto">
            {[
              { id: "asistencias", label: "Todas las Asistencias (1-Click)", icon: Stethoscope },
              { id: "poliza", label: "Mi Póliza & Carnet", icon: ShieldCheck },
              { id: "historial", label: "Historial de Servicios", icon: ClipboardList },
              { id: "beneficiarios", label: "Beneficiarios Cubiertos", icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`py-3 px-3 text-xs font-semibold flex items-center gap-2 border-b-2 whitespace-nowrap transition ${
                    isActive
                      ? "border-[#167394] text-[#0a5278] font-bold bg-white"
                      : "border-transparent text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#167394]" : "text-slate-400"}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        
        {/* COMPONENTE DE SEGUIMIENTO EN CURSO (Tratamiento de Despacho Institucional, NO estilo delivery) */}
        {activeRequest && (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                      DESPACHO ACTIVO · {activeRequest.id}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-emerald-50 text-emerald-700 border border-emerald-200">
                      EN CURSO
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-0.5">
                    {activeRequest.type}
                  </h4>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/57${activeRequest.phone}?text=Hola,%20solicito%20actualizacion%20del%20servicio%20${activeRequest.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition border border-slate-200"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Central Médica</span>
                </a>
                <button
                  onClick={() => setActiveRequest(null)}
                  className="text-slate-400 hover:text-slate-600 text-xs px-2 py-1.5"
                  title="Ocultar seguimiento"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Stepper horizontal de despacho */}
            <div className="py-2">
              <div className="grid grid-cols-4 gap-2 text-center relative">
                {[
                  { step: 1, title: "1. Solicitud Recibida", time: activeRequest.requestedAt },
                  { step: 2, title: "2. Profesional Asignado", time: "Completado" },
                  { step: 3, title: "3. En Desplazamiento", time: `ETA: ~${activeRequest.etaMinutes} min` },
                  { step: 4, title: "4. Llegada y Atención", time: "Pendiente" }
                ].map((s) => {
                  const isDone = s.step < activeRequest.currentStep;
                  const isCurrent = s.step === activeRequest.currentStep;
                  return (
                    <div key={s.step} className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 transition ${
                          isDone
                            ? "bg-[#063a57] text-white"
                            : isCurrent
                            ? "bg-[#167394] text-white ring-4 ring-[#167394]/20 animate-pulse"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                        }`}
                      >
                        {isDone ? "✓" : s.step}
                      </div>
                      <span className={`text-[11px] font-semibold ${isCurrent ? "text-[#0a5278]" : "text-slate-700"}`}>
                        {s.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {s.time}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Metadata Footer */}
            <div className="bg-slate-50 border border-slate-100 rounded-md p-3 text-xs text-slate-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#167394] shrink-0" />
                <span>Destino: <strong>{activeRequest.address}</strong></span>
              </div>
              <div className="text-[11px] text-slate-500">
                Asignado: <span className="font-medium text-slate-700">{activeRequest.specialist}</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 1: MI PÓLIZA & CARNET DIGITAL */}
        {/* ============================================================== */}
        {activeTab === "poliza" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Carnet Digital Fiduciario (Estilo Documento / Credencial Formal) */}
              <div className="lg:col-span-7 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Carnet Header */}
                  <div className="bg-[#063a57] text-white px-6 py-4 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono tracking-widest text-slate-300 uppercase block">
                        REPÚBLICA DE COLOMBIA · SISTEMA INTEGRAL
                      </span>
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                        Carnet Digital de Afiliación
                      </h3>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      ACTIVO & VIGENTE
                    </span>
                  </div>

                  {/* Carnet Body */}
                  <div className="p-6 space-y-4">
                    {/* Selector de Beneficiario para el carnet */}
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                      <span className="font-semibold text-slate-600">Ver credencial para:</span>
                      <select
                        value={selectedCarnetHolder.id}
                        onChange={(e) => {
                          const found = DEFAULT_BENEFICIARIES.find((b) => b.id === e.target.value);
                          if (found) setSelectedCarnetHolder(found);
                        }}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2.5 py-1 font-semibold focus:outline-none focus:border-[#167394]"
                      >
                        {DEFAULT_BENEFICIARIES.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name} ({b.relationship})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                      <div className="sm:col-span-8 space-y-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-slate-400 block font-medium">
                            Beneficiario Amparado
                          </span>
                          <h4 className="text-lg font-bold text-slate-900 leading-tight">
                            {selectedCarnetHolder.name}
                          </h4>
                          <p className="text-xs font-mono text-slate-600 mt-0.5">
                            {selectedCarnetHolder.docNumber} · {selectedCarnetHolder.relationship}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                          <div className="bg-slate-50 border border-slate-100 rounded-md p-2">
                            <span className="text-[10px] text-slate-400 block font-mono">PÓLIZA / CONTRATO</span>
                            <span className="font-bold text-slate-800 font-mono">{member.contractNumber}</span>
                          </div>
                          <div className="bg-slate-50 border border-slate-100 rounded-md p-2">
                            <span className="text-[10px] text-slate-400 block font-mono">VIGENCIA OFICIAL</span>
                            <span className="font-bold text-slate-800 font-mono">{member.validUntil}</span>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>Plan Contratado: <strong>{member.planName}</strong></span>
                        </div>
                      </div>

                      {/* QR Formal */}
                      <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 border border-slate-200 rounded-md text-center">
                        <div className="bg-white p-2 rounded-sm border border-slate-200">
                          <QrCode className="w-20 h-20 text-slate-800" />
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 mt-1">
                          TOKEN: {member.contractNumber}-VAL
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Carnet Footer Actions */}
                <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Válido a nivel nacional sin copagos</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => alert(`Descargando Certificado Oficial de Afiliación PDF (Contrato ${member.contractNumber})...`)}
                      className="text-[#167394] hover:text-[#0a5278] font-bold flex items-center gap-1 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Descargar Certificado PDF</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Métricas de Uso con Claridad de Póliza (Consumo y Cupos) */}
              <div className="lg:col-span-5 bg-white rounded-lg border border-slate-200 shadow-sm p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Consumo de Cupos Anuales
                      </h4>
                      <p className="text-[11px] text-slate-500">Periodo 2026 · Renovación sin penalidad</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-sm">
                      100% DISPONIBLE
                    </span>
                  </div>

                  <div className="space-y-4 mt-5">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Médico General a Domicilio</span>
                        <span className="font-mono text-xs font-bold text-slate-800">0 / 3 consumidos</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-sm overflow-hidden">
                        <div className="bg-[#167394] h-full" style={{ width: "100%" }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">3 visitas presenciales disponibles sin copago</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Auxilio Hogar (Plomería / Cerrajería)</span>
                        <span className="font-mono text-xs font-bold text-slate-800">0 / 2 consumidos</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-sm overflow-hidden">
                        <div className="bg-[#167394] h-full" style={{ width: "100%" }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Hasta $220.000 COP cubiertos por evento</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Urgencias Veterinarias Mascotas</span>
                        <span className="font-mono text-xs font-bold text-slate-800">0 / 2 consumidos</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-sm overflow-hidden">
                        <div className="bg-[#167394] h-full" style={{ width: "100%" }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Cubre a perros y gatos inscritos</span>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold text-slate-700">Telemedicina 24/7 con Receta Digital</span>
                        <span className="font-mono text-xs font-bold text-emerald-700">ILIMITADO</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-sm overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: "100%" }}></div>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">Sin límite de consultas ni cuotas moderadoras</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <a
                    href="https://wa.me/573203282014?text=Hola,%20solicito%20el%20documento%20de%20términos%20y%20deducibles%20de%20mi%20póliza."
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#167394] hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Ver detalle de cobertura y deducibles</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <button
                    onClick={() => alert("Generando Certificado Tributario y Paz y Salvo 2026...")}
                    className="text-slate-600 hover:text-slate-900 font-semibold"
                  >
                    Certificado Tributario
                  </button>
                </div>
              </div>

            </div>

            {/* Resumen Administrativo de la Póliza */}
            <div className="bg-white rounded-lg border border-slate-200 p-5 text-xs text-slate-700">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">
                Información del Contrato & Facturación
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <span className="text-slate-400 block font-mono text-[10px]">TITULAR PRINCIPAL</span>
                  <span className="font-semibold text-slate-800">{member.fullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px]">DOCUMENTO DE IDENTIDAD</span>
                  <span className="font-mono font-semibold text-slate-800">C.C. {member.docNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px]">MÉTODO DE PAGO</span>
                  <span className="font-semibold text-slate-800">Wompi · Débito Automático Mensual</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-mono text-[10px]">DIRECCIÓN REGISTRADA</span>
                  <span className="font-semibold text-slate-800">{member.address || "Carrera 15 # 85-30, Bogotá"}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: CATÁLOGO DE ASISTENCIAS (Búsqueda y Despacho) */}
        {/* ============================================================== */}
        {activeTab === "asistencias" && (
          <div className="space-y-6">
            {/* Quick Policy Strip */}
            <div className="bg-white border border-slate-200 rounded-lg p-3.5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#063a57] text-white flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="font-bold text-slate-900 block leading-tight">
                    {member.planName} · Cobertura 100% Activa
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono">
                    Póliza {member.contractNumber} · Titular: {member.fullName} · 3 de 3 cupos médicos disponibles
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("poliza")}
                className="text-xs font-semibold text-[#167394] hover:text-[#0a5278] flex items-center gap-1 self-start sm:self-auto"
              >
                <span>Ver Carnet Digital & Coberturas</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search Bar & Categories Header */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="¿Qué necesitas resolver hoy? (ej. médico a domicilio, fuga de agua, cerrajería, urgencia mascota...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md pl-10 pr-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#167394] focus:bg-white transition"
                />
              </div>

              {/* Categorías limpias sin saturación */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {[
                  { id: "all", label: "Todas las Asistencias" },
                  { id: "salud", label: "Salud & Urgencias Médicas" },
                  { id: "hogar", label: "Mantenimiento & Hogar" },
                  { id: "mascotas", label: "Mascotas (Pet Care)" },
                  { id: "dental", label: "Odontología Preventiva" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id as ServiceCategory)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition border ${
                      activeCategory === cat.id
                        ? "bg-[#063a57] text-white border-[#063a57]"
                        : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Grid de Servicios (Sober, Structured, Institutional Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredServices.map((service) => {
                const Icon = service.icon;
                return (
                  <div
                    key={service.id}
                    onClick={() => setModalService(service)}
                    className="bg-white rounded-lg border border-slate-200 hover:border-[#167394] hover:shadow-md transition p-5 flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-md bg-slate-50 border border-slate-100 flex items-center justify-center text-[#063a57] group-hover:bg-[#e8f4f8] transition">
                          <Icon className="w-5 h-5 text-[#167394]" />
                        </div>
                        {/* Metadato tipográfico discreto en lugar de pill de color chillón */}
                        <span className="text-[11px] font-mono text-slate-500">
                          ⏱ {service.eta}
                        </span>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#167394] block mb-1">
                        {service.categoryLabel}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-[#063a57] transition leading-snug">
                        {service.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] text-slate-600 font-medium">
                        {service.limit}
                      </span>
                      <span className="text-xs font-bold text-[#167394] group-hover:translate-x-0.5 transition flex items-center gap-1">
                        <span>Solicitar</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: HISTORIAL DE SERVICIOS & RECLAMOS */}
        {/* ============================================================== */}
        {activeTab === "historial" && (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Historial de Asistencias & Reclamos
                </h4>
                <p className="text-xs text-slate-500">Registro cronológico de servicios despachados a tu domicilio</p>
              </div>
              <button
                onClick={() => alert("Descargando historial completo en formato Excel / PDF...")}
                className="text-xs font-semibold text-[#167394] hover:underline flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar Historial</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-mono text-[11px] border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">RADICADO</th>
                    <th className="py-2.5 px-3">FECHA Y HORA</th>
                    <th className="py-2.5 px-3">SERVICIO</th>
                    <th className="py-2.5 px-3">BENEFICIARIO</th>
                    <th className="py-2.5 px-3">ESPECIALISTA / MÓVIL</th>
                    <th className="py-2.5 px-3">ESTADO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PAST_SERVICES.map((serv) => (
                    <tr key={serv.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-3 font-mono font-bold text-slate-700">{serv.id}</td>
                      <td className="py-3 px-3 text-slate-600 font-mono">{serv.date}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{serv.service}</td>
                      <td className="py-3 px-3 text-slate-700">{serv.beneficiary}</td>
                      <td className="py-3 px-3 text-slate-600">{serv.specialist}</td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-sm text-[10px] font-bold ${
                            serv.status === "Completado"
                              ? "bg-slate-100 text-slate-700"
                              : serv.status === "En Curso"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {serv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: GESTIÓN DE BENEFICIARIOS CUBIERTOS */}
        {/* ============================================================== */}
        {activeTab === "beneficiarios" && (
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Grupo Familiar & Mascotas Amparadas
                </h4>
                <p className="text-xs text-slate-500">
                  Tu {member.planName} ampara al titular + hasta 4 familiares + 2 mascotas sin costo adicional.
                </p>
              </div>
              <button
                onClick={() => alert("Para agregar un nuevo beneficiario, comunícate con la línea de soporte o WhatsApp oficial.")}
                className="bg-[#063a57] hover:bg-[#0a5278] text-white text-xs font-semibold px-3.5 py-2 rounded-md transition"
              >
                + Registrar Nuevo Beneficiario
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEFAULT_BENEFICIARIES.map((b) => (
                <div key={b.id} className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#063a57] shrink-0">
                    {b.category === "mascota" ? <Dog className="w-5 h-5 text-amber-600" /> : <User className="w-5 h-5 text-[#167394]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      {b.relationship}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {b.name}
                    </h5>
                    <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                      {b.docNumber}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm border border-emerald-200">
                      Cobertura Activa ✓
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ============================================================== */}
      {/* MODAL INSTITUCIONAL: SOLICITUD DE ASISTENCIA */}
      {/* ============================================================== */}
      {modalService && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-2xl border border-slate-300 ring-1 ring-slate-900/10 relative animate-in fade-in zoom-in duration-200 overflow-hidden text-slate-800">
            {/* Modal Header */}
            <div className="bg-[#063a57] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-white">
                  <modalService.icon className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/70 uppercase tracking-wider block">
                    {modalService.categoryLabel}
                  </span>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {modalService.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setModalService(null)}
                className="text-white/70 hover:text-white p-1 rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-slate-600 leading-relaxed">
                {modalService.description}
              </p>

              <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-[11px] text-slate-700 space-y-1">
                <div><strong>Cobertura Póliza:</strong> {modalService.limit}</div>
                <div><strong>Tiempo de arribo estimado:</strong> {modalService.eta}</div>
              </div>

              <form onSubmit={handleRequestService} className="space-y-3.5 pt-1">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Beneficiario que requiere la atención *
                  </label>
                  <select
                    className="w-full bg-slate-50 border border-slate-300 rounded-md p-2.5 text-slate-900 focus:outline-none focus:border-[#167394] focus:bg-white"
                  >
                    {DEFAULT_BENEFICIARIES.map((b) => (
                      <option key={b.id} value={b.name}>
                        {b.name} ({b.relationship})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Dirección exacta del evento *
                  </label>
                  <input
                    type="text"
                    required
                    defaultValue={member.address || "Carrera 15 # 85-30, Bogotá D.C."}
                    className="w-full bg-slate-50 border border-slate-300 rounded-md p-2.5 text-slate-900 focus:outline-none focus:border-[#167394] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Breve descripción de los síntomas o problema técnico
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ej: Fuerte malestar general y fiebre desde anoche..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-md p-2.5 text-slate-900 focus:outline-none focus:border-[#167394] focus:bg-white resize-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setModalService(null)}
                    className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-md font-semibold transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={requestSubmitted}
                    className="w-2/3 bg-[#063a57] hover:bg-[#0a5278] text-white py-2.5 rounded-md font-bold uppercase tracking-wider text-xs shadow transition"
                  >
                    {requestSubmitted ? "Despachando Unidad..." : "Confirmar y Despachar"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

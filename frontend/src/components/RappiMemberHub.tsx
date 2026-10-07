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
  Sparkles,
  ChevronRight,
  LogOut,
  User,
  QrCode,
  Shield,
  Activity,
  HeartHandshake,
  Calendar,
  FileText,
  X
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

type ServiceCategory = "all" | "salud" | "hogar" | "mascotas" | "dental";

export default function RappiMemberHub({ member, onLogout }: RappiMemberHubProps) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>("all");
  const [activeRequest, setActiveRequest] = useState<{
    id: string;
    type: string;
    technician: string;
    eta: string;
    status: string;
    phone: string;
  } | null>({
    id: "SW-REQ-9842",
    type: "Médico General a Domicilio",
    technician: "Dra. Natalia Gómez (Reg. Med. 49102)",
    eta: "42 minutos",
    status: "En camino al domicilio",
    phone: "3134289397"
  });

  const [modalService, setModalService] = useState<{
    title: string;
    category: string;
    description: string;
    icon: any;
    limit: string;
  } | null>(null);

  const [requestSubmitted, setRequestSubmitted] = useState(false);
  const [sosActivated, setSosActivated] = useState(false);

  const handleRequestService = (e: React.FormEvent) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setActiveRequest({
        id: "SW-REQ-" + Math.floor(1000 + Math.random() * 9000),
        type: modalService?.title || "Asistencia Express",
        technician: "Central de Despacho Soluciones W",
        eta: "15 - 35 minutos",
        status: "Especialista asignado · Desplazamiento iniciado",
        phone: "3134289397"
      });
      setRequestSubmitted(false);
      setModalService(null);
    }, 1200);
  };

  const handleSosTrigger = () => {
    setSosActivated(true);
    setTimeout(() => {
      setActiveRequest({
        id: "SW-EMERGENCIA-911",
        type: "Ambulancia Medicalizada de Urgencia (CÓDIGO ROJO)",
        technician: "Móvil 04 (Tripulación Paramédica Cruz Roja / Soluciones W)",
        eta: "14 minutos",
        status: "Sirena activa · Prioridad Hospitalaria Máxima",
        phone: "6017459000"
      });
      setSosActivated(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f9] text-slate-800 pb-20">
      {/* 1. TOP APP BAR (Rappi / SuperApp Clean Bar) */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
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
              <span className="text-xs font-semibold text-slate-600">
                Hub de Asistencias Express
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* SOS Trigger */}
            <button
              onClick={handleSosTrigger}
              disabled={sosActivated}
              className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-3.5 sm:px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-red-600/30 animate-pulse transition"
            >
              <AlertTriangle className="w-4 h-4 text-white" />
              <span>{sosActivated ? "Localizando..." : "SOS Urgencias"}</span>
            </button>

            {/* Member Profile pill */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
              <div className="w-8 h-8 rounded-full bg-[#167394] text-white flex items-center justify-center font-bold text-xs">
                {member.fullName.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <span className="block text-xs font-bold text-slate-900 leading-tight">
                  {member.fullName}
                </span>
                <span className="block text-[10px] font-medium text-emerald-600 leading-none">
                  Contrato {member.contractNumber}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Cerrar sesión"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Active Dispatch Tracker (Rappi Order Status Style) */}
        {activeRequest && (
          <div className="bg-gradient-to-r from-[#0a5278] to-[#167394] text-white rounded-2xl p-4 sm:p-5 shadow-lg shadow-[#167394]/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-white animate-spin" style={{ animationDuration: "6s" }} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-400 text-slate-900 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                    EN CURSO
                  </span>
                  <span className="text-xs text-white/80">{activeRequest.id}</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  {activeRequest.type}
                </h4>
                <p className="text-xs text-white/90">
                  {activeRequest.status} · ETA: <strong>{activeRequest.eta}</strong>
                </p>
                <p className="text-[11px] text-white/70 mt-0.5">
                  Responsable: {activeRequest.technician}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <a
                href={`https://wa.me/57${activeRequest.phone}?text=Hola,%20solicito%20actualizacion%20del%20servicio%20${activeRequest.id}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 md:flex-none bg-white text-[#0a5278] hover:bg-slate-100 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Contactar Operador</span>
              </a>
              <button
                onClick={() => setActiveRequest(null)}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-2.5 rounded-xl text-xs font-semibold"
                title="Ocultar barra"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Member Digital Carnet & Plan Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Digital Carnet Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#167394]" />
                <span className="text-xs font-extrabold text-[#0a5278] uppercase tracking-wider">
                  Carnet Digital de Afiliación
                </span>
              </div>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                ACTIVO & COBERTURA TOTAL
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 pt-5 items-center">
              <div className="sm:col-span-8 space-y-3">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Titular del Plan</span>
                  <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                    {member.fullName}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono mt-0.5">
                    C.C. {member.docNumber} · Tel: {member.phone}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Plan Suscrito</span>
                    <span className="text-xs font-bold text-[#0a5278] block truncate">
                      {member.planName}
                    </span>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-medium">Vigencia Póliza</span>
                    <span className="text-xs font-bold text-slate-800 block">
                      {member.validUntil}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-[#167394]" />
                  <span>Dirección registrada: {member.address || "Bogotá D.C., Colombia"}</span>
                </div>
              </div>

              {/* QR Code and Download Button */}
              <div className="sm:col-span-4 flex flex-col items-center justify-center p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <div className="w-24 h-24 bg-white p-2 rounded-lg border border-slate-200 shadow-xs flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-slate-800" />
                </div>
                <span className="text-[10px] font-mono text-slate-500 mt-1">
                  ID: {member.contractNumber}
                </span>
                <button
                  onClick={() => alert(`Descargando Carnet Oficial en PDF (${member.contractNumber})...`)}
                  className="mt-2 text-[11px] font-bold text-[#167394] hover:text-[#0a5278] flex items-center gap-1 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Service Balance / Quotas Counter */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                  Eventos Disponibles (2026)
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Renovación anual</span>
              </div>

              <div className="space-y-3.5 mt-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Médico General a Domicilio</span>
                    <span className="text-[#167394] font-bold">3 de 3 disponibles</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#167394] h-full rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Asistencias Hogar (Plomería/Cerrajería)</span>
                    <span className="text-[#167394] font-bold">2 de 2 disponibles</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#167394] h-full rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Urgencias Mascotas</span>
                    <span className="text-[#167394] font-bold">2 de 2 disponibles</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#167394] h-full rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-slate-700">Telemedicina & Asesoría Médica</span>
                    <span className="text-emerald-600 font-bold">ILIMITADA 24/7</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>¿Necesitas eventos adicionales?</span>
              <a
                href="https://wa.me/573203282014?text=Hola,%20deseo%20adquirir%20un%20paquete%20adicional%20de%20asistencias."
                target="_blank"
                rel="noreferrer"
                className="font-bold text-[#167394] hover:underline"
              >
                Ver recargas express
              </a>
            </div>
          </div>
        </div>

        {/* Rappi Style Categories Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {[
            { id: "all", label: "Todos los Servicios" },
            { id: "salud", label: "Salud & Ambulancia" },
            { id: "hogar", label: "Hogar & Técnicos" },
            { id: "mascotas", label: "Mascotas (Pet)" },
            { id: "dental", label: "Odontología Preventiva" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as ServiceCategory)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                activeCategory === cat.id
                  ? "bg-[#167394] text-white shadow-sm"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* RAPPI TILES GRID: Direct Service Dispatch */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Tile 1: Pedir Médico Domiciliario */}
          {(activeCategory === "all" || activeCategory === "salud") && (
            <div
              onClick={() =>
                setModalService({
                  title: "Médico General a Domicilio",
                  category: "Salud Familiar",
                  description:
                    "Un médico general titulado se desplaza hasta tu residencia para consulta física, diagnóstico y emisión de receta médica oficial.",
                  icon: Stethoscope,
                  limit: "Hasta $250.000 COP cubiertos por consulta"
                })
              }
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#167394] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#e8f4f8] text-[#167394] flex items-center justify-center group-hover:scale-105 transition">
                    <Stethoscope className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-blue-50 text-[#167394] px-2 py-0.5 rounded-full">
                    ETA: 45-60 MIN
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#167394] transition">
                  Médico General a Domicilio
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Atención en cama para cuadros gripales, gastroenteritis, suturas menores y chequeo general sin salir de casa.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#167394]">Pedir Ahora</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#167394] transition" />
              </div>
            </div>
          )}

          {/* Tile 2: Telemedicina Inmediata */}
          {(activeCategory === "all" || activeCategory === "salud") && (
            <div
              onClick={() =>
                setModalService({
                  title: "Telemedicina 24/7 con Fórmula Médica",
                  category: "Salud Virtual",
                  description:
                    "Conéctate al instante mediante videollamada o chat médico con doctores de turno. Te enviamos la orden médica y fórmula con firma digital por WhatsApp y correo.",
                  icon: Activity,
                  limit: "Consultas ilimitadas sin costo adicional"
                })
              }
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#167394] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Activity className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    INMEDIATO · 0 MIN
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#167394] transition">
                  Telemedicina 24/7 Express
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Videoconsulta instantánea desde tu celular con fórmula médica digital válida en farmacias aliadas.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#167394]">Iniciar Videollamada</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#167394] transition" />
              </div>
            </div>
          )}

          {/* Tile 3: Ambulancia de Urgencia */}
          {(activeCategory === "all" || activeCategory === "salud") && (
            <div
              onClick={() =>
                setModalService({
                  title: "Ambulancia Medicalizada de Urgencia",
                  category: "Emergencias",
                  description:
                    "Despacho prioritario de ambulancia básica o medicalizada tipo TAB/TAM con personal paramédico ante traumas, crisis cardíacas o traslados urgentes.",
                  icon: Ambulance,
                  limit: "Hasta 2 traslados anuales 100% cubiertos"
                })
              }
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-red-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Ambulance className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    ALERTA PRIORITARIA
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition">
                  Ambulancia & Traslado SOS
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Tripulación médica especializada para estabilización en el lugar y transporte rápido a clínica.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-red-600">Despachar Unidad</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-red-600 transition" />
              </div>
            </div>
          )}

          {/* Tile 4: Urgencia Mascotas */}
          {(activeCategory === "all" || activeCategory === "mascotas") && (
            <div
              onClick={() =>
                setModalService({
                  title: "Atención Veterinaria de Urgencia (Pet Care)",
                  category: "Mascotas",
                  description:
                    "Médico veterinario a domicilio o en clínica veterinaria aliada ante intoxicaciones, heridas, diarreas severas o caídas de perros y gatos.",
                  icon: Dog,
                  limit: "Hasta $200.000 COP por evento (2 al año)"
                })
              }
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#167394] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Dog className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    PERROS & GATOS
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#167394] transition">
                  Urgencia Veterinaria
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Atención médica para tu mascota ante accidentes, malestar súbito o desparasitación preventiva.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#167394]">Pedir Veterinario</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#167394] transition" />
              </div>
            </div>
          )}

          {/* Tile 5: Plomería de Emergencia */}
          {(activeCategory === "all" || activeCategory === "hogar") && (
            <div
              onClick={() =>
                setModalService({
                  title: "Plomería de Emergencia",
                  category: "Asistencia Hogar",
                  description:
                    "Plomero certificado para reparar roturas imprevistas de tuberías, inundaciones, filtraciones mayores y atascos en tubería principal.",
                  icon: Wrench,
                  limit: "Mano de obra y materiales básicos cubiertos hasta $200.000 COP"
                })
              }
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#167394] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    TÉCNICO EN 45 MIN
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#167394] transition">
                  Plomería & Fugas de Agua
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Atención rápida ante roturas de tubos, filtraciones o taponamientos severos en tu hogar.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#167394]">Solicitar Plomero</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#167394] transition" />
              </div>
            </div>
          )}

          {/* Tile 6: Cerrajería de Emergencia */}
          {(activeCategory === "all" || activeCategory === "hogar") && (
            <div
              onClick={() =>
                setModalService({
                  title: "Cerrajería Urgente",
                  category: "Asistencia Hogar",
                  description:
                    "Apertura de cerradura de la puerta principal por pérdida, olvido o robo de llaves, o por cerradura bloqueada.",
                  icon: Key,
                  limit: "Hasta $150.000 COP por servicio"
                })
              }
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#167394] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Key className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">
                    APERTURA PUERTA
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#167394] transition">
                  Cerrajería Express
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Apertura y reparación de cerraduras cuando no puedas ingresar a tu vivienda.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#167394]">Solicitar Cerrajero</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#167394] transition" />
              </div>
            </div>
          )}

          {/* Tile 7: Electricidad Hogar */}
          {(activeCategory === "all" || activeCategory === "hogar") && (
            <div
              onClick={() =>
                setModalService({
                  title: "Electricista de Emergencia",
                  category: "Asistencia Hogar",
                  description:
                    "Restablecimiento de energía eléctrica por corto circuito o avería en breakers y tomas principales de la casa.",
                  icon: Zap,
                  limit: "Hasta $180.000 COP cubiertos"
                })
              }
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#167394] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Zap className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    CORTO CIRCUITO
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#167394] transition">
                  Electricista Urgente
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Restablecimiento del suministro eléctrico y arreglo de tomas de corriente en riesgo.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#167394]">Solicitar Electricista</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#167394] transition" />
              </div>
            </div>
          )}

          {/* Tile 8: Odontología Preventiva */}
          {(activeCategory === "all" || activeCategory === "dental") && (
            <div
              onClick={() =>
                setModalService({
                  title: "Odontología Preventiva & Profilaxis",
                  category: "Salud Dental",
                  description:
                    "Agendamiento prioritario para limpieza y profilaxis dental anual sin costo en la red odontológica aliada.",
                  icon: Smile,
                  limit: "1 profilaxis completa 100% gratuita por año"
                })
              }
              className="bg-white rounded-2xl p-5 border border-slate-200 hover:border-[#167394] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Smile className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">
                    100% CUBIERTO
                  </span>
                </div>
                <h4 className="text-base font-bold text-slate-900 group-hover:text-[#167394] transition">
                  Profilaxis & Cita Odontológica
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  Limpieza y chequeo preventivo con odontólogos certificados en sedes cercanas.
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-extrabold text-[#167394]">Agendar Cita</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 group-hover:text-[#167394] transition" />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL: SOLICITUD DE ASISTENCIA EXPRESS */}
      {modalService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setModalService(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#e8f4f8] text-[#167394] flex items-center justify-center shrink-0">
                <modalService.icon className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-[#167394] uppercase tracking-wider block">
                  {modalService.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 leading-tight">
                  {modalService.title}
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {modalService.description}
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-4 text-[11px] text-slate-600 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>Cobertura:</strong> {modalService.limit}</span>
            </div>

            <form onSubmit={handleRequestService} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dirección del Evento *
                </label>
                <input
                  type="text"
                  required
                  defaultValue={member.address || "Carrera 15 # 85-30, Bogotá"}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#167394]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Descripción breve del problema o síntoma *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Ej: Presenta fiebre de 38.5 desde la madrugada o fuga de agua bajo el lavamanos..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#167394]"
                ></textarea>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Teléfono de Contacto Inmediato
                </label>
                <input
                  type="tel"
                  required
                  defaultValue={member.phone}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#167394]"
                />
              </div>

              <button
                type="submit"
                disabled={requestSubmitted}
                className="w-full bg-[#167394] hover:bg-[#0a5278] text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition flex items-center justify-center gap-2 mt-2"
              >
                {requestSubmitted ? (
                  <span>Despachando servicio a tu ubicación...</span>
                ) : (
                  <>
                    <span>Confirmar y Despachar Asistencia</span>
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import {
  Stethoscope,
  Ambulance,
  Dog,
  Home,
  Smile,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
  MessageCircle,
  CreditCard,
  Download,
  Search,
  ArrowRight,
  Sparkles,
  Zap,
  Users,
  Building2,
  FileCheck,
  Check,
  X,
  AlertCircle
} from "lucide-react";

interface AssistanceModule {
  id: string;
  name: string;
  category: string;
  shortDesc: string;
  icon: React.ElementType;
  priceMonthly: number;
  highlightTag?: string;
  features: string[];
  limitCoverage: string;
}

const MODULES_DATA: AssistanceModule[] = [
  {
    id: "medica",
    name: "Asistencia Médica Domiciliaria",
    category: "Salud Integral",
    shortDesc: "Médico general en tu hogar y telemedicina 24/7 sin copagos sorpresa.",
    icon: Stethoscope,
    priceMonthly: 18900,
    highlightTag: "MÁS POPULAR",
    features: [
      "Médico general a domicilio (hasta 3 eventos/año)",
      "Telemedicina 24/7 con fórmula médica electrónica",
      "Orientación telefónica en medicina general y nutrición",
      "Envío de medicamentos básicos a domicilio tras consulta"
    ],
    limitCoverage: "Hasta $250.000 COP por evento en atención domiciliaria"
  },
  {
    id: "ambulancia",
    name: "Ambulancia & Urgencias Vitales",
    category: "Respuesta de Emergencia",
    shortDesc: "Traslado medicalizado prioritario ante accidentes o complicaciones agudas.",
    icon: Ambulance,
    priceMonthly: 14900,
    features: [
      "Traslado en ambulancia básica y medicalizada",
      "Atención de urgencia y primeros auxilios in situ",
      "Coordinación directa con centros hospitalarios de la red",
      "Disponible 24/7 en perímetro urbano"
    ],
    limitCoverage: "Hasta 2 traslados anuales sin costo adicional"
  },
  {
    id: "mascotas",
    name: "Asistencia Mascotas (Pet Care)",
    category: "Veterinaria",
    shortDesc: "Protección veterinaria para perros y gatos ante accidentes e imprevistos.",
    icon: Dog,
    priceMonthly: 15900,
    highlightTag: "ALTA DEMANDA",
    features: [
      "Consulta veterinaria por urgencia médica o accidente",
      "Teleorientación veterinaria 24 horas",
      "Auxilio económico de guardería por hospitalización del amo",
      "1 vacuna preventiva o desparasitación anual incluida"
    ],
    limitCoverage: "Hasta $200.000 COP por evento (máx. 2 eventos al año)"
  },
  {
    id: "hogar",
    name: "Asistencia Hogar (Plomería & Redes)",
    category: "Mantenimiento Express",
    shortDesc: "Técnicos calificados para emergencias de plomería, cerrajería y electricidad.",
    icon: Home,
    priceMonthly: 16900,
    features: [
      "Plomería de emergencia por rotura de tubos o inundaciones",
      "Cerrajería 24/7 por pérdida de llaves o trabado de chapa",
      "Electricidad de urgencia por corto o falla de fluido",
      "Vidriería básica por rotura de ventanas exteriores"
    ],
    limitCoverage: "Hasta $220.000 COP por evento (mano de obra + materiales básicos)"
  },
  {
    id: "odontologica",
    name: "Asistencia Odontológica",
    category: "Salud Oral",
    shortDesc: "Urgencias por dolor y tratamientos preventivos con centros aliados.",
    icon: Smile,
    priceMonthly: 12900,
    features: [
      "Atención de urgencia odontológica por dolor agudo o trauma",
      "1 profilaxis / limpieza profunda anual sin costo",
      "Diagnóstico radiográfico preliminar incluido",
      "Tarifas preferenciales con 30% a 50% de descuento en tratamientos"
    ],
    limitCoverage: "1 Urgencia cubierta al 100% + 1 profilaxis anual"
  }
];

export default function HomeView() {
  // Quotation State
  const [selectedModules, setSelectedModules] = useState<string[]>([
    "medica",
    "ambulancia",
    "mascotas",
    "hogar",
    "odontologica"
  ]);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  
  // Checkout Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    docType: "CC",
    docNumber: "",
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: "Bogotá D.C."
  });
  const [paymentMethod, setPaymentMethod] = useState<"pse" | "card" | "nequi">("pse");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState<{
    contractNumber: string;
    date: string;
    totalPaid: number;
  } | null>(null);

  // Central Operator Demo State
  const [searchCedula, setSearchCedula] = useState("");
  const [operatorSearchResult, setOperatorSearchResult] = useState<{
    found: boolean;
    name?: string;
    cedula?: string;
    status?: string;
    plan?: string;
    modules?: string[];
    validUntil?: string;
    eventsRemaining?: number;
  } | null>(null);

  // Calculations
  const rawSubtotal = selectedModules.reduce((acc, modId) => {
    const item = MODULES_DATA.find((m) => m.id === modId);
    return acc + (item?.priceMonthly || 0);
  }, 0);

  // Discount rules: All 5 = 25% discount, 3-4 = 15% discount
  let bundleDiscountRate = 0;
  if (selectedModules.length === 5) bundleDiscountRate = 0.25;
  else if (selectedModules.length >= 3) bundleDiscountRate = 0.15;

  const discountedMonthly = Math.round(rawSubtotal * (1 - bundleDiscountRate));
  const finalPrice =
    billingPeriod === "monthly"
      ? discountedMonthly
      : Math.round(discountedMonthly * 10); // 10 months instead of 12 (2 months free)

  const toggleModule = (id: string) => {
    if (selectedModules.includes(id)) {
      if (selectedModules.length === 1) return; // keep at least 1
      setSelectedModules(selectedModules.filter((m) => m !== id));
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  const handleSelectPreset = (preset: "all" | "health_home" | "pet_home") => {
    if (preset === "all") {
      setSelectedModules(["medica", "ambulancia", "mascotas", "hogar", "odontologica"]);
    } else if (preset === "health_home") {
      setSelectedModules(["medica", "ambulancia", "hogar"]);
    } else if (preset === "pet_home") {
      setSelectedModules(["mascotas", "hogar"]);
    }
  };

  const startCheckout = () => {
    setCheckoutStep(1);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.docNumber || !formData.fullName || !formData.phone || !formData.email) {
      alert("Por favor diligencia los campos obligatorios.");
      return;
    }
    setCheckoutStep(2);
  };

  const handlePaymentSimulation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const randomContract = "SW-" + Math.floor(100000 + Math.random() * 900000);
      setGeneratedPolicy({
        contractNumber: randomContract,
        date: new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }),
        totalPaid: finalPrice
      });
      setCheckoutStep(3);
    }, 1500);
  };

  const handleOperatorSearch = () => {
    if (!searchCedula.trim()) return;
    if (searchCedula.includes("10") || searchCedula.includes("79") || searchCedula.length >= 8) {
      setOperatorSearchResult({
        found: true,
        name: "Carlos Eduardo Restrepo",
        cedula: searchCedula,
        status: "ACTIVO Y VIGENTE",
        plan: "Combo Familiar 360° (5 Asistencias)",
        modules: ["Médica", "Ambulancia", "Mascotas", "Hogar", "Odontológica"],
        validUntil: "04 de Noviembre, 2026",
        eventsRemaining: 3
      });
    } else {
      setOperatorSearchResult({
        found: false,
        cedula: searchCedula
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* 1. TOP UTILITY BAR (Inspired by BeERP header structure) */}
      <div className="bg-slate-900 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Central de Emergencias 24/7 Activa
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline">Línea Directa: +57 (601) 745-9000</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="#operador"
              className="text-slate-300 hover:text-white transition flex items-center gap-1"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              Verificador Central Operador
            </a>
            <span className="text-slate-600">|</span>
            <a
              href="https://wa.me/573203282014"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp Soluciones W
            </a>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25 text-white">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Soluciones <span className="text-blue-600">W</span>
                </span>
                <span className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  B2C Digital
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Red de Asistencia Familiar · Dir. Wilson Triana
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#modulos" className="hover:text-blue-600 transition">
              Las 5 Asistencias
            </a>
            <a href="#cotizador" className="hover:text-blue-600 transition">
              Cotizador en Vivo
            </a>
            <a href="#beneficios" className="hover:text-blue-600 transition">
              ¿Por qué Soluciones W?
            </a>
            <a href="#operador" className="hover:text-blue-600 transition">
              Consulta Operativa
            </a>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                const el = document.getElementById("cotizador");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition flex items-center gap-2"
            >
              <span>Cotizar Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION (BeERP Style: clean white canvas, large typography, dual buttons, version pill) */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 rounded-full px-3.5 py-1.5 mb-6 text-xs font-semibold text-blue-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>NUEVO CANAL DIGITAL B2C · EMISIÓN INMEDIATA EN &lt; 2 MINUTOS</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-slate-950 leading-[1.15]">
              Protección inmediata para tu{" "}
              <strong className="font-bold text-slate-900">familia, hogar y mascotas</strong> en una sola cuota.
            </h1>

            {/* Subheading */}
            <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed font-normal">
              Sin intermediarios corporativos, sin trámites bancarios y sin exámenes de asegurabilidad. 
              Elige las coberturas que necesitas, paga seguro por PSE o tarjeta y recibe tu certificado oficial activo al instante.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById("cotizador");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition flex items-center justify-center gap-2 text-base"
              >
                <Zap className="w-5 h-5 text-amber-300" />
                <span>Personalizar y Activar mi Plan</span>
              </button>

              <a
                href="#modulos"
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-4 rounded-xl transition flex items-center justify-center gap-2 text-base border border-slate-200"
              >
                <span>Explorar las 5 Asistencias</span>
              </a>
            </div>

            {/* Micro-Metrics (Proof points) */}
            <div className="mt-12 pt-8 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">&lt; 2 min</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Emisión digital del certificado</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600">80% +</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Tasa de autogestión directa</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-2xl sm:text-3xl font-bold text-blue-600">24/7/365</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Central telefónica y WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THE 5 CORE ASSISTANCE MODULES (BeERP Card Grid Layout) */}
      <section id="modulos" className="py-20 lg:py-28 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h6 className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">
              PORTAFOLIO DE ASISTENCIA FAMILIAR
            </h6>
            <h2 className="text-3xl sm:text-4xl font-light text-slate-950">
              5 Módulos modulares diseñados para <br className="hidden sm:block" />
              <strong className="font-semibold text-slate-900">resolver las urgencias de tu día a día</strong>
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base">
              Puedes contratar un solo módulo individual o empaquetar los 5 para obtener hasta un 25% de descuento en tu suscripción.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {MODULES_DATA.map((module) => {
              const Icon = module.icon;
              const isSelected = selectedModules.includes(module.id);

              return (
                <div
                  key={module.id}
                  className={`bg-white rounded-2xl p-7 border transition-all duration-200 erp-shadow ${
                    isSelected
                      ? "border-blue-600 ring-2 ring-blue-500/20 shadow-blue-500/10"
                      : "border-slate-200 hover:border-slate-300"
                  } flex flex-col justify-between`}
                >
                  <div>
                    {/* Header Card */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                        <Icon className="w-6 h-6" />
                      </div>
                      {module.highlightTag && (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                          {module.highlightTag}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {module.category}
                    </p>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {module.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2">
                      {module.shortDesc}
                    </p>

                    <div className="my-5 pt-4 border-t border-slate-100">
                      <span className="text-2xl font-bold text-slate-900">
                        ${module.priceMonthly.toLocaleString("es-CO")}
                      </span>
                      <span className="text-xs text-slate-500 ml-1">COP / mes</span>
                    </div>

                    {/* Features list */}
                    <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                      {module.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="bg-slate-50 p-2.5 rounded-lg text-[11px] text-slate-500 mb-4 border border-slate-100">
                      <strong>Tope:</strong> {module.limitCoverage}
                    </div>

                    <button
                      onClick={() => toggleModule(module.id)}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-2 ${
                        isSelected
                          ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Incluido en tu cotización</span>
                        </>
                      ) : (
                        <span>+ Agregar a mi plan</span>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}

            {/* Summary promo card */}
            <div className="bg-gradient-to-br from-blue-700 to-indigo-900 text-white rounded-2xl p-7 flex flex-col justify-between shadow-xl">
              <div>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  OFERTA FAMILIAR RECOMENDADA
                </span>
                <h3 className="text-2xl font-bold mt-4 leading-snug">
                  Combo Familiar 360° con 25% de Descuento
                </h3>
                <p className="text-sm text-blue-100 mt-2">
                  Activa los 5 módulos simultáneamente y obtén protección completa para tu casa, carro, mascota y salud en una sola cuota mensual.
                </p>
                <div className="my-6 pt-4 border-t border-white/20">
                  <span className="text-xs text-blue-200 block line-through">
                    $79.500 COP / mes
                  </span>
                  <span className="text-3xl font-extrabold text-white">
                    $59.625
                  </span>
                  <span className="text-xs text-blue-200 ml-1">COP / mes</span>
                </div>
              </div>

              <button
                onClick={() => {
                  handleSelectPreset("all");
                  const el = document.getElementById("cotizador");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full py-3 px-4 rounded-xl bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                Seleccionar Combo Completo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. INTERACTIVE QUOTATION & SIMULATOR MODULE */}
      <section id="cotizador" className="py-20 lg:py-28 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h6 className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">
              COTIZADOR DINÁMICO EN LÍNEA
            </h6>
            <h2 className="text-3xl sm:text-4xl font-light text-slate-950">
              Personaliza tu suscripción y <br />
              <strong className="font-semibold text-slate-900">mira tu tarifa en tiempo real</strong>
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base">
              Sin letra chica. Selecciona las coberturas que desees y el sistema calculará tu cuota neta al instante.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Preset buttons & Module selection */}
            <div className="lg:col-span-7 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Paquetes Rápidos:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleSelectPreset("all")}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                      selectedModules.length === 5
                        ? "bg-blue-600 text-white"
                        : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    Combo 360° (5)
                  </button>
                  <button
                    onClick={() => handleSelectPreset("health_home")}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-medium transition"
                  >
                    Salud + Hogar (3)
                  </button>
                  <button
                    onClick={() => handleSelectPreset("pet_home")}
                    className="text-xs px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 hover:bg-slate-100 font-medium transition"
                  >
                    Mascotas + Hogar (2)
                  </button>
                </div>
              </div>

              {/* Individual toggles */}
              <div className="space-y-3">
                {MODULES_DATA.map((module) => {
                  const isChecked = selectedModules.includes(module.id);
                  const Icon = module.icon;
                  return (
                    <label
                      key={module.id}
                      onClick={() => toggleModule(module.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition ${
                        isChecked
                          ? "bg-white border-blue-500 shadow-sm"
                          : "bg-slate-100/70 border-slate-200 text-slate-500"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            isChecked
                              ? "bg-blue-50 text-blue-600"
                              : "bg-slate-200 text-slate-500"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p
                            className={`text-sm font-semibold ${
                              isChecked ? "text-slate-900" : "text-slate-600"
                            }`}
                          >
                            {module.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {module.category}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`text-sm font-bold ${
                            isChecked ? "text-slate-900" : "text-slate-500"
                          }`}
                        >
                          ${module.priceMonthly.toLocaleString("es-CO")} / mes
                        </span>
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center border transition ${
                            isChecked
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white border-slate-300"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>

              {/* Billing Period Switch */}
              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Periodo de facturación</p>
                  <p className="text-xs text-slate-500">Paga anual y recibe 2 meses gratis</p>
                </div>
                <div className="flex items-center bg-slate-200 p-1 rounded-xl">
                  <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      billingPeriod === "monthly"
                        ? "bg-white text-slate-900 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Mensual
                  </button>
                  <button
                    onClick={() => setBillingPeriod("annual")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                      billingPeriod === "annual"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    Anual (-16%)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary Card */}
            <div className="lg:col-span-5 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 erp-shadow sticky top-28">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                RESUMEN DE COBERTURA
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Plan Personalizado B2C
              </h3>

              <div className="mt-6 space-y-3 pb-6 border-b border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Módulos seleccionados:</span>
                  <span className="font-semibold text-slate-900">
                    {selectedModules.length} de 5
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Valor base mensual:</span>
                  <span>${rawSubtotal.toLocaleString("es-CO")} COP</span>
                </div>
                {bundleDiscountRate > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Descuento paquete multi-asistencia:</span>
                    <span>- {bundleDiscountRate * 100}%</span>
                  </div>
                )}
                {billingPeriod === "annual" && (
                  <div className="flex justify-between text-blue-600 font-medium">
                    <span>Beneficio plan anual:</span>
                    <span>2 Meses Gratis</span>
                  </div>
                )}
              </div>

              <div className="py-6 border-b border-slate-100">
                <p className="text-xs text-slate-500 uppercase font-semibold">Total a pagar:</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-slate-950">
                    ${finalPrice.toLocaleString("es-CO")}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    COP / {billingPeriod === "monthly" ? "mes" : "año"}
                  </span>
                </div>
                <p className="text-xs text-emerald-600 mt-2 flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Sin cuota de afiliación · Activación inmediata
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={startCheckout}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Continuar a Registro y Pago</span>
                </button>
                <p className="text-center text-[11px] text-slate-400">
                  Transacción protegida con cifrado SSL de 256 bits · PSE, Nequi y Tarjetas
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BACKOFFICE OPERATIONAL VISOR DEMO (Wilson Triana's Call Center Simulation) */}
      <section id="operador" className="py-20 lg:py-28 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <span className="bg-blue-900/60 text-blue-400 border border-blue-700/50 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              OPERACIÓN INTERNA SOLUCIONES W
            </span>
            <h2 className="text-3xl sm:text-4xl font-light text-white mt-4">
              Buscador Rápido de la <strong className="font-semibold text-blue-400">Central de Emergencias</strong>
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Demostración de cómo el operador telefónico de Wilson Triana valida la vigencia y coberturas del usuario en menos de 1 segundo cuando recibe una llamada de urgencia.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-slate-800/90 border border-slate-700 p-6 sm:p-8 rounded-2xl shadow-2xl">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Ingresa el número de Cédula del afiliado que llama a la central:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={searchCedula}
                onChange={(e) => setSearchCedula(e.target.value)}
                placeholder="Ej: 1020304050 o cualquier número..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleOperatorSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-sm transition flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Buscar</span>
              </button>
            </div>

            {/* Operator result */}
            {operatorSearchResult && (
              <div className="mt-6 pt-6 border-t border-slate-700/80 animate-in fade-in duration-200">
                {operatorSearchResult.found ? (
                  <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <p className="text-xs text-slate-400">Titular Identificado:</p>
                        <p className="text-base font-bold text-white">{operatorSearchResult.name}</p>
                        <p className="text-xs text-slate-500">C.C. {operatorSearchResult.cedula}</p>
                      </div>
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                        {operatorSearchResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 my-4 text-xs">
                      <div>
                        <span className="text-slate-400">Plan Contratado:</span>
                        <p className="font-semibold text-white mt-0.5">{operatorSearchResult.plan}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Vigencia Actual:</span>
                        <p className="font-semibold text-white mt-0.5">{operatorSearchResult.validUntil}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs flex items-center justify-between">
                      <span className="text-slate-300">Eventos de auxilio disponibles este año:</span>
                      <span className="font-bold text-emerald-400 text-sm">
                        {operatorSearchResult.eventsRemaining} eventos restantes
                      </span>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => alert("Simulación: Solicitud de despacho enviada a la red de proveedores.")}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-xs transition flex items-center justify-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Despachar Asistencia Inmediata</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-300 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>No se encontró ningún contrato activo asociado al documento {operatorSearchResult.cedula}.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. DUAL CONTACT & B2B/B2C SECTION (BeERP "Contact with us / Download" section) */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Box 1: Emergency & Immediate Contact */}
            <div className="p-8 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-6">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <h6 className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-2">
                  LÍNEA DE EMERGENCIAS FAMILIARES
                </h6>
                <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                  ¿Tienes una urgencia médica o en el hogar en este momento?
                </h3>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                  Nuestros operadores en la central de Soluciones W coordinan médicos, ambulancias y técnicos 24 horas al día, los 365 días del año.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-blue-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-slate-500">Línea Bogotá y Nacional:</span>
                  <p className="text-xl font-bold text-slate-900">+57 (601) 745-9000</p>
                </div>
                <a
                  href="https://wa.me/573203282014"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp de Asistencia</span>
                </a>
              </div>
            </div>

            {/* Box 2: Corporate B2B Channel Coexistence */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6">
                  <Building2 className="w-6 h-6" />
                </div>
                <h6 className="text-xs font-bold tracking-widest text-slate-500 uppercase mb-2">
                  CANAL CORPORATIVO B2B
                </h6>
                <h3 className="text-2xl font-bold text-slate-900 leading-snug">
                  ¿Representas a una empresa o fondo de empleados?
                </h3>
                <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                  Mantenemos y potenciamos nuestros convenios empresariales con tarifas colectivas para nómina y colectivos corporativos.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Gestión de Convenios B2B:</span>
                  <p className="text-sm font-bold text-slate-800">Dir. Wilson Triana</p>
                </div>
                <a
                  href="mailto:jhojanjimene@gmail.com"
                  className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition"
                >
                  Solicitar Propuesta B2B
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER (Clean BeERP style) */}
      <footer className="bg-slate-950 text-slate-400 text-xs py-12 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
            {/* Col 1 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  W
                </div>
                <span className="text-base font-bold text-white">Soluciones W</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Plataforma tecnológica de autogestión de asistencias familiares B2C y corporativas B2B en Colombia.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <p className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
                Coberturas
              </p>
              <ul className="space-y-2 text-xs">
                <li><a href="#modulos" className="hover:text-white transition">Médica Domiciliaria</a></li>
                <li><a href="#modulos" className="hover:text-white transition">Ambulancia y Urgencias</a></li>
                <li><a href="#modulos" className="hover:text-white transition">Asistencia Mascotas</a></li>
                <li><a href="#modulos" className="hover:text-white transition">Asistencia Hogar</a></li>
                <li><a href="#modulos" className="hover:text-white transition">Odontológica</a></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <p className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
                Legal & Cumplimiento
              </p>
              <ul className="space-y-2 text-xs">
                <li><span className="text-slate-300">Ley 1581 de 2012 (Habeas Data)</span></li>
                <li><span className="text-slate-300">Términos de Servicio y Topes</span></li>
                <li><span className="text-slate-300">Política de No Permanencia</span></li>
                <li><span className="text-slate-300">No constituye póliza de seguro asegurador</span></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <p className="text-white font-bold uppercase tracking-wider text-[11px] mb-3">
                Contacto Operativo
              </p>
              <p className="text-xs text-slate-300">Bogotá D.C., Colombia</p>
              <p className="text-xs text-slate-300 mt-1">Línea 24 Horas: +57 (601) 745-9000</p>
              <p className="text-xs text-slate-400 mt-2">Wilson Triana · Fundador y Director</p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Soluciones W Colombia. Todos los derechos reservados.</p>
            <p>Arquitectura B2C desarrollada para entrega en 16 semanas bajo estándares PMI y Scrum.</p>
          </div>
        </div>
      </footer>

      {/* 9. CHECKOUT & EMISSION MODAL (Simulation of Registration, Payment & Automatic Issuance) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">
                  PASO {checkoutStep} DE 3
                </p>
                <h3 className="text-lg font-bold">
                  {checkoutStep === 1 && "Registro Express del Titular"}
                  {checkoutStep === 2 && "Pago Seguro Digital (Pasarela)"}
                  {checkoutStep === 3 && "¡Cobertura Emitida Exitosamente!"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              {/* STEP 1: Registration Form */}
              {checkoutStep === 1 && (
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Tipo Doc.
                      </label>
                      <select
                        value={formData.docType}
                        onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      >
                        <option value="CC">Cédula (CC)</option>
                        <option value="CE">C. Extranjería</option>
                        <option value="NIT">NIT</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Número de Documento *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 1020304050"
                        value={formData.docNumber}
                        onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nombre Completo del Titular *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Wilson Andrés Triana"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Celular / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej: 320 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Correo Electrónico *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Dirección y Ciudad de Cobertura
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: Calle 127 # 15-30, Apto 402, Bogotá"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
                      <input type="checkbox" defaultChecked required className="mt-0.5 rounded text-blue-600" />
                      <span>
                        Acepto los términos de servicio y la política de tratamiento de datos personales (Habeas Data Ley 1581).
                      </span>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-1.5"
                    >
                      <span>Ir a Selección de Medio de Pago</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* STEP 2: Payment Gateway Simulation */}
              {checkoutStep === 2 && (
                <div className="space-y-5">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{formData.fullName}</p>
                      <p className="text-slate-500">C.C. {formData.docNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400">Total a Pagar:</p>
                      <p className="text-base font-bold text-slate-900">
                        ${finalPrice.toLocaleString("es-CO")} COP
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Selecciona tu medio de pago:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setPaymentMethod("pse")}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                          paymentMethod === "pse"
                            ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Building2 className="w-5 h-5 text-blue-600" />
                        <span className="text-xs">PSE / Banco</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod("nequi")}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                          paymentMethod === "nequi"
                            ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <Zap className="w-5 h-5 text-purple-600" />
                        <span className="text-xs">Nequi</span>
                      </button>

                      <button
                        onClick={() => setPaymentMethod("card")}
                        className={`p-3 rounded-xl border text-center transition flex flex-col items-center justify-center gap-1 ${
                          paymentMethod === "card"
                            ? "border-blue-600 bg-blue-50/50 text-blue-900 font-bold"
                            : "border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        <CreditCard className="w-5 h-5 text-emerald-600" />
                        <span className="text-xs">Tarjeta C/D</span>
                      </button>
                    </div>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-xs text-amber-800">
                    <strong>Simulación de Pasarela (Sandbox Wompi):</strong> Al hacer clic en simular pago, el sistema procesará la transacción y emitirá el certificado en menos de 2 segundos.
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition"
                    >
                      Atrás
                    </button>
                    <button
                      onClick={handlePaymentSimulation}
                      disabled={isProcessing}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Procesando y emitiendo póliza...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Simular Pago Exitoso (${finalPrice.toLocaleString("es-CO")} COP)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Instant Issuance & Certificate Ready */}
              {checkoutStep === 3 && generatedPolicy && (
                <div className="space-y-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-slate-900">
                      ¡Tu cobertura ya está activa!
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Certificado de afiliación generado automáticamente en 1.5 segundos.
                    </p>
                  </div>

                  {/* Policy Certificate Badge Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-left text-xs space-y-2 relative overflow-hidden">
                    <div className="absolute right-3 top-3 bg-emerald-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Vigente
                    </div>
                    <p className="text-slate-400 font-medium">Contrato Soluciones W:</p>
                    <p className="text-base font-extrabold text-blue-700 font-mono">
                      {generatedPolicy.contractNumber}
                    </p>
                    <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-slate-600">
                      <div>
                        <span className="text-slate-400">Titular:</span>
                        <p className="font-semibold text-slate-800">{formData.fullName}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Identificación:</span>
                        <p className="font-semibold text-slate-800">{formData.docNumber}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Fecha de Emisión:</span>
                        <p className="font-semibold text-slate-800">{generatedPolicy.date}</p>
                      </div>
                      <div>
                        <span className="text-slate-400">Total Abonado:</span>
                        <p className="font-semibold text-emerald-600">${generatedPolicy.totalPaid.toLocaleString("es-CO")} COP</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    <button
                      onClick={() => alert(`Descargando certificado digital oficial en PDF (${generatedPolicy.contractNumber}.pdf)`)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Certificado en PDF</span>
                    </button>

                    <a
                      href={`https://wa.me/573203282014?text=Hola%20Soluciones%20W,%20acabo%20de%20afiliarme%20con%20contrato%20${generatedPolicy.contractNumber}%20y%20c%C3%A9dula%20${formData.docNumber}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition text-xs flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Guardar Central de Emergencias en WhatsApp</span>
                    </a>
                  </div>

                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-xs text-slate-500 hover:text-slate-800 transition"
                  >
                    Cerrar ventana
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

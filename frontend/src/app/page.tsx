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
  Zap,
  Building2,
  Check,
  X,
  AlertCircle,
  Coins,
  Heart,
  Settings,
  Plus,
  Layers,
  Phone
} from "lucide-react";

interface AssistanceModule {
  id: string;
  name: string;
  priceTag: string;
  priceValue: number;
  category: string;
  description: string;
  features: string[];
  limit: string;
}

const MODULES_LIST: AssistanceModule[] = [
  {
    id: "medica",
    name: "Asistencia Médica",
    priceTag: "BASE INCLUIDA",
    priceValue: 18900,
    category: "Salud Integral",
    description: "Médico general a domicilio y telemedicina 24/7 con fórmula médica electrónica.",
    features: [
      "Médico general a casa (hasta 3 eventos/año)",
      "Telemedicina 24/7 con médicos certificados",
      "Orientación médica telefónica y nutrición"
    ],
    limit: "Hasta $250.000 COP por consulta presencial"
  },
  {
    id: "ambulancia",
    name: "Ambulancia 24/7",
    priceTag: "$14.900+",
    priceValue: 14900,
    category: "Urgencias Vitales",
    description: "Traslado medicalizado prioritario y atención prehospitalaria ante emergencias.",
    features: [
      "Traslado en ambulancia básica y medicalizada",
      "Primeros auxilios y estabilización in situ",
      "Coordinación hospitalaria inmediata"
    ],
    limit: "Hasta 2 traslados anuales 100% cubiertos"
  },
  {
    id: "mascotas",
    name: "Mascotas (Pet Care)",
    priceTag: "$15.900+",
    priceValue: 15900,
    category: "Veterinaria",
    description: "Atención de urgencia veterinaria para perros y gatos ante accidentes o malestar agudo.",
    features: [
      "Consulta veterinaria de urgencia",
      "Teleorientación veterinaria 24 horas",
      "1 vacuna o desparasitación anual incluida"
    ],
    limit: "Hasta $200.000 COP por evento (máx. 2 al año)"
  },
  {
    id: "hogar",
    name: "Asistencia Hogar",
    priceTag: "$16.900+",
    priceValue: 16900,
    category: "Plomería & Cerrajería",
    description: "Técnicos certificados para roturas de tuberías, cortes eléctricos y cerrajería 24/7.",
    features: [
      "Plomería de emergencia por inundación o fugas",
      "Cerrajería 24/7 por pérdida de llaves",
      "Electricidad de urgencia por corto circuito"
    ],
    limit: "Hasta $220.000 COP (mano de obra + materiales)"
  },
  {
    id: "odontologica",
    name: "Odontológica",
    priceTag: "$12.900+",
    priceValue: 12900,
    category: "Salud Oral",
    description: "Urgencias por dolor agudo y prevención con profilaxis anual en red aliada.",
    features: [
      "Atención de urgencia odontológica por dolor",
      "1 profilaxis y limpieza profunda al año",
      "Tarifas preferenciales con 40% de descuento"
    ],
    limit: "1 Urgencia cubierta al 100% + 1 profilaxis anual"
  },
  {
    id: "combo",
    name: "Combo 360° Familiar",
    priceTag: "AHORRA 25%",
    priceValue: 59625,
    category: "Paquete Completo",
    description: "Los 5 módulos unidos para una protección integral sin vacíos de cobertura.",
    features: [
      "Médica + Ambulancia + Mascotas + Hogar + Odonto",
      "Prioridad alta en despacho de central",
      "Hasta 4 beneficiarios del mismo núcleo familiar"
    ],
    limit: "Cobertura completa simultánea"
  },
  {
    id: "telemedicina",
    name: "Telemedicina VIP",
    priceTag: "ILIMITADA",
    priceValue: 9900,
    category: "Canal Digital",
    description: "Consultas virtuales ilimitadas con medicina general y pediatría por videollamada.",
    features: [
      "Atención médica por video en menos de 5 min",
      "Fórmula médica oficial enviada por WhatsApp",
      "Sin límites de llamadas ni cobros extra"
    ],
    limit: "Consultas ilimitadas 365 días"
  },
  {
    id: "custom",
    name: "Arma tu Propio Plan",
    priceTag: "A TU MEDIDA",
    priceValue: 0,
    category: "Personalizado",
    description: "Combina exactamente las coberturas que tú y tu familia necesitan.",
    features: [
      "Selecciona 1, 2, 3 o más asistencias",
      "Descuento automático progresivo",
      "Tarifa transparente sin cobros ocultos"
    ],
    limit: "Flexibilidad 100% personalizada"
  }
];

export default function HomeView() {
  const [selectedModules, setSelectedModules] = useState<string[]>([
    "medica",
    "ambulancia",
    "mascotas",
    "hogar",
    "odontologica"
  ]);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");

  // Modal Checkout
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

  // Central Operator Demo
  const [searchCedula, setSearchCedula] = useState("");
  const [operatorSearchResult, setOperatorSearchResult] = useState<{
    found: boolean;
    name?: string;
    cedula?: string;
    status?: string;
    plan?: string;
    validUntil?: string;
    eventsRemaining?: number;
  } | null>(null);

  // Pricing Logic
  const rawSubtotal = selectedModules.reduce((acc, modId) => {
    const item = MODULES_LIST.find((m) => m.id === modId);
    return acc + (item?.priceValue || 0);
  }, 0);

  let discountRate = 0;
  if (selectedModules.length >= 5) discountRate = 0.25;
  else if (selectedModules.length >= 3) discountRate = 0.15;

  const discountedMonthly = Math.round(rawSubtotal * (1 - discountRate));
  const finalPrice =
    billingPeriod === "monthly"
      ? discountedMonthly
      : Math.round(discountedMonthly * 10);

  const toggleModule = (id: string) => {
    if (selectedModules.includes(id)) {
      if (selectedModules.length === 1) return;
      setSelectedModules(selectedModules.filter((m) => m !== id));
    } else {
      setSelectedModules([...selectedModules, id]);
    }
  };

  const handleSelectCombo = () => {
    setSelectedModules(["medica", "ambulancia", "mascotas", "hogar", "odontologica"]);
    const el = document.getElementById("cotizador");
    el?.scrollIntoView({ behavior: "smooth" });
  };

  const startCheckout = () => {
    setCheckoutStep(1);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.docNumber || !formData.fullName || !formData.phone || !formData.email) {
      alert("Por favor completa los campos obligatorios.");
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
    }, 1400);
  };

  const handleOperatorSearch = () => {
    if (!searchCedula.trim()) return;
    if (searchCedula.length >= 7) {
      setOperatorSearchResult({
        found: true,
        name: "Carlos Andrés Villamil",
        cedula: searchCedula,
        status: "ACTIVO Y VIGENTE",
        plan: "Combo 360° Familiar (5 Asistencias)",
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
    <div className="min-h-screen bg-white text-[#626262] flex flex-col font-sans">
      {/* 1. HEADER (Exact BeERP structure: Logo on left, 3 line-icon info items on right, Nav below) */}
      <header className="border-b border-slate-100 bg-white">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6 pt-6 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            {/* BeERP Style Logo: Green striped circle emblem + Navy Bold Text */}
            <div className="flex items-center gap-3.5">
              {/* Green striped circular emblem */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#77da00] via-[#5dab00] to-[#458500] flex items-center justify-center p-2.5 shadow-md shadow-[#5dab00]/25">
                <svg viewBox="0 0 40 40" className="w-full h-full text-white fill-none stroke-current stroke-[3.5] stroke-linecap-round">
                  <path d="M12 8 L22 32" />
                  <path d="M20 8 L30 32" />
                  <circle cx="20" cy="20" r="18" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Logo Typography */}
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-[#03056b] tracking-tight">
                  ERP
                </span>
                <div className="leading-tight">
                  <span className="block text-sm font-bold text-[#040a44]">
                    Soluciones W
                  </span>
                  <span className="block text-[10px] text-[#747474] font-medium tracking-wider uppercase">
                    Asistencias B2C
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Info Indicators (Exact BeERP header right side) */}
            <div className="hidden sm:flex items-center gap-8">
              {/* Item 1 */}
              <div className="flex items-center gap-3">
                <Coins className="w-7 h-7 text-[#03056b] stroke-[1.25]" />
                <div className="text-xs leading-snug">
                  <p className="font-medium text-[#040a44]">Ahorra dinero</p>
                  <p className="text-slate-400">y costos de urgencia</p>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-3">
                <Heart className="w-7 h-7 text-[#03056b] stroke-[1.25]" />
                <div className="text-xs leading-snug">
                  <p className="font-medium text-[#040a44]">Preferido por</p>
                  <p className="text-slate-400">+10.000 afiliados</p>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-3">
                <Settings className="w-7 h-7 text-[#03056b] stroke-[1.25]" />
                <div className="text-xs leading-snug">
                  <p className="font-medium text-[#040a44]">Activación rápida</p>
                  <p className="text-slate-400">en menos de 2 min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Bar (BeERP horizontal text links) */}
          <nav className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-8 text-[15px]">
              <a href="#" className="font-bold text-[#5dab00] transition">
                Inicio
              </a>
              <a href="#modulos" className="font-bold text-[#040a44] hover:text-[#5dab00] transition">
                Módulos
              </a>
              <a href="#cotizador" className="font-bold text-[#040a44] hover:text-[#5dab00] transition">
                Cotizador
              </a>
              <a href="#operador" className="font-bold text-[#040a44] hover:text-[#5dab00] transition">
                Consulta Central
              </a>
              <a href="#contacto" className="font-bold text-[#040a44] hover:text-[#5dab00] transition">
                Emergencias 24/7
              </a>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#5dab00] animate-pulse"></span>
              <span className="text-xs font-semibold text-[#040a44]">Central Despacho Operativa</span>
            </div>
          </nav>
        </div>
      </header>

      {/* 2. HERO SECTION (Faithful recreation of BeERP screenshot 1) */}
      <section className="relative overflow-hidden bg-white border-b border-slate-100 min-h-[580px] flex items-center">
        {/* Right side background image: Collaborative team with clean white left fade */}
        <div
          className="absolute inset-y-0 right-0 w-full lg:w-[65%] bg-no-repeat bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80')`,
          }}
        >
          {/* BeERP soft white gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent"></div>
        </div>

        <div className="relative max-w-[1140px] mx-auto px-4 sm:px-6 w-full py-16 lg:py-24">
          <div className="max-w-[540px]">
            {/* Main Headline (Poppins 300 Light, Deep Navy #040a44) */}
            <h1 className="text-[44px] sm:text-[54px] font-light text-[#040a44] leading-[1.1] tracking-tight">
              Sistema integral y <br />
              fácil de activar de <br />
              asistencia familiar
            </h1>

            {/* BeERP Subheadline: Deep Navy #03056b Bold */}
            <div className="mt-8 mb-8">
              <p className="text-[19px] font-bold text-[#03056b] leading-[26px]">
                Versión 1.0 con 5 módulos esenciales <br />
                Activación digital en menos de 2 minutos
              </p>
            </div>

            {/* BeERP Action Buttons: Solid Lime Green + App Store / WhatsApp badge */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  const el = document.getElementById("cotizador");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="beerp-btn-green px-7 py-3.5 text-[15px] font-semibold tracking-wide shadow-md shadow-[#5dab00]/25 hover:shadow-lg transition"
              >
                Cotizar y Activar Plan
              </button>

              <a
                href="https://wa.me/573203282014"
                target="_blank"
                rel="noreferrer"
                className="bg-black hover:bg-slate-900 text-white px-5 py-2.5 rounded-lg flex items-center gap-3 transition shadow-sm"
              >
                <MessageCircle className="w-6 h-6 text-[#5dab00]" />
                <div className="text-left leading-none">
                  <span className="block text-[10px] text-slate-300 font-light uppercase tracking-wider">
                    Línea Directa 24/7
                  </span>
                  <span className="block text-xs font-bold text-white mt-0.5">
                    WhatsApp Asistencias
                  </span>
                </div>
              </a>
            </div>

            {/* Sub-text under buttons */}
            <div className="mt-4 flex items-center gap-6 text-xs text-slate-400">
              <span>Cobertura Bogotá y Nacional</span>
              <span>•</span>
              <span>Sin cláusulas de permanencia</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "BUY LICENSES / MODULES" SECTION (Exact match to BeERP screenshot 2) */}
      <section id="modulos" className="py-20 lg:py-24 bg-[#ffffff]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          {/* Centered BeERP Heading */}
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h6 className="text-[13px] font-light tracking-[2px] text-[#040a44] uppercase mb-2">
              PORTAFOLIO DE ASISTENCIAS
            </h6>
            <h2 className="text-[32px] sm:text-[36px] font-light text-[#040a44] leading-tight">
              Módulo base con 4 asistencias adicionales <br className="hidden sm:block" />
              listas para tus necesidades
            </h2>
          </div>

          {/* 4-Columns Grid with 3D Spherical Green Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MODULES_LIST.map((mod, index) => {
              const isCombo = mod.id === "combo";
              const isCustom = mod.id === "custom";

              return (
                <div
                  key={mod.id}
                  onClick={() => {
                    if (isCombo) handleSelectCombo();
                    else if (isCustom) {
                      const el = document.getElementById("cotizador");
                      el?.scrollIntoView({ behavior: "smooth" });
                    } else {
                      toggleModule(mod.id);
                    }
                  }}
                  className={`beerp-card p-7 text-center cursor-pointer flex flex-col items-center justify-between min-h-[300px] ${
                    selectedModules.includes(mod.id) && !isCombo && !isCustom
                      ? "border-[#4d70d4] ring-1 ring-[#4d70d4]/30"
                      : ""
                  }`}
                >
                  <div className="flex flex-col items-center w-full">
                    {/* 3D Green Icon Circle (BeERP style) */}
                    <div className="beerp-icon-circle mb-6">
                      {mod.id === "medica" && <Stethoscope className="w-10 h-10 stroke-[2]" />}
                      {mod.id === "ambulancia" && <Ambulance className="w-10 h-10 stroke-[2]" />}
                      {mod.id === "mascotas" && <Dog className="w-10 h-10 stroke-[2]" />}
                      {mod.id === "hogar" && <Home className="w-10 h-10 stroke-[2]" />}
                      {mod.id === "odontologica" && <Smile className="w-10 h-10 stroke-[2]" />}
                      {mod.id === "combo" && <Layers className="w-10 h-10 stroke-[2]" />}
                      {mod.id === "telemedicina" && <ShieldCheck className="w-10 h-10 stroke-[2]" />}
                      {mod.id === "custom" && <Plus className="w-12 h-12 stroke-[2.5]" />}
                    </div>

                    {/* Price tag in #5dab00 */}
                    <span className="text-[13px] font-bold text-[#5dab00] tracking-wide mb-1 block">
                      {mod.priceTag}
                    </span>

                    {/* Module Title (font-light, deep navy) */}
                    <h3 className="text-[20px] font-light text-[#040a44] leading-snug">
                      {mod.name}
                    </h3>
                  </div>

                  <div className="w-full mt-4 pt-3 border-t border-slate-100">
                    <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2">
                      {mod.description}
                    </p>
                    <span className="inline-block mt-2 text-[11px] font-semibold text-[#4d70d4]">
                      {selectedModules.includes(mod.id) ? "✓ Seleccionado" : "+ Agregar a plan"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. INTERACTIVE COTIZADOR & SIMULATOR SECTION */}
      <section id="cotizador" className="py-20 bg-[#fbfcfd] border-t border-b border-slate-100">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h6 className="text-[13px] font-light tracking-[2px] text-[#040a44] uppercase mb-2">
              COTIZADOR EN LÍNEA
            </h6>
            <h2 className="text-[32px] sm:text-[36px] font-light text-[#040a44] leading-tight">
              Calcula tu cuota mensual en tiempo real
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Selecciona las asistencias que deseas proteger y el sistema calculará tu tarifa neta con descuentos por paquete.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Box: Modules Selector */}
            <div className="lg:col-span-7 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-6">
                <span className="text-xs font-bold text-[#040a44] uppercase tracking-wider">
                  Módulos para tu suscripción:
                </span>
                <button
                  onClick={handleSelectCombo}
                  className="text-xs font-bold text-[#5dab00] hover:text-[#509e00] transition"
                >
                  Seleccionar Todo (Combo 25% OFF)
                </button>
              </div>

              <div className="space-y-3">
                {MODULES_LIST.slice(0, 5).map((m) => {
                  const isChecked = selectedModules.includes(m.id);
                  return (
                    <div
                      key={m.id}
                      onClick={() => toggleModule(m.id)}
                      className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                        isChecked
                          ? "border-[#4d70d4] bg-blue-50/20"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                            isChecked
                              ? "bg-[#5dab00] border-[#5dab00] text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#040a44]">{m.name}</p>
                          <p className="text-xs text-slate-400">{m.category}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-sm font-bold text-[#040a44]">
                          ${m.priceValue.toLocaleString("es-CO")}
                        </span>
                        <span className="text-xs text-slate-400 block">COP / mes</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Billing Switch */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#040a44]">Periodo de facturación</p>
                  <p className="text-xs text-slate-400">Paga 10 meses y recibe 12 meses de cobertura</p>
                </div>
                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                  <button
                    onClick={() => setBillingPeriod("monthly")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                      billingPeriod === "monthly"
                        ? "bg-white text-[#040a44] shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    Mensual
                  </button>
                  <button
                    onClick={() => setBillingPeriod("annual")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition ${
                      billingPeriod === "annual"
                        ? "beerp-btn-green text-white shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    Anual (2 Meses Gratis)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Box: Order Summary & Checkout Trigger */}
            <div className="lg:col-span-5 bg-white p-7 sm:p-8 rounded-2xl border border-slate-200 beerp-card-shadow sticky top-8">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                TU PLAN SOLUCIONES W
              </span>
              <h3 className="text-xl font-bold text-[#040a44] mt-1">
                Resumen de Afiliación B2C
              </h3>

              <div className="mt-6 space-y-3 pb-6 border-b border-slate-100 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Módulos incluidos:</span>
                  <span className="font-bold text-[#040a44]">{selectedModules.length} de 5</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal bruto:</span>
                  <span>${rawSubtotal.toLocaleString("es-CO")} COP</span>
                </div>
                {discountRate > 0 && (
                  <div className="flex justify-between text-[#5dab00] font-semibold">
                    <span>Descuento paquete multi-asistencia:</span>
                    <span>- {discountRate * 100}%</span>
                  </div>
                )}
                {billingPeriod === "annual" && (
                  <div className="flex justify-between text-blue-600 font-semibold">
                    <span>Beneficio anual:</span>
                    <span>2 Meses Gratis</span>
                  </div>
                )}
              </div>

              <div className="py-6 border-b border-slate-100">
                <span className="text-xs text-slate-400 uppercase font-semibold">Total a pagar:</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-4xl font-extrabold text-[#03056b]">
                    ${finalPrice.toLocaleString("es-CO")}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">
                    COP / {billingPeriod === "monthly" ? "mes" : "año"}
                  </span>
                </div>
                <p className="text-xs text-[#5dab00] mt-2 flex items-center gap-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  Activación instantánea en menos de 2 minutos
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={startCheckout}
                  className="w-full beerp-btn-green py-3.5 px-4 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Activar Cobertura Ahora</span>
                </button>
                <p className="text-center text-[11px] text-slate-400">
                  Transacción protegida con PSE, Tarjetas y Nequi · Sin permanencia
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BACKOFFICE VERIFICATION MODULE (Wilson Triana's Central Operator Demo) */}
      <section id="operador" className="py-20 bg-[#040a44] text-white">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h6 className="text-[12px] font-light tracking-[2px] text-[#5dab00] uppercase mb-2">
              CENTRAL TELEFÓNICA DE EMERGENCIAS
            </h6>
            <h2 className="text-[32px] font-light text-white leading-tight">
              Visor de Validación Rápida por Cédula
            </h2>
            <p className="mt-3 text-sm text-slate-300">
              Prueba cómo el operador de Soluciones W digita la cédula y confirma la vigencia en menos de 1 segundo al recibir una llamada.
            </p>
          </div>

          <div className="max-w-xl mx-auto bg-slate-900/80 border border-slate-700 p-7 rounded-2xl shadow-xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchCedula}
                onChange={(e) => setSearchCedula(e.target.value)}
                placeholder="Digita cualquier cédula (ej. 1020304050)..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#5dab00]"
              />
              <button
                onClick={handleOperatorSearch}
                className="beerp-btn-green px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" />
                <span>Consultar</span>
              </button>
            </div>

            {operatorSearchResult && (
              <div className="mt-6 pt-6 border-t border-slate-800 animate-in fade-in duration-200">
                {operatorSearchResult.found ? (
                  <div className="bg-slate-950/80 border border-[#5dab00]/40 rounded-xl p-5 text-xs space-y-3">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <div>
                        <p className="text-slate-400">Titular:</p>
                        <p className="text-sm font-bold text-white">{operatorSearchResult.name}</p>
                        <p className="text-slate-500">C.C. {operatorSearchResult.cedula}</p>
                      </div>
                      <span className="bg-[#5dab00]/20 text-[#5dab00] border border-[#5dab00]/40 font-bold px-3 py-1 rounded-full text-[11px] flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#5dab00]"></span>
                        {operatorSearchResult.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-slate-300">
                      <div>
                        <span className="text-slate-500">Plan:</span>
                        <p className="font-semibold text-white">{operatorSearchResult.plan}</p>
                      </div>
                      <div>
                        <span className="text-slate-500">Vigencia hasta:</span>
                        <p className="font-semibold text-white">{operatorSearchResult.validUntil}</p>
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => alert("Simulación: Despacho de ambulancia/técnico confirmado a la dirección del titular.")}
                        className="w-full bg-[#5dab00] hover:bg-[#509e00] text-white font-bold py-2.5 rounded-lg text-xs transition"
                      >
                        Autorizar Despacho de Emergencia
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>No se registra cobertura activa para el documento ingresado.</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. DUAL CONTACT SECTION (Exact BeERP layout: Phone Icon + Cloud Icon) */}
      <section id="contacto" className="py-20 bg-white">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Box Left: Phone Icon (Contact With Us) */}
            <div>
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#5dab00] mb-6">
                <Phone className="w-8 h-8" />
              </div>
              <h6 className="text-[13px] font-light tracking-[2px] text-[#040a44] uppercase mb-1">
                CONTACTO DIRECTO
              </h6>
              <h2 className="text-[28px] sm:text-[32px] font-light text-[#040a44] leading-tight">
                Central de emergencias <br />
                y coordinación 24 horas
              </h2>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-[24px] font-bold text-[#03056b]">
                  +57 (601) 745-9000
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Atención médica, ambulancias y técnicos domiciliarios en Bogotá y perímetro nacional.
                </p>
              </div>
            </div>

            {/* Box Right: Cloud Icon (Afiliación / Start) */}
            <div>
              <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#5dab00] mb-6">
                <Layers className="w-8 h-8" />
              </div>
              <h6 className="text-[13px] font-light tracking-[2px] text-[#040a44] uppercase mb-1">
                AUTOGESTIÓN B2C
              </h6>
              <h2 className="text-[28px] sm:text-[32px] font-light text-[#040a44] leading-tight">
                Activa tu suscripción <br />
                familiar en 2 minutos
              </h2>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-4">
                <button
                  onClick={() => {
                    const el = document.getElementById("cotizador");
                    el?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="beerp-btn-green px-6 py-3 text-xs font-bold uppercase tracking-wider"
                >
                  Cotizar Ahora
                </button>
                <span className="text-xs text-slate-400">Sin papeleos ni exámenes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FOOTER (Exact BeERP 3-columns + bottom copyright line) */}
      <footer className="border-t border-slate-100 bg-[#ffffff] pt-16 pb-12 text-xs text-[#747474]">
        <div className="max-w-[1140px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-12 border-b border-slate-100">
            <div>
              <h4 className="text-base font-semibold text-[#040a44] mb-3">Red de Asistencias</h4>
              <p className="leading-relaxed">
                Médica domiciliaria, ambulancias de urgencia, atención veterinaria, cerrajería, plomería y odontología preventiva.
              </p>
            </div>
            <div>
              <h4 className="text-base font-semibold text-[#040a44] mb-3">Atención al Usuario</h4>
              <p className="leading-relaxed">
                Bogotá D.C., Colombia <br />
                Línea PBX: +57 (601) 745-9000 <br />
                WhatsApp: +57 320 328 2014
              </p>
            </div>
            <div>
              <h4 className="text-base font-semibold text-[#040a44] mb-3">Marco Legal</h4>
              <p className="leading-relaxed">
                Habeas Data Ley 1581 de 2012. Soluciones W es un servicio de auxilio y asistencia operativa; no constituye entidad aseguradora ni EPS.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Soluciones W. Desarrollado bajo arquitectura Next.js y Tailwind CSS.</p>
            <p>Dirección General: Wilson Triana</p>
          </div>
        </div>
      </footer>

      {/* 8. CHECKOUT & INSTANT EMISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#040a44] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#5dab00] font-bold uppercase tracking-wider">
                  PASO {checkoutStep} DE 3
                </p>
                <h3 className="text-base font-bold text-white">
                  {checkoutStep === 1 && "Registro Express del Titular"}
                  {checkoutStep === 2 && "Pago Seguro con Pasarela (Wompi)"}
                  {checkoutStep === 3 && "¡Certificado de Cobertura Emitido!"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto">
              {checkoutStep === 1 && (
                <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Tipo Doc.</label>
                      <select
                        value={formData.docType}
                        onChange={(e) => setFormData({ ...formData, docType: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                      >
                        <option value="CC">C.C.</option>
                        <option value="CE">C.E.</option>
                        <option value="NIT">NIT</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block font-semibold text-slate-700 mb-1">Número de Documento *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ej: 1020304050"
                        value={formData.docNumber}
                        onChange={(e) => setFormData({ ...formData, docNumber: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Wilson Andrés Triana"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Celular / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej: 320 123 4567"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        placeholder="correo@ejemplo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Dirección y Ciudad</label>
                    <input
                      type="text"
                      placeholder="Ej: Carrera 15 # 85-30, Bogotá"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900"
                    />
                  </div>

                  <div className="pt-2">
                    <label className="flex items-start gap-2 text-slate-600">
                      <input type="checkbox" defaultChecked required className="mt-0.5 rounded text-[#5dab00]" />
                      <span>Acepto términos de servicio y autorización de datos (Habeas Data Ley 1581).</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full beerp-btn-green py-3 rounded-xl font-bold uppercase tracking-wider mt-4"
                  >
                    Continuar al Pago Seguro
                  </button>
                </form>
              )}

              {checkoutStep === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between">
                    <div>
                      <p className="font-bold text-[#040a44]">{formData.fullName}</p>
                      <p className="text-slate-400">C.C. {formData.docNumber}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">Total a pagar:</span>
                      <span className="text-base font-extrabold text-[#03056b]">
                        ${finalPrice.toLocaleString("es-CO")} COP
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod("pse")}
                      className={`p-3 rounded-xl border text-center font-bold ${
                        paymentMethod === "pse" ? "border-[#5dab00] bg-emerald-50 text-[#5dab00]" : "border-slate-200"
                      }`}
                    >
                      PSE
                    </button>
                    <button
                      onClick={() => setPaymentMethod("nequi")}
                      className={`p-3 rounded-xl border text-center font-bold ${
                        paymentMethod === "nequi" ? "border-[#5dab00] bg-emerald-50 text-[#5dab00]" : "border-slate-200"
                      }`}
                    >
                      Nequi
                    </button>
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3 rounded-xl border text-center font-bold ${
                        paymentMethod === "card" ? "border-[#5dab00] bg-emerald-50 text-[#5dab00]" : "border-slate-200"
                      }`}
                    >
                      Tarjeta
                    </button>
                  </div>

                  <button
                    onClick={handlePaymentSimulation}
                    disabled={isProcessing}
                    className="w-full beerp-btn-green py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 mt-4"
                  >
                    {isProcessing ? (
                      <span>Emitiendo certificado oficial...</span>
                    ) : (
                      <span>Simular Aprobación de Pago</span>
                    )}
                  </button>
                </div>
              )}

              {checkoutStep === 3 && generatedPolicy && (
                <div className="text-center space-y-4 text-xs">
                  <div className="w-14 h-14 bg-emerald-100 text-[#5dab00] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#040a44]">¡Afiliación Activa!</h4>
                    <p className="text-slate-400">Emisión digital automática completada en 1.4 segundos.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Contrato:</span>
                      <span className="font-mono font-bold text-[#03056b]">{generatedPolicy.contractNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Titular:</span>
                      <span className="font-semibold text-slate-800">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Documento:</span>
                      <span className="font-semibold text-slate-800">{formData.docNumber}</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <button
                      onClick={() => alert(`Certificado ${generatedPolicy.contractNumber}.pdf generado exitosamente.`)}
                      className="w-full beerp-btn-green py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Descargar Certificado PDF</span>
                    </button>
                    <a
                      href={`https://wa.me/573203282014?text=Hola%20Soluciones%20W,%20acabo%20de%20afiliarme%20con%20contrato%20${generatedPolicy.contractNumber}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-[#040a44] text-white py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Guardar Central en WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import RappiMemberHub from "@/components/RappiMemberHub";
import MemberLoginModal from "@/components/MemberLoginModal";
import {
  Stethoscope,
  Ambulance,
  Dog,
  Home,
  Smile,
  ShieldCheck,
  CheckCircle2,
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
  ChevronDown,
  ChevronUp,
  Phone,
  Layers,
  Sparkles,
  HelpCircle,
  CheckCheck,
  Shield,
  User,
  Globe,
  CheckSquare,
  Clock
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
    name: "Medicina Domiciliaria",
    priceTag: "BASE ESENCIAL",
    priceValue: 18900,
    category: "Salud Familiar",
    description: "Médico general en la comodidad de tu hogar y telemedicina 24/7 sin copagos ni filas.",
    features: [
      "Médico general a domicilio (hasta 3 consultas/año)",
      "Telemedicina 24/7 con fórmula médica digital",
      "Orientación telefónica en medicina general y pediatría",
      "Envío de medicamentos básicos post-consulta"
    ],
    limit: "Hasta $250.000 COP por consulta domiciliaria"
  },
  {
    id: "ambulancia",
    name: "Ambulancia & Urgencias",
    priceTag: "$14.900+",
    priceValue: 14900,
    category: "Respuesta Inmediata",
    description: "Traslado medicalizado prioritario ante accidentes o complicaciones de salud.",
    features: [
      "Ambulancia medicalizada y básica 24/7",
      "Estabilización y primeros auxilios en sitio",
      "Traslado prioritario a centros de la red hospitalaria",
      "Cobertura urbana en Bogotá y ciudades principales"
    ],
    limit: "Hasta 2 traslados anuales 100% cubiertos"
  },
  {
    id: "mascotas",
    name: "Mascotas (Pet Care)",
    priceTag: "$15.900+",
    priceValue: 15900,
    category: "Veterinaria",
    description: "Atención veterinaria de urgencia para tus perros y gatos ante accidentes e imprevistos.",
    features: [
      "Consulta veterinaria presencial por urgencia",
      "Teleorientación veterinaria 24 horas",
      "Auxilio de guardería si el amo es hospitalizado",
      "1 vacuna preventiva o desparasitación anual"
    ],
    limit: "Hasta $200.000 COP por evento (máx. 2 al año)"
  },
  {
    id: "hogar",
    name: "Asistencia Hogar",
    priceTag: "$16.900+",
    priceValue: 16900,
    category: "Técnicos a Domicilio",
    description: "Auxilio express ante roturas de tuberías, cortes eléctricos y cerrajería de emergencia.",
    features: [
      "Plomería de emergencia por fuga o inundación",
      "Cerrajería 24/7 por pérdida o daño de llaves",
      "Electricidad de urgencia por corto circuito",
      "Mano de obra y materiales básicos cubiertos"
    ],
    limit: "Hasta $220.000 COP por evento (máx. 3 eventos/año)"
  },
  {
    id: "odontologica",
    name: "Odontología Integral",
    priceTag: "$12.900+",
    priceValue: 12900,
    category: "Salud Oral",
    description: "Urgencias por dolor agudo y prevención con limpieza anual en centros odontológicos aliados.",
    features: [
      "Atención de urgencia odontológica por dolor o trauma",
      "1 profilaxis y limpieza profunda al año sin costo",
      "Valoración diagnóstica con radiografías preliminares",
      "Descuentos del 35% al 50% en tratamientos clínicos"
    ],
    limit: "1 Urgencia cubierta al 100% + 1 profilaxis anual"
  }
];

const FAQS = [
  {
    q: "¿Tengo que pagar copagos o cuotas moderadoras al usar el servicio?",
    a: "No. A diferencia de las EPS o medicinas prepagadas tradicionales, en Soluciones W los eventos cubiertos dentro del tope anual no tienen copagos ni cuotas adicionales. Solo pagas tu suscripción mensual."
  },
  {
    q: "¿Cuánto tiempo tarda en activarse la cobertura una vez pago en línea?",
    a: "La activación es instantánea. Nuestro motor digital emite tu certificado oficial de cobertura en menos de 2 minutos tras la confirmación de pago, y quedas inmediatamente registrado en la central de emergencias."
  },
  {
    q: "¿Cómo solicito una ambulancia, un médico o un cerrajero ante una urgencia?",
    a: "Muy fácil: marcas a nuestra línea directa de emergencias (601) 745-9000 o abres nuestro chat de WhatsApp oficial. El operador digita tu número de cédula en el sistema y despacha la asistencia de inmediato sin pedirte papeles físicos."
  },
  {
    q: "¿Hay cláusula de permanencia mínima?",
    a: "Ninguna. Puedes cancelar tu suscripción mensual cuando lo desees directamente desde tu panel o escribiendo a nuestro WhatsApp de atención sin penalizaciones."
  },
  {
    q: "¿Qué incluye la asistencia veterinaria para mascotas?",
    a: "Cubre consultas de urgencia ante enfermedades agudas o accidentes para perros y gatos, teleorientación veterinaria 24 horas y un procedimiento preventivo (vacuna o desparasitación) al año."
  }
];

export default function HomeView() {
  // Plan selection
  const [selectedPlan, setSelectedPlan] = useState<"virtual" | "tradicional" | "plus">("plus");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  
  // Hero Quick Lead Form
  const [quickLead, setQuickLead] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "plus"
  });

  // Full Checkout Modal
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
  const [paymentMethod, setPaymentMethod] = useState<"pse" | "card" | "nequi">("card");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    exp: "",
    cvc: "",
    installments: "1"
  });
  const [nequiPhone, setNequiPhone] = useState("");
  const [pseBank, setPseBank] = useState("bancolombia");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPolicy, setGeneratedPolicy] = useState<{
    contractNumber: string;
    date: string;
    totalPaid: number;
    planName: string;
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

  // FAQ Accordion
    const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Authentication & Member Hub (Rappi Style)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [paymentGateway, setPaymentGateway] = useState<"wompi" | "mercadopago">("wompi");
  const [memberData, setMemberData] = useState({
    fullName: "Carlos Andrés Villamil",
    docNumber: "1018492031",
    phone: "313 428 9397",
    email: "carlos.villamil@gmail.com",
    contractNumber: "SW-849102",
    planName: "Plan Plus Familiar 360°",
    validUntil: "04 de Noviembre, 2026",
    address: "Carrera 15 # 85-30, Bogotá"
  });

  // Pricing Matrix
  const planPrices = {
    virtual: { monthly: 24900, name: "Plan Básico Digital" },
    tradicional: { monthly: 39900, name: "Plan Tradicional Hogar & Salud" },
    plus: { monthly: 54900, name: "Plan Plus Familiar 360°" }
  };

  const currentPriceMonthly = planPrices[selectedPlan].monthly;
  const currentFinalPrice =
    billingPeriod === "monthly"
      ? currentPriceMonthly
      : Math.round(currentPriceMonthly * 10); // 2 months free

  const handleHeroLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLead.name || !quickLead.phone || !quickLead.email) {
      alert("Por favor completa los campos obligatorios.");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      fullName: quickLead.name,
      phone: quickLead.phone,
      email: quickLead.email
    }));
    setCheckoutStep(1);
    setIsModalOpen(true);
  };

  const handleSelectPlanAndCheckout = (planKey: "virtual" | "tradicional" | "plus") => {
    setSelectedPlan(planKey);
    setCheckoutStep(1);
    setIsModalOpen(true);
  };

  const handlePaymentSimulation = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const randomContract = "SW-" + Math.floor(100000 + Math.random() * 900000);
      const policyData = {
        contractNumber: randomContract,
        date: new Date().toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" }),
        totalPaid: currentFinalPrice,
        planName: planPrices[selectedPlan].name
      };
      setGeneratedPolicy(policyData);
      setMemberData({
        fullName: formData.fullName || "Nuevo Afiliado",
        docNumber: formData.docNumber || "1020304050",
        phone: formData.phone || "300 123 4567",
        email: formData.email || "afiliado@correo.com",
        contractNumber: randomContract,
        planName: planPrices[selectedPlan].name,
        validUntil: "Noviembre 2026",
        address: formData.address || "Bogotá D.C., Colombia"
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
        plan: planPrices[selectedPlan].name,
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

  if (isAuthenticated) {
    return (
      <RappiMemberHub
        member={memberData}
        onLogout={() => setIsAuthenticated(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-700 flex flex-col font-sans pb-16 md:pb-0">
      {/* 1. TOP NAVBAR (High contrast, professional and clean) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          {/* Logo Oficial Soluciones W (Upscaled HD) */}
          <a
            href="/"
            onClick={(e) => {
              if (window.location.pathname === "/") {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }
            }}
            className="flex items-center gap-3.5 group cursor-pointer transition-opacity hover:opacity-95"
            title="Soluciones W - Ir al Inicio"
          >
            <img
              src="/images/logo-soluciones-w.png"
              alt="Soluciones W Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
            />
            <div className="hidden sm:flex flex-col justify-center border-l border-slate-200 pl-3.5 h-9 sm:h-10">
              <span className="text-[11px] font-extrabold text-[#167394] tracking-wider uppercase leading-tight">
                Plataforma de Afiliaciones
              </span>
              <p className="text-[10px] text-slate-500 font-medium tracking-wide uppercase leading-tight mt-0.5">
                Asistencia Familiar & Hogar · Dir. Wilson Triana
              </p>
            </div>
          </a>

          {/* Right Section: Member Hub Login + Phone + WhatsApp CTA */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Direct Phone Call */}
            <a
              href="tel:6017459000"
              className="hidden xl:flex items-center gap-2.5 text-left hover:opacity-90 transition"
            >
              <div className="w-9 h-9 rounded-full bg-[#e8f4f8] flex items-center justify-center text-[#167394]">
                <Phone className="w-4 h-4" />
              </div>
              <div className="leading-tight">
                <span className="block text-[10px] text-slate-500 font-medium">Central 24/7</span>
                <span className="block text-xs font-bold text-[#0a5278]">601 745 90 00</span>
              </div>
            </a>

            {/* "Soy Afiliado" button -> Rappi Hub */}
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="bg-white hover:bg-slate-50 text-[#167394] border border-[#167394]/30 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-xs transition"
            >
              <User className="w-4 h-4 text-[#167394]" />
              <span>Soy Afiliado</span>
            </button>

            {/* WhatsApp CTA Button */}
            <a
              href="https://wa.me/573134289397"
              target="_blank"
              rel="noreferrer"
              className="bg-[#167394] hover:bg-[#0a5278] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm hover:shadow-md transition"
            >
              <MessageCircle className="w-4 h-4 text-white" />
              <span className="hidden xs:inline">Asesoría</span> WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* 2. HERO BANNER WITH PROFESSIONAL ENTERPRISE BACKGROUND IMAGE */}
      <section className="relative overflow-hidden border-b border-slate-200 py-14 lg:py-24 bg-[#063a57]">
        {/* Background Image of Computers / Modern Workspace with Soft Protective Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-right lg:bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=85')`,
          }}
        >
          {/* Luminous gradient overlay ensuring 100% contrast for text and visibility of computers */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#063a57]/95 via-[#063a57]/85 to-[#0a5278]/60 lg:to-[#0a5278]/35 backdrop-blur-[0.5px]"></div>
        </div>

        <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Content: Enterprise Typography & High Contrast */}
            <div className="lg:col-span-7 space-y-6">
              {/* H1 Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-white leading-[1.12] tracking-tight">
                Con Soluciones W, <br className="hidden sm:inline" />
                estarás seguro y <br className="hidden sm:inline" />
                <span className="text-cyan-300">protegido 24/7</span>
              </h1>

              {/* Subheading in Inter */}
              <p className="text-base sm:text-lg text-slate-100 font-normal leading-relaxed max-w-xl">
                Atención médica domiciliaria, ambulancia, asistencia para mascotas y auxilio en el hogar 
                para ti y tus seres queridos en una sola suscripción mensual sin intermediarios.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-3.5">
                <a
                  href="https://wa.me/573134289397"
                  target="_blank"
                  rel="noreferrer"
                  className="bg-[#25D366] hover:bg-[#20ba59] text-white px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-md hover:shadow-lg"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>Chatea con un asesor</span>
                </a>

                <a
                  href="tel:6017459000"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition shadow-sm"
                >
                  <Phone className="w-4 h-4 text-cyan-300" />
                  <span>Llamar a la Central</span>
                </a>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-white/15 flex flex-wrap gap-6 text-xs text-slate-200 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-cyan-300" />
                  <span>Sin períodos de carencia</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-cyan-300" />
                  <span>Sin exámenes médicos</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCheck className="w-4 h-4 text-cyan-300" />
                  <span>Sin permanencia</span>
                </div>
              </div>
            </div>

            {/* Right Card: Formulario ¡Afíliate en línea ya! */}
            <div className="lg:col-span-5">
              <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl shadow-black/25 border border-slate-200 relative">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-[#063a57]">
                    ¡Afíliate en línea ya!
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Completa tus datos y activa tu plan en 2 minutos.
                  </p>
                </div>

                <form onSubmit={handleHeroLeadSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Nombre y apellido *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ingresa tu nombre completo"
                      value={quickLead.name}
                      onChange={(e) => setQuickLead({ ...quickLead, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-[#167394] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Correo electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="ejemplo.correo@gmail.com"
                      value={quickLead.email}
                      onChange={(e) => setQuickLead({ ...quickLead, email: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-[#167394] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="300 000 00 00"
                      value={quickLead.phone}
                      onChange={(e) => setQuickLead({ ...quickLead, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-[#167394] focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Plan de Interés
                    </label>
                    <select
                      value={selectedPlan}
                      onChange={(e) => setSelectedPlan(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 focus:outline-none focus:border-[#167394] focus:bg-white transition font-medium"
                    >
                      <option value="plus">Plan Plus Familiar 360° ($54.900/mes) - Recomendado</option>
                      <option value="tradicional">Plan Tradicional Hogar & Salud ($39.900/mes)</option>
                      <option value="virtual">Plan Básico Digital ($24.900/mes)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#167394] hover:bg-[#0a5278] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Continuar Afiliación</span>
                    <ArrowRight className="w-4 h-4 text-white" />
                  </button>

                  <div className="pt-2 text-center text-[10px] text-slate-400 space-y-1">
                    <p>* Campos obligatorios</p>
                    <p>
                      Al continuar, estás aceptando nuestros{" "}
                      <a href="#terminos" className="text-[#063a57] font-semibold underline">
                        términos y condiciones
                      </a>{" "}
                      y política de Habeas Data.
                    </p>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. SECCIÓN DE PLANES (CRISP, HIGH CONTRAST & ACCESSIBLE FOR ALL FAMILY MEMBERS) */}
      <section id="planes" className="py-20 lg:py-24 bg-[#f8fafc] border-b border-slate-200">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[32px] sm:text-[38px] font-light text-[#063a57] leading-tight">
              Planes Soluciones W
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              Selecciona el plan que mejor se adapte a tu familia y activa tu certificado oficial en línea.
            </p>

            {/* Switch Mensual / Anual */}
            <div className="mt-6 inline-flex items-center bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                  billingPeriod === "monthly" ? "bg-[#063a57] text-white shadow" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Pago Mensual
              </button>
              <button
                onClick={() => setBillingPeriod("annual")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
                  billingPeriod === "annual" ? "bg-[#167394] hover:bg-[#0a5278] text-white text-white shadow" : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Pago Anual (2 Meses Gratis)
              </button>
            </div>
          </div>

          {/* Cards Grid: 3 Planes (Sober, Institutional Insurance Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            
            {/* Plan 1: Virtual / Básico */}
            <div className="bg-white rounded-lg p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition relative border border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                  Básico Individual
                </span>
                <h3 className="text-xl font-bold text-[#063a57]">{planPrices.virtual.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[34px]">
                  Atención médica 100% virtual sin esperas, ideal para personas jóvenes e independientes.
                </p>

                <div className="my-6 py-4 border-t border-b border-slate-100 text-center bg-slate-50 rounded-md">
                  <span className="text-xs text-slate-500 block">Tarifa Neta</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-extrabold text-[#0a5278]">
                      ${(billingPeriod === "monthly" ? 24900 : 249000).toLocaleString("es-CO")}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      COP / {billingPeriod === "monthly" ? "mes" : "año"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Por persona · Sin copagos</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span>Telemedicina ilimitada 24/7 con fórmula médica digital</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span>Orientación médica y pediátrica telefónica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span>Odontología preventiva (1 profilaxis anual sin costo)</span>
                  </li>
                  <li className="flex items-start gap-2 text-slate-400">
                    <X className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                    <span>No incluye médico domiciliario presencial</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlanAndCheckout("virtual")}
                className="w-full bg-[#063a57] hover:bg-[#0a5278] text-white py-3 rounded-md font-bold uppercase tracking-wider text-xs transition"
              >
                Elegir Plan Virtual
              </button>
            </div>

            {/* Plan 2: Tradicional Hogar & Salud */}
            <div className="bg-white rounded-lg p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition relative border border-slate-200">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block mb-1">
                  Protección Hogar
                </span>
                <h3 className="text-xl font-bold text-[#063a57]">{planPrices.tradicional.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[34px]">
                  Médico a domicilio, ambulancia y auxilio básico para reparaciones urgentes del hogar.
                </p>

                <div className="my-6 py-4 border-t border-b border-slate-100 text-center bg-slate-50 rounded-md">
                  <span className="text-xs text-slate-500 block">Tarifa Neta</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-extrabold text-[#0a5278]">
                      ${(billingPeriod === "monthly" ? 39900 : 399000).toLocaleString("es-CO")}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      COP / {billingPeriod === "monthly" ? "mes" : "año"}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Por persona · Sin copagos</span>
                </div>

                <ul className="space-y-3 text-xs text-slate-600 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span>Médico general presencial a domicilio (hasta 3 eventos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span>Traslado de ambulancia medicalizada y básica 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span>Plomería y cerrajería de urgencia en el hogar</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span>Telemedicina ilimitada + Odontología preventiva</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlanAndCheckout("tradicional")}
                className="w-full bg-[#063a57] hover:bg-[#0a5278] text-white py-3 rounded-md font-bold uppercase tracking-wider text-xs transition"
              >
                Elegir Plan Tradicional
              </button>
            </div>

            {/* Plan 3: Plan Plus Familiar 360° (MÁS POPULAR / INTEGRATED BANNER) */}
            <div className="bg-white rounded-lg p-7 flex flex-col justify-between shadow-md relative border-2 border-[#167394] overflow-hidden">
              {/* Integrated Header Banner - Never overflows or wraps awkwardly */}
              <div className="bg-[#167394] text-white text-[11px] font-bold uppercase tracking-wider py-1.5 px-4 text-center -mx-7 -mt-7 mb-6">
                ★ Plan Más Popular · Recomendado
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#167394] block mb-1">
                  Protección Integral 360°
                </span>
                <h3 className="text-xl font-bold text-[#063a57]">{planPrices.plus.name}</h3>
                <p className="text-xs text-slate-500 mt-1 min-h-[34px]">
                  Cobertura completa: Salud, Ambulancia, Mascotas, Hogar y Odontología.
                </p>

                <div className="my-6 py-4 border-t border-b border-slate-100 text-center bg-[#e8f4f8] rounded-md">
                  <span className="text-xs text-[#0a5278] font-semibold block">Tarifa Especial Combo</span>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-extrabold text-[#0a5278]">
                      ${(billingPeriod === "monthly" ? 54900 : 549000).toLocaleString("es-CO")}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      COP / {billingPeriod === "monthly" ? "mes" : "año"}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#167394] font-bold block mt-1">
                    Incluye las 5 Asistencias Esenciales
                  </span>
                </div>

                <ul className="space-y-3 text-xs text-slate-700 mb-8">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-900">Médico a domicilio + Telemedicina 24/7</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-900">Ambulancia medicalizada prioritaria</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-900">Asistencia veterinaria para mascotas (urgencias y vacunas)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-900">Plomería, cerrajería y electricidad en casa</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#167394] shrink-0 mt-0.5" />
                    <span className="font-semibold text-slate-900">Odontología de urgencia + 1 limpieza profunda anual</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => handleSelectPlanAndCheckout("plus")}
                className="w-full bg-[#167394] hover:bg-[#0a5278] text-white py-3.5 rounded-md font-bold uppercase tracking-wider text-xs shadow transition"
              >
                Activar Plan Plus 360°
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DETALLE DE COBERTURAS (Pure White Canvas with 3D Spherical Green Icons) */}
      <section id="servicios" className="py-20 lg:py-24 bg-white">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-[32px] sm:text-[36px] font-light text-[#063a57] leading-tight">
              Los 5 Pilares de Asistencia en Soluciones W
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              Conoce el alcance específico y los límites garantizados para cada una de nuestras coberturas.
            </p>
          </div>

          {/* Carrusel horizontal en móvil / Grid en desktop */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 overflow-x-auto md:overflow-x-visible pb-6 md:pb-0 snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0">
            {MODULES_LIST.map((mod) => (
              <div
                key={mod.id}
                className="beerp-card p-6 sm:p-7 flex flex-col justify-between shrink-0 w-[85vw] max-w-[340px] md:w-auto md:max-w-none snap-center"
              >
                <div>
                  {/* BeERP 3D Spherical Green Icon */}
                  <div className="beerp-icon-circle mb-5">
                    {mod.id === "medica" && <Stethoscope className="w-10 h-10" />}
                    {mod.id === "ambulancia" && <Ambulance className="w-10 h-10" />}
                    {mod.id === "mascotas" && <Dog className="w-10 h-10" />}
                    {mod.id === "hogar" && <Home className="w-10 h-10" />}
                    {mod.id === "odontologica" && <Smile className="w-10 h-10" />}
                  </div>

                  <span className="text-xs font-bold text-[#167394] uppercase tracking-wide">
                    {mod.category}
                  </span>
                  <h3 className="text-xl font-bold text-[#063a57] mt-1 mb-2">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    {mod.description}
                  </p>

                  <ul className="space-y-2 text-xs text-slate-600 mb-6">
                    {mod.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#167394] shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-600">
                  <strong className="text-slate-800">Límite garantizado:</strong> {mod.limit}
                </div>
              </div>
            ))}

            {/* Banner card de contacto */}
            <div className="bg-gradient-to-br from-[#0a5278] to-[#063a57] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xl shrink-0 w-[85vw] max-w-[340px] md:w-auto md:max-w-none snap-center">
              <div>
                <span className="bg-[#167394] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  ATENCIÓN 24 HORAS
                </span>
                <h3 className="text-2xl font-bold text-white mt-4 leading-snug">
                  ¿Necesitas asistencia en este instante?
                </h3>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Llama a nuestra central médica y técnica. Un operador verificará tu cédula y despachará el auxilio de inmediato.
                </p>
                <div className="my-6 pt-4 border-t border-white/20">
                  <span className="text-xs text-slate-300 block">Línea Nacional</span>
                  <p className="text-2xl font-bold text-white">+57 (601) 745-9000</p>
                </div>
              </div>

              <a
                href="https://wa.me/573134289397"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#167394] hover:bg-[#0a5278] text-white py-3.5 rounded-xl text-center font-bold text-xs uppercase tracking-wider block text-white shadow-md hover:shadow-lg transition"
              >
                Abrir WhatsApp de Emergencias
              </a>
            </div>
          </div>

          {/* Indicador táctil en móvil */}
          <div className="md:hidden flex items-center justify-center gap-2 mt-2 text-[11px] text-slate-400 font-medium">
            <span>← Desliza horizontalmente para explorar coberturas →</span>
          </div>
        </div>
      </section>

      {/* 5. MEDIOS DE PAGO ACEPTADOS & PASARELAS DE CONFIANZA */}
      <section id="pagos" className="py-16 lg:py-20 bg-slate-50 border-t border-b border-slate-200">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#063a57] tracking-tight">
              Paga fácil con tus medios favoritos en Colombia
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-3 leading-relaxed">
              Integrado con pasarelas certificadas con cifrado bancario SSL de 256 bits. Activa tu plan mensual con la opción que prefieras, <strong>sin cláusulas de permanencia</strong> y con emisión digital en menos de 2 minutos.
            </p>
          </div>

          {/* Grid de Medios de Pago con Logos e Información Real */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. PSE Débito */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#167394]/50 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shadow-xs">
                    <img
                      src="/images/payments/pse.png"
                      alt="PSE Pagos Seguros en Línea"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  PSE Débito Bancario
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Paga al instante debitando de tu cuenta de ahorros o corriente de todos los bancos en Colombia.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-700">Sin comisiones</span>
                <span className="text-slate-400 font-mono text-[10px]">Aprobación Inmediata</span>
              </div>
            </div>

            {/* 2. Nequi */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#167394]/50 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4 mx-auto">
                  <div className="h-12 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 shadow-xs">
                    <img
                      src="/images/payments/nequi.svg"
                      alt="Nequi Colombia"
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Nequi
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pago rápido y seguro desde tu celular mediante notificación push o código dinámico de la app.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-700">100% Desde el móvil</span>
                <span className="text-slate-400 font-mono text-[10px]">En 5 segundos</span>
              </div>
            </div>

            {/* 3. Tarjetas Crédito & Débito */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#167394]/50 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 shadow-xs">
                    <img
                      src="/images/payments/visa.svg"
                      alt="Visa"
                      className="h-3.5 w-auto object-contain"
                    />
                    <div className="h-5 w-px bg-slate-200" />
                    <img
                      src="/images/payments/mastercard.svg"
                      alt="Mastercard"
                      className="h-6 w-auto object-contain"
                    />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Visa & Mastercard
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Tarjetas de crédito y débito con soporte para pago recurrente automático mensual sin interrupciones.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-700">Débito automático opcional</span>
                <span className="text-slate-400 font-mono text-[10px]">Cifrado 3D Secure</span>
              </div>
            </div>

            {/* 4. Daviplata */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-[#167394]/50 transition flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-12 px-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-xs">
                    <img
                      src="/images/payments/daviplata.svg"
                      alt="DaviPlata"
                      className="h-7 w-auto object-contain"
                    />
                  </div>
                </div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">
                  Daviplata
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Autorización rápida con saldo disponible en tu billetera digital Daviplata de forma confiable.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-700">Sin trámites</span>
                <span className="text-slate-400 font-mono text-[10px]">Inmediato</span>
              </div>
            </div>
          </div>

          {/* Complemento de Confianza: Pasarelas Oficiales & Sellos de Seguridad */}
          <div className="mt-8 bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-700">
              <span className="font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#167394]" />
                Pasarelas Oficiales:
              </span>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M4 12C4 7.58172 7.58172 4 12 4" stroke="#FDDA24" strokeWidth="3" strokeLinecap="round" />
                  <path d="M12 4C16.4183 4 20 7.58172 20 12" stroke="#00C389" strokeWidth="3" strokeLinecap="round" />
                  <path d="M20 12C20 16.4183 16.4183 20 12 20" stroke="#002F6C" strokeWidth="3" strokeLinecap="round" />
                </svg>
                <span className="font-bold text-[#002F6C]">Wompi</span>
                <span className="text-[10px] text-slate-400">Grupo Bancolombia</span>
              </div>
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                <div className="w-4 h-4 rounded-full bg-[#009EE3] flex items-center justify-center text-white text-[8px] font-bold">
                  MP
                </div>
                <span className="font-bold text-[#009EE3]">Mercado Pago</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 font-medium">
              <span className="flex items-center gap-1.5">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                Cero permanencia (Cancela cuando desees)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                Cifrado SSL 256-Bit
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                Factura electrónica automática
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OPERATOR LOOKUP DEMO (Wilson Triana's Call Center Validator - Rich Blue Section Contrast with Crisp White Card) */}
      <section id="operador" className="py-20 bg-gradient-to-br from-[#063a57] via-[#0a5278] to-[#167394] text-white relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#167394]/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="max-w-2xl mx-auto text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Búsqueda Rápida del Operador Telefónico
            </h2>
            <p className="mt-3 text-sm text-cyan-100/90 leading-relaxed">
              Así consulta el operador de Wilson Triana el estado del afiliado en menos de 1 segundo al recibir una llamada o mensaje de emergencia.
            </p>
          </div>

          <div className="max-w-2xl mx-auto bg-white text-slate-800 border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-2xl">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchCedula}
                  onChange={(e) => setSearchCedula(e.target.value)}
                  placeholder="Digita cualquier número de cédula (ej. 1018492031)..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3.5 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-[#167394] focus:bg-white focus:ring-2 focus:ring-[#167394]/15 transition font-medium"
                />
              </div>
              <button
                onClick={handleOperatorSearch}
                className="bg-[#167394] hover:bg-[#0a5278] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md hover:shadow-lg flex items-center justify-center gap-2 shrink-0"
              >
                <Search className="w-4 h-4 text-white" />
                <span>Consultar</span>
              </button>
            </div>

            {/* Quick Demo Helper */}
            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Tip: Digita 7 o más dígitos para simular un afiliado activo.</span>
              <button
                type="button"
                onClick={() => {
                  setSearchCedula("1018492031");
                  setTimeout(() => {
                    setOperatorSearchResult({
                      found: true,
                      name: "Carlos Andrés Villamil",
                      cedula: "1018492031",
                      status: "ACTIVO Y VIGENTE",
                      plan: "Plan Plus Familiar 360°",
                      validUntil: "04 de Noviembre, 2026",
                      eventsRemaining: 3
                    });
                  }, 100);
                }}
                className="text-[#167394] font-semibold hover:underline"
              >
                Probar con C.C. Demo
              </button>
            </div>

            {operatorSearchResult && (
              <div className="mt-6 pt-6 border-t border-slate-100 animate-in fade-in duration-200">
                {operatorSearchResult.found ? (
                  <div className="bg-[#f8fcfe] border border-[#167394]/25 rounded-2xl p-5 sm:p-6 text-xs space-y-4 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                          Titular Afiliado
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-[#063a57]">
                          {operatorSearchResult.name}
                        </h4>
                        <p className="text-slate-500 font-mono text-[11px]">
                          C.C. {operatorSearchResult.cedula}
                        </p>
                      </div>
                      <div>
                        <span className="bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-full text-[11px] inline-flex items-center gap-1.5 shadow-xs">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                          {operatorSearchResult.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-medium block">Plan Contratado:</span>
                        <p className="font-bold text-[#0a5278] text-xs mt-0.5">
                          {operatorSearchResult.plan}
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-medium block">Vigencia Oficial:</span>
                        <p className="font-bold text-slate-800 text-xs mt-0.5">
                          {operatorSearchResult.validUntil}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => alert("Simulación: Solicitud de despacho enviada en tiempo real a la red médica y técnica.")}
                      className="w-full bg-[#167394] hover:bg-[#0a5278] text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider transition shadow-sm flex items-center justify-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-cyan-200" />
                      <span>Autorizar Despacho de Auxilio Inmediato</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-xs text-red-800 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">No se registra cobertura activa</p>
                      <p className="text-slate-600 mt-0.5">
                        El documento ingresado no cuenta con una suscripción vigente en la base de datos de Soluciones W.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 7. PREGUNTAS FRECUENTES (Clean Accordion) */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h6 className="text-[12px] font-bold tracking-[2px] text-[#167394] uppercase mb-2">
              RESOLVEMOS TUS DUDAS
            </h6>
            <h2 className="text-3xl font-light text-[#063a57]">
              Preguntas Frecuentes
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 rounded-xl overflow-hidden transition"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition"
                  >
                    <span className="text-sm font-semibold text-[#063a57]">
                      {faq.q}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#167394] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-white pt-16 pb-12 text-xs text-slate-500 border-t border-slate-200">
        <div className="max-w-[1180px] mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-12 border-b border-slate-200">
            <div>
              <h4 className="text-sm font-bold text-[#063a57] mb-3">Red de Asistencias Soluciones W</h4>
              <p className="leading-relaxed">
                Médica domiciliaria, ambulancias de urgencia, atención veterinaria, cerrajería, plomería y odontología preventiva.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#063a57] mb-3">Atención al Usuario 24/7</h4>
              <p className="leading-relaxed">
                Bogotá D.C., Colombia <br />
                Línea PBX: +57 (601) 745-9000 <br />
                WhatsApp Oficial: +57 313 428 9397
              </p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#063a57] mb-3">Marco Legal y Habeas Data</h4>
              <p className="leading-relaxed">
                Ley 1581 de 2012. Soluciones W ofrece programas de auxilio y asistencia operativa; no constituye entidad aseguradora ni EPS.
              </p>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
            <p>© {new Date().getFullYear()} Soluciones W Colombia. Todos los derechos reservados.</p>
            <p>Dirección General: Wilson Triana</p>
          </div>
        </div>
      </footer>

      {/* 9. MOBILE BOTTOM ACTION BAR (Llamar, WhatsApp, Ver Planes) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-around shadow-2xl">
        <a
          href="tel:6017459000"
          className="flex flex-col items-center gap-1 text-[11px] font-semibold text-[#063a57]"
        >
          <Phone className="w-5 h-5 text-[#0a5278]" />
          <span>Llamar</span>
        </a>

        <a
          href="https://wa.me/573134289397"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center gap-1 text-[11px] font-semibold text-[#25D366]"
        >
          <MessageCircle className="w-5 h-5" />
          <span>WhatsApp</span>
        </a>

        <button
          onClick={() => {
            const el = document.getElementById("planes");
            el?.scrollIntoView({ behavior: "smooth" });
          }}
          className="bg-[#167394] hover:bg-[#0a5278] text-white px-4 py-2 text-xs font-bold rounded-lg text-white"
        >
          Ver Planes
        </button>
      </div>

      {/* MODAL DE INGRESO DE AFILIADOS */}
      <MemberLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(data) => {
          setMemberData(data);
          setIsAuthenticated(true);
        }}
      />

      {/* 10. CHECKOUT & EMISSION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-2xl border border-slate-300 ring-1 ring-slate-900/10 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#063a57] text-white px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-[#167394] font-bold uppercase tracking-wider">
                  PASO {checkoutStep} DE 3 · {planPrices[selectedPlan].name}
                </p>
                <h3 className="text-base font-bold text-white">
                  {checkoutStep === 1 && "Registro Express del Titular"}
                  {checkoutStep === 2 && "Pago Seguro con Pasarela (Wompi)"}
                  {checkoutStep === 3 && "¡Certificado Oficial Emitido!"}
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
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!formData.docNumber || !formData.fullName || !formData.phone || !formData.email) {
                      alert("Por favor completa los campos obligatorios.");
                      return;
                    }
                    setCheckoutStep(2);
                  }}
                  className="space-y-4 text-xs"
                >
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
                      <input type="checkbox" defaultChecked required className="mt-0.5 rounded text-[#167394]" />
                      <span>Acepto términos de servicio y autorización de datos (Habeas Data Ley 1581).</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#167394] hover:bg-[#0a5278] text-white py-3 rounded-xl font-bold uppercase tracking-wider mt-4"
                  >
                    Continuar al Pago Seguro
                  </button>
                </form>
              )}

              {checkoutStep === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex justify-between">
                    <div>
                      <p className="font-bold text-[#063a57]">{formData.fullName}</p>
                      <p className="text-slate-500">Plan: {planPrices[selectedPlan].name}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block">Total a pagar:</span>
                      <span className="text-base font-extrabold text-[#0a5278]">
                        ${currentFinalPrice.toLocaleString("es-CO")} COP
                      </span>
                    </div>
                  </div>

                  {/* Selector de Pasarela: Wompi vs Mercado Pago */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-2">
                      Selecciona la Pasarela de Pago:
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentGateway("wompi")}
                        className={`p-3 rounded-xl border text-left transition ${
                          paymentGateway === "wompi"
                            ? "border-[#167394] bg-[#e8f4f8] text-[#0a5278]"
                            : "border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs">Wompi (Bancolombia)</span>
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Sandbox
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Bancolombia, Nequi, PSE, Tarjetas
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentGateway("mercadopago")}
                        className={`p-3 rounded-xl border text-left transition ${
                          paymentGateway === "mercadopago"
                            ? "border-[#167394] bg-[#e8f4f8] text-[#0a5278]"
                            : "border-slate-200 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs">Mercado Pago</span>
                          <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                            Sandbox
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-0.5">
                          Tarjetas Débito/Crédito, PSE, Efecty
                        </p>
                      </button>
                    </div>
                  </div>

                  {/* Submétodos de Pago */}
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1.5">
                      Método específico:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("card")}
                        className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                          paymentMethod === "card" ? "border-[#167394] bg-[#e8f4f8] text-[#167394] shadow-xs" : "border-slate-200 text-slate-600"
                        }`}
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        <span>Tarjeta</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("nequi")}
                        className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                          paymentMethod === "nequi" ? "border-[#167394] bg-[#e8f4f8] text-[#167394] shadow-xs" : "border-slate-200 text-slate-600"
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5" />
                        <span>Nequi</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("pse")}
                        className={`p-2.5 rounded-xl border text-center font-bold transition flex items-center justify-center gap-1.5 ${
                          paymentMethod === "pse" ? "border-[#167394] bg-[#e8f4f8] text-[#167394] shadow-xs" : "border-slate-200 text-slate-600"
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>PSE</span>
                      </button>
                    </div>
                  </div>

                  {/* FORMULARIO INTERACTIVO: TARJETA DE CRÉDITO / DÉBITO */}
                  {paymentMethod === "card" && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                          Datos de la Tarjeta
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCardDetails({
                              number: "4242 4242 4242 4242",
                              name: formData.fullName || "CARLOS VILLAMIL",
                              exp: "12/28",
                              cvc: "123",
                              installments: "1"
                            })
                          }
                          className="text-[10px] font-bold text-[#167394] hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Autocompletar Tarjeta Test (4242...)</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Número de Tarjeta *
                        </label>
                        <input
                          type="text"
                          maxLength={19}
                          placeholder="4242 4242 4242 4242"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono tracking-wider focus:outline-none focus:border-[#167394]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Nombre en la Tarjeta *
                        </label>
                        <input
                          type="text"
                          placeholder="Como aparece en la tarjeta"
                          value={cardDetails.name || formData.fullName}
                          onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 uppercase focus:outline-none focus:border-[#167394]"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Vence (MM/AA) *
                          </label>
                          <input
                            type="text"
                            maxLength={5}
                            placeholder="12/28"
                            value={cardDetails.exp}
                            onChange={(e) => setCardDetails({ ...cardDetails, exp: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 text-center font-mono focus:outline-none focus:border-[#167394]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            CVC / CVV *
                          </label>
                          <input
                            type="password"
                            maxLength={4}
                            placeholder="123"
                            value={cardDetails.cvc}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 text-center font-mono focus:outline-none focus:border-[#167394]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Cuotas
                          </label>
                          <select
                            value={cardDetails.installments}
                            onChange={(e) => setCardDetails({ ...cardDetails, installments: e.target.value })}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#167394]"
                          >
                            <option value="1">1 Cuota</option>
                            <option value="3">3 Cuotas</option>
                            <option value="6">6 Cuotas</option>
                            <option value="12">12 Cuotas</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* FORMULARIO INTERACTIVO: NEQUI */}
                  {paymentMethod === "nequi" && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                          Pago con Nequi
                        </span>
                        <button
                          type="button"
                          onClick={() => setNequiPhone("3991111111")}
                          className="text-[10px] font-bold text-[#167394] hover:underline flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Autocompletar Nequi Test (399...)</span>
                        </button>
                      </div>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Número de Celular Nequi *
                        </label>
                        <input
                          type="tel"
                          maxLength={10}
                          placeholder="300 123 4567"
                          value={nequiPhone || formData.phone}
                          onChange={(e) => setNequiPhone(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 font-mono tracking-wider focus:outline-none focus:border-[#167394]"
                        />
                      </div>

                      <p className="text-[10px] text-slate-500 leading-relaxed">
                        📱 En Wompi real recibirás una notificación push en la aplicación Nequi para aprobar el débito de ${currentFinalPrice.toLocaleString("es-CO")} COP con tu clave dinámica.
                      </p>
                    </div>
                  )}

                  {/* FORMULARIO INTERACTIVO: PSE */}
                  {paymentMethod === "pse" && (
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 animate-in fade-in duration-150">
                      <span className="font-bold text-slate-800 text-[11px] uppercase tracking-wider block">
                        Transferencia PSE (Débito en Cuenta)
                      </span>

                      <div>
                        <label className="block text-[11px] font-medium text-slate-600 mb-1">
                          Banco de Origen *
                        </label>
                        <select
                          value={pseBank}
                          onChange={(e) => setPseBank(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:border-[#167394] font-medium"
                        >
                          <option value="bancolombia">Bancolombia (Personas / Empresas)</option>
                          <option value="davivienda">Banco Davivienda</option>
                          <option value="bogota">Banco de Bogotá</option>
                          <option value="bbva">BBVA Colombia</option>
                          <option value="occidente">Banco de Occidente</option>
                          <option value="popular">Banco Popular</option>
                          <option value="falabella">Banco Falabella</option>
                          <option value="lulobank">Lulo Bank</option>
                          <option value="dale">Dale!</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Tipo de Cliente
                          </label>
                          <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900">
                            <option>Persona Natural</option>
                            <option>Persona Jurídica</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-medium text-slate-600 mb-1">
                            Email Registrado en PSE
                          </label>
                          <input
                            type="email"
                            defaultValue={formData.email}
                            className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Ambiente Sandbox Activo:</strong> Puedes ingresar cualquier dato de prueba o usar los botones de autocompletado para testear el flujo de aprobación de {paymentGateway.toUpperCase()}. No se realizarán cobros reales.
                    </span>
                  </div>

                  <button
                    onClick={handlePaymentSimulation}
                    disabled={isProcessing}
                    className="w-full bg-[#167394] hover:bg-[#0a5278] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 mt-4 transition shadow-md"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Clock className="w-4 h-4 animate-spin" />
                        Validando con {paymentGateway === "wompi" ? "Redeban / Wompi..." : "Mercado Pago..."}
                      </span>
                    ) : (
                      <span>
                        Pagar ${currentFinalPrice.toLocaleString("es-CO")} COP en Sandbox ({paymentGateway.toUpperCase()})
                      </span>
                    )}
                  </button>
                </div>
              )}

              {checkoutStep === 3 && generatedPolicy && (
                <div className="text-center space-y-4 text-xs">
                  <div className="w-14 h-14 bg-[#e8f4f8] text-[#167394] rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#063a57]">¡Afiliación Activa!</h4>
                    <p className="text-slate-500">Emisión digital automática completada en menos de 2 minutos.</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Contrato:</span>
                      <span className="font-mono font-bold text-[#0a5278]">{generatedPolicy.contractNumber}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Plan:</span>
                      <span className="font-semibold text-slate-800">{generatedPolicy.planName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Titular:</span>
                      <span className="font-semibold text-slate-800">{formData.fullName}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Documento:</span>
                      <span className="font-semibold text-slate-800">{formData.docNumber}</span>
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {/* Botón principal para ir al Rappi Hub */}
                    <button
                      onClick={() => {
                        setIsModalOpen(false);
                        setIsAuthenticated(true);
                      }}
                      className="w-full bg-[#167394] hover:bg-[#0a5278] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition text-xs"
                    >
                      <Sparkles className="w-4 h-4 text-cyan-200" />
                      <span>Ir a Mi Hub de Asistencias (Estilo Rappi)</span>
                    </button>

                    <button
                      onClick={() => alert(`Certificado ${generatedPolicy.contractNumber}.pdf descargado exitosamente.`)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition text-xs"
                    >
                      <Download className="w-4 h-4 text-slate-600" />
                      <span>Descargar Certificado PDF</span>
                    </button>

                    <a
                      href={`https://wa.me/573134289397?text=Hola%20Soluciones%20W,%20acabo%20de%20afiliarme%20al%20${generatedPolicy.planName}%20con%20contrato%20${generatedPolicy.contractNumber}.`}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full bg-[#063a57] hover:bg-[#0a5278] text-white py-3 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition text-xs"
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

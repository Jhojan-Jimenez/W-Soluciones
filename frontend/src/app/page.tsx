"use client";

import React, { useState, useEffect } from "react";

interface MemberData {
  fullName: string;
  docNumber: string;
  contractNumber: string;
  planName: string;
  phone: string;
  email: string;
  address: string;
  validUntil?: string;
  eventsRemaining?: number;
}

export default function HomePage() {
  // Estado de Autenticación & Afiliado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [memberData, setMemberData] = useState<MemberData>({
    fullName: "Carlos Andrés Villamil",
    docNumber: "1018492031",
    contractNumber: "SW-849102",
    planName: "Plan Plus Familiar 360°",
    phone: "313 428 9397",
    email: "carlos.villamil@gmail.com",
    address: "Carrera 15 # 85-30, Bogotá D.C.",
    validUntil: "04 de Noviembre, 2026",
    eventsRemaining: 10
  });

  // Hero Slider
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroImages = [
    "https://solucionesw.com/wp-content/uploads/2022/10/1.jpg",
    "https://solucionesw.com/wp-content/uploads/2022/10/s1.jpg",
    "https://solucionesw.com/wp-content/uploads/2022/10/s2.jpg",
    "https://solucionesw.com/wp-content/uploads/2022/10/s3.jpg"
  ];

  // Planes & Facturación
  const [billingMode, setBillingMode] = useState<"monthly" | "annual">("monthly");
  const [selectedPlanKey, setSelectedPlanKey] = useState<"virtual" | "tradicional" | "plus">("plus");

  const planPrices = {
    virtual: { monthly: 24900, annual: 249000, name: "Plan Digital Básico" },
    tradicional: { monthly: 39900, annual: 399000, name: "Plan Tradicional Hogar & Salud" },
    plus: { monthly: 54900, annual: 549000, name: "Plan Plus Familiar 360°" }
  };

  // Formulario Express del Hero
  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    plan: "plus" as "virtual" | "tradicional" | "plus"
  });

  // Checkout Modal
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [checkoutForm, setCheckoutForm] = useState({
    docType: "CC",
    docNumber: "",
    fullName: "",
    phone: "",
    email: "",
    address: ""
  });
  const [paymentGateway, setPaymentGateway] = useState<"wompi" | "mp">("wompi");
  const [paymentMethod, setPaymentMethod] = useState<"card" | "nequi" | "pse">("card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Login Modal
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginDoc, setLoginDoc] = useState("");
  const [loginPhone, setLoginPhone] = useState("");

  // Operador Central Demo
  const [operatorInput, setOperatorInput] = useState("");
  const [operatorResult, setOperatorResult] = useState<{
    show: boolean;
    name?: string;
    doc?: string;
    plan?: string;
    date?: string;
    error?: string;
  }>({ show: false });

  // FAQ Accordion
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Hub Privado
  const [hubCategory, setHubCategory] = useState<"all" | "salud" | "hogar" | "mascotas" | "dental">("all");
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedServiceTitle, setSelectedServiceTitle] = useState("");

  // Menú Móvil
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Rotación automática del Hero Slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Detección automática de sesión por token
  useEffect(() => {
    if (typeof window === "undefined") return;
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || localStorage.getItem("soluciones_w_token");

    if (token) {
      fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid && data.affiliate) {
            localStorage.setItem("soluciones_w_token", token);
            setMemberData({
              fullName: data.affiliate.fullName,
              docNumber: data.affiliate.docNumber,
              contractNumber: data.affiliate.contractNumber,
              planName: data.affiliate.planName,
              phone: data.affiliate.phone || "313 428 9397",
              email: data.affiliate.email || "afiliado@correo.com",
              address: data.affiliate.address || "Bogotá D.C."
            });
            setIsAuthenticated(true);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Handlers de Checkout
  const handleStartCheckout = (planKey: "virtual" | "tradicional" | "plus") => {
    setSelectedPlanKey(planKey);
    setCheckoutStep(1);
    setIsCheckoutOpen(true);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutForm((prev) => ({
      ...prev,
      fullName: leadForm.name,
      email: leadForm.email,
      phone: leadForm.phone
    }));
    handleStartCheckout(leadForm.plan);
  };

  const handleCheckoutStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutForm.docNumber || !checkoutForm.fullName) return;
    setCheckoutStep(2);
  };

  const handleProcessPayment = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch("/api/checkout/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: checkoutForm.fullName,
          docNumber: checkoutForm.docNumber,
          phone: checkoutForm.phone,
          email: checkoutForm.email,
          address: checkoutForm.address,
          city: "Bogotá D.C.",
          planKey: selectedPlanKey,
          billingPeriod: billingMode,
          paymentMethod
        })
      });

      const data = await res.json();
      if (data.success && data.affiliate) {
        if (data.token) {
          localStorage.setItem("soluciones_w_token", data.token);
        }
        setMemberData({
          fullName: data.affiliate.fullName,
          docNumber: data.affiliate.docNumber,
          contractNumber: data.affiliate.contractNumber,
          planName: data.affiliate.planName,
          phone: data.affiliate.phone,
          email: data.affiliate.email,
          address: data.affiliate.address
        });
        setCheckoutStep(3);
      } else {
        // Fallback demo local si el backend no responde
        const demoContract = "SW-" + Math.floor(100000 + Math.random() * 900000);
        setMemberData((prev) => ({
          ...prev,
          fullName: checkoutForm.fullName || "Nuevo Afiliado",
          docNumber: checkoutForm.docNumber || "1020304050",
          contractNumber: demoContract,
          planName: planPrices[selectedPlanKey].name
        }));
        setCheckoutStep(3);
      }
    } catch {
      // Fallback demo local
      const demoContract = "SW-" + Math.floor(100000 + Math.random() * 900000);
      setMemberData((prev) => ({
        ...prev,
        fullName: checkoutForm.fullName || "Nuevo Afiliado",
        docNumber: checkoutForm.docNumber || "1020304050",
        contractNumber: demoContract,
        planName: planPrices[selectedPlanKey].name
      }));
      setCheckoutStep(3);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  // Handlers de Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginDoc.trim()) return;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docNumber: loginDoc.trim() })
      });
      const data = await res.json();

      if (data.success && data.affiliate) {
        if (data.token) localStorage.setItem("soluciones_w_token", data.token);
        setMemberData({
          fullName: data.affiliate.fullName,
          docNumber: data.affiliate.docNumber,
          contractNumber: data.affiliate.contractNumber,
          planName: data.affiliate.planName,
          phone: data.affiliate.phone,
          email: data.affiliate.email,
          address: data.affiliate.address
        });
        setIsLoginOpen(false);
        setIsAuthenticated(true);
        window.scrollTo({ top: 0, behavior: "instant" });
        return;
      }
    } catch {}

    // Fallback demo
    setMemberData({
      fullName: loginDoc === "1018492031" ? "Carlos Andrés Villamil" : "Afiliado Titular",
      docNumber: loginDoc,
      contractNumber: "SW-849102",
      planName: "Plan Plus Familiar 360°",
      phone: "313 428 9397",
      email: "carlos.villamil@gmail.com",
      address: "Carrera 15 # 85-30, Bogotá D.C."
    });
    setIsLoginOpen(false);
    setIsAuthenticated(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  // Handlers Operador Central
  const handleOperatorSearch = () => {
    if (!operatorInput.trim()) {
      alert("Por favor ingresa un número de cédula para consultar.");
      return;
    }
    if (operatorInput.trim().length >= 7) {
      setOperatorResult({
        show: true,
        name: operatorInput.trim() === "1018492031" ? "Carlos Andrés Villamil" : "Afiliado Activo Registrado",
        doc: operatorInput.trim(),
        plan: "Plan Plus Familiar 360°",
        date: "04 de Noviembre, 2026"
      });
    } else {
      setOperatorResult({
        show: false,
        error: "No se registra cobertura activa para el documento ingresado."
      });
      alert("No se registra cobertura activa para el documento ingresado.");
    }
  };

  // Despacho Asistencia WhatsApp
  const handleConfirmAssistance = () => {
    const radicado = Math.floor(1000 + Math.random() * 9000);
    const msg = encodeURIComponent(
      `Hola Soluciones W, soy el afiliado ${memberData.fullName} (C.C. ${memberData.docNumber}, Contrato ${memberData.contractNumber}) y requiero solicitar la asistencia de *${selectedServiceTitle}* (Radicado #${radicado}) en la dirección ${memberData.address}.`
    );
    window.open(`https://wa.me/573134289397?text=${msg}`, "_blank");
    setIsRequestModalOpen(false);
  };

  const currentPrice =
    billingMode === "monthly"
      ? planPrices[selectedPlanKey].monthly
      : planPrices[selectedPlanKey].annual;

  return (
    <>
      {/* ========================================================
           VISTA PÚBLICA / LANDING INSTITUCIONAL
           ======================================================== */}
      {!isAuthenticated && (
        <div id="public-landing-view">
          
          {/* HEADER INSTITUCIONAL OPTIMIZADO */}
          <header id="e89-header">
            <div className="e89-header-wrapper">
              
              {/* Logo Oficial Soluciones W */}
              <div className="e89-header-logo">
                <a href="#inicio" title="Soluciones W">
                  <img
                    src="https://solucionesw.com/wp-content/uploads/2022/09/logo.png"
                    alt="Soluciones W"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/logo-soluciones-w.png";
                    }}
                  />
                </a>
                <div className="e89-header-logo-text">
                  <span>Plataforma de Afiliaciones</span>
                  <small>Dir. Wilson Triana</small>
                </div>
              </div>

              {/* Menú y Acciones Institucionales (4 Enlaces Limpios) */}
              <div id="e89-header-nav" style={{ display: mobileMenuOpen ? "flex" : undefined }}>
                <ul className="e89-menu">
                  <li className="current-menu-item"><a href="#planes">Planes</a></li>
                  <li><a href="#servicios">Coberturas</a></li>
                  <li><a href="#faq">Preguntas</a></li>
                  <li><a href="#contacto">Contacto</a></li>
                </ul>

                <div className="header-actions">
                  <button
                    className="header-btn-affiliate"
                    onClick={() => setIsLoginOpen(true)}
                    title="Ingreso al portal de afiliados"
                  >
                    <i className="fa fa-user-circle"></i> Soy Afiliado
                  </button>

                  <a
                    href="https://wa.me/573134289397"
                    target="_blank"
                    rel="noreferrer"
                    className="header-btn-whatsapp"
                    title="Atención directa por WhatsApp"
                  >
                    <i className="fa fa-whatsapp"></i> WhatsApp 24/7
                  </a>
                </div>
              </div>

              <div className="mobile-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <i className="fa fa-bars"></i>
              </div>
            </div>
          </header>

          {/* ========================================================
               HERO SLIDER CON FORMULARIO EXPRESS INTEGRADO
               ======================================================== */}
          <section className="hero-section" id="inicio">
            <div className="hero-backgrounds">
              {heroImages.map((img, idx) => (
                <div
                  key={idx}
                  className={`hero-slide ${idx === currentSlide ? "active" : ""}`}
                  style={{ backgroundImage: `url('${img}')` }}
                />
              ))}
            </div>

            <div className="hero-overlay"></div>

            <div className="hero-content-wrapper">
              
              {/* Columna Izquierda: Mensaje y Propuesta de Valor */}
              <div className="hero-text">
                <span className="slide-tag">Siempre presente en cualquier momento</span>
                <h1 className="slide-title">Protección integral médica, del hogar y tus mascotas</h1>
                <p className="slide-desc">
                  Construimos programas de protección robustos con atención médica domiciliaria, ambulancia 24/7 y auxilio técnico de urgencia sin copagos ni cláusulas de permanencia.
                </p>

                <div className="hero-buttons">
                  <a href="#planes" className="rev-btn">Ver Planes y Tarifas</a>
                  <a href="tel:6017459000" className="rev-btn rev-btn-blue">
                    <i className="fa fa-phone"></i> Central (601) 745-9000
                  </a>
                </div>

                <div className="hero-trust-badges">
                  <span><i className="fa fa-check-circle"></i> Sin periodos de carencia</span>
                  <span><i className="fa fa-check-circle"></i> Sin exámenes médicos</span>
                  <span><i className="fa fa-check-circle"></i> Activación digital en 2 min</span>
                </div>
              </div>

              {/* Columna Derecha: Formulario de Afiliación Express */}
              <div className="hero-form-card">
                <h3>¡Afíliate en línea ya!</h3>
                <p>Completa tus datos y activa tu plan en menos de 2 minutos.</p>

                <form onSubmit={handleLeadSubmit}>
                  <div className="form-group">
                    <label>Nombre y Apellido *</label>
                    <input
                      type="text"
                      className="form-control-w"
                      placeholder="Ingresa tu nombre completo"
                      value={leadForm.name}
                      onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Correo Electrónico *</label>
                    <input
                      type="email"
                      className="form-control-w"
                      placeholder="correo@ejemplo.com"
                      value={leadForm.email}
                      onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Teléfono Celular / WhatsApp *</label>
                    <input
                      type="tel"
                      className="form-control-w"
                      placeholder="320 000 0000"
                      value={leadForm.phone}
                      onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Plan de Interés</label>
                    <select
                      className="form-select-w"
                      value={leadForm.plan}
                      onChange={(e) => setLeadForm({ ...leadForm, plan: e.target.value as any })}
                    >
                      <option value="plus">Plan Plus Familiar 360° ($54.900/mes) - Recomendado</option>
                      <option value="tradicional">Plan Tradicional Hogar & Salud ($39.900/mes)</option>
                      <option value="virtual">Plan Básico Digital ($24.900/mes)</option>
                    </select>
                  </div>

                  <button type="submit" className="rev-btn" style={{ width: "100%", marginTop: "10px" }}>
                    <span>Continuar al Pago Seguro</span> <i className="fa fa-arrow-right"></i>
                  </button>

                  <p className="form-legal">
                    * Campos obligatorios. Al continuar aceptas nuestros términos de servicio y autorización de datos (Ley 1581 Habeas Data).
                  </p>
                </form>
              </div>

            </div>

            {/* Controles del Slider */}
            <button
              className="slider-arrow prev"
              onClick={() => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length)}
            >
              <i className="fa fa-chevron-left"></i>
            </button>
            <button
              className="slider-arrow next"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % heroImages.length)}
            >
              <i className="fa fa-chevron-right"></i>
            </button>
            <div className="slider-dots">
              {heroImages.map((_, idx) => (
                <div
                  key={idx}
                  className={`dot ${idx === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(idx)}
                />
              ))}
            </div>
          </section>

          {/* ========================================================
               SECCIÓN ¿QUÉ ES UNA ASISTENCIA?
               ======================================================== */}
          <div className="about">
            <h2>¿Qué es una asistencia? <i className="fa fa-arrow-down"></i></h2>
            <p>
              La Asistencia es un producto de Protección flexible, que se contrata con servicios y coberturas sólidas, robustas, con atención profesional, cuyo objetivo primordial es proteger a las personas y su grupo familiar ante eventos no esperados, sin copagos ni trámites burocráticos.
            </p>
          </div>

          {/* ========================================================
               SECCIÓN DE PLANES Y TARIFAS NETAS
               ======================================================== */}
          <section className="planes-section" id="planes">
            <div className="container">
              <h2 className="sub">Planes Soluciones W</h2>
              <p className="sub-desc">
                Elige el plan ideal para tu familia y recibe tu certificado digital de cobertura inmediatamente con débito automático sin permanencia.
              </p>

              {/* Toggle Mensual / Anual */}
              <div className="billing-toggle-wrapper">
                <div className="billing-toggle">
                  <button
                    className={`billing-btn ${billingMode === "monthly" ? "active" : ""}`}
                    onClick={() => setBillingMode("monthly")}
                  >
                    Pago Mensual
                  </button>
                  <button
                    className={`billing-btn ${billingMode === "annual" ? "active" : ""}`}
                    onClick={() => setBillingMode("annual")}
                  >
                    Pago Anual (2 Meses Gratis)
                  </button>
                </div>
              </div>

              <div className="plans-grid">
                
                {/* Plan 1: Básico Digital */}
                <div className="plan-card">
                  <div>
                    <span className="plan-category">Básico Individual</span>
                    <h3 className="plan-title">Plan Digital Básico</h3>
                    <p className="plan-desc">Telemedicina 24/7 y orientación pediátrica sin filas, ideal para jóvenes e independientes.</p>

                    <div className="plan-price-box">
                      <span className="price-currency">$</span>
                      <span className="price-number">
                        {billingMode === "monthly" ? "24.900" : "249.000"}
                      </span>
                      <span className="price-period">
                        COP / {billingMode === "monthly" ? "mes" : "año"} · Sin copagos
                      </span>
                    </div>

                    <ul className="plan-features-list">
                      <li><i className="fa fa-check"></i> Telemedicina 24/7 ilimitada con fórmula digital</li>
                      <li><i className="fa fa-check"></i> Orientación médica y pediátrica telefónica</li>
                      <li><i className="fa fa-check"></i> Odontología preventiva (1 profilaxis anual gratis)</li>
                      <li className="disabled"><i className="fa fa-times"></i> Sin médico presencial domiciliario</li>
                      <li className="disabled"><i className="fa fa-times"></i> Sin ambulancia medicalizada</li>
                    </ul>
                  </div>

                  <button
                    className="rev-btn rev-btn-outline"
                    style={{ width: "100%" }}
                    onClick={() => handleStartCheckout("virtual")}
                  >
                    Elegir Plan Digital
                  </button>
                </div>

                {/* Plan 2: Tradicional Hogar & Salud */}
                <div className="plan-card">
                  <div>
                    <span className="plan-category">Protección Hogar</span>
                    <h3 className="plan-title">Plan Tradicional</h3>
                    <p className="plan-desc">Médico a domicilio, ambulancia y auxilio técnico para reparaciones de urgencia.</p>

                    <div className="plan-price-box">
                      <span className="price-currency">$</span>
                      <span className="price-number">
                        {billingMode === "monthly" ? "39.900" : "399.000"}
                      </span>
                      <span className="price-period">
                        COP / {billingMode === "monthly" ? "mes" : "año"} · Sin copagos
                      </span>
                    </div>

                    <ul className="plan-features-list">
                      <li><i className="fa fa-check"></i> Médico general a domicilio (hasta 3 consultas)</li>
                      <li><i className="fa fa-check"></i> Traslado en ambulancia básica y medicalizada 24/7</li>
                      <li><i className="fa fa-check"></i> Plomería y cerrajería de urgencia en el hogar</li>
                      <li><i className="fa fa-check"></i> Telemedicina 24/7 + Profilaxis dental</li>
                      <li className="disabled"><i className="fa fa-times"></i> Sin cobertura veterinaria para mascotas</li>
                    </ul>
                  </div>

                  <button
                    className="rev-btn rev-btn-outline"
                    style={{ width: "100%" }}
                    onClick={() => handleStartCheckout("tradicional")}
                  >
                    Elegir Plan Tradicional
                  </button>
                </div>

                {/* Plan 3: Plan Plus Familiar 360° */}
                <div className="plan-card featured">
                  <div className="plan-badge-popular">★ Más Popular · Recomendado</div>
                  <div>
                    <span className="plan-category">Protección Integral 360°</span>
                    <h3 className="plan-title">Plan Plus Familiar</h3>
                    <p className="plan-desc">La cobertura total de Soluciones W: Salud, Ambulancia, Mascotas, Hogar y Odontología.</p>

                    <div className="plan-price-box" style={{ background: "#f4f8f1" }}>
                      <span className="price-currency">$</span>
                      <span className="price-number">
                        {billingMode === "monthly" ? "54.900" : "549.000"}
                      </span>
                      <span className="price-period">
                        COP / {billingMode === "monthly" ? "mes" : "año"} · Los 5 Pilares Esenciales
                      </span>
                    </div>

                    <ul className="plan-features-list">
                      <li><i className="fa fa-check"></i> <strong>Médico a domicilio + Telemedicina 24/7</strong></li>
                      <li><i className="fa fa-check"></i> <strong>Ambulancia medicalizada prioritaria</strong></li>
                      <li><i className="fa fa-check"></i> <strong>Asistencia veterinaria para mascotas (urgencias y vacunas)</strong></li>
                      <li><i className="fa fa-check"></i> <strong>Plomería, cerrajería y electricidad en casa</strong></li>
                      <li><i className="fa fa-check"></i> <strong>Urgencia dental + Limpieza profunda anual</strong></li>
                    </ul>
                  </div>

                  <button
                    className="rev-btn"
                    style={{ width: "100%" }}
                    onClick={() => handleStartCheckout("plus")}
                  >
                    Activar Plan Plus 360°
                  </button>
                </div>

              </div>
            </div>
          </section>

          {/* ========================================================
               PROGRAMAS DE PROTECCIÓN CON HOVER REVEAL
               ======================================================== */}
          <section id="servicios">
            <h2 className="sub">Programas de protección</h2>
            <p className="sub-desc">
              Pasa el cursor sobre cada programa para conocer las coberturas y límites específicos garantizados.
            </p>

            <div className="servicios">
              
              {/* Salud */}
              <div className="box">
                <a href="#planes" className="wrapper" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/08/10.jpg')" }}>
                  <div className="float">
                    <span><i className="fa fa-user-md"></i></span>
                    <h2>Asistencia salud</h2>
                    <p>Te protegemos y atendemos incluido tu grupo familiar ante emergencias en Salud y médico a domicilio.</p>
                    <div className="limit-badge">Hasta $250.000 COP / consulta</div>
                  </div>
                </a>
              </div>

              {/* Ambulancia */}
              <div className="box">
                <a href="#planes" className="wrapper" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/08/6.jpg')" }}>
                  <div className="float">
                    <span><i className="fa fa-ambulance"></i></span>
                    <h2>Ambulancia 24/7</h2>
                    <p>Traslados medicalizados y básicos prioritarios con paramédicos certificados ante crisis agudas.</p>
                    <div className="limit-badge">2 traslados 100% cubiertos</div>
                  </div>
                </a>
              </div>

              {/* Mascotas */}
              <div className="box">
                <a href="#planes" className="wrapper" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/08/3.jpg')" }}>
                  <div className="float">
                    <span><i className="fa fa-paw"></i></span>
                    <h2>Asistencia mascotas</h2>
                    <p>Atención médica veterinaria para perros y gatos ante accidentes, intoxicaciones y vacunas.</p>
                    <div className="limit-badge">Hasta $200.000 COP / evento</div>
                  </div>
                </a>
              </div>

              {/* Hogar */}
              <div className="box">
                <a href="#planes" className="wrapper" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/08/5.jpg')" }}>
                  <div className="float">
                    <span><i className="fa fa-wrench"></i></span>
                    <h2>Asistencia hogar</h2>
                    <p>Técnicos calificados para solucionar fugas de agua, roturas de tuberías, cortos y cerraduras.</p>
                    <div className="limit-badge">Hasta $220.000 COP / evento</div>
                  </div>
                </a>
              </div>

              {/* Odontología */}
              <div className="box">
                <a href="#planes" className="wrapper" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/10/7.jpg')" }}>
                  <div className="float">
                    <span><i className="fa fa-smile-o"></i></span>
                    <h2>Odontología</h2>
                    <p>Alivio del dolor agudo en centros odontológicos aliados y profilaxis profunda anual sin costo.</p>
                    <div className="limit-badge">1 Urgencia + 1 Profilaxis</div>
                  </div>
                </a>
              </div>

              {/* Tenderos */}
              <div className="box">
                <a href="#planes" className="wrapper" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/08/9.jpg')" }}>
                  <div className="float">
                    <span><i className="fa fa-shopping-cart"></i></span>
                    <h2>Tenderos</h2>
                    <p>Protección al comerciante independiente ante imprevistos de salud y daños en su establecimiento.</p>
                    <div className="limit-badge">Protección Integral Pyme</div>
                  </div>
                </a>
              </div>

              {/* Bicicleta */}
              <div className="box">
                <a href="#planes" className="wrapper" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/08/2-1.jpg')" }}>
                  <div className="float">
                    <span><i className="fa fa-bicycle"></i></span>
                    <h2>Bicicleta</h2>
                    <p>Asistencia ante imprevistos viales, caídas y traslados seguros para el ciclista y su bicicleta.</p>
                    <div className="limit-badge">Auxilio Vial Urbano</div>
                  </div>
                </a>
              </div>

              {/* Motos y Autos */}
              <div className="box">
                <a href="#planes" className="wrapper" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/08/1-1.jpg')" }}>
                  <div className="float">
                    <span><i className="fa fa-motorcycle"></i></span>
                    <h2>Motos & Autos</h2>
                    <p>Acompañamiento ante accidentes de tránsito y grúa de rescate en perímetro urbano.</p>
                    <div className="limit-badge">Respaldo en Carretera</div>
                  </div>
                </a>
              </div>

            </div>
          </section>

          {/* ========================================================
               VALIDADOR DEL OPERADOR TELEFÓNICO (WILSON TRIANA)
               ======================================================== */}
          <section className="operador-section" id="operador">
            <div className="container">
              <div className="operador-box">
                <div className="operador-title">
                  <h3>Búsqueda Rápida del Operador Telefónico</h3>
                  <p>Así consulta el operador de Wilson Triana el estado del afiliado en menos de 1 segundo al recibir una llamada de auxilio.</p>
                </div>

                <div className="search-input-group">
                  <input
                    type="text"
                    placeholder="Digita cualquier número de cédula (ej. 1018492031)..."
                    value={operatorInput}
                    onChange={(e) => setOperatorInput(e.target.value)}
                  />
                  <button className="rev-btn" onClick={handleOperatorSearch}>
                    <i className="fa fa-search"></i> Consultar
                  </button>
                </div>

                <div className="quick-demo-links">
                  <span>Tip: Digita 7 o más dígitos para simular un afiliado en la base de datos oficial.</span>
                  <a onClick={() => { setOperatorInput("1018492031"); handleOperatorSearch(); }}>
                    Probar con C.C. Demo (Carlos Villamil)
                  </a>
                </div>

                {operatorResult.show && (
                  <div className="operator-result-card show">
                    <div className="result-header">
                      <div>
                        <h4 style={{ color: "#0b5278", fontSize: "18px", fontWeight: 700 }}>{operatorResult.name}</h4>
                        <span style={{ fontSize: "12px", color: "#666" }}>
                          C.C. {operatorResult.doc} · Contrato SW-{operatorResult.doc?.slice(-6)}
                        </span>
                      </div>
                      <span className="status-pill"><i className="fa fa-check"></i> ACTIVO Y VIGENTE</span>
                    </div>

                    <div className="result-grid">
                      <div className="result-grid-item">
                        <span>Plan Contratado</span>
                        <strong>{operatorResult.plan}</strong>
                      </div>
                      <div className="result-grid-item">
                        <span>Vigencia Oficial</span>
                        <strong>{operatorResult.date}</strong>
                      </div>
                      <div className="result-grid-item">
                        <span>Eventos Disponibles</span>
                        <strong>10 Coberturas Activas</strong>
                      </div>
                      <div className="result-grid-item">
                        <span>Copago Exigido</span>
                        <strong>$0 COP (Sin Copagos)</strong>
                      </div>
                    </div>

                    <button
                      className="rev-btn"
                      style={{ width: "100%" }}
                      onClick={() => alert("✅ Solicitud autorizada: Operador despachó asistencia técnica y médica a la dirección del titular.")}
                    >
                      <i className="fa fa-check-circle"></i> Autorizar Despacho de Auxilio Inmediato
                    </button>
                  </div>
                )}

              </div>
            </div>
          </section>

          {/* ========================================================
               MEDIOS DE PAGO Y PASARELAS DE CONFIANZA
               ======================================================== */}
          <section className="pagos-section" id="pagos">
            <div className="container">
              <h2 className="sub">Paga fácil con tus medios favoritos</h2>
              <p className="sub-desc">
                Emisión 100% digital respaldada con cifrado bancario SSL de 256 bits y sin cláusulas de permanencia mínima.
              </p>

              <div className="payment-methods-grid">
                
                {/* PSE */}
                <div className="payment-method-card">
                  <div>
                    <div className="payment-logo-box">
                      <img src="/images/payments/pse.png" alt="PSE" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/logo-soluciones-w.png"; }} />
                    </div>
                    <h4>PSE Débito</h4>
                    <p>Paga al instante debitando directamente de tu cuenta de ahorros o corriente en Colombia.</p>
                  </div>
                  <span className="payment-tag">Sin Comisiones</span>
                </div>

                {/* Nequi */}
                <div className="payment-method-card">
                  <div>
                    <div className="payment-logo-box">
                      <img src="/images/payments/nequi.svg" alt="Nequi" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/logo-soluciones-w.png"; }} />
                    </div>
                    <h4>Nequi</h4>
                    <p>Aprobación rápida desde tu celular mediante notificación push en la aplicación.</p>
                  </div>
                  <span className="payment-tag">En 5 Segundos</span>
                </div>

                {/* Tarjetas Visa/Mastercard */}
                <div className="payment-method-card">
                  <div>
                    <div className="payment-logo-box">
                      <span style={{ fontSize: "26px", fontWeight: 800, color: "#0b5278" }}>
                        <i className="fa fa-cc-visa"></i> <i className="fa fa-cc-mastercard"></i>
                      </span>
                    </div>
                    <h4>Tarjetas Crédito y Débito</h4>
                    <p>Soporte para débito automático mensual con tarjetas nacionales e internacionales.</p>
                  </div>
                  <span className="payment-tag">Cifrado 3D Secure</span>
                </div>

                {/* Daviplata */}
                <div className="payment-method-card">
                  <div>
                    <div className="payment-logo-box">
                      <img src="/images/payments/daviplata.svg" alt="Daviplata" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/logo-soluciones-w.png"; }} />
                    </div>
                    <h4>Daviplata</h4>
                    <p>Pago seguro con saldo disponible en tu billetera digital Daviplata sin trámites.</p>
                  </div>
                  <span className="payment-tag">Inmediato</span>
                </div>

              </div>

              {/* Respaldo Wompi y Mercado Pago */}
              <div className="gateway-trust-banner">
                <div className="gateway-badges">
                  <span><i className="fa fa-shield"></i> Pasarelas Oficiales:</span>
                  <span><strong>Wompi</strong> (Bancolombia)</span>
                  <span><strong>Mercado Pago</strong></span>
                </div>
                <div className="security-badges">
                  <span><i className="fa fa-lock"></i> Cifrado SSL 256-Bit</span>
                  <span><i className="fa fa-refresh"></i> Cero Permanencia</span>
                  <span><i className="fa fa-file-text-o"></i> Factura Electrónica DIAN</span>
                </div>
              </div>

            </div>
          </section>

          {/* ========================================================
               PREGUNTAS FRECUENTES (FAQ ACCORDION)
               ======================================================== */}
          <section className="faq-section" id="faq">
            <div className="container">
              <h2 className="sub">Preguntas Frecuentes</h2>
              <p className="sub-desc">Resolvemos las principales inquietudes sobre la contratación y operación de Soluciones W.</p>

              <div className="faq-list">
                
                {[
                  {
                    q: "¿Tengo que pagar copagos o cuotas moderadoras al usar el servicio?",
                    a: "No. A diferencia de las EPS o medicinas prepagadas tradicionales, en Soluciones W los eventos cubiertos dentro del tope anual no tienen copagos ni cuotas adicionales. Solo pagas tu suscripción mensual."
                  },
                  {
                    q: "¿Cuánto tiempo tarda en activarse la cobertura tras pagar en línea?",
                    a: "La activación es instantánea. Nuestro motor digital emite tu certificado oficial de cobertura en menos de 2 minutos tras la confirmación del pago, y quedas inmediatamente registrado en la central de emergencias."
                  },
                  {
                    q: "¿Cómo solicito una ambulancia, un médico o un cerrajero ante una urgencia?",
                    a: "Muy fácil: marcas a nuestra línea directa de emergencias (601) 745-9000 o abres nuestro chat de WhatsApp oficial. El operador digita tu número de cédula en el sistema y despacha la asistencia de inmediato sin pedirte papeles físicos."
                  },
                  {
                    q: "¿Hay cláusula de permanencia mínima?",
                    a: "Ninguna. Puedes cancelar tu suscripción mensual cuando lo desees directamente desde tu panel o escribiendo a nuestro WhatsApp de atención sin penalizaciones ni cobros retroactivos."
                  },
                  {
                    q: "¿Qué incluye la asistencia veterinaria para mascotas?",
                    a: "Cubre consultas de urgencia ante enfermedades agudas o accidentes para perros y gatos, teleorientación veterinaria 24 horas y un procedimiento preventivo (vacuna o desparasitación) al año."
                  }
                ].map((faq, idx) => (
                  <div key={idx} className={`faq-item ${openFaqIndex === idx ? "active" : ""}`}>
                    <button
                      className="faq-question"
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                    >
                      <span>{faq.q}</span>
                      <i className="fa fa-chevron-down"></i>
                    </button>
                    <div className="faq-answer">
                      {faq.a}
                    </div>
                  </div>
                ))}

              </div>
            </div>
          </section>

          {/* ========================================================
               SECCIÓN BLOG / ACTUALIDAD
               ======================================================== */}
          <section id="blog">
            <h2 className="sub">Actualidad & Blog</h2>
            <div className="home-blog">
              
              <div className="box">
                <div className="img" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/11/Captura-de-Pantalla-2022-11-16-a-las-9.58.40-a.-m.-300x200.png')" }}></div>
                <div className="info">
                  <div>
                    <h3>Calcular los intereses, entre las claves para manejar tarjetas de crédito.</h3>
                    <p className="post-excerpt">Una tarjeta de crédito es un medio de pago para emergencias y liquidez que debe manejarse con rigor preventivo.</p>
                  </div>
                  <a href="https://solucionesw.com/" className="more-link">Leer artículo completo →</a>
                </div>
              </div>

              <div className="box">
                <div className="img" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/11/Captura-de-Pantalla-2022-11-16-a-las-9.56.01-a.-m.-300x200.png')" }}></div>
                <div className="info">
                  <div>
                    <h3>Tasas de interés para créditos educativos: conozca las opciones</h3>
                    <p className="post-excerpt">En Colombia muchos jóvenes acceden a créditos educativos como palanca de crecimiento personal.</p>
                  </div>
                  <a href="https://solucionesw.com/" className="more-link">Leer artículo completo →</a>
                </div>
              </div>

              <div className="box">
                <div className="img" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/11/Economia-300x200.jpeg')" }}></div>
                <div className="info">
                  <div>
                    <h3>Ley de Insolvencia, un salvavidas en tiempos de incertidumbre</h3>
                    <p className="post-excerpt">Por Wilson Triana: cómo las familias colombianas logran acuerdos de protección financiera y tranquilidad.</p>
                  </div>
                  <a href="https://solucionesw.com/" className="more-link">Leer artículo completo →</a>
                </div>
              </div>

              <div className="box">
                <div className="img" style={{ backgroundImage: "url('https://solucionesw.com/wp-content/uploads/2022/11/mercado-300x200.jpeg')" }}></div>
                <div className="info">
                  <div>
                    <h3>La cultura de protección debe ser parte de la canasta básica familiar</h3>
                    <p className="post-excerpt">La importancia de contar con auxilios operativos inmediatos ante un siniestro o enfermedad repentina.</p>
                  </div>
                  <a href="https://solucionesw.com/" className="more-link">Leer artículo completo →</a>
                </div>
              </div>

            </div>
          </section>

          {/* ========================================================
               CONSÚLTANOS AQUÍ
               ======================================================== */}
          <div className="contacto" id="contacto">
            <div className="title">
              <h2 className="sub">Consúltanos<br />aquí</h2>
            </div>
            <div className="info">
              <form
                className="contacto-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Gracias por escribirnos. Nuestro equipo se comunicará contigo de inmediato.");
                }}
              >
                <div>
                  <input type="text" placeholder="Nombre completo" required />
                </div>
                <div>
                  <input type="email" placeholder="Correo electrónico" required />
                </div>
                <div className="full-width">
                  <input type="text" placeholder="Asunto de la consulta" />
                </div>
                <div className="full-width">
                  <textarea placeholder="Mensaje" rows={3} required></textarea>
                </div>
                <button type="submit">
                  <span>Enviar Mensaje</span>
                  <i className="fa fa-arrow-right"></i>
                </button>
              </form>
            </div>
          </div>

          {/* ========================================================
               FOOTER INSTITUCIONAL (#e89-footer)
               ======================================================== */}
          <footer id="e89-footer">
            <div id="e89-footer-wrapper">
              <div className="footer-columns">
                
                <div className="footer-widget">
                  <div className="widget-title">Servicios</div>
                  <ul>
                    <li><a href="#planes">Asistencia salud y medicina domiciliaria</a></li>
                    <li><a href="#planes">Ambulancia medicalizada 24/7</a></li>
                    <li><a href="#planes">Asistencia para mascotas (perros y gatos)</a></li>
                    <li><a href="#planes">Asistencia hogar (plomería y cerrajería)</a></li>
                    <li><a href="#planes">Odontología de urgencia y prevención</a></li>
                    <li><a href="#planes">Asistencia a tenderos y microempresas</a></li>
                  </ul>
                </div>

                <div className="footer-widget footer-contact">
                  <div className="widget-title">Atención 24/7</div>
                  <p style={{ fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.85)" }}>
                    Bogotá D.C., Colombia <br />
                    Línea PBX Nacional: <strong>+57 (601) 745-9000</strong> <br />
                    WhatsApp Oficial: <strong>+57 313 428 9397</strong>
                  </p>
                  <a href="mailto:info@solucionesw.com"><i className="fa fa-envelope"></i> info@solucionesw.com</a>
                </div>

                <div className="footer-widget">
                  <div className="widget-title">Dirección General</div>
                  <p style={{ fontSize: "13px", lineHeight: 1.6, color: "rgba(255,255,255,0.85)", marginBottom: "15px" }}>
                    Dirección General: <strong>Wilson Triana</strong>. Cumplimiento de la Ley 1581 de Habeas Data y protección al consumidor en Colombia.
                  </p>
                  <div className="footer-social-links">
                    <a href="#" target="_blank" rel="noreferrer"><i className="fa fa-facebook"></i></a>
                    <a href="#" target="_blank" rel="noreferrer"><i className="fa fa-twitter"></i></a>
                    <a href="#" target="_blank" rel="noreferrer"><i className="fa fa-youtube"></i></a>
                    <a href="https://wa.me/573134289397" target="_blank" rel="noreferrer"><i className="fa fa-whatsapp"></i></a>
                  </div>
                </div>

              </div>

              <div className="copyright-area">
                <p>Soluciones W © 2026 · Todos los derechos reservados.</p>
                <p>Siempre presente en cualquier momento</p>
              </div>
            </div>
          </footer>

          {/* BARRA MÓVIL FIJA AL FONDO */}
          <div className="mobile-bottom-bar">
            <a href="tel:6017459000" className="mobile-bottom-btn">
              <i className="fa fa-phone"></i>
              <span>Llamar PBX</span>
            </a>
            <a href="https://wa.me/573134289397" target="_blank" rel="noreferrer" className="mobile-bottom-btn whatsapp">
              <i className="fa fa-whatsapp"></i>
              <span>WhatsApp</span>
            </a>
            <button className="rev-btn" style={{ padding: "8px 18px", fontSize: "11px" }} onClick={() => {
              document.getElementById("planes")?.scrollIntoView({ behavior: "smooth" });
            }}>
              Ver Planes
            </button>
          </div>

        </div>
      )}

      {/* ========================================================
           VISTA PRIVADA: HUB DE AFILIADOS (ESTILO RAPPI MEMBER HUB)
           ======================================================== */}
      {isAuthenticated && (
        <div id="member-hub-view" style={{ display: "block" }}>
          
          <header style={{ background: "#ffffff", borderBottom: "1px solid #e0e0e0", padding: "15px 25px", position: "sticky", top: 0, zIndex: 100 }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <img
                  src="https://solucionesw.com/wp-content/uploads/2022/09/logo.png"
                  alt="Soluciones W"
                  style={{ maxHeight: "40px" }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/logo-soluciones-w.png"; }}
                />
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#0b5278", textTransform: "uppercase", borderLeft: "1px solid #ddd", paddingLeft: "12px" }}>
                  Portal de Afiliados
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <a href="tel:6017459000" className="rev-btn" style={{ background: "#c53030", padding: "8px 16px", fontSize: "11px" }}>
                  <i className="fa fa-exclamation-triangle"></i> Urgencias: (601) 745-9000
                </a>
                <button
                  className="rev-btn rev-btn-outline"
                  style={{ padding: "8px 16px", fontSize: "11px" }}
                  onClick={() => {
                    localStorage.removeItem("soluciones_w_token");
                    setIsAuthenticated(false);
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                >
                  <i className="fa fa-sign-out"></i> Cerrar Sesión
                </button>
              </div>
            </div>
          </header>

          <div className="hub-banner">
            <div className="hub-banner-content">
              <div>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#dd9933", textTransform: "uppercase" }}>
                  CONTRATO {memberData.contractNumber}
                </span>
                <h2 style={{ fontSize: "26px", fontFamily: "'Libre Baskerville', serif", margin: "6px 0" }}>
                  Bienvenido, {memberData.fullName}
                </h2>
                <p style={{ fontSize: "13px", opacity: 0.9 }}>
                  {memberData.planName} · Póliza Vigente y Activa
                </p>
              </div>
              <div>
                <button
                  className="rev-btn"
                  onClick={() => {
                    setSelectedServiceTitle("Ambulancia Medicalizada de Urgencia");
                    setIsRequestModalOpen(true);
                  }}
                >
                  <i className="fa fa-ambulance"></i> Solicitar Asistencia Inmediata
                </button>
              </div>
            </div>
          </div>

          <div className="container" style={{ paddingTop: "30px" }}>
            <div className="hub-filter-pills">
              {(["all", "salud", "hogar", "mascotas", "dental"] as const).map((cat) => (
                <button
                  key={cat}
                  className={`hub-pill ${hubCategory === cat ? "active" : ""}`}
                  onClick={() => setHubCategory(cat)}
                >
                  {cat === "all" && "Todos los Servicios"}
                  {cat === "salud" && "Salud & Médicos"}
                  {cat === "hogar" && "Auxilio en el Hogar"}
                  {cat === "mascotas" && "Mascotas (Pet Care)"}
                  {cat === "dental" && "Odontología"}
                </button>
              ))}
            </div>

            <div className="services-on-demand-grid">
              {[
                {
                  id: "medico",
                  cat: "salud",
                  icon: "fa-user-md",
                  title: "Médico General en Casa",
                  desc: "Consulta médica presencial en tu domicilio con fórmula digital médica sin copagos.",
                  eta: "Llegada estimada: 45 - 60 min",
                  btnText: "Solicitar Médico"
                },
                {
                  id: "ambulancia",
                  cat: "salud",
                  icon: "fa-ambulance",
                  title: "Ambulancia de Urgencia",
                  desc: "Despacho prioritario de unidad medicalizada con paramédicos para traslado hospitalario.",
                  eta: "Despacho Inmediato: 15 - 20 min",
                  btnText: "Solicitar Ambulancia",
                  urgent: true
                },
                {
                  id: "plomeria",
                  cat: "hogar",
                  icon: "fa-wrench",
                  title: "Plomería por Inundación",
                  desc: "Técnico calificado para reparar tuberías rotas y filtraciones con materiales cubiertos.",
                  eta: "Llegada estimada: 45 min",
                  btnText: "Pedir Plomero"
                },
                {
                  id: "cerrajeria",
                  cat: "hogar",
                  icon: "fa-key",
                  title: "Cerrajería de Emergencia",
                  desc: "Apertura inmediata por llaves olvidadas adentro, pérdida o cerradura trabada.",
                  eta: "Llegada estimada: 35 min",
                  btnText: "Pedir Cerrajero"
                },
                {
                  id: "mascotas",
                  cat: "mascotas",
                  icon: "fa-paw",
                  title: "Urgencia Veterinaria",
                  desc: "Atención médica veterinaria inmediata para tu perro o gato ante accidentes o heridas.",
                  eta: "Llegada estimada: 45 - 60 min",
                  btnText: "Pedir Veterinario"
                },
                {
                  id: "dental",
                  cat: "dental",
                  icon: "fa-smile-o",
                  title: "Urgencia Odontológica",
                  desc: "Alivio clínico inmediato del dolor agudo y valoración en centros odontológicos aliados.",
                  eta: "Red aliada disponible",
                  btnText: "Ubicar Consultorio"
                }
              ]
                .filter((s) => hubCategory === "all" || s.cat === hubCategory)
                .map((serv) => (
                  <div key={serv.id} className="hub-service-card">
                    <div>
                      <div style={{ fontSize: "28px", color: serv.urgent ? "#c53030" : "#0b5278", marginBottom: "10px" }}>
                        <i className={`fa ${serv.icon}`}></i>
                      </div>
                      <h4 style={{ fontSize: "17px", fontWeight: 700, color: "#0b5278", marginBottom: "6px" }}>
                        {serv.title}
                      </h4>
                      <p style={{ fontSize: "12px", color: "#666", marginBottom: "15px" }}>{serv.desc}</p>
                      <span style={{ display: "block", fontSize: "11px", fontWeight: 700, color: serv.urgent ? "#c53030" : "#4b722d", marginBottom: "15px" }}>
                        <i className="fa fa-clock-o"></i> {serv.eta}
                      </span>
                    </div>
                    <button
                      className="rev-btn"
                      style={{ width: "100%", fontSize: "11px", padding: "10px", background: serv.urgent ? "#c53030" : undefined }}
                      onClick={() => {
                        setSelectedServiceTitle(serv.title);
                        setIsRequestModalOpen(true);
                      }}
                    >
                      {serv.btnText}
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
           MODAL 1: CHECKOUT EN 3 PASOS
           ======================================================== */}
      {isCheckoutOpen && (
        <div className="modal-backdrop open">
          <div className="modal-container">
            <div className="modal-header">
              <h4>Afiliación Digital a Soluciones W</h4>
              <button className="modal-close" onClick={() => setIsCheckoutOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              
              {/* Indicador de Pasos */}
              <div className="checkout-steps">
                <div className={`step-circle ${checkoutStep === 1 ? "active" : "done"}`}>1</div>
                <div className={`step-circle ${checkoutStep === 2 ? "active" : checkoutStep > 2 ? "done" : ""}`}>2</div>
                <div className={`step-circle ${checkoutStep === 3 ? "active" : ""}`}>3</div>
              </div>

              {/* PASO 1: Registro */}
              {checkoutStep === 1 && (
                <div>
                  <h5 style={{ color: "#0b5278", fontSize: "16px", marginBottom: "15px" }}>
                    Paso 1: Datos del Titular de la Póliza
                  </h5>
                  <form onSubmit={handleCheckoutStep1Submit}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "10px" }} className="form-group">
                      <div>
                        <label>Tipo Doc.</label>
                        <select
                          className="form-select-w"
                          value={checkoutForm.docType}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, docType: e.target.value })}
                        >
                          <option value="CC">C.C.</option>
                          <option value="CE">C.E.</option>
                          <option value="NIT">NIT</option>
                        </select>
                      </div>
                      <div>
                        <label>Número de Documento *</label>
                        <input
                          type="text"
                          className="form-control-w"
                          placeholder="Ej: 1018492031"
                          value={checkoutForm.docNumber}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, docNumber: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Nombre Completo del Titular *</label>
                      <input
                        type="text"
                        className="form-control-w"
                        placeholder="Ej: Wilson Andrés Triana"
                        value={checkoutForm.fullName}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, fullName: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }} className="form-group">
                      <div>
                        <label>Celular / WhatsApp *</label>
                        <input
                          type="tel"
                          className="form-control-w"
                          placeholder="320 123 4567"
                          value={checkoutForm.phone}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, phone: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label>Correo Electrónico *</label>
                        <input
                          type="email"
                          className="form-control-w"
                          placeholder="correo@ejemplo.com"
                          value={checkoutForm.email}
                          onChange={(e) => setCheckoutForm({ ...checkoutForm, email: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Dirección de Residencia y Ciudad *</label>
                      <input
                        type="text"
                        className="form-control-w"
                        placeholder="Carrera 15 # 85-30, Bogotá D.C."
                        value={checkoutForm.address}
                        onChange={(e) => setCheckoutForm({ ...checkoutForm, address: e.target.value })}
                        required
                      />
                    </div>

                    <div style={{ margin: "15px 0" }}>
                      <label style={{ fontSize: "11px", color: "#555", display: "flex", alignItems: "flex-start", gap: "8px" }}>
                        <input type="checkbox" defaultChecked required style={{ marginTop: "2px" }} />
                        <span>Acepto términos de servicio y autorización de datos (Habeas Data Ley 1581 de Colombia).</span>
                      </label>
                    </div>

                    <button type="submit" className="rev-btn" style={{ width: "100%" }}>
                      Continuar al Pago Seguro <i className="fa fa-arrow-right"></i>
                    </button>
                  </form>
                </div>
              )}

              {/* PASO 2: Pago */}
              {checkoutStep === 2 && (
                <div>
                  <div style={{ background: "#f7fafc", border: "1px solid #e0e0e0", borderRadius: "4px", padding: "15px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <strong style={{ color: "#0b5278" }}>{planPrices[selectedPlanKey].name}</strong>
                      <p style={{ fontSize: "12px", color: "#666" }}>Titular: {checkoutForm.fullName}</p>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontSize: "11px", color: "#888" }}>Total a Pagar:</span>
                      <div style={{ fontSize: "20px", fontWeight: 800, color: "#0b5278" }}>
                        ${currentPrice.toLocaleString("es-CO")} COP
                      </div>
                    </div>
                  </div>

                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#0b5278", textTransform: "uppercase", marginBottom: "8px", display: "block" }}>
                    Selecciona Pasarela:
                  </label>
                  <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                    <button
                      type="button"
                      className={`tab-gateway-btn ${paymentGateway === "wompi" ? "active" : ""}`}
                      onClick={() => setPaymentGateway("wompi")}
                    >
                      <i className="fa fa-shield"></i> Wompi (Bancolombia)
                    </button>
                    <button
                      type="button"
                      className={`tab-gateway-btn ${paymentGateway === "mp" ? "active" : ""}`}
                      onClick={() => setPaymentGateway("mp")}
                    >
                      <i className="fa fa-credit-card"></i> Mercado Pago
                    </button>
                  </div>

                  <label style={{ fontSize: "12px", fontWeight: 700, color: "#0b5278", textTransform: "uppercase", marginBottom: "8px", display: "block" }}>
                    Método de Pago:
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
                    <button
                      type="button"
                      className={`billing-btn ${paymentMethod === "card" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("card")}
                    >
                      💳 Tarjeta
                    </button>
                    <button
                      type="button"
                      className={`billing-btn ${paymentMethod === "nequi" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("nequi")}
                    >
                      📱 Nequi
                    </button>
                    <button
                      type="button"
                      className={`billing-btn ${paymentMethod === "pse" ? "active" : ""}`}
                      onClick={() => setPaymentMethod("pse")}
                    >
                      🏦 PSE
                    </button>
                  </div>

                  {paymentMethod === "card" && (
                    <div>
                      <div className="form-group">
                        <label>Número de Tarjeta *</label>
                        <input type="text" className="form-control-w" defaultValue="4242 •••• •••• 4242" />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }} className="form-group">
                        <div>
                          <label>Vencimiento *</label>
                          <input type="text" className="form-control-w" defaultValue="12/28" />
                        </div>
                        <div>
                          <label>CVC *</label>
                          <input type="text" className="form-control-w" defaultValue="123" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "nequi" && (
                    <div>
                      <div className="form-group">
                        <label>Celular Nequi *</label>
                        <input type="tel" className="form-control-w" defaultValue={checkoutForm.phone || "320 123 4567"} />
                      </div>
                      <p style={{ fontSize: "11px", color: "#666", marginBottom: "15px" }}>
                        Recibirás una notificación push en tu App Nequi para autorizar el débito seguro con clave dinámica.
                      </p>
                    </div>
                  )}

                  {paymentMethod === "pse" && (
                    <div className="form-group">
                      <label>Banco de Origen *</label>
                      <select className="form-select-w">
                        <option>Bancolombia</option>
                        <option>Davivienda</option>
                        <option>Banco de Bogotá</option>
                        <option>BBVA Colombia</option>
                        <option>Lulo Bank</option>
                      </select>
                    </div>
                  )}

                  <div style={{ background: "#fefcf3", border: "1px solid #f6e05e", padding: "10px 14px", borderRadius: "4px", fontSize: "11px", color: "#744210", marginBottom: "20px" }}>
                    <i className="fa fa-info-circle"></i> <strong>Modo Sandbox Oficial:</strong> Transacción simulada en entorno de pruebas bancarias.
                  </div>

                  <button
                    type="button"
                    className="rev-btn"
                    style={{ width: "100%" }}
                    disabled={isProcessingPayment}
                    onClick={handleProcessPayment}
                  >
                    {isProcessingPayment ? (
                      <span><i className="fa fa-spinner fa-spin"></i> Validando con {paymentGateway.toUpperCase()}...</span>
                    ) : (
                      <span>Pagar ${currentPrice.toLocaleString("es-CO")} COP en Sandbox</span>
                    )}
                  </button>
                </div>
              )}

              {/* PASO 3: Certificado */}
              {checkoutStep === 3 && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ width: "60px", height: "60px", background: "#eef6ec", color: "#4b722d", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 15px auto" }}>
                    <i className="fa fa-check"></i>
                  </div>
                  <h4 style={{ fontFamily: "'Libre Baskerville', serif", color: "#0b5278", fontSize: "22px", marginBottom: "8px" }}>
                    ¡Afiliación Activa y Exitosa!
                  </h4>
                  <p style={{ fontSize: "13px", color: "#555", marginBottom: "20px" }}>
                    Tu póliza de asistencia fue emitida en el sistema oficial.
                  </p>

                  <div style={{ background: "#f7fafc", border: "1px solid #e0e0e0", borderRadius: "4px", padding: "18px", textAlign: "left", fontSize: "13px", marginBottom: "25px", lineHeight: 1.8 }}>
                    <div><strong>Número de Contrato:</strong> <span style={{ color: "#0b5278", fontWeight: 700 }}>{memberData.contractNumber}</span></div>
                    <div><strong>Titular:</strong> <span>{memberData.fullName}</span></div>
                    <div><strong>Documento:</strong> <span>C.C. {memberData.docNumber}</span></div>
                    <div><strong>Plan Contratado:</strong> <span>{memberData.planName}</span></div>
                  </div>

                  <button
                    className="rev-btn"
                    style={{ width: "100%", marginBottom: "10px" }}
                    onClick={() => {
                      setIsCheckoutOpen(false);
                      setIsAuthenticated(true);
                      window.scrollTo({ top: 0, behavior: "instant" });
                    }}
                  >
                    <i className="fa fa-tachometer"></i> Entrar a Mi Portal de Afiliados
                  </button>

                  <button
                    className="rev-btn rev-btn-outline"
                    style={{ width: "100%" }}
                    onClick={() => alert(`Certificado ${memberData.contractNumber}.pdf descargado exitosamente.`)}
                  >
                    <i className="fa fa-file-pdf-o"></i> Descargar Certificado PDF
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* ========================================================
           MODAL 2: LOGIN DE AFILIADOS ("SOY AFILIADO")
           ======================================================== */}
      {isLoginOpen && (
        <div className="modal-backdrop open">
          <div className="modal-container" style={{ maxWidth: "440px" }}>
            <div className="modal-header">
              <h4>Portal de Afiliados · Ingreso</h4>
              <button className="modal-close" onClick={() => setIsLoginOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: "13px", color: "#666", marginBottom: "20px" }}>
                Ingresa tu número de documento de identidad para acceder a tu catálogo de asistencias y solicitar despachos.
              </p>

              <form onSubmit={handleLoginSubmit}>
                <div className="form-group">
                  <label>Número de Cédula o Documento *</label>
                  <input
                    type="text"
                    className="form-control-w"
                    placeholder="Ej: 1018492031"
                    value={loginDoc}
                    onChange={(e) => setLoginDoc(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Teléfono Registrado (Opcional)</label>
                  <input
                    type="tel"
                    className="form-control-w"
                    placeholder="320 123 4567"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                  />
                </div>

                <button type="submit" className="rev-btn" style={{ width: "100%", marginTop: "10px" }}>
                  Ingresar a Mi Portal <i className="fa fa-sign-in"></i>
                </button>

                <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px solid #eee", textAlign: "center", fontSize: "12px" }}>
                  <span style={{ color: "#888" }}>¿Quieres probar una cuenta demo?</span><br />
                  <a
                    onClick={() => { setLoginDoc("1018492031"); setLoginPhone("313 428 9397"); }}
                    style={{ color: "#4b722d", fontWeight: 700, cursor: "pointer" }}
                  >
                    Autocompletar Cédula Demo (Carlos Villamil)
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
           MODAL 3: SOLICITUD DE ASISTENCIA (DESPACHO WHATSAPP)
           ======================================================== */}
      {isRequestModalOpen && (
        <div className="modal-backdrop open">
          <div className="modal-container" style={{ maxWidth: "480px" }}>
            <div className="modal-header">
              <h4>Solicitar: {selectedServiceTitle}</h4>
              <button className="modal-close" onClick={() => setIsRequestModalOpen(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ background: "#f7fafc", border: "1px solid #0b5278", borderRadius: "4px", padding: "15px", marginBottom: "20px", fontSize: "13px", lineHeight: 1.6 }}>
                <div><strong>Afiliado:</strong> <span>{memberData.fullName}</span></div>
                <div><strong>Contrato:</strong> <span>{memberData.contractNumber}</span></div>
                <div><strong>Servicio:</strong> <span>{selectedServiceTitle}</span></div>
                <div><strong>Dirección:</strong> <span>{memberData.address}</span></div>
              </div>

              <p style={{ fontSize: "12px", color: "#666", marginBottom: "20px" }}>
                Al confirmar, nuestro sistema generará un número de radicado oficial y abrirá WhatsApp con el operador médico para despachar la unidad inmediatamente.
              </p>

              <button className="rev-btn" style={{ width: "100%" }} onClick={handleConfirmAssistance}>
                <i className="fa fa-whatsapp"></i> Confirmar Despacho por WhatsApp
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

"use client";

import React, { useState } from "react";
import { X, ShieldCheck, UserCheck, ArrowRight, Lock } from "lucide-react";

interface MemberLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (memberData: {
    fullName: string;
    docNumber: string;
    phone: string;
    email: string;
    contractNumber: string;
    planName: string;
    validUntil: string;
    address: string;
  }) => void;
}

export default function MemberLoginModal({
  isOpen,
  onClose,
  onLoginSuccess
}: MemberLoginModalProps) {
  const [docNumber, setDocNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) {
      setError("Por favor ingresa tu número de documento.");
      return;
    }

    // Authenticate member
    onLoginSuccess({
      fullName: "Carlos Andrés Villamil",
      docNumber: docNumber,
      phone: phone || "313 428 9397",
      email: "carlos.villamil@gmail.com",
      contractNumber: "SW-849102",
      planName: "Plan Plus Familiar 360°",
      validUntil: "04 de Noviembre, 2026",
      address: "Carrera 15 # 85-30, Bogotá"
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    onClose();
  };

  const handleDemoLogin = () => {
    onLoginSuccess({
      fullName: "Carlos Andrés Villamil",
      docNumber: "1018492031",
      phone: "313 428 9397",
      email: "carlos.villamil@gmail.com",
      contractNumber: "SW-849102",
      planName: "Plan Plus Familiar 360°",
      validUntil: "04 de Noviembre, 2026",
      address: "Carrera 15 # 85-30, Bogotá"
    });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full shadow-2xl border border-slate-300 ring-1 ring-slate-900/10 relative animate-in fade-in zoom-in duration-200 text-slate-800 overflow-hidden">
        {/* Header institucional */}
        <div className="bg-[#063a57] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center text-white">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Portal de Afiliados
              </h3>
              <p className="text-[11px] text-white/70">
                Soluciones W · Identificación Segura
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white p-1 rounded-md transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-7">
          <p className="text-xs text-slate-600 mb-5">
            Ingresa tu número de documento para consultar tu carnet digital, cupos disponibles y solicitar asistencias inmediatas.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Número de Cédula o Documento de Identidad *
              </label>
              <input
                type="text"
                required
                placeholder="Ej: 1018492031"
                value={docNumber}
                onChange={(e) => {
                  setDocNumber(e.target.value);
                  setError("");
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2.5 text-slate-900 focus:outline-none focus:border-[#167394] focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teléfono Celular Registrado (Opcional)
              </label>
              <input
                type="tel"
                placeholder="Ej: 313 428 9397"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-md p-2.5 text-slate-900 focus:outline-none focus:border-[#167394] focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#063a57] hover:bg-[#0a5278] text-white py-3 rounded-md font-bold uppercase tracking-wider text-xs shadow transition flex items-center justify-center gap-2 mt-2"
            >
              <span>Acceder al Portal de Afiliados</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            <div className="pt-2 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={handleDemoLogin}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-md font-semibold text-xs transition flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-[#167394]" />
                <span>Ingreso Rápido de Prueba (Demo Afiliado)</span>
              </button>
            </div>

            <p className="text-[11px] text-center text-slate-500 pt-1">
              ¿Aún no cuentas con un plan activo?{" "}
              <button
                type="button"
                onClick={onClose}
                className="text-[#167394] font-bold hover:underline"
              >
                Afíliate en línea aquí
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

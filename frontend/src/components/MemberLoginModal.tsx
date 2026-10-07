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
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in duration-200 text-slate-800">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#e8f4f8] text-[#167394] flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Ingreso de Afiliados
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Accede a tu carnet digital y solicita asistencias médicas y de hogar al instante.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Número de Cédula o Documento *
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
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-[#167394] focus:bg-white transition"
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
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:border-[#167394] focus:bg-white transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#167394] hover:bg-[#0a5278] text-white py-3.5 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition flex items-center justify-center gap-2 mt-2"
          >
            <span>Ingresar a Mi Portal</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </button>

          <div className="pt-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-xl font-semibold text-xs transition flex items-center justify-center gap-1.5"
            >
              <UserCheck className="w-4 h-4 text-[#167394]" />
              <span>Entrar como Afiliado de Prueba (Demo 1-Click)</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400 pt-2">
            ¿No estás afiliado aún?{" "}
            <button
              type="button"
              onClick={onClose}
              className="text-[#167394] font-bold hover:underline"
            >
              Afíliate en 2 minutos aquí
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

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
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const performLogin = async (doc: string, tel?: string) => {
    setError("");
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docNumber: doc.trim(), phone: tel?.trim() })
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "No se pudo iniciar sesión. Verifica tu documento.");
        return;
      }

      // Persistir JWT seguro en localStorage
      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("soluciones_w_token", data.token);
      }

      onLoginSuccess(data.affiliate);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }
      onClose();
    } catch (err) {
      console.error("Login error:", err);
      setError("Error de red al conectar con el servidor de autenticación.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNumber.trim()) {
      setError("Por favor ingresa tu número de documento.");
      return;
    }
    performLogin(docNumber, phone);
  };

  const handleQuickTestUser = (cedula: string) => {
    setDocNumber(cedula);
    performLogin(cedula);
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
              disabled={isLoading}
              className="w-full bg-[#063a57] hover:bg-[#0a5278] disabled:opacity-60 text-white py-3 rounded-md font-bold uppercase tracking-wider text-xs shadow transition flex items-center justify-center gap-2 mt-2"
            >
              <span>{isLoading ? "Verificando afiliación..." : "Acceder al Portal de Afiliados"}</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </button>

            {/* Cuentas de prueba rápidas */}
            <div className="pt-3 border-t border-slate-100 mt-4 space-y-2">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                Usuarios de prueba disponibles:
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickTestUser("1018492031")}
                  className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] transition"
                >
                  <p className="font-bold text-slate-800">C.C. 1018492031</p>
                  <p className="text-[10px] text-emerald-700">Carlos Villamil (Plus 360°)</p>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickTestUser("1020304050")}
                  className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] transition"
                >
                  <p className="font-bold text-slate-800">C.C. 1020304050</p>
                  <p className="text-[10px] text-[#167394]">María F. Gómez (Tradicional)</p>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickTestUser("80123456")}
                  className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] transition"
                >
                  <p className="font-bold text-slate-800">C.C. 80123456</p>
                  <p className="text-[10px] text-amber-700">Wilson Triana (Director)</p>
                </button>
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleQuickTestUser("52987654")}
                  className="p-2 text-left bg-red-50/60 hover:bg-red-50 border border-red-200 rounded text-[11px] transition"
                >
                  <p className="font-bold text-red-900">C.C. 52987654</p>
                  <p className="text-[10px] text-red-700">Laura Pérez (En Mora)</p>
                </button>
              </div>
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

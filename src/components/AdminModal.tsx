import React, { useState, useEffect, useRef } from 'react';
import { Lock, X, KeyRound, AlertCircle, ShieldAlert } from 'lucide-react';
import { useTransit } from '../context/TransitContext';

export const AdminModal: React.FC = () => {
  const { isAdminModalOpen, setIsAdminModalOpen, loginAdmin } = useTransit();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdminModalOpen) {
      setPin('');
      setError(false);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAdminModalOpen]);

  if (!isAdminModalOpen) return null;

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin) return;

    const success = loginAdmin(pin);
    if (!success) {
      setError(true);
      setPin('');
      inputRef.current?.focus();
    }
  };

  const handleKeypadPress = (val: string) => {
    setError(false);
    if (pin.length < 6) {
      const nextPin = pin + val;
      setPin(nextPin);
      if (nextPin === '0000') {
        loginAdmin('0000');
      }
    }
  };

  const handleBackspace = () => {
    setError(false);
    setPin((prev) => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden relative"
        dir="rtl"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm">نظام الإدارة والتحكم</h3>
              <p className="text-[11px] text-slate-400">منطقة مقيدة للمشرفين فقط</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsAdminModalOpen(false)}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
              <label className="text-xs font-semibold text-slate-600 block mb-2">
                أدخل رمز المرور الإداري المكون من 4 أرقام
              </label>

              {/* Pin dots / visual indicator */}
              <div className="flex justify-center gap-3 my-3">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      pin.length > idx
                        ? 'bg-blue-600 border-blue-600 scale-110'
                        : 'border-slate-300 bg-slate-100'
                    }`}
                  />
                ))}
              </div>

              {/* Hidden or real input */}
              <input
                ref={inputRef}
                type="password"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setError(false);
                  setPin(e.target.value);
                  if (e.target.value === '0000') {
                    loginAdmin('0000');
                  }
                }}
                placeholder="أدخل الرمز..."
                className="w-full text-center tracking-widest text-lg font-mono py-2 px-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>رمز المرور غير صحيح. يرجى المحاولة مرة أخرى.</span>
              </div>
            )}

            {/* Quick Numeric Keypad */}
            <div className="grid grid-cols-3 gap-2 pt-2">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map((btn) => (
                <button
                  key={btn}
                  type="button"
                  onClick={() => {
                    if (btn === 'C') {
                      setPin('');
                      setError(false);
                    } else if (btn === '⌫') {
                      handleBackspace();
                    } else {
                      handleKeypadPress(btn);
                    }
                  }}
                  className={`h-11 rounded-xl text-base font-bold transition-all active:scale-95 ${
                    btn === 'C'
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 text-xs'
                      : btn === '⌫'
                      ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-800'
                  }`}
                >
                  {btn}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm mt-3"
            >
              تسجيل الدخول للنظام
            </button>
          </form>

          {/* Discreet helper hint */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              رمز الدخول الافتراضي للتجربة: <strong className="font-mono text-slate-500">0000</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

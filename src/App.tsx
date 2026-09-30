/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { Header } from './components/Header';
import { WeatherBanner } from './components/WeatherBanner';
import { TripPlanner } from './components/TripPlanner';
import { ResultCard } from './components/ResultCard';
import { NetworkExplorer } from './components/NetworkExplorer';
import { FareGuide } from './components/FareGuide';
import { AdminModal } from './components/AdminModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import {
  Train,
  Zap,
  Compass,
  Bus,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Cpu,
  Layers,
} from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'planner' | 'explorer' | 'fares'>('planner');
  const { isDataCustomized } = useTransit();

  return (
    <div className="min-h-screen flex flex-col cyber-grid-bg text-slate-100 font-sans selection:bg-[#00f0ff] selection:text-[#060911]" dir="rtl">
      {/* Live Cairo Weather & Smart Transit Advice Banner in Cyberpunk Theme */}
      <WeatherBanner />

      {/* Top Navbar with Glowing Title, Language Links عربي | English, and Subtle Admin Gear */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Intro Banner */}
      <section className="relative pt-8 pb-10 sm:pb-12 text-center max-w-5xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-bold px-3.5 py-1.5 rounded-full bg-[#0a1526] text-[#00f0ff] border border-[#00f0ff]/40 shadow-[0_0_12px_rgba(0,240,255,0.3)] mb-4 animate-neon-pulse">
          <Cpu className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>CYBERNETIC TRANSIT SYSTEM // 2026</span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-3 neon-text-blue leading-tight">
          عالم المواصلات في مصر الحديثة
        </h1>
        <p className="text-xs sm:text-base text-[#a5f3fc] max-w-2xl mx-auto leading-relaxed font-mono opacity-90">
          دليل ذكي لحساب أسعار التذاكر وخطوط السير والتبديلات لمحطات مترو القاهرة، القطار الكهربائي، المونوريل، والأتوبيس الترددي.
        </p>

        {isDataCustomized && (
          <div className="mt-3 inline-flex items-center gap-2 text-xs text-amber-300 bg-amber-950/60 px-3 py-1 rounded-md border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.2)] font-mono">
            <span>⚡ SYSTEM OVERRIDE: إعدادات تسعير ومحطات معدلة من قبل المشرف</span>
          </div>
        )}
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-2.5 sm:px-6 lg:px-8 z-10 pb-12 sm:pb-16">
        {activeTab === 'planner' && (
          <div className="space-y-6 sm:space-y-10">
            {/* The composition is a single high-tech, dark charcoal-grey card with continuous brilliant neon blue edge lighting effect over a dark reflective floor surface */}
            <div className="neon-blue-card reflective-floor rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8">
              {/* Card Top Ambient HUD Bar */}
              <div className="flex items-center justify-between border-b border-[#00f0ff]/30 pb-3 sm:pb-4 mb-4 sm:mb-7 text-xs font-mono">
                <div className="flex items-center gap-2 text-[#00f0ff] min-w-0">
                  <Layers className="w-4 h-4 text-[#00f0ff] animate-pulse shrink-0" />
                  <span className="font-bold tracking-wider truncate">CORE TRANSIT MATRIX // حاسبة الرحلات الرسمية</span>
                </div>
                <div className="hidden sm:flex items-center gap-3 text-slate-400 text-[11px] shrink-0">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping"></span>
                    ONLINE
                  </span>
                  <span>·</span>
                  <span>EGYPT SMART MOBILITY</span>
                </div>
              </div>

              {/* Responsive Layout: Dual column on desktop (lg:), natural mobile flow */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-7 items-start">
                {/* Trip Planner Form */}
                <div className="lg:col-span-7 order-1 space-y-5 sm:space-y-6">
                  <TripPlanner />

                  {/* 3-Step Quick Guide visible on desktop underneath planner */}
                  <div className="hidden lg:block bg-[#090f1a] rounded-2xl border border-[#00f0ff]/30 p-4 sm:p-5 shadow-[inset_0_0_15px_rgba(0,240,255,0.06)]">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3.5 flex items-center gap-2 font-mono neon-text-subtle">
                      <HelpCircle className="w-4 h-4 text-[#00f0ff]" />
                      كيفية حساب الرحلة في 3 خطوات بسيطة:
                    </h3>
                    <div className="grid grid-cols-3 gap-2.5 sm:gap-3 text-xs text-slate-300 font-mono">
                      <div className="p-3 sm:p-3.5 rounded-xl bg-[#060a12] border border-[#00f0ff]/20 shadow-[0_0_6px_rgba(0,240,255,0.1)]">
                        <span className="font-bold text-[#00f0ff] block mb-1">1. اختر المشروع</span>
                        المترو، القطار السريع، المونوريل، أو الأتوبيس الترددي BRT.
                      </div>
                      <div className="p-3 sm:p-3.5 rounded-xl bg-[#060a12] border border-[#00f0ff]/20 shadow-[0_0_6px_rgba(0,240,255,0.1)]">
                        <span className="font-bold text-[#00f0ff] block mb-1">2. حدد المحطات</span>
                        اختر محطتي الركوب والنزول من القوائم الذكية.
                      </div>
                      <div className="p-3 sm:p-3.5 rounded-xl bg-[#060a12] border border-[#00f0ff]/20 shadow-[0_0_6px_rgba(0,240,255,0.1)]">
                        <span className="font-bold text-[#00f0ff] block mb-1">3. التذكرة والمسار</span>
                        شاهد عدد المحطات، سعر التذكرة، والتبديلات إن وجدت.
                      </div>
                    </div>
                  </div>
                </div>

                {/* Result Card: Sticky on desktop, right below planner on mobile */}
                <div className="lg:col-span-5 order-2 lg:sticky lg:top-24">
                  <ResultCard />
                </div>

                {/* 3-Step Quick Guide on mobile (placed after ResultCard so mobile user sees their result immediately) */}
                <div className="block lg:hidden order-3 w-full bg-[#090f1a] rounded-2xl border border-[#00f0ff]/30 p-3.5 sm:p-5 shadow-[inset_0_0_15px_rgba(0,240,255,0.06)]">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2 font-mono neon-text-subtle">
                    <HelpCircle className="w-4 h-4 text-[#00f0ff]" />
                    كيفية حساب الرحلة في 3 خطوات بسيطة:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 font-mono">
                    <div className="p-3 rounded-xl bg-[#060a12] border border-[#00f0ff]/20 shadow-[0_0_6px_rgba(0,240,255,0.1)]">
                      <span className="font-bold text-[#00f0ff] block mb-1">1. اختر المشروع</span>
                      المترو، القطار السريع، المونوريل، أو الأتوبيس الترددي BRT.
                    </div>
                    <div className="p-3 rounded-xl bg-[#060a12] border border-[#00f0ff]/20 shadow-[0_0_6px_rgba(0,240,255,0.1)]">
                      <span className="font-bold text-[#00f0ff] block mb-1">2. حدد المحطات</span>
                      اختر محطتي الركوب والنزول من القوائم الذكية.
                    </div>
                    <div className="p-3 rounded-xl bg-[#060a12] border border-[#00f0ff]/20 shadow-[0_0_6px_rgba(0,240,255,0.1)]">
                      <span className="font-bold text-[#00f0ff] block mb-1">3. التذكرة والمسار</span>
                      شاهد عدد المحطات، سعر التذكرة، والتبديلات إن وجدت.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'explorer' && (
          <div className="neon-blue-card reflective-floor rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-8">
            <NetworkExplorer />
          </div>
        )}

        {activeTab === 'fares' && (
          <div className="neon-blue-card reflective-floor rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 lg:p-8">
            <FareGuide />
          </div>
        )}
      </main>

      {/* Hidden Admin Passcode Modal & Admin Dashboard */}
      <AdminModal />
      <AdminDashboard />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <TransitProvider>
      <MainApp />
    </TransitProvider>
  );
}

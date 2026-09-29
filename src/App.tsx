/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TransitProvider, useTransit } from './context/TransitContext';
import { Header } from './components/Header';
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
} from 'lucide-react';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'planner' | 'explorer' | 'fares'>('planner');
  const { isDataCustomized } = useTransit();

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans" dir="rtl">
      {/* Top Navbar */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Hero Intro Banner */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-800 text-white pt-8 pb-10 sm:pb-14 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>منظومة النقل الجماعي الذكي والأخضر 2026</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              عالم المواصلات في مصر الحديثة
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              دليل ذكي لحساب أسعار التذاكر وخطوط السير والتبديلات لمحطات مترو القاهرة، القطار الكهربائي، المونوريل، والأتوبيس الترددي.
            </p>

            {isDataCustomized && (
              <div className="mt-3 inline-flex items-center gap-2 text-xs text-amber-300 bg-amber-500/10 px-3 py-1 rounded-md border border-amber-500/20">
                <span>⚡ يتم استخدام إعدادات تسعير ومحطات معدلة من قبل المشرف</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 z-10">
        {activeTab === 'planner' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Trip Planner Form */}
              <div className="lg:col-span-7 space-y-6">
                <TripPlanner />

                {/* Quick Info / Guide Card */}
                <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-600" />
                    كيف تحسب رحلتك في 3 خطوات بسيطة:
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-blue-600 block mb-1">1. اختر المشروع</span>
                      المترو أو القطار الكهربائي أو المونوريل أو الأتوبيس الترددي.
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-blue-600 block mb-1">2. حدد المحطات</span>
                      اختر محطة الركوب ومحطة النزول من القوائم الذكية.
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="font-bold text-blue-600 block mb-1">3. احصل على التذكرة</span>
                      شاهد السعر، عدد المحطات، والتبديلات إن وجدت فورياً.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Result Card */}
              <div className="lg:col-span-5 sticky top-24">
                <ResultCard />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'explorer' && <NetworkExplorer />}

        {activeTab === 'fares' && <FareGuide />}
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

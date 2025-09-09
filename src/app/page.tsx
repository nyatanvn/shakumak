'use client'

import { useState } from 'react'
import ShakuhachiCalculator from '@/components/ShakuhachiCalculator'
import DiatonicShakuhachiCalculator from '@/components/DiatonicShakuhachiCalculator'
import VariationShakuhachiCalculator from '@/components/VariationShakuhachiCalculator'
import MetronomeTab from '@/components/MetronomeTab'

type TabType = 'traditional' | 'diatonic' | 'variation' | 'metronome'

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('traditional')

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Shakuhachi Makers Tool</h1>
          <p className="text-xl text-slate-700 mb-8">
            Calculate precise hole positions for making traditional and diatonic shakuhachi
          </p>
          
          {/* Tab Selector */}
          <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1 mb-8">
            <button
              onClick={() => setActiveTab('traditional')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'traditional'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Traditional (5-hole)
            </button>
            <button
              onClick={() => setActiveTab('diatonic')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'diatonic'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Diatonic (7-hole)
            </button>
            <button
              onClick={() => setActiveTab('variation')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'variation'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              Variation (5-hole)
            </button>
            <button
              onClick={() => setActiveTab('metronome')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'metronome'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              🎵 Metronome
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {activeTab === 'traditional' ? (
            <ShakuhachiCalculator />
          ) : activeTab === 'diatonic' ? (
            <DiatonicShakuhachiCalculator />
          ) : activeTab === 'variation' ? (
            <VariationShakuhachiCalculator />
          ) : (
            <MetronomeTab />
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-600 text-sm">
          <p>
            Based on algorithms by Nelson Zink, implemented by Jeremy Bornstein,
            extended by Tran Nghia and Jacopo Saporetti
          </p>
          <p className="mt-2">
            Modern web implementation for shakuhachi makers with integrated metronome
          </p>
        </div>
      </div>
    </main>
  )
}

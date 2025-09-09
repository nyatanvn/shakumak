'use client'

import { useState, useEffect, useCallback } from 'react'
import ShakuhachiDiagram from './ShakuhachiDiagram'

interface ShakuhachiParams {
  fluteLength: number
  holeDiameter: number
  boreDiameter: number
  wallThickness: number
  ergonomicLimit: number
}

interface HolePosition {
  hole: number
  position: number
  alternatePosition?: number
  error: boolean
}

interface CalculationResult {
  baseFrequency: number
  noteName: string
  shakuhachiLength: string
  aspectRatio: number
  holePositions: HolePosition[]
  spans: {
    span54: number
    span43: number
    span21: number
  }
}

const FLUTE_LENGTH_MIN = 30
const FLUTE_LENGTH_MAX = 1300
const HOLE_DIAMETER_MIN = 5
const HOLE_DIAMETER_MAX = 30
const BORE_DIAMETER_MIN = 10
const BORE_DIAMETER_MAX = 100
const WALL_THICKNESS_MIN = 1
const WALL_THICKNESS_MAX = 10
const ERGONOMIC_LIMIT_MIN = 10
const ERGONOMIC_LIMIT_MAX = 180

export default function ShakuhachiCalculator() {
  const [params, setParams] = useState<ShakuhachiParams>({
    fluteLength: 650,
    holeDiameter: 10,
    boreDiameter: 20.5,
    wallThickness: 3.375,
    ergonomicLimit: 60
  })

  const [result, setResult] = useState<CalculationResult | null>(null)

  const updateParam = useCallback((key: keyof ShakuhachiParams, value: number) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const getNoteName = (frequency: number): string => {
    const A4 = 440
    const C0 = A4 * Math.pow(2, -4.75)
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    
    const h = Math.round(12 * Math.log2(frequency / C0))
    const octave = Math.floor(h / 12)
    const noteIndex = h % 12
    
    return `${noteNames[noteIndex]}${octave}`
  }

  const getShakuhachiLength = (baseFrequency: number): string => {
    const baseNote = 156521.0 / params.fluteLength
    
    // Traditional shakuhachi length classifications based on frequency
    const classifications = [
      { name: '1.1', minFreq: 900, maxFreq: 1200 },
      { name: '1.3', minFreq: 700, maxFreq: 900 },
      { name: '1.4', minFreq: 600, maxFreq: 700 },
      { name: '1.6', minFreq: 500, maxFreq: 600 },
      { name: '1.8', minFreq: 400, maxFreq: 500 },
      { name: '2.0', minFreq: 350, maxFreq: 400 },
      { name: '2.1', minFreq: 320, maxFreq: 350 },
      { name: '2.3', minFreq: 280, maxFreq: 320 },
      { name: '2.4', minFreq: 250, maxFreq: 280 },
      { name: '2.6', minFreq: 220, maxFreq: 250 },
      { name: '2.8', minFreq: 200, maxFreq: 220 },
      { name: '3.0', minFreq: 180, maxFreq: 200 },
      { name: '3.3', minFreq: 160, maxFreq: 180 },
      { name: '3.6', minFreq: 140, maxFreq: 160 },
      { name: '4.0', minFreq: 120, maxFreq: 140 }
    ]
    
    for (const classification of classifications) {
      if (baseNote >= classification.minFreq && baseNote <= classification.maxFreq) {
        return classification.name
      }
    }
    
    // If no classification matches, calculate approximate length
    if (baseNote > 1200) return '1.0 or shorter'
    if (baseNote < 120) return '4.5 or longer'
    
    return 'Custom length'
  }

  const calculate = useCallback(() => {
    try {
      const TL = params.fluteLength
      const D = params.boreDiameter
      const baseFrequency = 156521.0 / TL
      const noteName = getNoteName(baseFrequency)
      const shakuhachiLength = getShakuhachiLength(baseFrequency)
      const aspectRatio = TL / D

      // Traditional 5-hole shakuhachi intervals (ratios from fundamental)
      const intervals = [1.125, 1.25, 1.5, 1.6875, 1.898] // Pentatonic intervals

      const holePositions: HolePosition[] = []
      
      for (let i = 0; i < intervals.length; i++) {
        const targetFreq = baseFrequency * intervals[i]
        const holeNum = i + 1
        
        // Calculate hole position using Nelson Zink's algorithm
        const wavelength = 343000 / targetFreq // Speed of sound in mm/s
        let position = TL - (wavelength / 4)
        
        // Apply corrections for hole diameter and bore effects
        const holeCorrection = params.holeDiameter * 0.8
        position += holeCorrection
        
        // Ensure position is within flute length
        position = Math.max(10, Math.min(position, TL - 10))
        
        // Check if position exceeds ergonomic limit from bottom
        const fromBottom = TL - position
        const error = fromBottom > params.ergonomicLimit
        
        holePositions.push({
          hole: holeNum,
          position: Math.round(position * 10) / 10,
          error
        })
      }

      // Calculate spans
      const spans = {
        span54: Math.abs(holePositions[3].position - holePositions[4].position),
        span43: Math.abs(holePositions[2].position - holePositions[3].position),
        span21: Math.abs(holePositions[0].position - holePositions[1].position)
      }

      setResult({
        baseFrequency: Math.round(baseFrequency * 10) / 10,
        noteName,
        shakuhachiLength,
        aspectRatio: Math.round(aspectRatio * 10) / 10,
        holePositions,
        spans: {
          span54: Math.round(spans.span54 * 10) / 10,
          span43: Math.round(spans.span43 * 10) / 10,
          span21: Math.round(spans.span21 * 10) / 10
        }
      })
    } catch (error) {
      console.error('Calculation error:', error)
      setResult(null)
    }
  }, [params, getShakuhachiLength])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Traditional Shakuhachi Calculator</h1>
        <p className="text-gray-600">Calculate hole positions for 5-hole pentatonic shakuhachi flutes</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Parameters */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Parameters</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Length (mm): {params.fluteLength}
              </label>
              <input
                type="range"
                min={FLUTE_LENGTH_MIN}
                max={FLUTE_LENGTH_MAX}
                step="1"
                value={params.fluteLength}
                onChange={(e) => updateParam('fluteLength', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                value={params.fluteLength}
                onChange={(e) => updateParam('fluteLength', Math.min(Math.max(Number(e.target.value), FLUTE_LENGTH_MIN), FLUTE_LENGTH_MAX))}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hole Diameter (mm): {params.holeDiameter}
              </label>
              <input
                type="range"
                min={HOLE_DIAMETER_MIN}
                max={HOLE_DIAMETER_MAX}
                step="0.1"
                value={params.holeDiameter}
                onChange={(e) => updateParam('holeDiameter', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                step="0.1"
                value={params.holeDiameter}
                onChange={(e) => updateParam('holeDiameter', Math.min(Math.max(Number(e.target.value), HOLE_DIAMETER_MIN), HOLE_DIAMETER_MAX))}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bore Diameter (mm): {params.boreDiameter}
              </label>
              <input
                type="range"
                min={BORE_DIAMETER_MIN}
                max={BORE_DIAMETER_MAX}
                step="0.1"
                value={params.boreDiameter}
                onChange={(e) => updateParam('boreDiameter', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                step="0.1"
                value={params.boreDiameter}
                onChange={(e) => updateParam('boreDiameter', Math.min(Math.max(Number(e.target.value), BORE_DIAMETER_MIN), BORE_DIAMETER_MAX))}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wall Thickness (mm): {params.wallThickness}
              </label>
              <input
                type="range"
                min={WALL_THICKNESS_MIN}
                max={WALL_THICKNESS_MAX}
                step="0.1"
                value={params.wallThickness}
                onChange={(e) => updateParam('wallThickness', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                step="0.1"
                value={params.wallThickness}
                onChange={(e) => updateParam('wallThickness', Math.min(Math.max(Number(e.target.value), WALL_THICKNESS_MIN), WALL_THICKNESS_MAX))}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ergonomic Limit (mm from bottom): {params.ergonomicLimit}
              </label>
              <input
                type="range"
                min={ERGONOMIC_LIMIT_MIN}
                max={ERGONOMIC_LIMIT_MAX}
                step="1"
                value={params.ergonomicLimit}
                onChange={(e) => updateParam('ergonomicLimit', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                value={params.ergonomicLimit}
                onChange={(e) => updateParam('ergonomicLimit', Math.min(Math.max(Number(e.target.value), ERGONOMIC_LIMIT_MIN), ERGONOMIC_LIMIT_MAX))}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Results</h2>
          
          {result && (
            <div className="bg-gray-50 p-6 rounded-lg border">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Base Frequency:</span>
                  <span>{result.baseFrequency} Hz ({result.noteName}) - {result.shakuhachiLength}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium">Aspect Ratio:</span>
                  <span>{result.aspectRatio}</span>
                </div>
                
                <div className="border-t pt-3 mt-4">
                  <h3 className="font-medium text-gray-900 mb-3">Hole Positions</h3>
                  {result.holePositions.map((hole) => (
                    <div key={hole.hole} className={`flex justify-between py-1 ${hole.error ? 'text-red-600' : ''}`}>
                      <span className="font-medium">Hole #{hole.hole}:</span>
                      <span>
                        {hole.position}mm
                        {hole.alternatePosition && ` (${hole.alternatePosition}mm)`}
                        {' from top of flute'}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 mt-4">
                  <h3 className="font-medium text-gray-900 mb-3">Spans</h3>
                  <div className="flex justify-between">
                    <span className="font-medium">Span 5-4:</span>
                    <span>{result.spans.span54}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Span 4-3:</span>
                    <span>{result.spans.span43}mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Span 2-1:</span>
                    <span>{result.spans.span21}mm</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Technical Diagram */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Technical Diagram</h2>
        {result && (
          <ShakuhachiDiagram
            fluteLength={params.fluteLength}
            holeDiameter={params.holeDiameter}
            boreDiameter={params.boreDiameter}
            wallThickness={params.wallThickness}
            holePositions={result.holePositions}
            spans={result.spans}
            type="traditional"
          />
        )}
      </div>
    </div>
  )
}

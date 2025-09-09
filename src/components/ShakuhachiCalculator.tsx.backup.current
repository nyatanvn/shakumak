'use client'

import { useState, useEffect, useCallback } from 'react'
import ShakuhachiDiagram from './ShakuhachiDiagram'
import AcousticVisualization from './AcousticVisualization'

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
  noteName: string
  frequency: number
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
    span32: number
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
    fluteLength: 540,
    holeDiameter: 10,
    boreDiameter: 19,
    wallThickness: 4,
    ergonomicLimit: 60
  })

  const [inputValues, setInputValues] = useState({
    fluteLength: '540',
    holeDiameter: '10',
    boreDiameter: '19',
    wallThickness: '4',
    ergonomicLimit: '60'
  })

  const [result, setResult] = useState<CalculationResult | null>(null)

  const updateParam = useCallback((key: keyof ShakuhachiParams, value: number) => {
    setParams(prev => ({
      ...prev,
      [key]: value
    }))
    // Also update the input display value
    setInputValues(prev => ({
      ...prev,
      [key]: value.toString()
    }))
  }, [])

  const handleInputChange = useCallback((key: keyof ShakuhachiParams, value: string, min: number, max: number) => {
    // Update the display value immediately
    setInputValues(prev => ({ ...prev, [key]: value }))
    
    // If value is empty, don't update the params (keep the last valid value)
    if (value === '') {
      return
    }
    
    // Parse and validate the number
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= min) {
      // Only update if the number is within a reasonable range (at or above minimum)
      // This prevents premature clamping while user is typing
      const clampedValue = Math.min(numValue, max)
      updateParam(key, clampedValue)
    }
  }, [updateParam])

  const handleInputBlur = useCallback((key: keyof ShakuhachiParams, min: number, max: number) => {
    // On blur, if input is empty, restore the current param value
    const currentInputValue = inputValues[key]
    if (currentInputValue === '') {
      setInputValues(prev => ({ ...prev, [key]: params[key].toString() }))
    }
  }, [inputValues, params])

  const getNoteName = useCallback((hertz: number): string => {
    // Original Nelson Zink note name algorithm
    const baseFrequency = 440
    const noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']
    const A = Math.pow(2, 1/12)
    let valueLow = -50
    let valueHigh = 50

    const nameForNoteBySemitones = (count: number): string => {
      const mod = count % 12
      if (mod < 0) return noteNames[12 + mod]
      else return noteNames[mod]
    }

    let tries = 0
    while (true) {
      const middle = Math.round((valueHigh - valueLow) / 2 + valueLow)
      const freq = baseFrequency * Math.pow(A, middle)

      if (freq < hertz) valueLow = middle
      else if (freq > hertz) valueHigh = middle

      if (valueLow + 1 === valueHigh) {
        const diffLow = hertz - baseFrequency * Math.pow(A, valueLow)
        const diffHigh = baseFrequency * Math.pow(A, valueHigh) - hertz
        if (diffLow < diffHigh) {
          return nameForNoteBySemitones(valueLow)
        } else {
          return nameForNoteBySemitones(valueHigh)
        }
      }

      tries += 1
      if (tries > 16) break
    }

    return '?'
  }, [])

  const getTraditionalHoleNoteName = useCallback((holeIndex: number, baseNote: number): string => {
    // Traditional shakuhachi hole numbering (corrected for proper convention):
    // Algorithm index 0 (closest to top) = Hole #5 (Thumb) = +12 semitones (D, 1 octave)
    // Algorithm index 1 = Hole #4 = +10 semitones (A#/Bb)
    // Algorithm index 2 = Hole #3 = +7 semitones (G)  
    // Algorithm index 3 = Hole #2 = +5 semitones (F#/Gb)
    // Algorithm index 4 (furthest from top) = Hole #1 = +3 semitones (F)
    const semitonesToAdd = [12, 10, 7, 5, 3][holeIndex] // [Thumb=D, 4=A#, 3=G, 2=F#, 1=F]
    const targetFreq = baseNote * Math.pow(2, semitonesToAdd / 12)
    return getNoteName(targetFreq)
  }, [getNoteName])

  const getShakuhachiLength = useCallback((baseFrequency: number): string => {
    // Traditional shakuhachi length classifications based on base frequency
    // Corrected frequency ranges for accurate classification
    const classifications = [
      { name: '1.1', minFreq: 525, maxFreq: 600 },
      { name: '1.3', minFreq: 450, maxFreq: 525 },
      { name: '1.4', minFreq: 415, maxFreq: 450 },
      { name: '1.6', minFreq: 365, maxFreq: 415 },
      { name: '1.8', minFreq: 285, maxFreq: 365 },  // D key ~294Hz should be here
      { name: '2.0', minFreq: 260, maxFreq: 285 },
      { name: '2.1', minFreq: 245, maxFreq: 260 },
      { name: '2.3', minFreq: 220, maxFreq: 245 },
      { name: '2.4', minFreq: 205, maxFreq: 220 },
      { name: '2.6', minFreq: 185, maxFreq: 205 },
      { name: '2.8', minFreq: 170, maxFreq: 185 },
      { name: '3.0', minFreq: 155, maxFreq: 170 },
      { name: '3.3', minFreq: 140, maxFreq: 155 },
      { name: '3.6', minFreq: 125, maxFreq: 140 },
      { name: '4.0', minFreq: 110, maxFreq: 125 }
    ]
    
    for (const classification of classifications) {
      if (baseFrequency >= classification.minFreq && baseFrequency <= classification.maxFreq) {
        return classification.name
      }
    }
    
    // If no classification matches, calculate approximate length
    if (baseFrequency > 600) return '1.0 or shorter'
    if (baseFrequency < 110) return '4.5 or longer'
    
    return 'Custom length'
  }, [])

  const calculate = useCallback(() => {
    try {
      // Nelson Zink's original algorithm - variable names preserved
      const TL = params.fluteLength
      const Dh = params.holeDiameter
      const BaseNote = 156521.0 / TL
      const Db = params.boreDiameter
      const Wt = params.wallThickness
      const Te = Wt + (0.75 * Dh)
      const BigNum = 165674
      const TubeLength = BigNum / BaseNote
      const MEL = TubeLength - (0.3 * Db) - TL
      const AspectRatio = TL / Db

      const noteName = getNoteName(BaseNote)
      const shakuhachiLength = getShakuhachiLength(BaseNote)

      let LastLength = TubeLength
      let temp = 0
      const HoleLocations: number[] = []
      const Interval = [3, 2, 2, 3, 2] // Traditional shakuhachi intervals in semitones

      for (let zz = 0; zz < Interval.length; zz++) {
        const thisInterval = Interval[zz]
        temp += thisInterval
        const Hz = BaseNote * Math.pow(2, temp / 12.0)
        const NewLength = BigNum / Hz
        const S = (LastLength - NewLength) / 2.0
        const CF = S * (Math.pow(((Te / S) * Math.pow(Db / Dh, 2) * 2) + 1, 0.5) - 1)
        const HoleLocation = Math.round(NewLength - MEL - CF)
        HoleLocations.push(HoleLocation)
        LastLength = NewLength + CF
      }

      // Reverse to get correct hole order (1-5 from bottom to top)
      HoleLocations.reverse()

      const ErgoSpan = params.ergonomicLimit
      const ThumbS = HoleLocations[1] - HoleLocations[0]
      const TopS = HoleLocations[2] - HoleLocations[1]
      const BottomS = HoleLocations[4] - HoleLocations[3]

      // Calculate alternate positions for ergonomic issues
      const AlternateHoleLocations: (number | null)[] = [null, null, null, null, null]
      if (ThumbS > (ErgoSpan * 2.0 / 3.0)) {
        AlternateHoleLocations[0] = HoleLocations[1] - Math.round(ErgoSpan * 2.0 / 3.0)
      }
      if (TopS > ErgoSpan) {
        AlternateHoleLocations[2] = HoleLocations[1] + ErgoSpan
      }
      if (BottomS > ErgoSpan) {
        AlternateHoleLocations[4] = HoleLocations[3] + ErgoSpan
      }

      // Build hole positions array with correct shakuhachi numbering
      const holePositions: HolePosition[] = []
      for (let i = 0; i < HoleLocations.length; i++) {
        // Map algorithm index to correct shakuhachi hole number
        // Index 0 (closest to top) = Hole #5 (Thumb)
        // Index 1 = Hole #4, Index 2 = Hole #3, Index 3 = Hole #2, Index 4 = Hole #1
        const shakuhachiHoleNumber = i === 0 ? 5 : (5 - i)
        const semitonesToAdd = [12, 10, 7, 5, 3][i] // Semitones for each hole
        const holeFrequency = BaseNote * Math.pow(2, semitonesToAdd / 12)
        
        holePositions.push({
          hole: shakuhachiHoleNumber,
          position: HoleLocations[i],
          alternatePosition: AlternateHoleLocations[i] || undefined,
          error: HoleLocations[i] <= 0,
          noteName: getTraditionalHoleNoteName(i, BaseNote),
          frequency: Math.round(holeFrequency * 100) / 100 // Round to 2 decimal places
        })
      }

      // Calculate spans between adjacent holes (using correct shakuhachi numbering)
      // HoleLocations[0] = Hole #5 (Thumb), HoleLocations[1] = Hole #4, etc.
      const spans = {
        span54: HoleLocations[1] - HoleLocations[0], // Hole #5 to Hole #4
        span43: HoleLocations[2] - HoleLocations[1], // Hole #4 to Hole #3  
        span32: HoleLocations[3] - HoleLocations[2], // Hole #3 to Hole #2
        span21: HoleLocations[4] - HoleLocations[3]  // Hole #2 to Hole #1
      }

      setResult({
        baseFrequency: Math.round(BaseNote * 100) / 100,
        noteName,
        shakuhachiLength,
        aspectRatio: Math.round(AspectRatio * 100) / 100,
        holePositions,
        spans: {
          span54: Math.round(spans.span54 * 10) / 10,
          span43: Math.round(spans.span43 * 10) / 10,
          span32: Math.round(spans.span32 * 10) / 10,
          span21: Math.round(spans.span21 * 10) / 10
        }
      })
    } catch (error) {
      console.error('Calculation error:', error)
      setResult(null)
    }
  }, [params, getShakuhachiLength, getNoteName, getTraditionalHoleNoteName])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Traditional Shakuhachi Calculator</h1>
        <p className="text-slate-700">Calculate hole positions for 5-hole pentatonic shakuhachi flutes</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Parameters */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Parameters</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
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
                value={inputValues.fluteLength}
                onChange={(e) => handleInputChange('fluteLength', e.target.value, FLUTE_LENGTH_MIN, FLUTE_LENGTH_MAX)}
                onBlur={() => handleInputBlur('fluteLength', FLUTE_LENGTH_MIN, FLUTE_LENGTH_MAX)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
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
                value={inputValues.holeDiameter}
                onChange={(e) => handleInputChange('holeDiameter', e.target.value, HOLE_DIAMETER_MIN, HOLE_DIAMETER_MAX)}
                onBlur={() => handleInputBlur('holeDiameter', HOLE_DIAMETER_MIN, HOLE_DIAMETER_MAX)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
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
                value={inputValues.boreDiameter}
                onChange={(e) => handleInputChange('boreDiameter', e.target.value, BORE_DIAMETER_MIN, BORE_DIAMETER_MAX)}
                onBlur={() => handleInputBlur('boreDiameter', BORE_DIAMETER_MIN, BORE_DIAMETER_MAX)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
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
                value={inputValues.wallThickness}
                onChange={(e) => handleInputChange('wallThickness', e.target.value, WALL_THICKNESS_MIN, WALL_THICKNESS_MAX)}
                onBlur={() => handleInputBlur('wallThickness', WALL_THICKNESS_MIN, WALL_THICKNESS_MAX)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
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
                value={inputValues.ergonomicLimit}
                onChange={(e) => handleInputChange('ergonomicLimit', e.target.value, ERGONOMIC_LIMIT_MIN, ERGONOMIC_LIMIT_MAX)}
                onBlur={() => handleInputBlur('ergonomicLimit', ERGONOMIC_LIMIT_MIN, ERGONOMIC_LIMIT_MAX)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Results */}
        <div>
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Results</h2>
          
          {result && (
            <div className="bg-slate-50 p-6 rounded-lg border">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-slate-800">Base Frequency:</span>
                  <span className="text-slate-900">{result.baseFrequency} Hz ({result.noteName}) - {result.shakuhachiLength}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-slate-800">Aspect Ratio:</span>
                  <span className="text-slate-900">{result.aspectRatio}</span>
                </div>
                
                <div className="border-t pt-3 mt-4">
                  <h3 className="font-medium text-slate-900 mb-3">Hole Positions</h3>
                  {result.holePositions
                    .sort((a, b) => a.hole - b.hole) // Sort by hole number 1-5
                    .map((hole) => (
                    <div key={hole.hole} className={`flex justify-between py-1 ${hole.error ? 'text-red-700' : 'text-slate-800'}`}>
                      <span className="font-medium">
                        Hole #{hole.hole}{hole.hole === 5 ? ' (Thumb)' : ''} ({hole.noteName} - {hole.frequency}Hz):
                      </span>
                      <span>
                        {hole.position}mm
                        {hole.alternatePosition && ` (${hole.alternatePosition}mm)`}
                        {' from top of flute'}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 mt-4">
                  <h3 className="font-medium text-slate-900 mb-3">Spans</h3>
                  <div className="flex justify-between text-slate-800">
                    <span className="font-medium">Span 5-4:</span>
                    <span>{result.spans.span54}mm</span>
                  </div>
                  <div className="flex justify-between text-slate-800">
                    <span className="font-medium">Span 4-3:</span>
                    <span>{result.spans.span43}mm</span>
                  </div>
                  <div className="flex justify-between text-slate-800">
                    <span className="font-medium">Span 3-2:</span>
                    <span>{result.spans.span32}mm</span>
                  </div>
                  <div className="flex justify-between text-slate-800">
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
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Technical Diagram</h2>
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

      {/* Acoustic Standing Wave Analysis */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Acoustic Standing Wave Analysis</h2>
        {result && (
          <AcousticVisualization
            fluteLength={params.fluteLength}
            baseFrequency={result.baseFrequency}
            holePositions={result.holePositions}
            boreDiameter={params.boreDiameter}
          />
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import ShakuhachiDiagram from './ShakuhachiDiagram'
import AcousticVisualization from './AcousticVisualization'

interface DiatonicParams {
  fluteLength: number
  holeDiameter: number
  boreDiameter: number
  wallThickness: number
  ergonomicLimit: number
}

interface DiatonicHolePosition {
  hole: number
  position: number
  alternatePosition?: number
  error: boolean
  noteName: string
  frequency: number
}

interface DiatonicCalculationResult {
  baseFrequency: number
  noteName: string
  shakuhachiLength: string
  aspectRatio: number
  holePositions: DiatonicHolePosition[]
  spans: Record<string, number>
}

const FLUTE_LENGTH_MIN = 30
const FLUTE_LENGTH_MAX = 1000
const HOLE_DIAMETER_MIN = 5
const HOLE_DIAMETER_MAX = 30
const BORE_DIAMETER_MIN = 10
const BORE_DIAMETER_MAX = 100
const WALL_THICKNESS_MIN = 1
const WALL_THICKNESS_MAX = 10
const ERGONOMIC_LIMIT_MIN = 10
const ERGONOMIC_LIMIT_MAX = 180

export default function DiatonicShakuhachiCalculator() {
  const [params, setParams] = useState<DiatonicParams>({
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

  const [result, setResult] = useState<DiatonicCalculationResult | null>(null)

  const noteNames = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#']

  // Traditional shakuhachi length classification
  const getShakuhachiLength = (lengthMm: number): string => {
    // Traditional shakuhachi lengths with their corresponding base notes
    // Based on the formula: BaseNote = 156521.0 / TL
    // 1.6 shaku (≈485mm) → E (≈323Hz)
    // 1.8 shaku (≈545mm) → D (≈287Hz)  
    // 2.0 shaku (≈606mm) → C (≈258Hz)
    
    const traditionalLengths = [
      { name: '1.1', minMm: 318, maxMm: 348 }, // A# (≈470Hz)
      { name: '1.2', minMm: 349, maxMm: 379 }, // A (≈430Hz)
      { name: '1.3', minMm: 380, maxMm: 409 }, // G (≈397Hz)
      { name: '1.4', minMm: 410, maxMm: 439 }, // F# (≈368Hz)
      { name: '1.5', minMm: 440, maxMm: 469 }, // F (≈344Hz)
      { name: '1.6', minMm: 470, maxMm: 500 }, // E (≈323Hz) - Traditional
      { name: '1.7', minMm: 501, maxMm: 530 }, // D# (≈303Hz)
      { name: '1.8', minMm: 531, maxMm: 561 }, // D (≈287Hz) - Traditional
      { name: '1.9', minMm: 562, maxMm: 591 }, // C# (≈272Hz)
      { name: '2.0', minMm: 592, maxMm: 621 }, // C (≈258Hz) - Traditional
      { name: '2.1', minMm: 622, maxMm: 652 }, // B (≈246Hz)
      { name: '2.2', minMm: 653, maxMm: 682 }, // A# (≈235Hz)
      { name: '2.3', minMm: 683, maxMm: 712 }, // A (≈225Hz)
      { name: '2.4', minMm: 713, maxMm: 743 }, // G# (≈215Hz)
      { name: '2.5', minMm: 744, maxMm: 773 }, // G# (≈207Hz)
      { name: '2.6', minMm: 774, maxMm: 804 }, // G (≈196Hz)
      { name: '2.7', minMm: 805, maxMm: 834 }, // F# (≈188Hz)
      { name: '2.8', minMm: 835, maxMm: 865 }, // F (≈181Hz)
      { name: '2.9', minMm: 866, maxMm: 895 }, // F (≈175Hz)
      { name: '3.0', minMm: 896, maxMm: 926 }, // E (≈169Hz)
      { name: '3.1', minMm: 927, maxMm: 956 }, // D# (≈164Hz)
      { name: '3.2', minMm: 957, maxMm: 987 }, // D (≈159Hz)
      { name: '3.3', minMm: 988, maxMm: 1017 }, // C# (≈154Hz)
      { name: '3.4', minMm: 1018, maxMm: 1048 }, // C (≈149Hz)
      { name: '3.5', minMm: 1049, maxMm: 1078 }, // B (≈145Hz)
      { name: '3.6', minMm: 1079, maxMm: 1109 }, // A# (≈141Hz)
      { name: '3.7', minMm: 1110, maxMm: 1139 }, // A (≈137Hz)
      { name: '3.8', minMm: 1140, maxMm: 1170 }, // G# (≈134Hz)
      { name: '3.9', minMm: 1171, maxMm: 1200 }, // G (≈130Hz)
      { name: '4.0', minMm: 1201, maxMm: 1242 }, // F# (≈127Hz)
    ]
    
    // Find the closest traditional length
    const traditionalLength = traditionalLengths.find(tl => 
      lengthMm >= tl.minMm && lengthMm <= tl.maxMm
    )
    
    if (traditionalLength) {
      return traditionalLength.name
    }
    
    // If not in standard ranges, calculate approximate value based on traditional shaku
    // 1 shaku = 303mm (traditional Japanese measurement)
    const lengthInShaku = lengthMm / 303.0
    return (lengthInShaku).toFixed(1)
  }

  const getNoteName = (hertz: number): string => {
    const baseFrequency = 440
    const A = Math.pow(2, 1/12)
    let valueLow = -50
    let valueHigh = 50

    const nameForNoteBysemitones = (count: number): string => {
      const mod = count % 12
      if (mod < 0) return noteNames[12 + mod]
      else return noteNames[mod]
    }

    let tries = 0
    while (tries < 16) {
      const middle = Math.round((valueHigh - valueLow) / 2 + valueLow)
      const freq = baseFrequency * Math.pow(A, middle)

      if (freq < hertz) valueLow = middle
      else if (freq > hertz) valueHigh = middle

      if (valueLow + 1 === valueHigh) {
        const diffLow = hertz - baseFrequency * Math.pow(A, valueLow)
        const diffHigh = baseFrequency * Math.pow(A, valueHigh) - hertz
        if (diffLow < diffHigh) {
          return nameForNoteBysemitones(valueLow)
        } else {
          return nameForNoteBysemitones(valueHigh)
        }
      }
      tries++
    }
    return '?'
  }

  const getDiatonicHoleNoteName = useCallback((holeIndex: number, baseNote: number): string => {
    // Custom diatonic shakuhachi with small spans at holes #1-#2 and #5-#6:
    // Algorithm index 0 = Hole #1 = +2 semitones 
    // Algorithm index 1 = Hole #2 = +3 semitones (1 semitone gap from #1)
    // Algorithm index 2 = Hole #3 = +5 semitones (2 semitone gap)
    // Algorithm index 3 = Hole #4 = +7 semitones (2 semitone gap)
    // Algorithm index 4 = Hole #5 = +9 semitones (2 semitone gap)  
    // Algorithm index 5 = Hole #6 = +10 semitones (1 semitone gap from #5)
    // Algorithm index 6 = Hole #7 (Thumb) = +12 semitones (2 semitone gap)
    const semitonesToAdd = [2, 3, 5, 7, 9, 10, 12][holeIndex]
    const targetFreq = baseNote * Math.pow(2, semitonesToAdd / 12)
    return getNoteName(targetFreq)
  }, [])

  const calculate = useCallback((): DiatonicCalculationResult => {
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

    let LastLength = TubeLength
    let temp = 0
    const HoleLocations: number[] = []
    // Custom diatonic pattern to create small spans at holes #1-#2 and #5-#6
    // Pattern [2,1,2,2,2,1,2] puts 1-semitone gaps at positions 1→2 and 5→6
    const Interval = [2, 1, 2, 2, 2, 1, 2] // Custom pattern for desired span layout

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

    // NO REVERSE - keep natural order and flip hole numbering instead
    // HoleLocations[0] = +2 semitones, now becomes Hole #1 (top)
    // HoleLocations[6] = +12 semitones, now becomes Hole #7 (thumb, bottom)

    // Build hole positions array with flipped diatonic numbering
    const holePositions: DiatonicHolePosition[] = []
    for (let i = 0; i < HoleLocations.length; i++) {
      // Flipped mapping: HoleLocations[0] = Hole #1 (top), HoleLocations[6] = Hole #7 (thumb, bottom)
      const diatonicHoleNumber = i + 1
      const semitonesToAdd = [2, 3, 5, 7, 9, 10, 12][i] // Custom pattern: +2,+3,+5,+7,+9,+10,+12
      const holeFrequency = BaseNote * Math.pow(2, semitonesToAdd / 12)
      
      holePositions.push({
        hole: diatonicHoleNumber,
        position: HoleLocations[i],
        error: HoleLocations[i] <= 0,
        noteName: getDiatonicHoleNoteName(i, BaseNote),
        frequency: Math.round(holeFrequency * 100) / 100
      })
    }

    // Calculate spans between adjacent holes (flipped layout - no reverse)
    const spans: Record<string, number> = {
      'span_1_2': HoleLocations[1] - HoleLocations[0], // Hole #1 to #2 (should be small)
      'span_2_3': HoleLocations[2] - HoleLocations[1], // Hole #2 to #3
      'span_3_4': HoleLocations[3] - HoleLocations[2], // Hole #3 to #4
      'span_4_5': HoleLocations[4] - HoleLocations[3], // Hole #4 to #5  
      'span_5_6': HoleLocations[5] - HoleLocations[4], // Hole #5 to #6 (should be small)
      'span_6_7': HoleLocations[6] - HoleLocations[5]  // Hole #6 to #7 (thumb)
    }

    return {
      baseFrequency: Math.round(BaseNote * 100) / 100,
      noteName: getNoteName(156521 / params.fluteLength),
      shakuhachiLength: getShakuhachiLength(params.fluteLength),
      aspectRatio: Math.round(AspectRatio * 100) / 100,
      holePositions,
      spans
    }
  }, [params, getDiatonicHoleNoteName])

  useEffect(() => {
    setResult(calculate())
  }, [calculate])

  const updateParam = (key: keyof DiatonicParams, value: number) => {
    setParams(prev => ({ ...prev, [key]: value }))
  }

  const handleInputChange = (key: keyof DiatonicParams, value: string) => {
    setInputValues(prev => ({ ...prev, [key]: value }))
    
    if (value === '') {
      return
    }
    
    const numValue = Number(value)
    if (!isNaN(numValue)) {
      // Get min and max for this key
      const min = (() => {
        switch (key) {
          case 'fluteLength': return FLUTE_LENGTH_MIN
          case 'holeDiameter': return HOLE_DIAMETER_MIN
          case 'boreDiameter': return BORE_DIAMETER_MIN
          case 'wallThickness': return WALL_THICKNESS_MIN
          case 'ergonomicLimit': return ERGONOMIC_LIMIT_MIN
          default: return 0
        }
      })()
      
      const max = (() => {
        switch (key) {
          case 'fluteLength': return FLUTE_LENGTH_MAX
          case 'holeDiameter': return HOLE_DIAMETER_MAX
          case 'boreDiameter': return BORE_DIAMETER_MAX
          case 'wallThickness': return WALL_THICKNESS_MAX
          case 'ergonomicLimit': return ERGONOMIC_LIMIT_MAX
          default: return 1000
        }
      })()
      
      // Only update if the number is within a reasonable range (at or above minimum)
      // This prevents premature clamping while user is typing
      if (numValue >= min) {
        const clampedValue = Math.min(numValue, max)
        updateParam(key, clampedValue)
      }
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Diatonic Shakuhachi Tool</h1>
        <p className="text-slate-700 mb-2">
          Calculate hole positions for 7-hole diatonic shakuhachi flutes
        </p>
        <p className="text-slate-700 mb-2">
          Uses major scale intervals: Whole-Whole-Half-Whole-Whole-Whole-Half
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Parameters */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900">Parameters</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Flute Length: {params.fluteLength}mm
              </label>
              <input
                type="range"
                min={FLUTE_LENGTH_MIN}
                max={FLUTE_LENGTH_MAX}
                value={params.fluteLength}
                onChange={(e) => updateParam('fluteLength', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                value={inputValues.fluteLength}
                onChange={(e) => handleInputChange('fluteLength', e.target.value)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Hole Diameter: {params.holeDiameter}mm
              </label>
              <input
                type="range"
                min={HOLE_DIAMETER_MIN}
                max={HOLE_DIAMETER_MAX}
                value={params.holeDiameter}
                onChange={(e) => updateParam('holeDiameter', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                value={inputValues.holeDiameter}
                onChange={(e) => handleInputChange('holeDiameter', e.target.value)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Bore Diameter: {params.boreDiameter}mm
              </label>
              <input
                type="range"
                min={BORE_DIAMETER_MIN}
                max={BORE_DIAMETER_MAX}
                step="0.5"
                value={params.boreDiameter}
                onChange={(e) => updateParam('boreDiameter', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                step="0.5"
                value={inputValues.boreDiameter}
                onChange={(e) => handleInputChange('boreDiameter', e.target.value)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Wall Thickness: {params.wallThickness}mm
              </label>
              <input
                type="range"
                min={WALL_THICKNESS_MIN}
                max={WALL_THICKNESS_MAX}
                step="0.125"
                value={params.wallThickness}
                onChange={(e) => updateParam('wallThickness', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                step="0.125"
                value={inputValues.wallThickness}
                onChange={(e) => handleInputChange('wallThickness', e.target.value)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Ergonomic Limit: {params.ergonomicLimit}mm
              </label>
              <input
                type="range"
                min={ERGONOMIC_LIMIT_MIN}
                max={ERGONOMIC_LIMIT_MAX}
                value={params.ergonomicLimit}
                onChange={(e) => updateParam('ergonomicLimit', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <input
                type="number"
                value={inputValues.ergonomicLimit}
                onChange={(e) => handleInputChange('ergonomicLimit', e.target.value)}
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
                  <span className="font-medium text-slate-900">Base Frequency:</span>
                  <span className="text-slate-800">{result.baseFrequency} Hz ({result.noteName}) - {result.shakuhachiLength}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-medium text-slate-900">Aspect Ratio:</span>
                  <span className="text-slate-800">{result.aspectRatio}</span>
                </div>
                
                <div className="border-t pt-3 mt-4">
                  <h3 className="font-medium text-slate-900 mb-3">Hole Positions</h3>
                  {result.holePositions
                    .sort((a, b) => a.hole - b.hole) // Sort by hole number 1-7
                    .map((hole) => (
                    <div key={hole.hole} className={`flex justify-between py-1 ${hole.error ? 'text-red-600' : 'text-slate-800'}`}>
                      <span className="font-medium">
                        Hole #{hole.hole}{hole.hole === 7 ? ' (Thumb)' : ''} ({hole.noteName} - {hole.frequency}Hz):
                      </span>
                      <span>
                        {hole.position}mm from top of flute
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3 mt-4">
                  <h3 className="font-medium text-slate-900 mb-3">Spans</h3>
                  {Object.entries(result.spans).map(([spanKey, value]) => {
                    const [, hole1, hole2] = spanKey.split('_')
                    return (
                      <div key={spanKey} className="flex justify-between text-slate-800">
                        <span className="font-medium">Span {hole1}-{hole2}:</span>
                        <span>{value}mm</span>
                      </div>
                    )
                  })}
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
            spans={{
              span67: result.spans['span_6_7'] || 0, // Hole #6 to #7 (thumb)
              span56: result.spans['span_5_6'] || 0, // Hole #5 to #6 (small span)
              span45: result.spans['span_4_5'] || 0, // Hole #4 to #5
              span34: result.spans['span_3_4'] || 0, // Hole #3 to #4
              span23: result.spans['span_2_3'] || 0, // Hole #2 to #3
              span12: result.spans['span_1_2'] || 0  // Hole #1 to #2 (small span)
            }}
            type="diatonic"
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

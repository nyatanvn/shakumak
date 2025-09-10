'use client'

import React, { useState, useCallback, useEffect, useMemo } from 'react'
import AcousticWaveAnalysis from './AcousticWaveAnalysis'
import ShakuhachiDiagram from './ShakuhachiDiagram'
import AcousticVisualization from './AcousticVisualization'

interface ShakuhachiParams {
  fluteLength: number
  holeDiameter: number
  boreDiameter: number
  wallThickness: number
  ergonomicLimit: number
  calculationStyle: string
  temperature: number
  relativeHumidity: number
  aFrequency: number
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
const TEMPERATURE_MIN = -10
const TEMPERATURE_MAX = 50
const HUMIDITY_MIN = 0
const HUMIDITY_MAX = 100
const A_FREQUENCY_MIN = 400
const A_FREQUENCY_MAX = 480

// Hole placement styles (percentage of flute length from top)
const HOLE_PLACEMENT_STYLES = {
  'nelson-zink': {
    name: 'Nelson Zink - Navaching.com',
    thumb: 0.427, // Hole 5
    hole4: 0.488, // Hole 4
    hole3: 0.603, // Hole 3
    hole2: 0.688, // Hole 2
    hole1: 0.785  // Hole 1
  },
  'john-neptune': {
    name: 'John Neptune',
    thumb: 0.420,
    hole4: 0.485,
    hole3: 0.590,
    hole2: 0.690,
    hole1: 0.790
  },
  'ken-lacosse': {
    name: 'Ken LaCosse',
    thumb: 0.412,
    hole4: 0.478,
    hole3: 0.578,
    hole2: 0.678,
    hole1: 0.778
  },
  'atsuya-okuda': {
    name: 'Atsuya Okuda',
    thumb: 0.412,
    hole4: 0.478,
    hole3: 0.578,
    hole2: 0.678,
    hole1: 0.778
  },
  'yamaguchi-shugetsu': {
    name: 'Yamaguchi - Shugetsu',
    thumb: 0.408,
    hole4: 0.475,
    hole3: 0.589,
    hole2: 0.686,
    hole1: 0.778
  },
  'nishimura-koku': {
    name: 'Nishimura Koku',
    thumb: 0.408,
    hole4: 0.467,
    hole3: 0.581,
    hole2: 0.683,
    hole1: 0.787
  },
  'kodama-youtube1': {
    name: 'Kodama Hiroyuki - YouTube 1',
    thumb: 0.404, // 0.404*L - 2.5mm (will be calculated dynamically)
    hole4: 0.479, // 0.479*L - 2.5mm (will be calculated dynamically)
    hole3: 0.579, // 0.579*L
    hole2: 0.679, // 0.679*L - 1mm (will be calculated dynamically)
    hole1: 0.779  // 0.779*L
  },
  'kodama-hoian2': {
    name: 'Kodama Hiroyuki - Hoi An 2',
    thumb: 0.394, // 0.394*L - 1mm (will be calculated dynamically)
    hole4: 0.479, // 0.479*L - 1mm (will be calculated dynamically)
    hole3: 0.579, // 0.579*L + 1mm (will be calculated dynamically)
    hole2: 0.679, // 0.679*L
    hole1: 0.779  // 0.779*L
  }
} as const

export default function VariationShakuhachiCalculator() {
  const [params, setParams] = useState<ShakuhachiParams>({
    fluteLength: 540,
    holeDiameter: 10,
    boreDiameter: 19,
    wallThickness: 4,
    ergonomicLimit: 60,
    calculationStyle: 'nelson-zink',
    temperature: 20,
    relativeHumidity: 50,
    aFrequency: 440
  })

  const [inputValues, setInputValues] = useState({
    fluteLength: '540',
    holeDiameter: '10',
    boreDiameter: '19',
    wallThickness: '4',
    ergonomicLimit: '60',
    calculationStyle: 'nelson-zink',
    temperature: '20',
    relativeHumidity: '50',
    aFrequency: '440'
  })

  const [result, setResult] = useState<CalculationResult | null>(null)
  const [showAcousticAnalysis, setShowAcousticAnalysis] = useState(false)

  const updateParam = useCallback((key: keyof ShakuhachiParams, value: number | string) => {
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

  const getNoteName = useCallback((hertz: number, aFrequency: number = 440): string => {
    // Original Nelson Zink note name algorithm with adjustable A frequency
    const baseFrequency = aFrequency
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

  const getStandardFrequencies = useCallback((baseFrequency: number, aFrequency: number) => {
    // Calculate theoretical standard frequencies based on musical note relationships
    // This is pure music theory - no environmental factors (temperature/humidity)
    
    // Traditional shakuhachi tuning: +3, +5, +7, +10, +12 semitones from base
    const semitonesToAdd = [3, 5, 7, 10, 12] // [Hole1, Hole2, Hole3, Hole4, Hole5/Thumb]
    
    // Simply add semitones to the base frequency using equal temperament
    // This maintains the correct octave relationship
    return semitonesToAdd.map(semitones => {
      const frequency = baseFrequency * Math.pow(2, semitones / 12)
      const noteName = getNoteName(frequency, aFrequency)
      return {
        frequency: Math.round(frequency * 100) / 100,
        noteName: noteName
      }
    })
  }, [getNoteName])

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

  const calculateSpeedOfSound = useCallback((temperature: number, relativeHumidity: number) => {
    // More accurate speed of sound calculation
    // temperature in Celsius, relativeHumidity in percentage (0-100)
    
    // Convert temperature to Kelvin
    const T = temperature + 273.15
    
    // Speed of sound in dry air (m/s)
    const speedDryAir = 331.3 * Math.sqrt(T / 273.15)
    
    // Humidity correction using enhanced formula
    // Saturation vapor pressure (Pascal) - Tetens formula
    const Psat = 611.2 * Math.exp(17.67 * temperature / (temperature + 243.5))
    
    // Actual vapor pressure
    const Pv = (relativeHumidity / 100) * Psat
    
    // Atmospheric pressure (Pascal) - standard sea level
    const P = 101325
    
    // Molar mass of dry air (kg/mol)
    const MdryAir = 0.028964
    
    // Molar mass of water vapor (kg/mol)  
    const Mwater = 0.018016
    
    // Mole fraction of water vapor
    const xv = Pv / P
    
    // Effective molar mass of humid air
    const Mair = MdryAir * (1 - xv) + Mwater * xv
    
    // Speed of sound in humid air
    // Uses the fact that humid air is less dense than dry air
    const speedHumidAir = speedDryAir * Math.sqrt(MdryAir / Mair)
    
    return speedHumidAir
  }, [])

  const calculateHoleFrequency = useCallback((holePosition: number, holeDiameter: number, boreDiameter: number, fluteLength: number, wallThickness: number, temperature: number = 20, relativeHumidity: number = 50) => {
    // More accurate acoustic calculation based on hole position and physical parameters
    // This considers the effective length of the air column when the hole is open
    
    // Speed of sound in air at specified temperature and humidity
    const speedOfSound = calculateSpeedOfSound(temperature, relativeHumidity)
    
    // Convert mm to meters for calculations
    const L = fluteLength / 1000 // Total length in meters
    const holePos = holePosition / 1000 // Hole position from top in meters
    const holeDiam = holeDiameter / 1000 // Hole diameter in meters
    const boreDiam = boreDiameter / 1000 // Bore diameter in meters
    const wallThick = wallThickness / 1000 // Wall thickness in meters
    
    // Effective length when hole is open (distance from mouthpiece to hole)
    const effectiveLength = holePos
    
    // End correction for open hole (accounts for radiation impedance)
    // This is a simplified model - real calculation would be more complex
    const endCorrection = 0.6 * holeDiam + (wallThick * 0.5)
    
    // Effective acoustic length
    const acousticLength = effectiveLength + endCorrection
    
    // Hole impedance factor (affects how much the hole "shortens" the tube)
    // Larger holes have lower impedance and are more effective at stopping the air column
    const holeArea = Math.PI * (holeDiam / 2) ** 2
    const boreArea = Math.PI * (boreDiam / 2) ** 2
    const areaRatio = holeArea / boreArea
    
    // Impedance correction factor (empirical model)
    // This accounts for the fact that small holes don't completely "stop" the air column
    const impedanceFactor = 1 - Math.exp(-3 * areaRatio)
    
    // Effective length with impedance correction
    const correctedLength = acousticLength * (1 + (1 - impedanceFactor) * 0.3)
    
    // Fundamental frequency for open tube (hole acts as open end)
    // f = v / (2 * L_eff) for fundamental mode
    const frequency = speedOfSound / (2 * correctedLength)
    
    return frequency
  }, [])

  const calculateAllStyles = useCallback(() => {
    const TL = params.fluteLength
    const BaseNote = 156521.0 / TL
    const allStylesResults: Array<{ 
      style: string, 
      styleKey: string,
      styleName: string,
      results: unknown[], 
      holePositions: HolePosition[]
    }> = []

    // Calculate for each style
    Object.entries(HOLE_PLACEMENT_STYLES).forEach(([styleKey, style]) => {
      const HoleLocations: number[] = []
      
      // Array of percentages in order: [hole1, hole2, hole3, hole4, thumb]
      const percentages = [style.hole1, style.hole2, style.hole3, style.hole4, style.thumb]
      
      // Convert percentages to actual positions (from top of flute) with special adjustments for Kodama formulas
      for (let i = 0; i < percentages.length; i++) {
        let position = Math.round(TL * percentages[i])
        
        // Apply special adjustments for Kodama formulas
        if (styleKey === 'kodama-youtube1') {
          if (i === 1) { // hole2: 0.679*L - 1mm
            position = position - 1
          } else if (i === 3) { // hole4: 0.479*L - 2.5mm
            position = position - 2.5
          } else if (i === 4) { // thumb: 0.404*L - 2.5mm
            position = position - 2.5
          }
        } else if (styleKey === 'kodama-hoian2') {
          if (i === 2) { // hole3: 0.579*L + 1mm
            position = position + 1
          } else if (i === 3) { // hole4: 0.479*L - 1mm
            position = position - 1
          } else if (i === 4) { // thumb: 0.394*L - 1mm
            position = position - 1
          }
        }
        
        HoleLocations.push(Math.round(position))
      }

      // Reverse to get traditional order: [thumb, hole4, hole3, hole2, hole1]
      HoleLocations.reverse()

      // Build hole positions array with frequencies
      const holePositions: HolePosition[] = []
      for (let i = 0; i < HoleLocations.length; i++) {
        const shakuhachiHoleNumber = i === 0 ? 5 : (5 - i)
        
        // Calculate actual frequency based on hole position and physical parameters
        const holeFrequency = calculateHoleFrequency(
          HoleLocations[i], 
          params.holeDiameter, 
          params.boreDiameter, 
          params.fluteLength, 
          params.wallThickness,
          params.temperature,
          params.relativeHumidity
        )
        
        holePositions.push({
          hole: shakuhachiHoleNumber,
          position: HoleLocations[i],
          error: HoleLocations[i] <= 0,
          noteName: getNoteName(holeFrequency, params.aFrequency),
          frequency: Math.round(holeFrequency * 100) / 100
        })
      }

      allStylesResults.push({
        style: styleKey,
        styleKey,
        styleName: style.name,
        results: [],
        holePositions
      })
    })

    return allStylesResults
  }, [params, calculateHoleFrequency, getNoteName])

  const calculate = useCallback(() => {
    try {
      const TL = params.fluteLength
      const BaseNote = 156521.0 / TL
      const AspectRatio = TL / params.boreDiameter

      const noteName = getNoteName(BaseNote)
      const shakuhachiLength = getShakuhachiLength(BaseNote)

      // Get the selected hole placement style
      const styleKey = params.calculationStyle as keyof typeof HOLE_PLACEMENT_STYLES
      const style = HOLE_PLACEMENT_STYLES[styleKey]
      
      if (!style) {
        throw new Error(`Unknown calculation style: ${params.calculationStyle}`)
      }

      // Calculate hole positions based on percentage of flute length from top
      const HoleLocations: number[] = []
      
      // Array of percentages in order: [hole1, hole2, hole3, hole4, thumb]
      const percentages = [style.hole1, style.hole2, style.hole3, style.hole4, style.thumb]
      
      // Convert percentages to actual positions (from top of flute) with special adjustments for Kodama formulas
      for (let i = 0; i < percentages.length; i++) {
        let position = Math.round(TL * percentages[i])
        
        // Apply special adjustments for Kodama formulas
        if (params.calculationStyle === 'kodama-youtube1') {
          if (i === 1) { // hole2: 0.679*L - 1mm
            position = position - 1
          } else if (i === 3) { // hole4: 0.479*L - 2.5mm
            position = position - 2.5
          } else if (i === 4) { // thumb: 0.404*L - 2.5mm
            position = position - 2.5
          }
        } else if (params.calculationStyle === 'kodama-hoian2') {
          if (i === 2) { // hole3: 0.579*L + 1mm
            position = position + 1
          } else if (i === 3) { // hole4: 0.479*L - 1mm
            position = position - 1
          } else if (i === 4) { // thumb: 0.394*L - 1mm
            position = position - 1
          }
        }
        
        HoleLocations.push(Math.round(position))
      }

      // Reverse to get traditional order: [thumb, hole4, hole3, hole2, hole1]
      HoleLocations.reverse()

      const ErgoSpan = params.ergonomicLimit
      const ThumbS = HoleLocations[1] - HoleLocations[0] // Distance between thumb and hole 4
      const TopS = HoleLocations[2] - HoleLocations[1]   // Distance between hole 4 and 3
      const BottomS = HoleLocations[4] - HoleLocations[3] // Distance between hole 2 and 1

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
        
        // Calculate actual frequency based on hole position and physical parameters
        const holeFrequency = calculateHoleFrequency(
          HoleLocations[i], 
          params.holeDiameter, 
          params.boreDiameter, 
          params.fluteLength, 
          params.wallThickness,
          params.temperature,
          params.relativeHumidity
        )
        
        holePositions.push({
          hole: shakuhachiHoleNumber,
          position: HoleLocations[i],
          alternatePosition: AlternateHoleLocations[i] || undefined,
          error: HoleLocations[i] <= 0,
          noteName: getNoteName(holeFrequency, params.aFrequency),
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
  }, [params, getShakuhachiLength, getNoteName, calculateHoleFrequency, calculateSpeedOfSound])

  useEffect(() => {
    calculate()
  }, [calculate])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Variation Shakuhachi Calculator</h1>
        <p className="text-slate-700">Compare different hole placement styles for 5-hole shakuhachi flutes</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Parameters */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">Parameters</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Maker Style
              </label>
              <select
                value={params.calculationStyle}
                onChange={(e) => updateParam('calculationStyle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="nelson-zink">Nelson Zink</option>
                <option value="john-neptune">John Neptune</option>
                <option value="ken-lacosse">Ken LaCosse</option>
                <option value="atsuya-okuda">Atsuya Okuda</option>
                <option value="yamaguchi-shugetsu">Yamaguchi-Shugetsu</option>
                <option value="nishimura-koku">Nishimura Koku</option>
                <option value="kodama-youtube1">Kodama Hiroyuki - YouTube 1</option>
                <option value="kodama-hoian2">Kodama Hiroyuki - Hoi An 2</option>
              </select>
              <p className="mt-1 text-xs text-slate-600">
                Each maker style uses different hole placement percentages based on their traditional methods.
              </p>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Temperature (°C): {params.temperature}
              </label>
              <input
                type="range"
                min={TEMPERATURE_MIN}
                max={TEMPERATURE_MAX}
                step="1"
                value={params.temperature}
                onChange={(e) => updateParam('temperature', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                value={inputValues.temperature}
                onChange={(e) => handleInputChange('temperature', e.target.value, TEMPERATURE_MIN, TEMPERATURE_MAX)}
                onBlur={() => handleInputBlur('temperature', TEMPERATURE_MIN, TEMPERATURE_MAX)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-600">
                Affects speed of sound calculation. Room temperature is typically 20-25°C.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                Relative Humidity (%): {params.relativeHumidity}
              </label>
              <input
                type="range"
                min={HUMIDITY_MIN}
                max={HUMIDITY_MAX}
                step="1"
                value={params.relativeHumidity}
                onChange={(e) => updateParam('relativeHumidity', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                value={inputValues.relativeHumidity}
                onChange={(e) => handleInputChange('relativeHumidity', e.target.value, HUMIDITY_MIN, HUMIDITY_MAX)}
                onBlur={() => handleInputBlur('relativeHumidity', HUMIDITY_MIN, HUMIDITY_MAX)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-600">
                Humid air transmits sound faster than dry air. Typical indoor humidity is 30-60%.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-800 mb-2">
                A Frequency (Hz): {params.aFrequency}
              </label>
              <input
                type="range"
                min={A_FREQUENCY_MIN}
                max={A_FREQUENCY_MAX}
                step="0.1"
                value={params.aFrequency}
                onChange={(e) => updateParam('aFrequency', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              />
              <input
                type="number"
                step="0.1"
                value={inputValues.aFrequency}
                onChange={(e) => handleInputChange('aFrequency', e.target.value, A_FREQUENCY_MIN, A_FREQUENCY_MAX)}
                onBlur={() => handleInputBlur('aFrequency', A_FREQUENCY_MIN, A_FREQUENCY_MAX)}
                className="mt-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm text-slate-900 bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-slate-600">
                Standard tuning reference. Common values: A=440 (standard), A=432 (alternative), A=444 (baroque).
              </p>
            </div>

            {/* Acoustic Analysis Toggle */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showAcousticAnalysis}
                  onChange={(e) => setShowAcousticAnalysis(e.target.checked)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm font-medium text-slate-800">
                  Show Advanced Acoustic Wave Analysis
                </span>
              </label>
              <p className="mt-1 text-xs text-slate-600">
                Display pressure nodes, velocity antinodes, standing wave patterns, and micro-tuning analysis
              </p>
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

      {/* Style Comparison Table */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-slate-900 mb-6">Style Comparison Table</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 bg-white rounded-lg shadow-sm">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700">Style</th>
                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                  Standard A={params.aFrequency}<br/>
                  <span className="font-normal text-gray-500">(Base + Holes Hz)</span>
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                  Hole #1<br/>
                  <span className="font-normal text-gray-500">(mm / Hz)</span>
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                  Hole #2<br/>
                  <span className="font-normal text-gray-500">(mm / Hz)</span>
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                  Hole #3<br/>
                  <span className="font-normal text-gray-500">(mm / Hz)</span>
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                  Hole #4<br/>
                  <span className="font-normal text-gray-500">(mm / Hz)</span>
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                  Hole #5 (Thumb)<br/>
                  <span className="font-normal text-gray-500">(mm / Hz)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {calculateAllStyles().map((styleResult, index) => {
                const TL = params.fluteLength
                const BaseNote = 156521.0 / TL
                const standardFreqs = getStandardFrequencies(BaseNote, params.aFrequency)
                
                return (
                  <tr key={styleResult.styleKey} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-25'}>
                    <td className={`border border-gray-300 px-3 py-2 text-xs font-medium ${
                      styleResult.styleKey === params.calculationStyle ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                    }`}>
                      {styleResult.styleName}
                      {styleResult.styleKey === params.calculationStyle && (
                        <span className="ml-2 text-blue-600">★</span>
                      )}
                    </td>
                    <td className="border border-gray-300 px-2 py-2 text-center text-xs text-gray-700">
                      <div className="space-y-1">
                        <div>{standardFreqs[0].noteName}: {standardFreqs[0].frequency}Hz</div>
                        <div>{standardFreqs[1].noteName}: {standardFreqs[1].frequency}Hz</div>
                        <div>{standardFreqs[2].noteName}: {standardFreqs[2].frequency}Hz</div>
                        <div>{standardFreqs[3].noteName}: {standardFreqs[3].frequency}Hz</div>
                        <div>{standardFreqs[4].noteName}: {standardFreqs[4].frequency}Hz</div>
                      </div>
                    </td>
                    {styleResult.holePositions
                      .sort((a: HolePosition, b: HolePosition) => a.hole - b.hole)
                      .map((hole: HolePosition) => (
                      <td key={hole.hole} className="border border-gray-300 px-2 py-2 text-center text-xs text-gray-700">
                        <div>{hole.position}mm</div>
                        <div className="text-gray-500">{hole.frequency}Hz</div>
                      </td>
                    ))}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-600">
          ★ Currently selected style. All calculations use L = {params.fluteLength}mm flute length, A = {params.aFrequency}Hz, at {params.temperature}°C and {params.relativeHumidity}% humidity.
        </p>
      </div>

      {/* Advanced Acoustic Wave Analysis */}
      {showAcousticAnalysis && result && (
        <div className="mt-8">
          <AcousticWaveAnalysis
            params={{
              fluteLength: params.fluteLength,
              boreDiameter: params.boreDiameter,
              holePositions: result.holePositions.map(hole => hole.position),
              holeDiameters: result.holePositions.map(() => params.holeDiameter),
              wallThickness: params.wallThickness,
              temperature: params.temperature,
              relativeHumidity: params.relativeHumidity,
              aFrequency: params.aFrequency
            }}
          />
        </div>
      )}

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

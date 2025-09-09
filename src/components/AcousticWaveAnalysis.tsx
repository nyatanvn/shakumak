'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'

interface AcousticParams {
  fluteLength: number
  boreDiameter: number
  holePositions: number[]
  holeDiameters: number[]
  wallThickness: number
  temperature: number
  relativeHumidity: number
  aFrequency: number
}

interface WaveNode {
  position: number
  type: 'pressure' | 'velocity'
  amplitude: number
  frequency: number
}

interface ResonanceMode {
  frequency: number
  wavelength: number
  nodes: WaveNode[]
  antinodes: WaveNode[]
  qualityFactor: number
}

const AcousticWaveAnalysis: React.FC<{ params: AcousticParams }> = ({ params }) => {
  const [selectedMode, setSelectedMode] = useState(1)
  const [showMicrotuning, setShowMicrotuning] = useState(false)
  const [visualizationType, setVisualizationType] = useState<'standing' | 'pressure' | 'velocity'>('standing')

  // Calculate speed of sound with temperature and humidity corrections
  const speedOfSound = useMemo(() => {
    // Base speed at 20°C, dry air
    const baseSpeed = 343.0
    
    // Temperature correction (m/s per °C)
    const tempCorrection = 0.6 * (params.temperature - 20)
    
    // Humidity correction (simplified)
    const humidityCorrection = (params.relativeHumidity / 100) * 1.5
    
    return baseSpeed + tempCorrection + humidityCorrection
  }, [params.temperature, params.relativeHumidity])

  // Calculate effective flute length with end corrections
  const effectiveLength = useMemo(() => {
    // End correction for open cylinder
    const endCorrection = 0.61 * (params.boreDiameter / 1000) // Convert mm to m
    
    // Additional correction for bore irregularities and holes
    const boreCorrection = params.wallThickness * 0.001 * 0.3
    
    return (params.fluteLength / 1000) + endCorrection + boreCorrection
  }, [params.fluteLength, params.boreDiameter, params.wallThickness])

  // Calculate resonance modes (harmonics)
  const resonanceModes = useMemo(() => {
    const modes: ResonanceMode[] = []
    
    for (let mode = 1; mode <= 5; mode++) {
      // For an open cylinder, resonant frequencies are f = n * v / (2L)
      const frequency = (mode * speedOfSound) / (2 * effectiveLength)
      const wavelength = speedOfSound / frequency
      
      // Calculate nodes and antinodes for this mode
      const nodes: WaveNode[] = []
      const antinodes: WaveNode[] = []
      
      // Pressure nodes (velocity antinodes) occur at open ends and at λ/2 intervals
      for (let i = 0; i <= mode; i++) {
        const position = (i * effectiveLength) / mode
        
        if (position <= effectiveLength) {
          // Pressure nodes at open ends and intermediate positions
          nodes.push({
            position: position * 1000, // Convert back to mm
            type: 'pressure',
            amplitude: 0,
            frequency
          })
          
          // Velocity antinodes (maximum air movement)
          if (i < mode) {
            const antiNodePos = position + (effectiveLength / (2 * mode))
            if (antiNodePos <= effectiveLength) {
              antinodes.push({
                position: antiNodePos * 1000,
                type: 'velocity',
                amplitude: 1,
                frequency
              })
            }
          }
        }
      }
      
      // Quality factor (simplified calculation based on hole coupling)
      const holeCoupling = params.holePositions.reduce((sum, pos, i) => {
        const holeDiam = params.holeDiameters[i] || 10
        return sum + (holeDiam * holeDiam) / (pos * pos)
      }, 0)
      
      const qualityFactor = 50 / (1 + holeCoupling * 0.01)
      
      modes.push({
        frequency,
        wavelength,
        nodes,
        antinodes,
        qualityFactor
      })
    }
    
    return modes
  }, [speedOfSound, effectiveLength, params.holePositions, params.holeDiameters])

  // Calculate micro-tuning adjustments based on hole perturbations
  const microtuningAnalysis = useMemo(() => {
    if (!showMicrotuning) return null
    
    const currentMode = resonanceModes[selectedMode - 1]
    if (!currentMode) return null
    
    return params.holePositions.map((holePos, index) => {
      const holeDiam = params.holeDiameters[index] || 10
      
      // Find nearest node/antinode to this hole
      const nearestNode = currentMode.nodes.reduce((nearest, node) => {
        const distCurrent = Math.abs(node.position - holePos)
        const distNearest = Math.abs(nearest.position - holePos)
        return distCurrent < distNearest ? node : nearest
      })
      
      // Calculate perturbation effect
      const nodeDistance = Math.abs(nearestNode.position - holePos)
      const holeArea = Math.PI * (holeDiam / 2) ** 2
      const boreArea = Math.PI * (params.boreDiameter / 2) ** 2
      
      // Frequency shift due to hole (simplified model)
      const areaRatio = holeArea / boreArea
      const positionFactor = 1 / (1 + nodeDistance / 10)
      const frequencyShift = currentMode.frequency * areaRatio * positionFactor * 0.1
      
      // Tuning adjustment in cents
      const centsShift = 1200 * Math.log2((currentMode.frequency + frequencyShift) / currentMode.frequency)
      
      // Calculate suggested hole movement to correct tuning
      // If frequency is too high (sharp), move hole away from node
      // If frequency is too low (flat), move hole closer to node
      let suggestedMovement = 0
      if (Math.abs(centsShift) > 5) { // Only suggest if deviation > 5 cents
        // Estimate movement needed (empirical relationship)
        const movementFactor = Math.abs(centsShift) * 0.1 // ~0.1mm per cent deviation
        suggestedMovement = centsShift > 0 ? movementFactor : -movementFactor
      }
      
      return {
        holeIndex: index + 1,
        position: holePos,
        frequencyShift,
        centsShift,
        nodeDistance,
        influence: positionFactor * areaRatio,
        suggestedMovement: Math.round(suggestedMovement * 10) / 10 // Round to 0.1mm
      }
    })
  }, [showMicrotuning, selectedMode, resonanceModes, params.holePositions, params.holeDiameters, params.boreDiameter])

  // Generate wave visualization data
  const waveVisualization = useMemo(() => {
    console.log('Generating wave visualization for type:', visualizationType)
    const points = []
    const numPoints = 50 // Reduced for simpler debugging
    
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * 100 // Direct percentage for SVG
      let y = 60 // Center line
      
      // Simple test patterns
      if (visualizationType === 'standing') {
        y = 60 + 3 * Math.sin((i / numPoints) * Math.PI * 2 * selectedMode)
      } else if (visualizationType === 'pressure') {
        y = 60 + 3 * Math.cos((i / numPoints) * Math.PI * 2 * selectedMode)
      } else if (visualizationType === 'velocity') {
        y = 60 + 3 * (i % 10 < 5 ? 1 : -1) // Square wave
      }
      
      points.push({ x, y })
    }
    
    console.log('Generated points:', points.length, 'First few:', points.slice(0, 3))
    return points
  }, [selectedMode, visualizationType])

  // Get visualization color based on type
  const getVisualizationColor = () => {
    switch (visualizationType) {
      case 'standing': return '#2563eb' // Blue
      case 'pressure': return '#dc2626' // Red  
      case 'velocity': return '#16a34a' // Green
      default: return '#2563eb'
    }
  }

  const currentMode = resonanceModes[selectedMode - 1]

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Acoustic Wave Analysis</h2>
      
      {/* Control Panel */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Resonance Mode</label>
            <select 
              value={selectedMode} 
              onChange={(e) => setSelectedMode(Number(e.target.value))}
              className="w-full p-2 border rounded"
            >
              {resonanceModes.map((_, index) => (
                <option key={index + 1} value={index + 1}>
                  Mode {index + 1} ({Math.round(resonanceModes[index].frequency)} Hz)
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Visualization Type</label>
            <select 
              value={visualizationType} 
              onChange={(e) => setVisualizationType(e.target.value as any)}
              className="w-full p-2 border rounded"
            >
              <option value="standing">Standing Wave</option>
              <option value="pressure">Pressure Amplitude</option>
              <option value="velocity">Velocity Amplitude</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showMicrotuning}
                onChange={(e) => setShowMicrotuning(e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Show Micro-tuning Analysis</span>
            </label>
          </div>
        </div>
      </div>

      {/* Wave Visualization */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">
          {visualizationType === 'standing' ? 'Standing Wave Pattern' :
           visualizationType === 'pressure' ? 'Pressure Distribution' : 'Air Velocity Distribution'}
          {currentMode && ` - Mode ${selectedMode} (${Math.round(currentMode.frequency)} Hz)`}
        </h3>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="mb-2 text-sm font-medium">
            Wave Pattern: <span className="font-bold" style={{color: getVisualizationColor()}}>{visualizationType}</span> (Mode {selectedMode})
            {/* Debug info */}
            <div className="text-xs text-gray-500 mt-1">
              {visualizationType === 'standing' && 'Normal sine wave (0.8x amplitude) - air particle displacement'}
              {visualizationType === 'pressure' && 'Inverted cosine wave (1.2x amplitude) - pressure variations'}
              {visualizationType === 'velocity' && 'Sawtooth-like pattern (0.6x amplitude) - air velocity with sharp transitions'}
            </div>
          </div>
          <svg width="100%" height="200" viewBox="0 0 100 120" className="border">
            {/* Flute outline */}
            <rect x="0" y="55" width="100" height="10" fill="lightgray" stroke="black" strokeWidth="1" opacity="0.3"/>
            
            {/* Wave pattern - simple and direct */}
            <path
              d={`M ${waveVisualization.map((point, i) => 
                `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
              ).join(' ')}`}
              stroke={getVisualizationColor()}
              strokeWidth="3"
              fill="none"
              opacity="1"
            />
            
            {/* Zero line (center of flute bore) */}
            <line x1="0" y1="60" x2="100" y2="60" stroke="gray" strokeWidth="1" strokeDasharray="1,1" opacity="0.6"/>
            
            {/* Flute bore boundaries for reference */}
            <line x1="0" y1="56" x2="100" y2="56" stroke="black" strokeWidth="0.5" opacity="0.3"/>
            <line x1="0" y1="64" x2="100" y2="64" stroke="black" strokeWidth="0.5" opacity="0.3"/>
            
            {/* Holes */}
            {params.holePositions.map((pos, index) => {
              const x = (pos / params.fluteLength) * 100
              return (
                <g key={index}>
                  <circle cx={x} cy="60" r="2" fill="red" opacity="0.7"/>
                  <text x={x} y="75" textAnchor="middle" fontSize="8" fill="red">
                    H{index + 1}
                  </text>
                </g>
              )
            })}
            
            {/* Nodes and Antinodes */}
            {currentMode && (
              <>
                {currentMode.nodes.map((node, index) => {
                  const x = (node.position / params.fluteLength) * 100
                  return (
                    <line key={`node-${index}`} x1={x} y1="50" x2={x} y2="70" 
                          stroke="red" strokeWidth="2" opacity="0.6"/>
                  )
                })}
                {currentMode.antinodes.map((antinode, index) => {
                  const x = (antinode.position / params.fluteLength) * 100
                  return (
                    <line key={`antinode-${index}`} x1={x} y1="52" x2={x} y2="68" 
                          stroke="green" strokeWidth="2" opacity="0.6"/>
                  )
                })}
              </>
            )}
          </svg>
          
          <div className="mt-2 text-sm text-gray-600">
            <span className="mr-4">🔴 Holes</span>
            <span className="mr-4" style={{color: 'red'}}>| Pressure Nodes</span>
            <span className="mr-4" style={{color: 'green'}}>| Velocity Antinodes</span>
            <span style={{color: getVisualizationColor()}}>
              {visualizationType === 'standing' && '— Standing Wave (solid blue, air displacement)'}
              {visualizationType === 'pressure' && '- - Pressure Amplitude (dashed red, 1.5x scale)'}
              {visualizationType === 'velocity' && '——— Velocity Amplitude (thick dotted green, with peaks)'}
            </span>
          </div>
        </div>
      </div>

      {/* Mode Analysis */}
      {currentMode && (
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold mb-2">Mode {selectedMode} Properties</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Frequency:</strong> {Math.round(currentMode.frequency * 100) / 100} Hz</div>
              <div><strong>Wavelength:</strong> {Math.round(currentMode.wavelength * 1000)} mm</div>
              <div><strong>Quality Factor:</strong> {Math.round(currentMode.qualityFactor)}</div>
              <div><strong>Pressure Nodes:</strong> {currentMode.nodes.length}</div>
              <div><strong>Velocity Antinodes:</strong> {currentMode.antinodes.length}</div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold mb-2">Environmental Effects</h4>
            <div className="space-y-2 text-sm">
              <div><strong>Speed of Sound:</strong> {Math.round(speedOfSound * 10) / 10} m/s</div>
              <div><strong>Effective Length:</strong> {Math.round(effectiveLength * 1000)} mm</div>
              <div><strong>Temperature Effect:</strong> {params.temperature > 20 ? '+' : ''}{Math.round((speedOfSound - 343) * 10) / 10} m/s</div>
              <div><strong>Humidity Effect:</strong> +{Math.round((params.relativeHumidity / 100) * 1.5 * 10) / 10} m/s</div>
            </div>
          </div>
        </div>
      )}

      {/* Micro-tuning Analysis */}
      {showMicrotuning && microtuningAnalysis && (
        <div className="p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-semibold mb-3">Micro-tuning Analysis for Mode {selectedMode}</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Hole</th>
                  <th className="text-right p-2">Position (mm)</th>
                  <th className="text-right p-2">Node Distance (mm)</th>
                  <th className="text-right p-2">Frequency Shift (Hz)</th>
                  <th className="text-right p-2">Tuning Shift (cents)</th>
                  <th className="text-right p-2">Suggested Move (mm)</th>
                  <th className="text-right p-2">Influence</th>
                </tr>
              </thead>
              <tbody>
                {microtuningAnalysis.map((analysis) => (
                  <tr key={analysis.holeIndex} className="border-b">
                    <td className="p-2">Hole {analysis.holeIndex}</td>
                    <td className="text-right p-2">{Math.round(analysis.position)}</td>
                    <td className="text-right p-2">{Math.round(analysis.nodeDistance)}</td>
                    <td className="text-right p-2">{Math.round(analysis.frequencyShift * 100) / 100}</td>
                    <td className="text-right p-2" 
                        style={{color: analysis.centsShift > 0 ? 'red' : 'blue'}}>
                      {analysis.centsShift > 0 ? '+' : ''}{Math.round(analysis.centsShift)}
                    </td>
                    <td className="text-right p-2 font-medium"
                        style={{color: analysis.suggestedMovement !== 0 ? (analysis.suggestedMovement > 0 ? '#d97706' : '#059669') : 'gray'}}>
                      {analysis.suggestedMovement !== 0 ? 
                        `${analysis.suggestedMovement > 0 ? '+' : ''}${analysis.suggestedMovement}` : 
                        'OK'
                      }
                    </td>
                    <td className="text-right p-2">{Math.round(analysis.influence * 1000) / 1000}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-xs text-gray-600">
            * Positive cents = sharp, Negative cents = flat. Higher influence = stronger effect on tuning.<br/>
            * Suggested Move: + = move hole toward bottom (away from mouthpiece), - = move hole toward top.<br/>
            * Orange = move down, Green = move up, Gray = tuning OK (within ±5 cents).
          </div>
        </div>
      )}

      {/* Acoustic Theory Notes */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-semibold mb-2">Acoustic Theory Reference</h4>
        <div className="text-sm text-gray-700 space-y-2">
          <p><strong>Pressure Nodes:</strong> Points where acoustic pressure amplitude is zero (red lines). Air particles have maximum velocity here.</p>
          <p><strong>Velocity Antinodes:</strong> Points where air velocity is maximum (green lines). These coincide with pressure nodes.</p>
          <p><strong>Standing Waves:</strong> Result from interference between incident and reflected waves in the air column.</p>
          <p><strong>Micro-tuning:</strong> Small frequency adjustments caused by hole placement relative to wave nodes and antinodes.</p>
          <p><strong>Quality Factor:</strong> Measure of resonance sharpness. Higher Q = more sustained tone, less coupling between modes.</p>
        </div>
      </div>
    </div>
  )
}

export default AcousticWaveAnalysis

'use client'

import React, { useState } from 'react'

interface AcousticVisualizationProps {
  fluteLength: number
  baseFrequency: number
  holePositions: Array<{
    hole: number
    position: number
    frequency: number
    noteName: string
    error: boolean
  }>
  boreDiameter: number
}

export default function AcousticVisualization({
  fluteLength = 0,
  baseFrequency = 440,
  holePositions = [],
  boreDiameter = 20
}: AcousticVisualizationProps) {
  // Early return if essential props are missing
  if (!fluteLength || fluteLength <= 0) {
    return (
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">Acoustic analysis requires valid flute length to display.</p>
      </div>
    )
  }

  const svgWidth = 800
  const svgHeight = 400
  const scale = (svgWidth - 100) / fluteLength
  const startX = 50
  const centerY = svgHeight / 2
  
  // State for toggling waves visibility
  const [visibleWaves, setVisibleWaves] = useState<{[key: number]: boolean}>(() => {
    const initialState: {[key: number]: boolean} = { 0: true } // Base frequency always visible initially
    holePositions.forEach(hole => {
      initialState[hole.hole] = true
    })
    return initialState
  })
  
  // State for individual wave analysis
  const [selectedHole, setSelectedHole] = useState<number | null>(null)
  
  // State for zoom and hole visibility
  const [zoomLevel, setZoomLevel] = useState<number>(1)
  const [showHoles, setShowHoles] = useState<boolean>(true)
  const [panOffset, setPanOffset] = useState<number>(0)
  
  // State for breath power (affects wave propagation distance)
  const [breathPower, setBreathPower] = useState<number>(0.7) // 0.1 to 1.0
  
  // State for flat point visualization
  const [showFlatPoints, setShowFlatPoints] = useState<boolean>(true)
  
  const toggleWave = (holeNumber: number) => {
    setVisibleWaves(prev => ({
      ...prev,
      [holeNumber]: !prev[holeNumber]
    }))
  }
  
  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.max(0.5, Math.min(5, prev + delta)))
  }
  
  const resetView = () => {
    setZoomLevel(1)
    setPanOffset(0)
  }
  
  // Calculate wavelength and wave patterns
  const speedOfSound = 343000 // mm/s at room temperature
  
  const generateStandingWave = (frequency: number, effectiveLength: number, color: string, holePosition: number) => {
    const wavelength = speedOfSound / frequency
    const points: string[] = []
    const numPoints = Math.min(300, effectiveLength * 2) // More points for detailed waves
    const amplitude = 30
    
    // Calculate the effective acoustic length (considering end correction)
    const endCorrection = 0.6 * boreDiameter // Approximate end correction
    const acousticLength = effectiveLength + endCorrection
    
    for (let i = 0; i <= numPoints; i++) {
      const position = (i / numPoints) * effectiveLength
      const x = startX + position * scale
      
      // Standing wave pattern with proper boundary conditions
      // For a tube closed at one end: pressure node at closed end, antinode at open end
      const k = (2 * Math.PI) / wavelength
      const standingWaveAmplitude = Math.cos(k * (acousticLength - position))
      const y = centerY + amplitude * standingWaveAmplitude * 0.6
      
      points.push(`${x},${y}`)
    }
    
    // Calculate acoustic quality - how well the hole aligns with pressure antinode
    const k = (2 * Math.PI) / wavelength
    const pressureAtHole = Math.abs(Math.cos(k * (acousticLength - holePosition)))
    const acousticQuality = pressureAtHole // Higher = better acoustic coupling
    
    return {
      wave: (
        <polyline
          key={`wave-${frequency}`}
          points={points.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.8"
        />
      ),
      quality: acousticQuality
    }
  }
  
  // Generate pressure nodes and antinodes visualization
  const generateResonanceNodes = (frequency: number, effectiveLength: number) => {
    const wavelength = speedOfSound / frequency
    const k = (2 * Math.PI) / wavelength
    const endCorrection = 0.6 * boreDiameter
    const acousticLength = effectiveLength + endCorrection
    const nodes = []
    
    // Find pressure nodes (minima) - where cos(kx) = 0
    for (let n = 0; n < 10; n++) {
      const nodePosition = acousticLength - (wavelength / 4) * (2 * n + 1)
      if (nodePosition >= 0 && nodePosition <= effectiveLength) {
        nodes.push({
          position: nodePosition,
          type: 'node',
          amplitude: 0
        })
      }
    }
    
    // Find pressure antinodes (maxima) - where cos(kx) = ±1
    for (let n = 0; n < 10; n++) {
      const antinodePosition = acousticLength - (wavelength / 2) * n
      if (antinodePosition >= 0 && antinodePosition <= effectiveLength) {
        nodes.push({
          position: antinodePosition,
          type: 'antinode',
          amplitude: 1
        })
      }
    }
    
    return nodes
  }
  
  // Render visual holes on the flute
  const renderFluteholes = (transform: string = '') => {
    if (!showHoles) return null
    
    return holePositions.map((hole, index) => {
      const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e']
      const color = colors[index % colors.length]
      const holeRadius = (boreDiameter * scale * zoomLevel) / 8 // Proportional to bore size
      const x = startX + hole.position * scale * zoomLevel + panOffset
      const y = centerY + (boreDiameter * scale * zoomLevel) / 2 // Bottom bore line
      
      return (
        <g key={`hole-${hole.hole}`} transform={transform}>
          {/* Hole opening - on bottom bore line */}
          <circle
            cx={x}
            cy={y}
            r={Math.max(2, holeRadius)}
            fill="#2c3e50"
            stroke={color}
            strokeWidth="2"
            opacity="0.9"
          />
          
          {/* Hole rim */}
          <circle
            cx={x}
            cy={y}
            r={Math.max(3, holeRadius + 1)}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.6"
          />
          
          {/* Hole number label - above the hole */}
          <text
            x={x}
            y={y - (holeRadius + 8)}
            fontSize="11"
            fill={color}
            textAnchor="middle"
            fontWeight="bold"
          >
            #{hole.hole}
          </text>
          
          {/* Note name below the hole */}
          <text
            x={x}
            y={y + (holeRadius + 18)}
            fontSize="9"
            fill={color}
            textAnchor="middle"
          >
            {hole.noteName}
          </text>
        </g>
      )
    })
  }
  
  // Individual wave analysis component
  const IndividualWaveAnalysis = ({ hole, holeData }: { hole: number, holeData: any }) => {
    // Safety checks for holeData
    if (!holeData || !holeData.frequency || !holeData.position || !holeData.noteName) {
      return (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">Invalid hole data for individual analysis.</p>
        </div>
      )
    }

    const individualSvgHeight = 300
    const fundamental = holeData.frequency
    const octave = fundamental * 2
    const effectiveLength = holeData.position
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e']
    const baseColor = colors[(hole - 1) % colors.length]
    
    return (
      <div className="mt-6 p-4 bg-white border border-gray-200 rounded-lg">
        <h4 className="text-lg font-semibold mb-4" style={{ color: baseColor }}>
          Hole #{hole} ({holeData.noteName}) - Individual Wave Analysis
        </h4>
        
        <div className="space-y-6">
          {/* Fundamental frequency */}
          <div>
            <h5 className="font-medium mb-2 text-gray-800">Fundamental: {fundamental.toFixed(1)}Hz</h5>
            <svg width={svgWidth * 0.9} height={individualSvgHeight} className="border border-gray-200 bg-white">
              {/* Grid */}
              <defs>
                <pattern id={`grid-${hole}-fund`} width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f8f8f8" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill={`url(#grid-${hole}-fund)`} />
              
              {/* Bore outline with wooden walls */}
              <rect
                x={startX}
                y={(individualSvgHeight / 2) - (boreDiameter * scale * 0.9) / 2}
                width={effectiveLength * scale * 0.9}
                height={boreDiameter * scale * 0.9}
                fill="rgba(139, 69, 19, 0.1)"
                stroke="#8b4513"
                strokeWidth="2"
                opacity="0.6"
              />
              
              {/* Wooden wall indicators */}
              <line
                x1={startX}
                y1={(individualSvgHeight / 2) - (boreDiameter * scale * 0.9) / 2}
                x2={startX + effectiveLength * scale * 0.9}
                y2={(individualSvgHeight / 2) - (boreDiameter * scale * 0.9) / 2}
                stroke="#8b4513"
                strokeWidth="3"
                opacity="0.8"
              />
              <line
                x1={startX}
                y1={(individualSvgHeight / 2) + (boreDiameter * scale * 0.9) / 2}
                x2={startX + effectiveLength * scale * 0.9}
                y2={(individualSvgHeight / 2) + (boreDiameter * scale * 0.9) / 2}
                stroke="#8b4513"
                strokeWidth="3"
                opacity="0.8"
              />
              
              {/* Center line for wave reference */}
              <line
                x1={startX}
                y1={individualSvgHeight / 2}
                x2={startX + effectiveLength * scale * 0.9}
                y2={individualSvgHeight / 2}
                stroke="#666"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="2,2"
              />
              
              {/* Multiple harmonic analysis with bore containment and wooden wall effects */}
              {(() => {
                const { quality } = generateStandingWave(fundamental, effectiveLength, baseColor, holeData.position)
                
                // Calculate wooden bore effects
                const woodAcousticImpedance = 4.2e6 // Wood acoustic impedance (kg/m²s)
                const airAcousticImpedance = 415 // Air acoustic impedance (kg/m²s)
                const reflectionCoeff = (woodAcousticImpedance - airAcousticImpedance) / (woodAcousticImpedance + airAcousticImpedance)
                
                // Define multiple harmonics for analysis
                const harmonics = [
                  { freq: fundamental, color: baseColor, opacity: 0.9, label: 'Fundamental', strokeWidth: 2 },
                  { freq: fundamental * 1.5, color: '#ff6b6b', opacity: 0.7, label: '3rd Harmonic', strokeWidth: 1.5 },
                  { freq: fundamental * 2.5, color: '#4ecdc4', opacity: 0.6, label: '5th Harmonic', strokeWidth: 1.2 }
                ]
                
                const numPoints = Math.min(300, effectiveLength * 2)
                const maxBoreAmplitude = (boreDiameter * scale * 0.9) / 2 - 4
                const endCorrection = 0.6 * boreDiameter
                const acousticLength = effectiveLength + endCorrection
                const waveCenterY = individualSvgHeight / 2
                
                return (
                  <g>
                    {/* Generate multiple harmonic waves */}
                    {harmonics.map((harmonic, idx) => {
                      const points: string[] = []
                      const baseAmplitude = Math.min(25 - (idx * 5), maxBoreAmplitude * (0.7 - idx * 0.1))
                      const wavelength = speedOfSound / harmonic.freq
                      
                      for (let i = 0; i <= numPoints; i++) {
                        const position = (i / numPoints) * effectiveLength
                        const x = startX + position * scale * 0.9
                        
                        const k = (2 * Math.PI) / wavelength
                        const standingWaveAmplitude = Math.cos(k * (acousticLength - position))
                        
                        // Wall compression effects (stronger for higher harmonics)
                        const distanceFromWalls = Math.min(
                          Math.abs(waveCenterY - ((individualSvgHeight / 2) - (boreDiameter * scale * 0.9) / 2)),
                          Math.abs(waveCenterY - ((individualSvgHeight / 2) + (boreDiameter * scale * 0.9) / 2))
                        )
                        const wallCompressionFactor = 1 + (0.3 * reflectionCoeff * Math.exp(-distanceFromWalls / (10 - idx * 2)))
                        
                        // Apply wooden wall reflections (different for each harmonic)
                        const amplitude = baseAmplitude * wallCompressionFactor
                        const reflectedWave = reflectionCoeff * (0.2 + idx * 0.1) * Math.sin(k * position + Math.PI)
                        
                        // Ensure wave stays within bore boundaries
                        const rawY = waveCenterY + amplitude * standingWaveAmplitude * Math.sin(k * position) + reflectedWave * amplitude
                        const minY = (individualSvgHeight / 2) - maxBoreAmplitude + 2
                        const maxY = (individualSvgHeight / 2) + maxBoreAmplitude - 2
                        const y = Math.max(minY, Math.min(maxY, rawY))
                        
                        points.push(`${x},${y}`)
                      }
                      
                      return (
                        <polyline
                          key={idx}
                          points={points.join(' ')}
                          fill="none"
                          stroke={harmonic.color}
                          strokeWidth={harmonic.strokeWidth}
                          opacity={harmonic.opacity}
                        />
                      )
                    })}
                    
                    {/* Wave concentration analysis points */}
                    {(() => {
                      const concentrationPoints = []
                      const fundamentalWavelength = speedOfSound / fundamental
                      
                      // Find concentration points where multiple harmonics align
                      for (let pos = 0; pos < effectiveLength; pos += effectiveLength / 20) {
                        const x = startX + pos * scale * 0.9
                        let totalAmplitude = 0
                        
                        harmonics.forEach(harmonic => {
                          const harmonicK = (2 * Math.PI) / (speedOfSound / harmonic.freq)
                          const amplitude = Math.cos(harmonicK * (acousticLength - pos)) * Math.sin(harmonicK * pos)
                          totalAmplitude += Math.abs(amplitude)
                        })
                        
                        if (totalAmplitude > 1.5) { // Threshold for concentration
                          concentrationPoints.push({ x, intensity: Math.min(totalAmplitude, 3) })
                        }
                      }
                      
                      return concentrationPoints.map((point, idx) => (
                        <circle
                          key={idx}
                          cx={point.x}
                          cy={waveCenterY}
                          r={3 + point.intensity}
                          fill="rgba(255, 215, 0, 0.7)"
                          stroke="#ffa500"
                          strokeWidth="1"
                          opacity="0.8"
                        />
                      ))
                    })()}
                    
                    {/* Reflection indicators at bore walls */}
                    <text
                      x={startX + 10}
                      y={(individualSvgHeight / 2) - (boreDiameter * scale * 0.9) / 2 - 5}
                      fontSize="10"
                      fill="#000000"
                      fontWeight="bold"
                    >
                      R={(reflectionCoeff * 100).toFixed(1)}%
                    </text>
                    
                    {/* Enhanced hole position marking */}
                    <g>
                      <line
                        x1={startX + holeData.position * scale * 0.9}
                        y1={20}
                        x2={startX + holeData.position * scale * 0.9}
                        y2={individualSvgHeight - 20}
                        stroke={baseColor}
                        strokeWidth="3"
                        opacity="0.8"
                      />
                      <circle
                        cx={startX + holeData.position * scale * 0.9}
                        cy={waveCenterY + maxBoreAmplitude - 8}
                        r="6"
                        fill="white"
                        stroke={baseColor}
                        strokeWidth="2"
                      />
                      <text
                        x={startX + holeData.position * scale * 0.9}
                        y={waveCenterY + maxBoreAmplitude - 5}
                        fontSize="10"
                        fill={baseColor}
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {hole}
                      </text>
                    </g>
                    
                    {/* Quality indicator with bore effects */}
                    <text
                      x={startX + holeData.position * scale * 0.9}
                      y={30}
                      fontSize="12"
                      fill={quality > 0.7 ? '#2ecc71' : quality > 0.4 ? '#f39c12' : '#e74c3c'}
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Q: {(quality * 100).toFixed(0)}%
                    </text>
                    
                    {/* Hole position distance info */}
                    <text
                      x={startX + holeData.position * scale * 0.9}
                      y={individualSvgHeight - 5}
                      fontSize="10"
                      fill="#000000"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {holeData.position.toFixed(1)}mm from utaguchi
                    </text>
                    
                    {/* Bore material info */}
                    <text
                      x={startX + effectiveLength * scale * 0.9 - 10}
                      y={(individualSvgHeight / 2) + (boreDiameter * scale * 0.9) / 2 + 15}
                      fontSize="10"
                      fill="#000000"
                      textAnchor="end"
                      fontWeight="bold"
                    >
                      Bamboo/Wood Impedance: {(woodAcousticImpedance / 1e6).toFixed(1)}M
                    </text>
                  </g>
                )
              })()}
              
              {/* Resonance nodes */}
              {generateResonanceNodes(fundamental, effectiveLength).map((node, idx) => (
                <circle
                  key={idx}
                  cx={startX + node.position * scale * 0.9}
                  cy={individualSvgHeight / 2}
                  r={node.type === 'antinode' ? 4 : 2}
                  fill={node.type === 'antinode' ? baseColor : '#fff'}
                  stroke={baseColor}
                  strokeWidth="1"
                  opacity="0.7"
                />
              ))}
            </svg>
          </div>
          
          {/* Upper octave */}
          <div>
            <h5 className="font-medium mb-2 text-gray-800">Upper Octave: {octave.toFixed(1)}Hz</h5>
            <svg width={svgWidth * 0.9} height={individualSvgHeight} className="border border-gray-200 bg-white">
              {/* Grid */}
              <rect width="100%" height="100%" fill={`url(#grid-${hole}-fund)`} />
              
              {/* Bore outline with wooden walls */}
              <rect
                x={startX}
                y={(individualSvgHeight / 2) - (boreDiameter * scale * 0.9) / 2}
                width={effectiveLength * scale * 0.9}
                height={boreDiameter * scale * 0.9}
                fill="rgba(139, 69, 19, 0.1)"
                stroke="#8b4513"
                strokeWidth="2"
                opacity="0.6"
              />
              
              {/* Wooden wall indicators */}
              <line
                x1={startX}
                y1={(individualSvgHeight / 2) - (boreDiameter * scale * 0.9) / 2}
                x2={startX + effectiveLength * scale * 0.9}
                y2={(individualSvgHeight / 2) - (boreDiameter * scale * 0.9) / 2}
                stroke="#8b4513"
                strokeWidth="3"
                opacity="0.8"
              />
              <line
                x1={startX}
                y1={(individualSvgHeight / 2) + (boreDiameter * scale * 0.9) / 2}
                x2={startX + effectiveLength * scale * 0.9}
                y2={(individualSvgHeight / 2) + (boreDiameter * scale * 0.9) / 2}
                stroke="#8b4513"
                strokeWidth="3"
                opacity="0.8"
              />
              
              {/* Center line for wave reference */}
              <line
                x1={startX}
                y1={individualSvgHeight / 2}
                x2={startX + effectiveLength * scale * 0.9}
                y2={individualSvgHeight / 2}
                stroke="#666"
                strokeWidth="1"
                opacity="0.3"
                strokeDasharray="2,2"
              />
              
              {/* Multiple octave harmonic analysis with bore containment and wooden wall effects */}
              {(() => {
                const { quality } = generateStandingWave(octave, effectiveLength, baseColor, holeData.position)
                
                // Wooden bore effects (same constants)
                const woodAcousticImpedance = 4.2e6
                const airAcousticImpedance = 415
                const reflectionCoeff = (woodAcousticImpedance - airAcousticImpedance) / (woodAcousticImpedance + airAcousticImpedance)
                
                // Define octave harmonics for analysis
                const octaveHarmonics = [
                  { freq: octave, color: baseColor, opacity: 0.9, label: 'Octave', strokeWidth: 2 },
                  { freq: octave * 1.5, color: '#e74c3c', opacity: 0.7, label: 'Octave × 1.5', strokeWidth: 1.5 },
                  { freq: octave * 2, color: '#9b59b6', opacity: 0.6, label: 'Double Octave', strokeWidth: 1.2 }
                ]
                
                const numPoints = Math.min(300, effectiveLength * 2)
                const maxBoreAmplitude = (boreDiameter * scale * 0.9) / 2 - 4
                const endCorrection = 0.6 * boreDiameter
                const acousticLength = effectiveLength + endCorrection
                const waveCenterY = individualSvgHeight / 2
                
                return (
                  <g>
                    {/* Generate multiple octave harmonic waves */}
                    {octaveHarmonics.map((harmonic, idx) => {
                      const points: string[] = []
                      const baseAmplitude = Math.min(20 - (idx * 4), maxBoreAmplitude * (0.6 - idx * 0.1)) // Smaller for octave
                      const wavelength = speedOfSound / harmonic.freq
                      
                      for (let i = 0; i <= numPoints; i++) {
                        const position = (i / numPoints) * effectiveLength
                        const x = startX + position * scale * 0.9
                        
                        const k = (2 * Math.PI) / wavelength
                        const standingWaveAmplitude = Math.cos(k * (acousticLength - position))
                        
                        // Wall compression effects (more pronounced for higher frequencies)
                        const distanceFromWalls = Math.min(
                          Math.abs(waveCenterY - ((individualSvgHeight / 2) - (boreDiameter * scale * 0.9) / 2)),
                          Math.abs(waveCenterY - ((individualSvgHeight / 2) + (boreDiameter * scale * 0.9) / 2))
                        )
                        const wallCompressionFactor = 1 + (0.4 * reflectionCoeff * Math.exp(-distanceFromWalls / (8 - idx))) // More compression for octave
                        
                        // Apply wooden wall reflections with higher frequency effects
                        const amplitude = baseAmplitude * wallCompressionFactor
                        const reflectedWave = reflectionCoeff * (0.3 + idx * 0.1) * Math.sin(k * position + Math.PI) // Stronger reflection for octave
                        
                        // Octave wave with bore containment
                        const rawY = waveCenterY + amplitude * standingWaveAmplitude * Math.sin(k * position) + reflectedWave * amplitude
                        const minY = (individualSvgHeight / 2) - maxBoreAmplitude + 2
                        const maxY = (individualSvgHeight / 2) + maxBoreAmplitude - 2
                        const y = Math.max(minY, Math.min(maxY, rawY))
                        
                        points.push(`${x},${y}`)
                      }
                      
                      return (
                        <polyline
                          key={idx}
                          points={points.join(' ')}
                          fill="none"
                          stroke={harmonic.color}
                          strokeWidth={harmonic.strokeWidth}
                          opacity={harmonic.opacity}
                        />
                      )
                    })}
                    
                    {/* Octave wave concentration analysis points */}
                    {(() => {
                      const concentrationPoints = []
                      
                      // Find concentration points for octave harmonics
                      for (let pos = 0; pos < effectiveLength; pos += effectiveLength / 25) { // More points for higher frequency
                        const x = startX + pos * scale * 0.9
                        let totalAmplitude = 0
                        
                        octaveHarmonics.forEach(harmonic => {
                          const harmonicK = (2 * Math.PI) / (speedOfSound / harmonic.freq)
                          const amplitude = Math.cos(harmonicK * (acousticLength - pos)) * Math.sin(harmonicK * pos)
                          totalAmplitude += Math.abs(amplitude)
                        })
                        
                        if (totalAmplitude > 1.3) { // Lower threshold for octave
                          concentrationPoints.push({ x, intensity: Math.min(totalAmplitude, 2.5) })
                        }
                      }
                      
                      return concentrationPoints.map((point, idx) => (
                        <circle
                          key={idx}
                          cx={point.x}
                          cy={waveCenterY}
                          r={2 + point.intensity}
                          fill="rgba(255, 140, 0, 0.8)"
                          stroke="#ff8c00"
                          strokeWidth="1"
                          opacity="0.9"
                        />
                      ))
                    })()}
                    
                    {/* Enhanced reflection indicators for octave */}
                    <text
                      x={startX + 10}
                      y={(individualSvgHeight / 2) - (boreDiameter * scale * 0.9) / 2 - 5}
                      fontSize="10"
                      fill="#000000"
                      fontWeight="bold"
                    >
                      R={(reflectionCoeff * 100).toFixed(1)}% (Enhanced)
                    </text>
                    
                    {/* Enhanced hole position marking for octave */}
                    <g>
                      <line
                        x1={startX + holeData.position * scale * 0.9}
                        y1={20}
                        x2={startX + holeData.position * scale * 0.9}
                        y2={individualSvgHeight - 20}
                        stroke={baseColor}
                        strokeWidth="3"
                        opacity="0.8"
                      />
                      <rect
                        x={startX + holeData.position * scale * 0.9 - 6}
                        y={waveCenterY + maxBoreAmplitude - 10}
                        width="12"
                        height="12"
                        fill="white"
                        stroke={baseColor}
                        strokeWidth="2"
                        rx="2"
                      />
                      <text
                        x={startX + holeData.position * scale * 0.9}
                        y={waveCenterY + maxBoreAmplitude - 3}
                        fontSize="9"
                        fill={baseColor}
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        {hole}
                      </text>
                    </g>
                    
                    {/* Quality indicator for octave */}
                    <text
                      x={startX + holeData.position * scale * 0.9}
                      y={30}
                      fontSize="12"
                      fill={quality > 0.7 ? '#2ecc71' : quality > 0.4 ? '#f39c12' : '#e74c3c'}
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      Q: {(quality * 100).toFixed(0)}%
                    </text>
                    
                    {/* Frequency-dependent damping info */}
                    <text
                      x={startX + effectiveLength * scale * 0.9 - 10}
                      y={(individualSvgHeight / 2) + (boreDiameter * scale * 0.9) / 2 + 15}
                      fontSize="10"
                      fill="#000000"
                      textAnchor="end"
                      fontWeight="bold"
                    >
                      Higher freq = more wall interaction
                    </text>
                    
                    {/* Octave hole position distance info */}
                    <text
                      x={startX + holeData.position * scale * 0.9}
                      y={individualSvgHeight - 5}
                      fontSize="10"
                      fill="#000000"
                      textAnchor="middle"
                      fontWeight="bold"
                    >
                      {holeData.position.toFixed(1)}mm (2× frequency)
                    </text>
                  </g>
                )
              })()}
              
              {/* Resonance nodes for octave */}
              {generateResonanceNodes(octave, effectiveLength).map((node, idx) => (
                <circle
                  key={idx}
                  cx={startX + node.position * scale * 0.9}
                  cy={individualSvgHeight / 2}
                  r={node.type === 'antinode' ? 4 : 2}
                  fill={node.type === 'antinode' ? baseColor : '#fff'}
                  stroke={baseColor}
                  strokeWidth="1"
                  opacity="0.7"
                />
              ))}
            </svg>
            
            {/* Octave Acoustic Properties */}
            <div className="text-xs text-gray-600 mt-2 space-y-1">
              <div className="flex justify-between">
                <span>Wooden Bore Impedance:</span>
                <span className="font-mono">4.2×10⁶ kg/m²s</span>
              </div>
              <div className="flex justify-between">
                <span>Air Impedance:</span>
                <span className="font-mono">415 kg/m²s</span>
              </div>
              <div className="flex justify-between">
                <span>Reflection Coefficient:</span>
                <span className="font-mono text-amber-600">99.9%</span>
              </div>
              <div className="flex justify-between">
                <span>Wall Damping (2× frequency):</span>
                <span className="font-mono text-red-600">Enhanced</span>
              </div>
              <div className="flex justify-between">
                <span>Bore Confinement:</span>
                <span className="font-mono text-blue-600">Active</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Analysis Legends - Moved outside grid for horizontal layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Fundamental Analysis Legend */}
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h6 className="font-semibold text-blue-800 mb-2">Wave Analysis Legend</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-800 font-medium">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5" style={{ backgroundColor: baseColor }}></div>
                  <span>Fundamental Wave</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-red-400"></div>
                  <span>3rd Harmonic (1.5×)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-teal-400"></div>
                  <span>5th Harmonic (2.5×)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full opacity-70"></div>
                  <span>Wave Concentration Points</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white border-2 rounded-full" style={{ borderColor: baseColor }}></div>
                  <span>Hole #{hole} Position</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-2 bg-amber-100 border border-amber-600"></div>
                  <span>Wooden Bore Walls</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 border-dashed border-gray-400"></div>
                  <span>Wave Center Reference</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-600">R=99.9%</span>
                  <span>Reflection Coefficient</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Octave Analysis Legend */}
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <h6 className="font-semibold text-purple-800 mb-2">Octave Wave Analysis Legend</h6>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-800 font-medium">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5" style={{ backgroundColor: baseColor }}></div>
                  <span>Octave Wave (2× fundamental)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-red-500"></div>
                  <span>Octave × 1.5 Harmonic</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-purple-500"></div>
                  <span>Double Octave (4× fundamental)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-400 rounded-full opacity-80"></div>
                  <span>High-Freq Concentration</span>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white border-2 rounded" style={{ borderColor: baseColor }}></div>
                  <span>Hole #{hole} (Octave)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-600">Enhanced</span>
                  <span>Higher Wall Reflection</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-red-600">2× freq</span>
                  <span>Frequency Doubling Effect</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-blue-600">Active</span>
                  <span>Enhanced Bore Confinement</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Analysis comparison */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
          <p><strong>Harmonic Analysis:</strong></p>
          <p>• The octave (2x frequency) shows twice as many wave cycles in the same length</p>
          <p>• Compare the node positions - octave harmonics should align with fundamental patterns</p>
          <p>• If hole position works well for fundamental but poorly for octave, consider slight adjustment</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Acoustic Standing Wave Analysis
      </h3>
      
      {/* Wave Toggle Controls */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="font-medium mb-3">Hole Configuration Controls</h4>
        <p className="text-xs text-gray-800 mb-3 font-medium">Toggle ON = Hole CLOSED (plugged), Toggle OFF = Hole OPEN. Standing waves reflect actual acoustic behavior.</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Base frequency toggle */}
          <button
            onClick={() => toggleWave(0)}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              visibleWaves[0]
                ? 'bg-slate-700 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            Base ({(baseFrequency || 0).toFixed(1)}Hz)
          </button>
          
          {/* Individual hole toggles */}
          {holePositions.map((hole, index) => {
            const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e']
            const color = colors[index % colors.length]
            return (
              <button
                key={hole.hole}
                onClick={() => toggleWave(hole.hole)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  visibleWaves[hole.hole]
                    ? 'text-white border-2 border-gray-800'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 border-2 border-transparent'
                }`}
                style={{
                  backgroundColor: visibleWaves[hole.hole] ? color : undefined
                }}
              >
                #{hole.hole} ({hole.noteName}) {visibleWaves[hole.hole] ? 'CLOSED' : 'OPEN'}
              </button>
            )
          })}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Wave controls */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                const allVisible: {[key: number]: boolean} = { 0: true }
                holePositions.forEach(hole => { allVisible[hole.hole] = true })
                setVisibleWaves(allVisible)
              }}
              className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
            >
              Show All Waves
            </button>
            <button
              onClick={() => {
                const allHidden: {[key: number]: boolean} = { 0: true } // Keep base visible
                holePositions.forEach(hole => { allHidden[hole.hole] = false })
                setVisibleWaves(allHidden)
              }}
              className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
            >
              Hide All Holes
            </button>
          </div>
          
          {/* Zoom controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">Zoom:</span>
            <button
              onClick={() => handleZoom(-0.25)}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              disabled={zoomLevel <= 0.5}
            >
              Zoom Out
            </button>
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {(zoomLevel * 100).toFixed(0)}%
            </span>
            <button
              onClick={() => handleZoom(0.25)}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              disabled={zoomLevel >= 5}
            >
              Zoom In
            </button>
            <button
              onClick={resetView}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            >
              Reset
            </button>
          </div>
          
          {/* Hole visibility controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">Holes:</span>
            <button
              onClick={() => setShowHoles(!showHoles)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                showHoles
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showHoles ? 'Hide Holes' : 'Show Holes'}
            </button>
          </div>
          
          {/* Breath Power Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">Breath Power:</span>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.1"
              value={breathPower}
              onChange={(e) => setBreathPower(parseFloat(e.target.value))}
              className="w-20"
            />
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
              {(breathPower * 100).toFixed(0)}%
            </span>
          </div>
          
          {/* Flat Points Control */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-800">Flat Points:</span>
            <button
              onClick={() => setShowFlatPoints(!showFlatPoints)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                showFlatPoints
                  ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {showFlatPoints ? 'Hide' : 'Show'}
            </button>
          </div>
        </div>
      </div>
      
      {/* General Analysis Diagram */}
      <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
        <h4 className="font-medium mb-3">Realistic Air Flow Analysis</h4>
        <div className="text-sm text-gray-800 mb-4 font-medium">
          Shows realistic air flow patterns based on which holes are open (OFF) or closed (ON). 
          Green particles circulate around open holes, blue particles show axial flow in the bore.
        </div>
      
        <div className="overflow-x-auto">
          <svg 
            width={Math.max(svgWidth, svgWidth * zoomLevel)} 
            height={svgHeight} 
            className="border border-gray-200 bg-white"
            viewBox={`${panOffset} 0 ${svgWidth} ${svgHeight}`}
          >
            {/* Grid lines for reference */}
            <defs>
              <pattern id="acoustic-grid" width="50" height="20" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#acoustic-grid)" />
            
            {/* Center line (bore axis) - acoustic equilibrium */}
            <line
              x1={startX + panOffset}
              y1={centerY}
              x2={startX + fluteLength * scale * zoomLevel + panOffset}
              y2={centerY}
              stroke="#666"
              strokeWidth="1"
              opacity="0.4"
              strokeDasharray="2,2"
            />
            
            {/* Main bore centerline for reference */}
            <line
              x1={startX + panOffset}
              y1={centerY}
              x2={startX + fluteLength * scale * zoomLevel + panOffset}
              y2={centerY}
              stroke="#333"
              strokeWidth="2"
              opacity="0.3"
            />
            
            {/* Flute bore outline */}
            <rect
              x={startX + panOffset}
              y={centerY - (boreDiameter * scale * zoomLevel) / 2}
              width={fluteLength * scale * zoomLevel}
              height={boreDiameter * scale * zoomLevel}
              fill="none"
              stroke="#8b4513"
              strokeWidth="2"
              opacity="0.3"
            />
            
            {/* Bottom bore line - where holes are positioned */}
            <line
              x1={startX + panOffset}
              y1={centerY + (boreDiameter * scale * zoomLevel) / 2}
              x2={startX + fluteLength * scale * zoomLevel + panOffset}
              y2={centerY + (boreDiameter * scale * zoomLevel) / 2}
              stroke="#8b4513"
              strokeWidth="1"
              opacity="0.6"
              strokeDasharray="3,3"
            />
            
            {/* Utaguchi (blowing edge) - where waves originate */}
            <g>
              {/* Utaguchi edge */}
              <line
                x1={startX + panOffset}
                y1={centerY - (boreDiameter * scale * zoomLevel) / 2}
                x2={startX + panOffset}
                y2={centerY + (boreDiameter * scale * zoomLevel) / 2}
                stroke="#8b4513"
                strokeWidth="3"
                opacity="0.8"
              />
              
              {/* Utaguchi label */}
              {zoomLevel >= 0.75 && (
                <text
                  x={startX + panOffset - 15}
                  y={centerY - (boreDiameter * scale * zoomLevel) / 2 - 5}
                  fontSize={10 * Math.min(1.2, zoomLevel)}
                  fill="#8b4513"
                  textAnchor="middle"
                  fontWeight="bold"
                  transform={`rotate(-90, ${startX + panOffset - 15}, ${centerY - (boreDiameter * scale * zoomLevel) / 2 - 5})`}
                >
                  utaguchi
                </text>
              )}
              
              {/* Wave origin indicator - at top corner */}
              <circle
                cx={startX + panOffset}
                cy={centerY - (boreDiameter * scale * zoomLevel) / 2}
                r="3"
                fill="#ff6b6b"
                stroke="#8b4513"
                strokeWidth="1"
                opacity="0.8"
              />
              
              {/* Top corner marker */}
              <text
                x={startX + panOffset + 8}
                y={centerY - (boreDiameter * scale * zoomLevel) / 2 - 3}
                fontSize={8 * Math.min(1.2, zoomLevel)}
                fill="#ff6b6b"
                textAnchor="start"
                fontWeight="bold"
              >
                wave start
              </text>
            </g>
            
            {/* Visual holes on the flute */}
            {renderFluteholes()}
            
            {/* Generate standing waves for each hole's effective length */}
            {holePositions.map((hole, index) => {
              if (!visibleWaves[hole.hole]) return null // Skip if hidden
              
              const effectiveLength = hole.position // Distance from mouthpiece to hole
              const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e']
              const color = colors[index % colors.length]
              
              // Generate particle density visualization for standing waves
              const particles: React.ReactElement[] = []
              const numParticles = Math.min(80, fluteLength / 4) // Use full flute length for particle distribution
              const boreRadius = (boreDiameter * scale * zoomLevel) / 2
              const wavelength = speedOfSound / hole.frequency
              const endCorrection = 0.6 * boreDiameter
              const acousticLength = effectiveLength + endCorrection
              
              // Start from utaguchi position
              const startPosition = startX + panOffset
              
              for (let i = 0; i < numParticles; i++) {
                const position = (i / numParticles) * fluteLength // Extend particles through entire flute
                const x = startPosition + position * scale * zoomLevel
                
                const k = (2 * Math.PI) / wavelength
                
                // Calculate standing wave amplitude differently for before and after the hole
                let standingWaveAmplitude: number
                if (position <= effectiveLength) {
                  // Before the hole: standard standing wave
                  standingWaveAmplitude = Math.cos(k * (acousticLength - position))
                } else {
                  // After the hole: reduced amplitude but still present due to air flow
                  const beyondHoleDistance = position - effectiveLength
                  const dampingFactor = Math.exp(-beyondHoleDistance / (fluteLength * 0.3)) // Exponential decay
                  const continuousWave = Math.cos(k * (acousticLength - position + beyondHoleDistance * 0.5))
                  standingWaveAmplitude = continuousWave * dampingFactor * 0.4 // Reduced amplitude beyond hole
                }
                
                // Calculate particle density based on standing wave pressure
                const pressureDensity = Math.abs(standingWaveAmplitude)
                const particleCount = Math.floor(pressureDensity * 4) + 1 // Reduced from 8 to 4 particles max
                
                // Wall reflection effects increase density
                const wallReflectionFactor = 0.9
                const wallEffect = 1 + (wallReflectionFactor * 0.3 * Math.sin(k * position + Math.PI * 0.25))
                const adjustedDensity = particleCount * wallEffect
                
                // Generate particles at this position
                for (let p = 0; p < Math.floor(adjustedDensity); p++) {
                  // Distribute particles across bore diameter with more spacing
                  const yOffset = (p / Math.floor(adjustedDensity)) * (boreRadius * 1.4) - (boreRadius * 0.7)
                  const particleY = centerY + yOffset
                  
                  // Particle properties based on density and position - smaller particles
                  const particleSize = Math.max(0.8, pressureDensity * 2.0)
                  const particleOpacity = Math.max(0.4, pressureDensity * 0.9)
                  
                  // Unique color for each note based on hole number
                  const noteColor = color // Use the note's assigned color
                  const intensityAlpha = pressureDensity > 0.7 ? 0.9 : 
                                        pressureDensity > 0.4 ? 0.7 : 0.5
                  
                  // Convert hex color to rgba with intensity
                  const hexToRgba = (hex: string, alpha: number) => {
                    const r = parseInt(hex.slice(1, 3), 16)
                    const g = parseInt(hex.slice(3, 5), 16)
                    const b = parseInt(hex.slice(5, 7), 16)
                    return `rgba(${r}, ${g}, ${b}, ${alpha})`
                  }
                  
                  particles.push(
                    <circle
                      key={`particle-${hole.hole}-${i}-${p}`}
                      cx={x + (Math.random() - 0.5) * 3} // Increased jitter for less uniform look
                      cy={particleY + (Math.random() - 0.5) * 3}
                      r={particleSize}
                      fill={hexToRgba(noteColor, intensityAlpha)}
                      opacity={particleOpacity}
                    />
                  )
                }
              }
              
              const { quality } = generateStandingWave(hole.frequency, effectiveLength, color, hole.position)
              const resonanceNodes = generateResonanceNodes(hole.frequency, effectiveLength)
              
              return (
                <g key={hole.hole}>
                  {/* Particle density visualization - shows standing wave as particle concentrations */}
                  {particles}
                  
                  {/* Bore outline for reference */}
                  <rect
                    x={startPosition}
                    y={centerY - boreRadius}
                    width={effectiveLength * scale * zoomLevel}
                    height={boreRadius * 2}
                    fill="none"
                    stroke="#8b4513"
                    strokeWidth="1"
                    opacity="0.3"
                    strokeDasharray="2,2"
                  />
                  
                  {/* Resonance nodes and antinodes */}
                  {resonanceNodes.map((node, nodeIndex) => (
                    <circle
                      key={`node-${hole.hole}-${nodeIndex}`}
                      cx={startX + node.position * scale * zoomLevel + panOffset}
                      cy={centerY}
                      r={node.type === 'antinode' ? 2.5 * Math.min(1.5, zoomLevel) : 1 * Math.min(1.5, zoomLevel)}
                      fill={node.type === 'antinode' ? color : '#fff'}
                      stroke={color}
                      strokeWidth="1"
                      opacity="0.5"
                    />
                  ))}
                  
                  {/* Hole position marker */}
                  <line
                    x1={startX + hole.position * scale * zoomLevel + panOffset}
                    y1={centerY - 60 * Math.min(1.5, zoomLevel)}
                    x2={startX + hole.position * scale * zoomLevel + panOffset}
                    y2={centerY + 60 * Math.min(1.5, zoomLevel)}
                    stroke={color}
                    strokeWidth={2 * Math.min(1.5, zoomLevel)}
                    opacity="0.6"
                  />
                  
                  {/* Labels - only show if zoom is reasonable */}
                  {zoomLevel >= 0.75 && (
                    <>
                      {/* Hole label with acoustic quality indicator */}
                      <text
                        x={startX + hole.position * scale * zoomLevel + panOffset}
                        y={centerY - 70 * Math.min(1.5, zoomLevel)}
                        fontSize={12 * Math.min(1.2, zoomLevel)}
                        fill={color}
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        #{hole.hole} ({hole.noteName})
                      </text>
                      
                      {/* Acoustic quality indicator */}
                      <text
                        x={startX + hole.position * scale * zoomLevel + panOffset}
                        y={centerY - 55 * Math.min(1.5, zoomLevel)}
                        fontSize={10 * Math.min(1.2, zoomLevel)}
                        fill={quality > 0.7 ? '#2ecc71' : quality > 0.4 ? '#f39c12' : '#e74c3c'}
                        textAnchor="middle"
                        fontWeight="bold"
                      >
                        Q: {(quality * 100).toFixed(0)}%
                      </text>
                      
                      {/* Frequency label */}
                      <text
                        x={startX + hole.position * scale * zoomLevel + panOffset}
                        y={centerY + 80 * Math.min(1.5, zoomLevel)}
                        fontSize={10 * Math.min(1.2, zoomLevel)}
                        fill={color}
                        textAnchor="middle"
                      >
                        {hole.frequency.toFixed(1)}Hz
                      </text>
                      
                      {/* Individual analysis button */}
                      <text
                        x={startX + hole.position * scale * zoomLevel + panOffset}
                        y={centerY + 95 * Math.min(1.5, zoomLevel)}
                        fontSize={9 * Math.min(1.2, zoomLevel)}
                        fill="blue"
                        textAnchor="middle"
                        className="cursor-pointer hover:underline"
                        onClick={() => setSelectedHole(selectedHole === hole.hole ? null : hole.hole)}
                      >
                        {selectedHole === hole.hole ? 'Hide' : 'Analyze'}
                      </text>
                    </>
                  )}
                </g>
              )
            })}

            {/* Realistic Air Flow Visualization */}
            {(() => {
              // Determine the effective acoustic configuration
              const sortedHoles = [...holePositions].sort((a, b) => a.position - b.position) // Sort by position from utaguchi
              
              // Find all open holes (toggled OFF) from utaguchi
              const openHoles = sortedHoles.filter(hole => !visibleWaves[hole.hole])
              const firstOpenHole = openHoles[0]
              
              // Determine effective acoustic length
              let effectiveAcousticLength: number
              let resonantFrequency: number
              let configDescription: string
              
              if (!firstOpenHole) {
                // All holes closed - air exits only at the end (tanjō)
                effectiveAcousticLength = fluteLength
                resonantFrequency = baseFrequency || 440
                configDescription = "All holes closed - air exits at tanjō end"
              } else {
                // Air exits at first open hole
                effectiveAcousticLength = firstOpenHole.position
                resonantFrequency = firstOpenHole.frequency
                configDescription = `Air exits at hole #${firstOpenHole.hole} (${firstOpenHole.noteName})`
              }
              
              // Generate realistic air flow particles
              const airFlowParticles: React.ReactElement[] = []
              const flatPoints: React.ReactElement[] = []
              const numParticles = Math.min(150, effectiveAcousticLength / 2)
              const boreRadius = (boreDiameter * scale * zoomLevel) / 2
              const wavelength = speedOfSound / resonantFrequency
              const endCorrection = 0.6 * boreDiameter
              const acousticLength = effectiveAcousticLength + endCorrection
              
              const startPosition = startX + panOffset
              
              // Calculate Nelson Zink flat points (pressure nodes) for optimal hole placement
              const k = (2 * Math.PI) / wavelength
              const flatPointPositions: number[] = []
              
              // Find all flat points (nodes) along the acoustic length
              for (let pos = 0; pos <= effectiveAcousticLength; pos += 1) {
                const standingWaveAmplitude = Math.cos(k * (acousticLength - pos))
                if (Math.abs(standingWaveAmplitude) < 0.1) { // Near node (flat point)
                  flatPointPositions.push(pos)
                }
              }
              
              // Deduplicate nearby flat points
              const uniqueFlatPoints: number[] = []
              for (const pos of flatPointPositions) {
                if (!uniqueFlatPoints.some(existing => Math.abs(existing - pos) < 10)) {
                  uniqueFlatPoints.push(pos)
                }
              }
              
              for (let i = 0; i < numParticles; i++) {
                const position = (i / numParticles) * fluteLength
                const x = startPosition + position * scale * zoomLevel
                
                const k = (2 * Math.PI) / wavelength
                
                // Check if we're near an open hole
                let nearOpenHole = false
                let holeDistance = Infinity
                let nearestOpenHole = null
                
                for (const hole of openHoles) {
                  const distanceToHole = Math.abs(position - hole.position)
                  if (distanceToHole < holeDistance) {
                    holeDistance = distanceToHole
                    nearestOpenHole = hole
                  }
                }
                
                const holeInfluenceRadius = boreDiameter * 1.5 // Influence zone around holes
                nearOpenHole = holeDistance < holeInfluenceRadius
                
                let standingWaveAmplitude: number
                let participationFactor = 1
                let airFlowPattern = 'axial' // 'axial' or 'circular'
                
                if (position <= effectiveAcousticLength) {
                  // Within the active acoustic length
                  if (nearOpenHole && nearestOpenHole) {
                    // Near an open hole - create circular air flow patterns
                    const holeX = startPosition + nearestOpenHole.position * scale * zoomLevel
                    const relativeDistance = holeDistance / holeInfluenceRadius
                    
                    // Circular flow around the hole
                    airFlowPattern = 'circular'
                    const circularIntensity = 1 - relativeDistance
                    standingWaveAmplitude = circularIntensity * 0.8
                    participationFactor = 1
                  } else {
                    // Regular standing wave in bore
                    standingWaveAmplitude = Math.cos(k * (acousticLength - position)) * 0.6
                    participationFactor = 1
                    airFlowPattern = 'axial'
                  }
                } else {
                  // Beyond the active acoustic length - minimal flow depends on breath power
                  const beyondDistance = position - effectiveAcousticLength
                  const maxPenetration = (fluteLength - effectiveAcousticLength) * breathPower
                  
                  if (beyondDistance <= maxPenetration) {
                    const decayFactor = Math.exp(-beyondDistance / (maxPenetration * 0.3))
                    standingWaveAmplitude = decayFactor * 0.2
                    participationFactor = decayFactor
                    airFlowPattern = 'axial'
                  } else {
                    standingWaveAmplitude = 0
                    participationFactor = 0
                  }
                }
                
                if (participationFactor > 0.05) {
                  const pressureDensity = Math.abs(standingWaveAmplitude) * participationFactor
                  const particleCount = Math.floor(pressureDensity * 6) + 1
                  
                  // Generate particles based on flow pattern
                  for (let p = 0; p < particleCount; p++) {
                    let particleX = x
                    let particleY = centerY
                    let particleColor = `rgba(52, 152, 219, 0.5)` // Default blue color
                    
                    if (airFlowPattern === 'circular' && nearestOpenHole) {
                      // Circular flow around open hole
                      const holeX = startPosition + nearestOpenHole.position * scale * zoomLevel
                      const angle = (p / particleCount) * 2 * Math.PI + (Date.now() * 0.001) % (2 * Math.PI)
                      const radius = boreRadius * 0.7 * (0.5 + 0.5 * pressureDensity)
                      
                      particleX = holeX + Math.cos(angle) * radius * 0.8
                      particleY = centerY + Math.sin(angle) * radius
                      
                      // Bright green for circular flow (air exiting)
                      particleColor = `rgba(46, 204, 113, ${pressureDensity * 0.9})`
                    } else if (airFlowPattern === 'axial') {
                      // Axial flow along bore
                      const yOffset = (p / particleCount - 0.5) * boreRadius * 1.4
                      particleY = centerY + yOffset
                      particleX = x + (Math.random() - 0.5) * 3
                      
                      if (position <= effectiveAcousticLength) {
                        // Active acoustic region - strong blue
                        particleColor = `rgba(52, 152, 219, ${pressureDensity * 0.8})`
                      } else {
                        // Extended region due to breath power - fading orange
                        const fadeIntensity = participationFactor * 0.6
                        particleColor = `rgba(230, 126, 34, ${fadeIntensity})`
                      }
                    }
                    
                    const particleSize = Math.max(0.5, pressureDensity * 1.5)
                    const particleOpacity = Math.max(0.4, pressureDensity * 0.9)
                    
                    airFlowParticles.push(
                      <circle
                        key={`airflow-particle-${i}-${p}`}
                        cx={particleX + (Math.random() - 0.5) * 2}
                        cy={particleY + (Math.random() - 0.5) * 2}
                        r={particleSize}
                        fill={particleColor}
                        opacity={particleOpacity}
                      />
                    )
                  }
                }
              }
              
              return (
                <g>
                  {/* Configuration description */}
                  <text x={20 + panOffset} y={50} fontSize={12} fill="#000000" fontWeight="bold">
                    {configDescription} | Effective Length: {effectiveAcousticLength.toFixed(1)}mm | Freq: {resonantFrequency.toFixed(1)}Hz
                  </text>
                  
                  {/* Air flow particles */}
                  {airFlowParticles}
                  
                  {/* Bore outline */}
                  <rect
                    x={startPosition}
                    y={centerY - boreRadius}
                    width={fluteLength * scale * zoomLevel}
                    height={boreRadius * 2}
                    fill="none"
                    stroke="#34495e"
                    strokeWidth="1"
                    opacity="0.3"
                  />
                  
                  {/* Mark the effective acoustic length */}
                  <line
                    x1={startPosition + effectiveAcousticLength * scale * zoomLevel}
                    y1={centerY - boreRadius - 10}
                    x2={startPosition + effectiveAcousticLength * scale * zoomLevel}
                    y2={centerY + boreRadius + 10}
                    stroke="#e74c3c"
                    strokeWidth="2"
                    opacity="0.7"
                  />
                  
                  {/* Highlight open holes with green circles */}
                  {openHoles.map(hole => (
                    <circle
                      key={`open-hole-${hole.hole}`}
                      cx={startPosition + hole.position * scale * zoomLevel}
                      cy={centerY}
                      r={8}
                      fill="none"
                      stroke="#27ae60"
                      strokeWidth="3"
                      opacity="0.8"
                    />
                  ))}
                  
                  {/* Nelson Zink Flat Points (Pressure Nodes) - Optimal hole placement zones */}
                  {showFlatPoints && uniqueFlatPoints.map((flatPos, index) => {
                    const x = startPosition + flatPos * scale * zoomLevel
                    return (
                      <g key={`flat-point-${index}`}>
                        {/* Vertical line marking flat point */}
                        <line
                          x1={x}
                          y1={centerY - boreRadius - 15}
                          x2={x}
                          y2={centerY + boreRadius + 15}
                          stroke="#9b59b6"
                          strokeWidth="2"
                          strokeDasharray="4,2"
                          opacity="0.8"
                        />
                        {/* Flat point label */}
                        <text
                          x={x + 3}
                          y={centerY - boreRadius - 18}
                          fontSize="10"
                          fill="#9b59b6"
                          fontWeight="bold"
                        >
                          FP{index + 1}
                        </text>
                        {/* Distance label */}
                        <text
                          x={x + 3}
                          y={centerY + boreRadius + 25}
                          fontSize="8"
                          fill="#9b59b6"
                        >
                          {flatPos.toFixed(0)}mm
                        </text>
                      </g>
                    )
                  })}
                  
                  {/* Hole placement analysis - show how close each hole is to flat points */}
                  {showFlatPoints && holePositions.map(hole => {
                    const holeX = startPosition + hole.position * scale * zoomLevel
                    const closestFlatPoint = uniqueFlatPoints.reduce((closest, flatPos) => 
                      Math.abs(hole.position - flatPos) < Math.abs(hole.position - closest) ? flatPos : closest
                    , uniqueFlatPoints[0] || 0)
                    
                    const distanceToFlat = Math.abs(hole.position - closestFlatPoint)
                    const isOptimal = distanceToFlat < 15 // Within 15mm of flat point
                    
                    return (
                      <g key={`hole-analysis-${hole.hole}`}>
                        {/* Line connecting hole to nearest flat point */}
                        <line
                          x1={holeX}
                          y1={centerY}
                          x2={startPosition + closestFlatPoint * scale * zoomLevel}
                          y2={centerY}
                          stroke={isOptimal ? "#27ae60" : "#e74c3c"}
                          strokeWidth="1"
                          strokeDasharray="2,2"
                          opacity="0.6"
                        />
                        {/* Distance indicator */}
                        <text
                          x={holeX + 5}
                          y={centerY - 25}
                          fontSize="9"
                          fill={isOptimal ? "#27ae60" : "#e74c3c"}
                          fontWeight="bold"
                        >
                          #{hole.hole}: {distanceToFlat.toFixed(0)}mm {isOptimal ? "✓" : "⚠"}
                        </text>
                      </g>
                    )
                  })}
                  
                  {/* Show breath power penetration if beyond acoustic length */}
                  {effectiveAcousticLength < fluteLength && (
                    <line
                      x1={startPosition + (effectiveAcousticLength + (fluteLength - effectiveAcousticLength) * breathPower) * scale * zoomLevel}
                      y1={centerY - boreRadius - 5}
                      x2={startPosition + (effectiveAcousticLength + (fluteLength - effectiveAcousticLength) * breathPower) * scale * zoomLevel}
                      y2={centerY + boreRadius + 5}
                      stroke="#f39c12"
                      strokeWidth="1"
                      strokeDasharray="3,3"
                      opacity="0.6"
                    />
                  )}
                </g>
              )
            })()}
            
            {/* Legend - always visible, positioned relative to viewport */}
            <>
              <text x={Math.max(20, panOffset + 20)} y={30} fontSize={14 * Math.min(1.2, zoomLevel)} fill="#000000" fontWeight="bold">
                Standing Wave Particle Analysis (Middle C Range)
              </text>
              <text x={Math.max(20, panOffset + 20)} y={100} fontSize={12 * Math.min(1.2, zoomLevel)} fill="#000000" fontWeight="bold">
                Base: {(baseFrequency || 440).toFixed(1)}Hz | Zoom: {(zoomLevel * 100).toFixed(0)}%
              </text>
              <text x={Math.max(20, panOffset + 20)} y={115} fontSize={11 * Math.min(1.2, zoomLevel)} fill="#000000" fontWeight="bold">
                Holes positioned on bottom bore line
              </text>
              <text x={Math.max(20, panOffset + 20)} y={130} fontSize={11 * Math.min(1.2, zoomLevel)} fill="#000000" fontWeight="bold">
                Particle density shows acoustic pressure concentrations
              </text>
            </>
            
            {/* Scale reference */}
            <text x={startX + panOffset} y={svgHeight - 10} fontSize={11 * Math.min(1.2, zoomLevel)} fill="#000000" textAnchor="start" fontWeight="bold">
              0mm
            </text>
            <text x={startX + fluteLength * scale * zoomLevel + panOffset} y={svgHeight - 10} fontSize={11 * Math.min(1.2, zoomLevel)} fill="#000000" textAnchor="end" fontWeight="bold">
              {fluteLength}mm
            </text>
          </svg>
        </div>
      </div>
      
      {/* Individual Wave Analysis Section */}
      <div className="mb-6">
        <h4 className="font-medium mb-3 text-gray-800">Individual Note Analysis</h4>
        <div className="text-sm text-gray-800 mb-4 font-medium">
          Click "Analyze" on any note in the diagram above to see detailed fundamental and octave wave analysis.
        </div>
        
        {/* Individual wave analysis for selected hole */}
        {selectedHole !== null && (() => {
          const holeData = holePositions.find(h => h.hole === selectedHole)
          return holeData ? <IndividualWaveAnalysis hole={selectedHole} holeData={holeData} /> : null
        })()}
        
        {selectedHole === null && (
          <div className="p-8 text-center text-gray-800 bg-white border border-gray-200 rounded-lg font-medium">
            Select a note from the diagram above to see detailed wave analysis
          </div>
        )}
      </div>      {/* Analysis notes */}
      <div className="mt-4 text-sm text-gray-800">
        <p><strong>How to read this realistic air flow analysis:</strong></p>
        <ul className="list-disc list-inside mt-2 space-y-1 font-medium">
          <li><strong>Hole Configuration:</strong> Toggle ON = Hole CLOSED (plugged), Toggle OFF = Hole OPEN</li>
          <li><strong>Blue Particles:</strong> Axial air flow along the bore (standing wave patterns)</li>
          <li><strong>Green Particles:</strong> Circular air flow around open holes (air exiting)</li>
          <li><strong>Orange Particles:</strong> Weak flow beyond acoustic length (breath power effect)</li>
          <li><strong>Green Circles:</strong> Highlight open holes where air exits</li>
          <li><strong>Red Line:</strong> Effective acoustic length (where primary air exit occurs)</li>
          <li><strong>Yellow Dashed Line:</strong> Maximum breath power penetration distance</li>
          <li><strong>Purple Dashed Lines (FP):</strong> Nelson Zink flat points - optimal hole placement zones (pressure nodes)</li>
          <li><strong>Hole Analysis:</strong> Green ✓ = hole within 15mm of flat point (optimal), Red ⚠ = suboptimal placement</li>
          <li><strong>Realistic Physics:</strong> Shows actual shakuhachi air flow based on open/closed holes</li>
          <li><strong>Breath Power:</strong> Controls how far air flow extends beyond the acoustic exit point</li>
        </ul>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p><strong>For Flute Makers:</strong> This shows realistic air flow patterns with Nelson Zink flat point analysis. Green circular particles around open holes demonstrate the vortex patterns that create sound. Blue axial particles show standing wave pressure along the bore. Purple dashed lines mark flat points (pressure nodes) - the optimal zones for hole placement according to Nelson Zink's acoustic principles. Holes should be positioned as close as possible to these flat points for optimal intonation and response.</p>
        </div>
        
        <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
          <p><strong>Pro Tips:</strong> Zoom in (200-300%) for detailed wave analysis. Hide waves to focus on specific notes. Toggle holes off for cleaner wave visualization. Use individual analysis to check harmonic relationships.</p>
        </div>
      </div>
    </div>
  )
}

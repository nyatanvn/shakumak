'use client'

import React from 'react'

interface ShakuhachiDiagramProps {
  fluteLength: number
  holeDiameter: number
  boreDiameter: number
  wallThickness: number
  holePositions: Array<{
    hole: number
    position: number
    alternatePosition?: number
    error: boolean
  }>
  spans: {
    span54?: number  // Traditional spans
    span43?: number
    span32?: number
    span21?: number
    span67?: number  // Diatonic spans
    span56?: number
    span45?: number
    span34?: number
    span23?: number
    span12?: number
  }
  type: 'traditional' | 'diatonic'
}

export default function ShakuhachiDiagram({ 
  fluteLength, 
  holeDiameter, 
  boreDiameter, 
  wallThickness,
  holePositions,
  spans,
  type 
}: ShakuhachiDiagramProps) {
  // SVG dimensions and scaling
  const svgWidth = 800
  const svgHeight = 600
  const scale = Math.min(svgWidth * 0.8, svgHeight * 0.8) / fluteLength
  const flutePixelLength = fluteLength * scale
  
  // Calculate flute outer diameter
  const outerDiameter = boreDiameter + (wallThickness * 2)
  const outerRadius = (outerDiameter * scale) / 2
  const boreRadius = (boreDiameter * scale) / 2
  const holeRadius = (holeDiameter * scale) / 2
  
  // Center the flute vertically and horizontally
  const centerX = svgWidth / 2
  const startY = (svgHeight - flutePixelLength) / 2
  const endY = startY + flutePixelLength
  
  // Mouthpiece (utaguchi) dimensions - traditionally wider at the blowing edge
  const mouthpieceHeight = 30 * scale
  const mouthpieceWidth = outerRadius * 1.5

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Technical Drawing - {type === 'traditional' ? 'Traditional' : 'Diatonic'} Shakuhachi
      </h3>
      
      <div className="flex flex-col items-center">
        <svg width={svgWidth} height={svgHeight} className="border border-gray-200">
          {/* Grid lines for reference */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#f0f0f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Main flute body - outer wall */}
          <rect
            x={centerX - outerRadius}
            y={startY}
            width={outerRadius * 2}
            height={flutePixelLength}
            fill="#d2b48c"
            stroke="#8b4513"
            strokeWidth="2"
          />
          
          {/* Inner bore */}
          <rect
            x={centerX - boreRadius}
            y={startY}
            width={boreRadius * 2}
            height={flutePixelLength}
            fill="#f5f5dc"
            stroke="#8b4513"
            strokeWidth="1"
          />
          
          {/* Finger holes */}
          {holePositions.map((hole) => {
            const holeY = startY + (hole.position * scale)
            const isThumbHole = (type === 'traditional' && hole.hole === 5) || 
                               (type === 'diatonic' && hole.hole === 7)
            
            // Main hole
            return (
              <g key={hole.hole}>
                {/* Hole */}
                <circle
                  cx={centerX + (isThumbHole ? outerRadius + 8 : 0)}
                  cy={holeY}
                  r={isThumbHole ? holeRadius + 1 : holeRadius}
                  fill={hole.error ? "#ff6b6b" : isThumbHole ? "#e67e22" : "#2c3e50"}
                  stroke={hole.error ? "#e74c3c" : isThumbHole ? "#d35400" : "#34495e"}
                  strokeWidth={isThumbHole ? "3" : "2"}
                />
                
                {/* Thumb hole connecting line */}
                {isThumbHole && (
                  <line
                    x1={centerX + outerRadius}
                    y1={holeY}
                    x2={centerX + outerRadius + 8}
                    y2={holeY}
                    stroke="#95a5a6"
                    strokeWidth="1"
                    strokeDasharray="3,3"
                  />
                )}
                
                {/* Hole label */}
                <text
                  x={centerX + (isThumbHole ? outerRadius + 30 : -outerRadius - 20)}
                  y={holeY + 5}
                  fontSize={isThumbHole ? "13" : "12"}
                  fill={isThumbHole ? "#d35400" : "#2c3e50"}
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {isThumbHole ? 'Thumb' : `${hole.hole}`}
                </text>
                
                {/* Position dimension line */}
                <line
                  x1={centerX + outerRadius + 40}
                  y1={startY}
                  x2={centerX + outerRadius + 40}
                  y2={holeY}
                  stroke="#666"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                
                {/* Position text */}
                <text
                  x={centerX + outerRadius + 50}
                  y={holeY + 3}
                  fontSize="10"
                  fill="#666"
                  textAnchor="start"
                >
                  {hole.position}mm
                </text>
                
                {/* Alternate position if available */}
                {hole.alternatePosition && (
                  <text
                    x={centerX + outerRadius + 50}
                    y={holeY + 15}
                    fontSize="9"
                    fill="#999"
                    textAnchor="start"
                  >
                    ({hole.alternatePosition}mm)
                  </text>
                )}
              </g>
            )
          })}
          
          {/* Front holes alignment indicator for traditional shakuhachi */}
          {type === 'traditional' && (
            <g>
              {/* Vertical line showing front holes are in straight line */}
              <line
                x1={centerX - 2}
                y1={startY + (holePositions.find(h => h.hole === 4)?.position || 0) * scale}
                x2={centerX - 2}
                y2={startY + (holePositions.find(h => h.hole === 1)?.position || 0) * scale}
                stroke="#3498db"
                strokeWidth="3"
                opacity="0.6"
              />
              
              {/* Label for front holes */}
              <text
                x={centerX - 35}
                y={startY + ((holePositions.find(h => h.hole === 4)?.position || 0) + 
                             (holePositions.find(h => h.hole === 1)?.position || 0)) * scale / 2}
                fontSize="10"
                fill="#3498db"
                textAnchor="middle"
                fontWeight="bold"
                transform={`rotate(-90, ${centerX - 35}, ${startY + ((holePositions.find(h => h.hole === 4)?.position || 0) + (holePositions.find(h => h.hole === 1)?.position || 0)) * scale / 2})`}
              >
                Front Holes (1-4)
              </text>
            </g>
          )}
          
          {/* Dimension lines */}
          {/* Total length */}
          <line
            x1={centerX - outerRadius - 60}
            y1={startY}
            x2={centerX - outerRadius - 60}
            y2={endY}
            stroke="#2c3e50"
            strokeWidth="2"
          />
          <line
            x1={centerX - outerRadius - 65}
            y1={startY}
            x2={centerX - outerRadius - 55}
            y2={startY}
            stroke="#2c3e50"
            strokeWidth="2"
          />
          <line
            x1={centerX - outerRadius - 65}
            y1={endY}
            x2={centerX - outerRadius - 55}
            y2={endY}
            stroke="#2c3e50"
            strokeWidth="2"
          />
          <text
            x={centerX - outerRadius - 80}
            y={(startY + endY) / 2}
            fontSize="12"
            fill="#2c3e50"
            textAnchor="middle"
            transform={`rotate(-90, ${centerX - outerRadius - 80}, ${(startY + endY) / 2})`}
            fontWeight="bold"
          >
            {fluteLength}mm
          </text>
          
          {/* Diameter indicators */}
          <line
            x1={centerX - outerRadius}
            y1={endY + 20}
            x2={centerX + outerRadius}
            y2={endY + 20}
            stroke="#e74c3c"
            strokeWidth="2"
          />
          <text
            x={centerX}
            y={endY + 35}
            fontSize="10"
            fill="#e74c3c"
            textAnchor="middle"
            fontWeight="bold"
          >
            Outer: {outerDiameter.toFixed(1)}mm
          </text>
          
          <line
            x1={centerX - boreRadius}
            y1={endY + 45}
            x2={centerX + boreRadius}
            y2={endY + 45}
            stroke="#3498db"
            strokeWidth="2"
          />
          <text
            x={centerX}
            y={endY + 60}
            fontSize="10"
            fill="#3498db"
            textAnchor="middle"
            fontWeight="bold"
          >
            Bore: {boreDiameter}mm
          </text>
          
          {/* Wall thickness indicator */}
          <line
            x1={centerX - outerRadius}
            y1={endY + 70}
            x2={centerX - boreRadius}
            y2={endY + 70}
            stroke="#9b59b6"
            strokeWidth="3"
          />
          <text
            x={centerX - (outerRadius + boreRadius) / 2}
            y={endY + 85}
            fontSize="10"
            fill="#9b59b6"
            textAnchor="middle"
            fontWeight="bold"
          >
            Wall: {wallThickness}mm
          </text>
          
          {/* Hole diameter indicator */}
          <circle
            cx={centerX + outerRadius + 100}
            cy={startY + 50}
            r={holeRadius}
            fill="none"
            stroke="#f39c12"
            strokeWidth="2"
          />
          <text
            x={centerX + outerRadius + 100}
            y={startY + 70}
            fontSize="10"
            fill="#f39c12"
            textAnchor="middle"
            fontWeight="bold"
          >
            Hole: {holeDiameter}mm
          </text>
        </svg>
        
        {/* Layout Legend for Traditional Shakuhachi */}
        {type === 'traditional' && (
          <div className="mt-2 p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div className="text-sm text-orange-800">
              <div className="font-semibold mb-1">Traditional Shakuhachi Layout:</div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-gray-700"></div>
                  <span>Holes 1-4: Front (straight line)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                  <span>Thumb Hole: Back (offset)</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Span information */}
        <div className="mt-4 grid grid-cols-6 gap-2 text-sm">
          <div className="text-center p-2 bg-red-50 rounded">
            <div className="font-semibold text-red-800">
              {type === 'traditional' ? 'Span 5-4' : 'Span 1-2'}
            </div>
            <div className="text-red-600">
              {type === 'traditional' ? (spans.span54 || 0) : (spans.span12 || 0)}mm
            </div>
          </div>
          <div className="text-center p-2 bg-orange-50 rounded">
            <div className="font-semibold text-orange-800">
              {type === 'traditional' ? 'Span 4-3' : 'Span 2-3'}
            </div>
            <div className="text-orange-600">
              {type === 'traditional' ? (spans.span43 || 0) : (spans.span23 || 0)}mm
            </div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded">
            <div className="font-semibold text-yellow-800">
              {type === 'traditional' ? 'Span 3-2' : 'Span 3-4'}
            </div>
            <div className="text-yellow-600">
              {type === 'traditional' ? (spans.span32 || 0) : (spans.span34 || 0)}mm
            </div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <div className="font-semibold text-green-800">
              {type === 'traditional' ? 'Span 2-1' : 'Span 4-5'}
            </div>
            <div className="text-green-600">
              {type === 'traditional' ? (spans.span21 || 0) : (spans.span45 || 0)}mm
            </div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <div className="font-semibold text-blue-800">
              {type === 'traditional' ? '' : 'Span 5-6'}
            </div>
            <div className="text-blue-600">
              {type === 'traditional' ? '' : `${spans.span56 || 0}mm`}
            </div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <div className="font-semibold text-purple-800">
              {type === 'traditional' ? '' : 'Span 6-7'}
            </div>
            <div className="text-purple-600">
              {type === 'traditional' ? '' : `${spans.span67 || 0}mm`}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

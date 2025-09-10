// Variation Shakuhachi Calculator JavaScript
// Based on the exact algorithms from the original React component

// Hole placement styles - EXACT percentages from VariationShakuhachiCalculator.tsx
// These are percentages from TOP of flute, not bottom!
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
};

// Global state
let currentParams = {
    length: 540,
    holeDiameter: 10,
    boreDiameter: 19,
    wallThickness: 4,
    ergonomicLimit: 60,
    temperature: 20,
    humidity: 50,
    aFrequency: 440,
    makerStyle: 'nelson-zink'
};

function calculateSpeedOfSound(temperature, humidity) {
    // More accurate speed of sound calculation from VariationShakuhachiCalculator
    // temperature in Celsius, relativeHumidity in percentage (0-100)
    
    // Convert temperature to Kelvin
    const T = temperature + 273.15;
    
    // Speed of sound in dry air (m/s)
    const speedDryAir = 331.3 * Math.sqrt(T / 273.15);
    
    // Humidity correction using enhanced formula
    // Saturation vapor pressure (Pascal) - Tetens formula
    const Psat = 611.2 * Math.exp(17.67 * temperature / (temperature + 243.5));
    
    // Actual vapor pressure
    const Pv = (humidity / 100) * Psat;
    
    // Atmospheric pressure (Pascal) - standard sea level
    const P = 101325;
    
    // Molar mass of dry air (kg/mol)
    const MdryAir = 0.028964;
    
    // Molar mass of water vapor (kg/mol)  
    const Mwater = 0.018016;
    
    // Mole fraction of water vapor
    const xv = Pv / P;
    
    // Effective molar mass of humid air
    const Mair = MdryAir * (1 - xv) + Mwater * xv;
    
    // Speed of sound in humid air
    // Uses the fact that humid air is less dense than dry air
    const speedHumidAir = speedDryAir * Math.sqrt(MdryAir / Mair);
    
    return speedHumidAir;
}

// Initialize the calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    const debugDiv = document.getElementById('debug-status');
    
    function updateDebug(message) {
        if (debugDiv) debugDiv.textContent = message;
        console.log(message);
    }
    
    updateDebug('DOM loaded, initializing calculator...');
    updateDebug('currentParams: ' + JSON.stringify(currentParams));
    
    try {
        initializeControls();
        updateDebug('Controls initialized');
        calculateAndUpdate();
        updateDebug('Initial calculation completed - Check results below');
    } catch (error) {
        updateDebug('Initialization error: ' + error.message);
        console.error('Initialization error:', error);
    }
});

function initializeControls() {
    // Connect all sliders and inputs
    const controls = [
        { id: 'length', param: 'length' },
        { id: 'hole-diameter', param: 'holeDiameter' },
        { id: 'bore-diameter', param: 'boreDiameter' },
        { id: 'wall-thickness', param: 'wallThickness' },
        { id: 'ergonomic-limit', param: 'ergonomicLimit' },
        { id: 'temperature', param: 'temperature' },
        { id: 'humidity', param: 'humidity' },
        { id: 'a-frequency', param: 'aFrequency' }
    ];

    controls.forEach(control => {
        const slider = document.getElementById(`${control.id}-slider`);
        const input = document.getElementById(`${control.id}-input`);
        const value = document.getElementById(`${control.id}-value`);

        if (!slider || !input || !value) {
            console.error(`Missing elements for ${control.id}`);
            return;
        }

        // Sync slider with input
        slider.addEventListener('input', function() {
            const val = parseFloat(this.value);
            input.value = val;
            value.textContent = val;
            currentParams[control.param] = val;
            calculateAndUpdate();
        });

        // Sync input with slider
        input.addEventListener('input', function() {
            const val = parseFloat(this.value);
            if (!isNaN(val)) {
                slider.value = val;
                value.textContent = val;
                currentParams[control.param] = val;
                calculateAndUpdate();
            }
        });
    });

    // Maker style selector
    const makerSelect = document.getElementById('maker-style');
    if (makerSelect) {
        makerSelect.addEventListener('change', function() {
            currentParams.makerStyle = this.value;
            calculateAndUpdate();
        });
    }
}

function updateParam(paramName, value) {
    // Convert hyphenated names to camelCase and map to correct property names
    let mappedName = paramName;
    if (paramName === 'holeDiameter') mappedName = 'holeDiameter';
    else if (paramName === 'boreDiameter') mappedName = 'boreDiameter';
    else if (paramName === 'wallThickness') mappedName = 'wallThickness';
    else if (paramName === 'ergonomicLimit') mappedName = 'ergonomicLimit';
    else if (paramName === 'aFrequency') mappedName = 'aFrequency';
    
    currentParams[mappedName] = value;
    calculateAndUpdate();
}

function calculateAndUpdate() {
    try {
        console.log('Calculating with params:', currentParams);
        const results = calculateShakuhachi(currentParams);
        console.log('Calculation results:', results);
        updateResults(results);
        updateComparisonTable();
        updateDiagram(results);
    } catch (error) {
        console.error('Calculation error:', error);
        const resultsDiv = document.getElementById('results');
        if (resultsDiv) {
            resultsDiv.innerHTML = `<div style="color: red;">Error: ${error.message}</div>`;
        }
    }
}

function calculateShakuhachi(params) {
    const {
        length,
        holeDiameter,
        boreDiameter,
        wallThickness,
        ergonomicLimit,
        temperature,
        humidity,
        aFrequency,
        makerStyle
    } = params;

    // Base note calculation (same as original)
    const baseNote = 156521.0 / length;
    
    // Calculate speed of sound with temperature and humidity correction
    const speedOfSound = calculateSpeedOfSound(temperature, humidity);
    
    // Get hole placement style
    const style = HOLE_PLACEMENT_STYLES[makerStyle];
    if (!style) {
        throw new Error(`Unknown maker style: ${makerStyle}`);
    }

    // Calculate hole positions based on percentage of flute length FROM TOP
    const HoleLocations = [];
    
    // Array of percentages in order: [hole1, hole2, hole3, hole4, thumb]
    const percentages = [style.hole1, style.hole2, style.hole3, style.hole4, style.thumb];
    
    // Convert percentages to actual positions (from top of flute) with special adjustments for Kodama formulas
    for (let i = 0; i < percentages.length; i++) {
        let position = Math.round(length * percentages[i]);
        
        // Apply special adjustments for Kodama formulas
        if (makerStyle === 'kodama-youtube1') {
            if (i === 1) { // hole2: 0.679*L - 1mm
                position = position - 1;
            } else if (i === 3) { // hole4: 0.479*L - 2.5mm
                position = position - 2.5;
            } else if (i === 4) { // thumb: 0.404*L - 2.5mm
                position = position - 2.5;
            }
        } else if (makerStyle === 'kodama-hoian2') {
            if (i === 2) { // hole3: 0.579*L + 1mm
                position = position + 1;
            } else if (i === 3) { // hole4: 0.479*L - 1mm
                position = position - 1;
            } else if (i === 4) { // thumb: 0.394*L - 1mm
                position = position - 1;
            }
        }
        
        HoleLocations.push(Math.round(position));
    }

    // Reverse to get traditional order: [thumb, hole4, hole3, hole2, hole1]
    HoleLocations.reverse();

    // Build hole positions object with frequencies
    const holes = {
        thumb: null,
        hole4: null,
        hole3: null,
        hole2: null,
        hole1: null
    };
    
    const holeNames = ['thumb', 'hole4', 'hole3', 'hole2', 'hole1'];
    
    for (let i = 0; i < HoleLocations.length; i++) {
        const holeName = holeNames[i];
        const holePos = HoleLocations[i];
        const shakuhachiHoleNumber = i === 0 ? 5 : (5 - i);
        
        // Calculate actual frequency based on hole position and physical parameters
        const holeFrequency = calculateHoleFrequency(
            holePos, 
            holeDiameter, 
            boreDiameter, 
            length, 
            wallThickness,
            temperature,
            humidity
        );
        
        // Calculate percentage from top
        const percentage = (holePos / length) * 100;
        
        holes[holeName] = {
            position: holePos,
            percentage: percentage,
            frequency: Math.round(holeFrequency * 100) / 100,
            note: frequencyToNote(holeFrequency, aFrequency),
            holeNumber: shakuhachiHoleNumber
        };
    }

    // Calculate spans between holes
    const spans = calculateSpans(holes);
    
    // Check ergonomic constraints
    const ergonomics = checkErgonomics(holes, ergonomicLimit);

    return {
        baseNote,
        speedOfSound,
        holes,
        spans,
        ergonomics,
        totalLength: length,
        holeDiameter,
        boreDiameter,
        wallThickness,
        makerStyle
    };
}

function calculateHoleFrequency(holePosition, holeDiameter, boreDiameter, fluteLength, wallThickness, temperature = 20, relativeHumidity = 50) {
    // More accurate acoustic calculation from VariationShakuhachiCalculator
    // This considers the effective length of the air column when the hole is open
    
    // Speed of sound in air at specified temperature and humidity
    const speedOfSound = calculateSpeedOfSound(temperature, relativeHumidity);
    
    // Convert mm to meters for calculations
    const L = fluteLength / 1000; // Total length in meters
    const holePos = holePosition / 1000; // Hole position from top in meters
    const holeDiam = holeDiameter / 1000; // Hole diameter in meters
    const boreDiam = boreDiameter / 1000; // Bore diameter in meters
    const wallThick = wallThickness / 1000; // Wall thickness in meters
    
    // Effective length when hole is open (distance from mouthpiece to hole)
    const effectiveLength = holePos;
    
    // End correction for open hole (accounts for radiation impedance)
    // This is a simplified model - real calculation would be more complex
    const endCorrection = 0.6 * holeDiam + (wallThick * 0.5);
    
    // Effective acoustic length
    const acousticLength = effectiveLength + endCorrection;
    
    // Hole impedance factor (affects how much the hole "shortens" the tube)
    // Larger holes have lower impedance and are more effective at stopping the air column
    const holeArea = Math.PI * (holeDiam / 2) ** 2;
    const boreArea = Math.PI * (boreDiam / 2) ** 2;
    const areaRatio = holeArea / boreArea;
    
    // Impedance correction factor (empirical model)
    // This accounts for the fact that small holes don't completely "stop" the air column
    const impedanceFactor = 1 - Math.exp(-3 * areaRatio);
    
    // Effective length with impedance correction
    const correctedLength = acousticLength * (1 + (1 - impedanceFactor) * 0.3);
    
    // Fundamental frequency for open tube (hole acts as open end)
    // f = v / (2 * L_eff) for fundamental mode
    const frequency = speedOfSound / (2 * correctedLength);
    
    return frequency;
}

function calculateSpans(holes) {
    // Calculate spans using the correct hole ordering: thumb, hole4, hole3, hole2, hole1
    const positions = {
        thumb: holes.thumb.position,
        hole1: holes.hole1.position,
        hole2: holes.hole2.position,
        hole3: holes.hole3.position,
        hole4: holes.hole4.position
    };

    return {
        // Adjacent spans (traditional shakuhachi numbering)
        'span5-4': Math.abs(positions.thumb - positions.hole4), // Thumb (5) to Hole 4
        'span4-3': Math.abs(positions.hole4 - positions.hole3), // Hole 4 to Hole 3
        'span3-2': Math.abs(positions.hole3 - positions.hole2), // Hole 3 to Hole 2
        'span2-1': Math.abs(positions.hole2 - positions.hole1), // Hole 2 to Hole 1
        
        // Non-adjacent spans
        'span5-3': Math.abs(positions.thumb - positions.hole3), // Thumb to Hole 3
        'span5-2': Math.abs(positions.thumb - positions.hole2), // Thumb to Hole 2
        'span5-1': Math.abs(positions.thumb - positions.hole1), // Thumb to Hole 1
        'span4-2': Math.abs(positions.hole4 - positions.hole2), // Hole 4 to Hole 2
        'span4-1': Math.abs(positions.hole4 - positions.hole1), // Hole 4 to Hole 1
        'span3-1': Math.abs(positions.hole3 - positions.hole1)  // Hole 3 to Hole 1
    };
}

function checkErgonomics(holes, limit) {
    const ergonomics = {};
    const holeNames = ['thumb', 'hole1', 'hole2', 'hole3', 'hole4'];
    
    holeNames.forEach(hole => {
        const spans = calculateSpansForHole(holes, hole);
        const maxSpan = Math.max(...Object.values(spans));
        ergonomics[hole] = {
            maxSpan,
            withinLimit: maxSpan <= limit,
            spans
        };
    });
    
    return ergonomics;
}

function calculateSpansForHole(holes, targetHole) {
    const spans = {};
    const holeNames = ['thumb', 'hole1', 'hole2', 'hole3', 'hole4'];
    
    holeNames.forEach(hole => {
        if (hole !== targetHole) {
            spans[hole] = Math.abs(holes[targetHole].position - holes[hole].position);
        }
    });
    
    return spans;
}

function frequencyToNote(frequency, aFrequency = 440) {
    const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    
    // Calculate the number of semitones from A4
    const semitonesFromA4 = 12 * Math.log2(frequency / aFrequency);
    
    // A4 is at MIDI note 69
    const midiNote = 69 + semitonesFromA4;
    const octave = Math.floor(midiNote / 12) - 1;
    const noteIndex = Math.round(midiNote) % 12;
    
    return noteNames[noteIndex] + octave;
}

function updateResults(results) {
    const resultsDiv = document.getElementById('results');
    
    if (!results || !results.holes) {
        resultsDiv.innerHTML = '<div style="color: red;">No calculation results available</div>';
        return;
    }

    // Check if all holes exist
    const requiredHoles = ['thumb', 'hole4', 'hole3', 'hole2', 'hole1'];
    for (const hole of requiredHoles) {
        if (!results.holes[hole]) {
            resultsDiv.innerHTML = `<div style="color: red;">Missing hole data: ${hole}</div>`;
            return;
        }
    }
    
    const html = `
        <div class="result-item">
            <span class="result-label">Base Note (D)</span>
            <span class="result-value">${results.baseNote.toFixed(2)} Hz</span>
        </div>
        <div class="result-item">
            <span class="result-label">Speed of Sound</span>
            <span class="result-value">${results.speedOfSound.toFixed(1)} m/s</span>
        </div>
        <div class="result-item">
            <span class="result-label">Aspect Ratio</span>
            <span class="result-value">${(results.totalLength / results.boreDiameter).toFixed(2)}</span>
        </div>
        <div class="result-item">
            <span class="result-label">Maker Style</span>
            <span class="result-value">${getMakerStyleName(results.makerStyle)}</span>
        </div>
        
        <div class="holes-section">
            <div class="holes-title">Hole Positions & Frequencies</div>
            
            <div class="hole-item">
                <span class="hole-number">Hole 5 (T)</span>
                <div class="hole-details">
                    <div class="hole-position">${results.holes.thumb.position.toFixed(1)} mm from top</div>
                    <div class="hole-note">${results.holes.thumb.percentage.toFixed(2)}% - ${results.holes.thumb.note} (${results.holes.thumb.frequency.toFixed(1)} Hz)</div>
                </div>
            </div>
            
            <div class="hole-item">
                <span class="hole-number">Hole 4</span>
                <div class="hole-details">
                    <div class="hole-position">${results.holes.hole4.position.toFixed(1)} mm from top</div>
                    <div class="hole-note">${results.holes.hole4.percentage.toFixed(2)}% - ${results.holes.hole4.note} (${results.holes.hole4.frequency.toFixed(1)} Hz)</div>
                </div>
            </div>
            
            <div class="hole-item">
                <span class="hole-number">Hole 3</span>
                <div class="hole-details">
                    <div class="hole-position">${results.holes.hole3.position.toFixed(1)} mm from top</div>
                    <div class="hole-note">${results.holes.hole3.percentage.toFixed(2)}% - ${results.holes.hole3.note} (${results.holes.hole3.frequency.toFixed(1)} Hz)</div>
                </div>
            </div>
            
            <div class="hole-item">
                <span class="hole-number">Hole 2</span>
                <div class="hole-details">
                    <div class="hole-position">${results.holes.hole2.position.toFixed(1)} mm from top</div>
                    <div class="hole-note">${results.holes.hole2.percentage.toFixed(2)}% - ${results.holes.hole2.note} (${results.holes.hole2.frequency.toFixed(1)} Hz)</div>
                </div>
            </div>
            
            <div class="hole-item">
                <span class="hole-number">Hole 1</span>
                <div class="hole-details">
                    <div class="hole-position">${results.holes.hole1.position.toFixed(1)} mm from top</div>
                    <div class="hole-note">${results.holes.hole1.percentage.toFixed(2)}% - ${results.holes.hole1.note} (${results.holes.hole1.frequency.toFixed(1)} Hz)</div>
                </div>
            </div>
        </div>
        
        <div class="spans-section">
            <div class="holes-title">Hole Spans</div>
            <div class="spans-grid">
                <div class="span-item">
                    <div class="span-label">5-4</div>
                    <div class="span-value">${results.spans['span5-4'].toFixed(1)} mm</div>
                </div>
                <div class="span-item">
                    <div class="span-label">4-3</div>
                    <div class="span-value">${results.spans['span4-3'].toFixed(1)} mm</div>
                </div>
                <div class="span-item">
                    <div class="span-label">3-2</div>
                    <div class="span-value">${results.spans['span3-2'].toFixed(1)} mm</div>
                </div>
                <div class="span-item">
                    <div class="span-label">2-1</div>
                    <div class="span-value">${results.spans['span2-1'].toFixed(1)} mm</div>
                </div>
                <div class="span-item">
                    <div class="span-label">5-3</div>
                    <div class="span-value">${results.spans['span5-3'].toFixed(1)} mm</div>
                </div>
                <div class="span-item">
                    <div class="span-label">5-2</div>
                    <div class="span-value">${results.spans['span5-2'].toFixed(1)} mm</div>
                </div>
                <div class="span-item">
                    <div class="span-label">5-1</div>
                    <div class="span-value">${results.spans['span5-1'].toFixed(1)} mm</div>
                </div>
                <div class="span-item">
                    <div class="span-label">4-2</div>
                    <div class="span-value">${results.spans['span4-2'].toFixed(1)} mm</div>
                </div>
                <div class="span-item">
                    <div class="span-label">4-1</div>
                    <div class="span-value">${results.spans['span4-1'].toFixed(1)} mm</div>
                </div>
                <div class="span-item">
                    <div class="span-label">3-1</div>
                    <div class="span-value">${results.spans['span3-1'].toFixed(1)} mm</div>
                </div>
            </div>
        </div>
    `;
    
    resultsDiv.innerHTML = html;
}

function getMakerStyleName(styleKey) {
    return HOLE_PLACEMENT_STYLES[styleKey]?.name || styleKey;
}

function getStandardFrequencies(baseFrequency, aFrequency) {
    // Calculate theoretical standard frequencies based on musical note relationships
    // This is pure music theory - no environmental factors (temperature/humidity)
    
    // Traditional shakuhachi tuning: +3, +5, +7, +10, +12 semitones from base
    const semitonesToAdd = [3, 5, 7, 10, 12]; // [Hole1, Hole2, Hole3, Hole4, Hole5/Thumb]
    
    // Simply add semitones to the base frequency using equal temperament
    // This maintains the correct octave relationship
    return semitonesToAdd.map(semitones => {
        const frequency = baseFrequency * Math.pow(2, semitones / 12);
        const noteName = frequencyToNote(frequency, aFrequency);
        return {
            frequency: Math.round(frequency * 100) / 100,
            noteName: noteName
        };
    });
}

function updateComparisonTable() {
    const table = document.getElementById('comparison-table');
    
    // Calculate results for all styles
    const allResults = {};
    Object.keys(HOLE_PLACEMENT_STYLES).forEach(style => {
        const tempParams = { ...currentParams, makerStyle: style };
        allResults[style] = calculateShakuhachi(tempParams);
    });
    
    const baseNote = 156521.0 / currentParams.length;
    const standardFreqs = getStandardFrequencies(baseNote, currentParams.aFrequency);
    
    const html = `
        <thead>
            <tr class="bg-gray-50">
                <th class="border border-gray-300 px-3 py-2 text-left text-xs font-medium text-gray-700">Style</th>
                <th class="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Standard A=${currentParams.aFrequency}<br/>
                    <span class="font-normal text-gray-500">(Base + Holes Hz)</span>
                </th>
                <th class="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Hole #1<br/>
                    <span class="font-normal text-gray-500">(mm / Hz)</span>
                </th>
                <th class="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Hole #2<br/>
                    <span class="font-normal text-gray-500">(mm / Hz)</span>
                </th>
                <th class="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Hole #3<br/>
                    <span class="font-normal text-gray-500">(mm / Hz)</span>
                </th>
                <th class="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Hole #4<br/>
                    <span class="font-normal text-gray-500">(mm / Hz)</span>
                </th>
                <th class="border border-gray-300 px-3 py-2 text-center text-xs font-medium text-gray-700">
                    Hole #5 (Thumb)<br/>
                    <span class="font-normal text-gray-500">(mm / Hz)</span>
                </th>
            </tr>
        </thead>
        <tbody>
            ${Object.keys(HOLE_PLACEMENT_STYLES).map((style, index) => {
                const result = allResults[style];
                const styleName = HOLE_PLACEMENT_STYLES[style].name;
                const isCurrentStyle = style === currentParams.makerStyle;
                const rowClass = index % 2 === 0 ? 'bg-white' : 'bg-gray-25';
                
                return `
                    <tr class="${rowClass}">
                        <td class="border border-gray-300 px-3 py-2 text-xs font-medium ${
                            isCurrentStyle ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                        }">
                            ${styleName}
                            ${isCurrentStyle ? '<span class="ml-2 text-blue-600">★</span>' : ''}
                        </td>
                        <td class="border border-gray-300 px-2 py-2 text-center text-xs text-gray-700">
                            <div style="line-height: 1.2;">
                                <div>${standardFreqs[0].noteName}: ${standardFreqs[0].frequency}Hz</div>
                                <div>${standardFreqs[1].noteName}: ${standardFreqs[1].frequency}Hz</div>
                                <div>${standardFreqs[2].noteName}: ${standardFreqs[2].frequency}Hz</div>
                                <div>${standardFreqs[3].noteName}: ${standardFreqs[3].frequency}Hz</div>
                                <div>${standardFreqs[4].noteName}: ${standardFreqs[4].frequency}Hz</div>
                            </div>
                        </td>
                        <td class="border border-gray-300 px-2 py-2 text-center text-xs text-gray-700">
                            <div>${result.holes.hole1.position.toFixed(0)}mm</div>
                            <div class="text-gray-500">${result.holes.hole1.frequency.toFixed(0)}Hz</div>
                        </td>
                        <td class="border border-gray-300 px-2 py-2 text-center text-xs text-gray-700">
                            <div>${result.holes.hole2.position.toFixed(0)}mm</div>
                            <div class="text-gray-500">${result.holes.hole2.frequency.toFixed(0)}Hz</div>
                        </td>
                        <td class="border border-gray-300 px-2 py-2 text-center text-xs text-gray-700">
                            <div>${result.holes.hole3.position.toFixed(0)}mm</div>
                            <div class="text-gray-500">${result.holes.hole3.frequency.toFixed(0)}Hz</div>
                        </td>
                        <td class="border border-gray-300 px-2 py-2 text-center text-xs text-gray-700">
                            <div>${result.holes.hole4.position.toFixed(0)}mm</div>
                            <div class="text-gray-500">${result.holes.hole4.frequency.toFixed(0)}Hz</div>
                        </td>
                        <td class="border border-gray-300 px-2 py-2 text-center text-xs text-gray-700">
                            <div>${result.holes.thumb.position.toFixed(0)}mm</div>
                            <div class="text-gray-500">${result.holes.thumb.frequency.toFixed(0)}Hz</div>
                        </td>
                    </tr>
                `;
            }).join('')}
        </tbody>
    `;
    
    table.innerHTML = html;
    
    // Update the note below the table
    const noteElement = document.getElementById('table-note');
    if (noteElement) {
        noteElement.innerHTML = `★ Currently selected style. All calculations use L = ${currentParams.length}mm flute length, A = ${currentParams.aFrequency}Hz, at ${currentParams.temperature}°C and ${currentParams.humidity}% humidity.`;
    }
}

function updateDiagram(results) {
    const svg = document.getElementById('flute-diagram');
    const svgWidth = 800;
    const svgHeight = 700; // Increased height for better spacing
    
    // Clear existing content
    svg.innerHTML = '';
    svg.setAttribute('height', svgHeight);
    
    // Calculate scale to fit flute in SVG
    const margin = 60; // Increased margin
    const availableWidth = svgWidth - 2 * margin;
    const scale = availableWidth / results.totalLength;
    
    // Flute dimensions
    const fluteY = svgHeight / 2 - 50; // Move flute up a bit
    const fluteWidth = results.totalLength * scale;
    const fluteHeight = results.boreDiameter * scale;
    const wallThickness = results.wallThickness * scale;
    
    // Draw flute body (outer)
    const fluteOuter = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fluteOuter.setAttribute('x', margin);
    fluteOuter.setAttribute('y', fluteY - fluteHeight/2 - wallThickness);
    fluteOuter.setAttribute('width', fluteWidth);
    fluteOuter.setAttribute('height', fluteHeight + 2 * wallThickness);
    fluteOuter.setAttribute('fill', '#8B4513');
    fluteOuter.setAttribute('stroke', '#5D2F0A');
    fluteOuter.setAttribute('stroke-width', '1');
    svg.appendChild(fluteOuter);
    
    // Draw flute bore (inner)
    const fluteBore = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    fluteBore.setAttribute('x', margin);
    fluteBore.setAttribute('y', fluteY - fluteHeight/2);
    fluteBore.setAttribute('width', fluteWidth);
    fluteBore.setAttribute('height', fluteHeight);
    fluteBore.setAttribute('fill', '#F5F5DC');
    fluteBore.setAttribute('stroke', '#D2B48C');
    fluteBore.setAttribute('stroke-width', '0.5');
    svg.appendChild(fluteBore);
    
    // Draw holes and their dimensions
    const holeRadius = (results.holeDiameter * scale) / 2;
    const holes = ['thumb', 'hole4', 'hole3', 'hole2', 'hole1'];
    const holeLabels = ['T', '4', '3', '2', '1'];
    
    holes.forEach((hole, index) => {
        const holePos = results.holes[hole].position;
        const x = margin + (holePos * scale);
        
        // Draw hole
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', fluteY);
        circle.setAttribute('r', holeRadius);
        circle.setAttribute('fill', '#2C2C2C');
        circle.setAttribute('stroke', '#000');
        circle.setAttribute('stroke-width', '0.5');
        svg.appendChild(circle);
        
        // Draw hole label above the flute
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', x);
        label.setAttribute('y', fluteY - fluteHeight/2 - wallThickness - 15);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-family', 'Arial, sans-serif');
        label.setAttribute('font-size', '14');
        label.setAttribute('font-weight', 'bold');
        label.setAttribute('fill', '#333');
        label.textContent = holeLabels[index];
        svg.appendChild(label);
        
        // Draw dimension line below the flute with better spacing
        const dimY = fluteY + fluteHeight/2 + wallThickness + 30 + (index * 25); // Stagger the dimension lines
        
        // Dimension line from left edge to hole
        const dimLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        dimLine.setAttribute('x1', margin);
        dimLine.setAttribute('y1', dimY);
        dimLine.setAttribute('x2', x);
        dimLine.setAttribute('y2', dimY);
        dimLine.setAttribute('stroke', '#666');
        dimLine.setAttribute('stroke-width', '1');
        svg.appendChild(dimLine);
        
        // Dimension arrows
        const arrow1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        arrow1.setAttribute('points', `${margin},${dimY-3} ${margin+6},${dimY} ${margin},${dimY+3}`);
        arrow1.setAttribute('fill', '#666');
        svg.appendChild(arrow1);
        
        const arrow2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
        arrow2.setAttribute('points', `${x},${dimY-3} ${x-6},${dimY} ${x},${dimY+3}`);
        arrow2.setAttribute('fill', '#666');
        svg.appendChild(arrow2);
        
        // Vertical guide lines from hole to dimension line
        const guideLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        guideLine.setAttribute('x1', x);
        guideLine.setAttribute('y1', fluteY + fluteHeight/2 + wallThickness + 5);
        guideLine.setAttribute('x2', x);
        guideLine.setAttribute('y2', dimY + 5);
        guideLine.setAttribute('stroke', '#ccc');
        guideLine.setAttribute('stroke-width', '1');
        guideLine.setAttribute('stroke-dasharray', '2,2');
        svg.appendChild(guideLine);
        
        // Dimension text with better positioning
        const dimText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        dimText.setAttribute('x', margin + (holePos * scale) / 2);
        dimText.setAttribute('y', dimY - 8);
        dimText.setAttribute('text-anchor', 'middle');
        dimText.setAttribute('font-family', 'Arial, sans-serif');
        dimText.setAttribute('font-size', '11');
        dimText.setAttribute('fill', '#333');
        dimText.textContent = `${holePos.toFixed(1)} mm`;
        svg.appendChild(dimText);
    });
    
    // Draw total length dimension at the bottom
    const totalDimY = fluteY + fluteHeight/2 + wallThickness + 180; // Much lower to avoid overlap
    
    const totalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    totalLine.setAttribute('x1', margin);
    totalLine.setAttribute('y1', totalDimY);
    totalLine.setAttribute('x2', margin + fluteWidth);
    totalLine.setAttribute('y2', totalDimY);
    totalLine.setAttribute('stroke', '#333');
    totalLine.setAttribute('stroke-width', '2');
    svg.appendChild(totalLine);
    
    const totalArrow1 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    totalArrow1.setAttribute('points', `${margin},${totalDimY-4} ${margin+8},${totalDimY} ${margin},${totalDimY+4}`);
    totalArrow1.setAttribute('fill', '#333');
    svg.appendChild(totalArrow1);
    
    const totalArrow2 = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    totalArrow2.setAttribute('points', `${margin + fluteWidth},${totalDimY-4} ${margin + fluteWidth - 8},${totalDimY} ${margin + fluteWidth},${totalDimY+4}`);
    totalArrow2.setAttribute('fill', '#333');
    svg.appendChild(totalArrow2);
    
    const totalText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    totalText.setAttribute('x', margin + fluteWidth / 2);
    totalText.setAttribute('y', totalDimY - 10);
    totalText.setAttribute('text-anchor', 'middle');
    totalText.setAttribute('font-family', 'Arial, sans-serif');
    totalText.setAttribute('font-size', '14');
    totalText.setAttribute('font-weight', 'bold');
    totalText.setAttribute('fill', '#333');
    totalText.textContent = `Total Length: ${results.totalLength} mm`;
    svg.appendChild(totalText);
    
    // Add title
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', svgWidth / 2);
    title.setAttribute('y', 30);
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-family', 'Arial, sans-serif');
    title.setAttribute('font-size', '16');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', '#333');
    title.textContent = `${getMakerStyleName(results.makerStyle)} - Hole Placement Diagram`;
    svg.appendChild(title);
}

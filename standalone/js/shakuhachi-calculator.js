// Advanced Shakuhachi Calculator with Multiple Maker Styles

class AdvancedShakuhachiCalculator {
    constructor() {
        this.makerStyles = {
            'yokoyama': {
                name: 'Yokoyama',
                proportions: [0.778, 0.708, 0.625, 0.556, 0.444],
                thumbHole: 0.542,
                description: 'Traditional proportions with acoustic analysis'
            },
            'kinko': {
                name: 'Kinko Ryu',
                proportions: [0.780, 0.710, 0.630, 0.560, 0.450],
                thumbHole: 0.545,
                description: 'Kinko school traditional proportions'
            },
            'meian': {
                name: 'Meian',
                proportions: [0.775, 0.705, 0.620, 0.555, 0.445],
                thumbHole: 0.540,
                description: 'Meian school refined proportions'
            },
            'tozan': {
                name: 'Tozan',
                proportions: [0.785, 0.715, 0.635, 0.565, 0.455],
                thumbHole: 0.550,
                description: 'Tozan school techniques'
            },
            'koten': {
                name: 'Koten',
                proportions: [0.772, 0.702, 0.618, 0.548, 0.438],
                thumbHole: 0.535,
                description: 'Ancient traditional style'
            },
            'jinashi': {
                name: 'Jinashi',
                proportions: [0.790, 0.720, 0.640, 0.570, 0.460],
                thumbHole: 0.555,
                description: 'Natural bamboo style'
            },
            'modern': {
                name: 'Modern',
                proportions: [0.776, 0.706, 0.626, 0.556, 0.446],
                thumbHole: 0.543,
                description: 'Contemporary optimized proportions'
            },
            'traditional': {
                name: 'Traditional',
                proportions: [0.774, 0.704, 0.624, 0.554, 0.444],
                thumbHole: 0.541,
                description: 'Classical traditional proportions'
            }
        };
        
        this.traditionalNotes = ['Ro', 'Tsu', 'Re', 'Chi', 'Ri'];
        this.noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    }

    // Enhanced speed of sound calculation
    calculateSpeedOfSound(temperature = 20, humidity = 50) {
        // More accurate formula considering molecular effects
        const tempKelvin = temperature + 273.15;
        const tempEffect = 331.4 * Math.sqrt(tempKelvin / 273.15);
        
        // Humidity correction (approximate)
        const humidityCorrection = 1 + 0.0016 * (humidity / 100);
        
        return tempEffect * humidityCorrection;
    }

    // Calculate fundamental frequency with end correction
    calculateFundamentalFrequency(length, boreDiameter, speedOfSound = 343) {
        // End correction for open tube
        const endCorrection = 0.61 * boreDiameter;
        const effectiveLength = (length + endCorrection) / 1000; // Convert to meters
        
        // Basic open tube formula: f = v / (2 * L)
        return speedOfSound / (2 * effectiveLength);
    }

    // Enhanced note identification with custom A4 frequency
    getNoteName(frequency, aFrequency = 440) {
        // Calculate semitones from A4
        const semitones = Math.round(12 * Math.log2(frequency / aFrequency));
        const noteIndex = (9 + semitones) % 12; // A is at index 9
        const octave = Math.floor((9 + semitones) / 12) + 4;
        
        const noteName = this.noteNames[noteIndex];
        return noteName + octave;
    }

    // Calculate cents deviation from equal temperament
    calculateCentsDeviation(frequency, aFrequency = 440) {
        const semitones = 12 * Math.log2(frequency / aFrequency);
        const nearestSemitone = Math.round(semitones);
        const cents = Math.round((semitones - nearestSemitone) * 100);
        return cents;
    }

    // Calculate hole position with end effects and ergonomics
    calculateHolePosition(fluteLength, targetFrequency, boreDiameter, holeDiameter, wallThickness) {
        const speedOfSound = this.calculateSpeedOfSound();
        
        // Basic calculation for effective length needed
        const endCorrection = 0.61 * boreDiameter;
        const targetLength = speedOfSound / (2 * targetFrequency) * 1000 - endCorrection;
        
        // Hole correction factor (accounts for hole size and wall thickness)
        const holeCorrection = this.calculateHoleCorrection(holeDiameter, boreDiameter, wallThickness);
        
        // Position from end of flute
        const positionFromEnd = targetLength + holeCorrection;
        const positionFromTop = fluteLength - positionFromEnd;
        
        return Math.max(0, positionFromTop);
    }

    // Hole correction calculation
    calculateHoleCorrection(holeDiameter, boreDiameter, wallThickness) {
        // Approximate correction based on hole size relative to bore
        const holeRatio = holeDiameter / boreDiameter;
        const wallRatio = wallThickness / boreDiameter;
        
        // Empirical correction formula
        const correction = holeDiameter * (0.3 + 0.8 * holeRatio + 0.2 * wallRatio);
        return correction;
    }

    // Check ergonomic feasibility
    checkErgonomics(holePositions, ergonomicLimit = 50) {
        const spans = [];
        const warnings = [];
        
        for (let i = 0; i < holePositions.length - 1; i++) {
            const span = Math.abs(holePositions[i] - holePositions[i + 1]);
            spans.push(span);
            
            if (span > ergonomicLimit) {
                warnings.push(`Span between holes ${i + 1} and ${i + 2}: ${span.toFixed(1)}mm (exceeds ${ergonomicLimit}mm limit)`);
            }
        }
        
        return { spans, warnings };
    }

    // Calculate aspect ratio
    calculateAspectRatio(fluteLength, boreDiameter) {
        return fluteLength / boreDiameter;
    }

    // Main calculation function
    calculate(params) {
        const {
            fluteLength = 550,
            holeDiameter = 8,
            boreDiameter = 19,
            wallThickness = 3,
            ergonomicLimit = 50,
            calculationStyle = 'nelson-zink',
            temperature = 20,
            relativeHumidity = 50,
            aFrequency = 440
        } = params;

        // Validate inputs
        const validation = this.validateInputs(params);
        if (!validation.isValid) {
            return { error: true, messages: validation.errors };
        }

        const speedOfSound = this.calculateSpeedOfSound(temperature, relativeHumidity);
        const fundamentalFreq = this.calculateFundamentalFrequency(fluteLength, boreDiameter, speedOfSound);
        const style = this.makerStyles[calculationStyle];
        
        if (!style) {
            return { error: true, messages: ['Invalid calculation style'] };
        }

        // Calculate hole positions using proportional method
        const holePositions = [];
        
        style.proportions.forEach((proportion, index) => {
            const position = fluteLength * proportion;
            const effectiveLength = fluteLength - position;
            const holeFreq = this.calculateFundamentalFrequency(effectiveLength, boreDiameter, speedOfSound);
            
            holePositions.push({
                hole: index + 1,
                position: Math.round(position * 10) / 10,
                frequency: Math.round(holeFreq * 100) / 100,
                noteName: this.getNoteName(holeFreq, aFrequency),
                traditionalName: this.traditionalNotes[index],
                cents: this.calculateCentsDeviation(holeFreq, aFrequency),
                error: false
            });
        });

        // Add thumb hole if present
        if (style.thumbHole) {
            const thumbPosition = fluteLength * style.thumbHole;
            const thumbEffectiveLength = fluteLength - thumbPosition;
            const thumbFreq = this.calculateFundamentalFrequency(thumbEffectiveLength, boreDiameter, speedOfSound);
            
            holePositions.push({
                hole: 'T',
                position: Math.round(thumbPosition * 10) / 10,
                frequency: Math.round(thumbFreq * 100) / 100,
                noteName: this.getNoteName(thumbFreq, aFrequency),
                traditionalName: 'Thumb',
                cents: this.calculateCentsDeviation(thumbFreq, aFrequency),
                error: false
            });
        }

        // Calculate ergonomic analysis
        const holePos = holePositions.slice(0, 5).map(h => h.position);
        const ergonomics = this.checkErgonomics(holePos, ergonomicLimit);
        
        // Calculate spans between holes
        const spans = {};
        for (let i = 0; i < 4; i++) {
            const spanKey = `span${5-i}${4-i}`;
            spans[spanKey] = Math.round((holePos[i] - holePos[i + 1]) * 10) / 10;
        }

        return {
            error: false,
            baseFrequency: Math.round(fundamentalFreq * 100) / 100,
            noteName: this.getNoteName(fundamentalFreq, aFrequency),
            shakuhachiLength: this.getShakuhachiLength(fluteLength),
            aspectRatio: Math.round(this.calculateAspectRatio(fluteLength, boreDiameter) * 10) / 10,
            holePositions,
            spans,
            ergonomics,
            style: style.name,
            styleKey: calculationStyle,
            parameters: params
        };
    }

    // Calculate all styles for comparison
    calculateAllStyles(params) {
        const results = [];
        
        Object.keys(this.makerStyles).forEach(styleKey => {
            const styleParams = { ...params, calculationStyle: styleKey };
            const result = this.calculate(styleParams);
            if (!result.error) {
                results.push({
                    ...result,
                    styleKey
                });
            }
        });
        
        return results;
    }

    // Convert length to traditional notation
    getShakuhachiLength(lengthMm) {
        const lengthShaku = lengthMm / 303.03; // 1 shaku = 303.03mm
        const shaku = Math.floor(lengthShaku);
        const sun = Math.round((lengthShaku - shaku) * 10);
        
        if (shaku === 1) {
            return `1 shaku ${sun} sun`;
        } else {
            return `${shaku} shaku ${sun} sun`;
        }
    }

    // Validate input parameters
    validateInputs(params) {
        const errors = [];
        
        if (params.fluteLength < 300 || params.fluteLength > 1300) {
            errors.push('Flute length must be between 300-1300mm');
        }
        
        if (params.holeDiameter < 5 || params.holeDiameter > 30) {
            errors.push('Hole diameter must be between 5-30mm');
        }
        
        if (params.boreDiameter < 10 || params.boreDiameter > 100) {
            errors.push('Bore diameter must be between 10-100mm');
        }
        
        if (params.wallThickness < 1 || params.wallThickness > 10) {
            errors.push('Wall thickness must be between 1-10mm');
        }
        
        if (params.temperature < -10 || params.temperature > 50) {
            errors.push('Temperature must be between -10°C and 50°C');
        }
        
        if (params.relativeHumidity < 0 || params.relativeHumidity > 100) {
            errors.push('Humidity must be between 0-100%');
        }
        
        if (params.aFrequency < 420 || params.aFrequency > 460) {
            errors.push('A4 frequency must be between 420-460Hz');
        }
        
        return {
            isValid: errors.length === 0,
            errors
        };
    }

    // Generate flute diagram data
    generateDiagramData(results) {
        if (results.error) return null;
        
        const fluteLength = results.parameters.fluteLength;
        const boreDiameter = results.parameters.boreDiameter;
        
        return {
            fluteLength,
            boreDiameter,
            holes: results.holePositions.map(hole => ({
                position: hole.position,
                diameter: hole.hole === 'T' ? 6 : results.parameters.holeDiameter,
                label: hole.hole.toString(),
                note: hole.noteName,
                frequency: hole.frequency,
                isThumbHole: hole.hole === 'T'
            }))
        };
    }

    // Get maker style information
    getStyleInfo(styleKey) {
        return this.makerStyles[styleKey] || null;
    }

    // Get all available styles
    getAllStyles() {
        return Object.keys(this.makerStyles).map(key => ({
            key,
            ...this.makerStyles[key]
        }));
    }

    // Wrapper methods for compatibility with app.js
    calculateFiveHole(length, wallThickness = 3, endCorrection = 0.6, makerStyle = 'traditional') {
        const params = {
            fluteLength: length,
            wallThickness: wallThickness,
            endCorrection: endCorrection,
            makerStyle: makerStyle,
            boreDiameter: 19, // Default bore for 5-hole
            holeDiameter: 8,
            temperature: 20,
            humidity: 50,
            aFrequency: 440,
            ergonomicLimit: 50
        };
        return this.calculate(params);
    }

    calculateTraditional(length, wallThickness = 3, endCorrection = 0.6, makerStyle = 'traditional') {
        const params = {
            fluteLength: length,
            wallThickness: wallThickness,
            endCorrection: endCorrection,
            makerStyle: makerStyle,
            boreDiameter: 19, // Default bore for traditional
            holeDiameter: 8,
            temperature: 20,
            humidity: 50,
            aFrequency: 440,
            ergonomicLimit: 50
        };
        return this.calculate(params);
    }
}

// Export for global use
window.AdvancedShakuhachiCalculator = AdvancedShakuhachiCalculator;

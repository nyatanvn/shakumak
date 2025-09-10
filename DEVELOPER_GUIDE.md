# Shakuhachi Calculator - Developer Documentation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Structure](#architecture--structure)
3. [Formula & Logic Customization](#formula--logic-customization)
4. [Styling & UI Customization](#styling--ui-customization)
5. [Development Workflow](#development-workflow)
6. [Testing Guidelines](#testing-guidelines)
7. [Debugging Guide](#debugging-guide)
8. [GitHub Upload & Version Control](#github-upload--version-control)
9. [Deployment Guide](#deployment-guide)
10. [Troubleshooting](#troubleshooting)

---

## 🏗️ Project Overview

### Technology Stack
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x
- **UI Library**: React 19.x
- **Audio**: Tone.js 15.x
- **Additional**: Bootstrap 5.x, rc-slider 11.x

### Project Purpose
A comprehensive web application for:
- **Shakuhachi Calculation**: Multiple algorithms for hole positioning
- **Acoustic Analysis**: Physics-based calculations with environmental factors
- **Metronome Integration**: Professional practice tool with multiple modes
- **Educational Tool**: Comparison of different maker styles and techniques

---

## 📁 Architecture & Structure

### Project Statistics & Language Breakdown

#### **Codebase Composition (8,732 total lines)**
- **TypeScript/TSX**: 75.2% (6,568 lines)
  - Shakuhachi Calculators: 3,759 lines
  - Acoustic Analysis: 2,153 lines  
  - Diagrams & Visualizations: 402 lines
  - App Structure: 127 lines
- **JavaScript/JSX**: 24.8% (2,164 lines)
  - Metronome System: 2,164 lines
- **CSS Styling**: 1,784 lines
  - Tailwind Global: 26 lines
  - Metro Component Styles: 432 lines
  - Standalone Styles: 1,050 lines
  - Bootstrap Integration: 276 lines

#### **Critical Dependencies & Versions**
- **Core Framework**: Next.js 15.5.2 with React 19.1.0
- **Audio Engine**: Tone.js 15.1.22 (Web Audio API)
- **UI Components**: Bootstrap 5.3.8 + Reactstrap 9.2.3
- **Styling**: Tailwind CSS 4.x + PostCSS
- **Interactive Controls**: rc-slider 11.1.8
- **Mathematics**: regression 2.0.1 (statistical analysis)
- **Event Handling**: react-keyboard-event-handler 1.5.4
- **Development**: TypeScript 5.x, ESLint 9.x

### Directory Structure
```
shakumak/                       # 8,732 lines total codebase
├── .github/                    # GitHub workflows and templates
│   └── copilot-instructions.md
├── .next/                      # Next.js build output (auto-generated)
├── .vscode/                    # VS Code configuration
├── public/                     # Static assets
│   ├── audio/                  # Sound files for metronome (5 instrument sets)
│   │   ├── basicdrumkit/       # Kick, Snare, ClosedHat, OpenHat
│   │   ├── electrokit/         # Electronic drum sounds
│   │   ├── metronome/          # tap.wav, down.wav, up.wav
│   │   ├── tabla/              # Traditional Indian percussion
│   │   └── yamaha_rx5/         # Professional drum machine samples
│   └── *.svg                   # Icon assets
├── src/                        # Source code (8,732 lines)
│   ├── app/                    # Next.js App Router (127 lines)
│   │   ├── favicon.ico
│   │   ├── globals.css         # Global styles (26 lines)
│   │   ├── layout.tsx          # Root layout (34 lines)
│   │   └── page.tsx            # Home page with tabs (93 lines)
│   ├── components/             # React components (8,605 lines)
│   │   ├── metro/              # Metronome system (2,164 lines)
│   │   │   ├── SoundMachine.jsx     # Core audio engine (453 lines)
│   │   │   ├── Planner.jsx          # Practice planning (386 lines)
│   │   │   ├── ModePanel.jsx        # Training modes (346 lines)
│   │   │   ├── PresetsManager.jsx   # Preset management (279 lines)
│   │   │   ├── PresetsLib.jsx       # Default presets (206 lines)
│   │   │   ├── TrackView/           # Polyrhythm visualization
│   │   │   ├── Sliders/             # Custom UI controls
│   │   │   └── localization/        # Multi-language support
│   │   ├── VariationShakuhachiCalculator.tsx  # Multi-style calculator (1,026 lines)
│   │   ├── AcousticVisualization.tsx          # Wave analysis (1,715 lines)
│   │   ├── ShakuhachiCalculator.tsx           # Traditional calculator (515 lines)
│   │   ├── DiatonicShakuhachiCalculator.tsx   # 7-hole calculator (503 lines)
│   │   ├── AcousticWaveAnalysis.tsx           # Advanced acoustics (438 lines)
│   │   ├── ShakuhachiDiagram.tsx              # Technical diagrams (402 lines)
│   │   └── MetronomeTab.tsx                   # Metronome integration (87 lines)
│   └── types/                  # TypeScript definitions
├── standalone/                 # Standalone HTML version (1,050 lines CSS + 800 lines JS)
├── package.json                # Dependencies and scripts
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
└── README.md                   # Project documentation
```

### Key Components

#### Core Calculator Components
1. **ShakuhachiCalculator.tsx** - Traditional 5-hole calculator
2. **DiatonicShakuhachiCalculator.tsx** - 7-hole diatonic calculator
3. **VariationShakuhachiCalculator.tsx** - Multi-style comparison calculator
4. **ShakuhachiDiagram.tsx** - SVG technical diagrams
5. **AcousticVisualization.tsx** - Wave analysis visualization
6. **AcousticWaveAnalysis.tsx** - Advanced acoustic analysis

#### Metronome Components (metro/ directory)
- **MetronomeTab.tsx** - Main metronome interface
- **SoundMachine.jsx** - Audio engine
- **Config.jsx** - Settings management
- **Planner.jsx** - Practice planning
- **ModePanel.jsx** - Training mode selection

---

## 🎵 Metronome System - Detailed Development Guide

### 1. Metronome Architecture Overview

The metronome system is a sophisticated **Speed Trainer** based on Metro Master, integrated into the shakuhachi calculator. It's built with React class components and Tone.js for professional audio timing.

#### **Core Components Hierarchy** 
```
MetronomeTab.tsx (87 lines)
└── SoundMachine.jsx (453 lines) - Main Audio Engine
    ├── ModePanel.jsx (346 lines) - Training Mode Selection
    ├── Planner.jsx (386 lines) - Practice Planning System  
    ├── PresetsManager.jsx (279 lines) - Preset Management
    ├── TrackView/ - Polyrhythm Visualization
    │   ├── TrackView.jsx (167 lines)
    │   ├── TrackRow.jsx (128 lines)
    │   └── TrackInstrument.jsx (21 lines)
    ├── Sliders/ - Custom UI Controls
    │   ├── AdvancedSlider.jsx (83 lines)
    │   ├── GeometricSlider.jsx (93 lines)
    │   ├── RangeEditInPlace.jsx (95 lines)
    │   └── DiscreteSlider.jsx (78 lines)
    ├── SvgClock.jsx (167 lines) - Visual Tempo Display
    ├── VisClock.jsx (135 lines) - Clock Visualization
    ├── SoundLibrary.jsx (149 lines) - Audio Sample Management
    └── localization/ - Multi-language Support
```

#### **Audio Engine Foundation**
- **Tone.js Integration**: Professional Web Audio API wrapper
- **Sample-based Playback**: 5 instrument sets (25 total samples)
- **Precision Timing**: Transport system with lookAhead optimization
- **Polyrhythm Support**: Multiple simultaneous time signatures

### 2. SoundMachine.jsx - Core Audio Engine

#### **Key Responsibilities**
```javascript
// Location: src/components/metro/SoundMachine.jsx
// Lines: 453 total

class SoundMachine extends Component {
  // Core Tone.js integration
  transport = Tone.Transport;
  tone = Tone;
  
  // Main audio loop
  part = new Tone.Part((time, note) => this.repeat(time, note), [])
  
  // Audio sample management
  soundLibrary = new SoundLibrary();
  
  // Component lifecycle
  componentDidMount() {
    Tone.Transport.lookAhead = 10; // ← Timing optimization
    this.part.loop = true;
    this.part.start(0);
    this.initProgressUpdate();
  }
}
```

#### **Critical Audio Methods**
```javascript
// Main repeat function - called for each beat
repeat(time, note) {
  // note.instrumentKey: 'metronome', 'tabla', 'electrokit', etc.
  // note.accent: 1-4 (different sound samples)
  // time: precise Tone.js timing
  
  const player = this.soundLibrary.getPlayer(note.instrumentKey, note.accent);
  if (player && player.loaded) {
    player.start(time);
  }
  
  // Update UI visualization
  this.updateProgress(note);
}

// Transport control
start() {
  Tone.start().then(() => {
    this.transport.start();
    console.log('Starting metronome...');
  });
}

stop() {
  this.transport.stop();
  this.transport.cancel();
}
```

#### **Customizing Audio Engine**
```javascript
// To modify timing precision
componentDidMount() {
  Tone.Transport.lookAhead = 50; // ← Increase for better precision
  Tone.context.latencyHint = 'playback'; // ← Audio optimization
}

// To add new timing functions
createCustomTiming(config) {
  const ticks = this.tone.Time("1m").toTicks();
  const interval = ticks / config.subdivision;
  
  // Schedule events
  for (let i = 0; i < config.length; i++) {
    this.transport.schedule((time) => {
      this.customEvent(time, config.events[i]);
    }, `${i} * ${interval}i`);
  }
}
```

### 3. Practice Training Modes

#### **Mode Types & Implementation**
```javascript
// Location: src/components/metro/PlayModes.jsx & ModePanel.jsx

export const PlayModes = {
  CONSTANT: 'constant',      // Fixed BPM
  INCREASING: 'increasing',  // Speed up gradually  
  BY_TIME: 'by_time',       // Change every X seconds
  BY_BAR: 'by_bar'          // Change every X measures
};

// Training progression calculation
makePlan(settings) {
  const segments = [];
  const stepSize = settings.bpmStep;
  const range = settings.bpmRange; // [min, max]
  const totalSteps = Math.floor((range[1] - range[0]) / stepSize);
  
  for (let i = 0; i <= totalSteps; i++) {
    const bpm = range[0] + (i * stepSize);
    segments.push({
      bpm: bpm,
      duration: this.calculateDuration(settings.playMode, settings),
      measures: this.calculateMeasures(bpm, settings.timeSignature)
    });
  }
  
  return segments;
}
```

#### **Adding New Training Modes**
```javascript
// 1. Add to PlayModes.jsx
export const PlayModes = {
  // ... existing modes
  FIBONACCI: 'fibonacci',    // Custom progression
  RANDOM: 'random',          // Random BPM changes
  ACCELERANDO: 'accelerando' // Smooth acceleration
};

// 2. Implement in Planner.jsx
handleFibonacciMode(settings) {
  const fibonacci = [60, 80, 100, 120, 140, 160, 180, 200];
  return fibonacci.map(bpm => ({
    bpm: bpm,
    duration: settings.segmentTime,
    progression: 'fibonacci'
  }));
}

// 3. Add UI controls in ModePanel.jsx
renderModeSelector() {
  return (
    <ButtonGroup>
      {Object.keys(PlayModes).map(mode => (
        <Button 
          key={mode}
          active={this.state.playMode === PlayModes[mode]}
          onClick={() => this.setPlayMode(PlayModes[mode])}
        >
          {Tr(mode)} {/* Localized label */}
        </Button>
      ))}
    </ButtonGroup>
  );
}
```

### 4. Instrument & Sample Management

#### **Sound Library Structure**
```javascript
// Location: src/components/metro/SoundLibrary.jsx
// Location: src/components/metro/Instruments.jsx

export const Instruments = {
  METRONOME: { key: 'metronome', label: 'Metronome' },
  TABLA: { key: 'tabla', label: 'Tabla' },
  ELECTRO_KIT: { key: 'electrokit', label: 'Electronic Kit' },
  BASIC_DRUM_KIT: { key: 'basicdrumkit', label: 'Basic Drum Kit' },
  YAMAHA_RX5: { key: 'yamaha_rx5', label: 'Yamaha RX 5' }
};

// Sample mapping with accent levels
export const Samples = [
  // Metronome samples
  { file: "tap.wav", label: "Tap", instrumentKey: 'metronome' },    // Accent 1
  { file: "down.wav", label: "Down", instrumentKey: 'metronome' },  // Accent 2  
  { file: "up.wav", label: "Up", instrumentKey: 'metronome' },      // Accent 3

  // Tabla samples (traditional Indian percussion)
  { file: "dha-slide.wav", label: "Dha", instrumentKey: 'tabla' },
  { file: "dhin-slide.wav", label: "Dhin", instrumentKey: 'tabla' },
  { file: "tin.wav", label: "Tin", instrumentKey: 'tabla' },
  
  // Electronic kit
  { file: "Kick.wav", label: "Kick", instrumentKey: 'electrokit' },
  { file: "Snare.wav", label: "Snare", instrumentKey: 'electrokit' },
  { file: "HiHat.wav", label: "Hi Hat", instrumentKey: 'electrokit' }
];
```

#### **Adding New Instruments**
```javascript
// 1. Add audio files to public/audio/new-instrument/
// 2. Update Instruments.jsx
export const Instruments = {
  // ... existing instruments
  CUSTOM_BELLS: { key: 'custombells', label: 'Custom Bells' }
};

// 3. Add samples to Samples array
{ file: "bell1.wav", label: "Bell 1", instrumentKey: 'custombells' },
{ file: "bell2.wav", label: "Bell 2", instrumentKey: 'custombells' },
{ file: "bell3.wav", label: "Bell 3", instrumentKey: 'custombells' },

// 4. Audio loading in SoundLibrary.jsx
loadInstrument(instrumentKey) {
  const instrumentSamples = Samples.filter(s => s.instrumentKey === instrumentKey);
  
  instrumentSamples.forEach((sample, index) => {
    const player = new Tone.Player(`/audio/${instrumentKey}/${sample.file}`);
    player.toDestination();
    this.players[`${instrumentKey}_${index + 1}`] = player;
  });
}
```

### 5. Polyrhythm & Time Signature System

#### **Track Configuration**
```javascript
// Location: src/components/metro/TrackView/TrackView.jsx

// Track format: Array of arrays representing polyrhythms
// Example: [[1,0,1,0], [1,1,1]] = 4/4 with triplet overlay
const defaultTrack = [
  [2, 1, 1, 1],  // Main beat: Strong-weak-weak-weak (4/4)
  [1, 1, 1]      // Triplet overlay: Even beats (3 against 4)
];

// Accent levels:
// 0 = Rest (no sound)
// 1 = Normal accent  
// 2 = Medium accent
// 3 = Strong accent
// 4 = Very strong accent (downbeat)
```

#### **Creating Custom Polyrhythms**
```javascript
// Complex polyrhythm example
const advancedTrack = [
  [4, 1, 2, 1, 3, 1, 2, 1],  // 8-beat main pattern
  [1, 1, 1, 1, 1],            // 5 against 8 polyrhythm
  [1, 0, 1]                   // 3-beat accent pattern
];

// Calculate polyrhythm timing
createPoly(trackRow, trackIdx, timeSignature) {
  const ticks = this.tone.Time("1m").toTicks();
  const interval = ticks / trackRow.length;
  
  for (let i = 0; i < trackRow.length; i++) {
    if (trackRow[i] > 0) { // If not a rest
      this.transport.schedule((time) => {
        this.repeat(time, {
          instrumentKey: this.state.config.instrumentKey,
          accent: trackRow[i], // Accent level determines sample
          trackIndex: trackIdx,
          beatIndex: i
        });
      }, `${i} * ${interval}i`);
    }
  }
}
```

### 6. Preset Management System

#### **Preset Structure**
```javascript
// Location: src/components/metro/PresetsLib.jsx

export const InitPreset = {
  title: "Default 4/4",
  bpmStep: 10,                    // BPM increment steps
  bpmRange: [60, 120],           // Min/max BPM range
  currentBpm: 80,                // Starting BPM
  playbackMode: "stop",          // "stop" | "play" | "pause"
  playMode: "constant",          // Training mode
  stepsNum: 6,                   // Number of training steps
  exerciseTime: 300,             // Total exercise time (seconds)
  byTimeInterval: 30,            // Seconds per BPM change
  byBarInterval: 4,              // Bars per BPM change
  constantBpmSlider: 80,         // Constant mode BPM
  track: [[2, 1, 1, 1]],        // Polyrhythm pattern
  timeSignature: [4, 4],         // Time signature [beats, noteValue]
  instrumentKey: "metronome",    // Selected instrument
  volume: 0.7,                   // Master volume
  reverb: 0.2                    // Reverb amount
};

// Predefined presets array
export const Presets = [
  {
    title: "Metronome 2/4",
    bpmRange: [100, 200],
    track: [[2], [1]],
    timeSignature: [2, 4],
    instrumentKey: "metronome"
  },
  {
    title: "Tabla Practice",
    bpmRange: [80, 140],
    track: [[4, 1, 2, 1, 3, 1, 2, 1]],
    timeSignature: [8, 8],
    instrumentKey: "tabla"
  }
];
```

#### **Custom Preset Creation**
```javascript
// Adding shakuhachi-specific presets
const shakuhachiPresets = [
  {
    title: "Honkyoku Slow",
    bpmRange: [40, 80],
    track: [[4, 0, 1, 0]], // Breath-focused timing
    timeSignature: [4, 4],
    instrumentKey: "metronome",
    byTimeInterval: 60, // Long intervals for meditation
    playMode: "by_time"
  },
  {
    title: "Scale Practice",
    bpmRange: [60, 120],
    track: [[2, 1, 1, 1, 1, 1, 1, 1]], // 8-note scales
    timeSignature: [8, 8],
    instrumentKey: "metronome",
    bpmStep: 5 // Small increments
  },
  {
    title: "Breathing Exercise",
    bpmRange: [30, 60],
    track: [[4, 0, 0, 0]], // One beat per breath cycle
    timeSignature: [4, 4],
    instrumentKey: "metronome",
    playMode: "constant"
  }
];

// Integration into PresetsLib.jsx
export const Presets = [
  ...defaultPresets,
  ...shakuhachiPresets
];
```

### 7. Metronome Integration with Shakuhachi

#### **Linking with Calculator Results**
```javascript
// Location: src/components/MetronomeTab.tsx

class MetronomeTab extends Component {
  // Receive shakuhachi calculation results
  setFromCalculation(calculationResult) {
    const baseFrequency = calculationResult.baseFrequency;
    
    // Convert frequency to practice BPM suggestion
    const suggestedBpm = this.frequencyToBpm(baseFrequency);
    
    // Create shakuhachi-specific preset
    const shakuhachiPreset = {
      title: `${calculationResult.noteName} Practice`,
      bpmRange: [Math.round(suggestedBpm * 0.5), Math.round(suggestedBpm * 1.5)],
      currentBpm: suggestedBpm,
      track: this.generateBreathingPattern(calculationResult.aspectRatio),
      instrumentKey: 'metronome',
      playMode: 'by_time',
      byTimeInterval: 45 // Breathing-focused intervals
    };
    
    this.soundMachineRef.current.loadPreset(shakuhachiPreset);
  }
  
  frequencyToBpm(frequency) {
    // Convert flute frequency to practice tempo
    // Lower frequencies = slower practice tempo
    return Math.max(40, Math.min(120, Math.round(frequency / 4)));
  }
  
  generateBreathingPattern(aspectRatio) {
    // Create rhythm based on flute proportions
    if (aspectRatio > 20) {
      return [[4, 0, 1, 0]]; // Long flute = slower breathing
    } else if (aspectRatio > 15) {
      return [[3, 1, 2, 1]]; // Medium flute = moderate rhythm
    } else {
      return [[2, 1, 1, 1]]; // Short flute = regular 4/4
    }
  }
}
```

### 8. Troubleshooting Metronome Issues

#### **Common Audio Problems**
```javascript
// Audio context issues (most common)
handleAudioContextError() {
  if (Tone.context.state === 'suspended') {
    // User interaction required
    console.log('Audio context suspended - user interaction needed');
    return false;
  }
  
  // Resume audio context
  Tone.start().then(() => {
    console.log('Audio context resumed');
    this.retryAudioInit();
  });
}

// Sample loading failures
handleSampleLoadError(instrumentKey, sampleFile) {
  console.error(`Failed to load ${sampleFile} for ${instrumentKey}`);
  
  // Fallback to basic metronome
  this.fallbackToBasicMetronome();
}

// Timing accuracy issues
optimizeTiming() {
  // Increase buffer size for stability
  Tone.getContext().lookAhead = 0.1;
  
  // Use worker thread for timing
  if (window.Worker) {
    this.timingWorker = new Worker('/timing-worker.js');
  }
}
```

#### **Performance Optimization**
```javascript
// Reduce CPU usage
optimizePerformance() {
  // Limit visualization updates
  this.visualUpdateRate = 30; // 30 FPS instead of 60
  
  // Preload all samples at initialization
  this.preloadAllSamples();
  
  // Use object pooling for frequent allocations
  this.eventPool = [];
  
  // Throttle state updates
  this.setState = this.throttle(this.setState.bind(this), 16); // ~60fps
}

// Memory management
cleanup() {
  // Dispose of Tone.js objects
  this.part.dispose();
  this.transport.cancel();
  
  // Clean up audio players
  Object.values(this.soundLibrary.players).forEach(player => {
    player.dispose();
  });
  
  // Clear intervals and timeouts
  clearInterval(this.progressInterval);
}
```

---

## 🧮 Formula & Logic Customization

### 1. Core Calculation Algorithms

#### Traditional Algorithm (ShakuhachiCalculator.tsx)
```typescript
// Location: src/components/ShakuhachiCalculator.tsx
// Lines: ~140-200

const calculate = useCallback(() => {
  // Nelson Zink's original algorithm
  const TL = params.fluteLength
  const Dh = params.holeDiameter
  const BaseNote = 156521.0 / TL  // ← Core frequency formula
  const Db = params.boreDiameter
  const Wt = params.wallThickness
  const Te = Wt + (0.75 * Dh)
  const BigNum = 165674  // ← Acoustic constant
  const TubeLength = BigNum / BaseNote
  const MEL = TubeLength - (0.3 * Db) - TL
  
  // Hole calculation loop
  const Interval = [3, 2, 2, 3, 2] // ← Semitone intervals
  for (let zz = 0; zz < Interval.length; zz++) {
    const thisInterval = Interval[zz]
    temp += thisInterval
    const Hz = BaseNote * Math.pow(2, temp / 12.0)
    const NewLength = BigNum / Hz
    const S = (LastLength - NewLength) / 2.0
    const CF = S * (Math.pow(((Te / S) * Math.pow(Db / Dh, 2) * 2) + 1, 0.5) - 1)
    const HoleLocation = Math.round(NewLength - MEL - CF)
    // ...
  }
}, [params, /* dependencies */])
```

**To Modify Formulas:**
1. **Base Frequency**: Change `156521.0` constant
2. **Acoustic Constant**: Modify `BigNum = 165674`
3. **Intervals**: Adjust `Interval = [3, 2, 2, 3, 2]` array
4. **Correction Factors**: Modify `CF` calculation

#### Variation Algorithm (VariationShakuhachiCalculator.tsx)
```typescript
// Location: src/components/VariationShakuhachiCalculator.tsx
// Lines: ~60-120

const HOLE_PLACEMENT_STYLES = {
  'nelson-zink': {
    name: 'Nelson Zink - Navaching.com',
    thumb: 0.427, // ← Percentage from top
    hole4: 0.488,
    hole3: 0.603,
    hole2: 0.688,
    hole1: 0.785
  },
  // Add new styles here...
}
```

**To Add New Maker Styles:**
1. Add entry to `HOLE_PLACEMENT_STYLES` object
2. Include percentage values from top of flute
3. Add special adjustments if needed (see Kodama examples)
4. Update dropdown options in JSX

#### Advanced Acoustic Calculations
```typescript
// Location: src/components/VariationShakuhachiCalculator.tsx
// Lines: ~300-400

const calculateSpeedOfSound = useCallback((temperature, relativeHumidity) => {
  // Enhanced formula with humidity correction
  const T = temperature + 273.15
  const speedDryAir = 331.3 * Math.sqrt(T / 273.15)
  
  // Tetens formula for vapor pressure
  const Psat = 611.2 * Math.exp(17.67 * temperature / (temperature + 243.5))
  const Pv = (relativeHumidity / 100) * Psat
  
  // Molar mass calculations...
  const speedHumidAir = speedDryAir * Math.sqrt(MdryAir / Mair)
  return speedHumidAir
}, [])
```

### 2. Parameter Ranges & Validation

#### Modifying Input Limits
```typescript
// Location: Each calculator component
// Lines: ~40-60

const FLUTE_LENGTH_MIN = 30      // ← Minimum flute length
const FLUTE_LENGTH_MAX = 1300    // ← Maximum flute length
const HOLE_DIAMETER_MIN = 5
const HOLE_DIAMETER_MAX = 30
const BORE_DIAMETER_MIN = 10
const BORE_DIAMETER_MAX = 100
// ... other constants
```

#### Adding New Parameters
1. **Add to interface**: Update `ShakuhachiParams` interface
2. **Add to state**: Include in `useState` initialization
3. **Add UI controls**: Create slider/input components
4. **Update calculation**: Include in calculation functions

### 3. Ergonomic Analysis

#### Customizing Ergonomic Checks
```typescript
// Location: VariationShakuhachiCalculator.tsx
// Lines: ~500-550

const ErgoSpan = params.ergonomicLimit
const ThumbS = HoleLocations[1] - HoleLocations[0]
const TopS = HoleLocations[2] - HoleLocations[1]

// Alternate position calculations
if (ThumbS > (ErgoSpan * 2.0 / 3.0)) {
  AlternateHoleLocations[0] = HoleLocations[1] - Math.round(ErgoSpan * 2.0 / 3.0)
}
```

**To Modify Ergonomic Logic:**
1. Change threshold ratios (e.g., `2.0 / 3.0`)
2. Add new ergonomic constraints
3. Modify alternate position calculations

---

## 🎨 Styling & UI Customization

### 1. Tailwind CSS Configuration

#### Main Configuration
```javascript
// Location: tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Add custom colors here
        shakuhachi: {
          50: '#f8fafc',
          100: '#f1f5f9',
          // ... more shades
        }
      },
      fontFamily: {
        // Add custom fonts
        'japanese': ['Noto Sans JP', 'sans-serif']
      }
    }
  }
}
```

#### Global Styles
```css
/* Location: src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom component styles */
@layer components {
  .calculator-section {
    @apply bg-white rounded-lg shadow-md p-6 mb-8;
  }
  
  .param-group {
    @apply mb-4;
  }
  
  .slider {
    @apply w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer;
  }
}
```

### 2. Component Styling

#### Customizing Calculator Layout
```typescript
// Location: Any calculator component
// Lines: JSX return section

<div className="max-w-4xl mx-auto p-6 space-y-8">
  {/* Main container - modify max-width, padding, spacing */}
  
  <div className="grid lg:grid-cols-2 gap-8">
    {/* Grid layout - change columns, gaps */}
    
    <div className="space-y-6">
      {/* Parameter section styling */}
```

#### Color Schemes
```typescript
// Common color classes used:
// - bg-slate-50: Light backgrounds
// - text-slate-900: Dark text
// - border-gray-300: Borders
// - bg-blue-100: Highlighted sections
// - text-red-700: Error states
```

### 3. Responsive Design

#### Breakpoint Customization
```css
/* Tailwind breakpoints used: */
/* sm: 640px */
/* md: 768px */
/* lg: 1024px */
/* xl: 1280px */

.grid {
  @apply grid-cols-1 lg:grid-cols-2; /* Mobile: 1 col, Desktop: 2 cols */
}
```

#### Mobile Optimization
- Use `overflow-x-auto` for tables
- Stack components vertically on mobile
- Adjust font sizes with responsive classes
- Touch-friendly button sizes

---

## 🔧 Development Workflow

### 1. Setting Up Development Environment

#### Prerequisites Installation
```bash
# Install Node.js (v18 or later)
# Download from https://nodejs.org/

# Verify installation
node --version
npm --version

# Install VS Code
# Download from https://code.visualstudio.com/
```

#### Project Setup
```bash
# Clone the repository
git clone <repository-url>
cd shakumak

# Install dependencies
npm install

# Start development server
npm run dev
```

#### Recommended VS Code Extensions
```json
// .vscode/extensions.json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-eslint",
    "github.copilot"
  ]
}
```

### 2. Development Scripts

#### Available Commands
```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Type checking
npx tsc --noEmit
```

#### Development Server Options
```bash
# Default (port 3000)
npm run dev

# Custom port
npm run dev -- -p 3001

# Network access
npm run dev -- -H 0.0.0.0
```

### 3. File Organization

#### Component Creation Template
```typescript
// src/components/NewComponent.tsx
'use client'

import { useState, useCallback, useEffect } from 'react'

interface NewComponentProps {
  // Define props
}

export default function NewComponent({ /* props */ }: NewComponentProps) {
  const [state, setState] = useState<Type>(initialValue)
  
  const handleAction = useCallback(() => {
    // Handle actions
  }, [dependencies])
  
  useEffect(() => {
    // Side effects
  }, [dependencies])
  
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  )
}
```

#### Type Definitions
```typescript
// src/types/shakuhachi.ts
export interface ShakuhachiParams {
  fluteLength: number
  holeDiameter: number
  boreDiameter: number
  wallThickness: number
  ergonomicLimit: number
}

export interface HolePosition {
  hole: number
  position: number
  alternatePosition?: number
  error: boolean
  noteName: string
  frequency: number
}

export interface CalculationResult {
  baseFrequency: number
  noteName: string
  shakuhachiLength: string
  aspectRatio: number
  holePositions: HolePosition[]
  spans: Record<string, number>
}
```

---

## 🧪 Testing Guidelines

### 1. Manual Testing in VS Code

#### Setting Up Test Environment
```bash
# Terminal 1: Start development server
npm run dev

# Terminal 2: Available for commands
# Terminal 3: Available for debugging
```

#### Testing Checklist

**Calculator Functionality:**
- [ ] Parameter sliders update values correctly
- [ ] Input fields sync with sliders
- [ ] Calculations update in real-time
- [ ] Error handling for invalid inputs
- [ ] Boundary value testing (min/max values)

**Responsive Design:**
- [ ] Mobile layout (< 768px)
- [ ] Tablet layout (768px - 1024px)
- [ ] Desktop layout (> 1024px)
- [ ] Table horizontal scrolling on mobile

**Browser Compatibility:**
- [ ] Chrome/Chromium
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### Testing Scenarios

**Test Case 1: Basic Calculation**
```typescript
// Test inputs:
const testParams = {
  fluteLength: 540,
  holeDiameter: 10,
  boreDiameter: 19,
  wallThickness: 4,
  ergonomicLimit: 60
}

// Expected: Base frequency ≈ 290 Hz
// Expected: 5 hole positions calculated
// Expected: No errors displayed
```

**Test Case 2: Edge Cases**
```typescript
// Minimum values
const minParams = {
  fluteLength: 30,
  holeDiameter: 5,
  boreDiameter: 10,
  wallThickness: 1,
  ergonomicLimit: 10
}

// Maximum values
const maxParams = {
  fluteLength: 1300,
  holeDiameter: 30,
  boreDiameter: 100,
  wallThickness: 10,
  ergonomicLimit: 180
}
```

**Test Case 3: Style Comparison**
```typescript
// Test all maker styles in VariationCalculator
const styles = [
  'nelson-zink',
  'john-neptune',
  'ken-lacosse',
  'atsuya-okuda',
  'yamaguchi-shugetsu',
  'nishimura-koku',
  'kodama-youtube1',
  'kodama-hoian2'
]

// Expected: Each style produces different hole positions
// Expected: Comparison table shows all styles
// Expected: Current style is highlighted
```

### 2. Browser Developer Tools

#### Console Testing
```javascript
// Open browser console (F12) and test:

// Check React components
window.React
window.ReactDOM

// Test calculation functions (if exposed)
// Add to component for debugging:
window.debugCalculation = (params) => {
  console.log('Input params:', params)
  const result = calculateShakuhachi(params)
  console.log('Calculation result:', result)
  return result
}
```

#### Performance Testing
```javascript
// Measure calculation performance
console.time('calculation')
// Trigger calculation
console.timeEnd('calculation')

// Check memory usage
console.log(performance.memory)
```

### 3. Automated Testing Setup

#### Jest Configuration (Optional)
```javascript
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapping: {
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/pages/(.*)$': '<rootDir>/src/pages/$1',
  },
  testEnvironment: 'jest-environment-jsdom',
}

module.exports = createJestConfig(customJestConfig)
```

#### Sample Test File
```typescript
// __tests__/ShakuhachiCalculator.test.tsx
import { render, screen } from '@testing-library/react'
import ShakuhachiCalculator from '@/components/ShakuhachiCalculator'

describe('ShakuhachiCalculator', () => {
  it('renders calculator interface', () => {
    render(<ShakuhachiCalculator />)
    expect(screen.getByText('Traditional Shakuhachi Calculator')).toBeInTheDocument()
  })

  it('calculates hole positions correctly', () => {
    // Test calculation logic
  })
})
```

---

## 🐛 Debugging Guide

### 1. Common Issues & Solutions

#### Build Errors
```bash
# TypeScript errors
npm run build
# Check output for type errors

# Fix: Update type definitions
# Location: src/types/*.ts

# ESLint errors
npm run lint
# Fix: Follow ESLint recommendations
```

#### Runtime Errors
```javascript
// Check browser console for errors
// Common issues:

// 1. Hydration mismatch
// Solution: Ensure server/client rendering consistency

// 2. Missing dependencies
// Solution: Add to useEffect/useCallback dependency arrays

// 3. State update errors
// Solution: Use functional state updates
setState(prev => ({ ...prev, newValue }))
```

#### Performance Issues
```javascript
// Use React DevTools Profiler
// Check for:
// - Unnecessary re-renders
// - Heavy calculations in render
// - Missing memoization

// Solutions:
// - Use React.memo for expensive components
// - Move calculations to useCallback/useMemo
// - Debounce input handlers
```

### 2. Debugging Tools

#### React Developer Tools
```bash
# Install browser extension
# Chrome: React Developer Tools
# Firefox: React Developer Tools

# Features:
# - Component tree inspection
# - Props/state viewing
# - Performance profiling
```

#### VS Code Debugging
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node",
      "request": "attach",
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

#### Console Debugging
```typescript
// Add debugging to components
useEffect(() => {
  console.log('Component mounted')
  console.log('Props:', props)
  console.log('State:', state)
}, [])

// Conditional debugging
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}

// Performance monitoring
const startTime = performance.now()
// ... calculation
const endTime = performance.now()
console.log(`Calculation took ${endTime - startTime} milliseconds`)
```

### 3. Error Boundaries

#### Implementing Error Boundaries
```typescript
// src/components/ErrorBoundary.tsx
'use client'

import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong.</h2>
          <details>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
```

---

## 📚 GitHub Upload & Version Control

### 1. Initial Repository Setup

#### Creating GitHub Repository
```bash
# Option 1: Create on GitHub.com first, then clone
git clone https://github.com/username/shakumak.git
cd shakumak

# Option 2: Initialize locally, then push
cd shakumak
git init
git remote add origin https://github.com/username/shakumak.git
```

#### Essential Git Configuration
```bash
# Set user information
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name
git config --global init.defaultBranch main

# Useful aliases
git config --global alias.st status
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
```

### 2. .gitignore Configuration

#### Complete .gitignore file
```bash
# .gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Next.js
.next/
out/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/settings.json
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Microbundle cache
.rpt2_cache/
.rts2_cache_cjs/
.rts2_cache_es/
.rts2_cache_umd/

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# Storybook build outputs
.out
.storybook-out

# Temporary folders
tmp/
temp/

# Editor directories and files
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

### 3. Branching Strategy

#### Git Flow Approach
```bash
# Main branches
main        # Production-ready code
develop     # Integration branch

# Feature branches
feature/calculator-improvements
feature/metronome-enhancement
feature/new-maker-style

# Release branches
release/v1.0.0
release/v1.1.0

# Hotfix branches
hotfix/critical-bug-fix
```

#### Branch Management Commands
```bash
# Create and switch to feature branch
git checkout -b feature/new-feature develop

# Work on feature
git add .
git commit -m "Add new feature implementation"

# Push feature branch
git push -u origin feature/new-feature

# Merge feature back to develop
git checkout develop
git pull origin develop
git merge --no-ff feature/new-feature
git push origin develop

# Delete feature branch
git branch -d feature/new-feature
git push origin --delete feature/new-feature
```

### 4. Commit Best Practices

#### Commit Message Convention
```bash
# Format: type(scope): description

# Types:
feat     # New feature
fix      # Bug fix
docs     # Documentation changes
style    # Code style changes (formatting, etc.)
refactor # Code refactoring
test     # Adding or updating tests
chore    # Maintenance tasks

# Examples:
git commit -m "feat(calculator): add new maker style support"
git commit -m "fix(metronome): resolve audio timing issue"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(components): improve code formatting"
git commit -m "refactor(hooks): extract calculation logic"
git commit -m "test(calculator): add unit tests for hole positioning"
git commit -m "chore(deps): update dependencies to latest versions"
```

#### Detailed Commit Workflow
```bash
# Check status
git status

# Stage specific files
git add src/components/NewComponent.tsx
git add src/types/newTypes.ts

# Or stage all changes
git add .

# Commit with descriptive message
git commit -m "feat(calculator): implement advanced acoustic modeling

- Add temperature and humidity corrections
- Implement Tetens formula for vapor pressure
- Update speed of sound calculations
- Add environmental parameter validation

Closes #123"

# Push to remote
git push origin feature-branch-name
```

### 5. Release Management

#### Version Tagging
```bash
# Update version in package.json
npm version patch   # 1.0.0 -> 1.0.1
npm version minor   # 1.0.0 -> 1.1.0
npm version major   # 1.0.0 -> 2.0.0

# Create annotated tag
git tag -a v1.0.0 -m "Release version 1.0.0

Features:
- Traditional shakuhachi calculator
- Diatonic calculator
- Variation calculator with 8 maker styles
- Integrated metronome
- Responsive design

Bug fixes:
- Fixed calculation precision
- Resolved mobile layout issues"

# Push tags
git push origin --tags
```

#### Release Notes Template
```markdown
# Release v1.0.0

## 🚀 New Features
- Traditional shakuhachi calculator with Nelson Zink algorithm
- Diatonic 7-hole calculator
- Variation calculator with 8 maker styles
- Integrated speed trainer metronome
- Responsive design for mobile and desktop

## 🐛 Bug Fixes
- Fixed calculation precision issues
- Resolved mobile layout problems
- Corrected audio timing in metronome

## 🔧 Improvements
- Enhanced performance for real-time calculations
- Improved accessibility features
- Better error handling and validation

## 📚 Documentation
- Complete developer documentation
- Updated README with usage examples
- Added deployment guides

## 🔄 Dependencies
- Next.js 15.5.2
- React 19.1.0
- TypeScript 5.x
- Tailwind CSS 4.x
```

---

## 🚀 Deployment Guide

### 1. Vercel Deployment (Recommended)

#### Quick Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from project directory
vercel

# Follow prompts:
# - Set up and deploy: Yes
# - Which scope: Your account
# - Link to existing project: No
# - Project name: shakumak
# - Directory: ./
# - Override settings: No
```

#### Advanced Vercel Configuration
```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "src/pages/api/**/*.ts": {
      "runtime": "@vercel/node"
    }
  }
}
```

#### Environment Variables
```bash
# In Vercel dashboard or using CLI
vercel env add NEXT_PUBLIC_APP_NAME production
vercel env add NEXT_PUBLIC_VERSION production
```

### 2. Netlify Deployment

#### Deploy via Git
```bash
# 1. Connect GitHub repository in Netlify dashboard
# 2. Set build settings:
#    Build command: npm run build
#    Publish directory: .next

# 3. Environment variables in Netlify dashboard:
NEXT_PUBLIC_APP_NAME=Shakuhachi Calculator
NODE_VERSION=18
```

#### netlify.toml Configuration
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "out"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[dev]
  command = "npm run dev"
  port = 3000
```

### 3. Docker Deployment

#### Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  shakuhachi-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_APP_NAME=Shakuhachi Calculator
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - shakuhachi-app
    restart: unless-stopped
```

#### Build and Deploy
```bash
# Build Docker image
docker build -t shakuhachi-calculator .

# Run container
docker run -p 3000:3000 shakuhachi-calculator

# Using Docker Compose
docker-compose up -d
```

### 4. Static Export (GitHub Pages)

#### Next.js Configuration for Static Export
```typescript
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/shakumak' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/shakumak/' : '',
}

module.exports = nextConfig
```

#### GitHub Actions for Auto-Deploy
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build application
      run: npm run build
      
    - name: Setup Pages
      uses: actions/configure-pages@v4
      
    - name: Upload artifact
      uses: actions/upload-pages-artifact@v3
      with:
        path: ./out
        
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    
    steps:
    - name: Deploy to GitHub Pages
      id: deployment
      uses: actions/deploy-pages@v4
```

#### Manual Static Deploy
```bash
# Build static export
npm run build

# Deploy 'out' folder to any static hosting
# - GitHub Pages
# - Firebase Hosting
# - AWS S3
# - Cloudflare Pages
```

### 5. Self-Hosted Deployment

#### PM2 Process Manager
```bash
# Install PM2 globally
npm install -g pm2

# Build application
npm run build

# Create PM2 ecosystem file
```

```javascript
// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'shakuhachi-calculator',
      script: 'npm',
      args: 'start',
      cwd: '/path/to/shakumak',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/err.log',
      out_file: './logs/out.log',
      log_file: './logs/combined.log',
      time: true
    }
  ]
}
```

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Monitor
pm2 monit

# Auto-restart on boot
pm2 startup
pm2 save
```

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/shakuhachi
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Static files
    location /_next/static/ {
        alias /path/to/shakumak/.next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Audio files
    location /audio/ {
        alias /path/to/shakumak/public/audio/;
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

### 6. Performance Optimization

#### Build Optimization
```typescript
// next.config.ts - Production optimizations
const nextConfig = {
  // Compress static assets
  compress: true,
  
  // Optimize images
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Bundle analyzer (development only)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback.fs = false
      }
      return config
    }
  }),
  
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}
```

#### Performance Monitoring
```bash
# Bundle analysis
npm install --save-dev @next/bundle-analyzer

# Add to package.json scripts:
"analyze": "ANALYZE=true npm run build"

# Run analysis
npm run analyze
```

---

## 🔧 Troubleshooting

### 1. Common Build Issues

#### TypeScript Errors
```bash
# Error: Type errors in build
# Solution: Fix type definitions

# Check specific errors
npx tsc --noEmit

# Common fixes:
# - Add missing type imports
# - Update interface definitions
# - Fix component prop types
```

#### Dependency Conflicts
```bash
# Error: Conflicting dependencies
# Solution: Clean install

rm -rf node_modules
rm package-lock.json
npm install

# Or force resolution in package.json:
{
  "overrides": {
    "problematic-package": "^1.0.0"
  }
}
```

#### Memory Issues
```bash
# Error: JavaScript heap out of memory
# Solution: Increase Node.js memory

# In package.json scripts:
{
  "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
}
```

### 2. Runtime Issues

#### Hydration Mismatches
```typescript
// Error: Hydration failed
// Solution: Ensure consistent rendering

// Use dynamic imports for client-only components
import dynamic from 'next/dynamic'

const ClientOnlyComponent = dynamic(
  () => import('./ClientOnlyComponent'),
  { ssr: false }
)

// Or use useEffect for client-only state
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])

if (!mounted) return null
```

#### Audio Issues
```typescript
// Error: Audio not playing
// Solutions:

// 1. User interaction required
const startAudio = () => {
  // Ensure user has interacted with page
  if (Tone.context.state !== 'running') {
    Tone.start()
  }
}

// 2. Check browser compatibility
if (!window.AudioContext && !window.webkitAudioContext) {
  console.error('Web Audio API not supported')
}
```

### 3. Deployment Issues

#### Vercel Build Failures
```bash
# Check build logs in Vercel dashboard
# Common solutions:

# 1. Environment variables
# Ensure all required env vars are set

# 2. Memory limits
# Use Vercel Pro for higher limits

# 3. Build command
# Check vercel.json configuration
```

#### Static Export Issues
```typescript
// Error: Dynamic features in static export
// Solution: Disable or modify dynamic features

// next.config.ts
const nextConfig = {
  output: 'export',
  // Remove server-side features
  images: {
    unoptimized: true
  }
}
```

### 4. Performance Issues

#### Slow Calculations
```typescript
// Solution: Optimize calculation functions

// Use Web Workers for heavy calculations
const worker = new Worker('/calc-worker.js')
worker.postMessage(params)
worker.onmessage = (e) => {
  setResults(e.data)
}

// Or use useMemo for caching
const calculations = useMemo(() => {
  return expensiveCalculation(params)
}, [params])
```

#### Memory Leaks
```typescript
// Solution: Proper cleanup

useEffect(() => {
  const timer = setInterval(() => {
    // Some recurring task
  }, 1000)
  
  // Cleanup function
  return () => {
    clearInterval(timer)
  }
}, [])
```

### 5. Browser Compatibility

#### Legacy Browser Support
```javascript
// Check for required features
if (!('WeakMap' in window) || !('Promise' in window)) {
  // Show upgrade message or load polyfills
}

// Polyfill loading
import 'core-js/stable'
import 'regenerator-runtime/runtime'
```

#### Mobile Issues
```css
/* Fix viewport issues */
/* In globals.css */
@supports (-webkit-touch-callout: none) {
  /* iOS-specific styles */
}

/* Touch-friendly controls */
.slider {
  min-height: 44px; /* iOS touch target size */
}
```

---

## 📞 Support & Resources

### Documentation Links
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Tone.js Documentation](https://tonejs.github.io/docs/)

### Community Resources
- [Stack Overflow](https://stackoverflow.com/questions/tagged/next.js)
- [Next.js GitHub Discussions](https://github.com/vercel/next.js/discussions)
- [React Community](https://react.dev/community)

### Development Tools
- [VS Code](https://code.visualstudio.com/)
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [Next.js DevTools](https://nextjs.org/docs/advanced-features/debugging)

---

*This documentation is maintained alongside the Shakuhachi Calculator project. For the latest updates, please refer to the project repository.*

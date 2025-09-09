# Shakuhachi Makers Tool

A modern web application for calculating precise hole positions for making traditional and diatonic shakuhachi flutes, with integrated metronome for practice.

## Features

### Shakuhachi Calculators
- **Traditional Shakuhachi Calculator (5-hole)**: Calculate hole positions for traditional shakuhachi with pentatonic scale
- **Diatonic Shakuhachi Calculator (7-hole)**: Calculate hole positions for diatonic shakuhachi with natural major scale
- **Variation Shakuhachi Calculator**: Advanced calculator with multiple maker styles including:
  - Nelson Zink formula
  - Monty Levenson approach
  - Perry Yung technique
  - Atsuya Okuda method
  - Yamaguchi variants (Katsuya, Kuroda, Kinya)
  - Kodama Hiroyuki variations
- **Physics-Based Calculations**: Environmental parameters (temperature, humidity), adjustable A frequency reference
- **Acoustic Wave Analysis**: Resonance mode analysis, standing wave patterns, micro-tuning suggestions

### Integrated Metronome
- **Speed Trainer**: Professional metronome with tempo control and patterns
- **Multiple Sound Kits**: Drum kits, tabla, electronic sounds, metronome clicks
- **Visual Feedback**: Real-time tempo visualization and track patterns
- **Background/Practice Mode**: Runs independently for shakuhachi practice

### Interactive Features
- **Real-time Calculations**: See results update instantly as you modify parameters
- **Responsive Design**: Works on desktop and mobile devices
- **Comparison Tables**: Compare different maker styles side-by-side
- **Export Options**: Save calculations for reference

## Current Status

### ✅ Working Features
- All 4 calculator tabs functional
- Metronome visual interface complete
- Audio files integrated from metro-master
- React refs modernized for React 19 compatibility
- Tone.js API compatibility fixed
- Application compiles and runs successfully

### 🔧 Known Issues
- **Metronome Audio**: Visual interface works but sound playback needs debugging
- Audio loading may need additional initialization

### 🚀 Recent Updates (Backup Created)
- Complete metronome integration with visual feedback
- All React compatibility issues resolved
- Audio files copied from metro-master project
- Robust error handling for missing audio files
- Git backup created: commit `7d712e7`
- Filesystem backup: `shakumak-backup-visual-working-[timestamp]`

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Build for Production

```bash
npm run build
```

## Credits

- **Algorithms**: Nelson Zink
- **Original Implementation**: Jeremy Bornstein
- **Extensions**: Tran Nghia (extended flute length to 1300mm for 3.6+ flutes)
- **Diatonic Version**: Jacopo Saporetti
- **Modern Web Implementation**: Built with Next.js, TypeScript, and Tailwind CSS

## About Shakuhachi

The shakuhachi is a traditional Japanese bamboo flute. This tool helps instrument makers calculate the precise positions for finger holes based on acoustic principles and ergonomic considerations.

### Traditional Shakuhachi (5-hole)
- Uses pentatonic scale intervals
- 5 finger holes plus thumb hole
- Focuses on traditional Japanese scales

### Diatonic Shakuhachi (7-hole)
- Uses diatonic scale intervals (whole-whole-half-whole-whole-whole-half)
- 7 holes for natural major scale
- Modern adaptation for Western music

## Technology Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [React](https://reactjs.org/) - UI library

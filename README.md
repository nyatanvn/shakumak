# Shakuhachi Calculator with Integrated Metronome

A comprehensive web application for calculating precise hole positions for traditional and diatonic shakuhachi flutes, featuring an integrated speed trainer metronome for practice.

https://nyatanvn.github.io/shakumak/

## Features

### 🎋 Shakuhachi Calculators
- **Traditional Shakuhachi Calculator (5-hole)**: Calculate hole positions for traditional shakuhachi with pentatonic scale
- **Diatonic Shakuhachi Calculator (7-hole)**: Calculate hole positions for diatonic shakuhachi with natural major scale
- **Variation Shakuhachi Calculator**: Advanced calculator with multiple maker styles:
  - Nelson Zink formula
  - Monty Levenson approach
  - Perry Yung technique
  - Atsuya Okuda method
  - Yamaguchi variants (Katsuya, Kuroda, Kinya)
  - Kodama Hiroyuki variations
- **Physics-Based Analysis**: Environmental parameters, acoustic wave analysis, micro-tuning
- **Interactive Features**: Real-time calculations, comparison tables, responsive design

### 🎵 Integrated Speed Trainer Metronome
- **Professional Metronome**: Based on Metro Master with full functionality
- **Multiple Training Modes**: Set Time, By Bar, By Time, Constant tempo
- **Plan Management**: Step progression with "After plan" and "Step order" options
- **Sound Kits**: Multiple drum kits, percussion sounds, and click tracks
- **Visual Feedback**: Real-time BPM display, progress tracking, beat visualization
- **Keyboard Controls**: Space for start/stop, arrows for tempo/step control

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd shakumak

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## 📱 Usage

### Shakuhachi Calculators
1. Select the desired calculator tab (Traditional, Diatonic, or Variation)
2. Input flute length and other parameters
3. View calculated hole positions in real-time
4. Compare different maker styles in Variation calculator

### Metronome
1. Navigate to the "Metronome" tab
2. Select training mode (Set Time, By Bar, By Time, or Constant)
3. Configure BPM range and intervals
4. Use keyboard shortcuts for quick control:
   - `Space` or `S` - Start/Stop
   - `↑/↓` - Adjust BPM
   - `←/→` - Previous/Next step
   - `Esc` - Stop

## 🛠️ Technical Details

### Architecture
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom component styling
- **Audio**: Tone.js for metronome functionality
- **UI Components**: React with Bootstrap integration

### Project Structure
```
src/
├── app/                    # Next.js app router
├── components/
│   ├── metro/             # Metronome components (from Metro Master)
│   ├── AcousticVisualization.tsx
│   ├── DiatonicShakuhachiCalculator.tsx
│   ├── MetronomeTab.tsx
│   ├── ShakuhachiCalculator.tsx
│   └── VariationShakuhachiCalculator.tsx
├── types/                 # TypeScript type definitions
public/
├── audio/                 # Sound files for metronome
└── ...
```

### Key Dependencies
- `next`: React framework
- `react`: UI library
- `typescript`: Type checking
- `tailwindcss`: Utility-first CSS
- `tone`: Web Audio API framework
- `bootstrap`: UI components
- `rc-slider`: Range slider components

## 🎯 Features in Detail

### Metronome Modes
- **Set Time**: Fixed practice duration with automatic BPM progression
- **By Bar**: Increase tempo every N bars
- **By Time**: Increase tempo every N seconds  
- **Constant**: Fixed tempo practice

### After Plan Options
- **Stop**: Stop when plan completes
- **Continue**: Keep playing at final BPM
- **Repeat**: Loop the entire plan

### Step Order Options
- **Up and Down**: Ascend then descend through BPM range
- **Shuffle**: Randomize step order for varied practice

## 📜 Credits

### Shakuhachi Algorithms
- **Nelson Zink**: Original calculation algorithms
- **Jeremy Bornstein**: Initial implementation
- **Tran Nghia**: Extended flute length support
- **Jacopo Saporetti**: Diatonic version

### Metronome Integration
- **Metro Master**: Original metronome application
- **Integration**: Modern React/Next.js adaptation

## 📄 License

This project builds upon open-source shakuhachi calculation tools and integrates the Metro Master metronome for educational and craft purposes.

## 🐛 Issues & Contributions

If you encounter issues or would like to contribute:
1. Check existing issues
2. Create detailed bug reports
3. Submit pull requests with clear descriptions

---

**About Shakuhachi**: The shakuhachi is a traditional Japanese bamboo flute. This tool helps instrument makers calculate precise finger hole positions based on acoustic principles and ergonomic considerations, while providing practice tools for players.

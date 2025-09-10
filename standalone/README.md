# Shakuhachi Calculator & Metronome - Standalone Edition

A lightweight, dependency-free web application for shakuhachi flute calculations and digital metronome functionality. This version runs entirely in the browser without requiring any server installation or external dependencies.

## Features

### 🎋 Shakuhachi Calculators

#### Traditional 5-Hole Calculator
- Calculate hole positions based on traditional proportions
- 8 different maker styles including Nelson Zink, John Neptune, Ken LaCosse, Atsuya Okuda, and more
- Environmental parameters (temperature, humidity) affect calculations
- Displays traditional note names (Ro, Tsu, Re, Chi, Ri)
- Includes thumb hole calculations

#### Diatonic 7-Hole Calculator
- Western diatonic scale calculations
- Multiple root note options (C, D, E, F, G, A, B)
- Major scale interval calculations
- Modern notation display

#### Multi-Style Comparison
- Compare all 8 maker styles side-by-side
- Detailed hole position analysis
- Frequency and note calculations for each style

### 🎵 Digital Metronome
- BPM range: 40-200
- Multiple time signatures (2/4, 3/4, 4/4, 6/8, 8/8, etc.)
- Tap tempo functionality
- Visual beat indicator with accent highlighting
- Pendulum animation
- Multiple sound options (Digital Click, Wood Block, Electronic Beep)
- Volume control
- Accent first beat option

## Usage

### Quick Start
1. Download or clone this directory
2. Open `index.html` in any modern web browser
3. No installation or server required!

### On Mobile Devices
- Works offline once loaded
- Responsive design optimized for touch
- Add to home screen for app-like experience

### Calculations
1. Select the appropriate calculator tab
2. Enter your flute specifications
3. Adjust environmental parameters if needed
4. Click "Calculate" to see results

### Metronome
1. Go to the Metronome tab
2. Set your desired BPM using slider or +/- buttons
3. Choose time signature
4. Select sound type and adjust volume
5. Click Play to start

## Technical Details

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Mobile browsers with Web Audio API support

### Audio Engine
- Uses Web Audio API for precise timing
- Generates sounds programmatically (no audio files needed)
- Fallback for browsers without audio support

### Storage
- Settings saved to browser localStorage
- No external database required
- Data persists between sessions

## File Structure
```
standalone/
├── index.html              # Main application file
├── styles/
│   ├── main.css            # Base application styles
│   ├── shakuhachi.css      # Calculator-specific styles
│   └── metronome.css       # Metronome-specific styles
├── js/
│   ├── audio-engine.js     # Web Audio API implementation
│   ├── shakuhachi-calculator.js # Calculation logic
│   ├── metronome.js        # Metronome functionality
│   └── app.js              # Main application controller
└── README.md               # This file
```

## Maker Styles Included

1. **Nelson Zink - Navaching.com** - Traditional proportions based on research
2. **John Neptune** - Contemporary maker with refined proportions
3. **Ken LaCosse** - Professional maker known for concert flutes
4. **Atsuya Okuda** - Traditional Japanese master craftsman
5. **Yamaguchi - Shugetsu** - Classical Yamaguchi school proportions
6. **Nishimura Koku** - Modern interpretation of classical style
7. **Kodama Hiroyuki - YouTube 1** - YouTube teaching series proportions
8. **Kodama Hiroyuki - Hoi An 2** - Hoi An workshop refined proportions

## Physics & Acoustics

The calculator uses accurate acoustic formulas:
- Speed of sound calculation with temperature and humidity compensation
- Open tube resonance formulas for frequency calculations
- Traditional Japanese proportional systems
- Western equal temperament note identification

## Offline Usage

This application works completely offline:
1. Load the page once while connected to internet
2. Browser will cache all files
3. Use without internet connection
4. All calculations performed locally

## Customization

Easy to modify and extend:
- Add new maker styles in `shakuhachi-calculator.js`
- Customize sounds in `audio-engine.js`
- Modify styling in CSS files
- All code is well-commented and modular

## License

This standalone version is designed for educational and personal use. Please respect the original research and work of the various shakuhachi makers referenced in the calculations.

## Troubleshooting

### Audio Not Working
- Ensure browser supports Web Audio API
- Check browser audio permissions
- Try different sound types
- Refresh page if audio becomes unresponsive

### Calculations Seem Wrong
- Verify input parameters are within valid ranges
- Check environmental conditions (temperature/humidity)
- Compare with multiple maker styles for reference

### Mobile Issues
- Use in landscape mode for better experience
- Ensure touch events are enabled
- Try adding to home screen for better performance

## Support

This is a standalone application designed to work independently. For issues:
1. Check browser console for error messages
2. Verify all files are present and accessible
3. Try in a different browser
4. Clear browser cache and reload

Enjoy your shakuhachi journey! 🎋🎵

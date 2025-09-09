# Shakuhachi Makers Tool

A modern web application for calculating precise hole positions for making traditional and diatonic shakuhachi flutes.

## Features

- **Traditional Shakuhachi Calculator (5-hole)**: Calculate hole positions for traditional shakuhachi with pentatonic scale
- **Diatonic Shakuhachi Calculator (7-hole)**: Calculate hole positions for diatonic shakuhachi with natural major scale
- **Interactive Parameters**: Adjust flute length, hole diameter, bore diameter, wall thickness, and ergonomic limits
- **Real-time Calculations**: See results update instantly as you modify parameters
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

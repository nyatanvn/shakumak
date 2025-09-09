# Metronome Audio Debug Notes

## Current Status
- **Visual Interface**: ✅ Working perfectly
- **Audio Playback**: ❌ Not working (needs debugging)
- **Application**: ✅ Compiles and runs successfully on localhost:3001

## What's Working
1. All 4 tabs load correctly (Traditional, Diatonic, Variation, Metronome)
2. Metronome tab displays track view, tempo controls, start/stop buttons
3. Audio files successfully copied from metro-master to public/audio/
4. React refs modernized (no more string refs errors)
5. Tone.js API compatibility fixed (`removeAll()` → `clear()`, `.toMaster()` → `.toDestination()`)
6. SoundLibrary error handling improved with try-catch blocks

## Audio Files Available
- public/audio/basicdrumkit/ (Kick.wav, Snare.wav, ClosedHat.wav, OpenHat.wav)
- public/audio/electrokit/ (Kick.wav, Snare.wav, HiHat.wav)
- public/audio/metronome/ (tap.wav, down.wav, up.wav)
- public/audio/tabla/ (dha-slide.wav, dhin-slide.wav, tin.wav)
- public/audio/yamaha_rx5/ (Kick.wav, Rim.wav, Ride.wav, Cowbell.wav, Shaker.wav)

## Potential Audio Issues to Debug
1. **Tone.js Initialization**: May need `Tone.start()` user interaction
2. **Audio Context**: Modern browsers require user gesture before audio
3. **Player Loading**: Check if Tone.Players.add() is working correctly
4. **Volume/Routing**: Audio might be muted or routed incorrectly
5. **Timing**: Part scheduling might not be triggering player.start()

## Next Steps for Audio Debug
1. Add console.log to SoundLibrary.play() method
2. Check browser console for Tone.js errors
3. Verify audio context is started after user interaction
4. Test individual player.start() calls
5. Check if this.part.progress is updating during playback
6. Verify audio routing (players → reverb → destination)

## Components Modified (Working)
- src/components/metro/SoundLibrary.jsx (error handling, dispose/delete logic)
- src/components/metro/SoundMachine.jsx (removeAll → clear)
- src/components/metro/TrackView/TrackRow.jsx (refs modernized)
- src/components/metro/TrackView/TrackView.jsx (refs updated)
- src/components/metro/Vis.jsx (refs modernized)
- src/components/metro/Sliders/*.jsx (refs modernized)
- src/components/metro/SimpleVis.jsx (dynamic refs array)

## Backup Information
- Git commit: 7d712e7 "✅ WORKING STATE: Metronome visual integration complete"
- Filesystem backup: shakumak-backup-visual-working-[timestamp]
- All changes saved and recoverable

## Quick Audio Test Commands
```javascript
// In browser console:
await Tone.start()
const player = new Tone.Player('./audio/metronome/tap.wav').toDestination()
await player.load()
player.start()
```

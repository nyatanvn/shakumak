import * as Tone from 'tone'
import { Samples, InstrumentsByKey } from './Instruments';

class SoundLibrary  {
    players = new Tone.Players({})
    playersArr = []; 
    playerCounter = 0; // Add counter for unique keys
  
    reverb = new Tone.Reverb().toDestination();

    constructor(props) {
        // this is required for convolution rever to generate IR profile
        this.reverb.decay = 4;
        this.reverb.predelay = 0.05;
        this.reverb.generate();

        this.reverb.wet.value = 0;
        this.players.connect(this.reverb);
        this.players.toDestination();
    }

   
    use(idx, instrumentKey, file) {
        const instrument = InstrumentsByKey[instrumentKey];
        
        console.log(`SoundLibrary.use called: idx=${idx}, instrumentKey=${instrumentKey}, file=${file}`);

        // Generate unique key to avoid buffer conflicts
        this.playerCounter++;
        const playerKey = `player_${idx}_${this.playerCounter}_${Date.now()}`;

        // Clean up any existing player at this index
        if (this.playersArr[idx]) {
            console.log('Disposing existing player at index:', idx);
            try {
                if (this.playersArr[idx].dispose && typeof this.playersArr[idx].dispose === 'function') {
                    this.playersArr[idx].dispose();
                }
                if (this.playersArr[idx].playerKey && this.players.has(this.playersArr[idx].playerKey)) {
                    this.players.remove(this.playersArr[idx].playerKey);
                }
            } catch (e) {
                console.warn('Error disposing existing player at index:', idx, e);
            }
            this.playersArr[idx] = null;
        }

        try {
            // Add the new player with unique key
            console.log('Adding new player with unique key:', playerKey);
            this.players.add(playerKey, './audio/' + instrumentKey + '/' + file);
            
            let player = this.players.get(playerKey);
            console.log('Player created:', player);
            
            if (player) {
                player.instrument = instrument;
                player.file = file;
                player.idx = idx;
                player.playerKey = playerKey; // Store the key for cleanup
                player.fullLabel = Samples.find(el => el.file === file)?.label || 'Unknown';
                this.playersArr[idx] = player;
                
                // Add loading listener for modern Tone.js
                player.onstop = () => {}; // Reset any existing handlers
                player.onload = () => {
                    console.log(`Player ${idx} (${file}) loaded successfully`);
                };
                
                console.log('Player successfully added to array:', this.playersArr[idx]);
            } else {
                console.error('Failed to get player after adding');
                // Create a dummy player to prevent crashes
                this.playersArr[idx] = {
                    instrument: instrument,
                    file: file,
                    idx: idx,
                    playerKey: playerKey,
                    fullLabel: Samples.find(el => el.file === file)?.label || 'Error Loading',
                    loaded: false,
                    start: () => console.warn('Player failed to load:', file)
                };
            }
        } catch (e) {
            console.error('Error adding player:', e);
            // Create a dummy player to prevent crashes
            this.playersArr[idx] = {
                instrument: instrument,
                file: file,
                idx: idx,
                playerKey: playerKey,
                fullLabel: Samples.find(el => el.file === file)?.label || 'Error Loading',
                loaded: false,
                start: () => console.warn('Player failed to load:', file)
            };
        }
    }

    getSamples() {
        let samples = [];
        this.playersArr.map(player => {
            samples.push({
                file: player.file,
                instrumentKey: player.instrument.key
            })
            // expected to return value from arrow func
            return true;
        });
        return samples;
    }

    play(trackIdx, time) {
        // Reduced logging to prevent console spam
        const player = this.playersArr[trackIdx];
        
        if (player && player.playerKey) {
            try {
                // Use the stored unique playerKey
                this.players.player(player.playerKey).start(time);
                // Only log first few successful plays to avoid spam
                if (this.playCount === undefined) this.playCount = 0;
                if (this.playCount < 3) {
                    console.log(`🔊 Playing ${player.fullLabel} (track ${trackIdx})`);
                    this.playCount++;
                }
            } catch (e) {
                console.error('Error starting via Players collection:', e);
                
                // Fallback: try direct player.start if it exists
                try {
                    if (typeof player.start === 'function') {
                        console.log('Fallback: using direct player.start');
                        player.start(time);
                    } else {
                        console.log('No start method available on player');
                    }
                } catch (e2) {
                    console.error('Fallback also failed:', e2);
                }
            }
        } else {
            console.warn(`No player found for track ${trackIdx} or missing playerKey`);
        }
    }

    setReverb(wet) {
        this.reverb.wet.value = wet;
    }
}
export default SoundLibrary;
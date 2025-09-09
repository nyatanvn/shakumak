import * as Tone from 'tone'
import { Samples, InstrumentsByKey } from './Instruments';

class SoundLibrary  {
    players = new Tone.Players({})
    playersArr = []; 
  
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
        const playerKey = 'player_' + idx;

        console.log(`SoundLibrary.use called: idx=${idx}, instrumentKey=${instrumentKey}, file=${file}`);

        // Check if player already exists and dispose it properly
        if (this.players.has(playerKey)) {
            console.log('Player already exists, disposing...');
            try {
                const existingPlayer = this.players.get(playerKey);
                if (existingPlayer && typeof existingPlayer.dispose === 'function') {
                    existingPlayer.dispose();
                }
                // Remove from the players collection
                this.players.delete(playerKey);
                console.log('Existing player disposed and removed');
            } catch (e) {
                console.warn('Error disposing existing player:', e);
            }
        }

        try {
            // Now add the new player
            console.log('Adding new player with key:', playerKey);
            this.players.add(playerKey, './audio/' + instrumentKey + '/' + file);
            
            let player = this.players.get(playerKey);
            console.log('Player created:', player);
            
            if (player) {
                player.instrument = instrument;
                player.file = file;
                player.idx = idx;
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
            }
        } catch (e) {
            console.error('Error adding player:', e);
            // Create a dummy player to prevent crashes
            this.playersArr[idx] = {
                instrument: instrument,
                file: file,
                idx: idx,
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
        
        if (player) {
            try {
                // In Tone.js v15+, use the Players collection to play by key
                const playerKey = 'player_' + trackIdx;
                this.players.player(playerKey).start(time);
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
        }
    }

    setReverb(wet) {
        this.reverb.wet.value = wet;
    }
}
export default SoundLibrary;
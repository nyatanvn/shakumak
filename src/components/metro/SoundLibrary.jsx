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

        // Remove existing player if it exists to avoid "buffer already exists" error
        if (this.players.has(playerKey)) {
            try {
                const existingPlayer = this.players.get(playerKey);
                if (existingPlayer && typeof existingPlayer.dispose === 'function') {
                    existingPlayer.dispose();
                }
            } catch (e) {
                console.warn('Error disposing player:', e);
            }
            try {
                this.players.delete(playerKey);
            } catch (e) {
                console.warn('Error deleting player:', e);
            }
        }

        try {
            // Create a dummy player first for missing audio files
            const audioPath = `./audio/${instrumentKey}/${file}`;
            console.log(`Attempting to load: ${audioPath}`);
            
            this.players.add(playerKey, audioPath);
            
            let player = this.players.get(playerKey);
            if (player) {
                player.instrument = instrument;
                player.file = file;
                player.idx = idx;
                player.fullLabel = Samples.find(el => el.file === file)?.label || 'Unknown';
                this.playersArr[idx] = player;
            }
        } catch (e) {
            console.warn(`Failed to load audio file: ./audio/${instrumentKey}/${file}`, e);
            // Create a dummy player object to prevent further errors
            this.playersArr[idx] = {
                instrument: instrument,
                file: file,
                idx: idx,
                fullLabel: Samples.find(el => el.file === file)?.label || 'Missing Audio',
                loaded: false,
                start: () => console.warn('Audio file not loaded:', file)
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
        const player = this.playersArr[trackIdx];
        if (player && player.loaded) {
            player.start(time);
        }
    }

    setReverb(wet) {
        this.reverb.wet.value = wet;
    }
}
export default SoundLibrary;
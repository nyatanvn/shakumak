// Advanced Audio Engine for Metronome with Multiple Drum Kits

class AdvancedAudioEngine {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.volume = 0.7;
        this.currentKit = 'basicdrumkit';
        this.initAudio();
    }

    initAudio() {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
            
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            this.gainNode.gain.value = this.volume;
            
            this.generateAllKits();
        } catch (error) {
            console.warn('Audio not available:', error);
        }
    }

    generateAllKits() {
        this.sounds = {
            basicdrumkit: {
                kick: this.generateKick(),
                snare: this.generateSnare(),
                hihat: this.generateHiHat(),
                closedhat: this.generateClosedHat(),
                accent: this.generateAccentKick()
            },
            electrokit: {
                kick: this.generateElectroKick(),
                snare: this.generateElectroSnare(),
                hihat: this.generateElectroHat(),
                closedhat: this.generateElectroHat(),
                accent: this.generateElectroAccent()
            },
            yamaha_rx5: {
                kick: this.generateAnalogKick(),
                snare: this.generateAnalogSnare(),
                hihat: this.generateAnalogHat(),
                ride: this.generateRide(),
                cowbell: this.generateCowbell(),
                accent: this.generateAnalogAccent()
            },
            tabla: {
                dha: this.generateDha(),
                dhin: this.generateDhin(),
                tin: this.generateTin(),
                accent: this.generateTablaAccent()
            },
            digital: {
                click: this.generateClick(800, 0.1),
                accent: this.generateClick(1200, 0.15),
                tick: this.generateTick(),
                tock: this.generateTock()
            }
        };
    }

    // Basic Drum Kit Sounds
    generateKick() {
        const duration = 0.5;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 5);
            const pitch = 60 * Math.exp(-t * 30);
            
            const kick = Math.sin(2 * Math.PI * pitch * t) * envelope;
            const noise = (Math.random() - 0.5) * 0.3 * Math.exp(-t * 10);
            
            data[i] = (kick + noise) * 0.8;
        }
        return buffer;
    }

    generateSnare() {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 8);
            
            const tone = Math.sin(2 * Math.PI * 200 * t) * 0.3;
            const noise = (Math.random() - 0.5) * 0.8;
            const crack = Math.sin(2 * Math.PI * 3000 * t) * Math.exp(-t * 20) * 0.2;
            
            data[i] = (tone + noise + crack) * envelope * 0.6;
        }
        return buffer;
    }

    generateHiHat() {
        const duration = 0.15;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 15);
            
            let noise = 0;
            for (let freq = 8000; freq < 16000; freq += 1000) {
                noise += Math.sin(2 * Math.PI * freq * t) * (Math.random() - 0.5);
            }
            
            data[i] = noise * envelope * 0.3;
        }
        return buffer;
    }

    generateClosedHat() {
        const duration = 0.08;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 25);
            
            const noise = (Math.random() - 0.5) * envelope;
            const metallic = Math.sin(2 * Math.PI * 12000 * t) * envelope * 0.3;
            
            data[i] = (noise + metallic) * 0.4;
        }
        return buffer;
    }

    generateAccentKick() {
        const duration = 0.6;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 4);
            const pitch = 80 * Math.exp(-t * 25);
            
            const kick = Math.sin(2 * Math.PI * pitch * t) * envelope;
            const harmonics = Math.sin(2 * Math.PI * pitch * 2 * t) * envelope * 0.3;
            const click = Math.sin(2 * Math.PI * 2000 * t) * Math.exp(-t * 20) * 0.2;
            
            data[i] = (kick + harmonics + click) * 0.9;
        }
        return buffer;
    }

    // Electro Kit Sounds
    generateElectroKick() {
        const duration = 0.4;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 6);
            const pitch = 50 * Math.exp(-t * 20);
            
            const sine = Math.sin(2 * Math.PI * pitch * t);
            const distortion = Math.sign(sine * 3) * Math.min(Math.abs(sine * 3), 1);
            
            data[i] = distortion * envelope * 0.7;
        }
        return buffer;
    }

    generateElectroSnare() {
        const duration = 0.25;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 10);
            
            const tone = Math.sin(2 * Math.PI * 220 * t) * 0.4;
            const noise = (Math.random() - 0.5) * 0.6;
            const punch = Math.sin(2 * Math.PI * 150 * t) * Math.exp(-t * 30) * 0.5;
            
            data[i] = (tone + noise + punch) * envelope * 0.8;
        }
        return buffer;
    }

    generateElectroHat() {
        const duration = 0.12;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 20);
            
            const digital = Math.sin(2 * Math.PI * 10000 * t) * (Math.random() - 0.5);
            const pulse = Math.sign(Math.sin(2 * Math.PI * 8000 * t)) * envelope;
            
            data[i] = (digital + pulse) * envelope * 0.4;
        }
        return buffer;
    }

    generateElectroAccent() {
        const duration = 0.5;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 5);
            
            const bass = Math.sin(2 * Math.PI * 60 * t) * envelope;
            const mid = Math.sin(2 * Math.PI * 440 * t) * envelope * 0.5;
            const high = Math.sin(2 * Math.PI * 2000 * t) * Math.exp(-t * 15) * 0.3;
            
            data[i] = (bass + mid + high) * 0.8;
        }
        return buffer;
    }

    // Analog/RX5 Sounds
    generateAnalogKick() {
        const duration = 0.8;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 3);
            const pitch = 70 * Math.exp(-t * 15);
            
            const fundamental = Math.sin(2 * Math.PI * pitch * t);
            const harmonics = Math.sin(2 * Math.PI * pitch * 1.5 * t) * 0.3;
            const punch = Math.sin(2 * Math.PI * pitch * 3 * t) * Math.exp(-t * 20) * 0.2;
            
            data[i] = (fundamental + harmonics + punch) * envelope * 0.9;
        }
        return buffer;
    }

    generateAnalogSnare() {
        const duration = 0.4;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 6);
            
            const tone1 = Math.sin(2 * Math.PI * 220 * t) * 0.4;
            const tone2 = Math.sin(2 * Math.PI * 330 * t) * 0.3;
            const noise = (Math.random() - 0.5) * 0.7;
            const snap = Math.sin(2 * Math.PI * 8000 * t) * Math.exp(-t * 25) * 0.3;
            
            data[i] = (tone1 + tone2 + noise + snap) * envelope * 0.7;
        }
        return buffer;
    }

    generateAnalogHat() {
        const duration = 0.2;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 12);
            
            let metallic = 0;
            const freqs = [8000, 10000, 12000, 15000];
            freqs.forEach(freq => {
                metallic += Math.sin(2 * Math.PI * freq * t) * (Math.random() - 0.5);
            });
            
            data[i] = metallic * envelope * 0.35;
        }
        return buffer;
    }

    generateRide() {
        const duration = 1.0;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 2);
            
            const fundamental = Math.sin(2 * Math.PI * 3000 * t) * 0.3;
            const shimmer = Math.sin(2 * Math.PI * 5000 * t) * (Math.random() - 0.5) * 0.4;
            const bell = Math.sin(2 * Math.PI * 1200 * t) * envelope * 0.2;
            
            data[i] = (fundamental + shimmer + bell) * envelope * 0.5;
        }
        return buffer;
    }

    generateCowbell() {
        const duration = 0.5;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 4);
            
            const fundamental = Math.sin(2 * Math.PI * 800 * t);
            const overtone = Math.sin(2 * Math.PI * 1200 * t) * 0.7;
            const metallic = Math.sin(2 * Math.PI * 2000 * t) * 0.3;
            
            data[i] = (fundamental + overtone + metallic) * envelope * 0.6;
        }
        return buffer;
    }

    generateAnalogAccent() {
        return this.generateCowbell(); // Use cowbell as accent for RX5
    }

    // Tabla Sounds
    generateDha() {
        const duration = 0.6;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 4);
            const pitch = 120 * (1 - t * 0.3); // Pitch bend down
            
            const fundamental = Math.sin(2 * Math.PI * pitch * t);
            const membrane = Math.sin(2 * Math.PI * pitch * 2.1 * t) * 0.4;
            const slap = Math.sin(2 * Math.PI * 400 * t) * Math.exp(-t * 20) * 0.3;
            
            data[i] = (fundamental + membrane + slap) * envelope * 0.7;
        }
        return buffer;
    }

    generateDhin() {
        const duration = 0.8;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 3);
            const pitch = 90 * (1 - t * 0.4); // Deeper pitch bend
            
            const bass = Math.sin(2 * Math.PI * pitch * t);
            const resonance = Math.sin(2 * Math.PI * pitch * 1.8 * t) * 0.5;
            const attack = Math.sin(2 * Math.PI * 300 * t) * Math.exp(-t * 15) * 0.4;
            
            data[i] = (bass + resonance + attack) * envelope * 0.8;
        }
        return buffer;
    }

    generateTin() {
        const duration = 0.3;
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 8);
            
            const high = Math.sin(2 * Math.PI * 800 * t);
            const sharp = Math.sin(2 * Math.PI * 1600 * t) * 0.6;
            const finger = (Math.random() - 0.5) * 0.2 * Math.exp(-t * 30);
            
            data[i] = (high + sharp + finger) * envelope * 0.5;
        }
        return buffer;
    }

    generateTablaAccent() {
        return this.generateDha(); // Use dha as accent for tabla
    }

    // Digital Sounds
    generateClick(frequency = 800, duration = 0.1) {
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * duration, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / this.audioContext.sampleRate;
            const envelope = Math.exp(-t * 10);
            data[i] = Math.sin(2 * Math.PI * frequency * t) * envelope * 0.3;
        }
        return buffer;
    }

    generateTick() {
        return this.generateClick(1000, 0.05);
    }

    generateTock() {
        return this.generateClick(800, 0.08);
    }

    async resumeContext() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    playSound(soundType = 'kick', isAccent = false, kit = null) {
        if (!this.audioContext) return;

        try {
            this.resumeContext();
            
            const currentKit = kit || this.currentKit;
            const kitSounds = this.sounds[currentKit];
            
            if (!kitSounds) return;

            let soundBuffer;
            if (isAccent && kitSounds.accent) {
                soundBuffer = kitSounds.accent;
            } else if (kitSounds[soundType]) {
                soundBuffer = kitSounds[soundType];
            } else {
                // Fallback to first available sound
                soundBuffer = Object.values(kitSounds)[0];
            }
            
            if (!soundBuffer) return;
            
            const source = this.audioContext.createBufferSource();
            source.buffer = soundBuffer;
            source.connect(this.gainNode);
            source.start();
        } catch (error) {
            console.warn('Error playing sound:', error);
        }
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.gainNode) {
            this.gainNode.gain.value = this.volume;
        }
    }

    setKit(kitName) {
        if (this.sounds[kitName]) {
            this.currentKit = kitName;
        }
    }

    getAvailableKits() {
        return Object.keys(this.sounds);
    }

    getKitSounds(kitName) {
        return this.sounds[kitName] ? Object.keys(this.sounds[kitName]) : [];
    }

    isAvailable() {
        return !!this.audioContext;
    }
}

// Export for use in other modules
window.AdvancedAudioEngine = AdvancedAudioEngine;

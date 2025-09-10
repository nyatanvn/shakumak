// Advanced Metronome with Multiple Practice Modes

class AdvancedMetronome {
    constructor() {
        this.isPlaying = false;
        this.bpm = 120;
        this.timeSignature = { numerator: 4, denominator: 4 };
        this.currentBeat = 0;
        this.intervalId = null;
        this.audioEngine = null;
        this.volume = 0.7;
        this.soundKit = 'basicdrumkit';
        this.accentFirstBeat = true;
        this.tapTimes = [];
        this.countIn = false;
        this.subdivisions = false;
        
        // Practice modes
        this.mode = 'constant'; // constant, accelerando, ritardando, steps, plan
        this.modeSettings = {
            constant: {},
            accelerando: {
                startBpm: 80,
                endBpm: 160,
                duration: 60, // seconds
                currentBpm: 80
            },
            ritardando: {
                startBpm: 160,
                endBpm: 80,
                duration: 60,
                currentBpm: 160
            },
            steps: {
                startBpm: 80,
                endBpm: 160,
                stepSize: 10,
                barsPerStep: 8,
                currentStep: 0,
                currentBar: 0
            },
            plan: {
                exercises: [],
                currentExercise: 0
            }
        };
        
        // Visual elements
        this.pendulumDirection = 1;
        this.clockRotation = 0;
        
        // Bar counting
        this.currentBar = 0;
        this.totalBeats = 0;
        
        this.initAudio();
        this.initPresets();
    }

    initAudio() {
        if (window.AdvancedAudioEngine) {
            this.audioEngine = new window.AdvancedAudioEngine();
        }
    }

    initPresets() {
        this.presets = {
            'basic-4-4': {
                name: 'Basic 4/4 - 120 BPM',
                bpm: 120,
                timeSignature: { numerator: 4, denominator: 4 },
                mode: 'constant',
                soundKit: 'basicdrumkit',
                accentFirstBeat: true
            },
            'waltz': {
                name: 'Waltz 3/4 - 90 BPM',
                bpm: 90,
                timeSignature: { numerator: 3, denominator: 4 },
                mode: 'constant',
                soundKit: 'basicdrumkit',
                accentFirstBeat: true
            },
            'fast-practice': {
                name: 'Fast Practice - 160 BPM',
                bpm: 160,
                timeSignature: { numerator: 4, denominator: 4 },
                mode: 'constant',
                soundKit: 'electrokit',
                accentFirstBeat: true
            },
            'slow-practice': {
                name: 'Slow Practice - 60 BPM',
                bpm: 60,
                timeSignature: { numerator: 4, denominator: 4 },
                mode: 'constant',
                soundKit: 'digital',
                accentFirstBeat: true
            }
        };
    }

    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.currentBeat = 0;
        this.currentBar = 0;
        this.totalBeats = 0;
        
        // Initialize mode-specific settings
        this.initializeMode();
        
        // Count-in if enabled
        if (this.countIn) {
            this.startCountIn();
        } else {
            this.startMainSequence();
        }
    }

    startCountIn() {
        let countInBeats = this.timeSignature.numerator * 2; // 2 bars
        let currentCountBeat = 0;
        
        const countInInterval = 60000 / this.bpm;
        
        const countInId = setInterval(() => {
            this.playBeat(true); // isCountIn = true
            this.updateVisuals(true);
            currentCountBeat++;
            
            if (currentCountBeat >= countInBeats) {
                clearInterval(countInId);
                this.currentBeat = 0;
                this.startMainSequence();
            }
        }, countInInterval);
    }

    startMainSequence() {
        // Calculate initial interval
        let interval = 60000 / this.getCurrentBpm();
        
        // Play first beat immediately
        this.playBeat();
        this.updateVisuals();
        
        // Set up main interval
        this.intervalId = setInterval(() => {
            this.playBeat();
            this.updateVisuals();
            this.processModeLogic();
            
            // Update interval if BPM changed (for accelerando/ritardando)
            const newInterval = 60000 / this.getCurrentBpm();
            if (Math.abs(newInterval - interval) > 1) {
                clearInterval(this.intervalId);
                interval = newInterval;
                this.intervalId = setInterval(() => {
                    this.playBeat();
                    this.updateVisuals();
                    this.processModeLogic();
                }, interval);
            }
        }, interval);
    }

    stop() {
        if (!this.isPlaying) return;
        
        this.isPlaying = false;
        this.currentBeat = 0;
        this.currentBar = 0;
        this.totalBeats = 0;
        
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        
        this.resetModeSettings();
        this.updateUI();
        this.resetVisuals();
    }

    playBeat(isCountIn = false) {
        if (!this.audioEngine) return;
        
        const isAccent = this.accentFirstBeat && this.currentBeat === 0;
        
        // Determine sound based on kit and position
        let soundType = 'kick';
        if (this.soundKit === 'basicdrumkit' || this.soundKit === 'electrokit') {
            soundType = this.currentBeat === 0 ? 'kick' : 'hihat';
        } else if (this.soundKit === 'yamaha_rx5') {
            soundType = this.currentBeat === 0 ? 'kick' : 'hihat';
        } else if (this.soundKit === 'tabla') {
            soundType = this.currentBeat === 0 ? 'dha' : 'tin';
        } else if (this.soundKit === 'digital') {
            soundType = this.currentBeat === 0 ? 'click' : 'tick';
        }
        
        this.audioEngine.playSound(soundType, isAccent, this.soundKit);
        
        if (!isCountIn) {
            // Advance to next beat
            this.currentBeat = (this.currentBeat + 1) % this.timeSignature.numerator;
            this.totalBeats++;
            
            // Count bars
            if (this.currentBeat === 0) {
                this.currentBar++;
            }
        }
    }

    getCurrentBpm() {
        switch (this.mode) {
            case 'accelerando':
                return this.modeSettings.accelerando.currentBpm;
            case 'ritardando':
                return this.modeSettings.ritardando.currentBpm;
            case 'steps':
                const stepSettings = this.modeSettings.steps;
                const stepsBpm = stepSettings.startBpm + (stepSettings.currentStep * stepSettings.stepSize);
                return Math.min(stepsBpm, stepSettings.endBpm);
            default:
                return this.bpm;
        }
    }

    initializeMode() {
        switch (this.mode) {
            case 'accelerando':
                this.modeSettings.accelerando.currentBpm = this.modeSettings.accelerando.startBpm;
                break;
            case 'ritardando':
                this.modeSettings.ritardando.currentBpm = this.modeSettings.ritardando.startBpm;
                break;
            case 'steps':
                this.modeSettings.steps.currentStep = 0;
                this.modeSettings.steps.currentBar = 0;
                break;
            case 'plan':
                this.modeSettings.plan.currentExercise = 0;
                break;
        }
    }

    processModeLogic() {
        switch (this.mode) {
            case 'accelerando':
                this.processAccelerando();
                break;
            case 'ritardando':
                this.processRitardando();
                break;
            case 'steps':
                this.processSteps();
                break;
            case 'plan':
                this.processPlan();
                break;
        }
    }

    processAccelerando() {
        const settings = this.modeSettings.accelerando;
        const beatsPerSecond = this.totalBeats / (Date.now() - this.startTime) * 1000;
        const elapsed = this.totalBeats / (settings.currentBpm / 60);
        
        if (elapsed < settings.duration) {
            const progress = elapsed / settings.duration;
            settings.currentBpm = settings.startBpm + 
                (settings.endBpm - settings.startBpm) * progress;
        }
    }

    processRitardando() {
        const settings = this.modeSettings.ritardando;
        const elapsed = this.totalBeats / (settings.currentBpm / 60);
        
        if (elapsed < settings.duration) {
            const progress = elapsed / settings.duration;
            settings.currentBpm = settings.startBpm - 
                (settings.startBpm - settings.endBpm) * progress;
        }
    }

    processSteps() {
        const settings = this.modeSettings.steps;
        
        if (this.currentBeat === 0) { // New bar
            settings.currentBar++;
            
            if (settings.currentBar >= settings.barsPerStep) {
                settings.currentStep++;
                settings.currentBar = 0;
                
                const newBpm = settings.startBpm + (settings.currentStep * settings.stepSize);
                if (newBpm <= settings.endBpm) {
                    // BPM will be updated by getCurrentBpm()
                } else {
                    this.stop(); // Reached end
                }
            }
        }
    }

    processPlan() {
        const settings = this.modeSettings.plan;
        if (settings.exercises.length === 0) return;
        
        const currentExercise = settings.exercises[settings.currentExercise];
        if (!currentExercise) return;
        
        // Check if current exercise is complete
        if (this.currentBar >= currentExercise.bars) {
            settings.currentExercise++;
            this.currentBar = 0;
            
            if (settings.currentExercise >= settings.exercises.length) {
                this.stop(); // Plan complete
            } else {
                // Switch to next exercise
                const nextExercise = settings.exercises[settings.currentExercise];
                this.setBPM(nextExercise.bpm);
                this.setTimeSignature(nextExercise.numerator, nextExercise.denominator);
            }
        }
    }

    resetModeSettings() {
        // Reset all mode settings to defaults
        this.modeSettings.accelerando.currentBpm = this.modeSettings.accelerando.startBpm;
        this.modeSettings.ritardando.currentBpm = this.modeSettings.ritardando.startBpm;
        this.modeSettings.steps.currentStep = 0;
        this.modeSettings.steps.currentBar = 0;
        this.modeSettings.plan.currentExercise = 0;
    }

    setBPM(newBPM) {
        newBPM = Math.max(40, Math.min(300, newBPM));
        this.bpm = newBPM;
        
        // If playing and in constant mode, restart with new tempo
        if (this.isPlaying && this.mode === 'constant') {
            this.stop();
            setTimeout(() => this.start(), 50);
        }
        
        this.updateUI();
    }

    setMode(newMode) {
        const wasPlaying = this.isPlaying;
        if (wasPlaying) this.stop();
        
        this.mode = newMode;
        this.updateModeControls();
        
        if (wasPlaying) {
            setTimeout(() => this.start(), 100);
        }
    }

    setTimeSignature(numerator, denominator) {
        this.timeSignature.numerator = parseInt(numerator);
        this.timeSignature.denominator = parseInt(denominator);
        this.currentBeat = 0;
        this.updateUI();
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
        if (this.audioEngine) {
            this.audioEngine.setVolume(this.volume);
        }
        this.updateUI();
    }

    setSoundKit(kit) {
        this.soundKit = kit;
        if (this.audioEngine) {
            this.audioEngine.setKit(kit);
        }
    }

    setAccentFirstBeat(accent) {
        this.accentFirstBeat = accent;
    }

    setCountIn(countIn) {
        this.countIn = countIn;
    }

    setSubdivisions(subdivisions) {
        this.subdivisions = subdivisions;
    }

    tapTempo() {
        const now = Date.now();
        this.tapTimes.push(now);
        
        if (this.tapTimes.length > 8) {
            this.tapTimes.shift();
        }
        
        if (this.tapTimes.length >= 2) {
            const intervals = [];
            for (let i = 1; i < this.tapTimes.length; i++) {
                intervals.push(this.tapTimes[i] - this.tapTimes[i - 1]);
            }
            
            const averageInterval = intervals.reduce((a, b) => a + b) / intervals.length;
            const calculatedBPM = Math.round(60000 / averageInterval);
            
            if (calculatedBPM >= 40 && calculatedBPM <= 300) {
                this.setBPM(calculatedBPM);
            }
        }
        
        setTimeout(() => {
            this.tapTimes = this.tapTimes.filter(time => now - time < 3000);
        }, 3000);
    }

    updateVisuals(isCountIn = false) {
        this.updateBeatIndicator(isCountIn);
        this.updateClock();
    }

    updateBeatIndicator(isCountIn = false) {
        // Reset all beat lights
        for (let i = 1; i <= 12; i++) {
            const beatLight = document.getElementById(`beat-${i}`);
            if (beatLight) {
                beatLight.classList.remove('active', 'accent');
                if (i <= this.timeSignature.numerator) {
                    beatLight.style.display = 'flex';
                } else {
                    beatLight.style.display = 'none';
                }
            }
        }
        
        if (isCountIn) {
            // Show count-in visual
            const beatNum = (this.currentBeat % this.timeSignature.numerator) + 1;
            const currentBeatElement = document.getElementById(`beat-${beatNum}`);
            if (currentBeatElement) {
                currentBeatElement.classList.add('active');
                currentBeatElement.style.backgroundColor = '#ffc107'; // Count-in color
            }
        } else {
            // Activate current beat
            const currentBeatElement = document.getElementById(`beat-${this.currentBeat + 1}`);
            if (currentBeatElement) {
                currentBeatElement.classList.add('active');
                if (this.accentFirstBeat && this.currentBeat === 0) {
                    currentBeatElement.classList.add('accent');
                }
            }
        }
    }

    updateClock() {
        const clockHand = document.getElementById('clock-hand');
        if (clockHand) {
            // Calculate rotation based on current beat
            const beatsPerRevolution = this.timeSignature.numerator;
            const rotationPerBeat = 360 / beatsPerRevolution;
            this.clockRotation = this.currentBeat * rotationPerBeat;
            
            const centerX = 100;
            const centerY = 100;
            const radius = 70;
            
            const angleRad = (this.clockRotation - 90) * Math.PI / 180;
            const endX = centerX + radius * Math.cos(angleRad);
            const endY = centerY + radius * Math.sin(angleRad);
            
            clockHand.setAttribute('x2', endX);
            clockHand.setAttribute('y2', endY);
        }
        
        // Update beat markers
        this.updateClockMarkers();
    }

    updateClockMarkers() {
        const markersGroup = document.getElementById('clock-markers');
        if (!markersGroup) return;
        
        markersGroup.innerHTML = '';
        
        const centerX = 100;
        const centerY = 100;
        const radius = 85;
        
        for (let i = 0; i < this.timeSignature.numerator; i++) {
            const angle = (i * 360 / this.timeSignature.numerator - 90) * Math.PI / 180;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            
            const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            marker.setAttribute('cx', x);
            marker.setAttribute('cy', y);
            marker.setAttribute('r', i === this.currentBeat ? '6' : '4');
            marker.setAttribute('fill', i === this.currentBeat ? '#667eea' : '#e9ecef');
            marker.setAttribute('stroke', '#495057');
            marker.setAttribute('stroke-width', '1');
            
            markersGroup.appendChild(marker);
        }
    }

    resetVisuals() {
        // Reset beat indicators
        for (let i = 1; i <= 12; i++) {
            const beatLight = document.getElementById(`beat-${i}`);
            if (beatLight) {
                beatLight.classList.remove('active', 'accent');
                beatLight.style.backgroundColor = '';
            }
        }
        
        // Reset clock
        const clockHand = document.getElementById('clock-hand');
        if (clockHand) {
            clockHand.setAttribute('x2', '100');
            clockHand.setAttribute('y2', '20');
        }
        
        this.clockRotation = 0;
        this.updateClockMarkers();
    }

    updateModeControls() {
        const modeControlsContainer = document.getElementById('mode-controls');
        if (!modeControlsContainer) return;
        
        let html = '';
        
        switch (this.mode) {
            case 'constant':
                html = '<p class="mode-description">Steady tempo practice</p>';
                break;
                
            case 'accelerando':
                html = `
                    <div class="mode-settings">
                        <div class="input-group">
                            <label>Start BPM:</label>
                            <input type="number" id="accel-start" value="${this.modeSettings.accelerando.startBpm}" min="40" max="300">
                        </div>
                        <div class="input-group">
                            <label>End BPM:</label>
                            <input type="number" id="accel-end" value="${this.modeSettings.accelerando.endBpm}" min="40" max="300">
                        </div>
                        <div class="input-group">
                            <label>Duration (seconds):</label>
                            <input type="number" id="accel-duration" value="${this.modeSettings.accelerando.duration}" min="10" max="300">
                        </div>
                    </div>
                `;
                break;
                
            case 'ritardando':
                html = `
                    <div class="mode-settings">
                        <div class="input-group">
                            <label>Start BPM:</label>
                            <input type="number" id="rit-start" value="${this.modeSettings.ritardando.startBpm}" min="40" max="300">
                        </div>
                        <div class="input-group">
                            <label>End BPM:</label>
                            <input type="number" id="rit-end" value="${this.modeSettings.ritardando.endBpm}" min="40" max="300">
                        </div>
                        <div class="input-group">
                            <label>Duration (seconds):</label>
                            <input type="number" id="rit-duration" value="${this.modeSettings.ritardando.duration}" min="10" max="300">
                        </div>
                    </div>
                `;
                break;
                
            case 'steps':
                html = `
                    <div class="mode-settings">
                        <div class="input-group">
                            <label>Start BPM:</label>
                            <input type="number" id="steps-start" value="${this.modeSettings.steps.startBpm}" min="40" max="300">
                        </div>
                        <div class="input-group">
                            <label>End BPM:</label>
                            <input type="number" id="steps-end" value="${this.modeSettings.steps.endBpm}" min="40" max="300">
                        </div>
                        <div class="input-group">
                            <label>Step Size:</label>
                            <input type="number" id="steps-size" value="${this.modeSettings.steps.stepSize}" min="1" max="50">
                        </div>
                        <div class="input-group">
                            <label>Bars per Step:</label>
                            <input type="number" id="steps-bars" value="${this.modeSettings.steps.barsPerStep}" min="1" max="32">
                        </div>
                    </div>
                `;
                break;
                
            case 'plan':
                html = `
                    <div class="mode-settings">
                        <div class="plan-builder">
                            <h4>Practice Plan</h4>
                            <div class="exercise-list" id="exercise-list">
                                <!-- Exercises will be added here -->
                            </div>
                            <div class="add-exercise">
                                <input type="number" id="exercise-bpm" placeholder="BPM" min="40" max="300" value="120">
                                <input type="number" id="exercise-bars" placeholder="Bars" min="1" max="64" value="8">
                                <select id="exercise-time-sig">
                                    <option value="4/4">4/4</option>
                                    <option value="3/4">3/4</option>
                                    <option value="2/4">2/4</option>
                                    <option value="6/8">6/8</option>
                                </select>
                                <button id="add-exercise-btn" class="mode-btn">Add Exercise</button>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }
        
        modeControlsContainer.innerHTML = html;
        this.bindModeEventListeners();
    }

    bindModeEventListeners() {
        // Bind event listeners for mode-specific controls
        switch (this.mode) {
            case 'accelerando':
                const accelStart = document.getElementById('accel-start');
                const accelEnd = document.getElementById('accel-end');
                const accelDuration = document.getElementById('accel-duration');
                
                if (accelStart) accelStart.addEventListener('change', (e) => {
                    this.modeSettings.accelerando.startBpm = parseInt(e.target.value);
                });
                if (accelEnd) accelEnd.addEventListener('change', (e) => {
                    this.modeSettings.accelerando.endBpm = parseInt(e.target.value);
                });
                if (accelDuration) accelDuration.addEventListener('change', (e) => {
                    this.modeSettings.accelerando.duration = parseInt(e.target.value);
                });
                break;
                
            case 'ritardando':
                const ritStart = document.getElementById('rit-start');
                const ritEnd = document.getElementById('rit-end');
                const ritDuration = document.getElementById('rit-duration');
                
                if (ritStart) ritStart.addEventListener('change', (e) => {
                    this.modeSettings.ritardando.startBpm = parseInt(e.target.value);
                });
                if (ritEnd) ritEnd.addEventListener('change', (e) => {
                    this.modeSettings.ritardando.endBpm = parseInt(e.target.value);
                });
                if (ritDuration) ritDuration.addEventListener('change', (e) => {
                    this.modeSettings.ritardando.duration = parseInt(e.target.value);
                });
                break;
                
            case 'steps':
                const stepsStart = document.getElementById('steps-start');
                const stepsEnd = document.getElementById('steps-end');
                const stepsSize = document.getElementById('steps-size');
                const stepsBars = document.getElementById('steps-bars');
                
                if (stepsStart) stepsStart.addEventListener('change', (e) => {
                    this.modeSettings.steps.startBpm = parseInt(e.target.value);
                });
                if (stepsEnd) stepsEnd.addEventListener('change', (e) => {
                    this.modeSettings.steps.endBpm = parseInt(e.target.value);
                });
                if (stepsSize) stepsSize.addEventListener('change', (e) => {
                    this.modeSettings.steps.stepSize = parseInt(e.target.value);
                });
                if (stepsBars) stepsBars.addEventListener('change', (e) => {
                    this.modeSettings.steps.barsPerStep = parseInt(e.target.value);
                });
                break;
                
            case 'plan':
                const addExerciseBtn = document.getElementById('add-exercise-btn');
                if (addExerciseBtn) {
                    addExerciseBtn.addEventListener('click', () => this.addExercise());
                }
                this.updateExerciseList();
                break;
        }
    }

    addExercise() {
        const bpmInput = document.getElementById('exercise-bpm');
        const barsInput = document.getElementById('exercise-bars');
        const timeSigSelect = document.getElementById('exercise-time-sig');
        
        if (!bpmInput || !barsInput || !timeSigSelect) return;
        
        const bpm = parseInt(bpmInput.value);
        const bars = parseInt(barsInput.value);
        const timeSig = timeSigSelect.value.split('/');
        
        this.modeSettings.plan.exercises.push({
            bpm,
            bars,
            numerator: parseInt(timeSig[0]),
            denominator: parseInt(timeSig[1])
        });
        
        this.updateExerciseList();
        
        // Clear inputs
        bpmInput.value = '120';
        barsInput.value = '8';
        timeSigSelect.value = '4/4';
    }

    updateExerciseList() {
        const exerciseList = document.getElementById('exercise-list');
        if (!exerciseList) return;
        
        let html = '';
        this.modeSettings.plan.exercises.forEach((exercise, index) => {
            html += `
                <div class="exercise-item">
                    <span>Exercise ${index + 1}: ${exercise.bpm} BPM, ${exercise.bars} bars, ${exercise.numerator}/${exercise.denominator}</span>
                    <button onclick="app.metronome.removeExercise(${index})" class="remove-btn">Remove</button>
                </div>
            `;
        });
        
        exerciseList.innerHTML = html;
    }

    removeExercise(index) {
        this.modeSettings.plan.exercises.splice(index, 1);
        this.updateExerciseList();
    }

    updateUI() {
        // Update BPM display
        const bpmValue = document.getElementById('bpm-value');
        if (bpmValue) {
            const displayBpm = this.isPlaying ? this.getCurrentBpm() : this.bpm;
            bpmValue.textContent = Math.round(displayBpm);
        }
        
        // Update BPM slider
        const bpmSlider = document.getElementById('bpm-slider');
        if (bpmSlider && this.mode === 'constant') {
            bpmSlider.value = this.bpm;
        }
        
        // Update play/pause button
        const playButton = document.getElementById('play-pause');
        if (playButton) {
            if (this.isPlaying) {
                playButton.textContent = '⏸ Pause';
                playButton.classList.add('playing');
            } else {
                playButton.textContent = '▶ Play';
                playButton.classList.remove('playing');
            }
        }
        
        // Update volume display
        const volumeDisplay = document.getElementById('volume-display');
        if (volumeDisplay) {
            volumeDisplay.textContent = Math.round(this.volume * 100) + '%';
        }
        
        // Update mode buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.mode === this.mode) {
                btn.classList.add('active');
            }
        });
        
        // Update visual indicators
        this.updateBeatIndicator();
        this.updateClockMarkers();
    }

    // Preset management
    savePreset(name) {
        const preset = {
            name: name,
            bpm: this.bpm,
            timeSignature: { ...this.timeSignature },
            mode: this.mode,
            modeSettings: JSON.parse(JSON.stringify(this.modeSettings)),
            soundKit: this.soundKit,
            accentFirstBeat: this.accentFirstBeat,
            countIn: this.countIn,
            subdivisions: this.subdivisions
        };
        
        try {
            const savedPresets = JSON.parse(localStorage.getItem('metronome-presets') || '{}');
            savedPresets[name] = preset;
            localStorage.setItem('metronome-presets', JSON.stringify(savedPresets));
            this.updatePresetSelect();
        } catch (e) {
            console.warn('Could not save preset:', e);
        }
    }

    loadPreset(name) {
        let preset = this.presets[name];
        
        if (!preset) {
            try {
                const savedPresets = JSON.parse(localStorage.getItem('metronome-presets') || '{}');
                preset = savedPresets[name];
            } catch (e) {
                console.warn('Could not load preset:', e);
                return;
            }
        }
        
        if (!preset) return;
        
        const wasPlaying = this.isPlaying;
        if (wasPlaying) this.stop();
        
        this.bpm = preset.bpm;
        this.timeSignature = { ...preset.timeSignature };
        this.mode = preset.mode || 'constant';
        if (preset.modeSettings) {
            this.modeSettings = JSON.parse(JSON.stringify(preset.modeSettings));
        }
        this.soundKit = preset.soundKit || 'basicdrumkit';
        this.accentFirstBeat = preset.accentFirstBeat !== undefined ? preset.accentFirstBeat : true;
        this.countIn = preset.countIn || false;
        this.subdivisions = preset.subdivisions || false;
        
        this.setSoundKit(this.soundKit);
        this.updateModeControls();
        this.updateUI();
        
        if (wasPlaying) {
            setTimeout(() => this.start(), 100);
        }
    }

    deletePreset(name) {
        try {
            const savedPresets = JSON.parse(localStorage.getItem('metronome-presets') || '{}');
            delete savedPresets[name];
            localStorage.setItem('metronome-presets', JSON.stringify(savedPresets));
            this.updatePresetSelect();
        } catch (e) {
            console.warn('Could not delete preset:', e);
        }
    }

    updatePresetSelect() {
        const presetSelect = document.getElementById('preset-select');
        if (!presetSelect) return;
        
        let html = '<option value="">Select Preset...</option>';
        
        // Add built-in presets
        Object.keys(this.presets).forEach(key => {
            html += `<option value="${key}">${this.presets[key].name}</option>`;
        });
        
        // Add saved presets
        try {
            const savedPresets = JSON.parse(localStorage.getItem('metronome-presets') || '{}');
            Object.keys(savedPresets).forEach(key => {
                html += `<option value="${key}">${savedPresets[key].name} (Custom)</option>`;
            });
        } catch (e) {
            console.warn('Could not load saved presets:', e);
        }
        
        presetSelect.innerHTML = html;
    }

    // Get current state for persistence
    getState() {
        return {
            bpm: this.bpm,
            timeSignature: this.timeSignature,
            mode: this.mode,
            modeSettings: this.modeSettings,
            volume: this.volume,
            soundKit: this.soundKit,
            accentFirstBeat: this.accentFirstBeat,
            countIn: this.countIn,
            subdivisions: this.subdivisions
        };
    }

    // Restore state from persistence
    setState(state) {
        if (state.bpm) this.setBPM(state.bpm);
        if (state.timeSignature) this.setTimeSignature(state.timeSignature.numerator, state.timeSignature.denominator);
        if (state.mode) this.setMode(state.mode);
        if (state.modeSettings) this.modeSettings = { ...this.modeSettings, ...state.modeSettings };
        if (state.volume !== undefined) this.setVolume(state.volume);
        if (state.soundKit) this.setSoundKit(state.soundKit);
        if (state.accentFirstBeat !== undefined) this.setAccentFirstBeat(state.accentFirstBeat);
        if (state.countIn !== undefined) this.setCountIn(state.countIn);
        if (state.subdivisions !== undefined) this.setSubdivisions(state.subdivisions);
    }
}

// Export for global use
window.AdvancedMetronome = AdvancedMetronome;

// Advanced Shakuhachi Calculator & Metronome App

class ShakuhachiMetronomeApp {
    constructor() {
        this.metronome = null;
        this.calculator = null;
        this.currentTab = 'variation';
        
        this.init();
    }

    init() {
        this.initAudio();
        this.initComponents();
        this.bindEvents();
        this.loadSettings();
        this.showTab(this.currentTab);
    }

    initAudio() {
        // Initialize Web Audio API context
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            window.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    initComponents() {
        // Initialize metronome
        if (window.AdvancedMetronome) {
            this.metronome = new window.AdvancedMetronome();
        }

        // Initialize shakuhachi calculator
        if (window.AdvancedShakuhachiCalculator) {
            this.calculator = new window.AdvancedShakuhachiCalculator();
        }
    }

    bindEvents() {
        // Tab switching
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.showTab(tabName);
            });
        });

        // Metronome controls
        this.bindMetronomeEvents();
        
        // Shakuhachi calculator controls
        this.bindCalculatorEvents();
    }

    bindMetronomeEvents() {
        // Play/Pause button
        const playPauseBtn = document.getElementById('play-pause');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => {
                if (this.metronome.isPlaying) {
                    this.metronome.stop();
                } else {
                    this.metronome.start();
                }
            });
        }

        // BPM controls
        const bpmSlider = document.getElementById('bpm-slider');
        if (bpmSlider) {
            bpmSlider.addEventListener('input', (e) => {
                this.metronome.setBPM(parseInt(e.target.value));
            });
        }

        const bpmMinus = document.getElementById('bpm-minus');
        const bpmPlus = document.getElementById('bpm-plus');
        if (bpmMinus) {
            bpmMinus.addEventListener('click', () => {
                this.metronome.setBPM(this.metronome.bpm - 1);
            });
        }
        if (bpmPlus) {
            bpmPlus.addEventListener('click', () => {
                this.metronome.setBPM(this.metronome.bpm + 1);
            });
        }

        // Tap tempo
        const tapBtn = document.getElementById('tap-tempo');
        if (tapBtn) {
            tapBtn.addEventListener('click', () => {
                this.metronome.tapTempo();
            });
        }

        // Time signature
        const timeSigNumerator = document.getElementById('time-sig-numerator');
        const timeSigDenominator = document.getElementById('time-sig-denominator');
        if (timeSigNumerator) {
            timeSigNumerator.addEventListener('change', (e) => {
                this.metronome.setTimeSignature(e.target.value, this.metronome.timeSignature.denominator);
            });
        }
        if (timeSigDenominator) {
            timeSigDenominator.addEventListener('change', (e) => {
                this.metronome.setTimeSignature(this.metronome.timeSignature.numerator, e.target.value);
            });
        }

        // Volume control
        const volumeSlider = document.getElementById('volume-slider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => {
                this.metronome.setVolume(e.target.value / 100);
            });
        }

        // Sound kit selection
        const soundKitSelect = document.getElementById('sound-kit');
        if (soundKitSelect) {
            soundKitSelect.addEventListener('change', (e) => {
                this.metronome.setSoundKit(e.target.value);
            });
        }

        // Mode selection
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                if (mode) {
                    this.metronome.setMode(mode);
                }
            });
        });

        // Options
        const accentCheck = document.getElementById('accent-first');
        const countInCheck = document.getElementById('count-in');
        const subdivisionsCheck = document.getElementById('subdivisions');

        if (accentCheck) {
            accentCheck.addEventListener('change', (e) => {
                this.metronome.setAccentFirstBeat(e.target.checked);
            });
        }
        if (countInCheck) {
            countInCheck.addEventListener('change', (e) => {
                this.metronome.setCountIn(e.target.checked);
            });
        }
        if (subdivisionsCheck) {
            subdivisionsCheck.addEventListener('change', (e) => {
                this.metronome.setSubdivisions(e.target.checked);
            });
        }

        // Presets
        const presetSelect = document.getElementById('preset-select');
        const savePresetBtn = document.getElementById('save-preset');
        const presetNameInput = document.getElementById('preset-name');

        if (presetSelect) {
            presetSelect.addEventListener('change', (e) => {
                if (e.target.value) {
                    this.metronome.loadPreset(e.target.value);
                }
            });
        }

        if (savePresetBtn && presetNameInput) {
            savePresetBtn.addEventListener('click', () => {
                const name = presetNameInput.value.trim();
                if (name) {
                    this.metronome.savePreset(name);
                    presetNameInput.value = '';
                }
            });
        }

        // Initialize presets dropdown
        if (this.metronome) {
            this.metronome.updatePresetSelect();
        }
    }

    bindCalculatorEvents() {
        // Length input
        const lengthInput = document.getElementById('flute-length');
        if (lengthInput) {
            lengthInput.addEventListener('input', () => {
                this.updateCalculations();
            });
        }

        // Wall thickness input
        const wallThicknessInput = document.getElementById('wall-thickness');
        if (wallThicknessInput) {
            wallThicknessInput.addEventListener('input', () => {
                this.updateCalculations();
            });
        }

        // End correction input
        const endCorrectionInput = document.getElementById('end-correction');
        if (endCorrectionInput) {
            endCorrectionInput.addEventListener('input', () => {
                this.updateCalculations();
            });
        }

        // Maker style selection
        const makerSelect = document.getElementById('maker-style');
        if (makerSelect) {
            makerSelect.addEventListener('change', () => {
                this.updateCalculations();
            });
        }

        // Auto-calculate checkbox
        const autoCalcCheck = document.getElementById('auto-calculate');
        if (autoCalcCheck) {
            autoCalcCheck.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.updateCalculations();
                }
            });
        }

        // Manual calculate button
        const calculateBtn = document.getElementById('calculate-btn');
        if (calculateBtn) {
            calculateBtn.addEventListener('click', () => {
                this.updateCalculations();
            });
        }

        // Calculation type radio buttons
        document.querySelectorAll('input[name="calculation-type"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateCalculations();
            });
        });

        // Initial calculation
        setTimeout(() => this.updateCalculations(), 100);
    }

    updateCalculations() {
        if (!this.calculator) return;

        const lengthInput = document.getElementById('flute-length');
        const wallThicknessInput = document.getElementById('wall-thickness');
        const endCorrectionInput = document.getElementById('end-correction');
        const makerSelect = document.getElementById('maker-style');
        const calculationType = document.querySelector('input[name="calculation-type"]:checked');

        if (!lengthInput || !wallThicknessInput || !endCorrectionInput || !makerSelect || !calculationType) {
            return;
        }

        const length = parseFloat(lengthInput.value);
        const wallThickness = parseFloat(wallThicknessInput.value);
        const endCorrection = parseFloat(endCorrectionInput.value);
        const makerStyle = makerSelect.value;
        const calcType = calculationType.value;

        if (!length || length <= 0) return;

        let results;
        if (calcType === 'traditional') {
            results = this.calculator.calculateTraditional(length, wallThickness, endCorrection, makerStyle);
        } else {
            results = this.calculator.calculateFiveHole(length, wallThickness, endCorrection, makerStyle);
        }

        if (results) {
            this.displayResults(results);
        }
    }

    displayResults(results) {
        const resultsContainer = document.getElementById('calculation-results');
        if (!resultsContainer) return;

        let html = '<div class="results-content">';

        // Basic information
        html += `
            <div class="result-section">
                <h3>Basic Information</h3>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="label">Fundamental Frequency:</span>
                        <span class="value">${results.fundamentalFreq.toFixed(2)} Hz</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Base Note:</span>
                        <span class="value">${results.baseNote}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Pitch:</span>
                        <span class="value">${results.pitch}</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Cents Deviation:</span>
                        <span class="value ${Math.abs(results.centsDeviation) > 20 ? 'warning' : ''}">${results.centsDeviation > 0 ? '+' : ''}${results.centsDeviation.toFixed(1)} cents</span>
                    </div>
                </div>
            </div>
        `;

        // Hole positions
        if (results.holes && results.holes.length > 0) {
            html += `
                <div class="result-section">
                    <h3>Hole Positions</h3>
                    <div class="holes-table">
                        <div class="table-header">
                            <span>Hole</span>
                            <span>Distance from Top (mm)</span>
                            <span>Distance from Bottom (mm)</span>
                            <span>Note</span>
                            <span>Frequency (Hz)</span>
                        </div>
            `;

            results.holes.forEach((hole, index) => {
                const distanceFromBottom = results.effectiveLength - hole.position;
                html += `
                    <div class="table-row">
                        <span>Hole ${index + 1}</span>
                        <span>${hole.position.toFixed(1)}</span>
                        <span>${distanceFromBottom.toFixed(1)}</span>
                        <span>${hole.note}</span>
                        <span>${hole.frequency.toFixed(2)}</span>
                    </div>
                `;
            });

            html += '</div></div>';
        }

        // Ergonomic analysis
        if (results.ergonomics) {
            html += `
                <div class="result-section">
                    <h3>Ergonomic Analysis</h3>
                    <div class="result-grid">
                        <div class="result-item">
                            <span class="label">Playability Score:</span>
                            <span class="value ${results.ergonomics.score >= 8 ? 'good' : results.ergonomics.score >= 6 ? 'fair' : 'poor'}">${results.ergonomics.score.toFixed(1)}/10</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Largest Stretch:</span>
                            <span class="value">${results.ergonomics.maxStretch.toFixed(1)} mm</span>
                        </div>
                        <div class="result-item">
                            <span class="label">Average Hole Spacing:</span>
                            <span class="value">${results.ergonomics.avgSpacing.toFixed(1)} mm</span>
                        </div>
                    </div>
                    <div class="ergonomic-notes">
                        ${results.ergonomics.notes.map(note => `<p>${note}</p>`).join('')}
                    </div>
                </div>
            `;
        }

        // Acoustic properties
        html += `
            <div class="result-section">
                <h3>Acoustic Properties</h3>
                <div class="result-grid">
                    <div class="result-item">
                        <span class="label">Effective Length:</span>
                        <span class="value">${results.effectiveLength.toFixed(1)} mm</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Internal Diameter:</span>
                        <span class="value">${results.internalDiameter.toFixed(1)} mm</span>
                    </div>
                    <div class="result-item">
                        <span class="label">Bore/Length Ratio:</span>
                        <span class="value">${(results.internalDiameter / results.effectiveLength * 100).toFixed(2)}%</span>
                    </div>
                </div>
            </div>
        `;

        html += '</div>';
        resultsContainer.innerHTML = html;
    }

    showTab(tabName) {
        this.currentTab = tabName;

        // Update navigation
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.tab === tabName) {
                btn.classList.add('active');
            }
        });

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        const activeTab = document.getElementById(`${tabName}-tab`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Initialize metronome mode controls when switching to metronome tab
        if (tabName === 'metronome' && this.metronome) {
            setTimeout(() => {
                this.metronome.updateModeControls();
                this.metronome.updateUI();
            }, 50);
        }

        this.saveSettings();
    }

    saveSettings() {
        try {
            const settings = {
                currentTab: this.currentTab
            };

            if (this.metronome) {
                settings.metronome = this.metronome.getState();
            }

            localStorage.setItem('shakuhachi-app-settings', JSON.stringify(settings));
        } catch (e) {
            console.warn('Could not save settings:', e);
        }
    }

    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('shakuhachi-app-settings');
            if (!savedSettings) return;

            const settings = JSON.parse(savedSettings);

            if (settings.currentTab) {
                this.currentTab = settings.currentTab;
            }

            if (settings.metronome && this.metronome) {
                this.metronome.setState(settings.metronome);
            }
        } catch (e) {
            console.warn('Could not load settings:', e);
        }
    }

    // Keyboard shortcuts
    handleKeyboard(event) {
        // Space bar - play/pause metronome
        if (event.code === 'Space' && this.currentTab === 'metronome') {
            event.preventDefault();
            if (this.metronome) {
                if (this.metronome.isPlaying) {
                    this.metronome.stop();
                } else {
                    this.metronome.start();
                }
            }
        }

        // Tab switching
        if (event.ctrlKey || event.metaKey) {
            switch (event.key) {
                case '1':
                    event.preventDefault();
                    this.showTab('variation');
                    break;
                case '2':
                    event.preventDefault();
                    this.showTab('metronome');
                    break;
            }
        }

        // BPM adjustment
        if (this.currentTab === 'metronome' && this.metronome) {
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                this.metronome.setBPM(this.metronome.bpm + 1);
            } else if (event.key === 'ArrowDown') {
                event.preventDefault();
                this.metronome.setBPM(this.metronome.bpm - 1);
            }
        }
    }

    // Touch support for mobile
    initTouchSupport() {
        // Prevent zoom on double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', function (event) {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                event.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Enable tap tempo on mobile
        const tapBtn = document.getElementById('tap-tempo');
        if (tapBtn) {
            tapBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (this.metronome) {
                    this.metronome.tapTempo();
                }
            });
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ShakuhachiMetronomeApp();
    
    // Bind keyboard events
    document.addEventListener('keydown', (e) => {
        window.app.handleKeyboard(e);
    });
    
    // Initialize touch support
    window.app.initTouchSupport();
    
    console.log('Advanced Shakuhachi Calculator & Metronome App initialized');
});

// Handle page visibility changes to pause metronome
document.addEventListener('visibilitychange', () => {
    if (document.hidden && window.app && window.app.metronome && window.app.metronome.isPlaying) {
        window.app.metronome.stop();
    }
});

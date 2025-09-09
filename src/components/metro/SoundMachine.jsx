import React, { Component } from "react";
import * as Tone from "tone";
import { Container, Row, Col } from "reactstrap";
import SimplePanel from './SimplePanel'
import { Button } from 'reactstrap'
import { InitPreset } from './PresetsLib'
import Planner from './Planner'
import Tr from './Locale'
import PresetsManager from './PresetsManager'
import SvgClock from "./SvgClock";
import ModePanel from './ModePanel'
import TrackView from './TrackView/TrackView'
import KeyboardEventHandler from 'react-keyboard-event-handler'
import Config from './Config'
import SoundLibrary from "./SoundLibrary";
import AdvancedSlider from "./Sliders/AdvancedSlider";

class SoundMachine extends Component {
	soundLibrary = new SoundLibrary();

	// Create refs for all components
	bpmInfoRef = React.createRef();
	volumeSliderRef = React.createRef();
	reverbSliderRef = React.createRef();
	svgClockRef = React.createRef();
	modePanelRef = React.createRef();
	trackViewRef = React.createRef();
	plannerRef = React.createRef();
	presetsManagerRef = React.createRef();
	debugRef = React.createRef();

	state = {
		initialized: false,
		config: InitPreset,
		track: this.props.track,
		timeSignature: this.props.timeSignature
	};

	transport = Tone.Transport;
	tone = Tone;

	componentDidMount() {
		Tone.Transport.lookAhead = 10;

		// initialize main loop
		this.part = new Tone.Part((time, note) => this.repeat(time, note), [])
		this.part.loop = true;
		// this.part.humanize = true;
		this.part.start(0)


		const config = this.getConfig();
		this.setPlan(config);

		this.initProgressUpdate();
		this.documentTitle = document.title;

		this.setState({ initialized: true })
		this.props.onReady();
	}

	getConfig() {
		return { ...this.modePanelRef.current.state, ...{ track: this.state.track }, ...{ timeSignature: this.state.timeSignature }, ...{ samples: this.soundLibrary.getSamples() } };
	}

	initProgressUpdate() {
		setInterval(() => this.onProgress(), 1000 / Config.PROGRESS_UPDATE_FPS)
	}

	setPlan(config) {
		// cancel all events
		this.transport.cancel();
		this.transport.position = 0;
		this.setTrack(config.track.slice(), config.timeSignature);	// TODO: Unsure why we need to pass copy
		this.plannerRef.current.setPlan(config);

	}

	// trackRow.length determine polyrhythm measure, timeSignature is main time signature we relate polyrythms to
	createPoly(trackRow, trackIdx, timeSignature) {
		const ticks = this.tone.Time("1m").toTicks();
		const interval = ticks / trackRow.length;

		for (let i = 0; i < trackRow.length; i++) {
			if (trackRow[i] > 0) {
				this.part.add(interval.toFixed(0) * i + 'i', trackIdx);
			}
		}
	}

	setTrack(track, timeSignature) {
		if (this.state.track === track) {
			return;
		}

		// make sure we have 4 tracks
		if (track.length < Config.TRACKS_NUMBER) {
			track.push(new Array(timeSignature).fill(0));
		}
		this.setTimeSignature(timeSignature);

		this.part.clear();

		for (let i = 0; i < track.length; i++) {
			this.createPoly(track[i], i, timeSignature)
		}
		this.part.loopEnd = '1m'
		this.part.start(0);

		this.setState({ track: track, timeSignature: timeSignature })

	}

	onProgress() {
		if (this.transport.state === 'stopped') {
			return;
		}
		if (this.debugRef.current) {
			this.debugRef.current.innerHTML = this.transport.seconds.toFixed(1)
		}

		if (this.plannerRef.current) { this.plannerRef.current.updateProgress() }

		this.svgClockRef.current.setProgress(this.part.progress)
		this.trackViewRef.current.setProgress(this.part.progress)
	}

	repeat = (time, trackIdx) => {
		this.soundLibrary.play(trackIdx, time)
	}

	calcTimeForBpm(seconds, bpm) {
		return Tone.Time(seconds * bpm / this.baseBpm);
	}

	setTimeSignature(timeSignature) {
		if (timeSignature !== this.transport.timeSignature) {
			this.transport.timeSignature = timeSignature;
		}
	}

	setBpm = bpm => {

		if (isNaN(bpm) || bpm <= 0 || bpm > 1200) {
			throw new Error("Invalid BPM value: " + bpm)
		}

		if (bpm !== this.transport.bpm.value) {
			Tone.Transport.bpm.value = bpm;

			document.title = bpm.toFixed(0) + ' | ' + this.documentTitle;

			// the animation and overflow retrigger seems to make metronome bit jiggery, unsure if we should implement it
			// this.refs.bpmInfo.classList.remove('bump')
			// void this.refs.bpmInfo.offsetWidth;
			// this.refs.bpmInfo.classList.add('bump');
			// const bpmInfo = this.refs.bpmInfo
			// bpmInfo.addEventListener( "animationend",  function() {
			// 	bpmInfo.classList.remove("bump");
			//   } );
			this.setState({ bpm: bpm })
		}
	};

	toggle() {
		Tone.Transport.state === 'started' ? this.stop() : this.start();
	};

	onPlanStep(bpm) {
		this.setBpm(bpm);
	}

	onControlChange() {
		const v = this.getConfig();
		this.setPlan(v);
	}

	onPresetSelect(preset) {
		// set preset's stuff
		this.setState({ track: preset.track, timeSignature: preset.timeSignature }, function () {
			this.modePanelRef.current.setValue(preset)
		});

		// set instruments
		for (let i = 0; i < preset.samples.length; i++) {
			this.soundLibrary.use(i, preset.samples[i].instrumentKey, preset.samples[i].file)
		}
	}


	onTrackChange(newTrack, timeSignature) {
		if (this.state.timeSignature !== timeSignature) {
			// length changed so after setting track, recreate Plan
			const config = this.getConfig();
			config.track = newTrack;
			config.timeSignature = timeSignature;
			this.setPlan(config);
		}
		else {
			this.setTrack(newTrack, timeSignature)
		}
	}

	onVolumeChange(newVolume) {
		this.tone.Master.volume.value = -60 + (newVolume * 60 / 100) + 6
	}

	onReverbChange(value) {
		this.soundLibrary.setReverb(value / 100)
	}

	handleKey(key, e) {
		e.preventDefault();
		switch (key) {
			case 's':
			case 'space':
				this.toggle();
				break;
			case 'esc':
				this.stop();
				break;
			case 'left':
				this.plannerRef.current.stepBackward()
				break;
			case 'right':
				this.plannerRef.current.stepForward()
				break;
			case 'up':
				if (this.state.bpm < 1200) {
					this.setBpm(this.state.bpm + 1);
				}
				break;
			case 'down':
				if (this.state.bpm > 10) {
					this.setBpm(this.state.bpm - 1);
				}
				break;
			case 'shift+up':
				if (this.state.bpm < 1200) {
					this.setBpm(this.state.bpm + 10);
				}
				break;
			case 'shift+down':
				if (this.state.bpm > 10) {
					this.setBpm(this.state.bpm - 10);
				}
				break;
			default:
				break;
		}
	}
	render() {
		return (

			<>
				<KeyboardEventHandler handleKeys={['s', 'space', 'esc', 'left', 'right', 'up', 'down', 'shift+up', 'shift+down']} onKeyEvent={(key, e) => this.handleKey(key, e)} />
				<Container>
					<Row>
						<Col>
							<SimplePanel title={Tr('Control')}>
								<Row>
									<Col>
										<Button
											// color="primary"
											onClick={() => this.toggle()}
											color={this.state.isPlaying ? 'secondary' : 'light'}
											// outline
											block
										>
											{Tr("Start / Stop")}
										</Button>
									</Col>
								</Row>

								<Row><Col><h2><span ref={this.bpmInfoRef} className='badge badge-dark bpm-info'>BPM: {Tone.Transport.bpm.value.toFixed(0)}</span></h2></Col>
								</Row>
								<Row>
									<Col>
										<div>
											{Tr("Volume")}
										</div>
										<div>
											<AdvancedSlider
												ref={this.volumeSliderRef}
												// included={false}
												min={0}
												disableBtns={true}
												btnStep={1}
												max={100}
												defaultValue={90}
												// marks={{ 30:k '30', 200: '200', 400: '400', 600: '600', 800: '800', 1000: '1000',  1200: '1200' }}
												// value={this.state.constantBpmSlider}
												onChange={(newVolume) => this.onVolumeChange(newVolume)}
											/>
										</div>
										<div>{Tr("Reverb")}</div>
										<div>
											<AdvancedSlider
												ref={this.reverbSliderRef}
												// included={false}
												min={0}
												disableBtns={true}
												btnStep={1}
												max={100}
												defaultValue={0}
												// marks={{ 30:k '30', 200: '200', 400: '400', 600: '600', 800: '800', 1000: '1000',  1200: '1200' }}
												// value={this.state.constantBpmSlider}
												onChange={(newVolume) => this.onReverbChange(newVolume)}
											/>
										</div>
									</Col>
								</Row>

							</SimplePanel>

						</Col>
						<Col style={{ margin: 'auto' }}>
							<SvgClock ref={this.svgClockRef} soundLibrary={this.soundLibrary} timeSignature={this.state.timeSignature} track={this.state.track} />
						</Col>

					</Row>
					<Row>
						<ModePanel
							ref={this.modePanelRef}
							transport={this.transport}
							onChange={() => this.onControlChange()}
						/>
					</Row>
					<Row>
						<Col>
							<TrackView
								ref={this.trackViewRef}
								soundLibrary={this.soundLibrary}
								track={this.state.track}
								// partProgress={this.state.partProgress}
								instrument={this.state.instrument}
								// instrumentLib={this.instrumentLib}
								timeSignature={this.state.timeSignature}
								// onInstrumentChanged={(trackIdx, instrument) => this.onInstrumendChanged(trackIdx, instrument)}
								onChange={(track, timeSignature) => this.onTrackChange(track, timeSignature)}
							/>
						</Col>
					</Row>
					<Row>
						<Col>
							<Planner
								transport={this.transport}
								onChange={() => this.onControlChange()}
								onPlanStep={(bpm) => this.onPlanStep(bpm)}
								onPlanEnd={() => this.stop()}
								ref={this.plannerRef}
							/>
						</Col>
					</Row>
					<Row>

						<Col>
							<PresetsManager
								ref={this.presetsManagerRef}
								getPreset={() => this.getConfig()}
								onSelect={preset => this.onPresetSelect(preset)}
							/>
						</Col>
					</Row>

				</Container >
			</>
		);
	}

	stop() {

		this.transport.stop();
		this.transport.position = 0;
		this.setState({ isPlaying: false });
	}

	start() {
		// Start audio context for modern browsers
		console.log('Starting metronome...');
		console.log('Audio context state:', Tone.context.state);
		
		if (Tone.context.state !== 'running') {
			console.log('Starting Tone.js audio context...');
			Tone.start().then(() => {
				console.log('Audio context started successfully');
				this.transport.start("+.1");
				this.part.start();
				this.setState({ isPlaying: true });
			}).catch(e => {
				console.error('Failed to start audio context:', e);
			});
		} else {
			console.log('Audio context already running');
			this.transport.start("+.1");
			this.part.start();
			this.setState({ isPlaying: true });
		}
	}
}

export default SoundMachine;


SoundMachine.defaultProps = {
	instrument: InitPreset.instrument,
	track: InitPreset.track,
	timeSignature: InitPreset.timeSignature,
	onReady: function () { }
};
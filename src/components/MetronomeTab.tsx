'use client'

import React, { Component } from "react";
import dynamic from 'next/dynamic';

// Dynamically import metro components to avoid SSR issues
const SoundMachine = dynamic(() => import('./metro/SoundMachine'), { 
  ssr: false,
  loading: () => <div className="p-4">Loading Metronome...</div>
});

// Import styles
import './metro/App.css';
import 'rc-slider/assets/index.css';
import 'bootstrap/dist/css/bootstrap.css';

interface MetronomeTabState {
  showMask: boolean;
}

class MetronomeTab extends Component<{}, MetronomeTabState> {
  private smRef = React.createRef<any>();

  state = {
    showMask: true
  };

  removeLoadMask = () => {
    this.setState({ showMask: false });
  };

  render() {
    return (
      <div className="bg-white min-h-screen">
        <div className="container mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Speed Trainer Metronome</h2>
            <p className="text-gray-600">Integrated from Metro Master - for shakuhachi practice timing</p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <SoundMachine 
              ref={this.smRef} 
              onReady={this.removeLoadMask} 
            />
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h6 className="font-semibold mb-2">Keyboard Controls</h6>
            <div className="text-sm space-y-1">
              <div><code className="bg-gray-200 px-1 rounded">(shift) arrow up/down</code> - Higher/lower BPM</div>
              <div><code className="bg-gray-200 px-1 rounded">arrow left/right</code> - Previous/next step according to plan</div>
              <div><code className="bg-gray-200 px-1 rounded">space, s</code> - Start/stop</div>
              <div><code className="bg-gray-200 px-1 rounded">esc</code> - Stop</div>
            </div>
          </div>
        </div>
        
        <div className={this.state.showMask ? 'loadmask' : 'loadmask fadeOut'} />
      </div>
    );
  }
}

export default MetronomeTab;

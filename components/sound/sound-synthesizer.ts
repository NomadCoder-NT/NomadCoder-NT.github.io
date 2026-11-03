'use client';

// Web Audio API lightweight ambient procedural synthesizer
// Zero external audio files required, perfectly hermetic and reactive to seasons

class AmbientSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private hapticGain: GainNode | null = null;
  private lastHapticTime: number = 0;
  private hapticsMuted: boolean = false;

  public init() {
    if (typeof window === 'undefined') return;
    if (this.ctx) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // Dedicated low-pass filtered haptic feedback bus
      this.hapticGain = this.ctx.createGain();
      this.hapticGain.gain.setValueAtTime(0.09, this.ctx.currentTime);
      this.hapticGain.connect(this.ctx.destination);

      // Low drone oscillator
      this.droneOsc = this.ctx.createOscillator();
      this.droneOsc.type = 'sine';
      this.droneOsc.frequency.setValueAtTime(55, this.ctx.currentTime); // Low A

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.06, this.ctx.currentTime);

      this.droneOsc.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);
      this.droneOsc.start();

      // Filtered pink noise for atmospheric weather/shimmer
      const bufferSize = this.ctx.sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.04;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.setValueAtTime(400, this.ctx.currentTime);

      this.noiseNode.connect(this.filterNode);
      this.filterNode.connect(this.masterGain);
      this.noiseNode.start();
    } catch {
      // Audio context might be restricted before interaction
    }
  }

  public toggleMute(): boolean {
    if (!this.ctx) {
      this.init();
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const targetGain = this.isMuted ? 0 : 0.18;
      this.masterGain.gain.linearRampToValueAtTime(targetGain, this.ctx.currentTime + 0.3);
    }
    return !this.isMuted;
  }

  public setSeasonAtmosphere(season: 'summer' | 'monsoon' | 'autumn' | 'spring' | 'winter') {
    if (!this.ctx || !this.filterNode || !this.droneOsc) return;

    const t = this.ctx.currentTime;
    if (season === 'summer') {
      // Warm dry shimmering heat
      this.filterNode.frequency.setTargetAtTime(320, t, 0.4);
      this.droneOsc.frequency.setTargetAtTime(65.41, t, 0.4); // C2
    } else if (season === 'monsoon') {
      // Dynamic falling rain rumble
      this.filterNode.frequency.setTargetAtTime(750, t, 0.4);
      this.droneOsc.frequency.setTargetAtTime(49.0, t, 0.4); // G1 deep thunder
    } else if (season === 'autumn') {
      // Warm mellow gold resonance
      this.filterNode.frequency.setTargetAtTime(450, t, 0.4);
      this.droneOsc.frequency.setTargetAtTime(73.42, t, 0.4); // D2
    } else if (season === 'spring') {
      // Neural digital clarity
      this.filterNode.frequency.setTargetAtTime(980, t, 0.4);
      this.droneOsc.frequency.setTargetAtTime(82.41, t, 0.4); // E2
    } else if (season === 'winter') {
      // Crisp icy resonance
      this.filterNode.frequency.setTargetAtTime(1200, t, 0.4);
      this.droneOsc.frequency.setTargetAtTime(58.27, t, 0.4); // Bb1
    }
  }

  /**
   * Procedural ambient audio cues when transitioning into new narrative sections
   * e.g., soft rain droplet cascades for Monsoon, crystalline wind chimes for Autumn,
   * warm shimmering resonance for Summer, and glass synaptic chime for Digital Spring.
   */
  public playSectionTransitionCue(seasonId: 'summer' | 'monsoon' | 'autumn' | 'spring' | 'winter') {
    if (!this.ctx || this.isMuted || !this.masterGain) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    const now = this.ctx.currentTime;

    if (seasonId === 'monsoon') {
      // Soft rain shower droplet splash
      const dropFreqs = [1100, 950, 1250, 850];
      dropFreqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const dropStart = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, dropStart);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.65, dropStart + 0.18);

        gain.gain.setValueAtTime(0, dropStart);
        gain.gain.linearRampToValueAtTime(0.08, dropStart + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, dropStart + 0.22);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(dropStart);
        osc.stop(dropStart + 0.25);
      });
    } else if (seasonId === 'autumn') {
      // Delicate crystalline wind chimes
      const chimeFreqs = [587.33, 783.99, 880.0, 1174.66]; // D5, G5, A5, D6
      chimeFreqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const chimeStart = now + idx * 0.07;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, chimeStart);

        gain.gain.setValueAtTime(0, chimeStart);
        gain.gain.linearRampToValueAtTime(0.07, chimeStart + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0008, chimeStart + 0.85);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(chimeStart);
        osc.stop(chimeStart + 0.9);
      });
    } else if (seasonId === 'summer') {
      // Warm analog harmonic shimmer chime
      const warmFreqs = [329.63, 440.0, 659.25]; // E4, A4, E5
      warmFreqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.06, start + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.7);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + 0.75);
      });
    } else if (seasonId === 'winter') {
      // Crisp ice crystal bell chime
      const iceFreqs = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
      iceFreqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.06, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.85);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + 0.9);
      });
    } else {
      // Digital Spring: Synaptic neural chime blip
      const neuralFreqs = [523.25, 659.25, 1046.5]; // C5, E5, C6
      neuralFreqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.05;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.07, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0008, start + 0.65);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(start);
        osc.stop(start + 0.7);
      });
    }
  }

  public getIsPlaying(): boolean {
    return !this.isMuted;
  }

  /**
   * Low-pass filtered 'click' or 'haptic' audio feedback when a user hovers over
   * interactive elements like the NarrativeSection cards or navigation dots.
   * Uses resonant low-pass biquad filtering with an exponential pitch sweep
   * to simulate high-fidelity physical micro-switches and trackpad haptic taps.
   */
  public playHapticFeedback(type: 'card' | 'dot' | 'subtle' = 'card') {
    if (typeof window === 'undefined') return;
    if (this.hapticsMuted) return;

    if (!this.ctx) {
      this.init();
    }

    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    const now = this.ctx.currentTime;
    // Debounce to prevent acoustic overlap during rapid mouse movements
    if (now - this.lastHapticTime < 0.045) {
      return;
    }
    this.lastHapticTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Resonant low-pass filter to dampen high frequencies and impart a tactile, physical feel
      filter.type = 'lowpass';

      if (type === 'card') {
        // Warm, deep tactile card switch thud
        filter.frequency.setValueAtTime(320, now);
        filter.Q.setValueAtTime(2.2, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, now);
        osc.frequency.exponentialRampToValueAtTime(34, now + 0.034);

        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(0.075, now + 0.002);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

        osc.connect(gainNode);
        gainNode.connect(filter);
        filter.connect(this.hapticGain || this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.042);
      } else if (type === 'dot') {
        // Crisp, mechanical rotary / notch tick for navigation dots
        filter.frequency.setValueAtTime(560, now);
        filter.Q.setValueAtTime(1.8, now);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(70, now + 0.022);

        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(0.06, now + 0.0015);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

        osc.connect(gainNode);
        gainNode.connect(filter);
        filter.connect(this.hapticGain || this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.03);
      } else {
        // Micro-tactile blip for tools, pills, and artifact badges
        filter.frequency.setValueAtTime(420, now);
        filter.Q.setValueAtTime(1.4, now);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.024);

        gainNode.gain.setValueAtTime(0.0001, now);
        gainNode.gain.linearRampToValueAtTime(0.045, now + 0.002);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.026);

        osc.connect(gainNode);
        gainNode.connect(filter);
        filter.connect(this.hapticGain || this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.032);
      }
    } catch {
      // AudioContext interrupted or restricted
    }
  }

  public setHapticsMuted(muted: boolean) {
    this.hapticsMuted = muted;
  }
}

export const soundEngine = new AmbientSoundEngine();

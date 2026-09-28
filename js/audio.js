class SoundSystem {
    constructor() {
        this.enabled = true;
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        } catch(e) { this.enabled = false; }
    }
    playBeep(frequency = 440, type = 'sine', duration = 0.08) {
        if (!this.enabled || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type; osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
        osc.connect(gain); gain.connect(this.ctx.destination);
        osc.start(); osc.stop(this.ctx.currentTime + duration);
    }
    playClick() { this.playBeep(700, 'triangle', 0.05); }
    playSuccess() { this.playBeep(880, 'sine', 0.1); setTimeout(() => this.playBeep(1200, 'sine', 0.15), 100); }
}
const soundManager = new SoundSystem();
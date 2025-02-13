```typescript
import { ElevenLabsAPI } from 'elevenlabs-api';
import * as tone from 'tone';
import { AudioContext, AudioBuffer } from 'web-audio-api';

interface VoiceProfile {
  id: string;
  baseVoice: string;
  settings: {
    stability: number;
    similarity: number;
    style: number;
    speed: number;
    pitch: number;
    emotions: EmotionSettings;
  };
}

interface EmotionSettings {
  confidence: number;
  excitement: number;
  nervousness: number;
  humor: number;
}

interface AudioCue {
  type: 'PAUSE' | 'EMPHASIS' | 'LAUGH' | 'TONE_SHIFT';
  duration: number;
  intensity?: number;
  pitch?: number;
}

class VoiceSynthesizer {
  private elevenLabs: ElevenLabsAPI;
  private audioContext: AudioContext;
  private voiceProfiles: Map<string, VoiceProfile>;
  private audioBuffers: Map<string, AudioBuffer>;

  constructor(apiKey: string) {
    this.elevenLabs = new ElevenLabsAPI(apiKey);
    this.audioContext = new AudioContext();
    this.voiceProfiles = new Map();
    this.audioBuffers = new Map();
  }

  async createVoiceProfile(performer: Performer): Promise<VoiceProfile> {
    const profile: VoiceProfile = {
      id: `voice_${performer.id}`,
      baseVoice: await this.selectBaseVoice(performer.personality),
      settings: {
        stability: 0.7,
        similarity: 0.8,
        style: performer.personality.confidence,
        speed: this.calculateSpeechRate(performer),
        pitch: this.calculatePitch(performer),
        emotions: {
          confidence: performer.personality.confidence,
          excitement: performer.personality.energy,
          nervousness: 1 - performer.personality.confidence,
          humor: performer.personality.quirkiness
        }
      }
    };

    this.voiceProfiles.set(profile.id, profile);
    return profile;
  }

  private calculateSpeechRate(performer: Performer): number {
    const baseSpeed = 1.0;
    const energyFactor = performer.personality.energy * 0.3;
    const confidenceFactor = performer.personality.confidence * 0.2;
    return baseSpeed + energyFactor - (1 - confidenceFactor);
  }

  private calculatePitch(performer: Performer): number {
    const basePitch = 1.0;
    const quirkinessFactor = performer.personality.quirkiness * 0.4;
    return basePitch + quirkinessFactor;
  }

  private async selectBaseVoice(personality: PersonalityTraits): Promise<string> {
    const voices = await this.elevenLabs.getVoices();
    return 'selected_voice_id';
  }

  async synthesizeRoutine(
    routine: ComedyRoutine,
    voiceProfile: VoiceProfile
  ): Promise<AudioBuffer[]> {
    const audioSegments: AudioBuffer[] = [];

    const setupAudio = await this.synthesizeSegment(
      routine.setup,
      voiceProfile,
      this.generateCues('setup')
    );
    audioSegments.push(setupAudio);

    for (let i = 0; i < routine.punchlines.length; i++) {
      const punchline = routine.punchlines[i];
      const timing = routine.timing[i];

      const pause = this.createPause(0.5);
      audioSegments.push(pause);

      const punchlineAudio = await this.synthesizeSegment(
        punchline,
        voiceProfile,
        this.generateCues('punchline')
      );
      audioSegments.push(punchlineAudio);
    }

    return audioSegments;
  }

  private async synthesizeSegment(
    text: string,
    voiceProfile: VoiceProfile,
    cues: AudioCue[]
  ): Promise<AudioBuffer> {
    const ssml = this.generateSSML(text, cues);

    const audioData = await this.elevenLabs.generateAudio({
      text: ssml,
      voiceId: voiceProfile.baseVoice,
      stability: voiceProfile.settings.stability,
      similarityBoost: voiceProfile.settings.similarity,
      style: voiceProfile.settings.style,
      speakingRate: voiceProfile.settings.speed
    });

    return this.processAudioWithCues(audioData, cues);
  }

  private generateSSML(text: string, cues: AudioCue[]): string {
    let ssml = `<speak version="1.0">`;
    ssml += `<prosody rate="${this.currentProfile.settings.speed}" pitch="${this.currentProfile.settings.pitch}">`;

    cues.forEach(cue => {
      switch (cue.type) {
        case 'EMPHASIS':
          ssml += `<emphasis level="strong">${text}</emphasis>`;
          break;
        case 'PAUSE':
          ssml += `<break time="${cue.duration}s"/>`;
          break;
        case 'TONE_SHIFT':
          ssml += `<prosody pitch="${cue.pitch}%">${text}</prosody>`;
          break;
        default:
          ssml += text;
      }
    });

    ssml += '</prosody></speak>';
    return ssml;
  }

  private generateCues(segmentType: 'setup' | 'punchline'): AudioCue[] {
    const cues: AudioCue[] = [];

    if (segmentType === 'setup') {
      cues.push({ type: 'PAUSE', duration: 0.2 });
      cues.push({ type: 'TONE_SHIFT', duration: 0, pitch: 110 });
    } else {
      cues.push({ type: 'PAUSE', duration: 0.5 });
      cues.push({ type: 'EMPHASIS', duration: 0.3, intensity: 1.2 });
      cues.push({ type: 'TONE_SHIFT', duration: 0, pitch: 120 });
    }

    return cues;
  }

  private async processAudioWithCues(
    audioData: ArrayBuffer,
    cues: AudioCue[]
  ): Promise<AudioBuffer> {
    const audioBuffer = await this.audioContext.decodeAudioData(audioData);
    const processedBuffer = this.audioContext.createBuffer(
      audioBuffer.numberOfChannels,
      audioBuffer.length,
      audioBuffer.sampleRate
    );

    for (let channel = 0; channel < audioBuffer.numberOfChannels; channel++) {
      const inputData = audioBuffer.getChannelData(channel);
      const outputData = processedBuffer.getChannelData(channel);

      cues.forEach(cue => {
        switch (cue.type) {
          case 'EMPHASIS':
            this.applyEmphasis(inputData, outputData, cue);
            break;
          case 'PAUSE':
            this.applyPause(outputData, cue);
            break;
          case 'LAUGH':
            this.applyLaughEffect(outputData, cue);
            break;
          case 'TONE_SHIFT':
            this.applyToneShift(inputData, outputData, cue);
            break;
        }
      });
    }

    return processedBuffer;
  }

  private applyEmphasis(
    inputData: Float32Array,
    outputData: Float32Array,
    cue: AudioCue
  ) {
    for (let i = 0; i < inputData.length; i++) {
      outputData[i] = inputData[i] * (cue.intensity || 1.2);
      if (outputData[i] > 0.8) outputData[i] = 0.8;
      if (outputData[i] < -0.8) outputData[i] = -0.8;
    }
  }

  private performanceMetrics = {
    generateDuration: 0,
    processingDuration: 0,
    totalCalls: 0
  };

  async getPerformanceMetrics(): Promise<typeof this.performanceMetrics> {
    return this.performanceMetrics;
  }
}

class VoicePerformanceController {
  private synthesizer: VoiceSynthesizer;
  private audioContext: AudioContext;
  private currentPerformance?: {
    routine: ComedyRoutine;
    audioSegments: AudioBuffer[];
    currentSegment: number;
  };

  constructor(apiKey: string) {
    this.synthesizer = new VoiceSynthesizer(apiKey);
    this.audioContext = new AudioContext();
  }

  async preparePerformance(
    performer: Performer,
    routine: ComedyRoutine
  ): Promise<void> {
    const voiceProfile = await this.synthesizer.createVoiceProfile(performer);
    const audioSegments = await this.synthesizer.synthesizeRoutine(
      routine,
      voiceProfile
    );

    this.currentPerformance = {
      routine,
      audioSegments,
      currentSegment: 0
    };
  }

  async startPerformance(): Promise<void> {
    if (!this.currentPerformance) throw new Error('No performance prepared');

    for (const segment of this.currentPerformance.audioSegments) {
      await this.playSegment(segment);
      await this.waitForLaughs();
    }
  }

  private async playSegment(audioBuffer: AudioBuffer): Promise<void> {
    return new Promise((resolve) => {
      const source = this.audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioContext.destination);
      source.onended = () => resolve();
      source.start();
    });
  }

  private async waitForLaughs(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

export { VoiceSynthesizer, VoicePerformanceController };
```

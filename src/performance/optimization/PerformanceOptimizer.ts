```typescript
import { PerformanceMetrics, SystemResources, OptimizationConfig } from './types';
import * as tf from '@tensorflow/tfjs';
import { BehaviorSubject, Observable } from 'rxjs';

class PerformanceOptimizer {
  private metrics: BehaviorSubject<PerformanceMetrics>;
  private resources: SystemResources;
  private config: OptimizationConfig;
  private modelCache: Map<string, tf.LayersModel>;
  private performanceHistory: PerformanceMetrics[] = [];

  constructor(config: OptimizationConfig) {
    this.config = config;
    this.modelCache = new Map();
    this.metrics = new BehaviorSubject<PerformanceMetrics>(this.initializeMetrics());
    this.resources = this.initializeResources();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      fps: 60,
      latency: {
        audio: 0,
        video: 0,
        animation: 0,
        total: 0
      },
      memoryUsage: {
        total: 0,
        used: 0,
        peak: 0
      },
      gpuUsage: {
        utilization: 0,
        memory: 0
      },
      streamHealth: {
        audioBitrate: 0,
        videoBitrate: 0,
        packetLoss: 0,
        jitter: 0
      }
    };
  }

  private initializeResources(): SystemResources {
    return {
      maxMemory: window.performance.memory?.jsHeapSizeLimit || 0,
      maxGPUMemory: 0, // Will be updated when GPU info is available
      cpuCores: navigator.hardwareConcurrency || 4,
      gpuTier: this.detectGPUTier()
    };
  }

  async optimize(): Promise<void> {
    const currentMetrics = this.metrics.value;
    
    if (this.isPerformanceOptimal(currentMetrics)) {
      return;
    }

    await Promise.all([
      this.optimizeMemory(),
      this.optimizeRendering(),
      this.optimizeModels(),
      this.optimizeStreaming()
    ]);
  }

  private isPerformanceOptimal(metrics: PerformanceMetrics): boolean {
    return (
      metrics.fps >= this.config.targetFPS &&
      metrics.latency.total <= this.config.maxLatency &&
      metrics.memoryUsage.used <= this.config.maxMemoryUsage &&
      metrics.streamHealth.packetLoss <= this.config.maxPacketLoss
    );
  }

  private async optimizeMemory(): Promise<void> {
    const metrics = this.metrics.value;

    if (metrics.memoryUsage.used > this.config.maxMemoryUsage) {
      if (this.modelCache.size > 5) {
        const oldestModels = Array.from(this.modelCache.entries())
          .slice(0, Math.floor(this.modelCache.size / 2));
        
        for (const [key, model] of oldestModels) {
          model.dispose();
          this.modelCache.delete(key);
        }
      }

      if ('gc' in window) {
        (window as any).gc();
      }
    }
  }

  private async optimizeRendering(): Promise<void> {
    const metrics = this.metrics.value;

    if (metrics.fps < this.config.targetFPS) {
      this.adjustRenderingQuality(metrics.fps);
    }

    if (metrics.latency.animation > this.config.maxAnimationLatency) {
      this.optimizeAnimations();
    }
  }

  private adjustRenderingQuality(currentFPS: number): void {
    const qualityLevels = {
      high: {
        shadowMapSize: 2048,
        antialiasing: true,
        textureQuality: 1.0
      },
      medium: {
        shadowMapSize: 1024,
        antialiasing: true,
        textureQuality: 0.75
      },
      low: {
        shadowMapSize: 512,
        antialiasing: false,
        textureQuality: 0.5
      }
    };

    let targetQuality: keyof typeof qualityLevels;

    if (currentFPS < 30) {
      targetQuality = 'low';
    } else if (currentFPS < 45) {
      targetQuality = 'medium';
    } else {
      targetQuality = 'high';
    }

    this.updateRenderingSettings(qualityLevels[targetQuality]);
  }

  private optimizeAnimations(): void {
    const metrics = this.metrics.value;
    
    if (metrics.latency.animation > this.config.maxAnimationLatency) {
      this.reduceAnimationComplexity();
    }

    this.enableAnimationBatching();
  }

  private async optimizeModels(): Promise<void> {
    if (this.metrics.value.latency.total > this.config.maxLatency) {
      await this.optimizeModelInference();
    }
  }

  private async optimizeModelInference(): Promise<void> {
    await tf.setBackend('webgl');
    const gl = await tf.backend() as tf.webgl.MathBackendWebGL;
    if (gl) {
      gl.setFlagConfig({
        'WEBGL_CPU_FORWARD': false,
        'WEBGL_PACK': true,
        'WEBGL_FORCE_F16_TEXTURES': true
      });
    }

    tf.engine().startScope();
    try {
      for (const [_, model] of this.modelCache) {
        await this.optimizeSingleModel(model);
      }
    } finally {
      tf.engine().endScope();
    }
  }

  private async optimizeSingleModel(model: tf.LayersModel): Promise<void> {
    if (tf.env().get('WEBGL_FORCE_F16_TEXTURES')) {
      const optimizedModel = await tf.browser.toFloat16(model);
      return optimizedModel;
    }
    return model;
  }

  private async optimizeStreaming(): Promise<void> {
    const metrics = this.metrics.value;
    
    if (metrics.streamHealth.packetLoss > this.config.maxPacketLoss) {
      this.adjustStreamingQuality();
    }

    if (metrics.streamHealth.jitter > this.config.maxJitter) {
      this.enableJitterBuffer();
    }
  }

  private adjustStreamingQuality(): void {
    const streamHealth = this.metrics.value.streamHealth;
    
    const optimalAudioBitrate = this.calculateOptimalAudioBitrate(streamHealth);
    const optimalVideoBitrate = this.calculateOptimalVideoBitrate(streamHealth);

    this.updateStreamConfig({
      audioBitrate: optimalAudioBitrate,
      videoBitrate: optimalVideoBitrate,
      keyframeInterval: this.calculateKeyframeInterval(streamHealth)
    });
  }

  private calculateOptimalAudioBitrate(health: typeof this.metrics.value.streamHealth): number {
    const baseBitrate = 128000; // 128kbps base
    const packetLossFactor = 1 - (health.packetLoss / 100);
    return Math.floor(baseBitrate * packetLossFactor);
  }

  private calculateOptimalVideoBitrate(health: typeof this.metrics.value.streamHealth): number {
    const baseBitrate = 2500000; // 2.5Mbps base
    const packetLossFactor = 1 - (health.packetLoss / 100);
    const jitterFactor = 1 - (health.jitter / 100);
    return Math.floor(baseBitrate * packetLossFactor * jitterFactor);
  }

  monitorPerformance(): Observable<PerformanceMetrics> {
    return this.metrics.asObservable();
  }

  updateMetrics(newMetrics: Partial<PerformanceMetrics>): void {
    this.metrics.next({
      ...this.metrics.value,
      ...newMetrics
    });

    this.performanceHistory.push(this.metrics.value);
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory.shift();
    }

    if (!this.isPerformanceOptimal(this.metrics.value)) {
      this.optimize();
    }
  }

  private detectGPUTier(): string {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');

    if (!gl) {
      return 'low';
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) {
      return 'medium';
    }

    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();

    if (renderer.includes('nvidia') || renderer.includes('radeon')) {
      return 'high';
    } else if (renderer.includes('intel')) {
      return 'medium';
    }

    return 'low';
  }
}

export { PerformanceOptimizer };
```

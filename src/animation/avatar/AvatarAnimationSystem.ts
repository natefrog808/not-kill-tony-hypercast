```typescript
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FacialExpressions } from './facial-expressions';
import { BodyAnimations } from './body-animations';

interface AnimationState {
  expression: string;
  gesture: string;
  intensity: number;
  blendWeight: number;
  duration: number;
}

interface PerformerState {
  speaking: boolean;
  emotion: string;
  confidence: number;
  energy: number;
  currentGesture?: string;
}

class AvatarAnimationSystem {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private mixer: THREE.AnimationMixer;
  private avatar: THREE.Group;
  private animations: Map<string, THREE.AnimationClip>;
  private currentState: PerformerState;
  private facialController: FacialAnimationController;
  private gestureController: GestureController;

  constructor(containerId: string) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.setupScene(containerId);
    this.animations = new Map();
    this.currentState = {
      speaking: false,
      emotion: 'neutral',
      confidence: 0.5,
      energy: 0.5
    };

    this.facialController = new FacialAnimationController();
    this.gestureController = new GestureController();
  }

  private setupScene(containerId: string) {
    const container = document.getElementById(containerId);
    if (!container) throw new Error('Container not found');

    this.renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(this.renderer.domElement);

    // Setup lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    this.scene.add(ambientLight, directionalLight);

    // Position camera
    this.camera.position.z = 5;
  }

  async loadAvatar(modelUrl: string): Promise<void> {
    const loader = new GLTFLoader();
    try {
      const gltf = await loader.loadAsync(modelUrl);
      this.avatar = gltf.scene;
      this.mixer = new THREE.AnimationMixer(this.avatar);
      
      // Load and store animations
      gltf.animations.forEach(clip => {
        this.animations.set(clip.name, clip);
      });

      this.scene.add(this.avatar);
      await this.loadDefaultAnimations();
    } catch (error) {
      console.error('Error loading avatar:', error);
      throw error;
    }
  }

  private async loadDefaultAnimations(): Promise<void> {
    const defaultAnimations = [
      'idle',
      'speaking',
      'laugh',
      'think',
      'gesture_emphasis',
      'gesture_point',
      'gesture_wave'
    ];

    for (const animName of defaultAnimations) {
      const animUrl = `animations/${animName}.fbx`;
      try {
        const clip = await this.loadAnimationClip(animUrl);
        this.animations.set(animName, clip);
      } catch (error) {
        console.warn(`Failed to load animation: ${animName}`, error);
      }
    }
  }

  updateState(newState: Partial<PerformerState>): void {
    this.currentState = { ...this.currentState, ...newState };
    this.updateAnimations();
  }

  private updateAnimations(): void {
    // Update facial expressions
    this.facialController.updateExpression({
      emotion: this.currentState.emotion,
      intensity: this.currentState.confidence,
      speaking: this.currentState.speaking
    });

    // Update body gestures
    this.gestureController.updateGestures({
      speaking: this.currentState.speaking,
      energy: this.currentState.energy,
      currentGesture: this.currentState.currentGesture
    });
  }

  syncWithAudio(audioData: Float32Array): void {
    // Sync lip movement with audio
    this.facialController.syncLipMovement(audioData);
  }
}

class FacialAnimationController {
  private blendShapes: Map<string, number>;
  private currentExpression: string;

  constructor() {
    this.blendShapes = new Map();
    this.currentExpression = 'neutral';
    this.initializeBlendShapes();
  }

  private initializeBlendShapes(): void {
    // Initialize facial blend shapes
    const shapes = [
      'browInnerUp', 'browDownLeft', 'browDownRight',
      'eyeBlinkLeft', 'eyeBlinkRight', 'eyeSquintLeft', 'eyeSquintRight',
      'eyeWideLeft', 'eyeWideRight',
      'jawOpen', 'jawForward', 'jawLeft', 'jawRight',
      'mouthClose', 'mouthFunnel', 'mouthPucker',
      'mouthLeft', 'mouthRight', 'mouthSmileLeft', 'mouthSmileRight',
      'mouthFrownLeft', 'mouthFrownRight', 'mouthDimpleLeft', 'mouthDimpleRight',
      'mouthStretchLeft', 'mouthStretchRight',
      'mouthRollLower', 'mouthRollUpper',
      'mouthShrugLower', 'mouthShrugUpper',
      'mouthPressLeft', 'mouthPressRight',
      'mouthLowerDownLeft', 'mouthLowerDownRight',
      'mouthUpperUpLeft', 'mouthUpperUpRight',
      'cheekPuff', 'cheekSquintLeft', 'cheekSquintRight',
      'noseSneerLeft', 'noseSneerRight',
      'tongueOut'
    ];

    shapes.forEach(shape => this.blendShapes.set(shape, 0));
  }

  updateExpression(params: { 
    emotion: string; 
    intensity: number; 
    speaking: boolean 
  }): void {
    const { emotion, intensity, speaking } = params;
    this.currentExpression = emotion;

    // Reset all blend shapes
    this.blendShapes.forEach((_, key) => this.blendShapes.set(key, 0));

    // Apply new expression
    switch (emotion) {
      case 'happy':
        this.blendShapes.set('mouthSmileLeft', intensity);
        this.blendShapes.set('mouthSmileRight', intensity);
        this.blendShapes.set('cheekSquintLeft', intensity * 0.7);
        this.blendShapes.set('cheekSquintRight', intensity * 0.7);
        break;
      case 'thinking':
        this.blendShapes.set('browInnerUp', intensity);
        this.blendShapes.set('jawForward', intensity * 0.3);
        break;
      // Add more expressions as needed
    }

    if (speaking) {
      this.blendShapes.set('jawOpen', 0.3);
    }
  }

  syncLipMovement(audioData: Float32Array): void {
    // Calculate audio amplitude
    const amplitude = Math.max(...audioData.map(Math.abs));
    
    // Map amplitude to jaw movement
    const jawOpen = Math.min(amplitude * 2, 1);
    this.blendShapes.set('jawOpen', jawOpen);

    // Add subtle variations for more natural movement
    this.blendShapes.set('mouthStretchLeft', jawOpen * 0.3);
    this.blendShapes.set('mouthStretchRight', jawOpen * 0.3);
  }
}

class GestureController {
  private currentGesture?: THREE.AnimationAction;
  private gestureQueue: AnimationState[] = [];
  private basePositions: Map<string, THREE.Vector3>;

  constructor() {
    this.basePositions = new Map();
    this.initializeBasePositions();
  }

  private initializeBasePositions(): void {
    // Store default positions for different body parts
    this.basePositions.set('rightHand', new THREE.Vector3(0.5, 1, 0));
    this.basePositions.set('leftHand', new THREE.Vector3(-0.5, 1, 0));
    this.basePositions.set('head', new THREE.Vector3(0, 1.7, 0));
  }

  updateGestures(params: {
    speaking: boolean;
    energy: number;
    currentGesture?: string;
  }): void {
    const { speaking, energy, currentGesture } = params;

    if (speaking) {
      // Add natural speaking gestures
      this.addSpeakingGestures(energy);
    }

    if (currentGesture) {
      this.queueGesture(currentGesture, energy);
    }

    this.updateGestureQueue();
  }

  private addSpeakingGestures(energy: number): void {
    const gestures = [
      { name: 'handEmphasis', probability: 0.4 },
      { name: 'headNod', probability: 0.3 },
      { name: 'bodyLean', probability: 0.2 }
    ];

    gestures.forEach(gesture => {
      if (Math.random() < gesture.probability * energy) {
        this.queueGesture(gesture.name, energy);
      }
    });
  }

  private queueGesture(gestureName: string, intensity: number): void {
    const gestureState: AnimationState = {
      expression: 'neutral',
      gesture: gestureName,
      intensity,
      blendWeight: 1.0,
      duration: this.getGestureDuration(gestureName)
    };

    this.gestureQueue.push(gestureState);
  }

  private getGestureDuration(gestureName: string): number {
    // Define natural durations for different gestures
    const durations: Record<string, number> = {
      handEmphasis: 0.5,
      headNod: 0.3,
      bodyLean: 0.8,
      point: 1.0,
      wave: 1.2
    };

    return durations[gestureName] || 0.5;
  }

  private updateGestureQueue(): void {
    if (this.gestureQueue.length === 0) return;

    const currentTime = Date.now();
    const gesture = this.gestureQueue[0];

    // Remove completed gestures
    if (currentTime >= gesture.duration * 1000) {
      this.gestureQueue.shift();
    }
  }
}

export { AvatarAnimationSystem };
```

```typescript
import { Configuration, OpenAIApi } from 'openai';
import { Redis } from 'ioredis';

// Types for LLM responses
interface LLMResponse {
  content: string;
  confidence: number;
  metadata: {
    tokens: number;
    processingTime: number;
  };
}

interface ComedyRoutine {
  setup: string;
  punchlines: string[];
  callbacks: string[];
  timing: number[];
}

class LLMManager {
  private openai: OpenAIApi;
  private redis: Redis;
  private contextWindow: string[] = [];

  constructor(apiKey: string, redisUrl: string) {
    this.openai = new OpenAIApi(new Configuration({ apiKey }));
    this.redis = new Redis(redisUrl);
  }

  // Updated prompt templates for an edgy style
  private readonly PROMPT_TEMPLATES = {
    ROUTINE: `Generate a bold and edgy 60-second comedy routine for a comedian with these traits:
    - Personality: {personality}
    - Style: {style}
    - Background: {background}
    
    The routine should:
    - Be provocatively conversational
    - Include sharp setups and punchlines
    - Reference their background with wit
    - Match their daring personality traits
    - Fit a 60-second set
    
    Format: Setup | Punchline | Timing (seconds)`,

    INTERVIEW: `Generate a bold interview response as a comedian with these traits:
    - Personality: {personality}
    - Previous routine: {routine}
    - Question: {question}
    
    Response should:
    - Stay in character
    - Reference their routine if relevant
    - Include edgy and humorous elements
    - Match their established personality`,

    CALLBACK: `Generate a daring callback/reference:
    - Original content: {content}
    - Current context: {context}
    - Desired tone: edgy
    
    Callback should:
    - Feel naturally bold
    - Build on the original content with audacity
    - Add new provocative elements`
  };

  async generateRoutine(performer: Performer): Promise<ComedyRoutine> {
    const prompt = this.PROMPT_TEMPLATES.ROUTINE
      .replace('{personality}', JSON.stringify(performer.personality))
      .replace('{style}', performer.comedyStyle.join(', '))
      .replace('{background}', performer.backgroundStory);

    const response = await this.generateContent('routine', prompt);
    return this.parseRoutineResponse(response.content);
  }

  async generateInterviewResponse(
    performer: Performer,
    question: string,
    previousRoutine: string
  ): Promise<string> {
    const prompt = this.PROMPT_TEMPLATES.INTERVIEW
      .replace('{personality}', JSON.stringify(performer.personality))
      .replace('{routine}', previousRoutine)
      .replace('{question}', question);

    const response = await this.generateContent('interview', prompt);
    return response.content;
  }

  async generateCallback(
    originalContent: string,
    currentContext: string
  ): Promise<string> {
    const prompt = this.PROMPT_TEMPLATES.CALLBACK
      .replace('{content}', originalContent)
      .replace('{context}', currentContext)
      .replace('{tone}', 'edgy');

    const response = await this.generateContent('callback', prompt);
    return response.content;
  }

  private async generateContent(
    type: string,
    prompt: string
  ): Promise<LLMResponse> {
    // Check cache first
    const cacheKey = `llm:${type}:${this.hashString(prompt)}`;
    const cached = await this.redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    // Generate new content
    try {
      const startTime = Date.now();
      const completion = await this.openai.createCompletion({
        model: 'gpt-4',
        prompt,
        max_tokens: 500,
        temperature: 1.0, // Higher temperature for edgier content
        presence_penalty: 0.7,
        frequency_penalty: 0.9,
      });

      const response: LLMResponse = {
        content: completion.data.choices[0].text || '',
        confidence: completion.data.choices[0].finish_reason === 'stop' ? 1 : 0.8,
        metadata: {
          tokens: completion.data.usage?.total_tokens || 0,
          processingTime: Date.now() - startTime
        }
      };

      // Cache the response
      await this.redis.setex(
        cacheKey,
        3600, // 1 hour cache
        JSON.stringify(response)
      );

      this.updateContext(response.content);
      return response;
    } catch (error) {
      console.error('LLM Generation Error:', error);
      throw new Error('Failed to generate content');
    }
  }

  private parseRoutineResponse(content: string): ComedyRoutine {
    const lines = content.split('\n').filter(line => line.trim());
    const routine: ComedyRoutine = {
      setup: '',
      punchlines: [],
      callbacks: [],
      timing: []
    };

    lines.forEach(line => {
      const [setup, punchline, timing] = line.split('|').map(s => s.trim());

      if (setup && punchline) {
        if (!routine.setup) {
          routine.setup = setup;
        }
        routine.punchlines.push(punchline);
        routine.timing.push(parseInt(timing) || 10);

        if (this.contextWindow.some(ctx =>
          setup.toLowerCase().includes(ctx.toLowerCase()) ||
          punchline.toLowerCase().includes(ctx.toLowerCase())
        )) {
          routine.callbacks.push(setup + ' | ' + punchline);
        }
      }
    });

    return routine;
  }

  private updateContext(content: string) {
    this.contextWindow.push(content);
    if (this.contextWindow.length > 5) {
      this.contextWindow.shift();
    }
  }

  private hashString(str: string): string {
    return Buffer.from(str).toString('base64');
  }
}

// Content Quality Checker
class ContentQualityChecker {
  private readonly QUALITY_CHECKS = {
    appropriateness: (content: string): boolean => {
      const inappropriateTerms = ['offensive_term_1', 'offensive_term_2'];
      return !inappropriateTerms.some(term =>
        content.toLowerCase().includes(term)
      );
    },

    length: (routine: ComedyRoutine): boolean => {
      const totalTime = routine.timing.reduce((a, b) => a + b, 0);
      return totalTime >= 45 && totalTime <= 75; // Allow some flexibility
    },

    structure: (routine: ComedyRoutine): boolean => {
      return routine.setup.length > 0 &&
             routine.punchlines.length > 0 &&
             routine.timing.every(t => t > 0);
    }
  };

  async validateContent(
    type: 'routine' | 'interview' | 'callback',
    content: any
  ): Promise<boolean> {
    switch (type) {
      case 'routine':
        return this.validateRoutine(content as ComedyRoutine);
      case 'interview':
        return this.validateInterview(content as string);
      case 'callback':
        return this.validateCallback(content as string);
      default:
        return false;
    }
  }

  private async validateRoutine(routine: ComedyRoutine): Promise<boolean> {
    return (
      this.QUALITY_CHECKS.appropriateness(routine.setup) &&
      routine.punchlines.every(p => this.QUALITY_CHECKS.appropriateness(p)) &&
      this.QUALITY_CHECKS.length(routine) &&
      this.QUALITY_CHECKS.structure(routine)
    );
  }

  private async validateInterview(content: string): Promise<boolean> {
    return (
      this.QUALITY_CHECKS.appropriateness(content) &&
      content.length >= 20 &&
      content.length <= 200
    );
  }

  private async validateCallback(content: string): Promise<boolean> {
    return (
      this.QUALITY_CHECKS.appropriateness(content) &&
      content.length >= 10 &&
      content.length <= 100
    );
  }
}

export class ContentGenerator {
  private llmManager: LLMManager;
  private qualityChecker: ContentQualityChecker;

  constructor(apiKey: string, redisUrl: string) {
    this.llmManager = new LLMManager(apiKey, redisUrl);
    this.qualityChecker = new ContentQualityChecker();
  }

  async generatePerformanceContent(performer: Performer): Promise<ComedyRoutine> {
    let routine: ComedyRoutine;
    let attempts = 0;
    const maxAttempts = 3;

    do {
      routine = await this.llmManager.generateRoutine(performer);
      attempts++;
    } while (
      !(await this.qualityChecker.validateContent('routine', routine)) &&
      attempts < maxAttempts
    );

    if (attempts === maxAttempts) {
      throw new Error('Failed to generate valid routine');
    }

    return routine;
  }
}
```

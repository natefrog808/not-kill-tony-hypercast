// src/ai/humor-generation/humor-analyzer.ts

interface HumorMetrics {
  relevance: number;
  creativity: number;
  clarity: number;
  timing: number;
  appropriateness: number;
}

interface StyleMatch {
  matchScore: number;
  mismatches: string[];
}

export class HumorAnalyzer {
  private readonly wordPatterns: Map<string, RegExp>;
  private readonly stylePatterns: Map<string, string[]>;
  
  constructor() {
    this.wordPatterns = new Map([
      ['wordplay', /(\w+).*\1|(\w+).*\b\w+(?=ing|ed|s|er)\b/],
      ['reference', /\b(pop|culture|movie|show|celebrity)\b/i],
      ['observation', /\b(always|never|everyone|nobody|why do|what if)\b/i],
      ['absurdist', /\b(suddenly|random|bizarre|weird|strange)\b/i]
    ]);

    this.stylePatterns = new Map([
      ['observational', ['relatable', 'everyday', 'common', 'notice']],
      ['surreal', ['bizarre', 'weird', 'random', 'abstract']],
      ['deadpan', ['serious', 'straight', 'monotone', 'flat']],
      ['sarcastic', ['ironic', 'sarcasm', 'obvious', 'really']],
      ['physical', ['action', 'movement', 'gesture', 'face']]
    ]);
  }

  async analyzeHumor(
    joke: string,
    context: string,
    styleVector: number[]
  ): Promise<number> {
    const metrics = await this.calculateMetrics(joke, context);
    const styleMatch = this.analyzeStyleMatch(joke, styleVector);
    
    return this.calculateOverallScore(metrics, styleMatch);
  }

  private async calculateMetrics(joke: string, context: string): Promise<HumorMetrics> {
    return {
      relevance: this.calculateRelevance(joke, context),
      creativity: this.calculateCreativity(joke),
      clarity: this.calculateClarity(joke),
      timing: this.calculateTiming(joke),
      appropriateness: this.calculateAppropriateness(joke)
    };
  }

  private calculateRelevance(joke: string, context: string): number {
    const jokeWords = new Set(joke.toLowerCase().split(/\s+/));
    const contextWords = new Set(context.toLowerCase().split(/\s+/));
    
    let commonWords = 0;
    jokeWords.forEach(word => {
      if (contextWords.has(word)) commonWords++;
    });

    return commonWords / Math.max(jokeWords.size, contextWords.size);
  }

  private calculateCreativity(joke: string): number {
    let score = 0;
    
    // Check for wordplay
    if (this.wordPatterns.get('wordplay')?.test(joke)) {
      score += 0.3;
    }

    // Check for unexpected combinations
    const words = joke.split(/\s+/);
    const uniqueWords = new Set(words).size;
    score += Math.min(uniqueWords / words.length, 0.3);

    // Check for pattern breaks
    if (joke.includes('but') || joke.includes('however')) {
      score += 0.2;
    }

    // Check for creative references
    if (this.wordPatterns.get('reference')?.test(joke)) {
      score += 0.2;
    }

    return Math.min(score, 1);
  }

  private calculateClarity(joke: string): number {
    // Check sentence structure
    const sentences = joke.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgWordsPerSentence = sentences
      .map(s => s.trim().split(/\s+/).length)
      .reduce((a, b) => a + b, 0) / sentences.length;

    // Penalty for very long or very short sentences
    let clarityScore = 1 - Math.abs(avgWordsPerSentence - 12) / 20;

    // Check for clear setup-punchline structure
    if (joke.includes('?') || joke.includes('...')) {
      clarityScore += 0.2;
    }

    return Math.max(0, Math.min(clarityScore, 1));
  }

  private calculateTiming(joke: string): number {
    const parts = joke.split(/[.!?]+/).filter(s => s.trim().length > 0);
    
    if (parts.length !== 2) {
      return 0.5; // Neutral score for non-standard structure
    }

    const [setup, punchline] = parts;
    const setupLength = setup.trim().split(/\s+/).length;
    const punchlineLength = punchline.trim().split(/\s+/).length;

    // Ideal ratio: setup should be 1.5-2.5 times longer than punchline
    const ratio = setupLength / punchlineLength;
    const idealRatio = 2;
    const deviation = Math.abs(ratio - idealRatio);

    return Math.max(0, 1 - deviation / idealRatio);
  }

  private calculateAppropriateness(joke: string): number {
    const inappropriatePatterns = [
      /\b(offensive|inappropriate|controversial)\b/i,
      /\b(sensitive|explicit|graphic)\b/i
    ];

    let appropriatenessScore = 1;
    inappropriatePatterns.forEach(pattern => {
      if (pattern.test(joke)) {
        appropriatenessScore -= 0.2;
      }
    });

    return Math.max(0, appropriatenessScore);
  }

  private analyzeStyleMatch(joke: string, styleVector: number[]): StyleMatch {
    const styles = ['observational', 'surreal', 'deadpan', 'sarcastic', 'physical'];
    const jokeLower = joke.toLowerCase();
    
    let matchScore = 0;
    const mismatches: string[] = [];

    styles.forEach((style, index) => {
      const styleWeight = styleVector[index];
      if (styleWeight > 0) {
        const patterns = this.stylePatterns.get(style) || [];
        const matches = patterns.some(pattern => jokeLower.includes(pattern));
        
        if (matches) {
          matchScore += styleWeight;
        } else {
          mismatches.push(style);
        }
      }
    });

    return {
      matchScore: matchScore / Math.max(...styleVector),
      mismatches
    };
  }

  private calculateOverallScore(metrics: HumorMetrics, styleMatch: StyleMatch): number {
    const weights = {
      relevance: 0.2,
      creativity: 0.25,
      clarity: 0.2,
      timing: 0.15,
      appropriateness: 0.1,
      styleMatch: 0.1
    };

    const weightedScore = 
      metrics.relevance * weights.relevance +
      metrics.creativity * weights.creativity +
      metrics.clarity * weights.clarity +
      metrics.timing * weights.timing +
      metrics.appropriateness * weights.appropriateness +
      styleMatch.matchScore * weights.styleMatch;

    return Math.min(1, Math.max(0, weightedScore));
  }
}

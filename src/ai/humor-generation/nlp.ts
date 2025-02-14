// src/ai/humor-generation/nlp.ts

interface ProcessedText {
  tokens: string[];
  entities: string[];
  sentiment: number;
  topics: string[];
}

interface StyleVector {
  comedyStyle: number[];
  intensity: number;
  complexity: number;
  edginess: number;
}

export class NLPProcessor {
  private tokenizer: Map<string, number>;
  private entityPatterns: RegExp[];
  
  constructor() {
    this.tokenizer = new Map();
    this.entityPatterns = [
      /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g, // Named entities
      /\b(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\b/g, // Days
      /\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\b/g // Months
    ];
  }

  async processText(context: string): Promise<ProcessedText> {
    const tokens = await this.tokenize(context);
    const entities = await this.extractEntities(context);
    const sentiment = await this.analyzeSentiment(context);
    const topics = await this.extractTopics(tokens);

    return {
      tokens,
      entities,
      sentiment,
      topics
    };
  }

  async processStyle(styleKeywords: string[]): Promise<StyleVector> {
    const comedyStyles = ['observational', 'surreal', 'deadpan', 'sarcastic', 'witty'];
    const styleVector = comedyStyles.map(style => 
      styleKeywords.includes(style) ? 1.0 : 0.0
    );

    return {
      comedyStyle: styleVector,
      intensity: this.calculateIntensity(styleKeywords),
      complexity: this.calculateComplexity(styleKeywords),
      edginess: this.calculateEdginess(styleKeywords)
    };
  }

  private async tokenize(text: string): Promise<string[]> {
    return text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(token => token.length > 0);
  }

  private async extractEntities(text: string): Promise<string[]> {
    const entities = new Set<string>();
    
    this.entityPatterns.forEach(pattern => {
      const matches = text.match(pattern) || [];
      matches.forEach(match => entities.add(match));
    });

    return Array.from(entities);
  }

  private async analyzeSentiment(text: string): Promise<number> {
    const positiveWords = new Set(['happy', 'good', 'great', 'awesome', 'excellent']);
    const negativeWords = new Set(['bad', 'terrible', 'awful', 'horrible', 'poor']);
    
    const tokens = text.toLowerCase().split(/\s+/);
    let sentiment = 0;
    
    tokens.forEach(token => {
      if (positiveWords.has(token)) sentiment += 1;
      if (negativeWords.has(token)) sentiment -= 1;
    });

    return Math.max(-1, Math.min(1, sentiment / tokens.length));
  }

  private async extractTopics(tokens: string[]): Promise<string[]> {
    const topicKeywords = new Map([
      ['technology', ['computer', 'phone', 'internet', 'tech', 'digital']],
      ['relationships', ['dating', 'marriage', 'family', 'love', 'partner']],
      ['work', ['office', 'job', 'boss', 'work', 'career']],
      ['politics', ['government', 'politics', 'election', 'politician', 'vote']],
      ['daily_life', ['food', 'traffic', 'weather', 'shopping', 'home']]
    ]);

    const topicScores = new Map<string, number>();

    tokens.forEach(token => {
      topicKeywords.forEach((keywords, topic) => {
        if (keywords.includes(token)) {
          topicScores.set(topic, (topicScores.get(topic) || 0) + 1);
        }
      });
    });

    return Array.from(topicScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic);
  }

  private calculateIntensity(styleKeywords: string[]): number {
    const intensityKeywords = new Set(['high-energy', 'intense', 'dramatic', 'loud']);
    return styleKeywords.filter(keyword => intensityKeywords.has(keyword)).length / styleKeywords.length;
  }

  private calculateComplexity(styleKeywords: string[]): number {
    const complexityKeywords = new Set(['intellectual', 'clever', 'sophisticated', 'nuanced']);
    return styleKeywords.filter(keyword => complexityKeywords.has(keyword)).length / styleKeywords.length;
  }

  private calculateEdginess(styleKeywords: string[]): number {
    const edginessKeywords = new Set(['edgy', 'controversial', 'provocative', 'dark']);
    return styleKeywords.filter(keyword => edginessKeywords.has(keyword)).length / styleKeywords.length;
  }
}

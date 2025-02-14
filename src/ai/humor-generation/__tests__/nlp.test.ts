// src/ai/humor-generation/__tests__/nlp.test.ts

import { NLPProcessor } from '../nlp';

describe('NLPProcessor', () => {
  let nlpProcessor: NLPProcessor;

  beforeEach(() => {
    nlpProcessor = new NLPProcessor();
  });

  describe('processText', () => {
    it('should correctly tokenize and analyze text', async () => {
      const input = 'John went to the office on Monday and had a great time with his excellent boss';
      const result = await nlpProcessor.processText(input);

      expect(result.tokens).toBeDefined();
      expect(result.tokens.length).toBeGreaterThan(0);
      expect(result.entities).toContain('John');
      expect(result.entities).toContain('Monday');
      expect(result.sentiment).toBeGreaterThan(0); // Should be positive due to "great" and "excellent"
      expect(result.topics).toContain('work'); // Should detect work-related topic
    });

    it('should handle empty text', async () => {
      const result = await nlpProcessor.processText('');
      
      expect(result.tokens).toHaveLength(0);
      expect(result.entities).toHaveLength(0);
      expect(result.sentiment).toBe(0);
      expect(result.topics).toHaveLength(0);
    });

    it('should correctly identify multiple entities', async () => {
      const input = 'Sarah and Mike went to Paris in January';
      const result = await nlpProcessor.processText(input);

      expect(result.entities).toContain('Sarah');
      expect(result.entities).toContain('Mike');
      expect(result.entities).toContain('Paris');
      expect(result.entities).toContain('January');
    });
  });

  describe('processStyle', () => {
    it('should generate correct style vector', async () => {
      const styleKeywords = ['observational', 'high-energy', 'intellectual'];
      const result = await nlpProcessor.processStyle(styleKeywords);

      expect(result.comedyStyle).toHaveLength(5); // 5 comedy styles
      expect(result.intensity).toBeGreaterThan(0);
      expect(result.complexity).toBeGreaterThan(0);
      expect(result.edginess).toBe(0);
    });

    it('should handle empty style keywords', async () => {
      const result = await nlpProcessor.processStyle([]);

      expect(result.comedyStyle).toHaveLength(5);
      expect(result.comedyStyle.every(v => v === 0)).toBe(true);
      expect(result.intensity).toBe(0);
      expect(result.complexity).toBe(0);
      expect(result.edginess).toBe(0);
    });

    it('should calculate correct edginess for provocative content', async () => {
      const styleKeywords = ['edgy', 'controversial', 'dark'];
      const result = await nlpProcessor.processStyle(styleKeywords);

      expect(result.edginess).toBeGreaterThan(0.5);
    });
  });

  describe('sentiment analysis', () => {
    it('should detect positive sentiment', async () => {
      const input = 'This is amazing and wonderful, truly excellent work!';
      const result = await nlpProcessor.processText(input);

      expect(result.sentiment).toBeGreaterThan(0);
    });

    it('should detect negative sentiment', async () => {
      const input = 'This is terrible and horrible, truly awful stuff.';
      const result = await nlpProcessor.processText(input);

      expect(result.sentiment).toBeLessThan(0);
    });

    it('should return neutral sentiment for neutral text', async () => {
      const input = 'The cat sat on the mat.';
      const result = await nlpProcessor.processText(input);

      expect(result.sentiment).toBe(0);
    });
  });

  describe('topic extraction', () => {
    it('should identify technology-related topics', async () => {
      const input = 'The computer crashed while browsing the internet';
      const result = await nlpProcessor.processText(input);

      expect(result.topics).toContain('technology');
    });

    it('should identify work-related topics', async () => {
      const input = 'My boss at the office gave me a new career opportunity';
      const result = await nlpProcessor.processText(input);

      expect(result.topics).toContain('work');
    });

    it('should identify multiple topics', async () => {
      const input = 'Using my computer at work while thinking about my family';
      const result = await nlpProcessor.processText(input);

      expect(result.topics).toContain('technology');
      expect(result.topics).toContain('work');
      expect(result.topics).toContain('relationships');
    });
  });
});

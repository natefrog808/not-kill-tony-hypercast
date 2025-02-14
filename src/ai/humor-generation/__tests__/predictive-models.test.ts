// src/ai/humor-generation/__tests__/predictive-models.test.ts

import { MachineLearningModel } from '../predictive-models';

describe('MachineLearningModel', () => {
  let mlModel: MachineLearningModel;

  beforeEach(() => {
    mlModel = new MachineLearningModel();
  });

  describe('loadModel', () => {
    it('should successfully load the model', async () => {
      const modelName = 'humor-generation';
      await expect(mlModel.loadModel(modelName)).resolves.not.toThrow();
    });

    it('should set isInitialized after loading', async () => {
      const modelName = 'humor-generation';
      await mlModel.loadModel(modelName);
      // @ts-ignore - accessing private property for testing
      expect(mlModel.isInitialized).toBe(true);
    });
  });

  describe('generate', () => {
    beforeEach(async () => {
      await mlModel.loadModel('humor-generation');
    });

    it('should generate a joke with setup and punchline', async () => {
      const context = 'technology programming computers';
      const styleVector = [1, 0, 0, 0, 0]; // observational style

      const result = await mlModel.generate(context, styleVector);
      
      expect(result).toContain('\n'); // Should have setup and punchline
      expect(result.split('\n')).toHaveLength(2);
    });

    it('should throw error if model not initialized', async () => {
      const newModel = new MachineLearningModel();
      const context = 'technology';
      const styleVector = [1, 0, 0, 0, 0];

      await expect(newModel.generate(context, styleVector))
        .rejects
        .toThrow('Model not initialized');
    });

    it('should respect style vector in generation', async () => {
      const context = 'technology';
      const observationalStyle = [1, 0, 0, 0, 0];
      const surrealStyle = [0, 1, 0, 0, 0];

      const joke1 = await mlModel.generate(context, observationalStyle);
      const joke2 = await mlModel.generate(context, surrealStyle);

      expect(joke1).not.toBe(joke2); // Different styles should produce different jokes
    });
  });

  describe('generateJoke', () => {
    beforeEach(async () => {
      await mlModel.loadModel('humor-generation');
    });

    it('should respect minimum length constraints', async () => {
      const params = {
        context: 'technology',
        styleVector: [1, 0, 0, 0, 0],
        constraints: {
          minLength: 20
        }
      };

      const result = await mlModel['generateJoke'](params);
      expect(result.length).toBeGreaterThanOrEqual(params.constraints.minLength);
    });

    it('should respect maximum length constraints', async () => {
      const params = {
        context: 'technology',
        styleVector: [1, 0, 0, 0, 0],
        constraints: {
          maxLength: 200
        }
      };

      const result = await mlModel['generateJoke'](params);
      expect(result.length).toBeLessThanOrEqual(params.constraints.maxLength);
    });

    it('should maintain context window size', async () => {
      const context = 'test context';
      const styleVector = [1, 0, 0, 0, 0];

      // Generate multiple jokes to fill context window
      for (let i = 0; i < 10; i++) {
        await mlModel.generate(context, styleVector);
      }

      // @ts-ignore - accessing private property for testing
      expect(mlModel.contextWindow.length).toBeLessThanOrEqual(5);
    });
  });

  describe('adjustConfigForStyle', () => {
    it('should adjust temperature based on style', async () => {
      const surrealStyle = [0, 1, 0, 0, 0];
      // @ts-ignore - accessing private method for testing
      const adjustedConfig = await mlModel['adjustConfigForStyle'](surrealStyle);
      
      // @ts-ignore - accessing private property for testing
      expect(adjustedConfig.temperature).toBeGreaterThan(mlModel.config.temperature);
    });

    it('should adjust presence penalty for deadpan style', async () => {
      const deadpanStyle = [0, 0, 1, 0, 0];
      // @ts-ignore - accessing private method for testing
      const adjustedConfig = await mlModel['adjustConfigForStyle'](deadpanStyle);
      
      // @ts-ignore - accessing private property for testing
      expect(adjustedConfig.presencePenalty).toBeGreaterThan(mlModel.config.presencePenalty);
    });
  });
});

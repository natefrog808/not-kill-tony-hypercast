```typescript
import { jest } from '@jest/globals';
import { TestRunner, TestSuite } from './test-runner';
import { TestReporter } from './reporting';
import { TestEnvironment } from './environment';
import { CoverageAnalyzer } from './coverage-analyzer';
import { MockService } from './mock-service';

class AutomatedTestingSystem {
  private runner: TestRunner;
  private reporter: TestReporter;
  private environment: TestEnvironment;
  private coverageAnalyzer: CoverageAnalyzer;
  private mockService: MockService;

  constructor() {
    this.runner = new TestRunner();
    this.reporter = new TestReporter();
    this.environment = new TestEnvironment();
    this.coverageAnalyzer = new CoverageAnalyzer();
    this.mockService = new MockService();
  }

  async runFullTestSuite(): Promise<TestResults> {
    const startTime = Date.now();

    try {
      // Initialize test environment
      await this.environment.setup();

      // Run tests in parallel
      const results = await Promise.all([
        this.runUnitTests(),
        this.runIntegrationTests(),
        this.runE2ETests(),
        this.runPerformanceTests(),
        this.runSecurityTests()
      ]);

      // Analyze coverage
      await this.coverageAnalyzer.analyze();

      // Generate report
      const testReport = await this.reporter.generateReport(results);

      return {
        success: results.every(r => r.success),
        duration: Date.now() - startTime,
        results,
        report: testReport
      };
    } finally {
      await this.environment.teardown();
    }
  }

  private async runUnitTests(): Promise<TestSuiteResult> {
    this.mockService.setupMocks();
    const unitTests = new UnitTestSuite();
    return this.runner.runSuite(unitTests);
  }

  private async runIntegrationTests(): Promise<TestSuiteResult> {
    const integrationTests = new IntegrationTestSuite();
    return this.runner.runSuite(integrationTests);
  }

  private async runE2ETests(): Promise<TestSuiteResult> {
    const e2eTests = new E2ETestSuite();
    return this.runner.runSuite(e2eTests);
  }

  private async runPerformanceTests(): Promise<TestSuiteResult> {
    const performanceTests = new PerformanceTestSuite();
    return this.runner.runSuite(performanceTests);
  }

  private async runSecurityTests(): Promise<TestSuiteResult> {
    const securityTests = new SecurityTestSuite();
    return this.runner.runSuite(securityTests);
  }
}

// Example implementation of a Unit Test Suite
class UnitTestSuite implements TestSuite {
  async setup(): Promise<void> {
    // Setup mocks and test data
    jest.mock('./services/performer');
    jest.mock('./services/audio');
    jest.mock('./services/analytics');
  }

  async runTests(): Promise<TestResult[]> {
    return [
      await this.testPerformerGeneration(),
      await this.testAudioProcessing(),
      await this.testAnalytics()
    ];
  }

  private async testPerformerGeneration(): Promise<TestResult> {
    const performer = await generateTestPerformer();
    expect(performer).toHaveProperty('id');
    expect(performer).toHaveProperty('name');
    expect(performer.personality).toBeDefined();

    return {
      name: 'Performer Generation',
      success: true,
      duration: 100
    };
  }

  private async testAudioProcessing(): Promise<TestResult> {
    const audio = await processTestAudio();
    expect(audio.duration).toBeGreaterThan(0);
    expect(audio.format).toBe('wav');

    return {
      name: 'Audio Processing',
      success: true,
      duration: 150
    };
  }
}

export { AutomatedTestingSystem };
```

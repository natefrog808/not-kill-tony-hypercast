# Not Kill Tony Testing Documentation

## Overview
This document outlines the testing strategy and procedures for the Not Kill Tony platform, ensuring reliability and performance under real-world conditions.

## Testing Layers

### 1. Unit Testing
- Location: `src/tests/unit/*`
- Framework: Jest
- Coverage Target: 90%

```typescript
// Example unit test for HumorGenerationSystem
describe('HumorGenerationSystem', () => {
  let humorSystem: HumorGenerationSystem;
  let mockLLMManager: jest.Mocked<LLMManager>;
  let mockEmotionDetection: jest.Mocked<EmotionDetectionSystem>;
  let mockFeedbackSystem: jest.Mocked<UserFeedbackSystem>;

  beforeEach(() => {
    mockLLMManager = {
      generateContent: jest.fn()
    } as any;
    
    mockEmotionDetection = {
      getCurrentMood: jest.fn()
    } as any;
    
    mockFeedbackSystem = {
      getRecentFeedback: jest.fn()
    } as any;

    humorSystem = new HumorGenerationSystem(
      mockLLMManager,
      mockEmotionDetection,
      mockFeedbackSystem
    );
  });

  test('should generate appropriate jokes based on audience mood', async () => {
    // Arrange
    const context: JokeContext = {
      audienceMood: 'energetic',
      previousJokes: [],
      currentTopic: 'technology',
      performerStyle: {
        comedyStyle: 'observational',
        pacePreference: 'fast',
        topicalPreferences: ['tech', 'society'],
        languageStyle: 'clean'
      },
      timing: {
        setupDuration: 10,
        punchlineTiming: 5,
        pauseDuration: 2
      }
    };

    mockEmotionDetection.getCurrentMood.mockResolvedValue('energetic');
    mockFeedbackSystem.getRecentFeedback.mockResolvedValue([]);
    mockLLMManager.generateContent.mockResolvedValue({
      setup: 'Why did the programmer quit his job?',
      punchline: 'Because he didn't get arrays!'
    });

    // Act
    const result = await humorSystem.generateJoke(context);

    // Assert
    expect(result.setup).toBeDefined();
    expect(result.punchline).toBeDefined();
    expect(result.confidence).toBeGreaterThan(0);
    expect(mockLLMManager.generateContent).toHaveBeenCalled();
  });
});
```

### 2. Integration Testing
- Location: `src/tests/integration/*`
- Framework: Jest + Supertest
- Focus: API endpoints, service interactions

```typescript
describe('Show Controller Integration', () => {
  test('should successfully manage a complete show flow', async () => {
    const response = await request(app)
      .post('/api/shows')
      .send({
        duration: 60,
        style: 'standup',
        audienceSize: 100
      });

    expect(response.status).toBe(200);
    expect(response.body.showId).toBeDefined();
    
    // Test show flow
    const showId = response.body.showId;
    await request(app)
      .post(`/api/shows/${showId}/start`)
      .expect(200);
      
    // Verify performer generation
    const performerResponse = await request(app)
      .get(`/api/shows/${showId}/current-performer`)
      .expect(200);
      
    expect(performerResponse.body.performer).toBeDefined();
  });
});
```

### 3. End-to-End Testing
- Location: `src/tests/e2e/*`
- Framework: Cypress
- Coverage: Critical user paths

```typescript
describe('Show Experience', () => {
  it('should complete a full show lifecycle', () => {
    cy.visit('/shows/new');
    cy.get('[data-testid="create-show"]').click();
    
    // Configure show
    cy.get('[data-testid="show-duration"]').type('60');
    cy.get('[data-testid="show-style"]').select('standup');
    cy.get('[data-testid="start-show"]').click();
    
    // Verify show components
    cy.get('[data-testid="performer-avatar"]').should('be.visible');
    cy.get('[data-testid="audience-reactions"]').should('be.visible');
    
    // Test audience interaction
    cy.get('[data-testid="reaction-laugh"]').click();
    cy.get('[data-testid="engagement-meter"]')
      .should('have.attr', 'value')
      .and('be.greaterThan', 0);
  });
});
```

### 4. Performance Testing
- Location: `src/tests/performance/*`
- Tools: k6, Artillery
- Metrics: Response time, throughput, error rates

```javascript
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 100 }, // Ramp up
    { duration: '1m', target: 100 },  // Stay at peak
    { duration: '30s', target: 0 },   // Ramp down
  ],
};

export default function() {
  const showResponse = http.post('http://localhost:3000/api/shows', {
    duration: 60,
    style: 'standup',
    audienceSize: 100
  });
  
  check(showResponse, {
    'show created successfully': (r) => r.status === 200,
  });
  
  const showId = showResponse.json('showId');
  
  // Test real-time updates
  const ws = new WebSocket('ws://localhost:3000');
  ws.onmessage = (event) => {
    check(event.data, {
      'received show update': (data) => data.showId === showId,
    });
  };
  
  sleep(1);
}
```

### 5. Load Testing
- Location: `src/tests/load/*`
- Scenarios: Peak audience, concurrent shows
- Targets: 
  - Support 1000 concurrent users
  - 99th percentile response time < 200ms
  - Error rate < 0.1%

### 6. Security Testing
- Location: `src/tests/security/*`
- Tools: OWASP ZAP, SonarQube
- Focus areas:
  - Authentication
  - Rate limiting
  - Input validation
  - XSS prevention

## Test Automation

### CI/CD Pipeline Integration
```yaml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: npm install
      - name: Run unit tests
        run: npm run test:unit
      - name: Run integration tests
        run: npm run test:integration
      - name: Run e2e tests
        run: npm run test:e2e
      - name: Run performance tests
        run: npm run test:performance
```

### Monitoring and Alerts
- Real-time performance monitoring
- Error rate tracking
- Response time alerts
- Test failure notifications

## Best Practices

### Writing Tests
1. Follow AAA pattern (Arrange, Act, Assert)
2. Use meaningful test descriptions
3. Mock external dependencies
4. Maintain test isolation
5. Include both positive and negative test cases

### Code Coverage
- Track coverage using Jest
- Generate coverage reports in CI/CD
- Review coverage trends
- Focus on critical path coverage

### Test Data Management
- Use factories for test data generation
- Maintain separate test databases
- Clean up test data after each run
- Version control test fixtures

## Running Tests Locally

```bash
# Install dependencies
npm install

# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:performance

# Generate coverage report
npm run test:coverage
```

## Troubleshooting

### Common Issues
1. Flaky tests
   - Solution: Add retries and better assertions
2. Slow tests
   - Solution: Parallelize test execution
3. Resource leaks
   - Solution: Proper cleanup in afterEach/afterAll

### Debug Tools
- Jest debugger configuration
- Chrome DevTools integration
- Logging and monitoring

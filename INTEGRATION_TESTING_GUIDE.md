# Integration Testing Guide

This project demonstrates comprehensive integration testing concepts using Mocha, Chai, and Sinon.

## What are Integration Tests?

Integration tests verify that multiple components work together correctly. Unlike unit tests that test individual functions in isolation, integration tests ensure that:

- Multiple classes can work together
- Complete workflows function end-to-end
- External dependencies are handled properly
- Data flows correctly between components

## Test Structure

### 1. Chef and Cube Integration - Restaurant Math
**Purpose**: Shows how two different classes can work together
- `Chef` class provides menu functionality
- `Cube` class provides mathematical calculations
- Integration: Using cube geometry for restaurant planning

**Key Learning**: How to combine functionality from different classes

### 2. Complete Order Processing Workflow
**Purpose**: Tests end-to-end workflows with async operations
- Simulates real customer order processing
- Uses timeouts to simulate real-world delays
- Tests multiple orders with different parameters

**Key Learning**: How to test complete user workflows with async operations

### 3. External Service Integration (Mocked)
**Purpose**: Shows how to test integration with external services
- Mocks external APIs (inventory, payment services)
- Tests both success and failure scenarios
- Demonstrates proper error handling

**Key Learning**: How to mock external dependencies and test error scenarios

### 4. Data Flow Integration Tests
**Purpose**: Ensures data consistency across operations
- Tests that data remains consistent during multiple operations
- Tests concurrent operations
- Verifies state management

**Key Learning**: How to test data integrity and concurrent operations

### 5. Performance Integration Tests
**Purpose**: Tests system performance under load
- Processes large datasets
- Measures processing time
- Verifies performance boundaries

**Key Learning**: How to test performance and scalability

## Running the Tests

```bash
# Run all tests
npm test

# Run only integration tests
npx mocha test/integrationTest.js

# Run with detailed output
npx mocha test/integrationTest.js --reporter spec
```

## Key Integration Testing Concepts Demonstrated

### 1. Test Setup and Teardown
```javascript
beforeEach(function() {
    // Setup code runs before each test
    this.chef = new Chef();
    this.cube = new Cube(3);
    this.clock = sinon.useFakeTimers();
});

afterEach(function() {
    // Cleanup code runs after each test
    this.clock.restore();
    sinon.restore();
});
```

### 2. Mocking External Services
```javascript
const inventoryService = {
    checkStock: sinon.stub().returns(Promise.resolve({ available: true, quantity: 10 })),
    updateStock: sinon.stub().returns(Promise.resolve({ success: true }))
};
```

### 3. Testing Async Operations
```javascript
it('should process a complete customer order', function(done) {
    // Async test with done callback
    setTimeout(() => {
        // assertions here
        done();
    }, prepTime);
    
    // Fast-forward time for testing
    this.clock.tick(prepTime);
});
```

### 4. Testing Complete Workflows
```javascript
// Test entire process from order to completion
const order = { customerName: 'John', dish: this.chef.checkMenu(), quantity: 2 };
const orderCube = new Cube(order.cubeSize);
const prepTime = orderCube.getVolume() * 100;
// ... complete workflow testing
```

## Best Practices Demonstrated

1. **Isolation**: Each test is independent and doesn't affect others
2. **Realistic Scenarios**: Tests simulate real-world usage patterns
3. **Error Handling**: Tests both success and failure paths
4. **Performance**: Tests include performance considerations
5. **Data Integrity**: Verifies data consistency across operations

## Common Integration Testing Patterns

### Pattern 1: Component Integration
```javascript
// Test multiple components working together
const result1 = componentA.doSomething();
const result2 = componentB.process(result1);
assert.equal(result2, expectedValue);
```

### Pattern 2: Workflow Testing
```javascript
// Test complete user workflows
const order = createOrder();
const processed = processOrder(order);
const delivered = deliverOrder(processed);
assert.equal(delivered.status, 'completed');
```

### Pattern 3: External Service Mocking
```javascript
// Mock external dependencies
const externalService = {
    call: sinon.stub().returns(Promise.resolve(mockData))
};
// Test integration with mocked service
```

### Pattern 4: Concurrent Operations
```javascript
// Test multiple operations happening simultaneously
Promise.all([
    operation1(),
    operation2(),
    operation3()
]).then(results => {
    // Verify all operations completed correctly
});
```

## Next Steps

After understanding these integration tests, you can:

1. **Add Database Integration**: Test with real or test databases
2. **API Integration**: Test with real external APIs (in staging environments)
3. **End-to-End Testing**: Add browser automation tests
4. **Performance Testing**: Add load testing scenarios
5. **Security Testing**: Add security-focused integration tests

## Tips for Writing Good Integration Tests

1. **Keep tests focused**: Each test should verify one specific integration scenario
2. **Use realistic data**: Test with data that resembles real usage
3. **Test error scenarios**: Don't just test happy paths
4. **Maintain test independence**: Tests shouldn't depend on each other
5. **Use appropriate timeouts**: Give enough time for async operations
6. **Clean up after tests**: Restore mocks and clean up test data

This integration test suite provides a solid foundation for understanding how to test complex systems where multiple components work together!

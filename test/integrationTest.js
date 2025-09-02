const assert = require('chai').assert;
const expect = require('chai').expect;
const sinon = require('sinon');
const Chef = require('../app');
const Cube = require('../cube').Cube;

describe('Integration Tests - Complete Workflows', function() {
    
    // Test setup - runs before each test
    beforeEach(function() {
        this.chef = Chef; // Chef is already an instance, not a constructor
        this.cube = new Cube(3);
        this.clock = sinon.useFakeTimers();
    });

    // Test cleanup - runs after each test
    afterEach(function() {
        this.clock.restore();
        sinon.restore();
    });

    describe('1. Chef and Cube Integration - Restaurant Math', function() {
        
        it('should calculate serving portions using cube volume', function() {
            // Integration: Chef uses Cube math for portion calculations
            const servingSize = this.cube.getVolume(); // 27 cubic units
            const dish = this.chef.checkMenu();
            
            // Test that we can combine both classes' functionality
            assert.isString(dish);
            assert.isNumber(servingSize);
            assert.equal(servingSize, 27);
            
            // Simulate a real-world scenario
            const portions = Math.floor(servingSize / 3); // 9 portions
            assert.equal(portions, 9);
        });

        it('should calculate kitchen space using cube surface area', function() {
            // Integration: Using cube geometry for kitchen planning
            const kitchenSpace = this.cube.getSurfaceArea(); // 54 square units
            const availableDishes = this.chef.dishes.length; // 4 dishes
            
            // Test workflow: Kitchen space allocation per dish
            const spacePerDish = kitchenSpace / availableDishes;
            assert.equal(spacePerDish, 13.5);
            assert.isAbove(spacePerDish, 0);
        });
    });

    describe('2. Complete Order Processing Workflow', function() {
        
        it('should process a complete customer order', function(done) {
            // Integration: Complete workflow from order to preparation
            const order = {
                customerName: 'John',
                dish: this.chef.checkMenu(),
                quantity: 2,
                cubeSize: 4
            };

            // Create a new cube for this order
            const orderCube = new Cube(order.cubeSize);
            
            // Calculate preparation time based on cube volume
            const prepTime = orderCube.getVolume() * 100; // milliseconds
            const totalPrepTime = prepTime * order.quantity;

            // Simulate async preparation process
            setTimeout(() => {
                // Verify the complete workflow
                assert.isString(order.dish);
                assert.isNumber(order.quantity);
                assert.equal(orderCube.getVolume(), 64);
                assert.equal(totalPrepTime, 12800);
                
                // Test that all components worked together
                const finalOrder = {
                    ...order,
                    prepTime: totalPrepTime,
                    cubeVolume: orderCube.getVolume(),
                    status: 'completed'
                };
                
                assert.property(finalOrder, 'status');
                assert.equal(finalOrder.status, 'completed');
                done();
            }, totalPrepTime);

            // Fast-forward time for testing
            this.clock.tick(totalPrepTime);
        });

        it('should handle multiple orders with different cube sizes', function(done) {
            // Integration: Complex workflow with multiple orders
            const orders = [
                { dish: this.chef.checkMenu(), cubeSize: 2, quantity: 1 },
                { dish: this.chef.checkMenu(), cubeSize: 3, quantity: 2 },
                { dish: this.chef.checkMenu(), cubeSize: 1, quantity: 3 }
            ];

            let completedOrders = 0;
            const totalOrders = orders.length;

            orders.forEach((order, index) => {
                const cube = new Cube(order.cubeSize);
                const prepTime = cube.getVolume() * order.quantity * 50;

                setTimeout(() => {
                    completedOrders++;
                    
                    // Verify each order was processed correctly
                    assert.isString(order.dish);
                    assert.isNumber(cube.getVolume());
                    assert.isNumber(prepTime);

                    if (completedOrders === totalOrders) {
                        // All orders completed
                        assert.equal(completedOrders, 3);
                        done();
                    }
                }, prepTime);
            });

            // Fast-forward time for all orders (use the longest prep time)
            const maxPrepTime = Math.max(...orders.map(order => {
                const cube = new Cube(order.cubeSize);
                return cube.getVolume() * order.quantity * 50;
            }));
            this.clock.tick(maxPrepTime + 100); // Add buffer
        });
    });

    describe('3. External Service Integration (Mocked)', function() {
        
        it('should integrate with external inventory service', function() {
            // Integration: Mocking external service calls
            const inventoryService = {
                checkStock: sinon.stub().returns(Promise.resolve({ available: true, quantity: 10 })),
                updateStock: sinon.stub().returns(Promise.resolve({ success: true }))
            };

            // Simulate checking inventory for a dish
            const dish = this.chef.checkMenu();
            const cube = new Cube(2);
            const requiredQuantity = cube.getVolume();

            return inventoryService.checkStock(dish)
                .then(stockInfo => {
                    // Test integration with external service
                    assert.isTrue(inventoryService.checkStock.calledOnce);
                    assert.property(stockInfo, 'available');
                    assert.property(stockInfo, 'quantity');
                    
                    if (stockInfo.available && stockInfo.quantity >= requiredQuantity) {
                        return inventoryService.updateStock(dish, requiredQuantity);
                    }
                })
                .then(updateResult => {
                    // Verify the complete integration workflow
                    assert.property(updateResult, 'success');
                    assert.isTrue(updateResult.success);
                });
        });

        it('should handle external service failures gracefully', function() {
            // Integration: Error handling with external services
            const paymentService = {
                processPayment: sinon.stub().returns(Promise.reject(new Error('Payment failed'))),
                getBalance: sinon.stub().returns(Promise.resolve({ balance: 500 })) // Increased balance
            };

            const order = {
                dish: this.chef.checkMenu(),
                price: 15,
                cubeSize: 3
            };

            const cube = new Cube(order.cubeSize);
            const totalPrice = order.price * cube.getVolume(); // 15 * 27 = 405

            return paymentService.getBalance()
                .then(balanceInfo => {
                    assert.property(balanceInfo, 'balance');
                    
                    if (balanceInfo.balance >= totalPrice) {
                        return paymentService.processPayment(totalPrice);
                    } else {
                        throw new Error('Insufficient balance');
                    }
                })
                .catch(error => {
                    // Test error handling in integration
                    assert.isTrue(paymentService.processPayment.calledOnce);
                    assert.include(error.message, 'Payment failed');
                });
        });
    });

    describe('4. Data Flow Integration Tests', function() {
        
        it('should maintain data consistency across multiple operations', function() {
            // Integration: Testing data flow and consistency
            const initialCube = new Cube(5);
            const initialVolume = initialCube.getVolume();
            const dish = this.chef.checkMenu();

            // Simulate multiple operations that should maintain consistency
            const operations = [
                () => initialCube.getSurfaceArea(),
                () => initialCube.getSideLength(),
                () => this.chef.checkMenu(),
                () => initialCube.getVolume()
            ];

            const results = operations.map(op => op());

            // Verify data consistency
            assert.equal(results[0], 150); // surface area
            assert.equal(results[1], 5);   // side length
            assert.isString(results[2]);   // dish
            assert.equal(results[3], initialVolume); // volume should be unchanged
            assert.equal(results[3], 125); // 5^3
        });

        it('should handle concurrent operations correctly', function(done) {
            // Integration: Testing concurrent operations
            const cube = new Cube(4);
            let operationsCompleted = 0;
            const expectedOperations = 3;

            // Simulate concurrent operations
            const operation1 = () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const volume = cube.getVolume();
                        operationsCompleted++;
                        resolve({ type: 'volume', value: volume });
                    }, 100);
                });
            };

            const operation2 = () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const surfaceArea = cube.getSurfaceArea();
                        operationsCompleted++;
                        resolve({ type: 'surface', value: surfaceArea });
                    }, 150);
                });
            };

            const operation3 = () => {
                return new Promise(resolve => {
                    setTimeout(() => {
                        const dish = this.chef.checkMenu();
                        operationsCompleted++;
                        resolve({ type: 'dish', value: dish });
                    }, 200);
                });
            };

            // Run operations concurrently
            Promise.all([operation1(), operation2(), operation3()])
                .then(results => {
                    // Verify all operations completed
                    assert.equal(operationsCompleted, expectedOperations);
                    assert.equal(results.length, expectedOperations);
                    
                    // Verify results are correct
                    const volumeResult = results.find(r => r.type === 'volume');
                    const surfaceResult = results.find(r => r.type === 'surface');
                    const dishResult = results.find(r => r.type === 'dish');

                    assert.equal(volumeResult.value, 64);
                    assert.equal(surfaceResult.value, 96);
                    assert.isString(dishResult.value);
                    
                    done();
                });

            // Fast-forward time
            this.clock.tick(300);
        });
    });

    describe('5. Performance Integration Tests', function() {
        
        it('should handle large-scale operations efficiently', function() {
            // Integration: Testing performance with larger datasets
            const startTime = Date.now();
            
            // Simulate processing multiple orders
            const orders = [];
            for (let i = 0; i < 100; i++) {
                const cube = new Cube(i % 10 + 1);
                const dish = this.chef.checkMenu();
                orders.push({
                    id: i,
                    dish: dish,
                    volume: cube.getVolume(),
                    surfaceArea: cube.getSurfaceArea()
                });
            }

            const endTime = Date.now();
            const processingTime = endTime - startTime;

            // Verify all orders were processed
            assert.equal(orders.length, 100);
            
            // Verify performance is reasonable (should be under 100ms for this simple operation)
            assert.isBelow(processingTime, 100);
            
            // Verify data integrity
            orders.forEach((order, index) => {
                assert.property(order, 'id');
                assert.property(order, 'dish');
                assert.property(order, 'volume');
                assert.property(order, 'surfaceArea');
                assert.equal(order.id, index);
                assert.isString(order.dish);
                assert.isNumber(order.volume);
                assert.isNumber(order.surfaceArea);
            });
        });
    });
});

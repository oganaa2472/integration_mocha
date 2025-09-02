const Cube = require('../cube').Cube;
const expect = require('chai').expect;
const sinon = require('sinon');
let myObj = new Cube(2);
describe('Testing the Cube Functions', function() {
    it('1. The side length of the Cube', function(done) {
        let c1 = new Cube(2);
        expect(c1.getSideLength()).to.equal(2);
        done();
    });

    it('2. The surface area of the Cube', function(done) {
        let c1 = new Cube(2);
        expect(c1.getSurfaceArea()).to.equal(24);
        done();
    });
    
    it('3. The volume of the Cube', function(done) {
        let c1 = new Cube(2);
        expect(c1.getVolume()).to.equal(8);
        done();
    });
    it('4. spy the add method', function(done) {
        var spy = sinon.spy(myObj, 'add');
        var arg1 = 1;
        var arg2 = 2;
        var result = myObj.callAanotherMethod(arg1, arg2);
     
        expect(spy.calledOnce).to.be.true;
        
       
        done();
    });
    
});

describe('Testing the Promise', function() {
    it('1. Test the promise', function(done) {
       
        myObj.testPromise().then(result => {
            expect(result).to.equal(6);
            done();
        });
    });
});
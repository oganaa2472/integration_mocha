class Cube {
    constructor(length) {
        this.length = length;
    }
    add(num1, num2) {
        return num1 + num2;
    }
    callAanotherMethod(num1,num2) {
        return this.add(num1, num2);
    }
    getSideLength () {
        return this.length;
    }
    
    getSurfaceArea () {
        return (this.length * this.length) * 6;
    }
    
    getVolume () {
        return Math.pow(this.length,3);
    }

    testPromise = function() {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(3);
            }, 1000);
            
        }).then(result => {
            return result * 2;
        });
    }
    }
    
    module.exports = {
        Cube:Cube
    }
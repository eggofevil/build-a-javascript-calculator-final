
//!!!For IE
// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
    Array.from = (function () {
      var toStr = Object.prototype.toString;
      var isCallable = function (fn) {
        return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
      };
      var toInteger = function (value) {
        var number = Number(value);
        if (isNaN(number)) { return 0; }
        if (number === 0 || !isFinite(number)) { return number; }
        return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
      };
      var maxSafeInteger = Math.pow(2, 53) - 1;
      var toLength = function (value) {
        var len = toInteger(value);
        return Math.min(Math.max(len, 0), maxSafeInteger);
      };
  
      // The length property of the from method is 1.
      return function from(arrayLike/*, mapFn, thisArg */) {
        // 1. Let C be the this value.
        var C = this;
  
        // 2. Let items be ToObject(arrayLike).
        var items = Object(arrayLike);
  
        // 3. ReturnIfAbrupt(items).
        if (arrayLike == null) {
          throw new TypeError('Array.from requires an array-like object - not null or undefined');
        }
  
        // 4. If mapfn is undefined, then let mapping be false.
        var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
        var T;
        if (typeof mapFn !== 'undefined') {
          // 5. else
          // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
          if (!isCallable(mapFn)) {
            throw new TypeError('Array.from: when provided, the second argument must be a function');
          }
  
          // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
          if (arguments.length > 2) {
            T = arguments[2];
          }
        }
  
        // 10. Let lenValue be Get(items, "length").
        // 11. Let len be ToLength(lenValue).
        var len = toLength(items.length);
  
        // 13. If IsConstructor(C) is true, then
        // 13. a. Let A be the result of calling the [[Construct]] internal method 
        // of C with an argument list containing the single item len.
        // 14. a. Else, Let A be ArrayCreate(len).
        var A = isCallable(C) ? Object(new C(len)) : new Array(len);
  
        // 16. Let k be 0.
        var k = 0;
        // 17. Repeat, while k < len… (also steps a - h)
        var kValue;
        while (k < len) {
          kValue = items[k];
          if (mapFn) {
            A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
          } else {
            A[k] = kValue;
          }
          k += 1;
        }
        // 18. Let putStatus be Put(A, "length", len, true).
        A.length = len;
        // 20. Return A.
        return A;
      };
    }());
  }
//!!!For IE

var mainOutput = document.getElementById('mainOutput');
var infoOutput = document.getElementById('infoOutput');
var errOutput = document.getElementById('errOutput');
var digitButtons = Array.from(document.getElementsByClassName('digitBut'));
var actionButtons = Array.from(document.getElementsByClassName('actionBut'));
var resultBut = document.getElementById('resultBut');
var clearButtons = Array.from(document.getElementsByClassName('clearBut'));
var container = [];
var btnClassMemory = 'digitBut';
var pointMemory = false;
clearButtons.forEach(function(clearBut) {
    clearBut.addEventListener('click', function() {
        errOutput.textContent = '';
        if (clearBut.textContent === 'AC' || container[0] === undefined || btnClassMemory === 'resultBut') {
            infoOutput.textContent = 0;
            container = [];
            btnClassMemory = 'digitBut';
        } else {
            if (btnClassMemory !== 'actionBut') infoOutput.textContent = infoOutput.textContent.slice(0, infoOutput.textContent.length - mainOutput.textContent.length);
            btnClassMemory = 'clearLastBut';
        }
        mainOutput.textContent = 0;
        pointMemory = false;
    });
});
digitButtons.forEach(function (digitBut) {
    digitBut.addEventListener('click', function() {
        errOutput.textContent = '';
        if (btnClassMemory !== 'digitBut') mainOutput.textContent = '';
        if (btnClassMemory  === 'resultBut') {
            container = [];
            infoOutput.textContent = '';
        }
        if (checkNumber(digitBut)) return null;
        if (digitBut.textContent === '.') {
            if (pointMemory) return null;
            if (mainOutput.textContent === '') {
                mainOutput.textContent += 0;
                infoOutput.textContent += 0;
            }
            pointMemory = true;
        }
        if (mainOutput.textContent === '0' && digitBut.textContent !== '.') {
            mainOutput.textContent = digitBut.textContent;
            if (btnClassMemory !== 'clearLastBut') infoOutput.textContent = digitBut.textContent;
        } else {
            mainOutput.textContent += digitBut.textContent;
            infoOutput.textContent += digitBut.textContent;
        }   
        btnClassMemory = 'digitBut';
    });
});
function checkNumber(digitBut) {
    if (parseFloat(mainOutput.textContent + digitBut.textContent) > 9007199254740991) {
        errOutput.textContent = 'To big number: maximum allowed 9007199254740991.';
        return true;
    }
    if (parseFloat(mainOutput.textContent + digitBut.textContent) < -9007199254740991) {
        errOutput.textContent = 'To small number: maximum allowed 9007199254740991.';
        return true;
    }
    if (mainOutput.textContent.length + 1 > 16) {
        errOutput.textContent = 'To much digits';
        return true;
    }
}
actionButtons.forEach(function (actionBut) {
    actionBut.addEventListener('click', function() {
        errOutput.textContent = '';
        if (btnClassMemory === 'resultBut') container.splice(1, 2);
        if (btnClassMemory === 'actionBut' || btnClassMemory === 'clearLastBut') {
            container[1] = actionBut.textContent;
            infoOutput.textContent = infoOutput.textContent.slice(0, infoOutput.textContent.length - 1) + container[1];
            return null;
        }
        if (container[0] === undefined) {
            container[0] = mainOutput.textContent;
        } else {
            container[2] = mainOutput.textContent;
            action();
        }
        if (container[0] !== undefined) {
            container[1] = actionBut.textContent;
            pointMemory = false;
            btnClassMemory = 'actionBut';
            infoOutput.textContent += container[1];
        }
    });
});
resultBut.addEventListener('click', function() {
    errOutput.textContent = '';
    if (container[0] === undefined) {
        return null;
    } else {
        if (btnClassMemory !== 'resultBut') container[2] = mainOutput.textContent;
        if (btnClassMemory === 'actionBut') {
            infoOutput.textContent += container[0];
        }
        action();
        if (btnClassMemory === 'resultBut') {
            infoOutput.textContent += container[1] + container[2];
        }
        if (container[0] !== undefined) infoOutput.textContent += '=' + container[0];
        pointMemory = false;
        btnClassMemory = 'resultBut';
    }
});
function action() {
    fraction0 = '1';
    fraction2 = '1';
    if (container[0].indexOf('.') !== -1) {
        for(var i = 0; i < container[0].length - container[0].indexOf('.') - 1; i++) {
            fraction0 += '0';
        }
    }
    if (container[2].indexOf('.') !== -1) {
        for(var i = 0; i < container[2].length - container[2].indexOf('.') - 1; i++) {
            fraction2 += '0';
        }
    }
    container[0] = parseFloat(container[0]);
    container[2] = parseFloat(container[2]);
    switch (container[1]) {
        case '+':
        container[0] = (container[0] * Math.max(fraction0, fraction2) + container[2] * Math.max(fraction0, fraction2)) / Math.max(fraction0, fraction2);
        break;
        case '-':
        container[0] = (container[0] * Math.max(fraction0, fraction2) - container[2] * Math.max(fraction0, fraction2)) / Math.max(fraction0, fraction2);
        break;
        case '×':
        container[0] = ((container[0] * fraction0) * (container[2] * fraction2))/(fraction0 * fraction2);
        break;
        case '÷':
        container[0] = (container[0] * Math.max(fraction0, fraction2)) / (container[2] * Math.max(fraction0, fraction2));
    }
    if (container[0] < 9007199254740991 && container[0] > -9007199254740991) {
        container[0] = container[0].toString();
        container[2] = container[2].toString();
        mainOutput.textContent = container[0];
        return null;
    }
    if (container[0] > 9007199254740991) errOutput.textContent = 'Unsafe operation! Result > 9007199254740991';
    if (container[0] < -9007199254740991) errOutput.textContent = 'Unsafe operation! Result < -9007199254740991';
    infoOutput.textContent = 0;
    container = [];
    btnClassMemory = 'digitBut';
    mainOutput.textContent = 0;
    pointMemory = false;
}






//*---------------------------*/
/*---- INITIALIZE VARIABLES --*/
/*---------------------------*/
const DOMstrings = {
    numbersPad: ".numbers--pad",
    operationsPad: ".operations--pad",
    displayInput: ".display-input",
    clearBtn: ".clear-btn"
};

const KeyCodes = {
    zero: 48,
    eight: 56,
    nine: 57,
    shift: 16,
    equal: 187,
    minus: 189,
    divide: 191,
    period: 190,
    clear: 8,
    enter: 13
}

const numpadElement = document.querySelector(DOMstrings.numbersPad);
const operationsElement = document.querySelector(DOMstrings.operationsPad);
const clearBtn = document.querySelector(DOMstrings.clearBtn);

const numpadBtnsCollection = numpadElement.getElementsByTagName('button');
const operationsBtnsCollection = operationsElement.getElementsByTagName('button');

const numpadBtnsArr = Array.prototype.slice.call(numpadBtnsCollection);
const operationsArr = Array.prototype.slice.call(operationsBtnsCollection);

let exp1='', exp2='', result=0, prevExp=0;
let mathSymbol = null;
let prevKey = 0;

//*---------------------------*/
/*---- HELPER METHODS ------*/
/*---------------------------*/
const calculate = (num1, symbol, num2) => {
    let answer = 0;
    switch(symbol){
        case '+':
            answer = num1 + num2;
            break;
        case '-':
            answer = num1 - num2;
            break;
        case 'x':
            answer = num1 * num2;
            break;
        case '/':
            answer = num1 / num2;
            break;
        default:
            answer = 0;
    }

    return answer;
}

const updateDisplay = (num) => {
    //Cannot show the following characters =
    if(Number.isNaN(num)) return;

    const displayInputEl = document.querySelector(DOMstrings.displayInput);
    displayInputEl.value = num;
}

const resetValues = () => {
    mathSymbol = '';
    exp1='';
    exp2='';
    result=0;
    prevExp=0;
}

const clearEverything = () => {
    resetValues();
    updateDisplay(0);
}

const clearCurrentExpression = () => {
    if((!mathSymbol && !prevExp) || prevExp) {
        exp1 = '';
    } else if((mathSymbol && !prevExp) || !prevExp) {
        exp2 = '';
    }

    updateDisplay(0);
}

function isInt(num) {
    return num % 1 === 0;
}

const buildExpression = (newInput, exp) => {
    //Check we dont go over 10 digits
    if(exp.length >= 10) return exp;

    //Handle muliple decimals
    if(newInput === '.') {
        
        //Check we don't have one already. If we do exit.
        if(exp.indexOf(newInput) !== -1) return exp;
        
        //Check that there is a number in front of the decimal. 
        newInput = exp.length === 0 ? '0.': newInput;
    }
    
    //Build expression 
    exp += newInput;

    //Return new expression.
    return exp;
}

//*---------------------------*/
/*------- MAIN METHODS ------*/
/*---------------------------*/
const buildExpressions = (newInput) => {
    if(!mathSymbol) {
        //Build expression 1
        exp1 = buildExpression(newInput, exp1);
        return exp1;
    } else {
        //Build expression 2
        exp2 = buildExpression(newInput, exp2);
        return exp2;
    }
}

//Formats big numbers into more readable expressions. 
const compressNumber = (num, digits=3) => {
    if(isInt(num)) {
        //Convert to scientific notation
        return num.toString().length > 10 ? num.toExponential(digits): num;
    } else {
        //Make sure the result does not go over 3 points after decimal. 
        return num.toFixed(digits)/1;
    }
}

// Calculates equation and handles repeated evaluations when called in a row. 
const evaluateEquation = () => {
    const inputValue = document.querySelector(DOMstrings.displayInput).value;

    if(!exp1 && !exp2 && !mathSymbol) return;

    //Prepare for the second time we evaluate the equation.
    if(!prevExp) {
        prevExp = exp2;
    } else {
        exp1 = inputValue;
        exp2 = prevExp;
    }

    //Calculate result
    return compressNumber(calculate(+exp1, mathSymbol, +exp2));
}

// Handles Number Pad Section Logic
const handleNumberPad = (newInput) => {
    let displayValue = '';

    if(newInput === '=') {
        displayValue = evaluateEquation();
    } else if(prevExp) {
        resetValues();
    }
    
    if(newInput !== '=') {
        displayValue = buildExpressions(newInput);
    }

    //Update the clear btn
    clearBtn.textContent = +displayValue > 0 ? 'C':'CE';

    //Display result
    updateDisplay(displayValue);
}

const handleKeyboardNumberPad = (keyCode) => {
    if((keyCode >= KeyCodes.zero && keyCode <= KeyCodes.nine) && prevKey !== KeyCodes.shift) {
        handleNumberPad(String.fromCharCode(keyCode));
    }

    //Period Sign
    if(keyCode === KeyCodes.period && prevKey !== KeyCodes.shift) {
        handleNumberPad('.');
    }

    //Equal Sign
    if(((prevKey !== KeyCodes.shift) && (keyCode === KeyCodes.equal)) || (keyCode === KeyCodes.enter)) {
        handleNumberPad('=');
    }
}

// Handles Math Operations Section Logic
const handleOperationsPad = (newInput) => {

    const inputValue = document.querySelector(DOMstrings.displayInput).value;

    if(prevExp) resetValues();

    if(inputValue && !exp1) exp1 = inputValue;

    if(exp1 && exp2 && mathSymbol) {
        exp1 = compressNumber(calculate(+exp1, mathSymbol, +exp2));
        exp2 = '';
        updateDisplay(exp1);
    }

    mathSymbol = newInput;
}

const handleKeyboardOperationsPad = (keyCode) => {
    //Add
    if((prevKey === KeyCodes.shift) && (keyCode === KeyCodes.equal)) {
        console.log('+');
        handleOperationsPad('+');
    }

    //Subtract
    if(keyCode === KeyCodes.minus) {
        console.log('-');
        handleOperationsPad('-');
    }

    //Multiply
    if((prevKey === KeyCodes.shift) && (keyCode === KeyCodes.eight)) {
        console.log('*');
        handleOperationsPad('x');
    }

    //Divide
    if(keyCode === KeyCodes.divide) {
        console.log('/');
        handleOperationsPad('/');
    }
}

const handleClearDisplay = () => {
    if(clearBtn.textContent === 'CE') {
        clearEverything();
    } else {
        clearCurrentExpression();
        clearBtn.textContent = 'CE';
    }
    console.log(clearBtn.textContent);
}

const handleKeyboardClearDisplay = (keyCode) => {
    if(keyCode === KeyCodes.clear) {
        handleClearDisplay();
    }
}

/*---------------------------*/
/*---- EVENT LISTENERS ------*/
/*---------------------------*/
clearBtn.addEventListener("click", handleClearDisplay);

//Number Pad Event Listener
numpadBtnsArr.forEach((btn) => {
    btn.addEventListener('click', (event) => handleNumberPad(event.target.textContent));
});

//Operations Pad Event Listener
operationsArr.forEach((btn => {
    btn.addEventListener('click', (event) => handleOperationsPad(event.target.textContent));
}));

//Keyboard Event Listener
document.addEventListener('keydown', (event) => {
    let keyCode = event.keyCode;
    
    //Numbers Pad
    handleKeyboardNumberPad(keyCode);
    
    //Operations Pad
    handleKeyboardOperationsPad(keyCode);
    
    //Clear Btn
    handleKeyboardClearDisplay(keyCode);

    prevKey = keyCode;
})



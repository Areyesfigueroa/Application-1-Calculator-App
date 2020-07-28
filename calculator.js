//*---------------------------*/
/*---- INITIALIZE VARIABLES --*/
/*---------------------------*/
const DOMstrings = {
    pad: ".pad",
    operation: 'operation',
    memory: "memory",
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

const padElement = document.querySelector(DOMstrings.pad);
const clearBtn = document.querySelector(DOMstrings.clearBtn);

const padBtnsCollection = padElement.getElementsByTagName('button');
const padBtnsArr = Array.prototype.slice.call(padBtnsCollection);

let numpadBtnsArr = padBtnsArr.filter((btn) => !btn.classList.contains(DOMstrings.operation) && !btn.classList.contains(DOMstrings.memory));
let operationBtnsArr = padBtnsArr.filter((btn) => btn.classList.contains(DOMstrings.operation));
let memoryBtnsArr = padBtnsArr.filter((btn) => btn.classList.contains(DOMstrings.memory));

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

    //Update the clear btn
    clearBtn.textContent = num > 0 ? 'C':'CE';

    //Update Input element
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

    if(!exp2) return exp1;

    const inputValue = document.querySelector(DOMstrings.displayInput).value;

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
operationBtnsArr.forEach((btn => {
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
});

let memorySum = 0;
memoryBtnsArr.forEach((btn) => {
    btn.addEventListener('click', (event) => {
                
        const memoryBtnInput = event.target.textContent;
        let result = 0;
        
        switch(memoryBtnInput) {
            case 'MC':
                resetValues();
                memorySum = 0;
                updateDisplay('0');
                break;
            case 'MR':
                if(!mathSymbol) {
                    exp1=memorySum;
                } else {
                    exp2=memorySum;
                }

                updateDisplay(memorySum);
                break;
            case 'M+':
                result = +document.querySelector(DOMstrings.displayInput).value;
                memorySum += result;
                memorySum = compressNumber(memorySum);
                break;
            case 'M-':
                result = +document.querySelector(DOMstrings.displayInput).value;
                memorySum += (-1 * result);
                memorySum = compressNumber(memorySum);
                break;
            default:
                console.log("Something went wrong, memory btn does not exist");
        }
    });
})


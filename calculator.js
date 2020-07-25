const DOMstrings = {
    numbersPad: ".numbers--pad",
    operationsPad: ".operations--pad",
    displayInput: ".display-input",
    clearBtn: ".clear-btn"
};

let exp1='', exp2='', result=0, prevExp=0;
let mathSymbol = null;

const numpadElement = document.querySelector(DOMstrings.numbersPad);
const operationsElement = document.querySelector(DOMstrings.operationsPad);
const clearBtn = document.querySelector(DOMstrings.clearBtn);

const numpadBtnsCollection = numpadElement.getElementsByTagName('button');
const operationsBtnsCollection = operationsElement.getElementsByTagName('button');

const numpadBtnsArr = Array.prototype.slice.call(numpadBtnsCollection);
const operationsArr = Array.prototype.slice.call(operationsBtnsCollection);

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

const handleDecimal = (currInput, exp) => {
    //Handle muliple decimals
    if(currInput === '.') {
    
        //Check we don't have one already. If we do exit.
        if(exp.indexOf(currInput) !== -1) return;
        
        //Check that there is a number in front of the decimal. 
        return exp.length === 0 ? '0.': currInput;
    }
}

//Event Listeners
clearBtn.addEventListener("click", (event) => {

    console.log(event.target.textContent);
    if(event.target.textContent === 'CE') {
        clearEverything();
    } else {
        clearCurrentExpression();
        event.target.textContent = 'CE';
    }
});

//Number Pad Event Listener
numpadBtnsArr.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        let num = event.target.textContent;
        const inputValue = document.querySelector(DOMstrings.displayInput).value;
        let displayValue = '';

        if(num === '=') {
            if(!exp1 && !exp2 && !mathSymbol) return;

            if(!prevExp) {
                prevExp = exp2;
            } else {
                exp1 = inputValue;
                exp2 = prevExp;
            }

            let res = calculate(+exp1, mathSymbol, +exp2);

            if(isInt(res)) {
                //Convert to scientific notation
                res = res.toString().length > 10 ? res.toExponential(3): res;
            } else {
                //Make sure the result does not go over 3 points after decimal. 
                res = res.toFixed(3)/1;
            }

            //Update display
            displayValue = res;
        } else if(prevExp) {
            resetValues();
        }
        
        if(mathSymbol && num !== '=') {
            
            //Check we dont go over 10 digits
            if(exp2.length >= 10) return;

            //Handle muliple decimals
            if(num === '.') {
                
                //Check we don't have one already. If we do exit.
                if(exp2.indexOf(num) !== -1) return;
                
                //Check that there is a number in front of the decimal. 
                num = exp2.length === 0 ? '0.': num;
            }
            
            //Build expression 2
            exp2 += num;

            //Update display
            displayValue = exp2;
        } else if(!mathSymbol && num !== '='){

            //Check we dont go over 10 digits
            if(exp1.length >= 10) return;

            //Handle muliple decimals
            if(num === '.') {
                //Check we don't have one already. If we do exit.
                if(exp1.indexOf(num) !== -1) return;

                //Check that there is a number in front of the decimal. 
                num = exp1.length === 0 ? '0.': num;
            }

            //Build Expression 1
            exp1 += num;

            //Update display
            displayValue = exp1;
        }

        //Update the clear btn
        clearBtn.textContent = +displayValue > 0 ? 'C':'CE';

        //Display result
        updateDisplay(displayValue);
    });
});

//Operations Pad Event Listener
operationsArr.forEach((btn => {
    btn.addEventListener('click', (event) => {

        const inputValue = document.querySelector(DOMstrings.displayInput).value;

        if(prevExp) {
            resetValues();
        }

        if(inputValue && !exp1) {
            exp1 = inputValue;
        }

        if(exp1 && exp2 && mathSymbol) {
            exp1 = calculate(+exp1, mathSymbol, +exp2);
            exp2 = '';
            updateDisplay(exp1);
        }
        mathSymbol = event.target.textContent;
    });
}));





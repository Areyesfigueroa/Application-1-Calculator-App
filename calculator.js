const DOMstrings = {
    numbersPad: ".numbers--pad",
    operationsPad: ".operations--pad",
    displayInput: ".display-input",
    clearBtn: ".clear-btn"
};

let exp1='', exp2='', result=0, prevNum=0;
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
    mathSymbol = null;
    exp1='';
    exp2='';
    prevNum=0;
}

//Event Listeners
clearBtn.addEventListener("click", () => {
    resetValues();
    updateDisplay(0);
});

//Number Pad Event Listener
numpadBtnsArr.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        let num = event.target.textContent;
        const inputValue = document.querySelector(DOMstrings.displayInput).value;

        if(num === '=') {

            //Calculate expressions
            let result = calculate(Number.parseFloat(exp1), mathSymbol, Number.parseFloat(exp2));
            
            //Reset Values
            resetValues();
            
            //Update display
            updateDisplay(result);
        }else if(!mathSymbol) {
            //Build Expression 1
            exp1 = exp1+num;

            //Update display
            updateDisplay(exp1);
        } else {
            //Update first expression if continuing calculation.
            if(!exp1) exp1 = inputValue;

            //Build Expression 2
            exp2 = exp2+num;
            
            //Update display
            updateDisplay(exp2);
        }

        //Update prev number.
        prevNum = isNaN(num)? prevNum: num;
    });
});

//Operations Pad Event Listener
operationsArr.forEach((btn => {
    btn.addEventListener('click', (event) => {
        if(exp1 && exp2 && mathSymbol) {
            //Calculate equation
            let result = calculate(Number.parseFloat(exp1), mathSymbol, Number.parseFloat(exp2));

            //Update Values
            resetValues();

            //Diplay Result
            updateDisplay(result);
        }

        mathSymbol = event.target.textContent;
    });
}));





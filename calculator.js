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
            if(!exp1 && !exp2 && !mathSymbol) return;

            if(!prevExp) {
                prevExp = exp2;
            } else {
                exp1 = inputValue;
                exp2 = prevExp;
            }

            let res = calculate(+exp1, mathSymbol, +exp2);
            updateDisplay(res);
            // resetValues();
        } else if(prevExp) {
            resetValues();
        }
        
        if(mathSymbol && num !== '=') {
            exp2 += num;
            updateDisplay(exp2);
        } else if(!mathSymbol && num !== '='){
            exp1 += num;
            updateDisplay(exp1);
        }
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





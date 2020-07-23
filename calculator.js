const DOMstrings = {
    numbersPad: ".numbers--pad",
    operationsPad: ".operations--pad",
    displayInput: ".display-input",
    clearBtn: ".clear-btn"
};

let result = null;
let mathSymbol = null;

const numpadElement = document.querySelector(DOMstrings.numbersPad);
const operationsElement = document.querySelector(DOMstrings.operationsPad);
const clearBtn = document.querySelector(DOMstrings.clearBtn);

const numpadBtnsCollection = numpadElement.getElementsByTagName('button');
const operationsBtnsCollection = operationsElement.getElementsByTagName('button');

const numpadBtnsArr = Array.prototype.slice.call(numpadBtnsCollection);
const operationsArr = Array.prototype.slice.call(operationsBtnsCollection);

const calculate = (num1, symbol, num2) => {
    let result = 0;
    switch(symbol){
        case '+':
            result = num1 + num2;
            break;
        case '-':
            result = num1 - num2;
            break;
        case '*':
            result = num1 * num2;
            break;
        case '/':
            result = num1 / num2;
            break;
        default:
            result = num1;
    }

    return result;
}

updateDisplay = (num) => {
    //Cannot show the following characters =
    if(Number.isNaN(num)) return;

    const displayInputEl = document.querySelector(DOMstrings.displayInput);
    displayInputEl.value = num;
}

//Event Listeners
clearBtn.addEventListener("click", () => {
    const displayInputEl = document.querySelector(DOMstrings.displayInput);
    result = null;
    mathSymbol = null;
    displayInputEl.value = '';
});

numpadBtnsArr.forEach((btn) => {
    btn.addEventListener('click', (event) => {
        let num = event.target.textContent;
        const inputValue = document.querySelector(DOMstrings.displayInput).value;

        if(num === '=') {
            num = calculate(result, mathSymbol, Number.parseFloat(inputValue));
            mathSymbol = null;
            result = null;
        } else if((inputValue === '.' || inputValue > 0) && !mathSymbol) {
            num = inputValue+num;
        }

        updateDisplay(Number.parseFloat(num));
    });
});

operationsArr.forEach((btn => {
    btn.addEventListener('click', (event) => {
        let currNum = Number.parseFloat(document.querySelector(DOMstrings.displayInput).value);
        mathSymbol = event.target.textContent;

        if(!result) {
            result = currNum;
        } else {
            result = calculate(result, mathSymbol, currNum);
            mathSymbol = null;
        }
        updateDisplay(result);
    });
}));





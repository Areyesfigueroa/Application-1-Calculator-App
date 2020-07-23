



//Data Structure
const calculatorModelController = (function () {

})();

const calculatorUIController = (function() {
    const DOMstrings = {
        numbersPad: ".numbers--pad",
        displayInput: ".display-input",
        clearBtn: ".clear-btn"
    };


    return {
        getDOMstrings: () => {
            return DOMstrings;
        },

        updateDisplay: (num) => {
            console.log(typeof num);
            if(typeof num !== 'number') return;

            const displayInputEl = document.querySelector(DOMstrings.displayInput);
            displayInputEl.value = num;
        }
    }
    
    
})();

const calculatorController = (function(modelCtrl, UICtrl) {

    const numpadElement = document.querySelector(UICtrl.getDOMstrings().numbersPad);
    
    const numpadBtnsCollection = numpadElement.getElementsByTagName('button');
    const numpadBtnsArr = Array.prototype.slice.call(numpadBtnsCollection);

    numpadBtnsArr.forEach((btn) => {
        btn.addEventListener('click', (event) => {
            let num = Number.parseFloat(event.target.textContent);
            UICtrl.updateDisplay(num);
        });
    });

})(calculatorModelController, calculatorUIController);


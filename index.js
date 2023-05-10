class Calculator {
    previousOperandTextElement;
    currentOperandTextElement;
    allClearButtonElement;
    currentOperand;
    previousOperand;
    operation;
    specialOperation;
    constructor(previousOperandTextElement, currentOperandTextElement, allClearButtonElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.allClearButtonElement = allClearButtonElement;
        this.clear();
        this.loadOperand();
        this.updateDisplay();
    }
    clear() {
        if (this.currentOperand !== '') {
            this.currentOperand = '';
        }
        else {
            this.currentOperand = '';
            this.previousOperand = '';
            this.operation = undefined;
        }
    }
    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }
    changeSign() {
        if (this.currentOperand === "")
            return;
        this.currentOperand = (parseFloat(this.currentOperand) * -1).toString();
    }
    appendNumber(pNumber) {
        if (pNumber === '.' && this.currentOperand.includes('.'))
            return;
        this.currentOperand = this.currentOperand.toString() + pNumber.toString();
    }
    replaceNumebr(pNumber) {
        this.currentOperand = pNumber.toString();
    }
    chooseOperation(pOperation, pSpecial) {
        if (pSpecial) {
            this.specialOperation = pOperation;
            return;
        }
        if (this.currentOperand === '') {
            if (this.previousOperand !== '') {
                this.operation = pOperation;
                this.updateDisplay();
            }
            return;
        }
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = pOperation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }
    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current))
            return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '\u00F7':
                computation = prev / current;
                break;
            case 'xy':
                computation = Math.pow(prev, current);
                break;
            case 'y\u221Ax':
                computation = Math.pow(prev, 1 / current);
                break;
            case 'logxy':
                computation = getBaseLog(prev, current);
                break;
            case 'EE':
                computation = eEFunction(prev, current);
                break;
            default:
                return;
        }
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
    }
    specialCompute() {
        let computation;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current))
            return;
        switch (this.specialOperation) {
            case '%':
                computation = current / 100;
                break;
            case 'sin':
                computation = Math.sin(current);
                break;
            case 'cos':
                computation = Math.cos(current);
                break;
            case 'tan':
                computation = Math.tan(current);
                break;
            case 'sinh':
                computation = Math.sinh(current);
                break;
            case 'cosh':
                computation = Math.cosh(current);
                break;
            case 'tanh':
                computation = Math.tanh(current);
                break;
            case 'x2':
                computation = Math.pow(current, 2);
                break;
            case 'x3':
                computation = Math.pow(current, 3);
                break;
            case '10x':
                computation = Math.pow(10, current);
                break;
            case 'ex':
                computation = Math.pow(Math.E, current);
                break;
            case '1/x':
                computation = 1 / current;
                break;
            case '2\u221A':
                computation = Math.pow(current, 1 / 2);
                break;
            case '\u221B':
                computation = Math.pow(current, 1 / 3);
                break;
            case 'log10':
                computation = Math.log10(current);
                break;
            case 'ln':
                computation = Math.log(current);
                break;
            case 'x!':
                computation = factorial(current);
                break;
            default:
                return;
        }
        console.log(computation);
        this.currentOperand = computation.toString();
        this.specialOperation = undefined;
    }
    getDisplayNumber(pNumber) {
        const stringNumber = pNumber.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        }
        else {
            integerDisplay = integerDigits.toLocaleString("en", { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        }
        else {
            return integerDisplay;
        }
    }
    updateDisplay() {
        this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        if (this.operation != null && this.operation) {
            this.previousOperandTextElement.innerText = `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        }
        else {
            this.previousOperandTextElement.innerText = '';
        }
        if (this.currentOperand !== '') {
            this.allClearButtonElement.innerText = "C";
        }
        else {
            this.allClearButtonElement.innerText = "AC";
        }
        this.saveOperand();
    }
    saveOperand() {
        sessionStorage.setItem("currentOperand", this.currentOperand);
        sessionStorage.setItem("previousOperand", this.previousOperand);
        sessionStorage.setItem("operation", this.operation);
    }
    loadOperand() {
        const savedCurrentOperand = sessionStorage.getItem("currentOperand");
        const savedPreviousOperand = sessionStorage.getItem("previousOperand");
        const savedOperation = sessionStorage.getItem("operation");
        if (this.currentOperand === "" && savedCurrentOperand != null)
            this.currentOperand = savedCurrentOperand;
        if (this.previousOperand === "" && savedPreviousOperand != null)
            this.previousOperand = savedPreviousOperand;
        if (this.operation === undefined && savedOperation != null && savedOperation != "undefined") {
            this.operation = savedOperation;
        }
    }
}
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operation]');
const specialOperationButtons = document.querySelectorAll('[data-special-operation]');
const equalsButton = document.querySelector('[data-equals]');
const signButton = document.querySelector('[data-sign]');
const deleteButton = document.querySelector('[data-delete]');
const allClearButton = document.querySelector('[data-all-clear]');
const previousOperandTextElement = document.querySelector('[data-previous]');
const currentOperandTextElement = document.querySelector('[data-current]');
const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement, allClearButton);
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    });
});
operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText, false);
        calculator.updateDisplay();
    });
});
equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
});
allClearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
});
deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
});
signButton.addEventListener('click', button => {
    calculator.changeSign();
    calculator.updateDisplay();
});
specialOperationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.innerText, true);
        calculator.specialCompute();
        calculator.updateDisplay();
    });
});
function specialNumber(pNumber) {
    calculator.replaceNumebr(pNumber);
    calculator.updateDisplay();
}
function getBaseLog(pX, pY) {
    return Math.log(pY) / Math.log(pX);
}
function factorial(pX) {
    if (pX < 0)
        return pX;
    if (pX === 0)
        return 1;
    for (let i = pX; i > 2; i--) {
        pX *= (i - 1);
    }
    return pX;
}
function eEFunction(pX, pY) {
    return pX * Math.pow(10, pY);
}

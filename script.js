const add = (a, b) => a + b;
const substract = (a, b) => a - b;
const multiply = (a, b) => a * b;
const divide = (a, b) => a / b;
const operate = (operator, a, b) => operator(parseFloat(a), parseFloat(b));
const container = document.getElementById('container');
const display = document.querySelector('div.display');
const buttons = Array.from(document.getElementsByClassName('button'));
const clear = document.querySelector('.clear');
const deleteBtn = document.querySelector('.delete');
const equal = document.querySelector('.equal');
const point = document.querySelector('.point');
const errorSpan = document.querySelector('.error-span');
let equalBtnClicked = false;
let displayedValue;
HTMLDivElement.prototype.populateDisplay = function(){
  let buttonValue = this.textContent;
  if (/\d/.test(this.textContent) && (equalBtnClicked)) display.textContent="";
  equalBtnClicked = false;
  displayedValue = display.textContent += buttonValue;
};


HTMLDivElement.prototype.pointFunction = function(){

  const operationSplitedArray = display.textContent.split(/\s*([-+x/])\s*/);
  const lastItem = operationSplitedArray[operationSplitedArray.length-1];
  if (equalBtnClicked) {
    display.textContent = "0.";
    equalBtnClicked = false;
  } else {
      if (!/\d/.test(lastItem)){
        displayedValue = display.textContent += "0.";
      } else {
        if (!lastItem.includes(".")) this.populateDisplay();
      }
  }
};

function clearFunction(){
  display.textContent = '';
};


function deleteFunction(){
  let lastCharRemoved = display.textContent.slice(0, -1);
  display.textContent = lastCharRemoved;
};

function selectOperator(stringOperator){
  const operatorSign = ["-","/","+","x"].find(element => element === stringOperator);
  switch (operatorSign){
    case '+':
      return add;
      break;
    case '-':
      return substract;
      break;
    case 'x':
      return multiply;
      break;
    case '/':
      return divide;
      break;
  };
};

function evaluateOperation(arrayToEvaluate){
  while (arrayToEvaluate.length !== 1) {
    const a = arrayToEvaluate.shift();
    const signOperator = arrayToEvaluate.shift();
    const b = arrayToEvaluate.shift();
    const selectedOperator = selectOperator(signOperator);
    const result = operate(selectedOperator, a, b);
    arrayToEvaluate.unshift(Number((result).toFixed(11)).toString());
  }
  return arrayToEvaluate.join('');
};

function negativeDenominatorManager(array){
  while (array.some(e =>/^\d.*\/$|^\d.*\x$/.test(e))){
    for (let i = 0; i < array.length; i++){
      if (/^\d.*\/$|^\d.*\x$/.test(array[i])){
        let fixedOpertation = array[i] + array[i+1] + array[i+2];
        array.splice(i+1, 2);
        array[i] = fixedOpertation;
      }
    }
  }
};

function signsManager(arr){  // Manage if a number with a sign follow an operator
  while (arr.includes('')){
    const blankIndex = arr.indexOf('');
    const signBeforeBlankIndex = blankIndex - 1;
    const signAfterBlankIndex = blankIndex + 1;

    if (arr[blankIndex + 2] === "" || arr[arr.length-1] === '') return NaN; // Unvalidate the format if more than 2 signs following or last item is an operator

    if (signBeforeBlankIndex === -1){ // Evaluate the first number if it's negative (the first item would be '')
      arr[1] === "-" ? arr.splice(0, 3, "-" + arr[2]) : arr.splice(0, 3, arr[2])
    }

    if (arr[signBeforeBlankIndex] === "+" && arr[signAfterBlankIndex] === "+"){
      arr.splice(signBeforeBlankIndex, 3, '+' )
    } else if (arr[signBeforeBlankIndex] === "-" && arr[signAfterBlankIndex] === "-"){
      arr.splice(signBeforeBlankIndex, 3, '+' )
    } else if (arr[signBeforeBlankIndex] === "+" && arr[signAfterBlankIndex] === "-"){
      arr.splice(signBeforeBlankIndex, 3, '-' )
    };
  };
  return arr;
};

function evaluateDisplayedValue(){
  const operationArray = display.textContent.split(/\s*([-+])\s*/);
  negativeDenominatorManager(operationArray);
  signsManager(operationArray);

  const resolvedMultiplicationsAndDivisionsArray = operationArray.map((e) => { //First resolve * & /
    if (e.includes("x") || e.includes("/")){
      const elementToEvaluateArray = e.split(/\s*([x/])\s*/);
      return evaluateOperation(elementToEvaluateArray);
    } else {
      return e;
    }
  });

  const result = evaluateOperation(resolvedMultiplicationsAndDivisionsArray); //Then resolve + & -

  if (result !== "NaN" && result !== "-NaN"){ // Validates the format
    display.textContent = result;
    equalBtnClicked = true;  // Allows continuing operation with the result after hitting "="
  } else {
    displayErrorMessage();
  };
};

function displayErrorMessage(){
  errorSpan.classList.add('display-error-message');
  errorSpan.addEventListener('transitionend', function(e){
    this.classList.remove('display-error-message');
  })
};

buttons.forEach(function(btn){
  btn.addEventListener('click', HTMLDivElement.prototype.populateDisplay);
});

point.addEventListener('click', HTMLDivElement.prototype.pointFunction);
clear.addEventListener('click', clearFunction);
deleteBtn.addEventListener('click', deleteFunction);
equal.addEventListener('click', function(){
  evaluateDisplayedValue();
});

// Keyboard support:
window.addEventListener('keydown', function(e){
  const keyPressed = document.querySelector(`div[data-key="${e.keyCode}"]`)

  if (keyPressed === deleteBtn){
    deleteFunction()
  } else if (keyPressed === equal) {
    evaluateDisplayedValue()
  } else if (keyPressed === clear) {
    clearFunction()
  } else if (keyPressed === point){
    keyPressed.pointFunction()
  } else {
    keyPressed.populateDisplay()
  }
});

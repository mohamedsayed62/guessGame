let numOfTries = 6;
let numOfLetters = 6;
let currentTry = 1;

let divInputs = document.querySelector(".inputs");

let hintBtn = document.querySelector(".hint");
let numOfHints = 2;
let hint = `${numOfHints} Hints`;


function generateInputs() {
  for (let i = 1; i <= numOfTries; i++) {
    const tryDiv = document.createElement("div");
    tryDiv.classList.add(`try-${i}`);
    tryDiv.innerHTML = `<span>Try ${i}`;
    if (i !== currentTry) {
      tryDiv.classList.add("disabled-input");
    }
    
    for (let j = 1; j <= numOfLetters; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.id = `guess-${i}-letter-${j}`;
      input.maxLength = "1";
      tryDiv.appendChild(input);
    }
    divInputs.appendChild(tryDiv);
    divInputs.children[0].children[1].focus();
    const inputsInTtyDiv = document.querySelectorAll(".disabled-input input");
    inputsInTtyDiv.forEach(input => input.disabled = true);
  }
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input, index) => {
    input.addEventListener("input", function () {
      if (this.value != "") {
        const nextInput = inputs[index + 1];
        if (nextInput) nextInput.focus();
      }
    })
    input.addEventListener("keydown", function (e) {
      if (e.key == "ArrowRight") {
        let idx = Array.from(inputs).indexOf(e.target);
        idx++;
        if (idx < inputs.length) {
          const nextInput = inputs[idx];
          nextInput.focus();
        }
      }
      if (e.key == "ArrowLeft") {
        let previdx = Array.from(inputs).indexOf(e.target);
        previdx--;
        if (previdx >= 0) {
          const prevInput = inputs[previdx];
          prevInput.focus();
        }
      }
      this.setSelectionRange(this.value.length, this.value.length);
    })
  })
  hintBtn.innerHTML = hint;
}
let checkBtn = document.querySelector(".check");
let word = "ELZERO";
let guessWord = "";

let rightLetters = new Set();
checkBtn.addEventListener("click", () => {
  guessWord = "";
  let tryDiv = document.querySelector(`.inputs .try-${currentTry}`);
  let tryInputs = Array.from(tryDiv.children);
  for (let i = 1; i < tryInputs.length; i++) {
    guessWord += tryInputs[i].value;
    let char = tryInputs[i].value.toUpperCase();
    if (char == word[i - 1]) {
      tryInputs[i].classList.add("right");
      rightLetters.add(i - 1);
    } else if (word.includes(char)) {
      tryInputs[i].classList.add("not-in-place");
    } else {
      tryInputs[i].classList.add("wrong");
    }
  }
  if (guessWord.toUpperCase() == word) {
    alert("Congratulations, Your Guess Is Right");
    tryInputs.forEach((input) => input.disabled = true);
  } else {
    tryDiv.classList.add("disabled-input");
    currentTry += 1;
    tryInputs.forEach((input) => {
      input.disabled = true;
    })
    tryDiv = document.querySelector(`.inputs .try-${currentTry}`);
    tryDiv.classList.remove("disabled-input");
    tryInputs = document.querySelectorAll(`.inputs .try-${currentTry} input`);
    tryInputs.forEach((input) => {
      input.removeAttribute("disabled");
    })
    tryDiv.children[1].focus();
  }
})
window.onload = generateInputs;

hintBtn.addEventListener("click", () => {
  if (numOfHints == 0 || rightLetters.size == word.length) return;
  hintBtn.innerHTML = `${--numOfHints} Hints`;
  if (rightLetters.length == 0) {
    let currentInput = document.querySelector(`#guess-${currentTry}-letter-${1}`);
    currentInput.value = word[0];
    currentInput.classList.add("right");
  } else {
    let iter = rightLetters.keys();
    let flag = false;
    for (let i = 0; i < rightLetters.size; i++) {
      if (i != iter.next().value) {
        console.log(iter.next().value);
        let currentInput = document.querySelector(`#guess-${currentTry}-letter-${i + 1}`);
        currentInput.value = word[i];
        rightLetters.add(word[i]);
        currentInput.classList.add("right");
        currentInput.disabled = true;
        flag = true;
        break;
      }
    }
    if (!flag) {
      let idx = rightLetters.size;
      let currentInput = document.querySelector(`#guess-${currentTry}-letter-${idx + 1}`);
      currentInput.value = word[idx];
      rightLetters.add(word[idx]);
      currentInput.classList.add("right");
      currentInput.disabled = true;
      return;
    }
  }
})

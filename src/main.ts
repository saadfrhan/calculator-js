// Declare the math object from Math.js
declare const math: any;

document.addEventListener("DOMContentLoaded", function () {
  initCalculator();
});

function initCalculator(): void {
  const buttons = document.querySelectorAll<HTMLSpanElement>("#calculator span");
  const inputScreen = document.querySelector<HTMLElement>("#screen");
  const operators = ["+", "-", "×", "÷"];

  let input = "";
  let decimalAdded = false;

  if (!inputScreen) return;

  buttons.forEach((button) => {
    button.addEventListener("click", () => handleButtonClick(button.innerHTML, inputScreen));
  });

  function handleButtonClick(value: string, screen: HTMLElement): void {
    input = screen.innerHTML;

    switch (value) {
      case "C":
        clearInput(screen);
        break;
      case "=":
        calculateResult(screen);
        break;
      case ".":
        handleDecimalInput(value, screen);
        break;
      default:
        handleOperatorOrDigit(value, screen);
        break;
    }
  }

  function clearInput(screen: HTMLElement): void {
    screen.innerHTML = "";
    input = "";
    decimalAdded = false;
  }

  function calculateResult(screen: HTMLElement): void {
    const lastChar = input.slice(-1);

    // Replace × and ÷ with * and / for Math.js compatibility
    let expression = input.replace(/×/g, "*").replace(/÷/g, "/");

    // Remove trailing operator or decimal
    if (operators.includes(lastChar) || lastChar === ".") {
      expression = expression.slice(0, -1);
    }

    try {
      const result = math.evaluate(expression);
      screen.innerHTML = formatResult(result);
    } catch (error) {
      screen.innerHTML = "Error";
    }

    decimalAdded = false;
  }

  function handleDecimalInput(value: string, screen: HTMLElement): void {
    if (!decimalAdded) {
      screen.innerHTML += value;
      decimalAdded = true;
    }
  }

  function handleOperatorOrDigit(value: string, screen: HTMLElement): void {
    const lastChar = input.slice(-1);

    if (operators.includes(value)) {
      handleOperatorInput(value, lastChar, screen);
    } else {
      // For digits
      screen.innerHTML += value;
      decimalAdded = input.split(/[\+\-\×\÷]/).pop()?.includes(".") ?? false;
    }
  }

  function handleOperatorInput(value: string, lastChar: string, screen: HTMLElement): void {
    // Ensure there's an input and last character isn't an operator
    if (input !== "" && !operators.includes(lastChar)) {
      screen.innerHTML += value;
    }
    // Allow starting with "-" for negative numbers
    else if (input === "" && value === "-") {
      screen.innerHTML += value;
    }
    // Replace the last operator if one already exists
    else if (operators.includes(lastChar)) {
      screen.innerHTML = input.slice(0, -1) + value;
    }

    decimalAdded = false;
  }
}

function formatResult(result: number | any): string {
  const MAX_DECIMAL_PLACES = 10;

  if (typeof result === "number") {
    if (Math.abs(result) >= 1e10 || (Math.abs(result) !== 0 && Math.abs(result) <= 1e-10)) {
      return result.toExponential(MAX_DECIMAL_PLACES).replace(/\.?0+e/, 'e');
    } else {
      return parseFloat(result.toFixed(MAX_DECIMAL_PLACES)).toString();
    }
  }

  return result.toString();
}

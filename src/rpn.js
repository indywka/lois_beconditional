
// Converts infix notation to RPN
// Returns array of RPN tokens
function convertToRpn(input) {
  let queue = [];
  let stack = [];

  input = input.replace(/\s+/g, '');
  input = input.split(/([\&\|\~\>\(\)\!])/);

  // Clean the array
  for (let i = 0; i < input.length; i++) {
    if (input[i] === '') {
      input.splice(i, 1);
    }
  }

  for (let i = 0; i < input.length; i++) {
    let token = input[i];

    if (token.match(/[A-Z]/i)) {
      queue.push(token);
    } else if ('&|>~!'.indexOf(token) !== -1) {
      let o1 = token;
      let o2 = stack[stack.length - 1];

      while ('&|>~!'.indexOf(o2) !== -1) {
        queue.push(stack.pop());
        o2 = stack[stack.length - 1];
      }

      stack.push(o1);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack[stack.length - 1] !== '(') {
        queue.push(stack.pop());
      }

      stack.pop();
    }
  }

  while (stack.length > 0) {
    queue.push(stack.pop());
  }

  return queue;
}

// Calculates the value of the expression expressed as RPN
// Returns 0 or 1, the result of calculations
function calculateExpression(rpn, vars) {
  let stack = [];
  let symbol;

  let a;
  let b;

  // Calculate
  for (let i = 0; i < rpn.length; i++) {
    symbol = rpn[i];

    // If the symbol is variable push its value on to the stack
    // If it's a operator, do necessary operation
    if (symbol.match(/[A-Z]/i)) {
      stack.push(+(vars[symbol]));
    } else {
      switch (symbol) {
        case '&':
          a = stack.pop();
          b = stack.pop();
          stack.push(b && a);
          break;
        case '|':
          a = stack.pop();
          b = stack.pop();
          stack.push(b || a);
          break;
        case '~':
          a = stack.pop();
          b = stack.pop();
          stack.push(+(b === a));
          break;
        case '>':
          a = stack.pop();
          b = +(!(stack.pop()));
          stack.push(+(b || a));
          break;
        case '!':
          a = stack.pop();
          stack.push(+(!a));
          break;
        default:
          break;
      }
    }
  }

  return stack[0];
}

// Returns the array of variable tokens in RPN expression
function getVariableInfo(rpn) {
  let vars = [];

  for (let i = 0; i < rpn.length; i++) {
    // If the token is a variable (character)
    if (rpn[i].match(/[A-Z]/i)) {
      // And it's not in vars array
      if (vars.indexOf(rpn[i]) === -1) {
        vars.push(rpn[i]);
      }
    }
  }

  return vars;
}



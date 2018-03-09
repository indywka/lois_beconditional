
const BINARY_OPERATORS = ['&', '|', '~', '>'];
const UNARY_OPERATORS = ['!'];
const LEFT_BRACKET = '(';
const RIGHT_BRACKET = ')';

const OPERATORS = BINARY_OPERATORS.concat(UNARY_OPERATORS);
const BRACKETS = [LEFT_BRACKET, RIGHT_BRACKET];

const ATOMS = /[A-Z]/;

// convert infix notation to postfix notation
function convertToPostfix(input) {
    let queue = [];
    let stack = [];

    input = input.replace(/\s+/g, '');
    // TODO: replace with BINARY_OPERATORS
    delimiters = new RegExp("([" + "\\" + OPERATORS.concat(BRACKETS).join("\\") + "])");
    input = input.split(delimiters);

    // remove whitespaces
    for (let i = 0; i < input.length; i++) {
        if (input[i] === '') {
            input.splice(i, 1);
        }
    }

    // convert to postfix
    for (let i = 0; i < input.length; i++) {
        let token = input[i];

        if (token.match(ATOMS)) {
            queue.push(token);
        } else if (OPERATORS.includes(token)) {
            let operator1 = token;
            let operator2 = stack[stack.length - 1];

            while (OPERATORS.includes(operator2)) {
                queue.push(stack.pop());
                operator2 = stack[stack.length - 1];
            }

            stack.push(operator1);
        } else if (token === LEFT_BRACKET) {
            stack.push(token);
        } else if (token === RIGHT_BRACKET) {
            while (stack[stack.length - 1] !== LEFT_BRACKET) {
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

// calculate the result of postfix expression
function calculatePostfix(postfix, variables) {
    let stack = [];

    // Calculate
    for (let i = 0; i < postfix.length; i++) {
        let symbol = postfix[i];

        if (symbol.match(ATOMS)) {
            stack.push(+(variables[symbol]));
        } else {
            let a;
            let b;

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

// return the array of variables in postfix expression
function getVariables(postfix) {
    let variables = [];

    for (let i = 0; i < postfix.length; i++) {
        let token = postfix[i];
        
        if (token.match(ATOMS) && !variables.includes(token)) {
            variables.push(postfix[i]);
        }
    }

    return variables;
}




const ATOMS = /[A-Z]/;

const LEFT_BRACKET = '(';
const RIGHT_BRACKET = ')';


// map of available operators
let operators = new Map();

// fill operators map with basic logical operations
function initOperators() {
    let conjunction = {isBinary: true, func: (x, y) => { return +(x && y); }};
    operators.set("&");

    let disjunction = {isBinary: true, func: (x, y) => { return +(x || y); }};
    operators.set("|", disjunction);

    let implication = {isBinary: true, func: (x, y) => { return +((!x) || y); }};
    operators.set("->", implication);

    let equivalence = {isBinary: true, func: (x, y) => { return +(x === y); }};
    operators.set("~", equivalence);

    let negation = {isBinary: true, func: (x) => { return !x; }};
    operators.set("!", negation);
}


// escape special regex symbols in the given string
function escapeRegExp(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// construct regexp for splitting logical formula into tokens
function getOperatorsRegExp() {
    // add brackets
    let regex = LEFT_BRACKET + RIGHT_BRACKET;

    // add single-character operators first
    for (let operator of operators.keys()) {
        if (operator.length == 1) {
            regex += operator;
        }
    }

    regex = "[" + escapeRegExp(regex) + "]";

    // then add multiple-character operators
    for (let operator of operators.keys()) {
        if (operator.length > 1) {
            regex += "|" + escapeRegExp(operator);
        }
    }

    regex = "(" + regex + ")";

    return new RegExp(regex);
}


// convert infix notation to postfix notation
function convertToPostfix(input) {
    initOperators();

    let queue = [];
    let stack = [];

    input = input.replace(/\s+/g, '');

    // split formula into tokens
    input = input.split(getOperatorsRegExp());

    // remove empty strings
    input = input.filter((token) => { return token != ''; });

    // convert to postfix
    for (let token of input) {

        if (token.match(ATOMS)) {
            queue.push(token);
        } else if (operators.has(token)) {
            let operator1 = token;
            let operator2 = stack[stack.length - 1];

            while (operators.has(operator2)) {
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

    for (let i = 0; i < postfix.length; i++) {
        let symbol = postfix[i];

        if (symbol.match(ATOMS)) {
            stack.push(+(variables[symbol]));
        } else {
            let a, b;
            let operator = operators.get(symbol);

            if (operator.isBinary) {
                a = stack.pop();
                b = stack.pop();

                stack.push(operator.func(b, a));
            } else {
                a = stack.pop();

                stack.push(operator.func(a));
            }
        }
    }

    return stack[0];
}

// return the array of variables in postfix expression
function getVariables(postfix) {
    let variables = [];

    for (let token of postfix) {
        if (token.match(ATOMS) && !variables.includes(token)) {
            variables.push(token);
        }
    }

    return variables;
}

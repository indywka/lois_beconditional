<!--@author: Gavriluk & Minchik -->

const ATOMS = "[A-Z]";
const CONSTANTS = "[10]";

const LEFT_BRACKET = '(';
const RIGHT_BRACKET = ')';


// map of available operators
let operators = new Map();

// fill operators map with basic logical operations
function initOperators() {
    let conjunction = {
        isBinary: true, func: (x, y) => {
            return +(x && y);
        }
    };
    operators.set("&", conjunction);

    let disjunction = {
        isBinary: true, func: (x, y) => {
            return +(x || y);
        }
    };
    operators.set("|", disjunction);

    let implication = {
        isBinary: true, func: (x, y) => {
            return +((!x) || y);
        }
    };
    operators.set("->", implication);

    let equivalence = {
        isBinary: true, func: (x, y) => {
            return +(x === y);
        }
    };
    operators.set("~", equivalence);

    let negation = {
        isBinary: false, func: (x) => {
            return +(!x);
        }
    };
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

    return regex;
}

// convert infix notation to postfix notation
function convertToPostfix(input) {
    initOperators();

    let queue = [];
    let stack = [];

    input = input.replace(/\s+/g, '');

    // split formula into tokens
    input = input.split(new RegExp("(" + getOperatorsRegExp() + ")"));

    // remove empty strings
    input = input.filter((token) => {
        return token != '';
    });

    // convert to postfix
    for (let token of input) {

        if (token.match(new RegExp(ATOMS + "|" + CONSTANTS))) {
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

    for (let token of postfix) {
        if (token.match(new RegExp(ATOMS))) {
            stack.push(variables[token]);

        } else if (token.match(new RegExp(CONSTANTS))) {
            stack.push(+token);

        } else {
            let a, b;
            let operator = operators.get(token);

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
        if (token.match(new RegExp(ATOMS)) && !variables.includes(token)) {
            variables.push(token);
        }
    }

    return variables;
}

function checkFormulaCorrectness(formula) {
    initOperators();

    // remove whitespaces
    formula = formula.replace(/\s+/g, '');

    // replace all atoms and constants with test symbol
    const testSymbol = "A";
    formula = formula.replace(new RegExp(CONSTANTS + "|" + ATOMS, "g"), testSymbol);

    // construct regexp that matches valid logical formulas
    let formulas = [];
    for (let [symbol, operator] of operators.entries()) {
        if (operator.isBinary) {
            formulas.push("(?:" + escapeRegExp(LEFT_BRACKET + testSymbol + symbol + testSymbol + RIGHT_BRACKET) + ")");
        } else {
            formulas.push("(?:" + escapeRegExp(LEFT_BRACKET + symbol + testSymbol + RIGHT_BRACKET) + ")");
        }
    }
    let formulasRegExp = new RegExp(formulas.join("|"), "g");

    // keep removing valid operations from formula while this can be performed
    while (formulasRegExp.test(formula)) {
        formula = formula.replace(formulasRegExp, testSymbol);
    }

    // if formula is valid, there should be only single test symbol left
    return formula === testSymbol;
}
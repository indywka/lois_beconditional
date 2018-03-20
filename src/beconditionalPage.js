<!--@author: Minchik -->

let $firstExpression;
let $secondExpression;

let $firstTable;

let $isEquivalence;
let $isNotEquivalence;


const MAX_VARS_TO_RENDER_TABLE = 100;

function loaded() {
    $firstExpression = document.querySelector('#firstExpression');
    $secondExpression = document.querySelector('#secondExpression');

    $firstTable = document.querySelector('#outcome-tableOne');

    $isEquivalence = document.querySelector('.is-equivalence .is');
    $isNotEquivalence = document.querySelector('.is-equivalence .is-not');
}

function onCalculatePress() {
    const valFirst = $firstExpression.value.toString();
    const valSecond = $secondExpression.value.toString();
    if ((valFirst && valSecond) === "") {
        window.alert("Одно/два поля для ввода не заполнены!");
        return;
    }
    // check formulas correctness
    if (!checkFormulaCorrectness(valFirst)) {
        window.alert("Формула №1 некорректна!");
        return;
    } else if (!checkFormulaCorrectness(valSecond)) {
        window.alert("Формула №2 некорректна!");
        return;
    }
    document.querySelector('.is-equivalence').style.display = 'block';
    document.querySelector('.table').style.display = 'block';
    const equivalence = (valFirst + '~' + valSecond);
    const postfix = convertToPostfix(equivalence);
    const varList = getVariables(postfix);
    const nCombinations = (1 << varList.length);
    let isEquivalence = true;
    if (varList.length === 0) {
        let result = calculatePostfix(postfix, {});
        if (result === 0) {
            isEquivalence = false;
        }
        showBeconditionalResult(isEquivalence);
        return;
    }
    if (varList.length < MAX_VARS_TO_RENDER_TABLE) {
        let tableHtml = '<tr class="title">';
        for (let i = 0; i < varList.length; i++) {
            tableHtml += `<th>${varList[i]}</th>`;
        }

        tableHtml += `<th>${equivalence}</th></tr>`;
        $firstTable.innerHTML = tableHtml;
    } else {
        $firstTable.innerHTML = '';
        return;
    }
    // check for all possible combinations
    for (let current = 0; current < nCombinations; current++) {
        let combination = decimalToBinary(current, varList);
        // create vars object with <varName>:<value> pairs
        let vars = {};
        for (let i = 0; i < varList.length; i++) {
            vars[varList[i]] = +combination[i];
        }
        // calculate the result
        let result = calculatePostfix(postfix, vars);
        // check if the expression is equivalence
        if (result === 0) {
            isEquivalence = false;
        }
        // add result to the table
        if (varList.length < MAX_VARS_TO_RENDER_TABLE) {
            let row = $firstTable.insertRow();
            if (result === 1) {
                row.className = 'true';
            }
            else {
                row.className = 'false';
            }
            for (let i = 0; i < varList.length; i++) {
                row.insertCell(-1).innerHTML = vars[varList[i]];
            }
            row.insertCell(-1).innerHTML = result;
        } else {
            return;
        }
    }
    showBeconditionalResult(isEquivalence);
}

function showBeconditionalResult(isBeconditional) {
    if (isBeconditional) {
        $isEquivalence.style.display = 'block';
        $isNotEquivalence.style.display = 'none';
    } else {
        $isEquivalence.style.display = 'none';
        $isNotEquivalence.style.display = 'block';
    }
}

function decimalToBinary(dec, varList) {
    let bin = dec.toString(2);
    // add leading zeros
    while (bin.length !== varList.length) {
        bin = '0' + bin;
    }
    return bin;
}

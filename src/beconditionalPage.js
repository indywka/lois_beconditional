let $firstExpression;
let $secondExpression;

let $firstTable;
let $secondTable;

let $isEquivalence;
let $isNotEquivalence;


const MAX_VARS_TO_RENDER_TABLE = 100;


function loaded() {
    $firstExpression = document.querySelector('#firstExpression');
    $secondExpression = document.querySelector('#secondExpression');

    $firstTable = document.querySelector('#outcome-tableOne');
    $secondTable = document.querySelector('#outcome-tableTwo');

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
        window.alert("Формула №1 некорректна!")
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

    const decimalToBinary = (dec) => {
        let bin = (dec >>> 0).toString(2);

        // add leading zeros
        while (bin.length !== varList.length) {
            bin = '0' + bin;
        }
        return bin;
    };

    if (varList.length < MAX_VARS_TO_RENDER_TABLE) {
        let tableHtml = '<tr class="title">';
        for (let i = 0; i < varList.length; i++) {
            tableHtml += `<th>${varList[i]}</th>`;
        }

        tableHtml += '<th>Результат</th></tr>';
        $firstTable.innerHTML = tableHtml;
    } else {
        $firstTable.innerHTML = '';
    }

    // check for all possible combinations
    let isEquivalence = true;

    console.time('calculations');

    for (let current = 0; current < nCombinations; current++) {
        let combination = decimalToBinary(current);

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

            for (let i = 0; i < varList.length; i++) {
                row.insertCell().innerHTML = vars[varList[i]];
            }

            let resultCell = row.insertCell();
            resultCell.innerHTML = result;
            resultCell.className = 'result';
        }
    }
    console.timeEnd('calculations');


    if (isEquivalence) {
        $isEquivalence.style.display = 'block';
        $isNotEquivalence.style.display = 'none';
    } else {
        $isEquivalence.style.display = 'none';
        $isNotEquivalence.style.display = 'block';
    }
}

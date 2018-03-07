﻿let $firstExpression;
let $secondExpression;

let $table;

let $isEquivalence;
let $isNotEquivalence;


const MAX_VARS_TO_RENDER_TABLE = 100;


function loaded() {
    $firstExpression = document.querySelector('#firstExpression');
    $secondExpression = document.querySelector('#secondExpression');

    $table = document.querySelector('#outcome-tableOne');
    $isEquivalence = document.querySelector('.is-equivalence .is');
    $isNotEquivalence = document.querySelector('.is-equivalence .is-not');
}


function onCalculatePress() {
    const valFirst = $firstExpression.value;
    const valSecond = $secondExpression.value;
    if ((valFirst && valSecond) === "") {
        window.alert("Одно/два поля для ввода не заполнены!");
        return;
    }
    document.querySelector('.is-equivalence').style.display = 'block';
    document.querySelector('.table').style.display = 'block';

    const rpn = convertToRpn(valFirst);
    const varList = getVariableInfo(rpn);
    const combinations = (1 << varList.length);

    const decToBin = (dec) => {
        let bin = (dec >>> 0).toString(2);

        // Add leading zeros
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
        $table.innerHTML = tableHtml;
    } else {
        $table.innerHTML = '';
    }

    // Check for all possible combinations
    let isEquivalence = true;
    let vars = {};
    let bin;
    let result;
    let row;
    let resultCell;

    console.time('calculations');

    for (let current = 0; current < combinations; current++) {
        bin = decToBin(current);

        // Create vars object with <varName>:<value> pairs
        for (let i = 0; i < varList.length; i++) {
            vars[varList[i]] = bin[i];
        }

        // Calculate the result
        result = calculateExpression(rpn, vars);

        // Check if the expression is equivalence
        if (isEquivalence || result === 0) {
            isEquivalence = false;
        }

        // Add result to the array
        if (varList.length < MAX_VARS_TO_RENDER_TABLE) {
            row = $table.insertRow();

            if (result === 1) {
                row.className = 'true';
            }

            for (let i = 0; i < varList.length; i++) {
                row.insertCell().innerHTML = vars[varList[i]];
            }

            resultCell = row.insertCell();
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

function matrixArray(rows, columns) {
    let arr = [];
    for (let i = 0; i < rows; i++) {
        arr[i] = [];
        for (let j = 0; j < columns; j++) {
            arr[i][j] = i + j + 1;//вместо i+j+1 пишем любой наполнитель. В простейшем случае - null
        }
    }
    return arr;
}
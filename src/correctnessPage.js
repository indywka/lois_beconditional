let $expression;

let $isCorrect;
let $isNotCorrect;

function loaded() {
    $expression = document.querySelector('#expression');

    $isCorrect = document.querySelector('.is-correct .is');
    $isNotCorrect = document.querySelector('.is-correct .is-not');
}

function onCheckCorrectness() {
    let formula = $expression.value.toString();

    if (formula === "") {
        window.alert("Введите формулу!");
        return;
    }

    document.querySelector('.is-correct').style.display = 'block';

    let isCorrect = checkFormulaCorrectness(formula);

    if (isCorrect) {
        $isCorrect.style.display = 'block';
        $isNotCorrect.style.display = 'none';
    } else {
        $isCorrect.style.display = 'none';
        $isNotCorrect.style.display = 'block';
    }
}
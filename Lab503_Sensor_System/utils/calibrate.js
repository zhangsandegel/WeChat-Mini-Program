const math = require('./math.min.js');

function replaceExpression(expression, value) {
    if (!expression) return;
    
    expression = expression.replace(/exp/g, 'eep');
    // console.log(expression);
    expression = expression.replace(/x/g, value);
    // console.log(expression);
    expression = expression.replace(/eep/g, 'exp');
    // console.log(expression);
    return expression;
}

function evaluateExpression(value, expression) {
    expression = replaceExpression(expression, value);

    try {
        // 使用 math.evaluate 计算表达式
        const result = math.evaluate(expression);
        return result;
    } catch (error) {
        console.error('Expression error: ' + error.message);
        return "ERROR";
    }
}

module.exports = {
    evaluateExpression: evaluateExpression
};
import esprima from 'esprima'
import _ from 'lodash'

export function createFunction(functionString) {
  return new Function("sheet", 'return ' + functionString);
}

function dependencyTest(node) {
    if (node.type === 'CallExpression') {
      let {callee} = node;
      let args = node.arguments;
      if (args.length == 1 &&
        args[0].type == "Literal" &&
        callee.type == 'Identifier' &&
        callee.name == 'sheet') {
        // return argument to sheets function aka the cell row/col
        return [args[0].value];
      }
    }
    return [];
}

// List the dependiences of a function string.
export function getFunctionDependencies(functionString) {
    // TODO cannot handle namespaced dependencies
    let node = esprima.parse(functionString);
    return traverse(node, dependencyTest);
}

// Execute func on node and its children recursively
export function traverse(node, func) {
  if (node === null || node === undefined) {
    return [];
  }

  let ret = []
  ret.push(... func(node));

  // recurse
  if (typeof node === 'object') {
    _.forOwn(node, (v, k, o) => ret.push(... traverse(v,func)));
  }
  return ret;
}

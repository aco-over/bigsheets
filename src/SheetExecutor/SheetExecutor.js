import _ from 'lodash'
import toposort from 'toposort'
import {getFunctionDependencies, createFunction} from 'FunctionEval/FunctionEval'

// Calculates the values for each cell in sheet
// sheet: map<key,cell>
// mutates sheet
export function executeSheet(sheet) {
  let dependencyList = createDependencyList(sheet);
  let order = createExecutionOrder(dependencyList);
  _.forEach(order,(k) => updateCellValue(sheet, k));
}

// Determine the execution order for dependencyList
// dependency:{
//  key: string,
//  dependencies: [key],
// }
// returns: [key]
export function createExecutionOrder(dependencyList) {
  let nodes = _.map(dependencyList, (c) => c.key);
  let edges = _.flatten(_.map(dependencyList,
    (c) => _.map(c.dependencies, (k) => [c.key, k]) || [c.key]));
  let order = toposort.array(nodes, edges).reverse();
  return order;
}

export function createDependencyList(sheet) {
  return _.map(sheet.getCells(), (c) => {
    return {
      key: c.key,
      dependencies: getFunctionDependencies(c.functionString)
    }});
}

export function updateCellValue(sheet, key) {
  let cell = sheet.getCell(key);
  cell.value = createFunction(cell.functionString)((k) => sheet.getCell(k).value);
}

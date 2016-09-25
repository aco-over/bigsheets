import _ from 'lodash'

export default class CellModal {
  // cell: {
  //     key,
  //     value,
  //     functionString,
  //     function,
  //     format,
  //     formatFunction
  //     formatFunctionString
  // }
  // meta
  constructor() {
    this.cell = {};
    this.meta = {};
  }

  getFunctionString(key) {
    return _.find(this.cells, keyEq(key));
  }

  setCell(key, value) {
    value.key = key;
    let index = _.findIndex(this.cells, keyEq(key));
    if (index == -1) {
      this.cells.push(value);
    }
    else {
      this.cells[index] = value;
    }
  }

  // Returns a list of all cells
  getCells() {
    return this.cells;
  }
}

function keyEq(key) {
  return (c) => c.key == key;
}

import _ from 'lodash'
import {createExecutionOrder, executeSheet} from '../SheetExecutor'
import SheetModel from 'models/SheetModel'

describe('FunctionEval', () => {
  describe("createExecutionOrder", () => {
    it('works', () => {
      let commandList = [
        {key:'c', dependencies: ['b']},
        {key:'b', dependencies: []},
        {key:'d', dependencies: ['c']},
      ]
      let order = createExecutionOrder(commandList)
      let i = _.curry(_.indexOf, 2)(order);
      expect(order).toEqual(['b','c','d']);
      expect(i('b')).toBeLessThan(i('c'));
      expect(i('c')).toBeLessThan(i('d'));
    });
    it('handles undefined dependencies', () => {
      let commandList = [
        {key:'c'}
      ]
      let order = createExecutionOrder(commandList)
      expect(order).toEqual(['c']);
    });
  });
  describe("executeSheet", () => {
    it('works', () => {
      let sheet = new SheetModel();
      sheet.setCell('a', {functionString:'1'});
      executeSheet(sheet);
      expect(sheet.getCell("a").value).toEqual(1);
    });
    it('handles multiple cells', () => {
      let sheet = new SheetModel();
      sheet.setCell('A1', {functionString:'1'});
      sheet.setCell('A2', {functionString:'sheet("A1") + 3'});
      executeSheet(sheet);
      expect(sheet.getCell("A2").value).toEqual(4);
    });
    it('handles complicated dependencies', () => {
      let sheet = new SheetModel();
      sheet.setCell('A1', {functionString:'sheet("A3") + 1'});
      sheet.setCell('A2', {functionString:'sheet("A1") + 3'});
      sheet.setCell('A3', {functionString:'3'});
      executeSheet(sheet);
      expect(sheet.getCell("A3").value).toEqual(3);
      expect(sheet.getCell("A1").value).toEqual(4);
      expect(sheet.getCell("A2").value).toEqual(7);
    });
    it('handles built-in javascript functions', () => {
      let sheet = new SheetModel();
      sheet.setCell('A1', {functionString:'Math.floor(34.5)'});
      executeSheet(sheet);
      expect(sheet.getCell("A1").value).toEqual(34);
    });
  });
});

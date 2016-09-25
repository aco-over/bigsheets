import {createFunction, getFunctionDependencies} from '../FunctionEval'

describe('FunctionEval', () => {
  describe("createFunction", () => {
    it('works', () => {
      let func = createFunction('2*2')
      expect(func()).toEqual(4);
    });
    it('has sheet variable', () => {
      let func = createFunction('sheet + 1')
      expect(func(2)).toEqual(3);
    });
  });
  describe("getFunctionDependencies", () => {
    it('works', () => {
      let deps = getFunctionDependencies('sheet("A1")')
      expect(deps).toEqual(['A1']);
    });
  });
});

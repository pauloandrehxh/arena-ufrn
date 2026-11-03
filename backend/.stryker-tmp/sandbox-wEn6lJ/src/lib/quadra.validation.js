// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
export class QuadraValidationError extends Error {
  constructor(message) {
    if (stryMutAct_9fa48("347")) {
      {}
    } else {
      stryCov_9fa48("347");
      super(message);
      this.name = stryMutAct_9fa48("348") ? "" : (stryCov_9fa48("348"), 'QuadraValidationError');
    }
  }
}
export function validarIdQuadra(id) {
  if (stryMutAct_9fa48("349")) {
    {}
  } else {
    stryCov_9fa48("349");
    if (stryMutAct_9fa48("352") ? (!Number.isInteger(id) || id <= 0) && id > 2147483647 : stryMutAct_9fa48("351") ? false : stryMutAct_9fa48("350") ? true : (stryCov_9fa48("350", "351", "352"), (stryMutAct_9fa48("354") ? !Number.isInteger(id) && id <= 0 : stryMutAct_9fa48("353") ? false : (stryCov_9fa48("353", "354"), (stryMutAct_9fa48("355") ? Number.isInteger(id) : (stryCov_9fa48("355"), !Number.isInteger(id))) || (stryMutAct_9fa48("358") ? id > 0 : stryMutAct_9fa48("357") ? id < 0 : stryMutAct_9fa48("356") ? false : (stryCov_9fa48("356", "357", "358"), id <= 0)))) || (stryMutAct_9fa48("361") ? id <= 2147483647 : stryMutAct_9fa48("360") ? id >= 2147483647 : stryMutAct_9fa48("359") ? false : (stryCov_9fa48("359", "360", "361"), id > 2147483647)))) {
      if (stryMutAct_9fa48("362")) {
        {}
      } else {
        stryCov_9fa48("362");
        throw new QuadraValidationError(stryMutAct_9fa48("364") ? "" : (stryCov_9fa48("364"), 'ID da quadra deve ser um inteiro positivo válido.'));
      }
    }
  }
}
export function validarNomeQuadra(name) {
  if (stryMutAct_9fa48("365")) {
    {}
  } else {
    stryCov_9fa48("365");
    if (stryMutAct_9fa48("368") ? typeof name !== 'string' && name.trim().length === 0 : stryMutAct_9fa48("367") ? false : stryMutAct_9fa48("366") ? true : (stryCov_9fa48("366", "367", "368"), (stryMutAct_9fa48("370") ? typeof name === 'string' : stryMutAct_9fa48("369") ? false : (stryCov_9fa48("369", "370"), typeof name !== (stryMutAct_9fa48("371") ? "" : (stryCov_9fa48("371"), 'string')))) || (stryMutAct_9fa48("373") ? name.trim().length !== 0 : stryMutAct_9fa48("372") ? false : (stryCov_9fa48("372", "373"), (stryMutAct_9fa48("374") ? name.length : (stryCov_9fa48("374"), name.trim().length)) === 0)))) {
      if (stryMutAct_9fa48("375")) {
        {}
      } else {
        stryCov_9fa48("375");
        throw new QuadraValidationError(stryMutAct_9fa48("377") ? "" : (stryCov_9fa48("377"), 'Nome da quadra deve ser um texto não vazio.'));
      }
    }
  }
}
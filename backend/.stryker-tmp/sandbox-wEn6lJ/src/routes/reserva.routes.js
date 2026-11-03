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
import { Router } from 'express';
export function createReservaRoutes(reservaController) {
  if (stryMutAct_9fa48("533")) {
    {}
  } else {
    stryCov_9fa48("533");
    const router = Router();
    router.get(stryMutAct_9fa48("535") ? "" : (stryCov_9fa48("535"), '/'), reservaController.listar);
    router.get(stryMutAct_9fa48("537") ? "" : (stryCov_9fa48("537"), '/:id'), reservaController.buscarPorId);
    router.get(stryMutAct_9fa48("539") ? "" : (stryCov_9fa48("539"), '/usuario/:usuarioId'), reservaController.listarPorUsuario);
    router.get(stryMutAct_9fa48("541") ? "" : (stryCov_9fa48("541"), '/quadra/:quadraId'), reservaController.listarPorQuadra);
    router.post(stryMutAct_9fa48("543") ? "" : (stryCov_9fa48("543"), '/'), reservaController.criar);
    router.put(stryMutAct_9fa48("545") ? "" : (stryCov_9fa48("545"), '/:id'), reservaController.atualizar);
    router.patch(stryMutAct_9fa48("547") ? "" : (stryCov_9fa48("547"), '/:id/cancelamento'), reservaController.cancelar);
    router.delete(stryMutAct_9fa48("549") ? "" : (stryCov_9fa48("549"), '/:id'), reservaController.deletar);
    return router;
  }
}
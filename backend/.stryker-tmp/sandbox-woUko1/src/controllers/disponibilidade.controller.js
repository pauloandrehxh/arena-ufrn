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
export function createDisponibilidadeController(service) {
  if (stryMutAct_9fa48("27")) {
    {}
  } else {
    stryCov_9fa48("27");
    async function consultar(req, res) {
      if (stryMutAct_9fa48("28")) {
        {}
      } else {
        stryCov_9fa48("28");
        try {
          if (stryMutAct_9fa48("29")) {
            {}
          } else {
            stryCov_9fa48("29");
            const resultado = await service.consultar(stryMutAct_9fa48("30") ? {} : (stryCov_9fa48("30"), {
              quadraId: req.query.quadraId,
              date: req.query.date
            }));
            return res.status(200).json(resultado);
          }
        } catch (error) {
          if (stryMutAct_9fa48("31")) {
            {}
          } else {
            stryCov_9fa48("31");
            const status = stryMutAct_9fa48("32") ? error.status && 400 : (stryCov_9fa48("32"), error.status ?? 400);
            return res.status(status).json(stryMutAct_9fa48("33") ? {} : (stryCov_9fa48("33"), {
              erro: stryMutAct_9fa48("36") ? error.message && 'Erro ao consultar disponibilidade.' : stryMutAct_9fa48("35") ? false : stryMutAct_9fa48("34") ? true : (stryCov_9fa48("34", "35", "36"), error.message || (stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), 'Erro ao consultar disponibilidade.')))
            }));
          }
        }
      }
    }
    return stryMutAct_9fa48("38") ? {} : (stryCov_9fa48("38"), {
      consultar
    });
  }
}
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
import { QuadraValidationError } from '../lib/quadra.validation.js';
function responderErro(res, error, mensagem) {
  if (stryMutAct_9fa48("39")) {
    {}
  } else {
    stryCov_9fa48("39");
    if (stryMutAct_9fa48("41") ? false : stryMutAct_9fa48("40") ? true : (stryCov_9fa48("40", "41"), error instanceof QuadraValidationError)) {
      if (stryMutAct_9fa48("42")) {
        {}
      } else {
        stryCov_9fa48("42");
        return res.status(400).json(stryMutAct_9fa48("43") ? {} : (stryCov_9fa48("43"), {
          message: error.message
        }));
      }
    }
    return res.status(500).json(stryMutAct_9fa48("44") ? {} : (stryCov_9fa48("44"), {
      message: mensagem
    }));
  }
}
export function createQuadraController(quadraService) {
  if (stryMutAct_9fa48("45")) {
    {}
  } else {
    stryCov_9fa48("45");
    async function listar(req, res) {
      if (stryMutAct_9fa48("46")) {
        {}
      } else {
        stryCov_9fa48("46");
        try {
          if (stryMutAct_9fa48("47")) {
            {}
          } else {
            stryCov_9fa48("47");
            const quadras = await quadraService.listarQuadras();
            return res.json(quadras);
          }
        } catch (error) {
          if (stryMutAct_9fa48("48")) {
            {}
          } else {
            stryCov_9fa48("48");
            return responderErro(res, error, stryMutAct_9fa48("49") ? "" : (stryCov_9fa48("49"), 'Erro ao buscar quadras.'));
          }
        }
      }
    }
    async function buscarPorId(req, res) {
      if (stryMutAct_9fa48("50")) {
        {}
      } else {
        stryCov_9fa48("50");
        try {
          if (stryMutAct_9fa48("51")) {
            {}
          } else {
            stryCov_9fa48("51");
            const id = Number(req.params.id);
            const quadra = await quadraService.buscarQuadraPorId(id);
            if (stryMutAct_9fa48("54") ? false : stryMutAct_9fa48("53") ? true : stryMutAct_9fa48("52") ? quadra : (stryCov_9fa48("52", "53", "54"), !quadra)) {
              if (stryMutAct_9fa48("55")) {
                {}
              } else {
                stryCov_9fa48("55");
                return res.status(404).json(stryMutAct_9fa48("56") ? {} : (stryCov_9fa48("56"), {
                  message: stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), 'Quadra não encontrada.')
                }));
              }
            }
            return res.json(quadra);
          }
        } catch (error) {
          if (stryMutAct_9fa48("58")) {
            {}
          } else {
            stryCov_9fa48("58");
            return responderErro(res, error, stryMutAct_9fa48("59") ? "" : (stryCov_9fa48("59"), 'Erro ao buscar a quadra.'));
          }
        }
      }
    }
    async function criar(req, res) {
      if (stryMutAct_9fa48("60")) {
        {}
      } else {
        stryCov_9fa48("60");
        try {
          if (stryMutAct_9fa48("61")) {
            {}
          } else {
            stryCov_9fa48("61");
            const {
              name
            } = stryMutAct_9fa48("62") ? req.body && {} : (stryCov_9fa48("62"), req.body ?? {});
            const quadra = await quadraService.criarQuadra(name);
            return res.status(201).json(quadra);
          }
        } catch (error) {
          if (stryMutAct_9fa48("63")) {
            {}
          } else {
            stryCov_9fa48("63");
            return responderErro(res, error, stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), 'Erro ao criar quadra.'));
          }
        }
      }
    }
    async function atualizar(req, res) {
      if (stryMutAct_9fa48("65")) {
        {}
      } else {
        stryCov_9fa48("65");
        try {
          if (stryMutAct_9fa48("66")) {
            {}
          } else {
            stryCov_9fa48("66");
            const id = Number(req.params.id);
            const {
              name
            } = stryMutAct_9fa48("67") ? req.body && {} : (stryCov_9fa48("67"), req.body ?? {});
            const quadra = await quadraService.atualizarQuadra(id, name);
            return res.json(quadra);
          }
        } catch (error) {
          if (stryMutAct_9fa48("68")) {
            {}
          } else {
            stryCov_9fa48("68");
            return responderErro(res, error, stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), 'Erro ao atualizar quadra.'));
          }
        }
      }
    }
    async function deletar(req, res) {
      if (stryMutAct_9fa48("70")) {
        {}
      } else {
        stryCov_9fa48("70");
        try {
          if (stryMutAct_9fa48("71")) {
            {}
          } else {
            stryCov_9fa48("71");
            const id = Number(req.params.id);
            await quadraService.deletarQuadra(id);
            return res.status(204).send();
          }
        } catch (error) {
          if (stryMutAct_9fa48("72")) {
            {}
          } else {
            stryCov_9fa48("72");
            return responderErro(res, error, stryMutAct_9fa48("73") ? "" : (stryCov_9fa48("73"), 'Erro ao deletar quadra.'));
          }
        }
      }
    }
    return stryMutAct_9fa48("74") ? {} : (stryCov_9fa48("74"), {
      listar,
      buscarPorId,
      criar,
      atualizar,
      deletar
    });
  }
}
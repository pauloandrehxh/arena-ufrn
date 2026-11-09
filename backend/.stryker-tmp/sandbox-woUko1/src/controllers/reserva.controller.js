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
import { ReservaValidationError, ReservaNotFoundError, ReservaConflictError, normalizarDataReserva } from '../lib/reserva.validation.js';
function responderErroOperacao(res, error, mensagem) {
  if (stryMutAct_9fa48("75")) {
    {}
  } else {
    stryCov_9fa48("75");
    if (stryMutAct_9fa48("77") ? false : stryMutAct_9fa48("76") ? true : (stryCov_9fa48("76", "77"), error instanceof ReservaValidationError)) {
      if (stryMutAct_9fa48("78")) {
        {}
      } else {
        stryCov_9fa48("78");
        return res.status(400).json(stryMutAct_9fa48("79") ? {} : (stryCov_9fa48("79"), {
          message: error.message
        }));
      }
    }
    if (stryMutAct_9fa48("81") ? false : stryMutAct_9fa48("80") ? true : (stryCov_9fa48("80", "81"), error instanceof ReservaNotFoundError)) {
      if (stryMutAct_9fa48("82")) {
        {}
      } else {
        stryCov_9fa48("82");
        return res.status(404).json(stryMutAct_9fa48("83") ? {} : (stryCov_9fa48("83"), {
          message: error.message
        }));
      }
    }
    if (stryMutAct_9fa48("85") ? false : stryMutAct_9fa48("84") ? true : (stryCov_9fa48("84", "85"), error instanceof ReservaConflictError)) {
      if (stryMutAct_9fa48("86")) {
        {}
      } else {
        stryCov_9fa48("86");
        return res.status(409).json(stryMutAct_9fa48("87") ? {} : (stryCov_9fa48("87"), {
          message: error.message
        }));
      }
    }
    return res.status(500).json(stryMutAct_9fa48("88") ? {} : (stryCov_9fa48("88"), {
      message: mensagem
    }));
  }
}
export function createReservaController(reservaService) {
  if (stryMutAct_9fa48("89")) {
    {}
  } else {
    stryCov_9fa48("89");
    async function listar(req, res) {
      if (stryMutAct_9fa48("90")) {
        {}
      } else {
        stryCov_9fa48("90");
        try {
          if (stryMutAct_9fa48("91")) {
            {}
          } else {
            stryCov_9fa48("91");
            const reservas = await reservaService.listarReservas();
            return res.status(200).json(reservas);
          }
        } catch {
          if (stryMutAct_9fa48("92")) {
            {}
          } else {
            stryCov_9fa48("92");
            return res.status(500).json(stryMutAct_9fa48("93") ? {} : (stryCov_9fa48("93"), {
              message: stryMutAct_9fa48("94") ? "" : (stryCov_9fa48("94"), 'Erro ao listar reservas.')
            }));
          }
        }
      }
    }
    async function buscarPorId(req, res) {
      if (stryMutAct_9fa48("95")) {
        {}
      } else {
        stryCov_9fa48("95");
        const id = Number(req.params.id);
        if (stryMutAct_9fa48("98") ? false : stryMutAct_9fa48("97") ? true : stryMutAct_9fa48("96") ? Number.isInteger(id) : (stryCov_9fa48("96", "97", "98"), !Number.isInteger(id))) {
          if (stryMutAct_9fa48("99")) {
            {}
          } else {
            stryCov_9fa48("99");
            return res.status(400).json(stryMutAct_9fa48("100") ? {} : (stryCov_9fa48("100"), {
              message: stryMutAct_9fa48("101") ? "" : (stryCov_9fa48("101"), 'ID inválido.')
            }));
          }
        }
        try {
          if (stryMutAct_9fa48("102")) {
            {}
          } else {
            stryCov_9fa48("102");
            const reserva = await reservaService.buscarReservaPorId(id);
            if (stryMutAct_9fa48("105") ? false : stryMutAct_9fa48("104") ? true : stryMutAct_9fa48("103") ? reserva : (stryCov_9fa48("103", "104", "105"), !reserva)) {
              if (stryMutAct_9fa48("106")) {
                {}
              } else {
                stryCov_9fa48("106");
                return res.status(404).json(stryMutAct_9fa48("107") ? {} : (stryCov_9fa48("107"), {
                  message: stryMutAct_9fa48("108") ? "" : (stryCov_9fa48("108"), 'Reserva não encontrada.')
                }));
              }
            }
            return res.status(200).json(reserva);
          }
        } catch {
          if (stryMutAct_9fa48("109")) {
            {}
          } else {
            stryCov_9fa48("109");
            return res.status(500).json(stryMutAct_9fa48("110") ? {} : (stryCov_9fa48("110"), {
              message: stryMutAct_9fa48("111") ? "" : (stryCov_9fa48("111"), 'Erro ao buscar reserva.')
            }));
          }
        }
      }
    }
    async function listarPorUsuario(req, res) {
      if (stryMutAct_9fa48("112")) {
        {}
      } else {
        stryCov_9fa48("112");
        const usuarioId = Number(req.params.usuarioId);
        if (stryMutAct_9fa48("115") ? false : stryMutAct_9fa48("114") ? true : stryMutAct_9fa48("113") ? Number.isInteger(usuarioId) : (stryCov_9fa48("113", "114", "115"), !Number.isInteger(usuarioId))) {
          if (stryMutAct_9fa48("116")) {
            {}
          } else {
            stryCov_9fa48("116");
            return res.status(400).json(stryMutAct_9fa48("117") ? {} : (stryCov_9fa48("117"), {
              message: stryMutAct_9fa48("118") ? "" : (stryCov_9fa48("118"), 'ID de usuário inválido.')
            }));
          }
        }
        try {
          if (stryMutAct_9fa48("119")) {
            {}
          } else {
            stryCov_9fa48("119");
            const reservas = await reservaService.buscarReservasPorUsuario(usuarioId);
            return res.status(200).json(reservas);
          }
        } catch {
          if (stryMutAct_9fa48("120")) {
            {}
          } else {
            stryCov_9fa48("120");
            return res.status(500).json(stryMutAct_9fa48("121") ? {} : (stryCov_9fa48("121"), {
              message: stryMutAct_9fa48("122") ? "" : (stryCov_9fa48("122"), 'Erro ao buscar reservas do usuário.')
            }));
          }
        }
      }
    }
    async function listarPorQuadra(req, res) {
      if (stryMutAct_9fa48("123")) {
        {}
      } else {
        stryCov_9fa48("123");
        const quadraId = Number(req.params.quadraId);
        if (stryMutAct_9fa48("126") ? false : stryMutAct_9fa48("125") ? true : stryMutAct_9fa48("124") ? Number.isInteger(quadraId) : (stryCov_9fa48("124", "125", "126"), !Number.isInteger(quadraId))) {
          if (stryMutAct_9fa48("127")) {
            {}
          } else {
            stryCov_9fa48("127");
            return res.status(400).json(stryMutAct_9fa48("128") ? {} : (stryCov_9fa48("128"), {
              message: stryMutAct_9fa48("129") ? "" : (stryCov_9fa48("129"), 'ID de quadra inválido.')
            }));
          }
        }
        try {
          if (stryMutAct_9fa48("130")) {
            {}
          } else {
            stryCov_9fa48("130");
            const reservas = await reservaService.buscarReservasPorQuadra(quadraId);
            return res.status(200).json(reservas);
          }
        } catch {
          if (stryMutAct_9fa48("131")) {
            {}
          } else {
            stryCov_9fa48("131");
            return res.status(500).json(stryMutAct_9fa48("132") ? {} : (stryCov_9fa48("132"), {
              message: stryMutAct_9fa48("133") ? "" : (stryCov_9fa48("133"), 'Erro ao buscar reservas da quadra.')
            }));
          }
        }
      }
    }
    async function criar(req, res) {
      if (stryMutAct_9fa48("134")) {
        {}
      } else {
        stryCov_9fa48("134");
        const {
          usuarioId,
          quadraId,
          date,
          startTime,
          endTime
        } = stryMutAct_9fa48("135") ? req.body && {} : (stryCov_9fa48("135"), req.body ?? {});
        if (stryMutAct_9fa48("138") ? (!usuarioId || !quadraId || !date || !startTime) && !endTime : stryMutAct_9fa48("137") ? false : stryMutAct_9fa48("136") ? true : (stryCov_9fa48("136", "137", "138"), (stryMutAct_9fa48("140") ? (!usuarioId || !quadraId || !date) && !startTime : stryMutAct_9fa48("139") ? false : (stryCov_9fa48("139", "140"), (stryMutAct_9fa48("142") ? (!usuarioId || !quadraId) && !date : stryMutAct_9fa48("141") ? false : (stryCov_9fa48("141", "142"), (stryMutAct_9fa48("144") ? !usuarioId && !quadraId : stryMutAct_9fa48("143") ? false : (stryCov_9fa48("143", "144"), (stryMutAct_9fa48("145") ? usuarioId : (stryCov_9fa48("145"), !usuarioId)) || (stryMutAct_9fa48("146") ? quadraId : (stryCov_9fa48("146"), !quadraId)))) || (stryMutAct_9fa48("147") ? date : (stryCov_9fa48("147"), !date)))) || (stryMutAct_9fa48("148") ? startTime : (stryCov_9fa48("148"), !startTime)))) || (stryMutAct_9fa48("149") ? endTime : (stryCov_9fa48("149"), !endTime)))) {
          if (stryMutAct_9fa48("150")) {
            {}
          } else {
            stryCov_9fa48("150");
            return res.status(400).json(stryMutAct_9fa48("151") ? {} : (stryCov_9fa48("151"), {
              message: stryMutAct_9fa48("152") ? "" : (stryCov_9fa48("152"), 'Todos os campos são obrigatórios.')
            }));
          }
        }
        try {
          if (stryMutAct_9fa48("153")) {
            {}
          } else {
            stryCov_9fa48("153");
            if (stryMutAct_9fa48("156") ? typeof date === 'string' : stryMutAct_9fa48("155") ? false : stryMutAct_9fa48("154") ? true : (stryCov_9fa48("154", "155", "156"), typeof date !== (stryMutAct_9fa48("157") ? "" : (stryCov_9fa48("157"), 'string')))) {
              if (stryMutAct_9fa48("158")) {
                {}
              } else {
                stryCov_9fa48("158");
                throw new ReservaValidationError(stryMutAct_9fa48("160") ? "" : (stryCov_9fa48("160"), 'Data deve ser válida no formato YYYY-MM-DD.'));
              }
            }
            const reserva = await reservaService.criarReserva(stryMutAct_9fa48("161") ? {} : (stryCov_9fa48("161"), {
              usuarioId,
              quadraId,
              date: normalizarDataReserva(date),
              startTime,
              endTime
            }));
            return res.status(201).json(reserva);
          }
        } catch (error) {
          if (stryMutAct_9fa48("162")) {
            {}
          } else {
            stryCov_9fa48("162");
            const validacao = error instanceof ReservaValidationError;
            return res.status(validacao ? 400 : 500).json(stryMutAct_9fa48("163") ? {} : (stryCov_9fa48("163"), {
              message: validacao ? error.message : stryMutAct_9fa48("164") ? "" : (stryCov_9fa48("164"), 'Erro ao criar reserva.')
            }));
          }
        }
      }
    }
    async function atualizar(req, res) {
      if (stryMutAct_9fa48("165")) {
        {}
      } else {
        stryCov_9fa48("165");
        const id = Number(req.params.id);
        if (stryMutAct_9fa48("168") ? (!Number.isInteger(id) || id <= 0) && id > 2147483647 : stryMutAct_9fa48("167") ? false : stryMutAct_9fa48("166") ? true : (stryCov_9fa48("166", "167", "168"), (stryMutAct_9fa48("170") ? !Number.isInteger(id) && id <= 0 : stryMutAct_9fa48("169") ? false : (stryCov_9fa48("169", "170"), (stryMutAct_9fa48("171") ? Number.isInteger(id) : (stryCov_9fa48("171"), !Number.isInteger(id))) || (stryMutAct_9fa48("174") ? id > 0 : stryMutAct_9fa48("173") ? id < 0 : stryMutAct_9fa48("172") ? false : (stryCov_9fa48("172", "173", "174"), id <= 0)))) || (stryMutAct_9fa48("177") ? id <= 2147483647 : stryMutAct_9fa48("176") ? id >= 2147483647 : stryMutAct_9fa48("175") ? false : (stryCov_9fa48("175", "176", "177"), id > 2147483647)))) {
          if (stryMutAct_9fa48("178")) {
            {}
          } else {
            stryCov_9fa48("178");
            return res.status(400).json(stryMutAct_9fa48("179") ? {} : (stryCov_9fa48("179"), {
              message: stryMutAct_9fa48("180") ? "" : (stryCov_9fa48("180"), 'ID inválido.')
            }));
          }
        }
        try {
          if (stryMutAct_9fa48("181")) {
            {}
          } else {
            stryCov_9fa48("181");
            const dados = stryMutAct_9fa48("182") ? {} : (stryCov_9fa48("182"), {
              ...req.body
            });
            if (stryMutAct_9fa48("184") ? false : stryMutAct_9fa48("183") ? true : (stryCov_9fa48("183", "184"), dados.date)) {
              if (stryMutAct_9fa48("185")) {
                {}
              } else {
                stryCov_9fa48("185");
                dados.date = normalizarDataReserva(dados.date);
              }
            }
            const reserva = await reservaService.atualizarReserva(id, dados);
            return res.status(200).json(reserva);
          }
        } catch (error) {
          if (stryMutAct_9fa48("186")) {
            {}
          } else {
            stryCov_9fa48("186");
            return responderErroOperacao(res, error, stryMutAct_9fa48("187") ? "" : (stryCov_9fa48("187"), 'Erro ao atualizar reserva.'));
          }
        }
      }
    }
    async function cancelar(req, res) {
      if (stryMutAct_9fa48("188")) {
        {}
      } else {
        stryCov_9fa48("188");
        try {
          if (stryMutAct_9fa48("189")) {
            {}
          } else {
            stryCov_9fa48("189");
            const reserva = await reservaService.cancelarReserva(Number(req.params.id));
            return res.status(200).json(reserva);
          }
        } catch (error) {
          if (stryMutAct_9fa48("190")) {
            {}
          } else {
            stryCov_9fa48("190");
            return responderErroOperacao(res, error, stryMutAct_9fa48("191") ? "" : (stryCov_9fa48("191"), 'Erro ao cancelar reserva.'));
          }
        }
      }
    }
    async function deletar(req, res) {
      if (stryMutAct_9fa48("192")) {
        {}
      } else {
        stryCov_9fa48("192");
        try {
          if (stryMutAct_9fa48("193")) {
            {}
          } else {
            stryCov_9fa48("193");
            await reservaService.cancelarReserva(Number(req.params.id));
            return res.status(204).send();
          }
        } catch (error) {
          if (stryMutAct_9fa48("194")) {
            {}
          } else {
            stryCov_9fa48("194");
            return responderErroOperacao(res, error, stryMutAct_9fa48("195") ? "" : (stryCov_9fa48("195"), 'Erro ao cancelar reserva.'));
          }
        }
      }
    }
    return stryMutAct_9fa48("196") ? {} : (stryCov_9fa48("196"), {
      listar,
      buscarPorId,
      listarPorUsuario,
      listarPorQuadra,
      criar,
      atualizar,
      cancelar,
      deletar
    });
  }
}
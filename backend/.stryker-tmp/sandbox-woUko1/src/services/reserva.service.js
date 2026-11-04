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
import { ReservaValidationError, ReservaNotFoundError, ReservaConflictError, inicioReservaNoFuturo, normalizarDataReserva, validarIdReserva, validarHorariosReserva, validarDataFuturaReserva } from '../lib/reserva.validation.js';
export function createReservaService(prisma, {
  agora = stryMutAct_9fa48("716") ? () => undefined : (stryCov_9fa48("716"), () => new Date())
} = {}) {
  if (stryMutAct_9fa48("717")) {
    {}
  } else {
    stryCov_9fa48("717");
    async function validarUsuario(usuarioId, banco = prisma) {
      if (stryMutAct_9fa48("718")) {
        {}
      } else {
        stryCov_9fa48("718");
        const usuario = await banco.usuario.findUnique(stryMutAct_9fa48("719") ? {} : (stryCov_9fa48("719"), {
          where: stryMutAct_9fa48("720") ? {} : (stryCov_9fa48("720"), {
            id: usuarioId
          })
        }));
        if (stryMutAct_9fa48("723") ? false : stryMutAct_9fa48("722") ? true : stryMutAct_9fa48("721") ? usuario : (stryCov_9fa48("721", "722", "723"), !usuario)) {
          if (stryMutAct_9fa48("724")) {
            {}
          } else {
            stryCov_9fa48("724");
            throw new ReservaValidationError(stryMutAct_9fa48("726") ? "" : (stryCov_9fa48("726"), 'Usuário não encontrado.'));
          }
        }
        if (stryMutAct_9fa48("729") ? false : stryMutAct_9fa48("728") ? true : stryMutAct_9fa48("727") ? usuario.active : (stryCov_9fa48("727", "728", "729"), !usuario.active)) {
          if (stryMutAct_9fa48("730")) {
            {}
          } else {
            stryCov_9fa48("730");
            throw new ReservaValidationError(stryMutAct_9fa48("732") ? "" : (stryCov_9fa48("732"), 'Usuário inativo.'));
          }
        }
        return usuario;
      }
    }
    async function validarQuadra(quadraId, banco = prisma) {
      if (stryMutAct_9fa48("733")) {
        {}
      } else {
        stryCov_9fa48("733");
        const quadra = await banco.quadra.findUnique(stryMutAct_9fa48("734") ? {} : (stryCov_9fa48("734"), {
          where: stryMutAct_9fa48("735") ? {} : (stryCov_9fa48("735"), {
            id: quadraId
          })
        }));
        if (stryMutAct_9fa48("738") ? false : stryMutAct_9fa48("737") ? true : stryMutAct_9fa48("736") ? quadra : (stryCov_9fa48("736", "737", "738"), !quadra)) {
          if (stryMutAct_9fa48("739")) {
            {}
          } else {
            stryCov_9fa48("739");
            throw new ReservaValidationError(stryMutAct_9fa48("741") ? "" : (stryCov_9fa48("741"), 'Quadra não encontrada.'));
          }
        }
        if (stryMutAct_9fa48("744") ? false : stryMutAct_9fa48("743") ? true : stryMutAct_9fa48("742") ? quadra.active : (stryCov_9fa48("742", "743", "744"), !quadra.active)) {
          if (stryMutAct_9fa48("745")) {
            {}
          } else {
            stryCov_9fa48("745");
            throw new ReservaValidationError(stryMutAct_9fa48("747") ? "" : (stryCov_9fa48("747"), 'Quadra indisponível.'));
          }
        }
        return quadra;
      }
    }
    async function verificarConflito(data, banco = prisma) {
      if (stryMutAct_9fa48("748")) {
        {}
      } else {
        stryCov_9fa48("748");
        const conflito = await banco.reserva.findFirst(stryMutAct_9fa48("749") ? {} : (stryCov_9fa48("749"), {
          where: stryMutAct_9fa48("750") ? {} : (stryCov_9fa48("750"), {
            quadraId: data.quadraId,
            date: data.date,
            status: stryMutAct_9fa48("751") ? "" : (stryCov_9fa48("751"), 'ATIVA'),
            startTime: stryMutAct_9fa48("752") ? {} : (stryCov_9fa48("752"), {
              lt: data.endTime
            }),
            endTime: stryMutAct_9fa48("753") ? {} : (stryCov_9fa48("753"), {
              gt: data.startTime
            })
          })
        }));
        if (stryMutAct_9fa48("755") ? false : stryMutAct_9fa48("754") ? true : (stryCov_9fa48("754", "755"), conflito)) {
          if (stryMutAct_9fa48("756")) {
            {}
          } else {
            stryCov_9fa48("756");
            throw new ReservaValidationError(stryMutAct_9fa48("758") ? "" : (stryCov_9fa48("758"), 'Já existe uma reserva para essa quadra nesse horário.'));
          }
        }
      }
    }
    async function listarReservas() {
      if (stryMutAct_9fa48("759")) {
        {}
      } else {
        stryCov_9fa48("759");
        return prisma.reserva.findMany(stryMutAct_9fa48("760") ? {} : (stryCov_9fa48("760"), {
          include: stryMutAct_9fa48("761") ? {} : (stryCov_9fa48("761"), {
            usuario: stryMutAct_9fa48("762") ? false : (stryCov_9fa48("762"), true),
            quadra: stryMutAct_9fa48("763") ? false : (stryCov_9fa48("763"), true)
          })
        }));
      }
    }
    async function buscarReservaPorId(id) {
      if (stryMutAct_9fa48("764")) {
        {}
      } else {
        stryCov_9fa48("764");
        return prisma.reserva.findUnique(stryMutAct_9fa48("765") ? {} : (stryCov_9fa48("765"), {
          where: stryMutAct_9fa48("766") ? {} : (stryCov_9fa48("766"), {
            id
          }),
          include: stryMutAct_9fa48("767") ? {} : (stryCov_9fa48("767"), {
            usuario: stryMutAct_9fa48("768") ? false : (stryCov_9fa48("768"), true),
            quadra: stryMutAct_9fa48("769") ? false : (stryCov_9fa48("769"), true)
          })
        }));
      }
    }
    async function buscarReservasPorUsuario(usuarioId) {
      if (stryMutAct_9fa48("770")) {
        {}
      } else {
        stryCov_9fa48("770");
        return prisma.reserva.findMany(stryMutAct_9fa48("771") ? {} : (stryCov_9fa48("771"), {
          where: stryMutAct_9fa48("772") ? {} : (stryCov_9fa48("772"), {
            usuarioId
          }),
          include: stryMutAct_9fa48("773") ? {} : (stryCov_9fa48("773"), {
            quadra: stryMutAct_9fa48("774") ? false : (stryCov_9fa48("774"), true)
          })
        }));
      }
    }
    async function buscarReservasPorQuadra(quadraId) {
      if (stryMutAct_9fa48("775")) {
        {}
      } else {
        stryCov_9fa48("775");
        return prisma.reserva.findMany(stryMutAct_9fa48("776") ? {} : (stryCov_9fa48("776"), {
          where: stryMutAct_9fa48("777") ? {} : (stryCov_9fa48("777"), {
            quadraId
          }),
          include: stryMutAct_9fa48("778") ? {} : (stryCov_9fa48("778"), {
            usuario: stryMutAct_9fa48("779") ? false : (stryCov_9fa48("779"), true)
          })
        }));
      }
    }
    async function criarReserva(data) {
      if (stryMutAct_9fa48("780")) {
        {}
      } else {
        stryCov_9fa48("780");
        validarIdReserva(data.usuarioId, stryMutAct_9fa48("782") ? "" : (stryCov_9fa48("782"), 'usuarioId'));
        validarIdReserva(data.quadraId, stryMutAct_9fa48("784") ? "" : (stryCov_9fa48("784"), 'quadraId'));
        const date = normalizarDataReserva(data.date);
        if (stryMutAct_9fa48("785")) {
          ;
        } else {
          stryCov_9fa48("785");
          validarHorariosReserva(data.startTime, data.endTime);
        }
        if (stryMutAct_9fa48("786")) {
          ;
        } else {
          stryCov_9fa48("786");
          validarDataFuturaReserva(date, data.startTime, agora());
        }
        const dados = stryMutAct_9fa48("787") ? {} : (stryCov_9fa48("787"), {
          usuarioId: data.usuarioId,
          quadraId: data.quadraId,
          date,
          startTime: data.startTime,
          endTime: data.endTime,
          status: stryMutAct_9fa48("788") ? "" : (stryCov_9fa48("788"), 'ATIVA')
        });
        return prisma.$transaction(async banco => {
          if (stryMutAct_9fa48("789")) {
            {}
          } else {
            stryCov_9fa48("789");
            await validarUsuario(dados.usuarioId, banco);
            await validarQuadra(dados.quadraId, banco);
            await verificarConflito(dados, banco);
            return banco.reserva.create(stryMutAct_9fa48("790") ? {} : (stryCov_9fa48("790"), {
              data: dados,
              include: stryMutAct_9fa48("791") ? {} : (stryCov_9fa48("791"), {
                usuario: stryMutAct_9fa48("792") ? false : (stryCov_9fa48("792"), true),
                quadra: stryMutAct_9fa48("793") ? false : (stryCov_9fa48("793"), true)
              })
            }));
          }
        });
      }
    }
    async function atualizarReserva(id, data) {
      if (stryMutAct_9fa48("794")) {
        {}
      } else {
        stryCov_9fa48("794");
        validarIdReserva(id, stryMutAct_9fa48("796") ? "" : (stryCov_9fa48("796"), 'ID da reserva'));
        const camposPermitidos = stryMutAct_9fa48("797") ? [] : (stryCov_9fa48("797"), [stryMutAct_9fa48("798") ? "" : (stryCov_9fa48("798"), 'usuarioId'), stryMutAct_9fa48("799") ? "" : (stryCov_9fa48("799"), 'quadraId'), stryMutAct_9fa48("800") ? "" : (stryCov_9fa48("800"), 'date'), stryMutAct_9fa48("801") ? "" : (stryCov_9fa48("801"), 'startTime'), stryMutAct_9fa48("802") ? "" : (stryCov_9fa48("802"), 'endTime')]);
        if (stryMutAct_9fa48("805") ? Object.keys(data).every(campo => !camposPermitidos.includes(campo)) : stryMutAct_9fa48("804") ? false : stryMutAct_9fa48("803") ? true : (stryCov_9fa48("803", "804", "805"), Object.keys(data).some(stryMutAct_9fa48("806") ? () => undefined : (stryCov_9fa48("806"), campo => stryMutAct_9fa48("807") ? camposPermitidos.includes(campo) : (stryCov_9fa48("807"), !camposPermitidos.includes(campo)))))) {
          if (stryMutAct_9fa48("808")) {
            {}
          } else {
            stryCov_9fa48("808");
            throw new ReservaValidationError(stryMutAct_9fa48("810") ? "" : (stryCov_9fa48("810"), 'Somente usuário, quadra, data e horários podem ser atualizados. Use a operação de cancelamento para alterar o estado.'));
          }
        }
        const reservaAtual = await prisma.reserva.findUnique(stryMutAct_9fa48("811") ? {} : (stryCov_9fa48("811"), {
          where: stryMutAct_9fa48("812") ? {} : (stryCov_9fa48("812"), {
            id
          })
        }));
        if (stryMutAct_9fa48("815") ? false : stryMutAct_9fa48("814") ? true : stryMutAct_9fa48("813") ? reservaAtual : (stryCov_9fa48("813", "814", "815"), !reservaAtual)) {
          if (stryMutAct_9fa48("816")) {
            {}
          } else {
            stryCov_9fa48("816");
            if (stryMutAct_9fa48("817")) {
              ;
            } else {
              stryCov_9fa48("817");
              throw new ReservaNotFoundError();
            }
          }
        }
        if (stryMutAct_9fa48("820") ? reservaAtual.status === 'ATIVA' : stryMutAct_9fa48("819") ? false : stryMutAct_9fa48("818") ? true : (stryCov_9fa48("818", "819", "820"), reservaAtual.status !== (stryMutAct_9fa48("821") ? "" : (stryCov_9fa48("821"), 'ATIVA')))) {
          if (stryMutAct_9fa48("822")) {
            {}
          } else {
            stryCov_9fa48("822");
            throw new ReservaConflictError(stryMutAct_9fa48("824") ? "" : (stryCov_9fa48("824"), 'Somente reservas ATIVA podem ser atualizadas.'));
          }
        }
        if (stryMutAct_9fa48("827") ? false : stryMutAct_9fa48("826") ? true : stryMutAct_9fa48("825") ? inicioReservaNoFuturo(reservaAtual.date, reservaAtual.startTime, agora()) : (stryCov_9fa48("825", "826", "827"), !inicioReservaNoFuturo(reservaAtual.date, reservaAtual.startTime, agora()))) {
          if (stryMutAct_9fa48("828")) {
            {}
          } else {
            stryCov_9fa48("828");
            throw new ReservaConflictError(stryMutAct_9fa48("830") ? "" : (stryCov_9fa48("830"), 'Não é possível atualizar uma reserva já iniciada.'));
          }
        }
        const dadosAtualizados = stryMutAct_9fa48("831") ? {} : (stryCov_9fa48("831"), {
          ...reservaAtual,
          ...data
        });
        if (stryMutAct_9fa48("834") ? data.usuarioId === undefined : stryMutAct_9fa48("833") ? false : stryMutAct_9fa48("832") ? true : (stryCov_9fa48("832", "833", "834"), data.usuarioId !== undefined)) {
          if (stryMutAct_9fa48("835")) {
            {}
          } else {
            stryCov_9fa48("835");
            validarIdReserva(data.usuarioId, stryMutAct_9fa48("837") ? "" : (stryCov_9fa48("837"), 'usuarioId'));
            await validarUsuario(data.usuarioId);
          }
        }
        if (stryMutAct_9fa48("840") ? data.quadraId === undefined : stryMutAct_9fa48("839") ? false : stryMutAct_9fa48("838") ? true : (stryCov_9fa48("838", "839", "840"), data.quadraId !== undefined)) {
          if (stryMutAct_9fa48("841")) {
            {}
          } else {
            stryCov_9fa48("841");
            validarIdReserva(data.quadraId, stryMutAct_9fa48("843") ? "" : (stryCov_9fa48("843"), 'quadraId'));
            await validarQuadra(data.quadraId);
          }
        }
        dadosAtualizados.date = normalizarDataReserva(dadosAtualizados.date);
        if (stryMutAct_9fa48("844")) {
          ;
        } else {
          stryCov_9fa48("844");
          validarHorariosReserva(dadosAtualizados.startTime, dadosAtualizados.endTime);
        }
        if (stryMutAct_9fa48("845")) {
          ;
        } else {
          stryCov_9fa48("845");
          validarDataFuturaReserva(dadosAtualizados.date, dadosAtualizados.startTime, agora());
        }
        const conflito = await prisma.reserva.findFirst(stryMutAct_9fa48("846") ? {} : (stryCov_9fa48("846"), {
          where: stryMutAct_9fa48("847") ? {} : (stryCov_9fa48("847"), {
            id: stryMutAct_9fa48("848") ? {} : (stryCov_9fa48("848"), {
              not: id
            }),
            quadraId: dadosAtualizados.quadraId,
            date: dadosAtualizados.date,
            status: stryMutAct_9fa48("849") ? "" : (stryCov_9fa48("849"), 'ATIVA'),
            startTime: stryMutAct_9fa48("850") ? {} : (stryCov_9fa48("850"), {
              lt: dadosAtualizados.endTime
            }),
            endTime: stryMutAct_9fa48("851") ? {} : (stryCov_9fa48("851"), {
              gt: dadosAtualizados.startTime
            })
          })
        }));
        if (stryMutAct_9fa48("853") ? false : stryMutAct_9fa48("852") ? true : (stryCov_9fa48("852", "853"), conflito)) {
          if (stryMutAct_9fa48("854")) {
            {}
          } else {
            stryCov_9fa48("854");
            throw new Error(stryMutAct_9fa48("856") ? "" : (stryCov_9fa48("856"), 'Já existe uma reserva para essa quadra nesse horário.'));
          }
        }
        try {
          if (stryMutAct_9fa48("857")) {
            {}
          } else {
            stryCov_9fa48("857");
            return await prisma.reserva.update(stryMutAct_9fa48("858") ? {} : (stryCov_9fa48("858"), {
              where: stryMutAct_9fa48("859") ? {} : (stryCov_9fa48("859"), {
                id,
                status: stryMutAct_9fa48("860") ? "" : (stryCov_9fa48("860"), 'ATIVA')
              }),
              data: stryMutAct_9fa48("861") ? {} : (stryCov_9fa48("861"), {
                ...data,
                ...((stryMutAct_9fa48("864") ? data.date !== undefined : stryMutAct_9fa48("863") ? false : stryMutAct_9fa48("862") ? true : (stryCov_9fa48("862", "863", "864"), data.date === undefined)) ? {} : stryMutAct_9fa48("865") ? {} : (stryCov_9fa48("865"), {
                  date: dadosAtualizados.date
                }))
              }),
              include: stryMutAct_9fa48("866") ? {} : (stryCov_9fa48("866"), {
                usuario: stryMutAct_9fa48("867") ? false : (stryCov_9fa48("867"), true),
                quadra: stryMutAct_9fa48("868") ? false : (stryCov_9fa48("868"), true)
              })
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("869")) {
            {}
          } else {
            stryCov_9fa48("869");
            if (stryMutAct_9fa48("872") ? error.code !== 'P2025' : stryMutAct_9fa48("871") ? false : stryMutAct_9fa48("870") ? true : (stryCov_9fa48("870", "871", "872"), error.code === (stryMutAct_9fa48("873") ? "" : (stryCov_9fa48("873"), 'P2025')))) {
              if (stryMutAct_9fa48("874")) {
                {}
              } else {
                stryCov_9fa48("874");
                throw new ReservaConflictError(stryMutAct_9fa48("876") ? "" : (stryCov_9fa48("876"), 'A reserva foi alterada durante a atualização.'));
              }
            }
            throw error;
          }
        }
      }
    }
    async function cancelarReserva(id) {
      if (stryMutAct_9fa48("877")) {
        {}
      } else {
        stryCov_9fa48("877");
        validarIdReserva(id, stryMutAct_9fa48("879") ? "" : (stryCov_9fa48("879"), 'ID da reserva'));
        return prisma.$transaction(async banco => {
          if (stryMutAct_9fa48("880")) {
            {}
          } else {
            stryCov_9fa48("880");
            const reserva = await banco.reserva.findUnique(stryMutAct_9fa48("881") ? {} : (stryCov_9fa48("881"), {
              where: stryMutAct_9fa48("882") ? {} : (stryCov_9fa48("882"), {
                id
              }),
              include: stryMutAct_9fa48("883") ? {} : (stryCov_9fa48("883"), {
                usuario: stryMutAct_9fa48("884") ? false : (stryCov_9fa48("884"), true),
                quadra: stryMutAct_9fa48("885") ? false : (stryCov_9fa48("885"), true)
              })
            }));
            if (stryMutAct_9fa48("888") ? false : stryMutAct_9fa48("887") ? true : stryMutAct_9fa48("886") ? reserva : (stryCov_9fa48("886", "887", "888"), !reserva)) {
              if (stryMutAct_9fa48("889")) {
                {}
              } else {
                stryCov_9fa48("889");
                if (stryMutAct_9fa48("890")) {
                  ;
                } else {
                  stryCov_9fa48("890");
                  throw new ReservaNotFoundError();
                }
              }
            }
            if (stryMutAct_9fa48("893") ? reserva.status !== 'CANCELADA' : stryMutAct_9fa48("892") ? false : stryMutAct_9fa48("891") ? true : (stryCov_9fa48("891", "892", "893"), reserva.status === (stryMutAct_9fa48("894") ? "" : (stryCov_9fa48("894"), 'CANCELADA')))) {
              if (stryMutAct_9fa48("895")) {
                {}
              } else {
                stryCov_9fa48("895");
                return reserva;
              }
            }
            if (stryMutAct_9fa48("898") ? reserva.status === 'ATIVA' : stryMutAct_9fa48("897") ? false : stryMutAct_9fa48("896") ? true : (stryCov_9fa48("896", "897", "898"), reserva.status !== (stryMutAct_9fa48("899") ? "" : (stryCov_9fa48("899"), 'ATIVA')))) {
              if (stryMutAct_9fa48("900")) {
                {}
              } else {
                stryCov_9fa48("900");
                throw new ReservaConflictError(stryMutAct_9fa48("902") ? "" : (stryCov_9fa48("902"), 'Somente reservas ATIVA podem ser canceladas.'));
              }
            }
            if (stryMutAct_9fa48("905") ? false : stryMutAct_9fa48("904") ? true : stryMutAct_9fa48("903") ? inicioReservaNoFuturo(reserva.date, reserva.startTime, agora()) : (stryCov_9fa48("903", "904", "905"), !inicioReservaNoFuturo(reserva.date, reserva.startTime, agora()))) {
              if (stryMutAct_9fa48("906")) {
                {}
              } else {
                stryCov_9fa48("906");
                throw new ReservaConflictError(stryMutAct_9fa48("908") ? "" : (stryCov_9fa48("908"), 'Não é possível cancelar uma reserva já iniciada.'));
              }
            }
            try {
              if (stryMutAct_9fa48("909")) {
                {}
              } else {
                stryCov_9fa48("909");
                return await banco.reserva.update(stryMutAct_9fa48("910") ? {} : (stryCov_9fa48("910"), {
                  where: stryMutAct_9fa48("911") ? {} : (stryCov_9fa48("911"), {
                    id,
                    status: stryMutAct_9fa48("912") ? "" : (stryCov_9fa48("912"), 'ATIVA'),
                    date: reserva.date,
                    startTime: reserva.startTime
                  }),
                  data: stryMutAct_9fa48("913") ? {} : (stryCov_9fa48("913"), {
                    status: stryMutAct_9fa48("914") ? "" : (stryCov_9fa48("914"), 'CANCELADA')
                  }),
                  include: stryMutAct_9fa48("915") ? {} : (stryCov_9fa48("915"), {
                    usuario: stryMutAct_9fa48("916") ? false : (stryCov_9fa48("916"), true),
                    quadra: stryMutAct_9fa48("917") ? false : (stryCov_9fa48("917"), true)
                  })
                }));
              }
            } catch (error) {
              if (stryMutAct_9fa48("918")) {
                {}
              } else {
                stryCov_9fa48("918");
                if (stryMutAct_9fa48("921") ? error.code !== 'P2025' : stryMutAct_9fa48("920") ? false : stryMutAct_9fa48("919") ? true : (stryCov_9fa48("919", "920", "921"), error.code === (stryMutAct_9fa48("922") ? "" : (stryCov_9fa48("922"), 'P2025')))) {
                  if (stryMutAct_9fa48("923")) {
                    {}
                  } else {
                    stryCov_9fa48("923");
                    throw new ReservaConflictError(stryMutAct_9fa48("925") ? "" : (stryCov_9fa48("925"), 'A reserva foi alterada durante o cancelamento.'));
                  }
                }
                throw error;
              }
            }
          }
        });
      }
    }
    return stryMutAct_9fa48("926") ? {} : (stryCov_9fa48("926"), {
      listarReservas,
      buscarReservaPorId,
      buscarReservasPorUsuario,
      buscarReservasPorQuadra,
      criarReserva,
      atualizarReserva,
      cancelarReserva,
      deletarReserva: cancelarReserva
    });
  }
}
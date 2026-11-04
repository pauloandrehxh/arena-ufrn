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
import { HORARIO_FUNCIONAMENTO } from '../lib/disponibilidade.config.js';
export function createDisponibilidadeService(prisma) {
  if (stryMutAct_9fa48("561")) {
    {}
  } else {
    stryCov_9fa48("561");
    function validarData(data) {
      if (stryMutAct_9fa48("562")) {
        {}
      } else {
        stryCov_9fa48("562");
        if (stryMutAct_9fa48("565") ? typeof data !== 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(data) : stryMutAct_9fa48("564") ? false : stryMutAct_9fa48("563") ? true : (stryCov_9fa48("563", "564", "565"), (stryMutAct_9fa48("567") ? typeof data === 'string' : stryMutAct_9fa48("566") ? false : (stryCov_9fa48("566", "567"), typeof data !== (stryMutAct_9fa48("568") ? "" : (stryCov_9fa48("568"), 'string')))) || (stryMutAct_9fa48("569") ? /^\d{4}-\d{2}-\d{2}$/.test(data) : (stryCov_9fa48("569"), !(stryMutAct_9fa48("577") ? /^\d{4}-\d{2}-\D{2}$/ : stryMutAct_9fa48("576") ? /^\d{4}-\d{2}-\d$/ : stryMutAct_9fa48("575") ? /^\d{4}-\D{2}-\d{2}$/ : stryMutAct_9fa48("574") ? /^\d{4}-\d-\d{2}$/ : stryMutAct_9fa48("573") ? /^\D{4}-\d{2}-\d{2}$/ : stryMutAct_9fa48("572") ? /^\d-\d{2}-\d{2}$/ : stryMutAct_9fa48("571") ? /^\d{4}-\d{2}-\d{2}/ : stryMutAct_9fa48("570") ? /\d{4}-\d{2}-\d{2}$/ : (stryCov_9fa48("570", "571", "572", "573", "574", "575", "576", "577"), /^\d{4}-\d{2}-\d{2}$/)).test(data))))) {
          if (stryMutAct_9fa48("578")) {
            {}
          } else {
            stryCov_9fa48("578");
            throw new Error(stryMutAct_9fa48("580") ? "" : (stryCov_9fa48("580"), 'Data inválida. Use o formato AAAA-MM-DD.'));
          }
        }
        const dataObj = new Date(stryMutAct_9fa48("581") ? `` : (stryCov_9fa48("581"), `${data}T00:00:00.000Z`));
        if (stryMutAct_9fa48("584") ? Number.isNaN(dataObj.getTime()) && dataObj.toISOString().slice(0, 10) !== data : stryMutAct_9fa48("583") ? false : stryMutAct_9fa48("582") ? true : (stryCov_9fa48("582", "583", "584"), Number.isNaN(dataObj.getTime()) || (stryMutAct_9fa48("586") ? dataObj.toISOString().slice(0, 10) === data : stryMutAct_9fa48("585") ? false : (stryCov_9fa48("585", "586"), (stryMutAct_9fa48("587") ? dataObj.toISOString() : (stryCov_9fa48("587"), dataObj.toISOString().slice(0, 10))) !== data)))) {
          if (stryMutAct_9fa48("588")) {
            {}
          } else {
            stryCov_9fa48("588");
            throw new Error(stryMutAct_9fa48("590") ? "" : (stryCov_9fa48("590"), 'Data inválida. Informe uma data existente.'));
          }
        }
        return dataObj;
      }
    }
    function gerarIntervalos() {
      if (stryMutAct_9fa48("591")) {
        {}
      } else {
        stryCov_9fa48("591");
        const {
          inicio,
          fim,
          duracaoMinutos
        } = HORARIO_FUNCIONAMENTO;
        const [ih, im] = inicio.split(stryMutAct_9fa48("592") ? "" : (stryCov_9fa48("592"), ':')).map(Number);
        const [fh, fm] = fim.split(stryMutAct_9fa48("593") ? "" : (stryCov_9fa48("593"), ':')).map(Number);
        const inicioMinutos = stryMutAct_9fa48("594") ? ih * 60 - im : (stryCov_9fa48("594"), (stryMutAct_9fa48("595") ? ih / 60 : (stryCov_9fa48("595"), ih * 60)) + im);
        const fimMinutos = stryMutAct_9fa48("596") ? fh * 60 - fm : (stryCov_9fa48("596"), (stryMutAct_9fa48("597") ? fh / 60 : (stryCov_9fa48("597"), fh * 60)) + fm);
        if (stryMutAct_9fa48("600") ? (!Number.isInteger(duracaoMinutos) || duracaoMinutos <= 0) && inicioMinutos >= fimMinutos : stryMutAct_9fa48("599") ? false : stryMutAct_9fa48("598") ? true : (stryCov_9fa48("598", "599", "600"), (stryMutAct_9fa48("602") ? !Number.isInteger(duracaoMinutos) && duracaoMinutos <= 0 : stryMutAct_9fa48("601") ? false : (stryCov_9fa48("601", "602"), (stryMutAct_9fa48("603") ? Number.isInteger(duracaoMinutos) : (stryCov_9fa48("603"), !Number.isInteger(duracaoMinutos))) || (stryMutAct_9fa48("606") ? duracaoMinutos > 0 : stryMutAct_9fa48("605") ? duracaoMinutos < 0 : stryMutAct_9fa48("604") ? false : (stryCov_9fa48("604", "605", "606"), duracaoMinutos <= 0)))) || (stryMutAct_9fa48("609") ? inicioMinutos < fimMinutos : stryMutAct_9fa48("608") ? inicioMinutos > fimMinutos : stryMutAct_9fa48("607") ? false : (stryCov_9fa48("607", "608", "609"), inicioMinutos >= fimMinutos)))) {
          if (stryMutAct_9fa48("610")) {
            {}
          } else {
            stryCov_9fa48("610");
            throw new Error(stryMutAct_9fa48("612") ? "" : (stryCov_9fa48("612"), 'Configuração de funcionamento inválida.'));
          }
        }
        const intervalos = stryMutAct_9fa48("613") ? ["Stryker was here"] : (stryCov_9fa48("613"), []);
        const formatar = stryMutAct_9fa48("614") ? () => undefined : (stryCov_9fa48("614"), (() => {
          const formatar = valor => stryMutAct_9fa48("615") ? `` : (stryCov_9fa48("615"), `${String(Math.floor(stryMutAct_9fa48("616") ? valor * 60 : (stryCov_9fa48("616"), valor / 60))).padStart(2, stryMutAct_9fa48("617") ? "" : (stryCov_9fa48("617"), '0'))}:${String(stryMutAct_9fa48("618") ? valor * 60 : (stryCov_9fa48("618"), valor % 60)).padStart(2, stryMutAct_9fa48("619") ? "" : (stryCov_9fa48("619"), '0'))}`);
          return formatar;
        })());
        for (let minuto = inicioMinutos; stryMutAct_9fa48("622") ? minuto + duracaoMinutos > fimMinutos : stryMutAct_9fa48("621") ? minuto + duracaoMinutos < fimMinutos : stryMutAct_9fa48("620") ? false : (stryCov_9fa48("620", "621", "622"), (stryMutAct_9fa48("623") ? minuto - duracaoMinutos : (stryCov_9fa48("623"), minuto + duracaoMinutos)) <= fimMinutos); stryMutAct_9fa48("624") ? minuto -= duracaoMinutos : (stryCov_9fa48("624"), minuto += duracaoMinutos)) {
          if (stryMutAct_9fa48("625")) {
            {}
          } else {
            stryCov_9fa48("625");
            intervalos.push(stryMutAct_9fa48("627") ? {} : (stryCov_9fa48("627"), {
              startTime: formatar(minuto),
              endTime: formatar(stryMutAct_9fa48("628") ? minuto - duracaoMinutos : (stryCov_9fa48("628"), minuto + duracaoMinutos))
            }));
          }
        }
        return intervalos;
      }
    }
    async function consultar({
      quadraId,
      date
    }) {
      if (stryMutAct_9fa48("629")) {
        {}
      } else {
        stryCov_9fa48("629");
        if (stryMutAct_9fa48("632") ? (quadraId === undefined || quadraId === null) && String(quadraId).trim() === '' : stryMutAct_9fa48("631") ? false : stryMutAct_9fa48("630") ? true : (stryCov_9fa48("630", "631", "632"), (stryMutAct_9fa48("634") ? quadraId === undefined && quadraId === null : stryMutAct_9fa48("633") ? false : (stryCov_9fa48("633", "634"), (stryMutAct_9fa48("636") ? quadraId !== undefined : stryMutAct_9fa48("635") ? false : (stryCov_9fa48("635", "636"), quadraId === undefined)) || (stryMutAct_9fa48("638") ? quadraId !== null : stryMutAct_9fa48("637") ? false : (stryCov_9fa48("637", "638"), quadraId === null)))) || (stryMutAct_9fa48("640") ? String(quadraId).trim() !== '' : stryMutAct_9fa48("639") ? false : (stryCov_9fa48("639", "640"), (stryMutAct_9fa48("641") ? String(quadraId) : (stryCov_9fa48("641"), String(quadraId).trim())) === (stryMutAct_9fa48("642") ? "Stryker was here!" : (stryCov_9fa48("642"), '')))))) {
          if (stryMutAct_9fa48("643")) {
            {}
          } else {
            stryCov_9fa48("643");
            throw new Error(stryMutAct_9fa48("645") ? "" : (stryCov_9fa48("645"), 'ID da quadra é obrigatório.'));
          }
        }
        const id = Number(quadraId);
        if (stryMutAct_9fa48("648") ? !Number.isInteger(id) && id <= 0 : stryMutAct_9fa48("647") ? false : stryMutAct_9fa48("646") ? true : (stryCov_9fa48("646", "647", "648"), (stryMutAct_9fa48("649") ? Number.isInteger(id) : (stryCov_9fa48("649"), !Number.isInteger(id))) || (stryMutAct_9fa48("652") ? id > 0 : stryMutAct_9fa48("651") ? id < 0 : stryMutAct_9fa48("650") ? false : (stryCov_9fa48("650", "651", "652"), id <= 0)))) {
          if (stryMutAct_9fa48("653")) {
            {}
          } else {
            stryCov_9fa48("653");
            throw new Error(stryMutAct_9fa48("655") ? "" : (stryCov_9fa48("655"), 'ID da quadra inválido.'));
          }
        }
        const dataObj = validarData(date);
        const quadra = await prisma.quadra.findUnique(stryMutAct_9fa48("656") ? {} : (stryCov_9fa48("656"), {
          where: stryMutAct_9fa48("657") ? {} : (stryCov_9fa48("657"), {
            id
          })
        }));
        if (stryMutAct_9fa48("660") ? false : stryMutAct_9fa48("659") ? true : stryMutAct_9fa48("658") ? quadra : (stryCov_9fa48("658", "659", "660"), !quadra)) {
          if (stryMutAct_9fa48("661")) {
            {}
          } else {
            stryCov_9fa48("661");
            const erro = new Error(stryMutAct_9fa48("662") ? "" : (stryCov_9fa48("662"), 'Quadra não encontrada.'));
            erro.status = 404;
            throw erro;
          }
        }
        if (stryMutAct_9fa48("665") ? false : stryMutAct_9fa48("664") ? true : stryMutAct_9fa48("663") ? quadra.active : (stryCov_9fa48("663", "664", "665"), !quadra.active)) {
          if (stryMutAct_9fa48("666")) {
            {}
          } else {
            stryCov_9fa48("666");
            const erro = new Error(stryMutAct_9fa48("667") ? "" : (stryCov_9fa48("667"), 'Quadra indisponível.'));
            erro.status = 409;
            throw erro;
          }
        }
        const reservas = await prisma.reserva.findMany(stryMutAct_9fa48("668") ? {} : (stryCov_9fa48("668"), {
          where: stryMutAct_9fa48("669") ? {} : (stryCov_9fa48("669"), {
            quadraId: id,
            date: dataObj,
            status: stryMutAct_9fa48("670") ? "" : (stryCov_9fa48("670"), 'ATIVA')
          }),
          select: stryMutAct_9fa48("671") ? {} : (stryCov_9fa48("671"), {
            startTime: stryMutAct_9fa48("672") ? false : (stryCov_9fa48("672"), true),
            endTime: stryMutAct_9fa48("673") ? false : (stryCov_9fa48("673"), true),
            status: stryMutAct_9fa48("674") ? false : (stryCov_9fa48("674"), true)
          }),
          orderBy: stryMutAct_9fa48("675") ? {} : (stryCov_9fa48("675"), {
            startTime: stryMutAct_9fa48("676") ? "" : (stryCov_9fa48("676"), 'asc')
          })
        }));
        const ocupacoes = reservas.map(stryMutAct_9fa48("677") ? () => undefined : (stryCov_9fa48("677"), reserva => stryMutAct_9fa48("678") ? {} : (stryCov_9fa48("678"), {
          startTime: reserva.startTime,
          endTime: reserva.endTime,
          status: reserva.status
        })));
        const disponiveis = stryMutAct_9fa48("679") ? gerarIntervalos() : (stryCov_9fa48("679"), gerarIntervalos().filter(stryMutAct_9fa48("680") ? () => undefined : (stryCov_9fa48("680"), intervalo => stryMutAct_9fa48("681") ? reservas.some(reserva => reserva.startTime < intervalo.endTime && intervalo.startTime < reserva.endTime) : (stryCov_9fa48("681"), !(stryMutAct_9fa48("682") ? reservas.every(reserva => reserva.startTime < intervalo.endTime && intervalo.startTime < reserva.endTime) : (stryCov_9fa48("682"), reservas.some(stryMutAct_9fa48("683") ? () => undefined : (stryCov_9fa48("683"), reserva => stryMutAct_9fa48("686") ? reserva.startTime < intervalo.endTime || intervalo.startTime < reserva.endTime : stryMutAct_9fa48("685") ? false : stryMutAct_9fa48("684") ? true : (stryCov_9fa48("684", "685", "686"), (stryMutAct_9fa48("689") ? reserva.startTime >= intervalo.endTime : stryMutAct_9fa48("688") ? reserva.startTime <= intervalo.endTime : stryMutAct_9fa48("687") ? true : (stryCov_9fa48("687", "688", "689"), reserva.startTime < intervalo.endTime)) && (stryMutAct_9fa48("692") ? intervalo.startTime >= reserva.endTime : stryMutAct_9fa48("691") ? intervalo.startTime <= reserva.endTime : stryMutAct_9fa48("690") ? true : (stryCov_9fa48("690", "691", "692"), intervalo.startTime < reserva.endTime)))))))))));
        return stryMutAct_9fa48("693") ? {} : (stryCov_9fa48("693"), {
          quadraId: id,
          date,
          horarioFuncionamento: HORARIO_FUNCIONAMENTO,
          ocupacoes,
          disponiveis
        });
      }
    }
    return stryMutAct_9fa48("694") ? {} : (stryCov_9fa48("694"), {
      consultar
    });
  }
}
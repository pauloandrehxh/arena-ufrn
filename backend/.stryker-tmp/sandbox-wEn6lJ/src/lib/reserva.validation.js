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
export class ReservaValidationError extends Error {
  constructor(message) {
    if (stryMutAct_9fa48("378")) {
      {}
    } else {
      stryCov_9fa48("378");
      super(message);
      this.name = stryMutAct_9fa48("379") ? "" : (stryCov_9fa48("379"), 'ReservaValidationError');
    }
  }
}
export class ReservaNotFoundError extends Error {
  constructor() {
    if (stryMutAct_9fa48("380")) {
      {}
    } else {
      stryCov_9fa48("380");
      super(stryMutAct_9fa48("381") ? "" : (stryCov_9fa48("381"), 'Reserva não encontrada.'));
      this.name = stryMutAct_9fa48("382") ? "" : (stryCov_9fa48("382"), 'ReservaNotFoundError');
    }
  }
}
export class ReservaConflictError extends Error {
  constructor(message) {
    if (stryMutAct_9fa48("383")) {
      {}
    } else {
      stryCov_9fa48("383");
      super(message);
      this.name = stryMutAct_9fa48("384") ? "" : (stryCov_9fa48("384"), 'ReservaConflictError');
    }
  }
}
export function validarIdReserva(value, campo) {
  if (stryMutAct_9fa48("385")) {
    {}
  } else {
    stryCov_9fa48("385");
    if (stryMutAct_9fa48("388") ? (!Number.isInteger(value) || value <= 0) && value > 2147483647 : stryMutAct_9fa48("387") ? false : stryMutAct_9fa48("386") ? true : (stryCov_9fa48("386", "387", "388"), (stryMutAct_9fa48("390") ? !Number.isInteger(value) && value <= 0 : stryMutAct_9fa48("389") ? false : (stryCov_9fa48("389", "390"), (stryMutAct_9fa48("391") ? Number.isInteger(value) : (stryCov_9fa48("391"), !Number.isInteger(value))) || (stryMutAct_9fa48("394") ? value > 0 : stryMutAct_9fa48("393") ? value < 0 : stryMutAct_9fa48("392") ? false : (stryCov_9fa48("392", "393", "394"), value <= 0)))) || (stryMutAct_9fa48("397") ? value <= 2147483647 : stryMutAct_9fa48("396") ? value >= 2147483647 : stryMutAct_9fa48("395") ? false : (stryCov_9fa48("395", "396", "397"), value > 2147483647)))) {
      if (stryMutAct_9fa48("398")) {
        {}
      } else {
        stryCov_9fa48("398");
        throw new ReservaValidationError(stryMutAct_9fa48("400") ? `` : (stryCov_9fa48("400"), `${campo} deve ser um inteiro positivo válido.`));
      }
    }
  }
}
export function normalizarDataReserva(value) {
  if (stryMutAct_9fa48("401")) {
    {}
  } else {
    stryCov_9fa48("401");
    const dia = (stryMutAct_9fa48("404") ? value instanceof Date || Number.isFinite(value.getTime()) : stryMutAct_9fa48("403") ? false : stryMutAct_9fa48("402") ? true : (stryCov_9fa48("402", "403", "404"), value instanceof Date && Number.isFinite(value.getTime()))) ? stryMutAct_9fa48("405") ? value.toISOString() : (stryCov_9fa48("405"), value.toISOString().slice(0, 10)) : value;
    if (stryMutAct_9fa48("408") ? typeof dia !== 'string' && !/^\d{4}-\d{2}-\d{2}$/.test(dia) : stryMutAct_9fa48("407") ? false : stryMutAct_9fa48("406") ? true : (stryCov_9fa48("406", "407", "408"), (stryMutAct_9fa48("410") ? typeof dia === 'string' : stryMutAct_9fa48("409") ? false : (stryCov_9fa48("409", "410"), typeof dia !== (stryMutAct_9fa48("411") ? "" : (stryCov_9fa48("411"), 'string')))) || (stryMutAct_9fa48("412") ? /^\d{4}-\d{2}-\d{2}$/.test(dia) : (stryCov_9fa48("412"), !(stryMutAct_9fa48("420") ? /^\d{4}-\d{2}-\D{2}$/ : stryMutAct_9fa48("419") ? /^\d{4}-\d{2}-\d$/ : stryMutAct_9fa48("418") ? /^\d{4}-\D{2}-\d{2}$/ : stryMutAct_9fa48("417") ? /^\d{4}-\d-\d{2}$/ : stryMutAct_9fa48("416") ? /^\D{4}-\d{2}-\d{2}$/ : stryMutAct_9fa48("415") ? /^\d-\d{2}-\d{2}$/ : stryMutAct_9fa48("414") ? /^\d{4}-\d{2}-\d{2}/ : stryMutAct_9fa48("413") ? /\d{4}-\d{2}-\d{2}$/ : (stryCov_9fa48("413", "414", "415", "416", "417", "418", "419", "420"), /^\d{4}-\d{2}-\d{2}$/)).test(dia))))) {
      if (stryMutAct_9fa48("421")) {
        {}
      } else {
        stryCov_9fa48("421");
        throw new ReservaValidationError(stryMutAct_9fa48("423") ? "" : (stryCov_9fa48("423"), 'Data deve ser válida no formato YYYY-MM-DD.'));
      }
    }
    const data = new Date(stryMutAct_9fa48("424") ? `` : (stryCov_9fa48("424"), `${dia}T00:00:00.000Z`));
    if (stryMutAct_9fa48("427") ? !Number.isFinite(data.getTime()) && data.toISOString().slice(0, 10) !== dia : stryMutAct_9fa48("426") ? false : stryMutAct_9fa48("425") ? true : (stryCov_9fa48("425", "426", "427"), (stryMutAct_9fa48("428") ? Number.isFinite(data.getTime()) : (stryCov_9fa48("428"), !Number.isFinite(data.getTime()))) || (stryMutAct_9fa48("430") ? data.toISOString().slice(0, 10) === dia : stryMutAct_9fa48("429") ? false : (stryCov_9fa48("429", "430"), (stryMutAct_9fa48("431") ? data.toISOString() : (stryCov_9fa48("431"), data.toISOString().slice(0, 10))) !== dia)))) {
      if (stryMutAct_9fa48("432")) {
        {}
      } else {
        stryCov_9fa48("432");
        throw new ReservaValidationError(stryMutAct_9fa48("434") ? "" : (stryCov_9fa48("434"), 'Data deve ser válida no formato YYYY-MM-DD.'));
      }
    }
    return data;
  }
}
export function validarHorariosReserva(startTime, endTime) {
  if (stryMutAct_9fa48("435")) {
    {}
  } else {
    stryCov_9fa48("435");
    if (stryMutAct_9fa48("438") ? !startTime && !endTime : stryMutAct_9fa48("437") ? false : stryMutAct_9fa48("436") ? true : (stryCov_9fa48("436", "437", "438"), (stryMutAct_9fa48("439") ? startTime : (stryCov_9fa48("439"), !startTime)) || (stryMutAct_9fa48("440") ? endTime : (stryCov_9fa48("440"), !endTime)))) {
      if (stryMutAct_9fa48("441")) {
        {}
      } else {
        stryCov_9fa48("441");
        throw new ReservaValidationError(stryMutAct_9fa48("443") ? "" : (stryCov_9fa48("443"), 'Horário inicial e final são obrigatórios.'));
      }
    }
    const formato = stryMutAct_9fa48("450") ? /^(?:[01]\d|2[0-3]):[0-5]\D$/ : stryMutAct_9fa48("449") ? /^(?:[01]\d|2[0-3]):[^0-5]\d$/ : stryMutAct_9fa48("448") ? /^(?:[01]\d|2[^0-3]):[0-5]\d$/ : stryMutAct_9fa48("447") ? /^(?:[01]\D|2[0-3]):[0-5]\d$/ : stryMutAct_9fa48("446") ? /^(?:[^01]\d|2[0-3]):[0-5]\d$/ : stryMutAct_9fa48("445") ? /^(?:[01]\d|2[0-3]):[0-5]\d/ : stryMutAct_9fa48("444") ? /(?:[01]\d|2[0-3]):[0-5]\d$/ : (stryCov_9fa48("444", "445", "446", "447", "448", "449", "450"), /^(?:[01]\d|2[0-3]):[0-5]\d$/);
    if (stryMutAct_9fa48("453") ? (typeof startTime !== 'string' || typeof endTime !== 'string' || !formato.test(startTime)) && !formato.test(endTime) : stryMutAct_9fa48("452") ? false : stryMutAct_9fa48("451") ? true : (stryCov_9fa48("451", "452", "453"), (stryMutAct_9fa48("455") ? (typeof startTime !== 'string' || typeof endTime !== 'string') && !formato.test(startTime) : stryMutAct_9fa48("454") ? false : (stryCov_9fa48("454", "455"), (stryMutAct_9fa48("457") ? typeof startTime !== 'string' && typeof endTime !== 'string' : stryMutAct_9fa48("456") ? false : (stryCov_9fa48("456", "457"), (stryMutAct_9fa48("459") ? typeof startTime === 'string' : stryMutAct_9fa48("458") ? false : (stryCov_9fa48("458", "459"), typeof startTime !== (stryMutAct_9fa48("460") ? "" : (stryCov_9fa48("460"), 'string')))) || (stryMutAct_9fa48("462") ? typeof endTime === 'string' : stryMutAct_9fa48("461") ? false : (stryCov_9fa48("461", "462"), typeof endTime !== (stryMutAct_9fa48("463") ? "" : (stryCov_9fa48("463"), 'string')))))) || (stryMutAct_9fa48("464") ? formato.test(startTime) : (stryCov_9fa48("464"), !formato.test(startTime))))) || (stryMutAct_9fa48("465") ? formato.test(endTime) : (stryCov_9fa48("465"), !formato.test(endTime))))) {
      if (stryMutAct_9fa48("466")) {
        {}
      } else {
        stryCov_9fa48("466");
        throw new ReservaValidationError(stryMutAct_9fa48("468") ? "" : (stryCov_9fa48("468"), 'Horários devem ser válidos no formato HH:mm.'));
      }
    }
    if (stryMutAct_9fa48("472") ? startTime < endTime : stryMutAct_9fa48("471") ? startTime > endTime : stryMutAct_9fa48("470") ? false : stryMutAct_9fa48("469") ? true : (stryCov_9fa48("469", "470", "471", "472"), startTime >= endTime)) {
      if (stryMutAct_9fa48("473")) {
        {}
      } else {
        stryCov_9fa48("473");
        throw new ReservaValidationError(stryMutAct_9fa48("475") ? "" : (stryCov_9fa48("475"), 'O horário inicial deve ser anterior ao horário final.'));
      }
    }
  }
}
const relogioFortaleza = new Intl.DateTimeFormat(stryMutAct_9fa48("476") ? "" : (stryCov_9fa48("476"), 'en-GB'), stryMutAct_9fa48("477") ? {} : (stryCov_9fa48("477"), {
  timeZone: stryMutAct_9fa48("478") ? "" : (stryCov_9fa48("478"), 'America/Fortaleza'),
  year: stryMutAct_9fa48("479") ? "" : (stryCov_9fa48("479"), 'numeric'),
  month: stryMutAct_9fa48("480") ? "" : (stryCov_9fa48("480"), '2-digit'),
  day: stryMutAct_9fa48("481") ? "" : (stryCov_9fa48("481"), '2-digit'),
  hour: stryMutAct_9fa48("482") ? "" : (stryCov_9fa48("482"), '2-digit'),
  minute: stryMutAct_9fa48("483") ? "" : (stryCov_9fa48("483"), '2-digit'),
  hourCycle: stryMutAct_9fa48("484") ? "" : (stryCov_9fa48("484"), 'h23')
}));
function obterDataHoraFortaleza(agora) {
  if (stryMutAct_9fa48("485")) {
    {}
  } else {
    stryCov_9fa48("485");
    const partes = Object.fromEntries(relogioFortaleza.formatToParts(agora).map(stryMutAct_9fa48("486") ? () => undefined : (stryCov_9fa48("486"), ({
      type,
      value
    }) => stryMutAct_9fa48("487") ? [] : (stryCov_9fa48("487"), [type, value]))));
    return stryMutAct_9fa48("488") ? {} : (stryCov_9fa48("488"), {
      date: stryMutAct_9fa48("489") ? `` : (stryCov_9fa48("489"), `${partes.year}-${partes.month}-${partes.day}`),
      time: stryMutAct_9fa48("490") ? `` : (stryCov_9fa48("490"), `${partes.hour}:${partes.minute}`)
    });
  }
}
export function inicioReservaNoFuturo(date, startTime, agora = new Date()) {
  if (stryMutAct_9fa48("491")) {
    {}
  } else {
    stryCov_9fa48("491");
    const atual = obterDataHoraFortaleza(agora);
    return stryMutAct_9fa48("495") ? `${date.toISOString().slice(0, 10)}T${startTime}` <= `${atual.date}T${atual.time}` : stryMutAct_9fa48("494") ? `${date.toISOString().slice(0, 10)}T${startTime}` >= `${atual.date}T${atual.time}` : stryMutAct_9fa48("493") ? false : stryMutAct_9fa48("492") ? true : (stryCov_9fa48("492", "493", "494", "495"), (stryMutAct_9fa48("496") ? `` : (stryCov_9fa48("496"), `${stryMutAct_9fa48("497") ? date.toISOString() : (stryCov_9fa48("497"), date.toISOString().slice(0, 10))}T${startTime}`)) > (stryMutAct_9fa48("498") ? `` : (stryCov_9fa48("498"), `${atual.date}T${atual.time}`)));
  }
}
export function validarDataFuturaReserva(date, startTime, agora = new Date()) {
  if (stryMutAct_9fa48("499")) {
    {}
  } else {
    stryCov_9fa48("499");
    const atual = obterDataHoraFortaleza(agora);
    const dia = stryMutAct_9fa48("500") ? date.toISOString() : (stryCov_9fa48("500"), date.toISOString().slice(0, 10));
    if (stryMutAct_9fa48("504") ? dia >= atual.date : stryMutAct_9fa48("503") ? dia <= atual.date : stryMutAct_9fa48("502") ? false : stryMutAct_9fa48("501") ? true : (stryCov_9fa48("501", "502", "503", "504"), dia < atual.date)) {
      if (stryMutAct_9fa48("505")) {
        {}
      } else {
        stryCov_9fa48("505");
        throw new ReservaValidationError(stryMutAct_9fa48("507") ? "" : (stryCov_9fa48("507"), 'Não é possível criar uma reserva no passado.'));
      }
    }
    if (stryMutAct_9fa48("510") ? dia === atual.date || startTime <= atual.time : stryMutAct_9fa48("509") ? false : stryMutAct_9fa48("508") ? true : (stryCov_9fa48("508", "509", "510"), (stryMutAct_9fa48("512") ? dia !== atual.date : stryMutAct_9fa48("511") ? true : (stryCov_9fa48("511", "512"), dia === atual.date)) && (stryMutAct_9fa48("515") ? startTime > atual.time : stryMutAct_9fa48("514") ? startTime < atual.time : stryMutAct_9fa48("513") ? true : (stryCov_9fa48("513", "514", "515"), startTime <= atual.time)))) {
      if (stryMutAct_9fa48("516")) {
        {}
      } else {
        stryCov_9fa48("516");
        throw new ReservaValidationError(stryMutAct_9fa48("518") ? "" : (stryCov_9fa48("518"), 'O horário inicial deve estar no futuro.'));
      }
    }
  }
}
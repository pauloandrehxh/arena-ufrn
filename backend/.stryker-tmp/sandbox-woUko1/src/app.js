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
import express from 'express';
import cors from 'cors';
import { createQuadraService } from './services/quadra.service.js';
import { createQuadraController } from './controllers/quadra.controller.js';
import { createQuadraRoutes } from './routes/quadra.routes.js';
import { createUsuarioService } from './services/usuario.service.js';
import { createUsuarioController } from './controllers/usuario.controller.js';
import { createUsuarioRoutes } from './routes/usuario.routes.js';
import { createReservaService } from './services/reserva.service.js';
import { createReservaController } from './controllers/reserva.controller.js';
import { createReservaRoutes } from './routes/reserva.routes.js';
import { createDisponibilidadeService } from './services/disponibilidade.service.js';
import { createDisponibilidadeController } from './controllers/disponibilidade.controller.js';
import { createDisponibilidadeRoutes } from './routes/disponibilidade.routes.js';
export function createApp(prisma, {
  agora
} = {}) {
  if (stryMutAct_9fa48("0")) {
    {}
  } else {
    stryCov_9fa48("0");
    const app = express();
    const allowedOrigins = stryMutAct_9fa48("1") ? [] : (stryCov_9fa48("1"), [stryMutAct_9fa48("2") ? "" : (stryCov_9fa48("2"), 'http://localhost:5173')]);
    app.use(cors(stryMutAct_9fa48("4") ? {} : (stryCov_9fa48("4"), {
      origin: allowedOrigins
    })));
    if (stryMutAct_9fa48("5")) {
      ;
    } else {
      stryCov_9fa48("5");
      app.use(express.json());
    }
    app.get(stryMutAct_9fa48("7") ? "" : (stryCov_9fa48("7"), '/'), (req, res) => {
      if (stryMutAct_9fa48("8")) {
        {}
      } else {
        stryCov_9fa48("8");
        res.json(stryMutAct_9fa48("10") ? {} : (stryCov_9fa48("10"), {
          message: stryMutAct_9fa48("11") ? "" : (stryCov_9fa48("11"), 'Arena UFRN API funcionando!')
        }));
      }
    });
    app.get(stryMutAct_9fa48("13") ? "" : (stryCov_9fa48("13"), '/api/test'), (req, res) => {
      if (stryMutAct_9fa48("14")) {
        {}
      } else {
        stryCov_9fa48("14");
        res.json(stryMutAct_9fa48("16") ? {} : (stryCov_9fa48("16"), {
          message: stryMutAct_9fa48("17") ? "" : (stryCov_9fa48("17"), 'Comunicação com Backend realizada com Sucesso!')
        }));
      }
    });

    // Quadras
    const quadraService = createQuadraService(prisma);
    const quadraController = createQuadraController(quadraService);
    const quadraRoutes = createQuadraRoutes(quadraController);

    // Disponibilidade
    const disponibilidadeService = createDisponibilidadeService(prisma);
    const disponibilidadeController = createDisponibilidadeController(disponibilidadeService);
    const disponibilidadeRoutes = createDisponibilidadeRoutes(disponibilidadeController);

    // Registrar antes das rotas genéricas de quadras
    app.use(stryMutAct_9fa48("19") ? "" : (stryCov_9fa48("19"), '/api/quadras/disponibilidade'), disponibilidadeRoutes);
    app.use(stryMutAct_9fa48("21") ? "" : (stryCov_9fa48("21"), '/api/quadras'), quadraRoutes);

    // Usuários
    const usuarioService = createUsuarioService(prisma);
    const usuarioController = createUsuarioController(usuarioService);
    const usuarioRoutes = createUsuarioRoutes(usuarioController);
    app.use(stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), '/api/usuarios'), usuarioRoutes);

    // Reservas
    const reservaService = createReservaService(prisma, stryMutAct_9fa48("24") ? {} : (stryCov_9fa48("24"), {
      agora
    }));
    const reservaController = createReservaController(reservaService);
    const reservaRoutes = createReservaRoutes(reservaController);
    app.use(stryMutAct_9fa48("26") ? "" : (stryCov_9fa48("26"), '/api/reservas'), reservaRoutes);
    return app;
  }
}
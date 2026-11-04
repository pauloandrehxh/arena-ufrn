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
export function createUsuarioService(prisma) {
  if (stryMutAct_9fa48("927")) {
    {}
  } else {
    stryCov_9fa48("927");
    async function listarUsuarios() {
      if (stryMutAct_9fa48("928")) {
        {}
      } else {
        stryCov_9fa48("928");
        return prisma.usuario.findMany();
      }
    }
    async function buscarUsuarioPorId(id) {
      if (stryMutAct_9fa48("929")) {
        {}
      } else {
        stryCov_9fa48("929");
        return prisma.usuario.findUnique(stryMutAct_9fa48("930") ? {} : (stryCov_9fa48("930"), {
          where: stryMutAct_9fa48("931") ? {} : (stryCov_9fa48("931"), {
            id
          })
        }));
      }
    }
    async function buscarUsuarioPorEmail(email) {
      if (stryMutAct_9fa48("932")) {
        {}
      } else {
        stryCov_9fa48("932");
        return prisma.usuario.findUnique(stryMutAct_9fa48("933") ? {} : (stryCov_9fa48("933"), {
          where: stryMutAct_9fa48("934") ? {} : (stryCov_9fa48("934"), {
            email
          })
        }));
      }
    }
    async function buscarUsuarioPorMatricula(registration) {
      if (stryMutAct_9fa48("935")) {
        {}
      } else {
        stryCov_9fa48("935");
        return prisma.usuario.findUnique(stryMutAct_9fa48("936") ? {} : (stryCov_9fa48("936"), {
          where: stryMutAct_9fa48("937") ? {} : (stryCov_9fa48("937"), {
            registration
          })
        }));
      }
    }
    async function criarUsuario(data) {
      if (stryMutAct_9fa48("938")) {
        {}
      } else {
        stryCov_9fa48("938");
        return prisma.usuario.create(stryMutAct_9fa48("939") ? {} : (stryCov_9fa48("939"), {
          data
        }));
      }
    }
    async function atualizarUsuario(id, data) {
      if (stryMutAct_9fa48("940")) {
        {}
      } else {
        stryCov_9fa48("940");
        return prisma.usuario.update(stryMutAct_9fa48("941") ? {} : (stryCov_9fa48("941"), {
          where: stryMutAct_9fa48("942") ? {} : (stryCov_9fa48("942"), {
            id
          }),
          data
        }));
      }
    }
    async function deletarUsuario(id) {
      if (stryMutAct_9fa48("943")) {
        {}
      } else {
        stryCov_9fa48("943");
        return prisma.usuario.delete(stryMutAct_9fa48("944") ? {} : (stryCov_9fa48("944"), {
          where: stryMutAct_9fa48("945") ? {} : (stryCov_9fa48("945"), {
            id
          })
        }));
      }
    }
    return stryMutAct_9fa48("946") ? {} : (stryCov_9fa48("946"), {
      listarUsuarios,
      buscarUsuarioPorId,
      buscarUsuarioPorEmail,
      buscarUsuarioPorMatricula,
      criarUsuario,
      atualizarUsuario,
      deletarUsuario
    });
  }
}
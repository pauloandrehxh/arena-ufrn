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
export function createUsuarioController(usuarioService) {
  if (stryMutAct_9fa48("197")) {
    {}
  } else {
    stryCov_9fa48("197");
    async function listar(req, res) {
      if (stryMutAct_9fa48("198")) {
        {}
      } else {
        stryCov_9fa48("198");
        try {
          if (stryMutAct_9fa48("199")) {
            {}
          } else {
            stryCov_9fa48("199");
            const usuarios = await usuarioService.listarUsuarios();
            return res.json(usuarios);
          }
        } catch (error) {
          if (stryMutAct_9fa48("200")) {
            {}
          } else {
            stryCov_9fa48("200");
            console.error(stryMutAct_9fa48("202") ? "" : (stryCov_9fa48("202"), 'Erro ao buscar usuários:'), error);
            return res.status(500).json(stryMutAct_9fa48("203") ? {} : (stryCov_9fa48("203"), {
              message: stryMutAct_9fa48("204") ? "" : (stryCov_9fa48("204"), 'Erro ao buscar usuários.')
            }));
          }
        }
      }
    }
    async function buscarPorId(req, res) {
      if (stryMutAct_9fa48("205")) {
        {}
      } else {
        stryCov_9fa48("205");
        try {
          if (stryMutAct_9fa48("206")) {
            {}
          } else {
            stryCov_9fa48("206");
            const id = Number(req.params.id);
            if (stryMutAct_9fa48("209") ? !Number.isInteger(id) && id <= 0 : stryMutAct_9fa48("208") ? false : stryMutAct_9fa48("207") ? true : (stryCov_9fa48("207", "208", "209"), (stryMutAct_9fa48("210") ? Number.isInteger(id) : (stryCov_9fa48("210"), !Number.isInteger(id))) || (stryMutAct_9fa48("213") ? id > 0 : stryMutAct_9fa48("212") ? id < 0 : stryMutAct_9fa48("211") ? false : (stryCov_9fa48("211", "212", "213"), id <= 0)))) {
              if (stryMutAct_9fa48("214")) {
                {}
              } else {
                stryCov_9fa48("214");
                return res.status(400).json(stryMutAct_9fa48("215") ? {} : (stryCov_9fa48("215"), {
                  message: stryMutAct_9fa48("216") ? "" : (stryCov_9fa48("216"), 'ID inválido.')
                }));
              }
            }
            const usuario = await usuarioService.buscarUsuarioPorId(id);
            if (stryMutAct_9fa48("219") ? false : stryMutAct_9fa48("218") ? true : stryMutAct_9fa48("217") ? usuario : (stryCov_9fa48("217", "218", "219"), !usuario)) {
              if (stryMutAct_9fa48("220")) {
                {}
              } else {
                stryCov_9fa48("220");
                return res.status(404).json(stryMutAct_9fa48("221") ? {} : (stryCov_9fa48("221"), {
                  message: stryMutAct_9fa48("222") ? "" : (stryCov_9fa48("222"), 'Usuário não encontrado.')
                }));
              }
            }
            return res.json(usuario);
          }
        } catch (error) {
          if (stryMutAct_9fa48("223")) {
            {}
          } else {
            stryCov_9fa48("223");
            console.error(stryMutAct_9fa48("225") ? "" : (stryCov_9fa48("225"), 'Erro ao buscar usuário:'), error);
            return res.status(500).json(stryMutAct_9fa48("226") ? {} : (stryCov_9fa48("226"), {
              message: stryMutAct_9fa48("227") ? "" : (stryCov_9fa48("227"), 'Erro ao buscar usuário.')
            }));
          }
        }
      }
    }
    async function criar(req, res) {
      if (stryMutAct_9fa48("228")) {
        {}
      } else {
        stryCov_9fa48("228");
        try {
          if (stryMutAct_9fa48("229")) {
            {}
          } else {
            stryCov_9fa48("229");
            const {
              name,
              email,
              registration
            } = req.body;
            if (stryMutAct_9fa48("232") ? (!name || !email) && !registration : stryMutAct_9fa48("231") ? false : stryMutAct_9fa48("230") ? true : (stryCov_9fa48("230", "231", "232"), (stryMutAct_9fa48("234") ? !name && !email : stryMutAct_9fa48("233") ? false : (stryCov_9fa48("233", "234"), (stryMutAct_9fa48("235") ? name : (stryCov_9fa48("235"), !name)) || (stryMutAct_9fa48("236") ? email : (stryCov_9fa48("236"), !email)))) || (stryMutAct_9fa48("237") ? registration : (stryCov_9fa48("237"), !registration)))) {
              if (stryMutAct_9fa48("238")) {
                {}
              } else {
                stryCov_9fa48("238");
                return res.status(400).json(stryMutAct_9fa48("239") ? {} : (stryCov_9fa48("239"), {
                  message: stryMutAct_9fa48("240") ? "" : (stryCov_9fa48("240"), 'Nome, e-mail e matrícula são obrigatórios.')
                }));
              }
            }
            const usuarioComEmail = await usuarioService.buscarUsuarioPorEmail(email);
            if (stryMutAct_9fa48("242") ? false : stryMutAct_9fa48("241") ? true : (stryCov_9fa48("241", "242"), usuarioComEmail)) {
              if (stryMutAct_9fa48("243")) {
                {}
              } else {
                stryCov_9fa48("243");
                return res.status(409).json(stryMutAct_9fa48("244") ? {} : (stryCov_9fa48("244"), {
                  message: stryMutAct_9fa48("245") ? "" : (stryCov_9fa48("245"), 'E-mail já cadastrado.')
                }));
              }
            }
            const usuarioComMatricula = await usuarioService.buscarUsuarioPorMatricula(registration);
            if (stryMutAct_9fa48("247") ? false : stryMutAct_9fa48("246") ? true : (stryCov_9fa48("246", "247"), usuarioComMatricula)) {
              if (stryMutAct_9fa48("248")) {
                {}
              } else {
                stryCov_9fa48("248");
                return res.status(409).json(stryMutAct_9fa48("249") ? {} : (stryCov_9fa48("249"), {
                  message: stryMutAct_9fa48("250") ? "" : (stryCov_9fa48("250"), 'Matrícula já cadastrada.')
                }));
              }
            }
            const usuario = await usuarioService.criarUsuario(stryMutAct_9fa48("251") ? {} : (stryCov_9fa48("251"), {
              name,
              email,
              registration
            }));
            return res.status(201).json(usuario);
          }
        } catch (error) {
          if (stryMutAct_9fa48("252")) {
            {}
          } else {
            stryCov_9fa48("252");
            console.error(stryMutAct_9fa48("254") ? "" : (stryCov_9fa48("254"), 'Erro ao criar usuário:'), error);
            return res.status(500).json(stryMutAct_9fa48("255") ? {} : (stryCov_9fa48("255"), {
              message: stryMutAct_9fa48("256") ? "" : (stryCov_9fa48("256"), 'Erro ao criar usuário.')
            }));
          }
        }
      }
    }
    async function atualizar(req, res) {
      if (stryMutAct_9fa48("257")) {
        {}
      } else {
        stryCov_9fa48("257");
        try {
          if (stryMutAct_9fa48("258")) {
            {}
          } else {
            stryCov_9fa48("258");
            const id = Number(req.params.id);
            if (stryMutAct_9fa48("261") ? !Number.isInteger(id) && id <= 0 : stryMutAct_9fa48("260") ? false : stryMutAct_9fa48("259") ? true : (stryCov_9fa48("259", "260", "261"), (stryMutAct_9fa48("262") ? Number.isInteger(id) : (stryCov_9fa48("262"), !Number.isInteger(id))) || (stryMutAct_9fa48("265") ? id > 0 : stryMutAct_9fa48("264") ? id < 0 : stryMutAct_9fa48("263") ? false : (stryCov_9fa48("263", "264", "265"), id <= 0)))) {
              if (stryMutAct_9fa48("266")) {
                {}
              } else {
                stryCov_9fa48("266");
                return res.status(400).json(stryMutAct_9fa48("267") ? {} : (stryCov_9fa48("267"), {
                  message: stryMutAct_9fa48("268") ? "" : (stryCov_9fa48("268"), 'ID inválido.')
                }));
              }
            }
            const usuarioExistente = await usuarioService.buscarUsuarioPorId(id);
            if (stryMutAct_9fa48("271") ? false : stryMutAct_9fa48("270") ? true : stryMutAct_9fa48("269") ? usuarioExistente : (stryCov_9fa48("269", "270", "271"), !usuarioExistente)) {
              if (stryMutAct_9fa48("272")) {
                {}
              } else {
                stryCov_9fa48("272");
                return res.status(404).json(stryMutAct_9fa48("273") ? {} : (stryCov_9fa48("273"), {
                  message: stryMutAct_9fa48("274") ? "" : (stryCov_9fa48("274"), 'Usuário não encontrado.')
                }));
              }
            }
            const {
              name,
              email,
              registration,
              active
            } = req.body;
            const dadosAtualizados = {};
            if (stryMutAct_9fa48("277") ? name === undefined : stryMutAct_9fa48("276") ? false : stryMutAct_9fa48("275") ? true : (stryCov_9fa48("275", "276", "277"), name !== undefined)) {
              if (stryMutAct_9fa48("278")) {
                {}
              } else {
                stryCov_9fa48("278");
                dadosAtualizados.name = name;
              }
            }
            if (stryMutAct_9fa48("281") ? email === undefined : stryMutAct_9fa48("280") ? false : stryMutAct_9fa48("279") ? true : (stryCov_9fa48("279", "280", "281"), email !== undefined)) {
              if (stryMutAct_9fa48("282")) {
                {}
              } else {
                stryCov_9fa48("282");
                const usuarioComEmail = await usuarioService.buscarUsuarioPorEmail(email);
                if (stryMutAct_9fa48("285") ? usuarioComEmail || usuarioComEmail.id !== id : stryMutAct_9fa48("284") ? false : stryMutAct_9fa48("283") ? true : (stryCov_9fa48("283", "284", "285"), usuarioComEmail && (stryMutAct_9fa48("287") ? usuarioComEmail.id === id : stryMutAct_9fa48("286") ? true : (stryCov_9fa48("286", "287"), usuarioComEmail.id !== id)))) {
                  if (stryMutAct_9fa48("288")) {
                    {}
                  } else {
                    stryCov_9fa48("288");
                    return res.status(409).json(stryMutAct_9fa48("289") ? {} : (stryCov_9fa48("289"), {
                      message: stryMutAct_9fa48("290") ? "" : (stryCov_9fa48("290"), 'E-mail já cadastrado.')
                    }));
                  }
                }
                dadosAtualizados.email = email;
              }
            }
            if (stryMutAct_9fa48("293") ? registration === undefined : stryMutAct_9fa48("292") ? false : stryMutAct_9fa48("291") ? true : (stryCov_9fa48("291", "292", "293"), registration !== undefined)) {
              if (stryMutAct_9fa48("294")) {
                {}
              } else {
                stryCov_9fa48("294");
                const usuarioComMatricula = await usuarioService.buscarUsuarioPorMatricula(registration);
                if (stryMutAct_9fa48("297") ? usuarioComMatricula || usuarioComMatricula.id !== id : stryMutAct_9fa48("296") ? false : stryMutAct_9fa48("295") ? true : (stryCov_9fa48("295", "296", "297"), usuarioComMatricula && (stryMutAct_9fa48("299") ? usuarioComMatricula.id === id : stryMutAct_9fa48("298") ? true : (stryCov_9fa48("298", "299"), usuarioComMatricula.id !== id)))) {
                  if (stryMutAct_9fa48("300")) {
                    {}
                  } else {
                    stryCov_9fa48("300");
                    return res.status(409).json(stryMutAct_9fa48("301") ? {} : (stryCov_9fa48("301"), {
                      message: stryMutAct_9fa48("302") ? "" : (stryCov_9fa48("302"), 'Matrícula já cadastrada.')
                    }));
                  }
                }
                dadosAtualizados.registration = registration;
              }
            }
            if (stryMutAct_9fa48("305") ? active === undefined : stryMutAct_9fa48("304") ? false : stryMutAct_9fa48("303") ? true : (stryCov_9fa48("303", "304", "305"), active !== undefined)) {
              if (stryMutAct_9fa48("306")) {
                {}
              } else {
                stryCov_9fa48("306");
                dadosAtualizados.active = active;
              }
            }
            if (stryMutAct_9fa48("309") ? Object.keys(dadosAtualizados).length !== 0 : stryMutAct_9fa48("308") ? false : stryMutAct_9fa48("307") ? true : (stryCov_9fa48("307", "308", "309"), Object.keys(dadosAtualizados).length === 0)) {
              if (stryMutAct_9fa48("310")) {
                {}
              } else {
                stryCov_9fa48("310");
                return res.status(400).json(stryMutAct_9fa48("311") ? {} : (stryCov_9fa48("311"), {
                  message: stryMutAct_9fa48("312") ? "" : (stryCov_9fa48("312"), 'Nenhum dado foi informado para atualização.')
                }));
              }
            }
            const usuario = await usuarioService.atualizarUsuario(id, dadosAtualizados);
            return res.json(usuario);
          }
        } catch (error) {
          if (stryMutAct_9fa48("313")) {
            {}
          } else {
            stryCov_9fa48("313");
            console.error(stryMutAct_9fa48("315") ? "" : (stryCov_9fa48("315"), 'Erro ao atualizar usuário:'), error);
            return res.status(500).json(stryMutAct_9fa48("316") ? {} : (stryCov_9fa48("316"), {
              message: stryMutAct_9fa48("317") ? "" : (stryCov_9fa48("317"), 'Erro ao atualizar usuário.')
            }));
          }
        }
      }
    }
    async function deletar(req, res) {
      if (stryMutAct_9fa48("318")) {
        {}
      } else {
        stryCov_9fa48("318");
        try {
          if (stryMutAct_9fa48("319")) {
            {}
          } else {
            stryCov_9fa48("319");
            const id = Number(req.params.id);
            if (stryMutAct_9fa48("322") ? !Number.isInteger(id) && id <= 0 : stryMutAct_9fa48("321") ? false : stryMutAct_9fa48("320") ? true : (stryCov_9fa48("320", "321", "322"), (stryMutAct_9fa48("323") ? Number.isInteger(id) : (stryCov_9fa48("323"), !Number.isInteger(id))) || (stryMutAct_9fa48("326") ? id > 0 : stryMutAct_9fa48("325") ? id < 0 : stryMutAct_9fa48("324") ? false : (stryCov_9fa48("324", "325", "326"), id <= 0)))) {
              if (stryMutAct_9fa48("327")) {
                {}
              } else {
                stryCov_9fa48("327");
                return res.status(400).json(stryMutAct_9fa48("328") ? {} : (stryCov_9fa48("328"), {
                  message: stryMutAct_9fa48("329") ? "" : (stryCov_9fa48("329"), 'ID inválido.')
                }));
              }
            }
            const usuario = await usuarioService.buscarUsuarioPorId(id);
            if (stryMutAct_9fa48("332") ? false : stryMutAct_9fa48("331") ? true : stryMutAct_9fa48("330") ? usuario : (stryCov_9fa48("330", "331", "332"), !usuario)) {
              if (stryMutAct_9fa48("333")) {
                {}
              } else {
                stryCov_9fa48("333");
                return res.status(404).json(stryMutAct_9fa48("334") ? {} : (stryCov_9fa48("334"), {
                  message: stryMutAct_9fa48("335") ? "" : (stryCov_9fa48("335"), 'Usuário não encontrado.')
                }));
              }
            }
            await usuarioService.deletarUsuario(id);
            return res.status(204).send();
          }
        } catch (error) {
          if (stryMutAct_9fa48("336")) {
            {}
          } else {
            stryCov_9fa48("336");
            console.error(stryMutAct_9fa48("338") ? "" : (stryCov_9fa48("338"), 'Erro ao deletar usuário:'), error);
            return res.status(500).json(stryMutAct_9fa48("339") ? {} : (stryCov_9fa48("339"), {
              message: stryMutAct_9fa48("340") ? "" : (stryCov_9fa48("340"), 'Erro ao deletar usuário.')
            }));
          }
        }
      }
    }
    return stryMutAct_9fa48("341") ? {} : (stryCov_9fa48("341"), {
      listar,
      buscarPorId,
      criar,
      atualizar,
      deletar
    });
  }
}
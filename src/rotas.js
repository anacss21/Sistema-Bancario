//desafio back-end modulo 2

const express = require('express');
const controlador = require('./controladores/gerenciamento');

const rotas = express();

rotas.post('/contas', controlador.criarConta);
rotas.post('/contas/transacoes/depositar', controlador.depositar);
rotas.post('/contas/transacoes/sacar', controlador.sacar);
rotas.post('/contas/transacoes/transferir', controlador.transferir);

rotas.get('/contas', controlador.listaContas);
rotas.get('/contas/saldo', controlador.saldo);
rotas.get('/contas/extrato', controlador.extrato);

rotas.delete('/contas/:numeroConta', controlador.excluirConta);

rotas.put('/contas/:numeroConta/usuario', controlador.atualizarUsuarioConta);


module.exports = rotas;
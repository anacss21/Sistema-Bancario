//desafio Backend- modulo 2 

const { contas } = require('../bancodedados');
const dados = require('../bancodedados');

let conta = 0;

function criarConta(req, res) {
    const conteudoConta = dadosConta(req.body);
    if (conteudoConta) {
        res.status(400, 404).json({ conteudoConta });
        return;
    }
    if (req.body.saldo != 0) {
        res.json({ mensagem: "A conta criada deve ter saldo de valor inicial igual a 0" });
        return;
    }
    const entrada = {
        numero: conta.toString(),
        saldo: Number(req.body.saldo),
        usuario: {
            nome: req.body.usuario.nome,
            cpf: req.body.usuario.cpf,
            data_nascimento: req.body.usuario.data_nascimento,
            telefone: req.body.usuario.telefone,
            email: req.body.usuario.email,
            senha: req.body.usuario.senha
        },
    };
    dados.contas.push(entrada);
    conta++;
    res.json(entrada);
}
function listaContas(req, res) {
    const gerente = Number(req.query.senha_banco);
    if (!gerente) {
        res.json("Por favor, coloque a senha!");
    }
    else {
        if (gerente === 123) {
            res.json(dados);
        }
        else {
            res.json("Senha incorreta!")
        }
    }
}
function dadosConta(validar) {
    if (!validar.usuario.nome) {
        return "Preencha o nome";
    }
    if (!validar.usuario.cpf) {
        return "Preencher CPF";
    }
    if (!validar.usuario.data_nascimento) {
        return "Preencha a sua Data de Nascimento";
    }
    if (!validar.usuario.telefone) {
        return "Preencha o seu numero de telefone";
    }
    if (!validar.usuario.email) {
        return "Preencha o seu email.";
    }
    if (!validar.usuario.senha) {
        return "Preencha a sua senha.";
    }

    const emailConsultado = dados.contas.find(dados => dados.usuario.email === validar.usuario.email);
    const cpfConsultado = dados.contas.find(dados => dados.usuario.cpf === validar.usuario.cpf);

    if (emailConsultado) {
        return "O número do Email não é valido pois já existe.";
    }
    else {
        if (cpfConsultado) {
            return "O CPF já existe, Por favor cadastre um CPF válido";
        }
    }
}
function erros(verificar) {
    if (!verificar.numero_conta) {
        return "Por favor, informe o numero da conta.";
    }
    if (!verificar.senha) {
        return "Por favor, informe uma senha válida.";
    }
};
function depositar(req, res) {
    const pedido = req.body;

    if (!pedido.numero_conta) {
        res.json({ mensagem: "Por favor, informe o numero da conta." })
        return;
    }
    if (!pedido.valor) {
        res.json({ mensagem: "Por favor, informe o valor" })
        return;
    }
    if (pedido.valor <= 0) {
        res.json({ mensagem: "Por favor, informe um valor valido" })
    }

    const contaUsuario = dados.contas.find(dados => dados.numero === pedido.numero_conta.toString());

    if (!contaUsuario) {
        res.json({ mensagem: "Por favor, informe um numero de conta válido" })
        return;
    }
    const deposito = {
        data: new Date(),
        numero_conta: pedido.numero_conta,
        valor: pedido.valor
    };
    contaUsuario.saldo += pedido.valor;
    dados.depositos.push(deposito)
    res.json({ mensagem: "Deposito realizado com sucesso" });
}
function sacar(req, res) {
    const pedido = req.body;

    if (!pedido.numero_conta) {
        res.json({ mensagem: "Por favor, informe o numero da conta." })
        return;
    }
    if (!pedido.valor) {
        res.json({ mensagem: "Por favor, informe o valor" })
        return;
    }
    if (!pedido.senha) {
        res.json({ mensagem: "Por favor, informe a senha." })
        return;
    }

    const contaUsuario = dados.contas.find(dados => dados.numero === pedido.numero_conta.toString());

    if (!contaUsuario) {
        res.json({ mensagem: "Por favor, informe um numero de conta válido" })
        return;
    }
    if (pedido.senha !== contaUsuario.usuario.senha) {
        res.json({ mensagem: "Por favor, informe a senha corretamente" })
        return;
    }
    if (contaUsuario.saldo < pedido.valor) {
        res.json({ mensagem: "Este valor não está disponível para saque, verifique seu saldo." })
        return;
    }
    const saque = {
        data: new Date(),
        numero_conta: pedido.numero_conta,
        valor: pedido.valor
    };
    contaUsuario.saldo -= pedido.valor;
    dados.saques.push(saque)
    res.json({ mensagem: "Saque realizado com sucesso" });

}
function transferir(req, res) {
    const pedido = req.body;

    if (!pedido.numero_conta_origem) {
        res.json({ mensagem: "Por favor, informe o numero da conta." })
        return;
    }
    if (!pedido.valor) {
        res.json({ mensagem: "Por favor, informe o valor" })
        return;
    }
    if (!pedido.senha) {
        res.json({ mensagem: "Por favor, informe a senha." })
        return;
    }

    const contaUsuario = dados.contas.find(dados => dados.numero === pedido.numero_conta_origem.toString());

    if (!contaUsuario.saldo) {
        res.json({ mensagem: "Você não tem saldo para realizar está transação" })
        return;
    }
    if (contaUsuario.usuario.senha !== pedido.senha.toString()) {
        res.json({ mensagem: "Por favor, informe a senha corretamente" })
        return;
    }

    const contaDestino = dados.contas.find(dados => dados.numero === pedido.numero_conta_destino.toString());

    if (!contaDestino || contaUsuario === contaDestino) {
        res.json({ mensagem: "Por favor, informe uma conta de destino valida" });
        return;
    }

    const transferencia = {
        data: new Date(),
        numero_conta_origem: pedido.numero_conta_origem,
        valor: pedido.valor,
        numero_conta_destino: pedido.numero_conta_destino,
    };

    contaUsuario.saldo -= pedido.valor;
    contaDestino.saldo += pedido.valor;
    dados.transferencias.push(transferencia);
    res.json({ mensagem: "Transferência realizado com sucesso" })
}
function excluirConta(req, res) {
    const contaUsuario = dados.contas.findIndex(dados => dados.numero === req.params.numeroConta.toString());

    if (contaUsuario != -1) {
        if (dados.contas[contaUsuario].saldo === 0) {
            dados.contas.splice(contaUsuario, 1);
            res.json({ mensagem: "Conta excluída com sucesso!" });
            return;
        }
        else {
            res.status(404).json({ mensagem: "Não foi possivel excluir a conta, retire o saldo." });
            return;
        }
    }
    else {
        res.status(400).json({ mensagem: "É preciso informar um número de conta valido." });
    }
}
function saldo(req, res) {

    const pedido = erros(req.query);
    console.log(pedido)

    if (pedido) {
        res.status(400, 404);
        res.json({ pedido });
        return;
    }

    const contaUsuario = dados.contas.find(dados => dados.numero === req.query.numero_conta.toString());
    if (!contaUsuario) {
        res.json({ mensagem: "Por favor informe uma conta valida" });
        return;
    }
    res.json(contaUsuario.saldo);
    return;


}
function extrato(req, res) {

    const pedido = erros(req.query);

    if (pedido) {
        res.status(400).json({ pedido });
        return;
    }

    const contaUsuario = dados.contas.find(dados => dados.numero === req.query.numero_conta.toString());
    if (!contaUsuario) {
        res.json({ mensagem: "Por favor informe uma conta valida" });
        return;
    }
    if (contaUsuario.usuario.senha !== req.query.senha.toString()) {
        res.json({ mensagem: "Por favor, informe a senha corretamente" })
        return;
    }

    const atividadesDaConta = {
        depositos: [],
        saques: [],
        transferenciasEnviadas: [],
        transferenciasRecebidas: []
    }

    const todosDepositos = dados.depositos.filter(x => x.numero_conta === req.query.numero_conta)
    atividadesDaConta.depositos.push(todosDepositos);

    const todosSaques = dados.saques.filter(x => x.numero_conta === req.query.numero_conta)
    atividadesDaConta.saques.push(todosSaques);

    const transferenciasEnviadas = dados.transferencias.filter(x => x.numero_conta_origem === req.query.numero_conta)
    atividadesDaConta.transferenciasEnviadas.push(transferenciasEnviadas);

    const transferenciasRecebidas = dados.transferencias.filter(x => x.numero_conta_origem !== req.query.numero_conta);
    atividadesDaConta.transferenciasRecebidas.push(transferenciasRecebidas);

    res.json(atividadesDaConta);
}
function atualizarUsuarioConta(req, res) {

    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;

    if (!(nome || cpf || data_nascimento || telefone || email || senha)) {
        res.status(400).json({ mensagem: "Precisa de ao menos um item  para ser atualizado" })
        return;
    }

    const contaUsuario = dados.contas.find(dados => dados.numero === req.params.numeroConta);

    if (!contaUsuario) {
        res.json({ mensagem: "Por favor, informe um numero de conta válido" })
        return;
    }
    if (contaUsuario.usuario.email === email) {
        res.json({ mensagem: "Este email já existe. Informe um email válido" })
    }
    if (contaUsuario.usuario.cpf === cpf) {
        res.json({ mensagem: "Este cpf já existe. Informe um cpf válido" })
    }

    contaUsuario.usuario.nome = req.body.nome ? req.body.nome : contaUsuario.usuario.nome
    contaUsuario.usuario.cpf = req.body.cpf ? req.body.cpf : contaUsuario.usuario.cpf
    contaUsuario.usuario.data_nascimento = req.body.data_nascimento ? req.body.data_nascimento : contaUsuario.usuario.data_nascimento
    contaUsuario.usuario.telefone = req.body.telefone ? req.body.telefone : contaUsuario.usuario.telefone
    contaUsuario.usuario.email = req.body.email ? req.body.email : contaUsuario.usuario.email
    contaUsuario.usuario.senha = req.body.senha ? req.body.senha : contaUsuario.usuario.senha

    res.json(contaUsuario);
}

module.exports = { criarConta, listaContas, excluirConta, depositar, sacar, transferir, saldo, extrato, atualizarUsuarioConta };

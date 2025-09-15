const jwt = require('jsonwebtoken');
const { Usuario } = require('../models/usuario.model');
const { Tecnico } = require('../models/tecnico.model');

class AuthService {
  async login(email, senha) {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      console.log('Usuário não encontrado no serviço.');
      throw new Error('Usuário não encontrado');
    }
    console.log('Usuário encontrado:', usuario.nome, 'Ativo:', usuario.ativo);
    console.log('Hash da senha no banco:', usuario.senha); // Para comparar com o hash gerado

    const senhaValida = await usuario.verificarSenha(senha);
    console.log('Senha fornecida é válida?', senhaValida); // Deve ser true

    if (!senhaValida) {
      console.log('Comparação de senha falhou no serviço.');
      throw new Error('Senha inválida');
    }

    // Atualizar último acesso
    await usuario.update({ ultimoAcesso: new Date() });

    // Gerar token JWT
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, cargo: usuario.cargo },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION || '24h' }
    );

    // Se for técnico, obter informações adicionais
    let tecnico = null;
    if (usuario.cargo === 'Técnico') {
      tecnico = await Tecnico.findOne({ where: { usuarioId: usuario.id } });
    }

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        cargo: usuario.cargo,
        ultimoAcesso: usuario.ultimoAcesso,
        tecnico: tecnico ? {
          id: tecnico.id,
          especialidade: tecnico.especialidade,
          disponivel: tecnico.disponivel
        } : null
      }
    };
  }

  async verificarToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return { valido: true, dados: decoded };
    } catch (error) {
      return { valido: false, erro: error.message };
    }
  }

  async getProfile(userId) {
    const usuario = await Usuario.findByPk(userId, {
      attributes: ['id', 'nome', 'email', 'telefone', 'cargo', 'ultimoAcesso', 'ativo']
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Se for técnico, obter informações adicionais
    let tecnico = null;
    if (usuario.cargo === 'Técnico') {
      tecnico = await Tecnico.findOne({
        where: { usuarioId: usuario.id },
        attributes: ['id', 'especialidade', 'disponivel']
      });
    }

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cargo: usuario.cargo,
      ultimoAcesso: usuario.ultimoAcesso,
      ativo: usuario.ativo,
      tecnico: tecnico
    };
  }

  async updateProfile(userId, { nome, email, telefone }) {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar se o email já está em uso por outro usuário
    if (email !== usuario.email) {
      const emailExists = await Usuario.findOne({ where: { email } });
      if (emailExists) {
        throw new Error('Email já está em uso');
      }
    }

    // Atualizar dados
    await usuario.update({
      nome,
      email,
      telefone
    });

    return {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cargo: usuario.cargo
    };
  }

  async changePassword(userId, senhaAtual, novaSenha) {
    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verificar senha atual
    const senhaAtualValida = await usuario.verificarSenha(senhaAtual);
    if (!senhaAtualValida) {
      throw new Error('Senha atual incorreta');
    }

    // Atualizar senha
    await usuario.update({ senha: novaSenha });

    return true;
  }

  // Método para registrar novos usuários
  async register(dadosUsuario, options = {}) {
    try {
      // Verificar se o email já existe
      const usuarioExistente = await Usuario.findOne({ 
        where: { email: dadosUsuario.email },
        ...options
      });

      if (usuarioExistente) {
        throw new Error('Email já está em uso');
      }

      // Criar novo usuário
      const novoUsuario = await Usuario.create(dadosUsuario, options);
      
      // Retornar usuário sem a senha
      const { senha, ...usuarioSemSenha } = novoUsuario.toJSON();
      
      return usuarioSemSenha;
    } catch (error) {
      console.error('Erro ao registrar usuário:', error.message);
      throw error;
    }
  }
}

module.exports = new AuthService();

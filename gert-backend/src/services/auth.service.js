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
      { expiresIn: process.env.JWT_EXPIRATION }
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
}

module.exports = new AuthService();

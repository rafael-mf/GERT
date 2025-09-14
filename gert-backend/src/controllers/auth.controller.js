const authService = require('../services/auth.service');

class AuthController {
  async login(req, res, next) {
    try {
      const { email, senha } = req.body;
      
      if (!email || !senha) {
        return res.status(400).json({ message: 'Email e senha são obrigatórios' });
      }
      
      const resultado = await authService.login(email, senha);
      return res.json(resultado);
    } catch (error) {
      if (error.message === 'Usuário não encontrado' || error.message === 'Senha inválida') {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      if (error.message === 'Usuário inativo') {
        return res.status(403).json({ message: 'Usuário inativo' });
      }
      
      return next(error);
    }
  }
  
  async verificarToken(req, res) {
    const token = req.body.token || req.query.token;
    
    if (!token) {
      return res.status(400).json({ message: 'Token não fornecido' });
    }
    
    const resultado = await authService.verificarToken(token);
    
    if (resultado.valido) {
      return res.json({ valido: true, usuario: resultado.dados });
    } else {
      return res.status(401).json({ valido: false, message: resultado.erro });
    }
  }

  async getProfile(req, res, next) {
    try {
      const userId = req.usuario.id;
      const usuario = await authService.getProfile(userId);
      return res.json({ usuario });
    } catch (error) {
      return next(error);
    }
  }

  async updateProfile(req, res, next) {
    try {
      const userId = req.usuario.id;
      const { nome, email, telefone } = req.body;

      if (!nome || !email) {
        return res.status(400).json({ message: 'Nome e email são obrigatórios' });
      }

      const usuario = await authService.updateProfile(userId, { nome, email, telefone });
      return res.json({ message: 'Perfil atualizado com sucesso', usuario });
    } catch (error) {
      if (error.message === 'Email já está em uso') {
        return res.status(409).json({ message: error.message });
      }
      return next(error);
    }
  }

  async changePassword(req, res, next) {
    try {
      const userId = req.usuario.id;
      const { senhaAtual, novaSenha } = req.body;

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({ message: 'Senha atual e nova senha são obrigatórias' });
      }

      if (novaSenha.length < 6) {
        return res.status(400).json({ message: 'Nova senha deve ter pelo menos 6 caracteres' });
      }

      await authService.changePassword(userId, senhaAtual, novaSenha);
      return res.json({ message: 'Senha alterada com sucesso' });
    } catch (error) {
      if (error.message === 'Senha atual incorreta') {
        return res.status(400).json({ message: error.message });
      }
      return next(error);
    }
  }
}

module.exports = new AuthController();

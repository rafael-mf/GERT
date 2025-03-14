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
}

module.exports = new AuthController();

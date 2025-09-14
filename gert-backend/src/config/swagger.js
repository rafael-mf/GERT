const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Configuração do Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'GERT - API de Gerenciamento de Chamados Técnicos',
    version: '1.0.0',
    description: 'API RESTful para o sistema GERT de gerenciamento de chamados técnicos',
    contact: {
      name: 'Equipe de Desenvolvimento',
      email: 'dev@gert.com'
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desenvolvimento',
    },
    {
      url: 'https://api.gert.com',
      description: 'Servidor de produção',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Usuario: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          email: { type: 'string', format: 'email' },
          cargo: { type: 'string', enum: ['Administrador', 'Técnico', 'Atendente'] },
          ativo: { type: 'boolean' },
        },
      },
      Chamado: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          titulo: { type: 'string' },
          descricao: { type: 'string' },
          clienteId: { type: 'integer' },
          tecnicoId: { type: 'integer' },
          statusId: { type: 'integer' },
          prioridadeId: { type: 'integer' },
          valorTotal: { type: 'number', format: 'float' },
          dataAbertura: { type: 'string', format: 'date-time' },
        },
      },
      Peca: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          codigo: { type: 'string' },
          categoriaId: { type: 'integer' },
          precoCusto: { type: 'number', format: 'float' },
          precoVenda: { type: 'number', format: 'float' },
          estoqueAtual: { type: 'integer' },
          estoqueMinimo: { type: 'integer' },
        },
      },
      Fornecedor: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          nome: { type: 'string' },
          cnpj: { type: 'string' },
          email: { type: 'string', format: 'email' },
          telefone: { type: 'string' },
          endereco: { type: 'string' },
        },
      },
      AuditLog: {
        type: 'object',
        properties: {
          timestamp: { type: 'string', format: 'date-time' },
          action: { type: 'string', enum: ['VIEW', 'CREATE', 'UPDATE', 'DELETE', 'ACCESS'] },
          userId: { type: 'string' },
          resource: { type: 'string' },
          resourceId: { type: 'string' },
          details: {
            type: 'object',
            properties: {
              method: { type: 'string' },
              url: { type: 'string' },
              ip: { type: 'string' },
              userAgent: { type: 'string' },
              statusCode: { type: 'integer' }
            }
          }
        }
      },
      AuditStats: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          byAction: { type: 'object' },
          byResource: { type: 'object' },
          byUser: { type: 'object' },
          recentActivity: {
            type: 'array',
            items: { $ref: '#/components/schemas/AuditLog' }
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: { type: 'string' },
          errors: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                field: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.js'], // Caminhos para os arquivos de rotas
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = {
  swaggerUi,
  swaggerSpec,
};
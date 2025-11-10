ï»¿-- =====================================================
-- BACKUP DO BANCO DE DADOS: gert
-- Data: 10/11/2025, 20:03:00
-- =====================================================

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

-- Tabela: categorias_dispositivos
DROP TABLE IF EXISTS `categorias_dispositivos`;
CREATE TABLE `categorias_dispositivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `descricao` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela categorias_dispositivos
INSERT INTO `categorias_dispositivos` VALUES
(1, 'Smartphone', 'Telefones celulares e smartphones'),
(2, 'Notebook', 'Notebooks e laptops'),
(3, 'Desktop', 'Computadores de mesa'),
(4, 'Tablet', 'Tablets e iPads'),
(5, 'Impressora', 'Impressoras e multifuncionais'),
(6, 'Monitor', 'Monitores e displays'),
(7, 'Roteador', 'Roteadores e switches');

-- Tabela: categorias_pecas
DROP TABLE IF EXISTS `categorias_pecas`;
CREATE TABLE `categorias_pecas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `descricao` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela categorias_pecas
INSERT INTO `categorias_pecas` VALUES
(1, 'Tela', 'Displays e telas de reposição'),
(2, 'Bateria', 'Baterias e fontes de alimentação'),
(6, 'Memória', 'Módulos de memória RAM'),
(7, 'Placa-mãe', 'Placas-mãe e componentes principais'),
(8, 'Tela/Display', 'Telas e displays'),
(9, 'Memória RAM', 'Módulos de memória'),
(10, 'Processador', 'CPUs e processadores'),
(11, 'Periféricos', 'Cabos, mouse, teclado'),
(12, 'Resfriamento', 'Coolers e dissipadores');

-- Tabela: chamados
DROP TABLE IF EXISTS `chamados`;
CREATE TABLE `chamados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `dispositivo_id` int NOT NULL,
  `tecnico_id` int DEFAULT NULL,
  `prioridade_id` int NOT NULL,
  `status_id` int NOT NULL,
  `titulo` varchar(100) NOT NULL,
  `data_abertura` datetime DEFAULT NULL,
  `valor_final` decimal(10,2) DEFAULT NULL,
  `data_inicio` datetime DEFAULT NULL,
  `data_conclusao` datetime DEFAULT NULL,
  `descricao_problema` text NOT NULL,
  `observacoes_internas` text,
  `descricao_solucao` text,
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `dispositivo_id` (`dispositivo_id`),
  KEY `tecnico_id` (`tecnico_id`),
  KEY `prioridade_id` (`prioridade_id`),
  KEY `status_id` (`status_id`),
  CONSTRAINT `chamados_ibfk_111` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `chamados_ibfk_112` FOREIGN KEY (`dispositivo_id`) REFERENCES `dispositivos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `chamados_ibfk_113` FOREIGN KEY (`tecnico_id`) REFERENCES `tecnicos` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `chamados_ibfk_114` FOREIGN KEY (`prioridade_id`) REFERENCES `prioridades` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `chamados_ibfk_115` FOREIGN KEY (`status_id`) REFERENCES `status_chamados` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=68 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela chamados
INSERT INTO `chamados` VALUES
(2, 14, 16, 2, 4, 8, 'Sem acesso Á  internet', '2024-10-29 03:15:10', NULL, NULL, NULL, 'Cliente relata: Sem acesso Á  internet. Necessário verificação técnica.', NULL, NULL),
(3, 8, 5, 1, 1, 1, 'Atualização de hardware solicitada', '2025-10-23 17:31:57', '80.00', NULL, NULL, 'Cliente relata: Atualização de hardware solicitada. Necessário verificação técnica.', NULL, NULL),
(4, 9, 8, 3, 1, 1, 'Teclas não funcionam', '2025-05-19 06:35:01', NULL, NULL, NULL, 'Cliente relata: Teclas não funcionam. Necessário verificação técnica.', NULL, NULL),
(5, 18, 27, 3, 4, 1, 'Vírus/malware detectado', '2024-09-13 03:13:12', NULL, NULL, NULL, 'Cliente relata: Vírus/malware detectado. Necessário verificação técnica.', NULL, NULL),
(6, 7, 4, NULL, 5, 9, 'Configuração de rede necessária', '2025-09-16 12:18:30', NULL, NULL, NULL, 'Cliente relata: Configuração de rede necessária. Necessário verificação técnica.', NULL, NULL),
(7, 14, 16, NULL, 4, 9, 'Backup de dados urgente', '2025-07-26 14:40:55', NULL, NULL, NULL, 'Cliente relata: Backup de dados urgente. Necessário verificação técnica.', NULL, NULL),
(8, 6, 3, 2, 5, 1, 'Backup de dados urgente', '2025-09-13 11:56:49', NULL, NULL, NULL, 'Cliente relata: Backup de dados urgente. Necessário verificação técnica.', NULL, NULL),
(9, 5, 2, 3, 4, 4, 'Configuração de rede necessária', '2025-01-17 10:24:47', NULL, NULL, NULL, 'Cliente relata: Configuração de rede necessária. Necessário verificação técnica.', NULL, NULL),
(10, 7, 4, 1, 1, 9, 'Teclas não funcionam', '2025-01-20 16:34:22', NULL, NULL, NULL, 'Cliente relata: Teclas não funcionam. Necessário verificação técnica.', NULL, NULL),
(11, 13, 15, 2, 4, 8, 'Atualização de hardware solicitada', '2024-12-29 15:39:59', NULL, NULL, NULL, 'Cliente relata: Atualização de hardware solicitada. Necessário verificação técnica.', NULL, NULL),
(12, 4, 1, 5, 1, 11, 'Backup de dados urgente', '2024-11-18 01:21:40', '437.25', '2024-11-22 17:30:00', '2024-11-22 10:48:20', 'Cliente relata: Backup de dados urgente. Necessário verificação técnica.', 'Diagnóstico inicial realizado. Backup de dados urgente.', 'Problema resolvido com sucesso. Backup de dados urgente foi solucionado.'),
(13, 7, 4, 2, 5, 7, 'Tela quebrada após queda', '2024-10-20 18:23:18', NULL, NULL, NULL, 'Cliente relata: Tela quebrada após queda. Necessário verificação técnica.', NULL, NULL),
(14, 12, 13, 1, 5, 4, 'Configuração de rede necessária', '2024-12-11 03:42:26', NULL, NULL, NULL, 'Cliente relata: Configuração de rede necessária. Necessário verificação técnica.', NULL, NULL),
(15, 15, 21, 5, 5, 8, 'Não liga - suspeita de bateria', '2025-08-26 03:20:12', NULL, NULL, NULL, 'Cliente relata: Não liga - suspeita de bateria. Necessário verificação técnica.', NULL, NULL),
(16, 18, 27, 5, 1, 11, 'Atualização de hardware solicitada', '2025-08-14 07:16:32', '165.44', '2025-08-17 15:45:51', '2025-08-22 00:53:59', 'Cliente relata: Atualização de hardware solicitada. Necessário verificação técnica.', 'Diagnóstico inicial realizado. Atualização de hardware solicitada.', 'Problema resolvido com sucesso. Atualização de hardware solicitada foi solucionado.'),
(17, 12, 45, 2, 3, 10, 'Sem acesso Á  internet', '2025-09-13 00:25:56', NULL, NULL, NULL, 'Cliente relata: Sem acesso Á  internet. Necessário verificação técnica.', NULL, NULL),
(18, 12, 46, NULL, 4, 8, 'Teclas não funcionam', '2024-08-22 23:39:37', NULL, NULL, NULL, 'Cliente relata: Teclas não funcionam. Necessário verificação técnica.', NULL, NULL),
(19, 13, 49, NULL, 1, 4, 'Tela quebrada após queda', '2025-08-30 16:20:41', NULL, NULL, NULL, 'Cliente relata: Tela quebrada após queda. Necessário verificação técnica.', NULL, NULL),
(20, 17, 56, 2, 3, 8, 'Backup de dados urgente', '2025-08-25 17:30:08', NULL, NULL, NULL, 'Cliente relata: Backup de dados urgente. Necessário verificação técnica.', NULL, NULL),
(21, 13, 48, 2, 3, 7, 'Problemas no carregamento', '2024-12-09 11:58:52', NULL, NULL, NULL, 'Cliente relata: Problemas no carregamento. Necessário verificação técnica.', NULL, NULL),
(22, 13, 48, 1, 4, 8, 'Sem acesso Á  internet', '2025-09-10 17:28:49', NULL, NULL, NULL, 'Cliente relata: Sem acesso Á  internet. Necessário verificação técnica.', NULL, NULL),
(23, 13, 48, 1, 5, 9, 'Impressora não imprime', '2025-04-04 22:30:02', NULL, NULL, NULL, 'Cliente relata: Impressora não imprime. Necessário verificação técnica.', NULL, NULL),
(24, 14, 51, NULL, 4, 4, 'Atualização de hardware solicitada', '2025-05-14 03:53:18', NULL, NULL, NULL, 'Cliente relata: Atualização de hardware solicitada. Necessário verificação técnica.', NULL, NULL),
(25, 11, 43, 3, 4, 9, 'Vírus/malware detectado', '2025-01-17 05:20:19', NULL, NULL, NULL, 'Cliente relata: Vírus/malware detectado. Necessário verificação técnica.', NULL, NULL),
(26, 13, 47, NULL, 4, 11, 'Não liga - suspeita de bateria', '2025-10-31 02:23:26', NULL, NULL, '2025-11-04 00:08:52', 'Cliente relata: Não liga - suspeita de bateria. Necessário verificação técnica.', 'teste', 'teste'),
(27, 12, 46, 5, 5, 1, 'Tela quebrada após queda', '2024-12-08 04:08:08', NULL, NULL, NULL, 'Cliente relata: Tela quebrada após queda. Necessário verificação técnica.', NULL, NULL),
(28, 18, 60, 4, 5, 10, 'Teclas não funcionam', '2025-08-31 13:42:48', NULL, NULL, NULL, 'Cliente relata: Teclas não funcionam. Necessário verificação técnica.', NULL, NULL),
(29, 7, 36, NULL, 4, 11, 'Impressora não imprime', '2024-08-21 02:16:10', '162.63', '2024-08-21 12:35:43', '2024-08-22 19:29:34', 'Cliente relata: Impressora não imprime. Necessário verificação técnica.', 'Diagnóstico inicial realizado. Impressora não imprime.', 'Problema resolvido com sucesso. Impressora não imprime foi solucionado.'),
(30, 10, 42, 1, 3, 1, 'Vírus/malware detectado', '2025-10-05 14:30:21', NULL, NULL, NULL, 'Cliente relata: Vírus/malware detectado. Necessário verificação técnica.', NULL, NULL),
(31, 10, 41, NULL, 4, 1, 'Superaquecimento', '2025-03-09 16:27:18', NULL, NULL, NULL, 'Cliente relata: Superaquecimento. Necessário verificação técnica.', NULL, NULL),
(32, 18, 58, 3, 4, 1, 'Não liga - suspeita de bateria', '2025-06-26 06:14:06', NULL, NULL, NULL, 'Cliente relata: Não liga - suspeita de bateria. Necessário verificação técnica.', NULL, NULL),
(33, 12, 45, 4, 3, 1, 'Sistema operacional lento', '2025-08-13 20:17:29', NULL, NULL, NULL, 'Cliente relata: Sistema operacional lento. Necessário verificação técnica.', NULL, NULL),
(34, 11, 43, 1, 5, 7, 'Backup de dados urgente', '2025-02-21 14:27:18', NULL, NULL, NULL, 'Cliente relata: Backup de dados urgente. Necessário verificação técnica.', NULL, NULL),
(35, 7, 37, 1, 5, 1, 'Atualização de hardware solicitada', '2024-07-25 16:53:13', NULL, NULL, NULL, 'Cliente relata: Atualização de hardware solicitada. Necessário verificação técnica.', NULL, NULL),
(36, 18, 60, NULL, 4, 8, 'Backup de dados urgente', '2025-09-08 16:20:31', NULL, NULL, NULL, 'Cliente relata: Backup de dados urgente. Necessário verificação técnica.', NULL, NULL),
(37, 16, 55, 2, 1, 9, 'Sem acesso Á  internet', '2025-03-18 23:47:44', NULL, NULL, NULL, 'Cliente relata: Sem acesso Á  internet. Necessário verificação técnica.', NULL, NULL),
(38, 6, 34, 5, 4, 8, 'Teclas não funcionam', '2025-06-17 06:50:34', NULL, NULL, NULL, 'Cliente relata: Teclas não funcionam. Necessário verificação técnica.', NULL, NULL),
(39, 14, 50, NULL, 4, 4, 'Configuração de rede necessária', '2024-09-15 13:58:34', NULL, NULL, NULL, 'Cliente relata: Configuração de rede necessária. Necessário verificação técnica.', NULL, NULL),
(40, 4, 31, NULL, 3, 4, 'Problemas no carregamento', '2025-04-21 00:20:21', NULL, NULL, NULL, 'Cliente relata: Problemas no carregamento. Necessário verificação técnica.', NULL, NULL),
(41, 12, 45, 1, 3, 7, 'Barulho estranho no HD', '2025-04-10 21:01:47', NULL, NULL, NULL, 'Cliente relata: Barulho estranho no HD. Necessário verificação técnica.', NULL, NULL),
(42, 18, 60, 5, 3, 10, 'Perda de dados - necessário recuperação', '2025-08-08 00:23:01', NULL, NULL, NULL, 'Cliente relata: Perda de dados - necessário recuperação. Necessário verificação técnica.', NULL, NULL),
(43, 10, 42, 1, 4, 4, 'Problemas no carregamento', '2025-01-20 04:44:33', NULL, NULL, NULL, 'Cliente relata: Problemas no carregamento. Necessário verificação técnica.', NULL, NULL),
(44, 16, 54, NULL, 3, 4, 'Barulho estranho no HD', '2025-06-26 18:19:30', NULL, NULL, NULL, 'Cliente relata: Barulho estranho no HD. Necessário verificação técnica.', NULL, NULL),
(45, 4, 30, 3, 4, 9, 'Sistema operacional lento', '2024-07-18 10:29:12', NULL, NULL, NULL, 'Cliente relata: Sistema operacional lento. Necessário verificação técnica.', NULL, NULL),
(46, 6, 34, 4, 1, 1, 'Perda de dados - necessário recuperação', '2025-08-09 16:04:49', NULL, NULL, NULL, 'Cliente relata: Perda de dados - necessário recuperação. Necessário verificação técnica.', NULL, NULL),
(47, 17, 56, 3, 3, 8, 'Tela quebrada após queda', '2024-07-14 21:57:36', NULL, NULL, NULL, 'Cliente relata: Tela quebrada após queda. Necessário verificação técnica.', NULL, NULL),
(48, 7, 36, NULL, 4, 4, 'Sem acesso Á  internet', '2025-06-25 15:24:07', NULL, NULL, NULL, 'Cliente relata: Sem acesso Á  internet. Necessário verificação técnica.', NULL, NULL),
(49, 18, 58, 4, 5, 11, 'Sistema operacional lento', '2024-12-19 02:13:48', '367.72', '2024-12-23 11:31:03', '2024-12-27 11:07:43', 'Cliente relata: Sistema operacional lento. Necessário verificação técnica.', 'Diagnóstico inicial realizado. Sistema operacional lento.', 'Problema resolvido com sucesso. Sistema operacional lento foi solucionado.'),
(50, 5, 32, 4, 4, 11, 'Tela quebrada após queda', '2024-08-03 02:57:03', '574.31', '2024-08-03 18:20:12', '2024-08-10 17:40:01', 'Cliente relata: Tela quebrada após queda. Necessário verificação técnica.', 'Diagnóstico inicial realizado. Tela quebrada após queda.', 'Problema resolvido com sucesso. Tela quebrada após queda foi solucionado.'),
(51, 18, 58, 1, 1, 8, 'Atualização de hardware solicitada', '2024-12-06 18:57:44', NULL, NULL, NULL, 'Cliente relata: Atualização de hardware solicitada. Necessário verificação técnica.', NULL, NULL),
(52, 11, 43, 2, 4, 1, 'Sem acesso Á  internet', '2025-05-08 14:49:55', NULL, NULL, NULL, 'Cliente relata: Sem acesso Á  internet. Necessário verificação técnica.', NULL, NULL),
(53, 5, 32, 4, 4, 1, 'Superaquecimento', '2025-05-08 02:56:10', NULL, NULL, NULL, 'Cliente relata: Superaquecimento. Necessário verificação técnica.', NULL, NULL),
(54, 6, 34, NULL, 5, 1, 'Atualização de hardware solicitada', '2025-01-22 12:21:46', NULL, NULL, NULL, 'Cliente relata: Atualização de hardware solicitada. Necessário verificação técnica.', NULL, NULL),
(55, 13, 48, 2, 3, 10, 'Barulho estranho no HD', '2024-10-15 20:46:53', NULL, NULL, NULL, 'Cliente relata: Barulho estranho no HD. Necessário verificação técnica.', NULL, NULL),
(56, 14, 51, 1, 4, 9, 'Teclas não funcionam', '2024-07-12 22:49:53', NULL, NULL, NULL, 'Cliente relata: Teclas não funcionam. Necessário verificação técnica.', NULL, NULL),
(57, 6, 35, 1, 5, 11, 'Vírus/malware detectado', '2024-11-04 18:57:30', '190.55', '2024-11-06 02:54:48', '2024-11-08 12:46:45', 'Cliente relata: Vírus/malware detectado. Necessário verificação técnica.', 'Diagnóstico inicial realizado. Vírus/malware detectado.', 'Problema resolvido com sucesso. Vírus/malware detectado foi solucionado.'),
(58, 10, 42, 1, 4, 1, 'Superaquecimento', '2025-07-11 03:02:15', NULL, NULL, NULL, 'Cliente relata: Superaquecimento. Necessário verificação técnica.', NULL, NULL),
(59, 9, 40, 1, 4, 7, 'Tela quebrada após queda', '2024-09-19 11:00:55', NULL, NULL, NULL, 'Cliente relata: Tela quebrada após queda. Necessário verificação técnica.', NULL, NULL),
(60, 5, 32, 4, 5, 4, 'Atualização de hardware solicitada', '2025-07-02 15:11:46', NULL, NULL, NULL, 'Cliente relata: Atualização de hardware solicitada. Necessário verificação técnica.', NULL, NULL),
(61, 14, 51, 3, 3, 10, 'Backup de dados urgente', '2025-04-12 12:56:23', NULL, NULL, NULL, 'Cliente relata: Backup de dados urgente. Necessário verificação técnica.', NULL, NULL),
(62, 12, 46, 4, 5, 11, 'Impressora não imprime', '2025-08-12 19:26:08', '415.22', '2025-08-18 12:36:31', '2025-08-17 13:41:45', 'Cliente relata: Impressora não imprime. Necessário verificação técnica.', 'Diagnóstico inicial realizado. Impressora não imprime.', 'Problema resolvido com sucesso. Impressora não imprime foi solucionado.'),
(63, 14, 50, 3, 3, 4, 'Configuração de rede necessária', '2024-07-12 23:04:38', NULL, NULL, NULL, 'Cliente relata: Configuração de rede necessária. Necessário verificação técnica.', NULL, NULL),
(64, 18, 60, NULL, 5, 11, 'Não liga - suspeita de bateria', '2025-03-08 08:53:54', '134.43', '2025-03-12 17:23:29', '2025-03-15 00:12:46', 'Cliente relata: Não liga - suspeita de bateria. Necessário verificação técnica.', 'Diagnóstico inicial realizado. Não liga - suspeita de bateria.', 'Problema resolvido com sucesso. Não liga - suspeita de bateria foi solucionado.'),
(65, 8, 39, 3, 1, 7, 'Impressora não imprime', '2024-09-04 18:32:59', NULL, NULL, NULL, 'Cliente relata: Impressora não imprime. Necessário verificação técnica.', NULL, NULL),
(66, 10, 41, 4, 5, 7, 'Tela quebrada após queda', '2025-04-30 05:18:58', NULL, NULL, NULL, 'Cliente relata: Tela quebrada após queda. Necessário verificação técnica.', NULL, NULL),
(67, 5, 61, 1, 3, 11, 'Tela quebrada', '2025-11-04 01:43:06', '220.00', NULL, '2025-11-04 01:45:17', 'Tela quebrada', 'Tela a34', 'Tela trocada');

-- Tabela: chamados_atualizacoes
DROP TABLE IF EXISTS `chamados_atualizacoes`;
CREATE TABLE `chamados_atualizacoes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `status_anterior` int DEFAULT NULL,
  `status_novo` int DEFAULT NULL,
  `comentario` text,
  `data_atualizacao` datetime DEFAULT NULL,
  `chamado_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `status_anterior` (`status_anterior`),
  KEY `status_novo` (`status_novo`),
  KEY `chamado_id` (`chamado_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `chamados_atualizacoes_ibfk_13` FOREIGN KEY (`status_anterior`) REFERENCES `status_chamados` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chamados_atualizacoes_ibfk_14` FOREIGN KEY (`status_novo`) REFERENCES `status_chamados` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `chamados_atualizacoes_ibfk_15` FOREIGN KEY (`chamado_id`) REFERENCES `chamados` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chamados_atualizacoes_ibfk_16` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela chamados_atualizacoes
INSERT INTO `chamados_atualizacoes` VALUES
(1, 1, 11, 'Atualização 1: Aguardando peça', '2024-11-18 01:21:40', 12, 10),
(2, 1, 11, 'Atualização 1: Teste realizado', '2024-08-21 02:16:10', 29, 2),
(3, 1, 11, 'Atualização 1: Teste realizado', '2024-12-19 02:13:48', 49, 9),
(4, 1, 11, 'Atualização 2: Em análise', '2024-12-20 02:13:48', 49, 9),
(5, 1, 11, 'Atualização 1: Teste realizado', '2024-08-03 02:57:03', 50, 9),
(6, 1, 11, 'Atualização 2: Em análise', '2024-08-04 02:57:03', 50, 9),
(7, 1, 11, 'Atualização 1: Em análise', '2024-11-04 18:57:30', 57, 6),
(8, 1, 11, 'Atualização 2: Cliente contatado', '2024-11-05 18:57:30', 57, 6),
(9, 1, 11, 'Atualização 1: Em análise', '2025-08-12 19:26:08', 62, 9),
(10, 1, 11, 'Atualização 2: Em análise', '2025-08-13 19:26:08', 62, 9),
(11, 1, 11, 'Atualização 3: Teste realizado', '2025-08-14 19:26:08', 62, 9),
(12, 1, 11, 'Atualização 1: Cliente contatado', '2025-03-08 08:53:54', 64, 2),
(13, NULL, NULL, 'Chamado fechado - Diagnóstico: teste | Solução: teste', '2025-11-04 00:08:52', 26, 2),
(14, NULL, NULL, 'Serviço adicionado: Formatação e Reinstalação (R$ 80)', '2025-11-04 01:05:04', 3, 2),
(15, NULL, NULL, 'Chamado aberto', '2025-11-04 01:43:06', 67, 2),
(16, NULL, NULL, 'Cliente entregou aparelho hoje', '2025-11-04 01:44:04', 67, 2),
(17, NULL, NULL, 'Serviço adicionado: Troca de Tela (R$ 100)', '2025-11-04 01:44:21', 67, 2),
(18, NULL, NULL, 'Peça adicionada: 1 x R$ 120 - Tela a34', '2025-11-04 01:44:39', 67, 2),
(19, NULL, NULL, 'Chamado fechado - Diagnóstico: Tela a34 | Solução: Tela trocada', '2025-11-04 01:45:17', 67, 2);

-- Tabela: chamados_pecas
DROP TABLE IF EXISTS `chamados_pecas`;
CREATE TABLE `chamados_pecas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chamado_id` int NOT NULL,
  `peca_id` int DEFAULT NULL,
  `quantidade` int NOT NULL,
  `valor_unitario` decimal(10,2) NOT NULL,
  `data_utilizacao` datetime DEFAULT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `descricao` text,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `numero_serie` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chamado_id` (`chamado_id`),
  KEY `peca_id` (`peca_id`),
  CONSTRAINT `chamados_pecas_ibfk_45` FOREIGN KEY (`chamado_id`) REFERENCES `chamados` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `chamados_pecas_ibfk_46` FOREIGN KEY (`peca_id`) REFERENCES `pecas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela chamados_pecas
INSERT INTO `chamados_pecas` VALUES
(1, 12, 8, 1, '280.00', '2025-11-03 23:02:39', NULL, NULL, NULL, NULL, NULL),
(2, 57, 10, 1, '350.00', '2025-11-03 23:04:08', NULL, NULL, NULL, NULL, NULL),
(3, 64, 10, 1, '350.00', '2025-11-03 23:04:08', NULL, NULL, NULL, NULL, NULL),
(4, 67, NULL, 1, '120.00', '2025-11-04 01:44:39', 'Tela a34', '', 'samsung', '', '');

-- Tabela: chamados_servicos
DROP TABLE IF EXISTS `chamados_servicos`;
CREATE TABLE `chamados_servicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chamado_id` int NOT NULL,
  `servico_id` int NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `observacoes` text,
  PRIMARY KEY (`id`),
  KEY `chamado_id` (`chamado_id`),
  KEY `servico_id` (`servico_id`),
  CONSTRAINT `chamados_servicos_ibfk_45` FOREIGN KEY (`chamado_id`) REFERENCES `chamados` (`id`) ON UPDATE CASCADE,
  CONSTRAINT `chamados_servicos_ibfk_46` FOREIGN KEY (`servico_id`) REFERENCES `servicos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela chamados_servicos
INSERT INTO `chamados_servicos` VALUES
(1, 50, 8, '90.00', 'Serviço padrão'),
(2, 57, 11, '40.00', 'Serviço padrão'),
(3, 57, 11, '40.00', 'Serviço padrão'),
(4, 3, 2, '80.00', NULL),
(5, 67, 3, '100.00', NULL);

-- Tabela: clientes
DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cpf_cnpj` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `endereco` varchar(200) DEFAULT NULL,
  `cidade` varchar(50) DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `observacoes` text,
  `data_cadastro` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cpf_cnpj` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_2` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_3` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_4` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_5` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_6` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_7` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_8` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_9` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_10` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_11` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_12` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_13` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_14` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_15` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_16` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_17` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_18` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_19` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_20` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_21` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_22` (`cpf_cnpj`),
  UNIQUE KEY `cpf_cnpj_23` (`cpf_cnpj`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela clientes
INSERT INTO `clientes` VALUES
(1, 'Cliente Teste', NULL, 'teste@cliente.com', '11999999999', NULL, NULL, NULL, NULL, NULL, '2025-09-15 18:36:15'),
(2, 'Cliente Teste', NULL, 'teste@cliente.com', '11999999999', NULL, NULL, NULL, NULL, NULL, '2025-09-15 18:36:21'),
(3, 'Cliente Teste', NULL, 'teste@cliente.com', '11999999999', NULL, NULL, NULL, NULL, NULL, '2025-09-15 18:36:28'),
(4, 'Empresa Tech Solutions Ltda', '548.018.607-10', 'empresa.tech.solutions.ltda@email.com', '(50) 75965-4825', 'Rua Exemplo, 238', 'São Paulo', 'SP', '83829-193', 'Cliente empresarial', '2025-11-03 23:02:38'),
(5, 'José da Silva', '455.335.535-82', 'josé.da.silva@email.com', '(52) 56802-9821', 'Rua Exemplo, 376', 'Rio de Janeiro', 'RJ', '64335-723', 'Cliente pessoa física', '2025-11-03 23:02:38'),
(6, 'Maria Eduarda Souza', '766.455.575-80', 'maria.eduarda.souza@email.com', '(28) 97782-5878', 'Rua Exemplo, 883', 'Belo Horizonte', 'MG', '56066-295', 'Cliente pessoa física', '2025-11-03 23:02:38'),
(7, 'Escola Municipal Centro', '722.573.040-58', 'escola.municipal.centro@email.com', '(14) 82848-8565', 'Rua Exemplo, 260', 'Curitiba', 'PR', '65213-126', 'Cliente empresarial', '2025-11-03 23:02:38'),
(8, 'Carlos Alberto Costa', '087.282.874-27', 'carlos.alberto.costa@email.com', '(45) 71386-1616', 'Rua Exemplo, 760', 'Porto Alegre', 'RS', '24163-181', 'Cliente pessoa física', '2025-11-03 23:02:38'),
(9, 'Ana Paula Martins', '063.746.124-85', 'ana.paula.martins@email.com', '(14) 62043-2209', 'Rua Exemplo, 422', 'Brasília', 'DF', '32950-639', 'Cliente pessoa física', '2025-11-03 23:02:38'),
(10, 'Comércio de Eletrônicos XYZ', '308.003.374-17', 'comércio.de.eletrônicos.xyz@email.com', '(36) 27273-2788', 'Rua Exemplo, 647', 'Fortaleza', 'CE', '96607-946', 'Cliente empresarial', '2025-11-03 23:02:38'),
(11, 'Roberto Alves Santos', '233.212.030-76', 'roberto.alves.santos@email.com', '(19) 14718-1536', 'Rua Exemplo, 928', 'Salvador', 'BA', '47444-796', 'Cliente pessoa física', '2025-11-03 23:02:38'),
(12, 'Consultoria ABC Ltda', '863.474.232-85', 'consultoria.abc.ltda@email.com', '(55) 21788-1849', 'Rua Exemplo, 475', 'Recife', 'PE', '60224-961', 'Cliente empresarial', '2025-11-03 23:02:38'),
(13, 'Patricia Fernandes', '447.773.501-80', 'patricia.fernandes@email.com', '(77) 82158-1210', 'Rua Exemplo, 799', 'Manaus', 'AM', '43206-969', 'Cliente pessoa física', '2025-11-03 23:02:38'),
(14, 'Francisco Gomes', '300.567.811-51', 'francisco.gomes@email.com', '(81) 16138-8874', 'Rua Exemplo, 200', 'Goiânia', 'GO', '62435-402', 'Cliente pessoa física', '2025-11-03 23:02:38'),
(15, 'Isabela Rodrigues', '683.307.440-48', 'isabela.rodrigues@email.com', '(50) 12315-6978', 'Rua Exemplo, 349', 'Vitória', 'ES', '65299-427', 'Cliente pessoa física', '2025-11-03 23:02:38'),
(16, 'Escritório Legal & Cia', '246.535.457-77', 'escritório.legal.&.cia@email.com', '(53) 90590-1335', 'Rua Exemplo, 323', 'Florianópolis', 'SC', '55322-536', 'Cliente empresarial', '2025-11-03 23:02:38'),
(17, 'Marcos Vinícius Lima', '174.123.357-01', 'marcos.vinícius.lima@email.com', '(74) 57055-4069', 'Rua Exemplo, 97', 'Natal', 'RN', '21039-549', 'Cliente pessoa física', '2025-11-03 23:02:38'),
(18, 'Juliana Castro', '816.136.262-08', 'juliana.castro@email.com', '(35) 75527-3136', 'Rua Exemplo, 528', 'João Pessoa', 'PB', '31189-184', 'Cliente pessoa física', '2025-11-03 23:02:38');

-- Tabela: dispositivos
DROP TABLE IF EXISTS `dispositivos`;
CREATE TABLE `dispositivos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cliente_id` int NOT NULL,
  `categoria_id` int NOT NULL,
  `marca` varchar(50) NOT NULL,
  `modelo` varchar(100) NOT NULL,
  `numero_serie` varchar(100) DEFAULT NULL,
  `especificacoes` text,
  `data_cadastro` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`cliente_id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `dispositivos_ibfk_45` FOREIGN KEY (`cliente_id`) REFERENCES `clientes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `dispositivos_ibfk_46` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_dispositivos` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela dispositivos
INSERT INTO `dispositivos` VALUES
(1, 4, 6, 'Genérico', 'Genérico Monitor 82', 'SN1762200158179851', 'Especificações padrão', '2024-11-21 19:46:41'),
(2, 5, 7, 'Genérico', 'Genérico Roteador 93', 'SN176220015822171', 'Especificações padrão', '2025-10-27 22:19:20'),
(3, 6, 3, 'HP', 'HP Desktop 64', 'SN1762200158265515', 'Especificações padrão', '2024-11-01 01:25:38'),
(4, 7, 5, 'HP', 'HP Impressora 95', 'SN1762200158305867', 'Especificações padrão', '2024-01-24 18:55:20'),
(5, 8, 1, 'Samsung', 'Samsung Smartphone 32', 'SN1762200158349128', 'Especificações padrão', '2024-04-20 05:06:36'),
(6, 9, 1, 'Samsung', 'Samsung Smartphone 60', 'SN1762200158383631', 'Especificações padrão', '2024-02-19 05:23:41'),
(7, 9, 5, 'Canon', 'Canon Impressora 82', 'SN1762200158404719', 'Especificações padrão', '2025-08-28 01:11:00'),
(8, 9, 7, 'Genérico', 'Genérico Roteador 58', 'SN1762200158424585', 'Especificações padrão', '2024-03-31 22:28:35'),
(9, 10, 2, 'HP', 'HP Notebook 24', 'SN176220015846312', 'Especificações padrão', '2024-09-16 10:33:49'),
(10, 10, 6, 'Genérico', 'Genérico Monitor 97', 'SN1762200158483806', 'Especificações padrão', '2025-08-26 17:14:47'),
(11, 11, 5, 'HP', 'HP Impressora 12', 'SN1762200158540848', 'Especificações padrão', '2024-11-12 14:23:56'),
(12, 12, 4, 'Lenovo', 'Lenovo Tablet 76', 'SN1762200158584587', 'Especificações padrão', '2025-04-27 08:05:02'),
(13, 12, 4, 'Apple', 'Apple Tablet 71', 'SN1762200158604241', 'Especificações padrão', '2025-09-12 23:04:54'),
(14, 12, 5, 'Epson', 'Epson Impressora 78', 'SN1762200158625460', 'Especificações padrão', '2024-03-26 02:48:02'),
(15, 13, 6, 'Genérico', 'Genérico Monitor 48', 'SN1762200158665404', 'Especificações padrão', '2024-12-08 05:26:39'),
(16, 14, 3, 'Acer', 'Acer Desktop 3', 'SN1762200158704380', 'Especificações padrão', '2024-06-23 01:36:27'),
(17, 14, 3, 'Dell', 'Dell Desktop 97', 'SN1762200158727520', 'Especificações padrão', '2025-08-04 16:50:32'),
(18, 14, 5, 'Canon', 'Canon Impressora 37', 'SN1762200158746161', 'Especificações padrão', '2025-05-07 06:13:18'),
(19, 15, 3, 'HP', 'HP Desktop 75', 'SN176220015878445', 'Especificações padrão', '2025-06-02 17:00:02'),
(20, 15, 7, 'Genérico', 'Genérico Roteador 54', 'SN1762200158803933', 'Especificações padrão', '2024-12-19 23:00:01'),
(21, 15, 2, 'Asus', 'Asus Notebook 98', 'SN176220015882290', 'Especificações padrão', '2025-04-07 00:30:01'),
(22, 16, 3, 'Dell', 'Dell Desktop 52', 'SN1762200158864269', 'Especificações padrão', '2025-02-10 13:52:27'),
(23, 16, 7, 'Genérico', 'Genérico Roteador 28', 'SN1762200158881934', 'Especificações padrão', '2025-09-22 23:12:19'),
(24, 17, 4, 'Samsung', 'Samsung Tablet 87', 'SN176220015891738', 'Especificações padrão', '2025-09-22 15:52:20'),
(25, 17, 7, 'Genérico', 'Genérico Roteador 90', 'SN1762200158934948', 'Especificações padrão', '2025-07-01 18:51:18'),
(26, 17, 3, 'Dell', 'Dell Desktop 5', 'SN1762200158951353', 'Especificações padrão', '2025-01-31 09:44:53'),
(27, 18, 1, 'Xiaomi', 'Xiaomi Smartphone 46', 'SN1762200158990940', 'Especificações padrão', '2024-09-20 00:01:48'),
(28, 18, 1, 'Xiaomi', 'Xiaomi Smartphone 76', 'SN1762200159010178', 'Especificações padrão', '2024-03-23 01:46:01'),
(29, 4, 4, 'Apple', 'Apple Tablet 5', 'SN1762200246281251', 'Especificações padrão', '2025-09-20 22:00:56'),
(30, 4, 5, 'HP', 'HP Impressora 21', 'SN1762200246306157', 'Especificações padrão', '2024-10-29 14:46:31'),
(31, 4, 4, 'Samsung', 'Samsung Tablet 58', 'SN1762200246327765', 'Especificações padrão', '2025-04-24 07:25:23'),
(32, 5, 5, 'Canon', 'Canon Impressora 10', 'SN1762200246350708', 'Especificações padrão', '2025-06-07 23:32:24'),
(33, 6, 7, 'Genérico', 'Genérico Roteador 74', 'SN1762200246378412', 'Especificações padrão', '2024-11-08 07:45:55'),
(34, 6, 6, 'Genérico', 'Genérico Monitor 45', 'SN1762200246401653', 'Especificações padrão', '2025-04-13 13:34:54'),
(35, 6, 2, 'Dell', 'Dell Notebook 57', 'SN1762200246419960', 'Especificações padrão', '2025-09-09 17:27:17'),
(36, 7, 2, 'Dell', 'Dell Notebook 82', 'SN1762200246446808', 'Especificações padrão', '2024-01-30 07:06:26'),
(37, 7, 3, 'Dell', 'Dell Desktop 1', 'SN1762200246465481', 'Especificações padrão', '2025-01-16 13:14:17'),
(38, 7, 7, 'Genérico', 'Genérico Roteador 67', 'SN1762200246487145', 'Especificações padrão', '2025-03-22 23:36:36'),
(39, 8, 5, 'HP', 'HP Impressora 4', 'SN1762200246518671', 'Especificações padrão', '2024-10-03 09:13:32'),
(40, 9, 7, 'Genérico', 'Genérico Roteador 77', 'SN1762200246551332', 'Especificações padrão', '2025-06-30 02:46:47'),
(41, 10, 7, 'Genérico', 'Genérico Roteador 28', 'SN176220024657768', 'Especificações padrão', '2024-08-30 18:18:30'),
(42, 10, 3, 'Dell', 'Dell Desktop 69', 'SN1762200246598118', 'Especificações padrão', '2024-01-28 20:58:50'),
(43, 11, 2, 'Lenovo', 'Lenovo Notebook 1', 'SN176220024662618', 'Especificações padrão', '2024-11-07 14:33:31'),
(44, 12, 2, 'Lenovo', 'Lenovo Notebook 18', 'SN1762200246666639', 'Especificações padrão', '2024-08-15 16:42:13'),
(45, 12, 1, 'Apple', 'Apple Smartphone 80', 'SN1762200246699752', 'Especificações padrão', '2025-07-01 21:55:04'),
(46, 12, 1, 'Samsung', 'Samsung Smartphone 41', 'SN176220024672944', 'Especificações padrão', '2025-05-29 10:45:58'),
(47, 13, 3, 'Dell', 'Dell Desktop 9', 'SN1762200246764245', 'Especificações padrão', '2025-06-12 14:13:39'),
(48, 13, 2, 'Asus', 'Asus Notebook 18', 'SN1762200246789527', 'Especificações padrão', '2024-06-12 17:36:47'),
(49, 13, 3, 'Acer', 'Acer Desktop 19', 'SN1762200246815889', 'Especificações padrão', '2025-04-17 15:06:46'),
(50, 14, 6, 'Genérico', 'Genérico Monitor 97', 'SN1762200246845922', 'Especificações padrão', '2024-05-03 02:30:28'),
(51, 14, 6, 'Genérico', 'Genérico Monitor 96', 'SN1762200246866142', 'Especificações padrão', '2025-07-30 17:31:02'),
(52, 15, 5, 'HP', 'HP Impressora 44', 'SN1762200246892587', 'Especificações padrão', '2025-02-14 18:21:55'),
(53, 15, 2, 'Asus', 'Asus Notebook 31', 'SN1762200246915795', 'Especificações padrão', '2024-10-23 00:26:30'),
(54, 16, 5, 'HP', 'HP Impressora 91', 'SN1762200246936517', 'Especificações padrão', '2024-11-18 22:06:21'),
(55, 16, 2, 'Asus', 'Asus Notebook 58', 'SN1762200246958355', 'Especificações padrão', '2024-11-12 13:24:21'),
(56, 17, 6, 'Genérico', 'Genérico Monitor 43', 'SN1762200246988282', 'Especificações padrão', '2025-01-22 11:07:35'),
(57, 17, 1, 'Motorola', 'Motorola Smartphone 53', 'SN1762200247010277', 'Especificações padrão', '2024-01-30 12:29:38'),
(58, 18, 7, 'Genérico', 'Genérico Roteador 25', 'SN1762200247037473', 'Especificações padrão', '2024-03-30 04:50:31'),
(59, 18, 7, 'Genérico', 'Genérico Roteador 73', 'SN1762200247063109', 'Especificações padrão', '2024-08-02 11:07:16'),
(60, 18, 6, 'Genérico', 'Genérico Monitor 84', 'SN1762200247098769', 'Especificações padrão', '2024-10-25 12:35:58'),
(61, 5, 1, 'Samsung', 'A34', '', NULL, '2025-11-04 01:36:52');

-- Tabela: entrada_estoque
DROP TABLE IF EXISTS `entrada_estoque`;
CREATE TABLE `entrada_estoque` (
  `id` int NOT NULL AUTO_INCREMENT,
  `peca_id` int NOT NULL,
  `fornecedor_id` int DEFAULT NULL,
  `usuario_id` int NOT NULL,
  `quantidade` int NOT NULL,
  `preco_unitario` decimal(10,2) DEFAULT NULL,
  `numero_nota` varchar(50) DEFAULT NULL,
  `data_entrada` datetime DEFAULT CURRENT_TIMESTAMP,
  `observacoes` text,
  PRIMARY KEY (`id`),
  KEY `peca_id` (`peca_id`),
  KEY `fornecedor_id` (`fornecedor_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `entrada_estoque_ibfk_1` FOREIGN KEY (`peca_id`) REFERENCES `pecas` (`id`),
  CONSTRAINT `entrada_estoque_ibfk_2` FOREIGN KEY (`fornecedor_id`) REFERENCES `fornecedores` (`id`),
  CONSTRAINT `entrada_estoque_ibfk_3` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela entrada_estoque está vazia

-- Tabela: fornecedores
DROP TABLE IF EXISTS `fornecedores`;
CREATE TABLE `fornecedores` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `cnpj` varchar(18) DEFAULT NULL,
  `contato` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `endereco` text,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL,
  `cep` varchar(10) DEFAULT NULL,
  `site` varchar(200) DEFAULT NULL,
  `observacoes` text,
  `ativo` tinyint(1) DEFAULT '1',
  `data_cadastro` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `cnpj` (`cnpj`),
  UNIQUE KEY `cnpj_2` (`cnpj`),
  UNIQUE KEY `cnpj_3` (`cnpj`),
  UNIQUE KEY `cnpj_4` (`cnpj`),
  UNIQUE KEY `cnpj_5` (`cnpj`),
  UNIQUE KEY `cnpj_6` (`cnpj`),
  UNIQUE KEY `cnpj_7` (`cnpj`),
  UNIQUE KEY `cnpj_8` (`cnpj`),
  UNIQUE KEY `cnpj_9` (`cnpj`),
  UNIQUE KEY `cnpj_10` (`cnpj`),
  UNIQUE KEY `cnpj_11` (`cnpj`),
  UNIQUE KEY `cnpj_12` (`cnpj`),
  UNIQUE KEY `cnpj_13` (`cnpj`),
  UNIQUE KEY `cnpj_14` (`cnpj`),
  UNIQUE KEY `cnpj_15` (`cnpj`),
  UNIQUE KEY `cnpj_16` (`cnpj`),
  UNIQUE KEY `cnpj_17` (`cnpj`),
  UNIQUE KEY `cnpj_18` (`cnpj`),
  UNIQUE KEY `cnpj_19` (`cnpj`),
  UNIQUE KEY `cnpj_20` (`cnpj`),
  UNIQUE KEY `cnpj_21` (`cnpj`),
  UNIQUE KEY `cnpj_22` (`cnpj`),
  UNIQUE KEY `cnpj_23` (`cnpj`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela fornecedores está vazia

-- Tabela: log_estoque
DROP TABLE IF EXISTS `log_estoque`;
CREATE TABLE `log_estoque` (
  `id` int NOT NULL AUTO_INCREMENT,
  `peca_id` int NOT NULL,
  `usuario_id` int NOT NULL,
  `tipo_movimento` enum('entrada','saida','ajuste','inventario') NOT NULL,
  `quantidade` int NOT NULL,
  `estoque_anterior` int NOT NULL,
  `estoque_atual` int NOT NULL,
  `referencia_id` int DEFAULT NULL,
  `referencia_tipo` varchar(50) DEFAULT NULL,
  `data_movimento` datetime DEFAULT CURRENT_TIMESTAMP,
  `observacoes` text,
  PRIMARY KEY (`id`),
  KEY `peca_id` (`peca_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `log_estoque_ibfk_1` FOREIGN KEY (`peca_id`) REFERENCES `pecas` (`id`),
  CONSTRAINT `log_estoque_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela log_estoque está vazia

-- Tabela: pecas
DROP TABLE IF EXISTS `pecas`;
CREATE TABLE `pecas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoria_id` int NOT NULL,
  `codigo` varchar(50) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  `marca` varchar(50) DEFAULT NULL,
  `modelo` varchar(100) DEFAULT NULL,
  `compatibilidade` text,
  `preco_custo` decimal(10,2) DEFAULT NULL,
  `preco_venda` decimal(10,2) DEFAULT NULL,
  `estoque_minimo` int DEFAULT '1',
  `estoque_atual` int DEFAULT '0',
  `localizacao` varchar(50) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `data_cadastro` datetime DEFAULT NULL,
  `ultimo_inventario` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `codigo` (`codigo`),
  UNIQUE KEY `codigo_2` (`codigo`),
  UNIQUE KEY `codigo_3` (`codigo`),
  UNIQUE KEY `codigo_4` (`codigo`),
  UNIQUE KEY `codigo_5` (`codigo`),
  UNIQUE KEY `codigo_6` (`codigo`),
  UNIQUE KEY `codigo_7` (`codigo`),
  UNIQUE KEY `codigo_8` (`codigo`),
  UNIQUE KEY `codigo_9` (`codigo`),
  UNIQUE KEY `codigo_10` (`codigo`),
  UNIQUE KEY `codigo_11` (`codigo`),
  UNIQUE KEY `codigo_12` (`codigo`),
  UNIQUE KEY `codigo_13` (`codigo`),
  UNIQUE KEY `codigo_14` (`codigo`),
  UNIQUE KEY `codigo_15` (`codigo`),
  UNIQUE KEY `codigo_16` (`codigo`),
  UNIQUE KEY `codigo_17` (`codigo`),
  UNIQUE KEY `codigo_18` (`codigo`),
  UNIQUE KEY `codigo_19` (`codigo`),
  UNIQUE KEY `codigo_20` (`codigo`),
  UNIQUE KEY `codigo_21` (`codigo`),
  UNIQUE KEY `codigo_22` (`codigo`),
  UNIQUE KEY `codigo_23` (`codigo`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `pecas_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias_pecas` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela pecas
INSERT INTO `pecas` VALUES
(1, 8, 'TEL-IP12', 'Tela iPhone 12', 'Peça original de qualidade', 'Apple', 'Tela iPhone 12', NULL, '270.00', '450.00', 5, 54, 'Prateleira 6', 1, '2025-11-03 23:02:39', NULL),
(2, 8, 'TEL-SS21', 'Tela Samsung S21', 'Peça original de qualidade', 'Samsung', 'Tela Samsung S21', NULL, '228.00', '380.00', 5, 49, 'Prateleira 1', 1, '2025-11-03 23:02:39', NULL),
(3, 8, 'TEL-NB15', 'Tela Notebook 15.6"', 'Peça original de qualidade', 'Genérico', 'Tela Notebook 15.6"', NULL, '150.00', '250.00', 5, 41, 'Prateleira 2', 1, '2025-11-03 23:02:39', NULL),
(4, 2, 'BAT-IP11', 'Bateria iPhone 11', 'Peça original de qualidade', 'Apple', 'Bateria iPhone 11', NULL, '72.00', '120.00', 5, 29, 'Prateleira 8', 1, '2025-11-03 23:02:39', NULL),
(5, 2, 'BAT-DELL', 'Bateria Notebook Dell', 'Peça original de qualidade', 'Dell', 'Bateria Notebook Dell', NULL, '108.00', '180.00', 5, 52, 'Prateleira 10', 1, '2025-11-03 23:02:39', NULL),
(6, 2, 'BAT-MG8', 'Bateria Motorola G8', 'Peça original de qualidade', 'Motorola', 'Bateria Motorola G8', NULL, '48.00', '80.00', 5, 36, 'Prateleira 6', 1, '2025-11-03 23:02:39', NULL),
(7, 9, 'RAM-8GB', 'RAM 8GB DDR4', 'Peça original de qualidade', 'Kingston', 'RAM 8GB DDR4', NULL, '90.00', '150.00', 5, 35, 'Prateleira 7', 1, '2025-11-03 23:02:39', NULL),
(8, 9, 'RAM-16GB', 'RAM 16GB DDR4', 'Peça original de qualidade', 'Corsair', 'RAM 16GB DDR4', NULL, '168.00', '280.00', 5, 44, 'Prateleira 2', 1, '2025-11-03 23:02:39', NULL),
(9, 4, 'SSD-240', 'SSD 240GB', 'Peça original de qualidade', 'Kingston', 'SSD 240GB', NULL, '120.00', '200.00', 5, 32, 'Prateleira 8', 1, '2025-11-03 23:02:39', NULL),
(10, 4, 'SSD-480', 'SSD 480GB', 'Peça original de qualidade', 'Samsung', 'SSD 480GB', NULL, '210.00', '350.00', 5, 37, 'Prateleira 10', 1, '2025-11-03 23:02:39', NULL),
(11, 4, 'HD-1TB', 'HD 1TB', 'Peça original de qualidade', 'Seagate', 'HD 1TB', NULL, '150.00', '250.00', 5, 15, 'Prateleira 5', 1, '2025-11-03 23:02:39', NULL),
(12, 11, 'CAB-HDMI', 'Cabo HDMI 2m', 'Peça original de qualidade', 'Genérico', 'Cabo HDMI 2m', NULL, '15.00', '25.00', 5, 45, 'Prateleira 6', 1, '2025-11-03 23:02:39', NULL),
(13, 11, 'MOU-USB', 'Mouse USB', 'Peça original de qualidade', 'Logitech', 'Mouse USB', NULL, '27.00', '45.00', 5, 35, 'Prateleira 7', 1, '2025-11-03 23:02:39', NULL),
(14, 12, 'COOL-CPU', 'Cooler para CPU', 'Peça original de qualidade', 'Cooler Master', 'Cooler para CPU', NULL, '48.00', '80.00', 5, 35, 'Prateleira 4', 1, '2025-11-03 23:02:39', NULL);

-- Tabela: pecas_usadas
DROP TABLE IF EXISTS `pecas_usadas`;
CREATE TABLE `pecas_usadas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chamado_id` int NOT NULL,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  `numero_serie` varchar(50) DEFAULT NULL,
  `garantia` varchar(50) DEFAULT NULL,
  `valor` decimal(10,2) NOT NULL,
  `data_utilizacao` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chamado_id` (`chamado_id`),
  CONSTRAINT `pecas_usadas_ibfk_1` FOREIGN KEY (`chamado_id`) REFERENCES `chamados` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Tabela pecas_usadas está vazia

-- Tabela: prioridades
DROP TABLE IF EXISTS `prioridades`;
CREATE TABLE `prioridades` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `descricao` text,
  `cor` varchar(7) DEFAULT '#000000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela prioridades
INSERT INTO `prioridades` VALUES
(1, 'Baixa', 'Problema não crítico', '#00FF00'),
(2, 'Média', 'Problema com impacto moderado', '#FFFF00'),
(3, 'Alta', 'Problema crítico que precisa de atenção imediata', '#FF0000'),
(5, 'Crítica', 'Emergência', '#dc3545');

-- Tabela: servicos
DROP TABLE IF EXISTS `servicos`;
CREATE TABLE `servicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `descricao` text,
  `valor_base` decimal(10,2) NOT NULL,
  `tempo_estimado` int DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela servicos
INSERT INTO `servicos` VALUES
(1, 'Manutenção Preventiva', 'Limpeza e verificação geral do equipamento', '50.00', 60, 1),
(2, 'Formatação e Reinstalação', 'Formatação completa e reinstalação do sistema operacional', '80.00', 120, 1),
(3, 'Troca de Tela', 'Substituição da tela quebrada ou danificada', '150.00', 90, 1),
(4, 'Troca de Bateria', 'Substituição da bateria do dispositivo', '70.00', 30, 1),
(5, 'Recuperação de Dados', 'Recuperação de arquivos perdidos ou corrompidos', '200.00', 180, 1),
(6, 'Formatação', 'Reinstalação do SO', '80.00', 120, 1),
(7, 'Upgrade de Hardware', 'Instalação de componentes', '60.00', 45, 1),
(8, 'Remoção de Vírus', 'Limpeza de malware', '90.00', 90, 1),
(9, 'Configuração de Rede', 'Setup de rede', '100.00', 60, 1),
(10, 'Backup de Dados', 'Backup completo', '50.00', 120, 1),
(11, 'Instalação de Software', 'Instalação de programas', '40.00', 30, 1);

-- Tabela: status_chamados
DROP TABLE IF EXISTS `status_chamados`;
CREATE TABLE `status_chamados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `descricao` text,
  `cor` varchar(7) DEFAULT '#000000',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela status_chamados
INSERT INTO `status_chamados` VALUES
(1, 'Aberto', 'Chamado recém-criado, aguardando triagem', '#FF0000'),
(2, 'Em análise', 'Chamado em análise pelo técnico', '#FFA500'),
(3, 'Aguardando aprovação', 'Orçamento enviado, aguardando aprovação do cliente', '#FFFF00'),
(4, 'Em andamento', 'Serviço em execução', '#0000FF'),
(5, 'Aguardando peça', 'Serviço aguardando chegada de peça', '#800080'),
(6, 'Concluído', 'Serviço finalizado', '#008000'),
(7, 'Cancelado', 'Chamado cancelado', '#808080'),
(12, 'Entregue', 'Dispositivo entregue ao cliente após conclusão do serviço', '#28a745');

-- Tabela: tecnicos
DROP TABLE IF EXISTS `tecnicos`;
CREATE TABLE `tecnicos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `especialidade` varchar(100) DEFAULT NULL,
  `disponivel` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `tecnicos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela tecnicos
INSERT INTO `tecnicos` VALUES
(1, 6, 'Hardware', 1),
(2, 7, 'Software', 1),
(3, 8, 'Redes', 1),
(4, 9, 'Smartphones', 1),
(5, 10, 'Notebooks', 1);

-- Tabela: usuarios
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `cargo` varchar(50) NOT NULL,
  `ativo` tinyint(1) DEFAULT '1',
  `data_criacao` datetime DEFAULT NULL,
  `ultimo_acesso` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `email_2` (`email`),
  UNIQUE KEY `email_3` (`email`),
  UNIQUE KEY `email_4` (`email`),
  UNIQUE KEY `email_5` (`email`),
  UNIQUE KEY `email_6` (`email`),
  UNIQUE KEY `email_7` (`email`),
  UNIQUE KEY `email_8` (`email`),
  UNIQUE KEY `email_9` (`email`),
  UNIQUE KEY `email_10` (`email`),
  UNIQUE KEY `email_11` (`email`),
  UNIQUE KEY `email_12` (`email`),
  UNIQUE KEY `email_13` (`email`),
  UNIQUE KEY `email_14` (`email`),
  UNIQUE KEY `email_15` (`email`),
  UNIQUE KEY `email_16` (`email`),
  UNIQUE KEY `email_17` (`email`),
  UNIQUE KEY `email_18` (`email`),
  UNIQUE KEY `email_19` (`email`),
  UNIQUE KEY `email_20` (`email`),
  UNIQUE KEY `email_21` (`email`),
  UNIQUE KEY `email_22` (`email`),
  UNIQUE KEY `email_23` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dados da tabela usuarios
INSERT INTO `usuarios` VALUES
(1, 'Administrador', 'admin@sistema.com', '$2a$10$JfGj1Gm/eIN6KsZy.vU4s.XTCi9tPQbJ.3eFhnUjC8GIlxAQ6K24O', 'Administrador', 1, '2025-09-15 16:35:28', NULL),
(2, 'Administrador', 'admin@gert.com', '$2a$10$rZX7z.rsxaowCsgTxXuAQ.DLsd1BzW1UeUv24kRUux7GdPqn8pQ.W', 'admin', 1, '2025-09-15 18:40:35', '2025-11-04 01:34:23'),
(3, 'Ana Silva', 'atendente1@gert.com', '$2a$10$pq3uCXTrcf9uRfW1d6rTvOwuZ09sfWIci4ZW18a6XpJe/loII7EtO', 'Atendente', 1, '2025-11-03 23:02:37', NULL),
(4, 'Carlos Santos', 'atendente2@gert.com', '$2a$10$D2kUxbRlzvaFEttFXvR97uArc6OyI/CqtYurTvyUH8Z9gvavFbjea', 'Atendente', 1, '2025-11-03 23:02:37', NULL),
(5, 'Mariana Costa', 'atendente3@gert.com', '$2a$10$DxpbrxxgFHDlsUt3ZRcwjO9j786iNf8hwxg2NYiaJ/GNssAUKS3U2', 'Atendente', 1, '2025-11-03 23:02:37', NULL),
(6, 'João Oliveira', 'joao@gert.com', '$2a$10$xb18lolIoxZ3FrRV4XjZLuqIlL.QIuBq8Y5UaPWhtPF/Euk22I34G', 'Técnico', 1, '2025-11-03 23:02:37', NULL),
(7, 'Maria Santos', 'maria@gert.com', '$2a$10$GUZDqcEXVePX6MZBMW9eNeyRRS.n/mcdvwoxrYwOUiHYCW5NU70Mm', 'Técnico', 1, '2025-11-03 23:02:37', NULL),
(8, 'Pedro Lima', 'pedro@gert.com', '$2a$10$cB551p6xYFBOmv6/zNjn5uLFW6hoxeRX8.SvCbCTGe2ZaMI1VDFGa', 'Técnico', 1, '2025-11-03 23:02:37', NULL),
(9, 'Julia Ferreira', 'julia@gert.com', '$2a$10$viacktn70.vH1QjipUAvZuJ6bhtPGlC8hCo10rJRd5MC9sg25hHii', 'Técnico', 1, '2025-11-03 23:02:37', NULL),
(10, 'Lucas Rodrigues', 'lucas@gert.com', '$2a$10$kiHojLnGISkliNq4SDZtXuCMpVqt.9R8tzZwE9IX7tZbU.ov/cbHi', 'Técnico', 1, '2025-11-03 23:02:38', NULL);


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

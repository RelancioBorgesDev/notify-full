# Sistema de Notificação

Este projeto é um sistema de notificação assíncrono e escalável, desenvolvido com [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/) e filas de mensagens (RabbitMQ ou Kafka).
Ele oferece envio de notificações por **e-mail**, **SMS** e **push**, com suporte a **priorização**, **retries automáticos** e **Dead Letter Queue (DLQ)** para mensagens que falharem após o número máximo de tentativas.

## Sumário

- [Sistema de Notificação](#sistema-de-notificação)
  - [Sumário](#sumário)
  - [Visão Geral](#visão-geral)
  - [Arquitetura](#arquitetura)
  - [Tecnologias Utilizadas](#tecnologias-utilizadas)
  - [Configuração do Ambiente](#configuração-do-ambiente)
  - [Execução](#execução)
  - [Testes](#testes)
  - [Migrations e Prisma](#migrations-e-prisma)
  - [Contribuição](#contribuição)

---

## Visão Geral

O **Sistema de Notificação** permite o envio de mensagens de forma confiável e tolerante a falhas, integrando-se facilmente a outros sistemas.

Principais recursos:

- Envio de notificações via e-mail, SMS e push.
- Filas para processamento assíncrono com suporte a priorização.
- Retentativas automáticas (retry logic).
- Dead Letter Queue (DLQ) para mensagens que não puderem ser entregues.
- Arquitetura modular com **use cases** e **controllers**, seguindo princípios de **Clean Architecture**.

---

## Arquitetura

A arquitetura é composta por:

- **Domain Layer**: Entidades, regras de negócio e casos de uso.
- **Infra Layer**: Integrações externas (ex.: Nodemailer, provedores SMS, push).
- **Application Layer**: Controladores HTTP/REST para comunicação externa.
- **Mensageria**: Fila para processamento assíncrono (RabbitMQ ou Kafka).
- **Banco de Dados**: Prisma ORM para persistência e auditoria.

---

## Tecnologias Utilizadas

- **Backend**: [NestJS](https://nestjs.com/)
- **Banco de Dados**: [Prisma](https://www.prisma.io/) com PostgreSQL
- **Mensageria**: RabbitMQ ou Kafka
- **Envio de E-mails**: Nodemailer
- **Containerização**: Docker e Docker Compose
- **Testes Automatizados**: [Jest](https://jestjs.io/)

---

## Configuração do Ambiente

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-usuario/sistema-notificacao.git
   ```

2. Acesse a pasta do projeto:

   ```bash
   cd sistema-notificacao
   ```

3. Instale as dependências:

   ```bash
   npm install
   ```

4. Configure as variáveis de ambiente no arquivo `.env`:

   ```env
   DATABASE_URL=postgresql://user:pass@localhost:5432/notifications
   RABBITMQ_URL=amqp://localhost
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=user@example.com
   SMTP_PASS=secret
   ```

5. Execute as migrações do Prisma:

   ```bash
   npx prisma migrate dev
   ```

6. Inicie os containers (banco, mensageria etc.):

   ```bash
   docker-compose up -d
   ```

---

## Execução

- Ambiente de desenvolvimento:

  ```bash
  npm run start:dev
  ```

- Ambiente de produção:

  ```bash
  npm run start:prod
  ```

---

## Testes

- Testes unitários:

  ```bash
  npm run test
  ```

- Testes de integração (e2e):

  ```bash
  npm run test:e2e
  ```

- Cobertura de testes:

  ```bash
  npm run test:cov
  ```

---

## Migrations e Prisma

Criar nova migração:

```bash
npx prisma migrate dev --name nome-da-migracao
```

Aplicar migrações pendentes:

```bash
npx prisma migrate deploy
```

---

## Contribuição

Contribuições são bem-vindas!
Você pode abrir _issues_ para reportar bugs ou enviar _pull requests_ com melhorias.

---

# Survey API 📋

API para gestão e participação em pesquisas em tempo real. O projeto foca em padrões de arquitetura limpa, alta disponibilidade de dados com Redis e segurança via RBAC.

## 🚀 Tecnologias
- **Node.js** & **Fastify**
- **TypeScript** & **Zod**
- **Prisma ORM** (PostgreSQL)
- **Redis** (Cache de resultados)
- **Docker** & **Swagger**

## 📝 Requisitos Funcionais (RFs)
- [x] Cadastro e autenticação de usuários.
- [ ] Obter perfil do usuário logado.
- [x] Listagem paginada de pesquisas abertas.
- [x] Criação de pesquisas (Coordenadores).
- [x] Listagem de pesquisas criadas pelo coordenador.
- [x] Visualização de resultados detalhados (votos e porcentagens).
- [x] Sistema de votação (voto único por usuário).
- [x] Alteração de status da pesquisa (DRAFT, OPEN, CLOSED).

## ⚖️ Regras de Negócio (RNs)
- [x] O usuário não deve poder se cadastrar com um e-mail duplicado.
- [x] Pesquisas devem ter entre 1 e 10 perguntas, e cada pergunta entre 1 e 5 opções.
- [x] Votos são permitidos apenas em pesquisas com status "OPEN".
- [x] Um usuário não pode votar mais de uma vez na mesma pesquisa.
- [x] Apenas o coordenador criador pode alterar o status ou ver resultados detalhados.
- [x] Resultados são cacheados por 60s e invalidados automaticamente a cada novo voto.

## ⚙️ Requisitos Não Funcionais (RNFs)
- [x] Senhas criptografadas com bcrypt.
- [x] Persistência em PostgreSQL e cache em Redis.
- [x] Paginação fixa de 20 itens por página em todas as listagens.
- [x] Autenticação via JWT (JSON Web Token).
- [x] Documentação interativa via Swagger.

## 🛠️ Como rodar o projeto

### Pré-requisitos
- Docker e Docker Compose instalados.
- Node.js (versão LTS recomendada).

### Passo a passo
1. **Clone o repositório:**
```bash
git clone https://github.com/CleversonCSousa/survey.git
```
2. **Instale as dependências:**
```bash
npm install
```

3. **Configure as variáveis de ambiente:**
Crie um arquivo .env na raiz do projeto e preencha com base no .env.example.

4. **Suba os serviços (Banco de Dados e Redis):**
```bash
docker-compose up -d
```
5. **Rode as migrations do Prisma:**
```bash
npx prisma migrate dev
```
6. **Rodar o projeto:**
```bash
npm run dev
```

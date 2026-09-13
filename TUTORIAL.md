# Guia Completo de Execução e Operação — Arruda Móveis Eletro

Este documento descreve o passo a passo para inicializar, visualizar e operar o sistema completo (Backend FastAPI + Frontend Next.js).

---

## 1. Pré-requisitos

* **Python 3.11+**
* **Node.js 18+** e **npm**
* *(Opcional)* **Docker & Docker Compose**

---

## 2. Inicialização Rápida (Ambiente Local)

Abra dois terminais (um para o Backend e outro para o Frontend).

### Terminal 1: Backend (FastAPI)

```bash
# 1. Acesse o diretório do backend
cd backend

# 2. Instale as dependências (se ainda não instalou)
pip install -r requirements.txt

# 3. Execute a carga de dados inicial (cria tabelas, admin e produtos mock)
python ../scripts/seed_data.py

# 4. Inicie o servidor da API
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
* **Swagger API Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
* **Health Check**: [http://localhost:8000/health](http://localhost:8000/health)

---

### Terminal 2: Frontend (Next.js 14)

```bash
# 1. Acesse o diretório do frontend
cd frontend

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev
```
* **Landing Page / Home**: [http://localhost:3000](http://localhost:3000)

---

## 3. Inicialização via Docker Compose

Se preferir rodar toda a infraestrutura em containers:

```bash
# Na raiz do projeto:
docker-compose up --build -d

# Executar carga de dados dentro do container:
docker-compose exec backend python ../scripts/seed_data.py
```

---

## 4. Credenciais de Acesso Administrativo

* **URL de Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
* **Painel Dashboard**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
* **E-mail**: `admin@arrudamoveis.com.br`
* **Senha**: `ArrudaAdmin2026!` (ou `admin123456` para ambiente de testes unitários)

---

## 5. Rotas Públicas do Frontend

| Rota | Descrição |
|---|---|
| `http://localhost:3000/` | **Landing Page Comercial** com Banner, Departamentos, Ofertas e Destaques |
| `http://localhost:3000/catalogo` | **Catálogo Completo** com busca, ordenação por preço e filtros por departamento |
| `http://localhost:3000/ofertas` | **Página de Ofertas Promocionais** com descontos e contagem |
| `http://localhost:3000/categoria/moveis-para-sala` | **Listagem por Departamento** |
| `http://localhost:3000/produto/sofa-retratil-reclinavel-3-lugares-veludo` | **Página de Detalhe do Produto** com galeria, ficha técnica e botão de conversão WhatsApp |
| `http://localhost:3000/robots.txt` | **SEO**: Diretivas de indexação para motores de busca |
| `http://localhost:3000/sitemap.xml` | **SEO**: Mapa do site gerado dinamicamente |

---

## 6. Principais Endpoints da API REST Backend

| Método | Endpoint | Proteção | Descrição |
|---|---|:---:|---|
| `GET` | `/health` | Pública | Status da API |
| `POST` | `/api/v1/auth/login` | Pública | Autenticação JWT |
| `GET` | `/api/v1/auth/me` | Autenticado | Dados do usuário logado |
| `POST` | `/api/v1/auth/users` | Admin | Cadastro de novos usuários internos |
| `GET` | `/api/v1/categories` | Pública | Listagem de departamentos |
| `GET` | `/api/v1/products` | Pública | Listagem pública e catálogo com filtros |
| `POST` | `/api/v1/products` | Gerente/Admin | Criação de produto |
| `GET` | `/api/v1/products/{id}` | Pública | Detalhes do produto |
| `POST` | `/api/v1/media/upload` | Operador/Admin | Upload de fotos (conversão WebP + thumb) |
| `GET` | `/api/v1/offers/active` | Pública | Ofertas ativas vigentes |
| `POST` | `/api/v1/analytics/events` | Pública | Rastreamento de cliques e conversões WhatsApp |
| `GET` | `/api/v1/analytics/dashboard` | Gerente/Admin | Métricas de conversão e produtos mais clicados |
| `GET` | `/api/v1/admin/audit-logs` | Admin | Histórico de auditoria de alterações |

---

## 7. Scripts Operacionais

* **Carga Inicial de Dados:**
  ```bash
  python scripts/seed_data.py
  ```
* **Gerar Backup do Sistema:**
  ```bash
  python scripts/backup.py
  ```
* **Restaurar Backup do Sistema:**
  ```bash
  python scripts/restore.py backups/arruda_backup_NOME_DO_ARQUIVO.tar.gz
  ```
* **Executar Suíte Completa de Testes:**
  ```bash
  cd backend && python -m pytest tests/ -v
  ```

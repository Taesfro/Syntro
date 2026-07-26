# Syntro — Don't Give Up

Jogo curto que transforma o que a pessoa está sentindo em uma jornada narrativa gerada por IA.

## Como funciona

- `index.html` — todo o site (visual, jogo, pixel art).
- `api/generate-story.js` — função serverless (roda no servidor da Vercel) que chama a API da Anthropic.

A chave da API **nunca** fica no navegador: o `index.html` chama `/api/generate-story`, e é essa função,
rodando no servidor, quem conversa com a Anthropic usando a variável de ambiente `ANTHROPIC_API_KEY`.

## 1. Pegue sua chave de API da Anthropic

1. Acesse https://console.anthropic.com
2. Vá em **API Keys** → **Create Key**
3. Copie a chave (começa com `sk-ant-...`) — você vai usá-la só no passo 3, nunca no código.

## 2. Suba o projeto para o GitHub

Dentro da pasta do projeto (onde estão `index.html`, `api/`, etc.):

```bash
git init
git add .
git commit -m "Syntro: site com IA integrada"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git
git push -u origin main
```

Se o repositório já existe no GitHub, troque a URL do `remote add` pela dele. Se você já tem um projeto
git existente, é só copiar os arquivos `index.html`, a pasta `api/`, `package.json`, `.gitignore` e
`.env.example` para dentro dele antes do commit.

## 3. Deploy na Vercel

1. Acesse https://vercel.com e faça login com sua conta do GitHub.
2. Clique em **Add New → Project** e selecione o repositório que você acabou de subir.
3. Antes de clicar em Deploy, abra **Environment Variables** e adicione:
   - **Name**: `ANTHROPIC_API_KEY`
   - **Value**: a chave que você copiou no passo 1
4. Clique em **Deploy**.

Pronto — a Vercel detecta automaticamente o `index.html` como site estático e a pasta `api/` como
funções serverless. Em ~1 minuto você terá uma URL tipo `https://seu-projeto.vercel.app` já com a
história funcionando de verdade.

### Se você mudar a chave depois

Vá em **Project → Settings → Environment Variables** na Vercel, atualize o valor e clique em
**Redeploy** (aba Deployments → menu "..." → Redeploy) para a mudança valer.

## Testar localmente (opcional)

```bash
npm i -g vercel
cp .env.example .env   # e coloque sua chave real no .env
vercel dev
```

Isso sobe o site em `http://localhost:3000` já com a função `/api/generate-story` funcionando.

## Custos

Cada história gerada consome tokens da API da Anthropic (cobrados na sua conta do console.anthropic.com,
por uso). O modelo usado é o `claude-sonnet-5`. Se quiser reduzir custo, você pode trocar para um modelo
mais barato editando a linha `model:` em `api/generate-story.js` (ex.: `claude-haiku-4-5-20251001`).

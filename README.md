# Colégio Portal Seguro: site de validação (v0.4)

Site estático (HTML, CSS e JavaScript), sem dependências e sem passo de compilação.
Serve para os donos do colégio verem e validarem o design. **Os formulários não enviam dados.**

## Páginas
| Ficheiro | Conteúdo |
|---|---|
| `index.html` | Início |
| `colegio.html` | O colégio |
| `oferta-educativa.html` | Oferta educativa |
| `vida-escolar.html` | Vida escolar (galeria) |
| `pre-inscricao.html` | Ficha de pré-inscrição em 4 passos |
| `contactos.html` | Contactos e pedido de informações |
| `obrigado.html` | Página de agradecimento (aparece depois de enviar um formulário) |
| `privacidade.html` | Rascunho da política de privacidade |

## Publicar no GitHub Pages
1. Crie um repositório novo no GitHub (por exemplo `portal-seguro`).
2. Envie para a **raiz** do repositório o conteúdo desta pasta (os ficheiros `.html`, a pasta `assets` e o `.nojekyll`).
3. No repositório: **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save**.
4. Ao fim de 1 a 2 minutos o site fica em `https://SEU-UTILIZADOR.github.io/portal-seguro/`.

Todos os endereços internos são relativos, por isso o site funciona tanto na raiz como numa subpasta.

## Antes de partilhar o link
- Para a pré-visualização aparecer bem no WhatsApp, substitua em todos os ficheiros `.html` o texto
  `https://SEU-UTILIZADOR.github.io/NOME-DO-REPOSITORIO/` pelo endereço real do site (pesquisar e substituir em todos os ficheiros).
- As páginas têm `noindex` para o Google não as listar. Remova essa linha quando o site for publicado a sério.
- As fontes (Gabarito e Atkinson Hyperlegible) vêm do Google Fonts. Sem internet, o site usa fontes do sistema.

## Dados de teste
- Níveis, idades e opções dos formulários estão em `assets/js/data.js` (dados fictícios).
- Os botões "Preencher com dados de teste" enchem os formulários de uma vez.
- Ao enviar, aparece `obrigado.html`. O resumo fica só na memória do separador do navegador e o número de referência é de exemplo.

## Estrutura
```
assets/css/styles.css   estilos (cores e tipografia como variáveis no topo)
assets/js/data.js       dados fictícios
assets/js/main.js       menu, níveis, formulários e página de obrigado
assets/img/             fotografias, logótipos (SVG e PNG 4K), favicon e imagem de partilha
```

## Pendente da direcção
Níveis e idades reais, missão, visão, história, morada, horário, WhatsApp, autorização das fotografias com crianças e revisão da política de privacidade.

# Do Diário Oficial ao Celular: Dados e Performance no Projeto Santos PREP

*Como usei um script em Python para auditar aprovações reais no Diário Oficial e construí uma página de vendas rápida para o celular.*

---

No mercado de cursos preparatórios para concursos de alto nível — como as provas de Arquitetura e Engenharia —, páginas de vendas cheias de promessas exageradas e contadores falsos de escassez costumam afastar justamente os melhores candidatos.

Quem estuda para esse tipo de prova tem perfil analítico: lê o edital inteiro, confere o conteúdo programático e desconfia de números soltos. Quando saiu o edital nº 74/2026 da Prefeitura de Santos, o desafio era colocar no ar uma página de vendas que mostrasse **provas reais de aprovação da turma anterior**, explicasse o cronograma de aulas com transparência e **abrisse rápido no 4G do celular**.

Abaixo estão os detalhes de como estruturei a conferência de dados em Python e o desenvolvimento da página em Next.js.

---

## 1. Cruzando a Planilha de Alunos com o Diário Oficial em Python

O maior trunfo do projeto era o resultado da turma anterior no concurso da Prefeitura de Campinas. Porém, os dados estavam espalhados em dois lugares diferentes:

1. Uma planilha financeira de vendas (`.xlsx`) com centenas de ex-alunos.
2. Os arquivos públicos do Diário Oficial em PDF, com centenas de páginas trazendo as listas de classificação, notas e convocações.

Conferir tudo isso no olho humano levaria dias e deixaria passar nomes. Para resolver isso rápido e com precisão, escrevi um script em Python para cruzar as duas bases:

```
┌──────────────────────────┐          ┌──────────────────────────┐
│   Planilha de Alunos     │          │  Diário Oficial (PDF)    │
│    (Base de Vendas)      │          │ (Listas e Convocações)   │
└────────────┬─────────────┘          └────────────┬─────────────┘
             │                                     │
             v                                     v
   Padronização de Nomes                 Leitura dos PDFs (PyPDF)
 (Remoção de acentos/NFKD)              Limpeza de cabeçalhos/rodapés
             │                                     │
             └──────────────────┬──────────────────┘
                                │
                                v
                   Cruzamento e Verificação
                                │
                                v
                  Números Reais Confirmados:
             • 12 Alunos Classificados na Lista
             • 5 Alunos no Top 10 Geral
             • 4 Convocados / Nomeados
```

O script padronizou os textos (removendo acentos e diferenças de maiúsculas/minúsculas via normalização Unicode `NFKD`) e localizou cada ex-aluno dentro dos PDFs oficiais, confirmando **12 alunos classificados** e **5 dentro do Top 10**.

### Cuidado com a Privacidade (LGPD)

Apesar de o Diário Oficial ser público, publicar uma lista com o nome completo de todos os alunos em uma página comercial sem autorização direta não seria correto com quem prefere estudar de forma reservada.

Por isso, apresentei os **números gerais verificados** no topo e destaquei nominalmente apenas os ex-alunos que enviaram depoimentos voluntários e autorizaram a publicação (como o 5º e o 10º colocados), mantendo a privacidade dos demais.

---

## 2. Cronograma Transparente e Amostra Direta em 1 Clique

Em cursos lançados logo após a publicação do edital, as apostilas e aulas de legislação municipal são gravadas e liberadas semana a semana. Esconder isso gera pedidos de reembolso; explicar de forma confusa derruba as vendas.

Para resolver essa objeção de frente, transformei o calendário de entregas em uma seção visual clara da página:

| Ponto de Dúvida | Como costuma ser feito | Como fizemos no Santos PREP |
| --- | --- | --- |
| **Liberação das aulas** | Promessa vaga de "Acesso Imediato" | Calendário visual com a data exata de cada lei |
| **Formato do material** | Não deixa claro o que é PDF ou vídeo | Datas separadas para o PDF esquematizado e para a videoaula |
| **Amostra do material** | Pede e-mail e WhatsApp antes de mostrar | Download direto da 1ª lei em PDF com 1 clique, sem cadastro |

Qualquer visitante podia baixar o resumo completo da **Lei Complementar nº 1.196/2023** com um toque na tela antes de decidir comprar. Ver a qualidade real do material na hora ajudou muito na conversão.

---

## 3. Melhorando a Leitura dos Depoimentos no Celular

Quase 80% dos acessos vinham de anúncios no Instagram abertos pelo celular. Na primeira versão, os prints de WhatsApp ficavam dentro de cartões cheios de bordas, títulos repetidos e letras pequenas demais para ler na tela do telefone.

Refiz toda essa seção com foco em simplicidade:

1. **Sem texto repetido:** Tirei as transcrições que repetiam exatamente o que já estava escrito dentro do print.
2. **Leitura em tela cheia com gesto de arrastar (*Swipe*):** Ao tocar em qualquer print, ele abre em tela cheia e o usuário pode passar para o lado com o dedo (igual aos *Stories*), lendo as mensagens reais com nitidez.

```typescript
// Gesto simples de arrasto lateral (swipe) no celular
const handleTouchStart = (e: React.TouchEvent) => {
  touchStartX.current = e.targetTouches[0].clientX;
};

const handleTouchEnd = (e: React.TouchEvent) => {
  const diff = touchStartX.current - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) {
    if (diff > 0 && hasNext) nextSlide();
    if (diff < 0 && hasPrev) prevSlide();
  }
};
```

---

## 4. Velocidade de Abertura no 4G (Next.js Estático)

Quando alguém clica em um anúncio no celular usando dados móveis, cada segundo de tela branca faz parte do público fechar a aba antes mesmo de ver a oferta.

```
┌─────────────────────────────────────────────────────────────┐
│                 Next.js (Geração Estática)                  │
│          HTML e CSS prontos direto na CDN (Edge)            │
└──────────────┬───────────────────────────────┬──────────────┘
               │                               │
       Fontes Otimizadas                 Tailwind CSS
       (next/font local)              CSS final < 18 KB
   (Sem salto de tela / CLS 0)       (Zero bibliotecas pesadas)
               │                               │
               └───────────────┬───────────────┘
                               │
                               v
                   Abertura em ~0.8s no 4G
                 (100/100 no Core Web Vitals)
```

* **Página 100% estática:** Compilada no build para entregar o HTML pronto imediatamente pela CDN da Vercel, sem depender de consultas lentas a banco de dados a cada visita.
* **Zero salto visual (`CLS = 0.00`):** Fontes carregadas localmente via `next/font` e dimensões de imagens reservadas para que nenhum botão saia do lugar enquanto o usuário está lendo.
* **Apresentação clara de preço:** O cartão de fechamento já mostra de forma limpa o valor com cupom aplicado e a parcela no cartão, levando direto para o checkout seguro da Eduzz.

---

## Resultado

Unir um script simples em Python para validar dados reais no Diário Oficial com uma página em Next.js leve e direta trouxe exatamente o que o projeto precisava: **nota máxima de performance no celular (100/100)** e uma comunicação honesta que converteu candidatos exigentes sem precisar apelar para exageros de marketing.

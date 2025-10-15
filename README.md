# Criador de Formulários PDF

Uma aplicação web que permite aos usuários fazer upload de documentos PDF e adicionar campos de formulário interativos (caixas de texto, caixas de seleção e menus suspensos) para criar formulários PDF preenchíveis.

## Funcionalidades

-  **Upload e Visualização de PDF**: Faça upload de qualquer arquivo PDF e visualize no navegador
-  **Posicionamento Visual de Campos**: Clique para adicionar campos de formulário diretamente no PDF
-  **Vários Tipos de Campo**: Suporte para campos de texto, caixas de seleção e menus suspensos
-  **Arrastar e Redimensionar**: Mova e redimensione campos para um posicionamento perfeito
-  **Metadados dos Campos**: Configure nomes dos campos, obrigatoriedade e opções de menu suspenso
-  **Baixar PDF Preenchível**: Gere e baixe o PDF com campos de formulário interativos

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/luisdonin/pdf-maker.git
cd pdf-maker
```

2. Instale as dependências:
```bash
npm install
```

## Uso

### Executando a Aplicação

Inicie o servidor local:
```bash
npm start
```

Depois, abra o navegador e acesse:
```
http://localhost:8080
```

### Como Usar o Criador de Formulários PDF

1. **Faça upload de um PDF**:
   - Clique no botão "Upload PDF" ou arraste um arquivo PDF para a área indicada
   - O PDF será exibido no visualizador

2. **Adicione Campos de Formulário**:
   - Clique em um dos botões de tipo de campo (Texto, Caixa de Seleção ou Menu Suspenso)
   - Clique no PDF onde deseja posicionar o campo
   - Configure o campo na janela modal:
     - Digite um nome único para o campo
     - Para menus suspensos, adicione opções (uma por linha)
     - Opcionalmente, marque como obrigatório
   - Clique em "Salvar Campo"

3. **Mova e Redimensione Campos**:
   - Clique e arraste um campo para movê-lo
   - Arraste o controlador de tamanho (canto inferior direito) para redimensionar
   - Clique no botão × para excluir um campo

4. **Baixe seu Formulário**:
   - Clique no botão "Baixar PDF"
   - Seu PDF com campos de formulário interativos será baixado
   - Abra o PDF baixado em qualquer leitor para preencher o formulário

## Tecnologias Utilizadas

- **PDF.js**: Para renderizar PDFs no navegador
- **pdf-lib**: Para criar e modificar PDFs com campos de formulário
- **JavaScript Puro**: Sem dependências de frameworks
- **HTML5 & CSS3**: Interface moderna e responsiva

## Compatibilidade com Navegadores

Esta aplicação funciona nos principais navegadores que suportam:
- JavaScript ES6+
- Canvas HTML5
- File API
- Blob API

Testado em:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Estrutura do Projeto

```
pdf-maker/
├── index.html      # Arquivo HTML principal com a estrutura da interface
├── styles.css      # Estilos e layout
├── app.js          # Lógica da aplicação e manipulação de PDFs
├── package.json    # Dependências e scripts
└── README.md       # Este arquivo
```

## Desenvolvimento

A aplicação utiliza bibliotecas via CDN para PDF.js e pdf-lib, então não é necessário processo de build. Basta editar os arquivos e atualizar o navegador.

### Principais Arquivos

- `index.html`: Estrutura da interface com área de upload, barra de ferramentas, visualizador de PDF e modal de configuração dos campos
- `styles.css`: Estilos incluindo design responsivo e efeitos visuais
- `app.js`: Lógica principal da aplicação, incluindo:
  - Carregamento e renderização de PDFs
  - Posicionamento e gerenciamento de campos
  - Funcionalidade de arrastar e soltar
  - Geração do PDF com campos de formulário

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para enviar um Pull Request.

## Licença

ISC

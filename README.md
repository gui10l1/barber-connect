# Barber Connect - Projeto SC-2s-2024

![preview](./.github/preview.png)

> Soluções Computacionais

Gerenciador para Barbearias: Projeto desenvolvido ao longo do semestre como parte da proposta para a disciplina de Soluções Computacionais.

Alunos: 
Davi de Souza Gomes,
Guilherme Ribeiro Soares,
João Pedro Coelho Rabelo,
Lucas dos Santos Félix,
Rafael Vaz Cavalcanti,
Ricardo Bortolin

## Tecnologias Utilizadas

- ReactJS e Javascript
- SCSS
- NodeJS
- SQLite

## Rodando o Projeto

Para começar, faça o **clone** do repositório utilizando o comando:

```bash
git clone https://github.com/gui10l1/barber-connect.git
```

## Configuração do Backend

1. Acesse a pasta **backend**.

2. Faça uma cópia do arquivo **.env.example** e renomeie (cópia) para **.env**.

3. No arquivo **.env**, defina as seguintes variáveis de ambiente:
   - `APP_PORT`: Escolha a porta para o servidor. Exemplo: '8000'
   - `APP_SECRET`: Defina uma chave de sua escolha para o aplicativo. Exemplo: '12345'

4. Após configurar as variáveis de ambiente, execute os comandos abaixo em sequência para instalar as dependências e iniciar o servidor:

   ```bash
   npm install
   npm start
   ```

5. Pronto! O servidor está configurado e rodando localmente.

## Configuração do Frontend

1. Acesse a pasta **frontend**.

2. Faça uma cópia do arquivo **.env.example** e renomeie (cópia) para **.env**.

3. Definir a váriavel de ambiente `VITE_API_URL` com a porta escolhida para o servidor. Exemplo: Se `APP_PORT` = **'8000'** então `VITE_API_URL`='http://localhost:**8000**'

4. Utilizando outro terminal, dentro da pasta **frontend** execute os comandos abaixo em sequência para instalar as dependências e iniciar o frontend da aplicação:

   ```bash
   npm install
   npm run dev
   ```

5. Pronto! O cliente e o servidor da aplicação estão rodando localmente. Utilize a URL fornecida no terminal do **frontend** para acessar e utilizar a aplicação.

## Testes

1. Acesse a pasta **backend**.

4. Utilizando o terminal, execute os comandos abaixo em sequência para executar os testes:

   ```bash
   yarn test 
   yarn coverage
   ```

5. Pronto! Serão executados os testes e fornecida a porcentagem de cobertura.


# xy-inc

API REST para controle de pontos de interesse utilizando NodeJS, MongoDB e Restify.

## Pré-requisitos

- [NodeJS](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/download-center)
- [Git](https://git-scm.com/downloads)
## Instalação

Inicialmente, precisamos realizar o download do projeto.

```
git clone https://github.com/thprado/xy-inc.git
```

Após o download do projeto, precisamos instalar as dependências do mesmo, vá até o diretório raiz do projeto e execute o comando:

```
npm install
```

Por último necessitamos de ter a nossa base de dados funcionando corretamente, se você preferir utilizar o [Docker](https://www.docker.com/get-docker) para realizar o processo de inicialização e configuração da base de dados, use o comando:

```
docker-compose up
```

Caso contrário, você precisará realizar o download do [MongoDB](https://www.mongodb.com/download-center), e iniciá-lo manualmente.  
Para mais informações, use este [endereço](https://docs.mongodb.com/manual/installation/).

Após os passos anteriores estarem concluídos, podemos iniciar o nosso serviço.
Vá até o diretório raiz do projeto e digite o comando:

```
npm start
```

O Serviço estará disponível para consumo.

Para realizar os testes da aplicação, utilizamos o [Jest](https://jestjs.io/pt-BR/).
Para iniciar os testes, use o comando:

```
npm test
```

## Utilização


| Método | Rota | Parâmetros | Descrição | Exemplo
|---|-----------|----------------------------|------------------------------|----------|
|POST|`/points`            | { "name": string, coordinates: [Number,Number]}            | Criação de um novo ponto de interesse. Apenas valores positivos. | { "name": "Banco", "coordinates": [15,10] }
|GET |`/points`            |            | Listagem de todos os pontos de interesse.|
|GET |`/points/_id`| Query: ID da base de dados| Listagem de um POI específico por ID do MongoDB.| http://localhost:3000/points/5b46ef4b72ef8a2c7488db07 |
|GET |`/near/`| Query: x=Number&y=Number&distance=Number | Listagem de um POI por proximidade. | http://localhost:3000/near/?x=20&y=10&distance=10|

## Tipos de Retorno

| Código | Descrição |
| ---- | --- |
| 200 | Sua Solicitação foi completa com sucesso. | 
| 400| Os parâmetros enviados para a API estão em formato incorreto ou estão insuficientes. | 
| 404| Sua Solicitação não foi encontrada. | 
| 500| Ocorreu um erro interno na API, fique a vontade para abrir uma [issue](https://github.com/thprado/xy-inc/issues). | 

## Coverage

### Análise Geral
!["Análise Geral"](https://user-images.githubusercontent.com/13999929/42616756-bbfa52e8-8585-11e8-84ab-285b77c10a65.jpg)

### Análise dos arquivos.

!['Análise dos arquivos. ](https://user-images.githubusercontent.com/13999929/42616755-bbd59e76-8585-11e8-94f9-e559a5a4831c.jpg)


Fique a vontade para abrir uma [issue](https://github.com/thprado/xy-inc/issues).

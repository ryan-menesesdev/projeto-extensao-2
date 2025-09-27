# Projeto: Sinhá Bolos e Lanches 🍰🥪

## Equipe
* **IGOR DIAS MODESTO**
* **RYAN DAVI OLIVEIRA DE MENESES**

## Descrição Geral 📚
O objetivo deste projeto é o desenvolvimento de uma aplicação Web utilizando NodeJS como tecnologia de backend e MySQL para o armazenamento e a movimentação de dados.

O sistema foi projetado para gerenciar um processo de vendas de produtos, que são divididos em categorias (Bolos, Salgados, Bebidas e Sobremesas). A aplicação permite que usuários adicionem itens a um carrinho de compras e, posteriormente, finalizem a compra, gerando um registro de pedido.

A lógica de negócio é controlada por diferentes níveis de permissão, baseados em três tipos de usuários.

## Tecnologias Utilizadas 💻
* **Backend:** JavaScript (NodeJS)
* **Framework:** Express.js
* **Banco de Dados:** MySQL

## Funcionalidades e Perfis de Usuário 🙋‍♂️🙋‍♀️
O sistema opera com base em três perfis de usuário distintos, cada um com permissões específicas para interagir com a aplicação:

* **Cliente:**
    * Responsável por consultar o catálogo de produtos.
    * Realizar pedidos.
    * Acompanhar o status de seus pedidos.

* **Funcionário:**
    * Responsável por consultar os pedidos feitos pelos clientes.
    * Alterar o status de um pedido (ex: de "emAnálise" para "confirmado").
    * Acionar notificações para o cliente sobre as atualizações de status.

* **Supervisor:**
    * Acumula todas as habilidades de um **Funcionário**.
    * Responsável por gerenciar o catálogo de produtos (adicionar, editar, remover).
    * Responsável por gerenciar os usuários internos do sistema (Funcionários e outros Supervisores).

## Modelo do Banco de Dados 🎲
A estrutura do banco de dados foi modelada para suportar as funcionalidades descritas, separando as responsabilidades em entidades claras e com relacionamentos bem definidos. O diagrama abaixo, gerado com PlantUML, representa a arquitetura do banco.

![Diagrama do Banco de Dados](https://res.cloudinary.com/dglufibdf/image/upload/v1758488662/diagrama-plant-uml_wmpihw.png)

### Principais Entidades 👾
* **usuario:** Armazena os dados dos clientes, funcionários e supervisores, controlando os perfis de acesso.
* **produto:** Funciona como o catálogo central de todos os itens disponíveis para venda.
* **carrinho / carrinho_produto:** Gerenciam a seleção temporária de produtos de um usuário antes da finalização da compra.
* **pedido / produto_pedido:** Armazenam o registro histórico e os itens das compras já finalizadas.
* **pagamento:** Tabela dedicada a guardar os detalhes da transação financeira associada a cada pedido, garantindo rastreabilidade.

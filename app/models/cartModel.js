module.exports = {
    getCartItemsByUserId: (db, userId, callback) => {
        const sql = `
            SELECT
                p.id,
                p.nome,
                p.preco,
                p.imagem,
                cp.quantidade
            FROM carrinho c
            JOIN carrinho_produto cp ON c.id = cp.idCarrinho
            JOIN produto p ON cp.idProduto = p.id
            WHERE c.idUsuario = ?;
        `;

        db.query(sql, [userId], callback);
    }
}
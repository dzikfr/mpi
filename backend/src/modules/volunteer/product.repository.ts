import { PoolClient } from "pg";

export class ProductRepository {
  async createProduct(
    product_name: string,
    price: number,
    type: string,
    stock: number,
    client: PoolClient
  ) {
    const result = await client.query(
      "INSERT INTO product (product_name, price, type, stock) VALUES ($1, $2, $3, $4) RETURNING *",
      [product_name, price, type, stock]
    );
    return result.rows[0];
  }

  async getProducts(client: PoolClient) {
    const result = await client.query("SELECT * FROM product");
    return result.rows;
  }

  async updateProduct(
    id_product: number,
    product_name: string,
    price: number,
    type: string,
    stock: number,
    client: PoolClient
  ) {
    const result = await client.query(
      `UPDATE product SET product_name = $1, price = $2, type = $3, stock = $4 
      WHERE id_product = $5 
      RETURNING *`,
      [product_name, price, type, stock, id_product]
    );
    return result.rows[0];
  }

  async deleteProduct(id_product: number, client: PoolClient) {
    const result = await client.query(
      "DELETE FROM product WHERE id_product = $1 RETURNING *",
      [id_product]
    );
    return result.rows[0];
  }

  async findProductById(id_product: number, client: PoolClient) {
    const result = await client.query("SELECT * FROM product WHERE id_product = $1", [
      id_product,
    ]);
    return result.rows[0];
  }
}

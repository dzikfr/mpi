import { ProductBodyInput, ProductParamsInput } from "./product.schema";
import { ProductRepository } from "./product.repository";
import { pool } from "../../config/database";

export class ProductService {
  private productRepo = new ProductRepository();

  async createProduct(input: ProductBodyInput) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const product = await this.productRepo.createProduct(
        input.product_name,
        input.price,
        input.type,
        input.stock,
        client
      );
      
      await client.query("COMMIT");
      return product;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async getProducts() {
    const client = await pool.connect();
    try {
      const products = await this.productRepo.getProducts(client);
      return products;
    } finally {
      client.release();
    }
  }

  async updateProduct(input: ProductParamsInput, body: ProductBodyInput) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const checkingProduct = await this.productRepo.findProductById(input.id_product, client);
      if (!checkingProduct) throw new Error("Products not found");

      const products = await this.productRepo.updateProduct(
        input.id_product,
        body.product_name,
        body.price,
        body.type,
        body.stock,
        client
      );

      await client.query("COMMIT");
      return products;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteProduct(input: ProductParamsInput) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const checkingProduct = await this.productRepo.findProductById(input.id_product, client);
      if (!checkingProduct) throw new Error("Product not found");

      const product = await this.productRepo.deleteProduct(input.id_product, client);
      await client.query("COMMIT");
      return product;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

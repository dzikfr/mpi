import { PoolClient } from "pg";

export class CustomerRepository {
  async createCustomer(
    customer_name: string,
    company : string,
    address: string,
    client: PoolClient
  ) {
    const result = await client.query(
      "INSERT INTO customer (customer_name, company, address) VALUES ($1, $2, $3) RETURNING *",
      [customer_name, company, address]
    );
    return result.rows[0];
  }

  async getCustomers(client: PoolClient) {
    const result = await client.query("SELECT * FROM customer");
    return result.rows;
  }

  async updateCustomer(
    id_customer: number,
    customer_name: string,
    company : string,
    address: string,
    client: PoolClient
  ) {
    const result = await client.query(
      `UPDATE customer SET customer_name = $1, company = $2, address = $3
      WHERE id_customer = $4 
      RETURNING *`,
      [customer_name, company, address, id_customer]
    );
    return result.rows[0];
  }

  async deleteCustomer(id_customer: number, client: PoolClient) {
    const result = await client.query(
      "DELETE FROM customer WHERE id_customer = $1 RETURNING *",
      [id_customer]
    );
    return result.rows[0];
  }

  async findCustomerById(id_customer: number, client: PoolClient) {
    const result = await client.query("SELECT * FROM customer WHERE id_customer = $1", [
      id_customer,
    ]);
    return result.rows[0];
  }
}

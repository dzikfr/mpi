import { CustomerBodyInput, CustomerParamsInput } from "./customer.schema";
import { CustomerRepository } from "./customer.repository";
import { pool } from "../../config/database";

export class CustomerService {
  private Repo = new CustomerRepository();

  async createCustomer(input: CustomerBodyInput) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await this.Repo.createCustomer(
        input.customer_name,
        input.company_name,
        input.address,
        client
      );

      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async getCustomers() {
    const client = await pool.connect();
    try {
      const result = await this.Repo.getCustomers(client);
      return result;
    } finally {
      client.release();
    }
  }

  async updateCustomer(input: CustomerParamsInput, body: CustomerBodyInput) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const checkingId = await this.Repo.findCustomerById(
        input.id_customer,
        client
      );
      if (!checkingId) throw new Error("Customer not found");

      const result = await this.Repo.updateCustomer(
        input.id_customer,
        body.customer_name,
        body.company_name,
        body.address,
        client
      );

      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async deleteCustomer(input: CustomerParamsInput) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const checkingId = await this.Repo.findCustomerById(
        input.id_customer,
        client
      );
      if (!checkingId) throw new Error("Customer not found");

      const result = await this.Repo.deleteCustomer(input.id_customer, client);
      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

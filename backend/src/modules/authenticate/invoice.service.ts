import { InvoiceBodyInput, InvoiceParamsInput } from "./invoice.schema";
import { InvoiceRepository } from "./invoice.repository";
import { pool } from "../../config/database";

export class invoiceService {
  private Repo = new InvoiceRepository();

  async createInvoice(input: InvoiceBodyInput) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await this.Repo.createInvoice(
        input.date,
        input.payment_method,
        input.ppn,
        input.dp,
        input.user,
        input.id_customer,
        input.id_company,
        input.details,
        client
      );

      const invoice_number = result.invoice_number;


      await client.query("COMMIT");
      return result;
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }

  async getInvoice() {
    const client = await pool.connect();
    try {
      const result = await this.Repo.getInvoice(client);
      return result;
    } finally {
      client.release();
    }
  }

  async getInvoiceById(invoice_number: number) {
    const client = await pool.connect();
    try {
      const result = await this.Repo.getInvoiceById(invoice_number, client);
      return result;
    } finally {
      client.release();
    }
  }
}

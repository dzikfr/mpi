import { PoolClient } from "pg";

export class InvoiceRepository {
  async createInvoice(
    date: Date,
    payment_method: string,
    ppn: number,
    dp: number,
    // grand_total: number,
    user: string,
    id_customer: number,
    id_company: number,
    details: {
      id_product: number;
      // invoice_number: number;
      qty: number;
      price: number;
    }[],
    client: PoolClient
  ) {
    const getGrandTotal = details.reduce((acc, curr) => acc + curr.price*curr.qty, 0);
    const result = await client.query(
      "INSERT INTO invoice (date, payment_method, ppn, dp, grand_total, username, id_customer, id_company) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING invoice_number",
      [
        date,
        payment_method,
        ppn,
        dp,
        getGrandTotal,
        user,
        id_customer,
        id_company,
      ]
    );

    const invoiceNumber = result.rows[0].invoice_number;
    for (const detail of details) {
      await client.query(
        "INSERT INTO invoice_detail (invoice_number, id_product, qty, price) VALUES ($1, $2, $3, $4)",
        [invoiceNumber, detail.id_product, detail.qty, detail.price]
      );
    }

    return result.rows[0];
  }

  async getInvoice(client: PoolClient) {
    const result = await client.query(`
        SELECT 
          i.invoice_number,
          i.date,
          i.payment_method,
          i.ppn,
          i.dp,
          i.grand_total,
          i.username,
          i.id_customer,
          i.id_company,
          co.company_name,
          co.address,
          c.customer_name,
          json_agg(
            json_build_object(
              'id_product', d.id_product,
              'product_name', p.product_name,
              'product_type', p.type,
              'invoice_number', d.invoice_number,
              'qty', d.qty,
              'price', d.price
            )
          ) AS details
        FROM invoice i
        JOIN invoice_detail d ON i.invoice_number = d.invoice_number
        JOIN product p ON d.id_product = p.id_product
        JOIN customer c ON i.id_customer = c.id_customer
        JOIN company co ON i.id_company = co.id_company
        GROUP BY 
          i.invoice_number, i.date, i.payment_method, i.ppn, i.dp, 
          i.grand_total, i.username, i.id_customer, i.id_company, 
          co.company_name, co.address, c.customer_name;
    `);
    return result.rows;
  }

  async getInvoiceById(invoice_number: number, client: PoolClient) {
    const result = await client.query(
      `
        SELECT 
          i.invoice_number,
          i.date,
          i.payment_method,
          i.ppn,
          i.dp,
          i.grand_total,
          i.username,
          i.id_customer,
          i.id_company,
          co.company_name,
          co.address,
          c.customer_name,
          json_agg(
            json_build_object(
              'id_product', d.id_product,
              'product_name', p.product_name,
              'product_type', p.type,
              'invoice_number', d.invoice_number,
              'qty', d.qty,
              'price', d.price
            )
          ) AS details
        FROM invoice i
        JOIN invoice_detail d ON i.invoice_number = d.invoice_number
        JOIN product p ON d.id_product = p.id_product
        JOIN customer c ON i.id_customer = c.id_customer
        JOIN company co ON i.id_company = co.id_company
        WHERE i.invoice_number = $1
        GROUP BY 
          i.invoice_number, i.date, i.payment_method, i.ppn, i.dp, 
          i.grand_total, i.username, i.id_customer, i.id_company,
          co.company_name, co.address, c.customer_name;
      `,
      [invoice_number]
    );
    return result.rows[0];
  }
}

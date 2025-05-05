import { PoolClient } from "pg";

export class CompanyRepository {
  async createCompany(
    company_name: string,
    address: string,
    number: string,
    fax: string,
    client: PoolClient
  ) {
    const result = await client.query(
      "INSERT INTO company (company_name, address, number, fax) VALUES ($1, $2, $3, $4) RETURNING *",
      [company_name, address, number, fax]
    );
    return result.rows[0];
  }

  async getCompanies(client: PoolClient) {
    const result = await client.query("SELECT * FROM company");
    return result.rows;
  }

  async updateCompany(
    id_company: number,
    company_name: string,
    address: string,
    number: string,
    fax: string,
    client: PoolClient
  ) {
    const result = await client.query(
      `UPDATE company SET company_name = $1, address = $2, number = $3, fax = $4
      WHERE id_company = $5
      RETURNING *`,
      [company_name, address, number, fax, id_company]
    );
    return result.rows[0];
  }

  async deleteCompany(id_company: number, client: PoolClient) {
    const result = await client.query(
      "DELETE FROM company WHERE id_company = $1 RETURNING *",
      [id_company]
    );
    return result.rows[0];
  }

  async findCompanyById(id_company: number, client: PoolClient) {
    const result = await client.query(
      "SELECT * FROM company WHERE id_company = $1",
      [id_company]
    );
    return result.rows[0];
  }
}

import { CompanyBodyInput, CompanyParamsInput } from "./company.schema";
import { CompanyRepository } from "./company.repository";
import { pool } from "../../config/database";

export class CompanyService {
  private Repo = new CompanyRepository();

  async createCompany(input: CompanyBodyInput) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const result = await this.Repo.createCompany(
        input.company_name,
        input.address,
        input.number,
        input.fax,
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

  async getCompanies() {
    const client = await pool.connect();
    try {
      const result = await this.Repo.getCompanies(client);
      return result;
    } finally {
      client.release();
    }
  }

  async updateCompany(input: CompanyParamsInput, body: CompanyBodyInput) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const checkingId = await this.Repo.findCompanyById(
        input.id_company,
        client
      );
      if (!checkingId) throw new Error("Company not found");

      const result = await this.Repo.updateCompany(
        input.id_company,
        body.company_name,
        body.address,
        body.number,
        body.fax,
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

  async deleteCompany(input: CompanyParamsInput) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      const checkingId = await this.Repo.findCompanyById(
        input.id_company,
        client
      );
      if (!checkingId) throw new Error("Company not found");

      const result = await this.Repo.deleteCompany(input.id_company, client);
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

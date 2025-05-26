import { AssetBodyInput, AssetParamsInput } from "./asset.schema";
import { AssetRepository } from "./asset.repository";
import { pool } from "../../config/database";
import {PaginationParams}  from "../../types/params/pagination";

export class assetService {
  private Repo = new AssetRepository();

  async createAsset(input: AssetBodyInput) {
    let client;  
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const assetName = "dummy"

      const result = await this.Repo.createAsset(
        input.name,
        input.type || null,
        input.description || null,
        input.quantity || null,
        input.available_quantity || null,
        input.notes || null,
        assetName,
        client
      );

      await client.query("COMMIT");
      return result;
    } catch (err) {
      client?.query("ROLLBACK");
      throw err;
    } finally {
      client?.release();
    }
  }

  async updateAsset(id: number, input: AssetBodyInput) {
    let client;  
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const assetName = "dummy"

      const result = await this.Repo.updateAsset(
        id,
        input.name,
        input.type || null,
        input.description || null,
        input.quantity || null,
        input.available_quantity || null,
        input.notes || null,
        assetName,
        client
      );

      await client.query("COMMIT");
      return result;
    } catch (err) {
      client?.query("ROLLBACK");
      throw err;
    } finally {
      client?.release();
    }
  }

  async getAssets(input : PaginationParams) {
    let client
    try {
      client = await pool.connect();
      const result = await this.Repo.getAssets(input.take, input.skip, client);
      return result;
    } finally {
      client?.release();
    }
  }

  async deleteAsset(id: number) {
    let client
    try {
      client = await pool.connect();
      const result = await this.Repo.deleteAsset(id, client);
      return result;
    } finally {
      client?.release();
    }
  }

}

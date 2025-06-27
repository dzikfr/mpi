import { AssetBodyInput, AssetParamsInput } from "./asset.schema";
import { AssetRepository } from "./asset.repository";
import { pool } from "../../config/database";
import { PaginationParams }  from "../../types/shared/pagination";
import { deepBulkHashId, originalId } from "../../helpers/hashId";


export class assetService {
  private Repo = new AssetRepository();

  async createAsset(input: AssetBodyInput, photo_url: string | null = null) {
    let client;  
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const checkAsset = await this.checkAssetByName(input.name);
      if (checkAsset) {
        throw new Error("Asset name already exists");
      }

      const result = await this.Repo.createAsset(
        input.name,
        input.type || null,
        input.description || null,
        input.quantity || null,
        input.available_quantity || null,
        input.notes || null,
        photo_url,
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

  async updateAsset(id: string, input: AssetBodyInput, photo_url: string | null = null) {
    let client;  
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const checkAsset = await this.checkAssetByName(input.name);

      if (checkAsset) {
        throw new Error("Asset name already exists");
      }

      const result = await this.Repo.updateAsset(
        originalId(id),
        input.name,
        input.type || null,
        input.description || null,
        input.quantity || null,
        input.available_quantity || null,
        input.notes || null,
        photo_url,
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
      return result ? deepBulkHashId(result) : null;
    } finally {
      client?.release();
    }
  }

  async deleteAsset(id: string) {
    let client
    try {
      client = await pool.connect();
      const checkAsset = await this.checkAssetById(originalId(id));
      if (!checkAsset) {
        throw new Error("Asset not found");
      }
      const result = await this.Repo.deleteAsset(originalId(id), client);
      return result;
    } finally {
      client?.release();
    }
  }

  async checkAssetById(id: string) {
    const client = await pool.connect();
    try {
      const result = await this.Repo.checkExists("id", originalId(id), client);
      return result;
    } finally {
      client.release();
    }
  }

  async checkAssetByName(name: string) {
    const client = await pool.connect();
    try {
      const result = await this.Repo.checkExists("name", name, client);
      return result;
    } finally {
      client.release();
    }
  }

}

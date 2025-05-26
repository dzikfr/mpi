import { EventBodyInput, EventParamsInput } from "./event.schema";
import { EventRepository } from "./event.repository";
import { pool } from "../../config/database";
import {PaginationParams}  from "../../types/shared/pagination";

export class eventService {
  private Repo = new EventRepository();

  async createEvent(input: EventBodyInput) {
    let client;  
    try {
      client = await pool.connect();

      const assetName = "dummy"
      await client.query("BEGIN");

      const result = await this.Repo.createEvent(
        input.name,
        input.description || null,
        input.notes || null,
        input.date_start || null,
        input.date_end || null,
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

  async updateEvent(id: string, input: EventBodyInput) {
    let client;  
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const assetName = "dummy"

      const result = await this.Repo.updateEvent(
        id,
        input.name,
        input.description || null,
        input.notes || null,
        input.date_start || null,
        input.date_end || null,
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

  async getEvents(input : PaginationParams) {
    let client
    try {
      client = await pool.connect();
      const result = await this.Repo.getEvents(input.take, input.skip, client);
      return result;
    } finally {
      client?.release();
    }
  }

  async deleteEvent(id: string) {
    let client
    try {
      client = await pool.connect();
      const result = await this.Repo.deleteEvent(id, client);
      return result;
    } finally {
      client?.release();
    }
  }

}

import { EventBodyInput, EventParamsInput } from "./event.schema";
import { EventRepository } from "./event.repository";
import { pool } from "../../config/database";
import {PaginationParams}  from "../../types/shared/pagination";
import { taskService } from "./fw_task/task.service";

export class eventService extends taskService {
  private eventRepo = new EventRepository();

  async createEvent(input: EventBodyInput, photo_url : string | null = null) {
    let client;  
    try {
      client = await pool.connect();

      await client.query("BEGIN");
      
      const checkEvent = await this.checkEventById(input.name);
      if (checkEvent) {
        throw new Error("Event name already exists");
      }

      const result = await this.eventRepo.createEvent(
        input.name,
        input.description || null,
        input.notes || null,
        input.date_start || null,
        input.date_end || null,
        photo_url,
        client
      );

      if (!result) {
        throw new Error("Failed to create event");
      }

      await client.query("COMMIT");
      return result;
    } catch (err) {
      client?.query("ROLLBACK");
      throw err;
    } finally {
      client?.release();
    }
  }

  async updateEvent(id: string, input: EventBodyInput, photo_url : string | null = null) {
    let client;  
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const checkEvent = await this.checkEventByName(input.name);
      if (checkEvent) {
        throw new Error("Event name already exists");
      }

      const result = await this.eventRepo.updateEvent(
        id,
        input.name,
        input.description || null,
        input.notes || null,
        input.date_start || null,
        input.date_end || null,
        photo_url,
        client
      );

      if (!result) {
        throw new Error("Failed to update event");
      }

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
      const result = await this.eventRepo.getEvents(input.take, input.skip, client);
      return result;
    } finally {
      client?.release();
    }
  }

  async deleteEvent(id: string) {
    let client
    try {
      client = await pool.connect();
      const checkEvent = await this.checkEventById(id);
      
      if (!checkEvent) {
        throw new Error("Event not found");
      }

      const result = await this.eventRepo.deleteEvent(id, client);

      if (!result) {
        throw new Error("Failed to delete event");
      }

      return result;
    } finally {
      client?.release();
    }
  }

  async checkEventById(id: string) {
    const client = await pool.connect();
    try {
      const result = await this.eventRepo.checkExists("id", id, client);
      return result;
    } finally {
      client.release();
    }
  }

  async checkEventByName(name: string) {
    const client = await pool.connect();
    try {
      const result = await this.eventRepo.checkExists("name", name, client);
      return result;
    } finally {
      client.release();
    }
  }

}

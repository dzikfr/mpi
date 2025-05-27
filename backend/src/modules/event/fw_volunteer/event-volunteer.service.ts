import { EventVolunteerBodyInput, EventVolunteerParamsInput, EventVolunteerUpdateBodyInput } from "./event-volunteer.schema";
import { EventVolunteerRepository } from "./event-volunteer.repository";
import { pool } from "../../../config/database";
import { PaginationParams }  from "../../../types/shared/pagination";

export class EventVolunteerService {
  private Repo = new EventVolunteerRepository();

  async createEventVolunteer(inputs: EventVolunteerBodyInput[]) {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const volunteers = inputs.map((input) => ({
      event_id: input.ref_event_id,
      volunteer_id: input.ref_volunteer_id,
      registered_at: input.registered_at,
      verified_at: input.verified_at || null,
      ref_verified_id: input.ref_verified_id || null,
      notes: input.notes || null
    }));

    const result = await this.Repo.createEventVolunteers(volunteers, client);

    await client.query("COMMIT");
    return result;
    
    } catch (err) {
      await client?.query("ROLLBACK");
      throw err;
    } finally {
      client?.release();
    }
  }


  async updateEventVolunteer(id: string, input: EventVolunteerUpdateBodyInput) {
    let client;  
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const result = await this.Repo.updateEventVolunteer(
        id,
        input.registered_at,
        input.verified_at || null,
        input.notes || null,
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

  async getEventsVolunteer(ref_event_id: string, input : PaginationParams) {
    let client
    try {
      client = await pool.connect();
      const result = await this.Repo.getEventsVolunteer(ref_event_id, input.take, input.skip, client);
      return result;
    } finally {
      client?.release();
    }
  }

  async deleteEventVolunteer(id: string) {
    let client
    try {
      client = await pool.connect();
      const result = await this.Repo.deleteEventVolunteer(id, client);
      return result;
    } finally {
      client?.release();
    }
  }

}

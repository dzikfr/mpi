import { TaskBodyInput, TaskParamsInput, TaskUpdateBodyInput } from "./task.schema";
import { TaskRepository } from "./task.repository";
import { pool } from "../../../config/database";
import { PaginationParams }  from "../../../types/shared/pagination";

export class taskService {
  private Repo = new TaskRepository();

  async createTasks(inputs: TaskBodyInput[], ref_assigner_id: string | undefined) {
  let client;
  try {
    client = await pool.connect();
    await client.query("BEGIN");

    const tasks = inputs.map((input) => ({
      ref_event_id: input.ref_event_id,
      ref_assigner_id,
      name: input.name,
      due_at: input.due_at,
      completed_at: input.completed_at,
      notes: input.notes || null,
      status: input.status
    }));

    const result = await this.Repo.createTasks(tasks, client);

    await client.query("COMMIT");
    return result;
    
    } catch (err) {
      await client?.query("ROLLBACK");
      throw err;
    } finally {
      client?.release();
    }
  }


  async updateTask(id: string, input: TaskUpdateBodyInput) {
    let client;  
    try {
      client = await pool.connect();
      await client.query("BEGIN");

      const assetName = "dummy"

      const result = await this.Repo.updateTask(
        id,
        input.ref_updater_id,
        input.name,
        input.due_at,
        input.completed_at,
        input.notes,
        input.status,
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

  async getTasks(ref_event_id: string, input : PaginationParams) {
    let client
    try {
      client = await pool.connect();
      const result = await this.Repo.getTasks(ref_event_id, input.take, input.skip, client);
      return result;
    } finally {
      client?.release();
    }
  }

  async deleteTask(id: string) {
    let client
    try {
      client = await pool.connect();
      const result = await this.Repo.deleteTask(id, client);
      return result;
    } finally {
      client?.release();
    }
  }

}

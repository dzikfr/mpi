import { PoolClient } from "pg";

export class TaskRepository {
	async createTasks(
	tasks: {
		ref_event_id: string;
		ref_assigner_id: string | undefined;
		name: string;
		due_at: Date | null | undefined;
		completed_at: Date | null | undefined;
		notes: string | null | undefined;
		status: string;
	}[],
	client: PoolClient
	) {
	const values: any[] = [];
	const placeholders: string[] = [];

	tasks.forEach((task, i) => {
		const idx = i * 7;
		placeholders.push(`($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5}, $${idx + 6}, $${idx + 7}, now())`);
		values.push(
		task.ref_event_id,
		task.ref_assigner_id,
		task.name,
		task.due_at,
		task.completed_at,
		task.notes,
		task.status
		);
	});

	const query = `
		INSERT INTO fw_event_task (
		ref_event_id, ref_assigner_id, name,
		due_at, completed_at, notes, status, created_at
		)
		VALUES ${placeholders.join(", ")}
		RETURNING name
	`;

	const result = await client.query(query, values);
	return result.rows;
	}


	async updateTask(
		id: string,
		ref_updater_id: string,
		name: string,
		due_at: Date | null | undefined,
		completed_at: Date | null | undefined,
		notes: string | null | undefined,
		status: string,
		client: PoolClient
	) {

		const result = await client.query(
			`UPDATE fw_event_task
				SET ref_updater_id = $1, name = $2, due_at = $3, completed_at = $4, notes = $5, status = $6, updated_at = now()
			WHERE id = $7 RETURNING `,
			[
				ref_updater_id,
				name,
				due_at,
				completed_at,
				notes,
				status,
				id
			]
		);

		return result.rows[0];
	}

	async deleteTask(id: string, client: PoolClient) {

		const result = await client.query(
			`UPDATE fw_event_task
				SET status = 'D' 
				WHERE id = $1 RETURNING id, name`,
			[id]
		);

		return result.rows[0];
	}

	async getTasks(
		ref_event_id: string,
		take: number = 50, 
		skip: number = 0, 
		client: PoolClient
		) {

		const result = await client.query(
			`SELECT * FROM fw_event_task WHERE status = 'A' OR status = 'P' AND ref_event_id = $1 LIMIT $2 OFFSET $3`,
			[ref_event_id, take, skip]
		);

		return result.rows;
	}

    async getEventDetails(id: number, client: PoolClient) {

    }
}

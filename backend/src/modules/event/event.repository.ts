import { PoolClient } from "pg";
import { TaskRepository } from "./fw_task/task.repository";
import { EventType } from "./event.type";

export class EventRepository extends TaskRepository{
	async createEvent(
		name: string,
		description: string | null,
		notes: string | null,
		date_start: Date | null,
		date_end: Date | null,
		url_photo: string | null,
		client: PoolClient
	) {

		const result = await client.query(
			`INSERT INTO master_event (name, description, notes, date_start, date_end, photo_url, created_at, status) 
			VALUES ($1, $2, $3, $4, $5, $6, now(), $7) RETURNING name`,
			[
				name,
				description,
				notes,
				date_start,
				date_end,
				url_photo,
				'A'
			]
		);

		return result.rows[0];
	}

	async updateEvent(
		id: string,
		name: string,
		description: string | null,
		notes: string | null,
		date_start: Date | null,
		date_end: Date | null,
		url_photo: string | null,
		client: PoolClient
	) {

		const result = await client.query(
			`UPDATE master_event
				SET name = $1, description = $2, notes = $3, date_start = $4, date_end = $5, photo_url = COALESCE($6, photo_url), updated_at = now()
			WHERE id = $7 RETURNING name`,
			[
				name,
				description,
				notes,
				date_start,
				date_end,
				url_photo,
				id
			]
		);

		return result.rows[0];
	}

	async deleteEvent(id: string, client: PoolClient) {

		const result = await client.query(
			`UPDATE master_event
				SET status = 'D' 
				WHERE id = $1 RETURNING id, name`,
			[id]
		);

		return result.rows[0];
	}

	async getEvents(
		take: number = 50, 
		skip: number = 0, 
		client: PoolClient
		) {

		const result = await client.query(
			`SELECT * FROM master_event WHERE status = 'A' LIMIT $1 OFFSET $2`,
			[take, skip]
		);

		return result.rows;
	}

	async getEventById(id: string, client: PoolClient) : Promise<EventType | null> {

		const result = await client.query(
			`SELECT * FROM master_event WHERE id = $1 AND status = 'A'`,
			[id]
		);

		return result.rows[0];
	}

	async getUniqueEvent(
		name: string, 
		client: PoolClient
	): Promise< Boolean> {

		const result = await client.query(
			`SELECT 1 FROM master_event WHERE name = $1 AND status = 'A'`,
			[name]
		);

		return result.rows.length > 0;
	}
}

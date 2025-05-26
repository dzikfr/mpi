import { PoolClient } from "pg";

export class AssetLogRepository {
	async createAssetLog(
		event_id: string,
		asset_id: string,
		assigner_id: string,
		quantity_used: number,
		log_date: Date,
		returned_date: Date,
		notes: string,
		client: PoolClient
	) {

		const result = await client.query(
			`INSERT INTO fw_asset_log 
				(ref_event_id, ref_asset_id, ref_assigner_id, quantity_used, log_date, returned_date, notes, ts_insert, status) 
			VALUES ($1, $2, $3, $4, $5, $6, $7, now(), $8) 
				RETURNING ref_event_id, ref_asset_id, quantity_used
			`,
			[
				event_id,
				asset_id,
				assigner_id,
				quantity_used,
				log_date,
				returned_date,
				notes,
				'A'
			]
		);

		return result.rows[0];
	}

	async updateAssetLog(
		id: number,
		ref_updater_id: string,
		quantity_used: number,
		log_date: Date,
		returned_date: Date,
		notes: string,
		client: PoolClient
	) {

		const result = await client.query(
			`UPDATE fw_asset_log
				SET quantity_used = $1, log_date = $2, returned_date = $3, notes = $4, ref_updater_id = $5
				WHERE id = $6 RETURNING id
			`,
			[
				quantity_used,
				log_date,
				returned_date,
				notes,
				ref_updater_id,
				id
			]
		);

		return result.rows[0];
	}

	async deleteAssetLog(id: number, 
		ref_updater_id: string, 
		client: PoolClient
		) {

		const result = await client.query(
			`UPDATE fw_asset_log
				SET status = 'D', ref_updater_id = $1 
				WHERE id = $2 RETURNING id`,
			[
				ref_updater_id,
				id
				]
		);

		return result.rows[0];
	}

	async getAssetLogs(
		asset_id: string,
		event_id: string,
		take: number = 50, 
		skip: number = 0, 
		client: PoolClient
		) {

		const conditions: string[] = ["status = 'A'"];

		const values: any[] = [];
		let paramIndex = 1;

		if (asset_id) {
			conditions.push(`ref_asset_id = $${paramIndex++}`);
			values.push(asset_id);
		}

		if (event_id) {
			conditions.push(`ref_event_id = $${paramIndex++}`);
			values.push(event_id);
		}

		values.push(take, skip);

		const query = `
			SELECT * FROM fw_asset_log
			WHERE ${conditions.join(' AND ')}
			LIMIT $${paramIndex++} OFFSET $${paramIndex}
		`;

		const result = await client.query(query, values);
		return result.rows;
	}

}

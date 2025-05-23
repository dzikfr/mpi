import { PoolClient } from "pg";

export class AssetRepository {
	async createAsset(
		name: string,
		type: string,
		description: string,
		quantity: number,
		available_quantity: number,
		notes: string,
		client: PoolClient
	) {

		const result = await client.query(
			`INSERT INTO master_asset (name, type, description, quantity, available_quantity, notes, status) 
			VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING name`,
			[
				name,
				type,
				description,
				quantity,
				available_quantity,
				notes,
				'A'
			]
		);

		return result.rows[0];
	}

	async updateAsset(
		id: number,
		name: string,
		type: string,
		description: string,
		quantity: number,
		available_quantity: number,
		notes: string,
		client: PoolClient
	) {

		const result = await client.query(
			`UPDATE master_asset 
                SET name = $1, type = $2, description = $3, quantity = $4, 
                available_quantity = $5, notes = $6 , updated_at = now()
			WHERE id = $7 RETURNING name`,
			[
				name,
				type,
				description,
				quantity,
				available_quantity,
				notes,
				id
			]
		);

		return result.rows[0];
	}

	async deleteAsset(id: number, client: PoolClient) {

		const result = await client.query(
			`UPDATE master_asset 
				SET status = 'D' 
				WHERE id = $1 RETURNING id, name`,
			[id]
		);

		return result.rows[0];
	}

	async getAssets(
		take: number = 50, 
		skip: number = 0, 
		client: PoolClient
		) {

		const result = await client.query(
			`SELECT * FROM master_asset WHERE status = 'A' LIMIT $1 OFFSET $2`,
			[take, skip]
		);

		return result.rows;
	}

    async getAssetLogs(id: number, client: PoolClient) {

    }
}

import { PoolClient } from "pg";
import {AssetType} from "./asset.type";

export class AssetRepository {
	async createAsset(
		name: string,
		type: string | null,
		description: string | null,
		quantity: number | null,
		available_quantity: number | null,
		notes: string | null,
		photo_url: string | null,
		client: PoolClient
	) : Promise<{ name: string }> {

		const result = await client.query(
			`INSERT INTO master_asset (name, type, description, quantity, available_quantity, notes, photo_url, status) 
			VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING name`,
			[
				name,
				type,
				description,
				quantity,
				available_quantity,
				notes,
				photo_url,
				'A'
			]
		);

		return result.rows[0];
	}

	async updateAsset(
		id: string,
		name: string,
		type: string | null,
		description: string | null,
		quantity: number | null,
		available_quantity: number | null,
		notes: string | null,
		photo_url: string | null,
		client: PoolClient
	) : Promise<{ name: string } | null> {

		const result = await client.query(
			`UPDATE master_asset 
                SET name = $1, type = $2, description = $3, quantity = $4, 
                available_quantity = $5, notes = $6 , photo_url = COALESCE($7, photo_url), updated_at = now()
			WHERE id = $8 RETURNING name`,
			[
				name,
				type,
				description,
				quantity,
				available_quantity,
				notes,
				photo_url,
				id
			]
		);

		return result.rows[0];
	}

	async deleteAsset(id: string, client: PoolClient) {

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
		) : Promise<AssetType[] | null> {

		const result = await client.query(
			`SELECT * FROM master_asset WHERE status = 'A' LIMIT $1 OFFSET $2`,
			[take, skip]
		);

		return result.rows;
	}

    async getAssetById(id: number, client: PoolClient) : Promise<AssetType | null> {
		const result = await client.query(
			`SELECT * FROM master_asset WHERE id = $1 AND status = 'A'`,
			[id]
		);

		return result.rows[0];
    }
	
	async getUniqueAsset(
		name: string, 
		client: PoolClient
	): Promise< Boolean> {

		const result = await client.query(
			`SELECT 1 FROM master_asset WHERE name = $1 AND status = 'A'`,
			[name]
		);

		return result.rows.length > 0;
	}
}

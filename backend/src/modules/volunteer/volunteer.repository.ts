import { PoolClient } from "pg";

export class VolunteerRepository {
	async createVolunteer(
    ref_user_id : string,
    nik : string,
    full_name: string,
    address : string,
    age: number,
    email: string,
    phone: string,
    url_photo: string,
		client: PoolClient
	) {

		const result = await client.query(
		`INSERT INTO fw_user_volunteer 
			(ref_user_id, nik, full_name, address, age, email, phone, url_photo, created_at, status) 
      	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now(), $9) RETURNING ref_user_id, full_name`,
			[
        ref_user_id,
        nik,
        full_name,
        address,
        age,
        email,
        phone,
        url_photo,
        'A'
			]
		);

		return result.rows[0];
	}

	async updateVolunteer(
	id: number,
    nik : string,
    full_name: string,
    address : string,
    age: number,
    email: string,
    phone: string,
    url_photo: string,
		client: PoolClient
	) {

		const result = await client.query(
		`UPDATE fw_user_volunteer
			SET nik = $1, full_name = $2, address = $3, age = $4, email = $5, phone = $6, url_photo = $7, updated_at = now()
        WHERE id = $8 RETURNING id, full_name
      	`,
			[
        nik,
        full_name,
        address,
        age,
        email,
        phone,
        url_photo,
        id
			]
		);

		return result.rows[0];
	}

	async deleteVolunteer(id: number, client: PoolClient) {

		const result = await client.query(
			`UPDATE fw_user_volunteer
				SET status = 'D' 
			WHERE id = $1 RETURNING id, full_name`,
			[id]
		);

		return result.rows[0];
	}

	async getVolunteers(
		take: number = 50, 
		skip: number = 0, 
		client: PoolClient
		) {

		const result = await client.query(
			`SELECT * FROM fw_user_volunteer 
				WHERE status = 'A' LIMIT $1 OFFSET $2`,
			[take, skip]
		);

		return result.rows;
	}

}

import { PoolClient } from "pg";
import { VolunteerType } from "./volunteer.type"

export class VolunteerRepository {
	async createUser(
		username: string,
		password: string,
		client: PoolClient
	) : Promise<{id: string, username: string}> {
		const result = await client.query(
			`INSERT INTO master_user (username, password, status) VALUES ($1, $2, $3) RETURNING id, username`,
			[username, password, "A"]
		);
		return result.rows[0];
	}

	async createVolunteer(
		ref_user_id : string,
		// ref_role_id : string,
		nik : string,
		full_name: string,
		address : string | null,
		age: number | null,
		email: string,
		phone: string | null,
		url_photo: string | null,
		client: PoolClient
	) : Promise<{id: string, ref_user_id: string, full_name: string}> {

		const result = await client.query(
		`INSERT INTO fw_user_volunteer 
			(ref_user_id, nik, full_name, address, age, email, phone, url_photo, created_at, status) 
      	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, now(), $9) RETURNING id, ref_user_id, full_name`,
			[
        ref_user_id,
		// ref_role_id,
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

	async findIdRoleVolunteer(
		client: PoolClient
	) : Promise<{id : string, role_name: string}> {

		const result = await client.query(
			`SELECT id, role_name FROM master_role WHERE role_name = 'volunteer'`
		);
		return result.rows[0];
	}

	// async createUserVolunteers(
	// 	ref_user_id : string,
	// 	ref_role_id : string,
	// 	client: PoolClient
	// ) : Promise<{id: string, ref_user_id: string, ref_role_id: string}> {
	// 	// this still dummy
	// 	const result = await client.query(
	// 		`INSERT INTO fw_user_role (ref_user_id, ref_role_id, status) VALUES ($1, $2, $3) RETURNING id, ref_user_id, ref_role_id`,
	// 		[ref_user_id, ref_role_id, "A"]
	// 	);
	// 	return result.rows[0];
	// }

	async updateVolunteer(
		id: string,
		nik : string,
		full_name: string,
		address : string,
		age: number,
		email: string,
		phone: string,
		url_photo: string,
		client: PoolClient
	) : Promise<{id: string, full_name: string}> {

		const result = await client.query(
		`UPDATE fw_user_volunteer
			SET nik = $1, full_name = $2, address = $3, age = $4, email = $5, phone = $6, url_photo = COALESCE($7, url_photo), updated_at = now()
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

	async deleteVolunteer(
		id: string, client: PoolClient
	) : Promise<{id: string, full_name: string}> {

		const result = await client.query(
			`UPDATE fw_user_volunteer
				SET status = 'D' 
			WHERE id = $1 RETURNING id, full_name`,
			[id]
		);

		return result.rows[0];
	}

	async deleteUserVolunteer(
		volunteer_id: string, 
		client: PoolClient
	){

		const result = await client.query(
			`UPDATE FROM fw_user_role WHERE ref_user_id = $1 AND ref_role_id = (SELECT id FROM master_role WHERE role_name = 'volunteer') RETURNING id, ref_user_id, ref_role_id`,
			[volunteer_id]
		);
	}

	async getVolunteers(
		take: number = 50, 
		skip: number = 0, 
		client: PoolClient
	) : Promise<VolunteerType[] | null> {

		const result = await client.query(
			`SELECT * FROM fw_user_volunteer 
				WHERE status = 'A' LIMIT $1 OFFSET $2`,
			[take, skip]
		);

		return result.rows;
	}

	async checkUniqueExists(
		nik: string | null,
		email: string | null,
		phone: string | null | undefined,
		client: PoolClient
	) : Promise<boolean> {
		const query = `
			SELECT * FROM fw_user_volunteer 
			WHERE (nik = $1 OR email = $2 OR phone = $3) AND status = 'A'
		`;
		const values = [nik, email, phone];
		const result = await client.query(query, values);
		return result.rows.length > 0;
	}
}

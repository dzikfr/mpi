import { PoolClient } from "pg";

export class EventVolunteerRepository {
    async createEventVolunteer(
        event_id: string,
        volunteer_id: string,
        registered_at: Date,
        verified_at: Date,
        ref_verified_id: string,
        notes: string,
        client: PoolClient
    ) {

        const result = await client.query(
            `INSERT INTO fw_volunteer_event 
                (event_id, volunteer_id, registered_at, verified_at, ref_verified_id, notes, created_at, status) 
            VALUES ($1, $2, $3, $4, $5, $6, now(), $7) 
                RETURNING ref_event_id, ref_volunteer_id
            `,
            [
                event_id,
                volunteer_id,
                registered_at,
                verified_at,
                ref_verified_id,
                notes,
                'A'
            ]
        );

        return result.rows[0];
    }

    async updateEventVolunteer(
        id: number,
        registered_at: Date,
        verified_at: Date,
        notes: string,
        client: PoolClient
    ) {

        const result = await client.query(
            `UPDATE fw_volunteer_event
                SET registered_at = $1, verified_at = $2, notes = $3, updated_at = now()
                WHERE id = $4 RETURNING id
            `,
            [
                registered_at,
                verified_at,
                notes,
                id
            ]
        );

        return result.rows[0];
    }

    async deleteEventVolunteer(id: number, client: PoolClient) {

        const result = await client.query(
            `UPDATE fw_volunteer_event
                SET status = 'D' 
                WHERE id = $1 RETURNING id`,
            [id]
        );

        return result.rows[0];
    }

    async getEventsVolunteer(
        event_id: string,
        take: number = 50, 
        skip: number = 0, 
        client: PoolClient
        ) {

        const result = await client.query(
            `SELECT * FROM fw_volunteer_event 
                WHERE ref_event_id = $1 AND status = 'A' 
            LIMIT $2 OFFSET $3
            `,
            [event_id, take, skip]
        );

        return result.rows;
    }

    async getEventDetails(id: number, client: PoolClient) {

    }
}

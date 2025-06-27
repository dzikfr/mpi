import { PoolClient } from "pg";

export class EventVolunteerRepository {
    async createEventVolunteers(
        volunteers: {
            event_id: string;
            volunteer_id: string;
            registered_at: Date;
            verified_at: Date | null;
            ref_verified_id: string | null;
            notes: string | null;
        }[],
        client: PoolClient
        ): Promise<{ ref_event_id: string; ref_volunteer_id: string }[]> {
        const values: any[] = [];
        const placeholders: string[] = [];

        volunteers.forEach((v, i) => {
            const idx = i * 7;
            placeholders.push(
            `($${idx + 1}, $${idx + 2}, $${idx + 3}, $${idx + 4}, $${idx + 5}, $${idx + 6}, $${idx + 7})`
            );
            values.push(
            v.event_id,
            v.volunteer_id,
            v.registered_at,
            v.verified_at,
            v.ref_verified_id,
            v.notes,
            'A' // status
            );
        });

        const query = `
            INSERT INTO fw_volunteer_event (
            ref_event_id, ref_volunteer_id, registered_at,
            verified_at, ref_verified_id, notes, status
            )
            VALUES ${placeholders.join(', ')}
            RETURNING ref_event_id, ref_volunteer_id
        `;

        const result = await client.query(query, values);
        return result.rows;
    }

    async updateEventVolunteer(
        id: string,
        registered_at: Date,
        verified_at: Date | null,
        notes: string | null,
        client: PoolClient
    ) : Promise<{ id: string }> {

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

    async deleteEventVolunteer(id: string, client: PoolClient) : Promise<{ ref_event_id: string, ref_volunteer_id: string }> {

        const result = await client.query(
            `UPDATE fw_volunteer_event
                SET status = 'D' 
                WHERE id = $1 RETURNING ref_event_id, ref_volunteer_id`,
            [id]
        );

        return result.rows[0];
    }

    async getEventsVolunteer(
        event_id: string,
        take: number = 50, 
        skip: number = 0, 
        client: PoolClient
        ) : Promise<any[]> {

        const result = await client.query(
            `SELECT * FROM fw_volunteer_event 
                WHERE ref_event_id = $1 AND status = 'A' 
            LIMIT $2 OFFSET $3
            `,
            [event_id, take, skip]
        );

        return result.rows;
    }
}

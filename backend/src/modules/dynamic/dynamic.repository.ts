import { PoolClient } from "pg";
import { ListDataType } from "./dynamic.type";

export class DynamicRepository {
    async createListData(
        table_name: string,
        column_name: string,
        value: string,
        description: string | null,
        client: PoolClient
    ) {

        const result = await client.query(
            `INSERT INTO list_data
                (table_name, column_name, value, description, status)
            VALUES ($1, $2, $3, $4, $5) 
                RETURNING value
            `,
            [
                table_name,
                column_name,
                value,
                description,
                'A'
            ]
        );

        return result.rows[0];
    }

    async updateListData(
        id: string,
        value: string,
        description: string | null,
        client: PoolClient
    ) {

        const result = await client.query(
            `UPDATE list_data
                SET value = $1, description = $2, updated_at = now()
                WHERE id = $3 RETURNING value
            `,
            [
                value,
                description,
                id
            ]
        );

        return result.rows[0];
    }

    async deleteListData(
        id: number, 
        client: PoolClient
        ) {

        const result = await client.query(
            `UPDATE list_data
                SET status = 'D'
                WHERE id = $1 RETURNING id`,
            [id]
        );

        return result.rows[0];
    }

    async getListData(
        table_name: string,
        column_name: string,
        take: number = 50, 
        skip: number = 0, 
        client: PoolClient
        ) : Promise<ListDataType[]> {

        const result = await client.query(
            `SELECT * FROM list_data
                WHERE status = 'A' AND table_name = $1 AND column_name = $2 
            LIMIT $3 OFFSET $4
        `, [table_name, column_name, take, skip]);

        console.log("getListData result", result.rows);

        return result.rows;
    }

}

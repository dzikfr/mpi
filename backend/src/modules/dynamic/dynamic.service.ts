import { DynamicBodyInput, DynamicParamsInput, GetInput, getListDataPrefference, ValidType, validInputGet } from "./dynamic.schema";
import { DynamicRepository } from "./dynamic.repository";
import { pool } from "../../config/database";

export class dynamicService {
	private Repo = new DynamicRepository();

	async createListData(input: DynamicBodyInput, type: ValidType) {
        if (!validInputGet.includes(type)) throw new Error("Invalid type");
        const pref = getListDataPrefference[type];
        let client;
        try {
            client = await pool.connect();
			await client.query("BEGIN");

			const result = await this.Repo.createListData(
                pref.table_name,
                pref.column_name,
				input.value,
				input.description || null,
				client
			);

			await client.query("COMMIT");
			return result;
		} catch (err) {
			client?.query("ROLLBACK");
			throw err;
		} finally {
			client?.release();
		}
	}

    async getListData(input: { skip?: number; take?: number }, type: ValidType) {
        if (!validInputGet.includes(type)) throw new Error("Invalid type");

        const pref = getListDataPrefference[type];
        let client;
        try {
            client = await pool.connect();
            const result = await this.Repo.getListData(
                pref.table_name,
                pref.column_name,
                input.skip || 0,
                input.take || 50,
                client
            );
            return result;
        } catch (err) {
            throw err;
        }
         finally {
            client?.release();
        }
    }

    async updateValueListData(id : string, input: DynamicBodyInput, type: ValidType) {
        if (!validInputGet.includes(type)) throw new Error("Invalid type");

        let client;
        try {
            client = await pool.connect();
            await client.query("BEGIN");

            const result = await this.Repo.updateListData(
                id,
                input.value,
                input.description || null,
                client
            );

            await client.query("COMMIT");
            return result;
        } catch (err) {
            client?.query("ROLLBACK");
            throw err;
        } finally {
            client?.release();
        }
    }
}

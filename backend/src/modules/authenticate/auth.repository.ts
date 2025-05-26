import { PoolClient } from "pg";

export class AuthRepository {
  async findUserByUsername(username: string, client: PoolClient) : Promise<{id: string, username: string, password: string}> {
    const query = `SELECT id, username, password FROM master_user WHERE username = $1`;
    const result = await client.query(query, [username]);
    return result.rows[0];
  }

  async findRoles(userId: string, client: PoolClient) : Promise<{id : string, username : string, role_name : string}> {
    const query = `
      SELECT mu.id, mu.username, mr.role_name FROM master_user mu
        LEFT JOIN fw_user_role fur ON fur.ref_user_id = mu.id
        LEFT JOIN master_role mr ON mr.id = fur.ref_role_id
      WHERE mu.id = $1
    `;
    const result = await client.query(query, [userId]);
    return result.rows[0];
  }

  async checkDuplicate(username: string, client: PoolClient) : Promise<boolean> {
    const query = `
      SELECT 1 FROM master_user 
      WHERE username = $1 AND status = 'A'
    `;
    const result = await client.query(query, [username]);
    return (result.rowCount ?? 0) > 0;
  }

  async createUser(
    username: string,
    password: string,
    client: PoolClient
  ) : Promise<{id: string, username: string}> {
    const query = `
      INSERT INTO master_user (username, password, status)
        VALUES ($1, $2, $3)
      RETURNING id, username
    `;
    const result = await client.query(query, [
      username,
      password,
      "A",
    ]);
    return result.rows[0];
  }

  async insertUserRole(userId: string, roleId: string, client: PoolClient) {
    const query = `
      INSERT INTO fw_user_role (ref_user_id, ref_role_id, status)
        VALUES ($1, $2, $3)
    `;
    await client.query(query, [userId, roleId, "A"]);
    return;
  }

  async getListRole(client: PoolClient) : Promise<{id : string, role_name : string, role_description : string, status : string}[]> {
    const query = `
      SELECT * FROM master_role WHERE status = 'A'
    `;
    const result = await client.query(query);
    return result.rows;
  }
}

import { pool } from "../config/database";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

async function seed() {
  let client = null;
  try {
    client = await pool.connect();

    await client.query("BEGIN");

    // masukkan super admin account
    if (!process.env.SUPER_MASTER_PASSWORD) {
        throw new Error("SUPER_MASTER_PASSWORD is not defined in the environment variables");
    }

    const hashedPassword = await bcrypt.hash(
        process.env.SUPER_MASTER_PASSWORD,
        10
    );

    const insertSuperAdmin = await client.query(
      `
      INSERT INTO master_user (username, password, status)
      VALUES ($1, $2, 'A') 
      RETURNING id
      `,
      [
        process.env.SUPER_MASTER_USERNAME,
        hashedPassword,
      ]
    );

    if (insertSuperAdmin.rowCount === 0) {
      throw new Error("failed to insert super admin");
    }

    // buat role admin
    const insertRoleAdmin = await client.query(
      `
      INSERT INTO master_role (role_name, role_description, status)
      VALUES ($1, $2, 'A') 
      RETURNING id 
      `,
      ["admin", "Administrator"]
    );


    if (insertRoleAdmin.rowCount === 0) {
      throw new Error("failed to insert role admin");
    }

    const adminId = insertRoleAdmin.rows[0].id;

    //masukkan ke user role untuk admin
    const insertUserRole = await client.query(
      `
      INSERT INTO fw_user_role (ref_user_id, ref_role_id)
      VALUES ($1, $2)
      RETURNING id
      `,
      [insertSuperAdmin.rows[0].id, adminId]
    );

    if (insertUserRole.rowCount === 0) {
      throw new Error("failed to insert user role");
    }
    // masukkan list status
    // const statuses = [
    //   { char: "A", description: "Active" },
    //   { char: "D", description: "Deleted" },
    //   { char: "P", description: "Pending" },
    //   { char: "R", description: "Reject" },
    // ];

    // for (const status of statuses) {
    //   await client.query(
    //       `
    //       INSERT INTO list_status (char, description, ts_insert)
    //       VALUES ($1, $2, NOW())
    //       `,
    //     [status.char, status.description]
    //   );
    // }

    // masukkan list data
    const listData = [
      { table_name: "master_asset", column_name: "type", value: "Perlengkapan", description: "Perlengkapan" },
      { table_name: "master_asset", column_name: "type", value: "Elektronik", description: "Elektronik" },
      { table_name: "master_asset", column_name: "type", value: "Kendaraan", description: "Kendaraan" },
      { table_name: "master_asset", column_name: "type", value: "Furniture", description: "Furniture" },
      { table_name: "master_asset", column_name: "type", value: "Pakaian", description: "Pakaian" },
    ];


    for (const data of listData) {
      await client.query(
          `
          INSERT INTO list_data (table_name, column_name, value, description, status, ts_insert)
          VALUES ($1, $2, $3, $4, 'A', NOW())
          `,
        [data.table_name, data.column_name, data.value, data.description]
      );
    }



    await client.query("COMMIT");

    console.log("Seed success");
  } catch (error) {
    if (client) {
      await client.query("ROLLBACK");
    }
    console.error("Seed failed:", error);
  } finally {
    if (client !== null) {
      client.release();
    }
    process.exit(0);
  }
}

seed().catch(console.error);

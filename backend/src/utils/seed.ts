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
      INSERT INTO master_user (user_id, username, first_name, email, password, is_verified, status, phone)
      VALUES ($1, $2, $3, $4, $5, true, 'A', $6)
      `,
      [
        process.env.SUPER_MASTER_USER_ID,
        process.env.SUPER_MASTER_USERNAME,
        process.env.SUPER_MASTER_FIRST_NAME,
        process.env.SUPER_MASTER_EMAIL,
        hashedPassword,
        process.env.SUPER_MASTER_PHONE,
      ]
    );

    if (insertSuperAdmin.rowCount === 0) {
      throw new Error("failed to insert super admin");
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
      { table_name: "audit_log", field_name: "changes_category", name: "USER_REGISTER", description: "User registration activity" },
      { table_name: "audit_log", field_name: "changes_category", name: "API_ACCESS", description: "API access activity" },
      { table_name: "audit_log", field_name: "changes_category", name: "UPDATE USER", description: "user updated profile activity" },
      { table_name: "audit_log", field_name: "changes_category", name: "ERROR", description: "error response" },
      { table_name: "audit_log", field_name: "changes_category", name: "CREATE_PRODUCT", description: "user created product" },
      { table_name: "master_access", field_name: "module_name", name: "product", description: "mengelola product" },
      { table_name: "master_access", field_name: "module_name", name: "company", description: "mengelola product" },
      { table_name: "master_access", field_name: "module_name", name: "role", description: "" },
      { table_name: "master_access", field_name: "module_name", name: "user", description: "" },
      { table_name: "master_access", field_name: "module_name", name: "company-docs", description: "" },
      { table_name: "master_access", field_name: "module_name", name: "discussion", description: "" },
      { table_name: "master_access", field_name: "module_name", name: "payment", description: "" },
      { table_name: "master_access", field_name: "module_name", name: "purchase-order", description: "" },
      { table_name: "master_access", field_name: "module_name", name: "delivery-order", description: "" },
      { table_name: "master_access", field_name: "module_name", name: "invoice", description: "" },
      { table_name: "master_access", field_name: "module_name", name: "transaction", description: ""},
      { table_name: "company_product", field_name: "category", name: "Alat Tulis Kantor", description: "Alat Tulis Kantor category" },
      { table_name: "company_product", field_name: "category", name: "Perlengkapan Dapur", description: "Perlengkapan Dapur category"},
      { table_name: "company_product", field_name: "category", name: "Handphone & Tablet", description: "Handphone & Tablet category" },
      { table_name: "company_product", field_name: "category", name: "Komputer & Laptop", description: "Komputer & Laptop category" },
      { table_name: "company_product", field_name: "category", name: "Kamera & Aksesoris", description: "Kamera & Aksesoris category" },
      { table_name: "company_product", field_name: "category", name: "Otomotif", description: "Otomotif category" },
      { table_name: "company_product", field_name: "category", name: "Technology", description: "Category for technology products"},
      { table_name: "company_product", field_name: "category", name: "Fashion", description: "Category for fashion products" },
      { table_name: "company_payment_info", field_name: "bank_name", name: "BCA", description: "Bank Central Asia" },
      { table_name: "company_payment_info", field_name: "bank_name", name: "BNI", description: "Bank Negara Indonesia" },
      { table_name: "company_payment_info", field_name: "bank_name", name: "BRI", description: "Bank Rakyat Indonesia" },
      { table_name: "fw_purchase_order_other_cost", field_name: "cost_name", name: "PPN", description: "Pajak Pertambahan Nilai" },
      { table_name: "fw_purchase_order_other_cost", field_name: "cost_name", name: "Biaya Lainnya", description: "Biaya Lainnya" },
    ];


    for (const data of listData) {
      await client.query(
          `
          INSERT INTO list_data (table_name, column_name, value, description, status, ts_insert)
          VALUES ($1, $2, $3, $4, 'A', NOW())
          `,
        [data.table_name, data.field_name, data.name, data.description]
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

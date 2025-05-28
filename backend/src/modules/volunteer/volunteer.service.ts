import bcrypt from "bcrypt";
import { VolunteerBodyInput, VolunteerParamsInput } from "./volunteer.schema";
import { VolunteerRepository } from "./volunteer.repository";
import { pool } from "../../config/database";

export class VolunteerService {
  private volunteerRepo = new VolunteerRepository();

  async createVolunteer(input: VolunteerBodyInput, url_photo : string | null = null) {
    let client = null;
    try {
      client = await pool.connect();
      await client.query("BEGIN");
      const hashedPassword = await bcrypt.hash(input.password, 10);

      const createUser = await this.volunteerRepo.createUser(
        input.username,
        hashedPassword,
        client
      )

      const userId = createUser.id
      const findIdRoleVolunteer = await this.volunteerRepo.findIdRoleVolunteer(client);

      const createVolunteer = await this.volunteerRepo.createVolunteer(
        userId,
        findIdRoleVolunteer.id,
        input.nik,
        input.full_name,
        input.address || null,
        input.age || null,
        input.email,
        input.phone || null,
        url_photo || null,
        client
      );

      if (!createVolunteer) {
        throw new Error("Failed to create volunteer");
      }
      
      await client.query("COMMIT");
      return createVolunteer;
    } catch (err) {
      await client?.query("ROLLBACK");
      throw err;
    } finally {
      client?.release();
    }
  }

  async getVolunteers( get : { take : number, skip : number } ) {
    let client = null;
    try {
      client = await pool.connect();
      const result = await this.volunteerRepo.getVolunteers(get.take, get.skip, client);
      return result;
    } finally {
      client?.release();
    }
  }

//   async updateProduct(input: ProductParamsInput, body: ProductBodyInput) {
//     const client = await pool.connect();
//     try {
//       await client.query("BEGIN");

//       const checkingProduct = await this.productRepo.findProductById(input.id_product, client);
//       if (!checkingProduct) throw new Error("Products not found");

//       const products = await this.productRepo.updateProduct(
//         input.id_product,
//         body.product_name,
//         body.price,
//         body.type,
//         body.stock,
//         client
//       );

//       await client.query("COMMIT");
//       return products;
//     } catch (err) {
//       await client.query("ROLLBACK");
//       throw err;
//     } finally {
//       client.release();
//     }
//   }

//   async deleteProduct(input: ProductParamsInput) {
//     const client = await pool.connect();
//     try {
//       await client.query("BEGIN");

//       const checkingProduct = await this.productRepo.findProductById(input.id_product, client);
//       if (!checkingProduct) throw new Error("Product not found");

//       const product = await this.productRepo.deleteProduct(input.id_product, client);
//       await client.query("COMMIT");
//       return product;
//     } catch (err) {
//       await client.query("ROLLBACK");
//       throw err;
//     } finally {
//       client.release();
//     }
//   }
}

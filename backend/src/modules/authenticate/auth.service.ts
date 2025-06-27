import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../../config/database";
import { AuthRepository } from "./auth.repository";
import { LoginInput, RegisterInput } from "./auth.schema";

export class AuthService {
  private authRepo = new AuthRepository();

  async loginUser(data: LoginInput) : Promise<{token: string}> {
    let client;
    try {
      client = await pool.connect();
      const user = await this.authRepo.findUserByUsername(data.username, client);
      if (!user) {
        throw new Error("User not found");
      }
      const isValid = await bcrypt.compare(data.password, user.password);
      if (!isValid) {
        throw new Error("Invalid password");
      }
      const user_role = await this.authRepo.findRoles(user.id, client);

      const token = jwt.sign({ id: user_role.id, role: user_role.role_name }, process.env.JWT_SECRET as string, { expiresIn: "2h" });
      return { token };
    } catch (error) {
      client?.query("ROLLBACK");
      throw error;
    } finally {
      client?.release();
    }
  }

  async registerUser (data: RegisterInput) : Promise<{token: string}> {
    let client;
    try {
      client = await pool.connect();
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const result = await this.authRepo.createUser(data.username, hashedPassword, client);
      await this.authRepo.insertUserRole(result.id, data.role_id, client);
      const user_role = await this.authRepo.findRoles(result.id, client);

      const token = jwt.sign({ id: result.id, role: user_role.role_name }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
      return { token }
    } catch (error) {
      client?.query("ROLLBACK");
      throw error;
    } finally {
      client?.release();
    }
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string) : Promise<void> {
    let client;
    try {
      client = await pool.connect();
      const user = await this.authRepo.findUserByUsername(userId, client);
      if (!user) {
        throw new Error("User not found");
      }
      const isValid = await bcrypt.compare(oldPassword, user.password);
      if (!isValid) {
        throw new Error("Invalid old password");
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      const query = `UPDATE master_user SET password = $1 WHERE id = $2`;
      await client.query(query, [hashedNewPassword, user.id]);
    } catch (error) {
      client?.query("ROLLBACK");
      throw error;
    } finally {
      client?.release();
    }
  }
}

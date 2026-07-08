import sql from "mssql";
import { poolPromise } from "../config/db";
import { User } from "../models/users/user.model";

export const findByEmail = async (email: string): Promise<User | null> => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("Email", sql.VarChar, email)
        .query(`
            SELECT *
            FROM Users
            WHERE Email = @Email
        `);

    if (result.recordset.length === 0) {
        return null;
    }

    return result.recordset[0] as User;
};

export const createUser = async(
    user: User
): Promise<User> => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("Name", sql.VarChar, user.name)
        .input("Email", sql.VarChar, user.email)
        .input("PasswordHash", sql.VarChar, user.passwordHash)
        .input("Role", sql.VarChar, user.role)
        .query(`
            INSERT INTO Users (Name, Email, PasswordHash, Role) OUTPUT INSERTED.*
            VALUES (@Name, @Email, @PasswordHash, @Role)`);
    return result.recordset[0] as User;
}
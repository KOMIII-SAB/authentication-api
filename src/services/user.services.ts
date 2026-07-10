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

    return {
        id: result.recordset[0].Id,
        name: result.recordset[0].Name,
        email: result.recordset[0].Email,
        passwordHash: result.recordset[0].PasswordHash,
        role: result.recordset[0].Role,
        refreshToken: result.recordset[0].RefreshToken,
        createdAt: result.recordset[0].CreatedAt
    };
};

export const createUser = async(user: User): Promise<User> => {
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

    return {
        id: result.recordset[0].Id,
        name: result.recordset[0].Name,
        email: result.recordset[0].Email,
        passwordHash: result.recordset[0].PasswordHash,
        role: result.recordset[0].Role,
        refreshToken: result.recordset[0].RefreshToken,
        createdAt: result.recordset[0].CreatedAt
    };
};

export const updateRefreshToken = async (userId: number, refreshToken: string): Promise<void> => {
    const pool = await poolPromise;

    await pool
    .request()
    .input("Id", sql.Int, userId)
    .input("RefreshToken", sql.VarChar, refreshToken)
    .query(`UPDATE Users SET RefreshToken = @RefreshToken WHERE Id = @Id`);
};

export const findByRefreshToken = async (refreshToken: string): Promise<User | null> => {
    const pool = await poolPromise;

    const result = await pool
        .request()
        .input("RefreshToken", sql.VarChar, refreshToken)
        .query(`SELECT * FROM Users WHERE RefreshToken = @RefreshToken`);

    if (result.recordset.length === 0){
        return null;
    }

    const user = result.recordset[0];

    return {
        id: user.Id,
        name: user.Name,
        email: user.Email,
        passwordHash: user.PasswordHash,
        role: user.Role,
        refreshToken: user.RefreshToken,
        createdAt: user.CreatedAt
    };
};
export interface User {
    id?: number;
    name: string;
    email: string;
    passwordHash: string;
    role: "admin" | "user";
    refreshToken?: string | null;
    createdAt?: Date;
}
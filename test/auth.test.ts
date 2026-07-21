/// <reference types="jest" />

import request from "supertest";
import app from "../src/app";
import { getPool } from "../src/config/db";
import jwt from "jsonwebtoken";
import { env } from "../src/config/env";


beforeEach(async () => {
    const pool = await getPool();

    await pool.request().query(`
        DELETE FROM Users
    `);
});


afterAll(async () => {
    const pool = await getPool();
    await pool.close();
});


describe("Authentication API", () => {


    it("should return API health status", async () => {

        const response = await request(app)
            .get("/");


        expect(response.status)
            .toBe(200);


        expect(response.body.message)
            .toBe("API is running");
    });



    it("should register a new user", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name:"Test User",
                email:"testuser@test.com",
                password:"123456"
            });


        expect(response.status)
            .toBe(201);


        expect(response.body.data)
            .toHaveProperty("email");


        expect(response.body.data.email)
            .toBe("testuser@test.com");

    });



    it("should not register duplicate email", async () => {

        const user = {
            name:"Test User",
            email:"duplicate@test.com",
            password:"123456"
        };


        await request(app)
            .post("/api/auth/register")
            .send(user);


        const response = await request(app)
            .post("/api/auth/register")
            .send(user);


        expect(response.status)
            .toBe(409);


        expect(response.body.message)
            .toBe("Email already exist");

    });



    it("should reject invalid email registration", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name:"Invalid",
                email:"wrongemail",
                password:"123456"
            });


        expect(response.status)
            .toBe(400);

    });



    it("should reject short password registration", async () => {

        const response = await request(app)
            .post("/api/auth/register")
            .send({
                name:"Short Password",
                email:"short@test.com",
                password:"123"
            });


        expect(response.status)
            .toBe(400);

    });



    it("should login successfully", async () => {

        const user = {
            name:"Login User",
            email:"login@test.com",
            password:"123456"
        };


        await request(app)
            .post("/api/auth/register")
            .send(user);


        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email:user.email,
                password:user.password
            });


        expect(response.status)
            .toBe(200);


        expect(response.body.success)
            .toBe(true);


        expect(response.body.data.accessToken)
            .toBeDefined();


        expect(response.body.data.refreshToken)
            .toBeDefined();

    });



    it("should reject login with wrong password", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email:"wrong@test.com",
                password:"wrong"
            });


        expect(response.status)
            .toBe(401);

    });



    it("should reject login with missing fields", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({});


        expect(response.status)
            .toBe(400);

    });



    it("should reject login with non existing email", async () => {

        const response = await request(app)
            .post("/api/auth/login")
            .send({
                email:"unknown@test.com",
                password:"123456"
            });


        expect(response.status)
            .toBe(401);

    });



    it("should access profile using valid token", async () => {

        await request(app)
            .post("/api/auth/register")
            .send({
                name:"Profile",
                email:"profile@test.com",
                password:"123456"
            });


        const login = await request(app)
            .post("/api/auth/login")
            .send({
                email:"profile@test.com",
                password:"123456"
            });


        const response = await request(app)
            .get("/api/user/profile")
            .set(
                "Authorization",
                `Bearer ${login.body.data.accessToken}`
            );


        expect(response.status)
            .toBe(200);

    });



    it("should reject profile without token", async () => {

        const response = await request(app)
            .get("/api/user/profile");


        expect(response.status)
            .toBe(401);

    });



    it("should reject invalid JWT", async () => {

        const response = await request(app)
            .get("/api/user/profile")
            .set(
                "Authorization",
                "Bearer invalid.token"
            );


        expect(response.status)
            .toBe(401);

    });



    it("should reject expired JWT", async () => {

        const token = jwt.sign(
            {
                id:1,
                role:"user"
            },
            env.JWT_SECRET,
            {
                expiresIn:"-1s"
            }
        );


        const response = await request(app)
            .get("/api/user/profile")
            .set(
                "Authorization",
                `Bearer ${token}`
            );


        expect(response.status)
            .toBe(401);

    });



    it("should refresh token successfully", async () => {

        await request(app)
            .post("/api/auth/register")
            .send({
                name:"Refresh",
                email:"refresh@test.com",
                password:"123456"
            });


        const login = await request(app)
            .post("/api/auth/login")
            .send({
                email:"refresh@test.com",
                password:"123456"
            });


        const response = await request(app)
            .post("/api/auth/refresh-token")
            .send({
                refreshToken:
                login.body.data.refreshToken
            });


        expect(response.status)
            .toBe(200);


        expect(response.body.data.accessToken)
            .toBeDefined();

    });



    it("should reject missing refresh token", async () => {

        const response = await request(app)
            .post("/api/auth/refresh-token")
            .send({});


        expect(response.status)
            .toBe(400);

    });



    it("should reject invalid refresh token", async () => {

        const response = await request(app)
            .post("/api/auth/refresh-token")
            .send({
                refreshToken:"invalid"
            });


        expect(response.status)
            .toBe(401);

    });



    it("should allow admin access", async () => {

        await request(app)
            .post("/api/auth/register")
            .send({
                name:"Admin",
                email:"admin@test.com",
                password:"123456"
            });


        const pool = await getPool();


        await pool.request()
            .input("email","admin@test.com")
            .query(`
                UPDATE Users
                SET role='admin'
                WHERE email=@email
            `);



        const login = await request(app)
            .post("/api/auth/login")
            .send({
                email:"admin@test.com",
                password:"123456"
            });



        const response = await request(app)
            .get("/api/admin/dashboard")
            .set(
                "Authorization",
                `Bearer ${login.body.data.accessToken}`
            );


        expect(response.status)
            .toBe(200);

    });



    it("should reject normal user accessing admin", async () => {

        await request(app)
            .post("/api/auth/register")
            .send({
                name:"User",
                email:"user@test.com",
                password:"123456"
            });



        const login = await request(app)
            .post("/api/auth/login")
            .send({
                email:"user@test.com",
                password:"123456"
            });



        const response = await request(app)
            .get("/api/admin/dashboard")
            .set(
                "Authorization",
                `Bearer ${login.body.data.accessToken}`
            );


        expect(response.status)
            .toBe(403);

    });



    it("should reject admin route without token", async()=>{

        const response = await request(app)
            .get("/api/admin/dashboard");


        expect(response.status)
            .toBe(401);

    });



    it("should handle server errors", async()=>{

        const response = await request(app)
            .get("/test-error");


        expect(response.status)
            .toBe(500);


        expect(response.body.success)
            .toBe(false);

    });

    it("should reject login with non existing user", async () => {

    const response = await request(app)
        .post("/api/auth/login")
        .send({
            email: "notexist@test.com",
            password: "123456"
        });


    expect(response.status)
        .toBe(401);

    expect(response.body.message)
        .toBe("Invalid email or password");

});

    it("should logout successfully", async () => {

        const user = {
            name: "Logout User",
            email: "logout@test.com",
            password: "123456"
        };


        await request(app)
            .post("/api/auth/register")
            .send(user);


        const loginResponse = await request(app)
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: user.password
            });


        const token = loginResponse.body.data.accessToken;


        const response = await request(app)
            .post("/api/auth/logout")
            .set(
                "Authorization",
                `Bearer ${token}`
            );


        expect(response.status)
            .toBe(200);


        expect(response.body.message)
            .toBe("Logout successful");

    });
});
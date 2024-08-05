import dotenv from "dotenv";
dotenv.config();

export const blockfrost_api_key = process.env.BLOCKFROST_API_KEY || "";

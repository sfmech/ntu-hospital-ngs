import { registerAs } from "@nestjs/config";

export const AppConfig = registerAs('app', () => ({
    host: process.env.APP_HOST,
    port: +process.env.APP_PORT || 3000,
}));
import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "Development" | "Production";
  JWT_ACCESS_SECRET: string;
  JWT_EXPIREDATE: string;
  BCRYPT_SALT_ROUNT: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CALLBACK: string;
  FONTEND_URL: string;
  EXPRESS_SESSION_SECRET: string;
}

const loadEnvVariables = (): EnvConfig => {
  const envRequreVariabls: string[] = [
    "PORT",
    "DB_URL",
    "NODE_ENV",
    "JWT_ACCESS_SECRET",
    "JWT_EXPIREDATE",
    "BCRYPT_SALT_ROUNT",
    "SUPER_ADMIN_EMAIL",
    "SUPER_ADMIN_PASSWORD",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "GOOGLE_CLIENT_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CALLBACK",
    "FONTEND_URL",
    "EXPRESS_SESSION_SECRET",
  ];
  envRequreVariabls.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Requre environment are missing ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    JWT_EXPIREDATE: process.env.JWT_EXPIREDATE as string,
    BCRYPT_SALT_ROUNT: process.env.BCRYPT_SALT_ROUNT as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET as string,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID as string,
    GOOGLE_CALLBACK: process.env.GOOGLE_CALLBACK as string,
    FONTEND_URL: process.env.FONTEND_URL as string,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
  };
};

export const envVars: EnvConfig = loadEnvVariables();

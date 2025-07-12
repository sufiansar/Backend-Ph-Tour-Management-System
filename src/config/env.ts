import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "Development" | "Production";
  JWT_ACCESS_SECRET: string;
  JWT_EXPIREDATE: string;
  BCRYPT_SALT_ROUNT: string;
  //   SUPER_ADMIN_EMAIL=suparadmin@gmail.com
  // SUPER_ADMIN_PASSWORD=suparadmin@321
  SUPER_ADMIN_EMAIL: string;
  SUPER_ADMIN_PASSWORD: string;
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
  };
};

export const envVars: EnvConfig = loadEnvVariables();

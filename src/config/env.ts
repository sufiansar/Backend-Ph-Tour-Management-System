import dotenv from "dotenv";

dotenv.config();

interface EnvConfig {
  PORT: string;
  DB_URL: string;
  NODE_ENV: "Development" | "Production";
}

const loadEnvVariables = (): EnvConfig => {
  const envRequreVariabls: string[] = ["PORT", "DB_URL", "NODE_ENV"];
  envRequreVariabls.forEach((key) => {
    if (!process.env[key]) {
      throw new Error(`Requre environment are missing ${key}`);
    }
  });
  return {
    PORT: process.env.PORT as string,
    DB_URL: process.env.DB_URL!,
    NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
  };
};

export const envVars: EnvConfig = loadEnvVariables();

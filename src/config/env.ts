import { z } from 'zod';

const envSchema = z.object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    JWT_SECRET: z.string().min(10, 'JWT_SECRET must be at least 10 characters'),
    JWT_EXPIRES_IN: z.string().default('24h'),
    PORT: z.string().default('4000').transform(Number),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    UPLOAD_DIR: z.string().default('uploads'),
    MAX_FILE_SIZE: z.string().default('5242880').transform(Number),
});

export type Env = z.infer<typeof envSchema>;

let env: Env;

export function validateEnv(): Env {
    try {
        env = envSchema.parse(process.env);
        return env;
    } catch (error) {
        if (error instanceof z.ZodError) {
            const messages = error.errors.map((e) => `  - ${e.path.join('.')}: ${e.message}`);
            console.error('❌ Environment validation failed:\n' + messages.join('\n'));
            process.exit(1);
        }
        throw error;
    }
}

export function getEnv(): Env {
    if (!env) {
        throw new Error('Environment not validated. Call validateEnv() first.');
    }
    return env;
}

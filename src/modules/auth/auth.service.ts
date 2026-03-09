import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';
import { getEnv } from '../../config/env';
import { ApiError } from '../../utils/ApiError';
import { LoginDto } from './auth.dto';

export class AuthService {
    async login(data: LoginDto) {
        const admin = await prisma.adminUser.findUnique({
            where: { username: data.username },
        });

        if (!admin) {
            throw ApiError.unauthorized('اسم المستخدم أو كلمة المرور غير صحيحة');
        }

        const isMatch = await bcrypt.compare(data.password, admin.password);
        if (!isMatch) {
            throw ApiError.unauthorized('اسم المستخدم أو كلمة المرور غير صحيحة');
        }

        const env = getEnv();
        const token = jwt.sign(
            { id: admin.id },
            env.JWT_SECRET,
            { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
        );

        return {
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                name: admin.name,
            },
        };
    }

    async getProfile(adminId: number) {
        const admin = await prisma.adminUser.findUnique({
            where: { id: adminId },
            select: {
                id: true,
                username: true,
                name: true,
                createdAt: true,
            },
        });

        if (!admin) {
            throw ApiError.notFound('المسؤول غير موجود');
        }

        return admin;
    }
}

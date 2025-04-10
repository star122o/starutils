import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type WhitelistUser = {
    userId: string;
};

class WhitelistManager {
    constructor() {};

    async add(userId: string): Promise<void> {
        await prisma.whitelist.create({
            data: {
                userId: userId,
            },
        });
    };

    async remove(userId: string): Promise<void> {
        await prisma.whitelist.delete({
            where: {
                userId: userId,
            },
        });
    };

    async getUser(userId: string): Promise<boolean> {
        const user = await prisma.whitelist.findUnique({
            where: {
                userId: userId,
            },
        });
        return user !== null;
    };

    async getAll(): Promise<string[]> {
        const users = await prisma.whitelist.findMany();
        return users.map((user: WhitelistUser) => user.userId);
    };
}

export default WhitelistManager;
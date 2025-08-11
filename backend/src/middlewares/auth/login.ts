import { createMiddleware } from "hono/factory";
import { CustomEnv, UserRole } from "../../types/types";
import { loginSchema } from "../../utils/zod/zod";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import getPrisma from "../../allClients/prismaClient/prisma";

const buyerSellerValidation = createMiddleware<CustomEnv>(async (c, next) => {
    const body = c.get("body") as {
        email: string,
        password: string
    }

    const result = loginSchema.safeParse({
        ...body
    })

    if (!result.success) {
        c.status(StatusCodes.LENGTH_REQUIRED);
        return c.json({
            msg: "Invalid Inputs sent",
            phrase: ReasonPhrases.LENGTH_REQUIRED,
            issues: result.error.issues,
            name: result.error.name
        })
    }

    c.set("body", result.data);
    await next();

})


const verifyCredentials = createMiddleware<CustomEnv>(async (c, next) => {
    const url: string = c.env.DATABASE_URL;

    const role = c.get("role");

    const payload = c.get("body") as {
        email: string,
        password: string
    }
    try {
        const response = role === UserRole.buyer ? await checkBuyer(payload, url) : await checkSeller(payload, url);

        if(!response) {
            return c.json({
                phrase: ReasonPhrases.UNAUTHORIZED,
                msg: "Either username eor password is incorret"
            }, StatusCodes.UNAUTHORIZED)
        }

        await next();
    } catch (error) {
        throw error;
    }
})

async function checkSeller(payload: { email: string, password: string }, url: string): Promise<boolean> {
    const prisma = getPrisma(url);
    try {
        const response = await prisma.seller.findUnique({
            where: {
                ...payload
            }
        })
        return response ? true : false
    } catch (error) {
        throw error
    }
}

async function checkBuyer(payload: { email: string, password: string }, url: string): Promise<boolean> {
    const prisma = getPrisma(url);
    try {
        const response = await prisma.buyer.findUnique({
            where: {
                ...payload
            }
        })
        return response ? true: false
    } catch (error) {
        throw error
    }
}

export {
    buyerSellerValidation, verifyCredentials
}
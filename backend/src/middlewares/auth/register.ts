import { createMiddleware } from "hono/factory";
import { UserRole, CustomEnv, RegisterBodySeller, RegisterBodyBuyer } from "../../types/types";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { buyerSchema, sellerSchema } from "../../utils/zod/zod";
import getPrisma from "../../allClients/prismaClient/prisma";
import { HttpError } from "../../utils/class/class";
import getResend from "../../allClients/resendClient/resend";


const roleStatus = createMiddleware<CustomEnv>(async (c, next) => {
    const { role } = c.req.param() as {
        role: string
    };


    if (!role || (role !== UserRole.buyer && role !== UserRole.seller)) {
        return c.json({
            msg: "Invalid Role sent",
            phrase: ReasonPhrases.BAD_REQUEST,
            role
        }, StatusCodes.BAD_GATEWAY)
    }
    c.set("role", role);
    await next();
});

const buyerSellerValidation = createMiddleware<CustomEnv>(async (c, next) => {
    const role = c.get("role");
    const body = c.get("body");

    const result = role === UserRole.buyer ? buyerSchema.safeParse(body) : sellerSchema.safeParse(body);

    if (!result.success) {
        return c.json({
            msg: "Invalid Inputs",
            phrase: ReasonPhrases.LENGTH_REQUIRED,
            issues: result.error.issues,
            name: result.error.name
        }, StatusCodes.LENGTH_REQUIRED)
    }

    await next();
});

const emailUnique = createMiddleware<CustomEnv>(async (c, next) => {
    const role = c.get("role");
    const { email } = role === UserRole.seller ? c.get("body") as RegisterBodySeller : c.get("body") as RegisterBodyBuyer;

    try {
        let findAny: boolean = false;
        const url: string = c.env.DATABASE_URL;
        if(role === UserRole.seller) {
            findAny = await checkSeller(email, url);
        } else {
            findAny = await checkBuyer(email, url);
        }

        if(findAny) {
            return c.json({
                phrase: ReasonPhrases.LENGTH_REQUIRED,
                msg: "Email already exist"
            }, StatusCodes.CONFLICT);
        }

        await next();
    } catch (error) {
        throw new HttpError(StatusCodes.INTERNAL_SERVER_ERROR, ReasonPhrases.INTERNAL_SERVER_ERROR, "Something up with the server");
    }
});

const otpToMail = createMiddleware<CustomEnv>(async (c, next) => {
    const resendKey = c.env.RESEND_API_KEY;
    const resend = getResend(resendKey);
    const body = c.get("body") as RegisterBodyBuyer | RegisterBodySeller;

    try {
        const response = await resend.emails.send({
            from: `Capri-Capital Verification Process <${c.env.email}>`,
            to: [body.email],
            subject: "Email Verification",
            html: "<b>1234</b>"
        });

        if(response.error) {
            return c.json({
                msg: "otp does not sent try again",
            });
        }

        await next();
    } catch (error) {
        throw error;
    }
})

async function checkBuyer(email: string, url: string): Promise<boolean> {
    try {
        const prisma = getPrisma(url);
        const response = await prisma.buyer.findUnique({
            where: {
                email
            }
        });
        return response ? true : false;
    } catch (error) {
        throw error;
    }
}

async function checkSeller(email: string, url: string): Promise<boolean> {
    try {
        const prisma = getPrisma(url);
        const response = await prisma.seller.findUnique({
            where: {
                email
            }
        })
        return response ? true : false;
    } catch (error) {
        throw error;
    }
}



export {
    roleStatus, buyerSellerValidation, emailUnique, otpToMail
}

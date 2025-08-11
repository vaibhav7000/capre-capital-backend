import { Hono } from "hono";
import { Bindings, RegisterBodyBuyer, RegisterBodySeller, UserRole, Variables } from "../../types/types";
import { buyerSellerValidation, emailUnique, otpToMail, roleStatus } from "../../middlewares/auth/register";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import getPrisma from "../../allClients/prismaClient/prisma";

// RegisterBodyBuyer | RegisterBodySeller

const storage: (RegisterBodyBuyer & {otp: string} | RegisterBodySeller & {otp: string} )[] = []

const app = new Hono<{
    Bindings: Bindings,
    Variables: Variables,
}>({ strict: true }).basePath("/:role");


app.use(async (c, next) => {
    const body = await c.req.json();
    c.set("body", body);
    await next();
})

app.use(roleStatus);

app.post('/', buyerSellerValidation, emailUnique, otpToMail, async c => {
    const role = c.get("role");
    const isSeller: boolean = role === UserRole.seller;
    const data = isSeller ? c.get("body") : c.get("body");

    if (isSeller) {
        const seller = data as RegisterBodySeller;

        storage.push({
            ...seller,
            otp: "1234"
        });

        return c.json({
            msg: "Ok",
            phrase: ReasonPhrases.OK,
            seller,
        }, StatusCodes.OK)
    } else {
        const buyer = data as RegisterBodyBuyer;

        storage.push({
            ...buyer,
            otp: "1234"
        });

        return c.json({
            msg: "Ok",
            phrase: ReasonPhrases.OK,
            buyer
        }, StatusCodes.OK)
    }
})

app.post("/verify", async c => {
    const role = c.get("role");
    const isSeller: boolean = role === UserRole.seller;
    const data = (isSeller ? c.get("body") : c.get("body")) as {
        email: string,
        otp: string
    };
    const prisma = getPrisma(c.env.DATABASE_URL);

    const index = storage.findIndex(user => user.email === data.email);

    if(index === -1) {
        return c.json({
            msg: "otp expired"
        })
    };

    if(storage[index].otp !== data.otp) {
        return c.json({
            msg: "otp incorrect"
        })
    }

    if (isSeller) {
        const seller = storage[index] as RegisterBodySeller;
        try {
            const dbUser = await prisma.seller.create({
                data: {
                    email: seller["email"],
                    firstname: seller["email"],
                    lastname: seller["lastname"],
                    password: seller["password"]
                }
            });

            try {
                const business = await prisma.business.create({
                    data: {
                        type: seller["type"],
                        value: seller["value"],
                        reason: seller["reason"],
                        sellTime: seller["sellTime"],
                        sellerId: dbUser.id
                    }
                })
                storage.splice(index, 1);
                return c.json({
                    msg: "Seller created in Database",
                    phrase: ReasonPhrases.CREATED,
                    seller: dbUser,
                    business
                }, StatusCodes.CREATED);

            } catch (error) {
                throw error;
            }
        } catch (error) {
            throw error;
        }
    } else {
        const buyer = storage[index] as RegisterBodyBuyer

        try {
            const dbUser = await prisma.buyer.create({
                data: {
                    email: buyer["email"],
                    firstname: buyer["firstname"],
                    lastname: buyer["lastname"],
                    password: buyer["password"]
                }
            })

            try {
                const interest = await prisma.interest.create({
                    data: {
                        type: buyer["type"],
                        budget: buyer["budget"],
                        buyTime: buyer["buyTime"],
                        buyerId: dbUser["id"]
                    }
                })
                storage.splice(index, 1);
                return c.json({
                    msg: "Buyer created in Database",
                    phrase: ReasonPhrases.CREATED,
                    buyer: dbUser,
                    interest
                }, StatusCodes.CREATED);
            } catch (error) {
                throw error;
            }
        } catch (error) {
            throw error;
        }
    }
})

export default app;
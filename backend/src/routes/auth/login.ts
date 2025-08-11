import { Hono } from "hono";
import { sign, decode, verify } from "hono/jwt";
import { CustomEnv, UserRole } from "../../types/types";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { buyerSellerValidation, verifyCredentials } from "../../middlewares/auth/login";
import { JWTPayload } from "hono/utils/jwt/types";

const app = new Hono<CustomEnv>({
    strict: true
}).basePath("/:role");

app.use(async (c, next) => {
    const body = await c.req.json();
    c.set("body", body);
    await next();
})

app.use(async (c, next) => {
    const {role} = c.req.param() as {
        role: string
    }

    if(role !== UserRole.buyer && role !== UserRole.seller) {
        c.status(StatusCodes.BAD_REQUEST);

        return c.json({
            msg: "Invalid user",
            phrase: ReasonPhrases.BAD_REQUEST,
            role
        })
    }

    c.set("role", role);
    
    await next();
})


app.post("/password", buyerSellerValidation, verifyCredentials, async c => {
    const payload = c.get("body") as {
        email: string,
        password: string,
    };

    const secret = c.env.JWT_SECRET;
    
    const token: string = await sign(payload, secret)

    return c.json({
        msg: "Login Successfull",
        phrase: ReasonPhrases.OK,
        token
    },StatusCodes.OK)
})

export default app;
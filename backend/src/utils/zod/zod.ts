import * as z from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>\/?\\|`~]).+$/;

const sellerSchema = z.object({
    email: z.email({
        error: "Invalid email"
    }),
    firstname: z.string({
        error: "Invalid firstname"
    }),
    lastname: z.string({
        error: "Invalid lastname"
    }),
    password: z.string().min(8, {
        error: "Password must be atleast 8 characters long",
    }).regex(passwordRegex, {
        error: "Password must include upper, lower, number, and symbol"
    }),
    type: z.string(),
    value: z.number(),
    reason: z.string(),
    sellTime: z.number(),
});

const buyerSchema = z.object({
    email: z.email({
        error: "Invalid email"
    }),
    firstname: z.string({
        error: "Invalid firstname"
    }),
    lastname: z.string({
        error: "Invalid lastname"
    }),
    password: z.string().min(8, {
        error: "Password must be atleast 8 characters long",
    }).regex(passwordRegex, {
        error: "Password must include upper, lower, number, and symbol"
    }),
    type: z.string(),
    budget: z.number(),
    buyTime: z.number(),
})


const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(8, {
        error: "Password must be atleast 8 characters long",
    }).regex(passwordRegex, {
        error: "Password must include upper, lower, number, and symbol"
    })
})

export {
    sellerSchema, buyerSchema, loginSchema
}


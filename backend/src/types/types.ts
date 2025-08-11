type Variables = {
    role: string,
    body: unknown,
}

type Bindings = {
    DATABASE_URL: string;
    RESEND_API_KEY: string;
    email: string;
    emailKey: string;
    JWT_SECRET: string;
}

enum UserRole {
    buyer = "buyer",
    seller = "seller"
}

type CustomEnv = {
    Variables: Variables,
    Bindings: Bindings
}

type RegisterUser = {
    email: string;
    firstname: string;
    lastname: string;
    password: string;
}

type RegisterBodySeller = RegisterUser & {
    type: string;
    value: number;
    reason: string;
    sellTime: number;
}

type RegisterBodyBuyer = RegisterUser & {
    type: string;
    budget: number;
    buyTime: number
}



export {
    Variables, Bindings, UserRole, CustomEnv, RegisterBodySeller, RegisterBodyBuyer
}
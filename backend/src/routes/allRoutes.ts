import { Hono } from "hono";
import { Bindings, Variables } from "../types/types";
import registerRouter from "./auth/register";
import loginRouter from "./auth/login";

const app = new Hono<{
    Bindings: Bindings,
    Variables: Variables
}>({strict: true});


app.route("/register", registerRouter);

app.route("/login", loginRouter);


export default app;
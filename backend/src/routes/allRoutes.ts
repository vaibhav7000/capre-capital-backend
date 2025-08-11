import { Hono } from "hono";
import { Bindings, Variables } from "../types/types";
import registerRoute from "./auth/register";

const app = new Hono<{
    Bindings: Bindings,
    Variables: Variables
}>({strict: true});


app.route("/register", registerRoute);


export default app;
import { sign, verify, decode } from "hono/jwt";
import { JWTPayload } from "hono/utils/jwt/types";

const getToken = async (secret: string, payload: JWTPayload) => {
    return await sign(payload, secret);
}

const verifyToken = async (secret: string, token: string) => {
    try {
        const response = await verify(token, secret);
        return true
    } catch(error) {
        return false
    }
}

const decodeToken = async () => {

}

export {
    getToken, verifyToken, decodeToken
}
import { Resend } from "resend";

const getResend = (apiKey: string) => {
    const resend = new Resend(apiKey);
    return resend;
}


export default getResend;
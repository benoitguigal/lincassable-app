import brevo, { SendSmtpEmail } from "npm:@getbrevo/brevo";

const brevoClient = new brevo.TransactionalEmailsApi();
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");

if (BREVO_API_KEY) {
  const apiKey = brevoClient.authentications["apiKey"];
  apiKey.apiKey = BREVO_API_KEY;
}

function sendTransacEmail(sendSmtpEmail: SendSmtpEmail) {
  if (BREVO_API_KEY) {
    return brevoClient.sendTransacEmail(sendSmtpEmail);
  }
  return null;
}

export { sendTransacEmail };

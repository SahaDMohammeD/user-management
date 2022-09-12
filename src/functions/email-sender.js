import sgMail from "@sendgrid/mail";
import { SENDGRID_API, HOST_EMAIL } from "../constants";

sgMail.setApiKey(SENDGRID_API);

const sendMail = async (email, subject, text, html) => {
  try {
    const msg = {
      html,  
      text,
      subject,
      to: email,
      from: HOST_EMAIL,
    };
    await sgMail.send(msg);
    console.log("MAIL_SEND");
  } catch (error) {
    console.log("ERROR_MAILING.. ", error.message);
  } finally {
    return;
  }
};

export default sendMail;

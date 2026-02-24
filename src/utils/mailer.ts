import nodemailer from "nodemailer";

type SendMailInput = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,                 // vd: "smtp.gmail.com"
  port: Number(process.env.SMTP_PORT ?? 587),  // 587 (STARTTLS) hoặc 465 (SSL)
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMail({ to, subject, text, html }: SendMailInput) {
  const info = await transporter.sendMail({
    from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });

  return info.messageId;
}
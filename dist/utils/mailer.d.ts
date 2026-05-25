type SendMailInput = {
    to: string;
    subject: string;
    text?: string;
    html?: string;
};
export declare function sendMail({ to, subject, text, html }: SendMailInput): Promise<string>;
export {};
//# sourceMappingURL=mailer.d.ts.map
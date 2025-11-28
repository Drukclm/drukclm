import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabaseClinent'; // Make sure this path is correct

// Fetch config email and password from Supabase
async function getConfigEmailAndPass(): Promise<{ email: string; pass: string }> {
    const { data, error } = await supabase
        .from('config')
        .select('meta_key, meta_value')
        .in('meta_key', ['config_email', 'config_email_pass']);
    if (error || !data) throw new Error('Config email/pass not found');
    const emailRow = data.find((row: any) => row.meta_key === 'config_email');
    const passRow = data.find((row: any) => row.meta_key === 'config_email_pass');
    if (!emailRow || !passRow) throw new Error('Config email/pass missing');
    return { email: emailRow.meta_value, pass: passRow.meta_value };
}

/**
 * Send email to multiple recipients using Outlook SMTP.
 * @param toEmails - Array of recipient emails.
 * @param subject - Email subject.
 * @param body - Email body (HTML or plain text).
 */
export async function sendEmail(
    toEmails: string[],
    subject: string,
    body: string
): Promise<any> {
    const { email: senderEmail, pass: senderPass } = await getConfigEmailAndPass();

    // Outlook SMTP settings
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: senderEmail,
            pass: senderPass,
        },
    });

    const mailOptions = {
        from: senderEmail,
        to: toEmails.join(','),
        subject,
        html: body,
    };

    return transporter.sendMail(mailOptions);
}
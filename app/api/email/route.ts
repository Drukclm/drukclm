import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { supabase } from '@/lib/supabaseClinent';

async function getConfigEmailAndPass() {
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

export async function POST(req: Request) {
    const { toEmails, subject, body } = await req.json();
    const { email: senderEmail, pass: senderPass } = await getConfigEmailAndPass();

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

    try {
        await transporter.sendMail(mailOptions);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
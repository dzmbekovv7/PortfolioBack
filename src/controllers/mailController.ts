import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendEmail = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_USER,
      subject: `Письмо от ${name}`,
      html: `
        <h3>Имя: ${name}</h3>
        <p>Email: ${email}</p>
        <p>Сообщение: ${message}</p>
      `,
    });

    res.status(200).json({ success: true, message: 'Письмо отправлено!' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Ошибка отправки письма.' });
  }
};

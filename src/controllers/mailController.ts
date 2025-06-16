import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import {
  saveVerificationCode,
  getVerificationCode,
  deleteVerificationCode,
} from '../config/verificationService';

dotenv.config();

export const sendVerificationCode = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
  res.status(400).json({ message: 'Email is required' });
  return 
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000;

  await saveVerificationCode(email, code, expiresAt);

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Verification Code',
      html: `<p>Your verification code is: <strong>${code}</strong></p>`,
    });

    res.status(200).json({ success: true, message: 'Verification code sent!' });
    return 
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send verification code.' });
    return 
  }
};
export const verifyAndSendMessage = async (req: Request, res: Response): Promise<void> => {
  const { name, email, message, code, step } = req.body;

  if (step === 'code') {
    // Проверяем код
    const stored = await getVerificationCode(email);
    if (!stored || stored.code !== code || stored.expires_at < Date.now()) {
      res.status(400).json({ success: false, message: 'Invalid or expired verification code' });
      return;
    }
    res.status(200).json({ success: true, message: 'Code verified' });
    return;
  } else if (step === 'message') {
    // На этом шаге просто отправляем сообщение, не проверяя код
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_USER, // лучше ставить почту отправителя сервера
        to: process.env.EMAIL_USER,
        subject: `Message from ${name}`,
        html: `
          <h3>Name: ${name}</h3>
          <p>Email: ${email}</p>
          <p>Message: ${message}</p>
        `,
      });

      // Удаляем код после отправки сообщения
      await deleteVerificationCode(email);
      res.status(200).json({ success: true, message: 'Message sent successfully!' });
      return;
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).json({ success: false, message: 'Failed to send message.' });
      return;
    }
  } else {
    res.status(400).json({ success: false, message: 'Invalid step' });
  }
};

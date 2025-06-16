import { pool } from './db';

export async function saveVerificationCode(email: string, code: string, expiresAt: number) {
  await pool.query(
    `
    INSERT INTO verification_codes (email, code, expires_at)
    VALUES ($1, $2, $3)
    ON CONFLICT (email)
    DO UPDATE SET code = EXCLUDED.code, expires_at = EXCLUDED.expires_at
    `,
    [email, code, expiresAt]
  );
}

export async function getVerificationCode(email: string) {
  const result = await pool.query(
    `SELECT code, expires_at FROM verification_codes WHERE email = $1`,
    [email]
  );
  return result.rows[0] || null;
}

export async function deleteVerificationCode(email: string) {
  await pool.query(`DELETE FROM verification_codes WHERE email = $1`, [email]);
}

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const DEFAULT_SECRET = "notesspace-sanctuary-secret-key-12345";
const secretKey = process.env.AUTH_SECRET || DEFAULT_SECRET;
const key = new TextEncoder().encode(secretKey);

export interface AuthSession {
  userId: string;
  email: string;
  expires: string | number | Date;
  user?: {
    id: string;
  };
}

export async function encrypt(payload: AuthSession | Record<string, unknown>) {
  return await new SignJWT(payload as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function decrypt(input: string): Promise<AuthSession> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload as unknown as AuthSession;
}

export async function setSession(userId: string, email: string) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, email, expires });

  const cookieStore = await cookies();
  cookieStore.set("session", session, { 
    expires, 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0), path: '/' });
}

export async function getSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  try {
    return await decrypt(session);
  } catch {
    return null;
  }
}

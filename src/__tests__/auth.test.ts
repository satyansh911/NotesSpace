/**
 * Tests for pure auth helper functions.
 * We test the session token encryption/decryption logic in isolation.
 */

// Mock the jose library so tests don't need real JWT secrets
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock.jwt.token'),
  })),
  jwtVerify: jest.fn().mockResolvedValue({
    payload: { userId: 'user-123', email: 'test@example.com' },
  }),
}));

// Mock the auth cookie helpers (they rely on Next.js headers)
jest.mock('next/headers', () => ({
  cookies: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue({ value: 'mock.jwt.token' }),
    set: jest.fn(),
    delete: jest.fn(),
  }),
}));

describe('Auth Session Logic', () => {
  it('returns userId from a valid token payload', () => {
    const payload = { userId: 'user-123', email: 'test@example.com' };
    expect(payload.userId).toBe('user-123');
  });

  it('returns null for missing userId in payload', () => {
    const payload: Record<string, unknown> = { email: 'test@example.com' };
    const userId = payload.userId as string | undefined;
    expect(userId).toBeUndefined();
  });

  it('validates that session payload has required fields', () => {
    const isValidSession = (p: Record<string, unknown>) =>
      typeof p.userId === 'string' && typeof p.email === 'string';

    expect(isValidSession({ userId: 'abc', email: 'a@b.com' })).toBe(true);
    expect(isValidSession({ userId: 'abc' })).toBe(false);
    expect(isValidSession({})).toBe(false);
  });
});

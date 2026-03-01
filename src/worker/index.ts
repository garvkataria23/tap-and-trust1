import { Hono } from "hono";
import { setCookie } from "hono/cookie";

interface Env {
  Variables: {
    userId?: string;
  };
}

const app = new Hono<{ Bindings: Env }>();

// Simple mock authentication for development
const SESSION_TOKEN_COOKIE = "tap_trust_session";

// Mock authentication endpoint for local development
app.get("/api/oauth/google/redirect_url", async (c) => {
  // Generate a mock auth code
  const mockCode = `mock_code_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const redirectUri = `${c.req.header("origin") || "http://localhost:5173"}/auth/callback`;
  
  // Redirect directly to callback with mock code
  const mockAuthUrl = `${redirectUri}?code=${mockCode}&state=mock`;
  
  return c.json({ redirectUrl: mockAuthUrl }, 200);
});

// Exchange the code for a session token
app.post("/api/sessions", async (c) => {
  const body = await c.req.json();

  if (!body.code) {
    return c.json({ error: "No authorization code provided" }, 400);
  }

  // Handle mock authentication for development
  if (body.code.startsWith("mock_")) {
    const mockSessionToken = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    setCookie(c, SESSION_TOKEN_COOKIE, mockSessionToken, {
      httpOnly: true,
      path: "/",
      sameSite: "none",
      secure: true,
      maxAge: 60 * 24 * 60 * 60,
    });
    return c.json({ success: true }, 200);
  }

  // For production: would implement actual OAuth exchange
  return c.json({ success: false, error: "Invalid code" }, 400);
});

// Log out the user
app.get("/api/logout", async (c) => {
  setCookie(c, SESSION_TOKEN_COOKIE, "", {
    httpOnly: true,
    path: "/",
    sameSite: "none",
    secure: true,
    maxAge: 0,
  });

  return c.json({ success: true }, 200);
});

// Health check
app.get("/api/health", async (c) => {
  return c.json({ status: "ok", message: "Tap & Trust API is running" }, 200);
});

export default app;


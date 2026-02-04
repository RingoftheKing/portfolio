// by passing the client request to this server side route, 
// we don't worry about CORS issues or exposing the api url to the client
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Forward to backend API for authentication
    // Server-side fetch requires absolute URLs (not relative paths)
    let backendUrl: string;
    
    if (process.env.NODE_ENV === 'production') {
      // In Docker, use the service name directly
      backendUrl = 'http://server:3000/auth/login';
    } else {
      // In development, use localhost backend directly
      // Or use BACKEND_URL env var if set
      const backendHost = process.env.BACKEND_URL || 'http://localhost:3000';
      backendUrl = `${backendHost}/auth/login`;
    }

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({ token: data.token || "authenticated" });
    } else {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || "Invalid credentials" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed. Please try again." },
      { status: 500 }
    );
  }
}

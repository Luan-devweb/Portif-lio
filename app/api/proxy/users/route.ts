import { NextResponse } from "next/server";

const RAW_API =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api-node-portif-lio.onrender.com/api";
const BASE = RAW_API.replace(/\/$/, "");
const API_URL = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

export async function GET(request: Request) {
  try {
    const upstream = await fetch(`${API_URL}/users`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const text = await upstream.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {}

    return NextResponse.json(data ?? [], { status: upstream.status });
  } catch (err) {
    return NextResponse.json({ error: "Proxy GET failed" }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json().catch(() => ({}));

    const upstream = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    });

    const text = await upstream.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {}

    return NextResponse.json(data ?? {}, { status: upstream.status });
  } catch (err) {
    return NextResponse.json({ error: "Proxy POST failed" }, { status: 502 });
  }
}

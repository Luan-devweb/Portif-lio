import { NextResponse } from "next/server";

const RAW_API =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api-node-portif-lio.onrender.com/api";
const BASE = RAW_API.replace(/\/$/, "");
const API_URL = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const upstream = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    const text = await upstream.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {}

    return NextResponse.json(data ?? { ok: upstream.ok }, { status: upstream.status });
  } catch (err) {
    return NextResponse.json({ error: "Proxy DELETE failed" }, { status: 502 });
  }
}
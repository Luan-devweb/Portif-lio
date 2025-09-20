import { NextResponse } from "next/server";

const RAW_API =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api-node-portif-lio.onrender.com/api";
const BASE = RAW_API.replace(/\/$/, "");
const API_URL = BASE.endsWith("/api") ? BASE : `${BASE}/api`;

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const body = await req.json().catch(() => null);
    const auth = req.headers.get("authorization") || undefined;

    const upstream = await fetch(`${API_URL}/adm/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    const text = await upstream.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {}

    return NextResponse.json(data ?? { ok: upstream.ok }, {
      status: upstream.status,
    });
  } catch (err) {
    return NextResponse.json({ error: "Proxy put failed" }, { status: 502 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const auth = req.headers.get("authorization") || undefined;

    const upstream = await fetch(`${API_URL}/adm/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        ...(auth ? { Authorization: auth } : {}),
      },
      cache: "no-store",
    });

    const text = await upstream.text();
    let data: any = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {}

    return NextResponse.json(data ?? { ok: upstream.ok }, {
      status: upstream.status,
    });
  } catch (err) {
    return NextResponse.json({ error: "Proxy delete failed" }, { status: 502 });
  }
}
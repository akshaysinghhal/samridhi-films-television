import { verifyAdmin, authedJson, adminDb } from "../../../../lib/adminAuth";

export async function GET(request) {
  const user = await verifyAdmin(request);
  const denied = authedJson(user); if (denied) return denied;
  const { data, error } = await adminDb().from("artists").select("*").order("sort").order("created_at");
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ artists: data });
}

export async function POST(request) {
  const user = await verifyAdmin(request);
  const denied = authedJson(user); if (denied) return denied;
  const b = await request.json();
  const { data, error } = await adminDb().from("artists").insert({
    name: b.name, category: b.category || "", image_url: b.image_url || null, sort: b.sort || 0,
  }).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ artist: data });
}

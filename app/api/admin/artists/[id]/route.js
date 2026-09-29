import { verifyAdmin, authedJson, adminDb } from "../../../../../lib/adminAuth";

export async function PUT(request, { params }) {
  const user = await verifyAdmin(request);
  const denied = authedJson(user); if (denied) return denied;
  const b = await request.json();
  const { data, error } = await adminDb().from("artists").update({
    name: b.name, category: b.category || "", image_url: b.image_url || null, sort: b.sort || 0,
  }).eq("id", params.id).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ artist: data });
}

export async function DELETE(request, { params }) {
  const user = await verifyAdmin(request);
  const denied = authedJson(user); if (denied) return denied;
  const { error } = await adminDb().from("artists").delete().eq("id", params.id);
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

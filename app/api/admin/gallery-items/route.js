import { verifyAdmin, authedJson, adminDb } from "../../../../lib/adminAuth";

export async function GET(request) {
  const user = await verifyAdmin(request);
  const denied = authedJson(user); if (denied) return denied;
  const { data, error } = await adminDb().from("gallery_items").select("*").order("sort").order("created_at", { ascending: false });
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ items: data });
}

export async function POST(request) {
  const user = await verifyAdmin(request);
  const denied = authedJson(user); if (denied) return denied;
  const body = await request.json();
  const { data, error } = await adminDb().from("gallery_items").insert({
    kind: body.kind === "video" ? "video" : "photo",
    title: body.title || "",
    image_url: body.image_url || "",
    video_url: body.video_url || null,
    sort: body.sort || 0,
  }).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ item: data });
}

export async function PUT(request) {
  const user = await verifyAdmin(request);
  const denied = authedJson(user); if (denied) return denied;
  const body = await request.json();
  const { data, error } = await adminDb().from("gallery_items")
    .update({ title: body.title ?? "", sort: body.sort ?? 0 })
    .eq("id", body.id).select().single();
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ item: data });
}

export async function DELETE(request) {
  const user = await verifyAdmin(request);
  const denied = authedJson(user); if (denied) return denied;
  const { searchParams } = new URL(request.url);
  const { error } = await adminDb().from("gallery_items").delete().eq("id", searchParams.get("id"));
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ ok: true });
}

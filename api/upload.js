import { put } from "@vercel/blob";

export async function POST(request) {
  try {
    const name = new URL(request.url).searchParams.get("name") || "foto.jpg";
    const type = request.headers.get("content-type") || "";
    if (!type.startsWith("image/")) {
      return Response.json({ error: "File harus berupa gambar." }, { status: 400 });
    }
    const body = Buffer.from(await request.arrayBuffer());
    if (body.length > 4 * 1024 * 1024) {
      return Response.json({ error: "Ukuran foto maksimal 4 MB." }, { status: 413 });
    }
    const blob = await put("stok/" + name, body, {
      access: "public",
      addRandomSuffix: true,
      contentType: type,
    });
    return Response.json({ url: blob.url });
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 500 });
  }
}
import { BlobServiceClient } from "@azure/storage-blob";
import { randomUUID } from "node:crypto";

// Menerima foto dari aplikasi, menyimpannya ke Azure Blob Storage (object storage),
// lalu mengembalikan URL publiknya.
// Butuh environment variable di Vercel:
//   AZURE_STORAGE_CONNECTION_STRING  (wajib)
//   AZURE_CONTAINER                  (opsional, default: foto-stok)
export async function POST(request) {
  try {
    const conn = process.env.AZURE_STORAGE_CONNECTION_STRING;
    if (!conn) {
      return Response.json({ error: "AZURE_STORAGE_CONNECTION_STRING belum diatur di Vercel." }, { status: 500 });
    }
    const type = request.headers.get("content-type") || "";
    if (!type.startsWith("image/")) {
      return Response.json({ error: "File harus berupa gambar." }, { status: 400 });
    }
    const body = Buffer.from(await request.arrayBuffer());
    if (body.length > 4 * 1024 * 1024) {
      return Response.json({ error: "Ukuran foto maksimal 4 MB." }, { status: 413 });
    }
    const container = BlobServiceClient.fromConnectionString(conn)
      .getContainerClient(process.env.AZURE_CONTAINER || "foto-stok");
    const blob = container.getBlockBlobClient(`stok/${Date.now()}-${randomUUID().slice(0, 8)}.jpg`);
    await blob.uploadData(body, { blobHTTPHeaders: { blobContentType: type } });
    return Response.json({ url: blob.url });
  } catch (e) {
    return Response.json({ error: String(e.message || e) }, { status: 500 });
  }
}

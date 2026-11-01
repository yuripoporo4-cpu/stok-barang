# Stok Barang

Aplikasi stok barang (portrait, untuk HP). Data stok disimpan di browser (localStorage), foto barang disimpan di Azure Blob Storage lewat `api/upload.js`. Hosting di Vercel.

Environment variable di Vercel:
- `AZURE_STORAGE_CONNECTION_STRING`
- `AZURE_CONTAINER` (opsional, default `foto-stok`)

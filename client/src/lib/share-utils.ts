/**
 * Senior-level utility for client-side data compression in URLs.
 * Uses native CompressionStream (Deflate) and URL-safe Base64.
 */

export async function compressData(data: object): Promise<string> {
  try {
    const str = JSON.stringify(data);
    const uint8Text = new TextEncoder().encode(str);
    
    // Create a compression stream
    const cs = new CompressionStream('deflate');
    const writer = cs.writable.getWriter();
    writer.write(uint8Text);
    writer.close();
    
    const compressedBuffer = await new Response(cs.readable).arrayBuffer();
    
    // Convert to URL-safe Base64
    const uint8Array = new Uint8Array(compressedBuffer);
    let binary = '';
    for (let i = 0; i < uint8Array.byteLength; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return btoa(binary)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  } catch (e) {
    console.error('Compression failed', e);
    return '';
  }
}

export async function decompressData(base64: string): Promise<any> {
  try {
    // Restore Base64 padding and characters
    const safeBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(safeBase64);
    const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
    
    // Create a decompression stream
    const ds = new DecompressionStream('deflate');
    const writer = ds.writable.getWriter();
    writer.write(bytes);
    writer.close();
    
    const decompressedBuffer = await new Response(ds.readable).arrayBuffer();
    const decodedText = new TextDecoder().decode(decompressedBuffer);
    
    return JSON.parse(decodedText);
  } catch (e) {
    console.error('Decompression failed', e);
    return null;
  }
}

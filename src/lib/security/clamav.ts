import "server-only";

import { createConnection } from "node:net";

const MAX_SCAN_BYTES = 10 * 1024 * 1024;

export async function scanBuffer(buffer: Uint8Array): Promise<"clean"> {
  if (buffer.byteLength > MAX_SCAN_BYTES) throw new Error("File exceeds malware scan limit");
  const host = process.env.CLAMAV_HOST;
  const isDev = process.env.NODE_ENV !== "production";

  if (!host) {
    if (isDev) {
      console.warn("CLAMAV_HOST is not configured. Bypassing malware scan in development mode.");
      return "clean";
    }
    throw new Error("CLAMAV_HOST is required before accepting attachments");
  }
  const port = Number(process.env.CLAMAV_PORT ?? 3310);

  try {
    const result = await new Promise<string>((resolve, reject) => {
      const socket = createConnection({ host, port });
      let response = "";
      socket.setTimeout(15_000);
      socket.on("connect", () => {
        socket.write("zINSTREAM\0");
        const size = Buffer.allocUnsafe(4);
        size.writeUInt32BE(buffer.byteLength);
        socket.write(size);
        socket.write(buffer);
        socket.end(Buffer.alloc(4));
      });
      socket.on("data", (chunk) => (response += chunk.toString("utf8")));
      socket.on("end", () => resolve(response));
      socket.on("timeout", () => socket.destroy(new Error("ClamAV scan timed out")));
      socket.on("error", reject);
    });

    if (!result.includes("OK")) throw new Error("Attachment rejected by malware scanner");
    return "clean";
  } catch (error) {
    if (isDev) {
      console.warn("ClamAV malware scanner connection failed or timed out. Bypassing scan in development mode.", error);
      return "clean";
    }
    throw error;
  }
}

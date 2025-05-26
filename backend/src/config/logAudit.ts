import { pool } from "./database";
import { Request, Response, NextFunction } from "express";

const auditMiddleware = ({
  changes_category = "API_ACCESS",
  table_name = null,
  table_id = null,
}) => {
  return async (req : Request, res : Response, next : NextFunction) => {
    const chunks: Buffer[] = [];
    const defaultIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    // Simpan original send
    const originalSend = res.send;

    // Override send untuk menangkap response body
    res.send = function (...args: [body?: any]) {
    const chunk = args[0];
    if (chunk)
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    return originalSend.apply(this, args);
    };

    res.on("finish", async () => {

      const responseBody = Buffer.concat(chunks).toString("utf8");

      let client;
      try {
        client = await pool.connect();

        await client.query(
          `INSERT INTO audit_log 
            (changes_category, ip_requester, requester_user_id, api_url, api_header, 
             json_data_request, json_data_response, table_name, table_id, 
             status, ts_insert)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
          [
            changes_category,
            defaultIP,
            req.user?.id || null,
            req.originalUrl,
            JSON.stringify(req.headers),
            JSON.stringify(req.body),
            responseBody,
            table_name,
            table_id,
            res.statusCode < 400 ? "A" : "E",
          ]
        );
      } catch (err) {
        console.error("Failed to write audit log:", err);
      } finally {
        client?.release();
      }
    });

    next();
  };
};

module.exports = { auditMiddleware };

//cara pakai di routes
// auditMiddleware({ changes_category: "ORDER_CREATE", table_name: "orders", table_id: null })

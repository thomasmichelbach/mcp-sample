import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { z } from "zod";
import type { IncomingMessage, ServerResponse } from "http";

function createServer() {
  const server = new McpServer({
    name: "thomas-mcp-sample",
    version: "0.1.0",
  });

  // ✅ Register a tool
  server.tool(
    "get_colors",
    "Get the colors for a brand",
    { brand: z.string().describe("Brand") },
    async ({ brand }) => ({
      content: [{ type: "text", text: `Color for ${brand}: is red` }],
    }),
  );

  /* ✅ Register a resource
  server.resource("docs://readme", "README", async () => ({
    contents: [{ uri: "docs://readme", text: "# My MCP Server\nHello world!" }],
  }));

  // ✅ Register a prompt
  server.prompt("summarize", { text: z.string() }, ({ text }) => ({
    messages: [
      { role: "user", content: { type: "text", text: `Summarize: ${text}` } },
    ],
  }));*/

  return server;
}

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, mcp-session-id");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const server = createServer();
  const transport = new StreamableHTTPServerTransport({});

  await server.connect(transport as any);
  await transport.handleRequest(req, res);
}

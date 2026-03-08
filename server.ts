import http from "http";
import handler from "./api/mcp";

const server = http.createServer(handler);
server.listen(3000, () => {
  console.log("MCP server running at http://localhost:3000/mcp");
});

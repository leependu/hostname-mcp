#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import os from "os";

/**
 * Hostname MCP Server
 * 
 * A lightweight MCP server focused on hostname detection with system information.
 * Perfect for Claude to automatically identify which machine it's working with.
 * 
 * Security Note: This server only reads system information and never executes
 * arbitrary commands or accesses sensitive data.
 */

// Create the MCP server
const server = new McpServer({
  name: "hostname-mcp",
  version: "2.0.0"
});

/**
 * Get basic hostname - the primary goal!
 */
server.registerTool(
  "get_hostname",
  {
    title: "Get System Hostname",
    description: "Get the hostname/computer name of the current system",
    inputSchema: {}
  },
  async () => {
    const hostname = os.hostname();
    return {
      content: [{
        type: "text",
        text: hostname
      }]
    };
  }
);

/**
 * Get comprehensive system information
 */
server.registerTool(
  "get_system_info",
  {
    title: "Get System Information", 
    description: "Get detailed system information including OS, architecture, and platform details",
    inputSchema: {}
  },
  async () => {
    const info = {
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      type: os.type(),
      release: os.release(),
      version: os.version(),
      cpus: os.cpus().length,
      totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024) + " GB",
      freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024) + " GB",
      uptime: Math.round(os.uptime() / 3600) + " hours",
      userInfo: os.userInfo()
    };

    return {
      content: [{
        type: "text", 
        text: JSON.stringify(info, null, 2)
      }]
    };
  }
);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Hostname MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});

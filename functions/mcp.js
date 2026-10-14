const resourceUri = 'https://alstra.org/geofeed.csv';
const protocolVersion = '2025-06-18';

function rpc(id, result) {
  return Response.json({ jsonrpc: '2.0', id, result }, {
    headers: { 'MCP-Protocol-Version': protocolVersion }
  });
}

function rpcError(id, code, message, status = 200) {
  return Response.json({ jsonrpc: '2.0', id, error: { code, message } }, {
    status,
    headers: { 'MCP-Protocol-Version': protocolVersion }
  });
}

export async function onRequestPost({ request, env }) {
  const origin = request.headers.get('Origin');
  if (origin && origin !== new URL(request.url).origin) {
    return new Response('Forbidden origin', { status: 403 });
  }

  let message;
  try {
    message = await request.json();
  } catch {
    return rpcError(null, -32700, 'Invalid JSON', 400);
  }

  if (!message || message.jsonrpc !== '2.0' || typeof message.method !== 'string') {
    return rpcError(message?.id ?? null, -32600, 'Invalid JSON-RPC request', 400);
  }

  if (message.id === undefined) {
    return new Response(null, { status: 202 });
  }

  switch (message.method) {
    case 'initialize':
      return rpc(message.id, {
        protocolVersion,
        capabilities: { resources: {} },
        serverInfo: { name: 'org.alstra/geofeed', version: '1.0.0' },
        instructions: 'Read the public Alstra geofeed resource for prefix geolocation data.'
      });
    case 'ping':
      return rpc(message.id, {});
    case 'resources/list':
      return rpc(message.id, {
        resources: [{ uri: resourceUri, name: 'Alstra geofeed', mimeType: 'text/csv', description: 'RFC 8805 IP geolocation feed' }]
      });
    case 'resources/read': {
      if (message.params?.uri !== resourceUri) {
        return rpcError(message.id, -32602, 'Unknown resource URI');
      }
      const asset = await env.ASSETS.fetch(new URL('/geofeed.csv', request.url));
      if (!asset.ok) {
        return rpcError(message.id, -32603, 'Geofeed is unavailable', 500);
      }
      return rpc(message.id, {
        contents: [{ uri: resourceUri, mimeType: 'text/csv', text: await asset.text() }]
      });
    }
    default:
      return rpcError(message.id, -32601, 'Method not found');
  }
}

export function onRequestGet() {
  return new Response('SSE is not supported; send JSON-RPC over POST.', {
    status: 405,
    headers: { Allow: 'POST', 'Content-Type': 'text/plain; charset=utf-8' }
  });
}

const markdown = `# Alstra Research and Education Network

AS212387 is a network for research and education.

## Network

- Autonomous System: AS212387
- Name: Alstra Research and Education Network
- Location: Toronto, ON, Canada

## Connectivity services

We provide IPv6 connectivity services to residential users and education organizations. Commercial or data-center activities are not permitted. This is a project of [Alstra Solutions Ltd.](https://alstra.ca/).

## IP geolocation

Our [geofeed (CSV)](https://alstra.org/geofeed.csv) publishes geolocation information for our announced IP prefixes. See the [geofeed documentation](https://alstra.org/geofeed.md).

## Contact

For abuse reports, email abuse@alstra.org.

[View AS212387 on BGP.tools](https://bgp.tools/as/212387).
`;

const linkHeader = '</.well-known/api-catalog>; rel="api-catalog", </geofeed.csv>; rel="alternate"; type="text/csv"';

export async function onRequestGet(context) {
  const acceptsMarkdown = context.request.headers.get('Accept')?.split(',').some((part) => part.trim().split(';')[0] === 'text/markdown');
  if (acceptsMarkdown) {
    return new Response(markdown, {
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept',
        'Link': linkHeader,
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
        'Content-Security-Policy': "default-src 'self'; style-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
      }
    });
  }

  const response = await context.next();
  const headers = new Headers(response.headers);
  headers.set('Link', linkHeader);
  headers.set('Vary', 'Accept');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), geolocation=(), microphone=()');
  headers.set('Content-Security-Policy', "default-src 'self'; style-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'");
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

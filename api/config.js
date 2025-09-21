export const config = { runtime: 'edge' };

/** Returns safe front-end config. Never expose secrets here. */
export default async function handler() {
  const safe = {
    brandName: process.env.BRAND_NAME || 'Generic Chat Bot',
    brandPrimary: process.env.BRAND_PRIMARY || '#0b6ef3',
    logoUrl: process.env.LOGO_URL || '',
    greeting: process.env.BOT_GREETING || ''
  };
  return new Response(JSON.stringify(safe), {
    status: 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

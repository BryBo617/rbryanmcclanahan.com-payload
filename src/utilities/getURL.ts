export const getServerSideURL = () => {
  let url = process.env.NEXT_PUBLIC_SERVER_URL;

  if (!url && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  if (!url) {
    url = 'http://localhost:3000';
  }

  return url;
};

export const getClientSideURL = () => {
  // Always return the server-side URL to ensure consistency between SSR and client
  // This prevents hydration mismatches when the URL is different on server vs client
  return getServerSideURL();
};

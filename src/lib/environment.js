export default function environment() {
  // TODO: this treats anything on Netlify as prod which isn't right, but the `CONTEXT`
  // env var is only set at build time NOT lambda run time.
  return process.env.NETLIFY_IMAGES_CDN_DOMAIN ? 'production' : 'development';
}

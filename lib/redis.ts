import Redis from "ioredis";

export function createRedis() {
  const url = process.env.REDIS_URL;
  if (!url) return null;
  const client = new Redis(url, {
    tls: {
      rejectUnauthorized: false,
    },
    lazyConnect: true,
  });
  return client;
}

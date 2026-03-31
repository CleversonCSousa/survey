import { env } from "@/env/index.ts";
import { Redis } from "ioredis";

export const redis = new Redis(env.REDIS_URL, {
  lazyConnect: true,
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

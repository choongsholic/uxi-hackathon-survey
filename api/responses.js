import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const ids = await redis.smembers("response_ids");

    if (!ids || ids.length === 0) {
      return res.status(200).json([]);
    }

    const pipeline = redis.pipeline();
    ids.forEach((id) => pipeline.hgetall(id));
    const results = await pipeline.exec();

    return res.status(200).json(results);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

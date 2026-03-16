import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const data = req.body;
    const id = Date.now().toString();
    data.timestamp = new Date().toISOString();

    await redis.hset(`response:${id}`, data);
    await redis.sadd("response_ids", `response:${id}`);

    return res.status(200).json({ ok: true, id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

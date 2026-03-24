// Vercel KV leaderboard endpoint
//
// Setup (one-time):
//   1. Vercel dashboard → Storage → Create KV store → link to this project
//   2. Run: vercel env pull   (to get KV env vars locally)
//
// The game works fine without KV — it fails gracefully with an empty leaderboard.

import { kv } from "@vercel/kv";

const LEADERBOARD_KEY = "carp-cleanup:leaderboard";
const MAX_NAME_LEN = 20;
const TOP_N = 10;

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    try {
      var raw = await kv.zrange(LEADERBOARD_KEY, 0, TOP_N - 1, {
        rev: true,
        withScores: true,
      });
      // @vercel/kv returns [{member, score}, ...]
      var entries = (raw || []).map(function (item) {
        return { name: item.member || String(item), score: Number(item.score) || 0 };
      });
      res.status(200).json(entries);
    } catch (e) {
      // KV not configured — return empty, game continues normally
      res.status(200).json([]);
    }
    return;
  }

  if (req.method === "POST") {
    try {
      var body = req.body;
      if (typeof body === "string") {
        try { body = JSON.parse(body); } catch (_) { body = {}; }
      }

      var name = String(body.name || "").trim();
      var score = Number(body.score);

      if (!name || name.length > MAX_NAME_LEN || !Number.isFinite(score) || score < 0 || score > 99999) {
        res.status(400).json({ error: "Invalid data" });
        return;
      }

      // Sanitise name — alphanumeric, spaces, hyphens, underscores only
      var safeName = name.replace(/[^a-zA-Z0-9 _\-]/g, "").trim();
      if (!safeName) { res.status(400).json({ error: "Invalid name" }); return; }

      await kv.zadd(LEADERBOARD_KEY, { score: Math.round(score), member: safeName });
      res.status(200).json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "Server error" });
    }
    return;
  }

  res.status(405).end();
}

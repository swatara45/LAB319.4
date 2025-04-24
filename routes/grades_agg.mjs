import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/learner/:id/avg-class", async (req, res) => {
    const learnerId = Number(req.params.id);
    if (isNaN(learnerId)) {
      return res.status(400).send("Invalid learner ID");
    }
  
    try {
      const collection = db.collection("grades");
  
      const result = await collection
        .aggregate([
          { $match: { learner_id: learnerId } },
          { $unwind: "$scores" },
          {
            $group: {
              _id: "$class_id",
              quiz: {
                $push: {
                  $cond: [
                    { $eq: ["$scores.type", "quiz"] },
                    "$scores.score",
                    "$$REMOVE",
                  ],
                },
              },
              exam: {
                $push: {
                  $cond: [
                    { $eq: ["$scores.type", "exam"] },
                    "$scores.score",
                    "$$REMOVE",
                  ],
                },
              },
              homework: {
                $push: {
                  $cond: [
                    { $eq: ["$scores.type", "homework"] },
                    "$scores.score",
                    "$$REMOVE",
                  ],
                },
              },
            },
          },
          {
            $project: {
              _id: 0,
              class_id: "$_id",
              avg: {
                $sum: [
                  { $multiply: [{ $avg: "$exam" }, 0.5] },
                  { $multiply: [{ $avg: "$quiz" }, 0.3] },
                  { $multiply: [{ $avg: "$homework" }, 0.2] },
                ],
              },
            },
          },
        ])
        .toArray();
  
      if (!result || result.length === 0) {
        return res.status(404).send("Not found");
      }
  
      res.status(200).json(result);
    } catch (err) {
      console.error("Aggregation error:", err);
      res.status(500).send("Server error");
    }
  });
  
  export default router;

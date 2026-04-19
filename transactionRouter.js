import express from "express";
// import { getBids } from "./transactionController.js";

const router = express.Router();

const transactionRoutes = (bidsCollection) => {

  router.get("/bids", async (req, res) => {

     try {
        
    const cursor = bidsCollection.find();
    const result = await cursor.toArray();
    res.send(result);

  } catch (error) {
    res.status(500).send({ error: error.message });
  }
  });

  return router;
};

export default transactionRoutes;
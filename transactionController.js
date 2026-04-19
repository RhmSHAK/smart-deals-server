export const getBids = async (req, res, bidsCollection) => {
  try {
    const cursor = bidsCollection.find();
    const result = await cursor.toArray();

    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
import Router from "express";
const router = Router();
router.post("/workflows", async (req, res) => {
    res.send({ message: "Workflow created" });
})


export default router;
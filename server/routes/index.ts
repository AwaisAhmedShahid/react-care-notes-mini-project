import { Router } from "express";
import notesRoutes from "./notes.route";

const apiRoutes = Router();

apiRoutes.use("/", notesRoutes);
apiRoutes.use("*", (_, res) => {
  res.status(404).send("Not Found");
});

export default apiRoutes;

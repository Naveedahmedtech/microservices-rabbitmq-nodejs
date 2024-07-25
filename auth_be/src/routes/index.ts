import { Request, Response, router } from "@/config/express.config";

// ** routes
import auth from "./auth";
import { csrfTokenHandler } from "@/middlewares/csrfTokenHandler";

router.use("/auth", auth);
router.get("/csrf-token", csrfTokenHandler, (req: Request, res: Response) => {
  res.json({ csrfToken: res.locals.csrfToken });
});

export default router;

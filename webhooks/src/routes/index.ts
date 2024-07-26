import { Request, Response, router } from "@/config/express.config";

// ** routes
import csrfProtection from "@/middlewares/csrfTokenHandler";
import { emailWebhook } from "@/controller";

router.use("/email", emailWebhook);

router.get("/csrf-token", csrfProtection, (req: Request, res: Response) => {
  res.json({ csrfToken: res.locals.csrfToken });
});

export default router;

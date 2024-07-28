import { Request, Response, router } from "@/config/express.config";

// ** routes
import csrfProtection from "@/middlewares/csrfTokenHandler";

router.get("/csrf-token", csrfProtection, (req: Request, res: Response) => {
  res.json({ csrfToken: res.locals.csrfToken });
});

export default router;

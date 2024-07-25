import { router } from "@/config/express.config";
import { deleteUser, facebookCallback, getAll, googleCallback, registerUser, registerWithFacebook, registerWithGoogle, verifyRegistration } from "@/controller/auth";
import { registerSchema } from "@/lib/validation/auth";
import csrfProtection from "@/middlewares/csrfTokenHandler";
import { validateRequest } from "@/middlewares/validation";

router.post(
  "/register",
  csrfProtection,
  validateRequest(registerSchema),
  registerUser
);
// * GOOGLE
router.get("/google", registerWithGoogle)
router.all("/google/callback", googleCallback);
// * FACEBOOK
router.get("/facebook", registerWithFacebook);
router.get("/facebook/callback", facebookCallback);


// get
router.get("/get-all", getAll);

// delete
router.delete("/delete/:id", deleteUser);


// verifications
router.get("/verify-registration", verifyRegistration);

export default router;

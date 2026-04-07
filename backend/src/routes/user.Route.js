import { Router } from "express"
import { getAllProblems, addProblem } from "../controllers/problem.controller.js";
import { registerUser, loginUser, logoutUser } from "../controllers/user.controller.js";
import { submitCode } from "../controllers/submission.controller.js";
import { getSubmissionsByUser } from "../controllers/submission.controller.js";
import { getproblemById } from "../controllers/problem.controller.js";
import { getLeaderboard } from "../controllers/problem.controller.js";
import { getUserStats } from "../controllers/problem.controller.js";
import { getContest } from "../controllers/problem.controller.js";
import { createContest } from "../controllers/submission.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/test").get((_, res) => {
    res.json({
        success: true
    })
})

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/addProblem").post(addProblem);
router.route("/submit-code").post(submitCode);
router.route("/submissions/:userId").get(getSubmissionsByUser);
router.route("/getproblem").get(getAllProblems);
router.route("/getproblemById/:id").get(getproblemById);
router.get("/leaderboard", getLeaderboard);
router.get("/stats/:userId", getUserStats);
router.get("/contest/:id", getContest);
router.post("/contest", createContest);


export default router
    






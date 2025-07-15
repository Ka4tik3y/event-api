import express from "express";
import userController from "../controllers/User.controller.js";
import { validateUser} from "../middlewares/validation.js";
const router = express.Router();

router.post('/', validateUser, userController.createUser);

// Get User Details
router.get('/:id', userController.getUserById);

// Update User
router.put('/:id', validateUser, userController.updateUser);

// Delete User
router.delete('/:id', userController.deleteUser);

// Get User's Registered Events
router.get('/:id/events', userController.getUserEvents);

// List All Users (must be last to avoid conflicts)
router.get('/', userController.getAllUsers);




export default router;

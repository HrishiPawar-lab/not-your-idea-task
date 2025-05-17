import jwt from "jsonwebtoken";
import Task from "../schemas/task.js";
import ApiResponse from "../utils/apiResponse.js";

export function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(200).json(new ApiResponse(false, {}, "Unauthorized"));
  }
}

export function authorizeTaskAction(req, res, next) {
  const { id } = req.params;
  Task.findById(id)
    .then((task) => {
      if (!task) {
        return res
          .status(200)
          .json(new ApiResponse(false, {}, "Task not found"));
      }

      if (
        task.createdBy.toString() === req.user.sub ||
        req.user.role === "admin"
      ) {
        next();
      } else {
        res.status(200).json(new ApiResponse(false, {}, "Forbidden"));
      }
    })
    .catch((err) => {
      console.error("Error in authorizeTaskAction:", err);
      res.status(200).json(new ApiResponse(false, {}, "Something went wrong"));
    });
}

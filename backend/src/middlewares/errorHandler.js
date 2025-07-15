const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      error: "Validation Error",
      message: errors.join(", "),
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      error: "Conflict",
      message: "Resource already exists",
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      error: "Bad Request",
      message: "Invalid ID format",
    });
  }

  res.status(500).json({
    error: "Internal Server Error",
    message: "Something went wrong",
  });
};

export default errorHandler;

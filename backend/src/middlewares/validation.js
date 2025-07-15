const validateEvent = (req, res, next) => {
  const { title, date_time, location, capacity } = req.body;

  if (!title || title.trim().length === 0 || title.length > 255) {
    return res.status(400).json({ error: "Invalid title" });
  }

  if (!date_time || isNaN(new Date(date_time).getTime())) {
    return res.status(400).json({ error: "Invalid date" });
  }

  if (!location || location.trim().length === 0 || location.length > 255) {
    return res.status(400).json({ error: "Invalid location" });
  }

  if (
    !capacity ||
    capacity < 1 ||
    capacity > 1000 ||
    !Number.isInteger(capacity)
  ) {
    return res.status(400).json({ error: "Invalid capacity" });
  }

  next();
};

const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  if (!name || name.trim().length === 0 || name.length > 255) {
    return res.status(400).json({ error: "Invalid name" });
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "Invalid email" });
  }

  next();
};

const validateRegistration = (req, res, next) => {
  const { user_id } = req.body;

  if (!user_id || !/^[0-9a-fA-F]{24}$/.test(user_id)) {
    return res.status(400).json({ error: "Invalid user ID" });
  }

  next();
};

export { validateEvent, validateUser, validateRegistration };

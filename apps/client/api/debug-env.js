module.exports = (req, res) => {
  const safe = {
    SMTP_HOST: process.env.SMTP_HOST || null,
    SMTP_PORT: process.env.SMTP_PORT || null,
    SMTP_SECURE: process.env.SMTP_SECURE || null,
    FROM_EMAIL: process.env.FROM_EMAIL || null,
    NOTIFY_EMAIL: process.env.NOTIFY_EMAIL || null,
    NODE_ENV: process.env.NODE_ENV || null
  };
  res.status(200).json(safe);
};

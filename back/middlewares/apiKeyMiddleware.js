const apiKeyMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey && apiKey === process.env.AI_SERVICE_API_KEY) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized: Invalid API Key' });
};

module.exports = apiKeyMiddleware;

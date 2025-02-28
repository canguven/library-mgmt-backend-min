const validateRequest = (schema) => {
  return (req, res, next) => {
    let dataToValidate = req.body;
    
    // Handle Postman format with mode and raw properties
    if (req.body && req.body.mode === 'raw' && req.body.raw) {
      try {
        // Parse the raw JSON string
        dataToValidate = JSON.parse(req.body.raw);
      } catch (error) {
        return res.status(400).json({ message: 'Invalid JSON in request body' });
      }
    }

    // Validate with Joi
    const { error } = schema.validate(dataToValidate);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    
    // Replace the request body with the parsed data for controllers
    if (dataToValidate !== req.body) {
      req.body = dataToValidate;
    }
    
    next();
  };
};

module.exports = {
  validateRequest,
};
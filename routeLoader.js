/**
 * Route loader for lazy-loading routes
 */
const express = require('express');

/**
 * Creates a router with lazy-loaded routes
 * @param {Object} routeDefinitions - Object mapping paths to route modules
 * @returns {Object} Express router
 */
const createLazyRouter = (routeDefinitions) => {
  const router = express.Router();
  
  Object.entries(routeDefinitions).forEach(([path, routeLoader]) => {
    router.use(path, (req, res, next) => {
      // Dynamically import the route module when requested
      routeLoader()
        .then(routeModule => {
          // Use the imported router for this request
          routeModule.default(req, res, next);
        })
        .catch(err => {
          next(err);
        });
    });
  });
  
  return router;
};

module.exports = { createLazyRouter };
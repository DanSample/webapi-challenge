const db = require('../data/helpers/projectModel');
const actionsDb = require('../data/helpers/actionModel');

const validateProjectId = async (req, res, next) => {
  const { id } = req.params;
  try {
    const project = await db.get(id);
    if (project) {
      req.project = project;
      next();
    } else {
      res.status(404).json({
        error: `No project with id ${id} exists`
      });
    }
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while attempting to validate the project ID`
    });
  }
};

const validateProjectBody = (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({
        error: `Cannot process request with an empty body`
      });
    } else {
      const { name, description } = req.body;
      if (!name || !description) {
        res.status(400).json({
          error: `Missing data! Please include all fields (name, description)`
        });
      } else {
        const project = { name, description };
        req.project = project;
        next();
      }
    }
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while attempting to validate the project's data`
    });
  }
};

const validateActionId = async (req, res, next) => {
  const { actionId } = req.params;
  try {
    const action = await actionsDb.get(actionId);
    if (action) {
      req.action = action;
      next();
    } else {
      res.status(404).json({
        error: `The action with the specified ID does not exist`
      });
    }
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while attempting to validate the action ID`
    });
  }
};

const validateActionBody = (req, res, next) => {
  try {
    if (Object.keys(req.body).length === 0) {
      res.status(400).json({
        error: `Cannot process request with an empty body`
      });
    } else {
      const { notes, description } = req.body;
      if (!notes || !description) {
        res.status(400).json({
          error: `Missing data! Please include all fields (notes, description, and completed)`
        });
      } else {
        const action = { notes, description };
        req.action = action;
        next();
      }
    }
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while attempting to validate the project's data`
    });
  }
};

module.exports = {
  validateProjectId,
  validateProjectBody,
  validateActionId,
  validateActionBody
};

const router = require('express').Router({ mergeParams: true });
const projectsDb = require('../../data/helpers/projectModel');
const actionsDb = require('../../data/helpers/actionModel');

router.get('/', async (req, res) => {
  try {
    const postId = req.params.id;
    const actions = await projectsDb.getProjectActions(postId);
    res.status(200).json({
      actions
    });
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while attempting to get the project's actions`
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const projectId = req.params.id;
    const { description, notes } = req.body;
    if (!projectId) {
      res.status(404).json({
        success: false,
        error: `The project with the specified ID does not exist`
      });
    } else {
      const action = await actionsDb.insert({
        project_id: projectId,
        description,
        notes
      });
      res.status(201).json(action);
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await actionsDb.remove(id);
    res.status(202).json({ success: true });
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.put('/:id', validateID, async (req, res) => {
  try {
    const action = await actionsDb.update(req.params.id, req.body);
    res.status(200).json(action);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function validateID(req, res, next) {
  try {
    const action = await actionsDb.get(req.params.id);
    if (action) {
      req.action = action;
      next();
    } else {
      next({ error: 'invalid action ID' });
    }
  } catch (err) {
    res
      .status(404)
      .json({ error: `The action with the specified ID does not exist` });
  }
}

module.exports = router;

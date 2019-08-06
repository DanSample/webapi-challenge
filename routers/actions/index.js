const router = require('express').Router({ mergeParams: true });
const db = require('../../data/helpers/actionModel');
const { getProjectActions } = require('../../data/helpers/projectModel');
const { validateActionId, validateActionBody } = require('../../middleware');

router.get('/', async (req, res) => {
  try {
    const projectId = req.params.id;
    const actions = await getProjectActions(projectId);
    res.json(actions);
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while attempting to get the actions`
    });
  }
});

router.post('/', validateActionBody, async (req, res) => {
  try {
    const { action, project } = req;
    const { id } = project;
    const { description, notes } = action;
    const newAction = await db.insert({
      project_id: id,
      description,
      notes
    });
    res.status(201).json({ ...newAction });
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while attempting to add the action`
    });
  }
});

router.delete('/:actionId', validateActionId, async (req, res) => {
  try {
    const { actionId } = req.params;
    await db.remove(actionId);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while attempting to delete the action`
    });
  }
});

router.put(
  '/:actionId',
  validateActionId,
  validateActionBody,
  async (req, res) => {
    try {
      const { actionId } = req.params;
      const { action } = req;
      const updatedAction = await db.update(actionId, action);
      res.json({ ...updatedAction });
    } catch (error) {
      res.status(500).json({
        error: `An error occurred while attempting to update the action`
      });
    }
  }
);

module.exports = router;

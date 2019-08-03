const router = require('express').Router();
const db = require('../../data/helpers/projectModel');
const actionsRouter = require('../actions');

router.use('/:id/actions', actionsRouter);

router.get('/', async (req, res) => {
  try {
    const projects = await db.get();
    res.status(200).json({
      projects
    });
  } catch (error) {
    res.status(500).json({
      error: `An error has occurred while attempting to retrieve projects`
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const project = await db.get(id);
    res.status(200).json({
      project
    });
  } catch (error) {
    res.status(500).json({
      error: `An error has occurred while attempting to retrieve the project`
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, description } = req.body;
    const project = await db.insert({ name, description });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      error: `An error has occurred while attempting to create the project`
    });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.remove(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while attempting to delete the project`
    });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).json({
      success: false,
      error: `Please provide name and description for the project`
    });
  }
  try {
    const project = await db.get(id);
    if (!project) {
      res.status(404).json({
        success: false,
        error: `The project with the specified ID does not exist`
      });
    } else {
      await db.update(id, { name, description });
      const updated = await db.get(id);
      res.status(200).json({
        success: true,
        project: updated
      });
    }
  } catch (error) {
    res.status(500).json({
      error: `An error occurred while attempting to update the project`
    });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');

// Get all projects
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create project
router.post('/', auth, async (req, res) => {
  const { title, description, techStack, status, members } = req.body;
  try {
    const newProject = new Project({
      title,
      description,
      techStack,
      status,
      members: members || []
    });
    const project = await newProject.save();
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update project
router.put('/:id', auth, async (req, res) => {
  const { title, description, techStack, status, members } = req.body;
  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    project = await Project.findByIdAndUpdate(
      req.params.id, 
      { $set: { title, description, techStack, status, members } }, 
      { new: true }
    );
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

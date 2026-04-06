const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const auth = require('../middleware/auth');

// Get all members
router.get('/', auth, async (req, res) => {
  try {
    const members = await Member.find().sort({ createdAt: -1 });
    res.json(members);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Create member
router.post('/', auth, async (req, res) => {
  const { name, role, email, avatar } = req.body;
  try {
    const newMember = new Member({
      name,
      role,
      email,
      avatar: avatar || 'https://i.pravatar.cc/150?u=' + Date.now().toString()
    });
    const member = await newMember.save();
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update member
router.put('/:id', auth, async (req, res) => {
  const { name, role, email, avatar } = req.body;
  try {
    let member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    member = await Member.findByIdAndUpdate(
      req.params.id, 
      { $set: { name, role, email, avatar } }, 
      { new: true }
    );
    res.json(member);
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Delete member
router.delete('/:id', auth, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ message: 'Member not found' });

    await Member.findByIdAndDelete(req.params.id);
    res.json({ message: 'Member deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;

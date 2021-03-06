const { Router } = require('express');
const config = require('config');
const shortid = require('shortid');

const Link = require('../models/Link');
const auth = require('../middleware/auth.middleware');

const router = Router();

// /api/link/generate
router.post('/generate', auth, async (req, res) => {
  try {
    const baseURL = config.get('baseURL');
    const { from } = req.body;
    const code = shortid.generate();
    const existing = await Link.findOne({ from });

    if (existing) {
      return res.json({ link: existing });
    }

    const to = `${baseURL}/t/${code}`; // generated link
    const owner = req.user.userId;
    const link = new Link({ code, to, from, owner });

    await link.save();

    res.status(201).json({ link });
  } catch (error) {
    res.status(500).json({
      message: 'Link generation error',
    });
  }
});

// /api/link/
router.get('/', auth, async (req, res) => {
  try {
    const links = await Link.find({ owner: req.user.userId });
    res.json(links);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting links',
    });
  }
});

// /api/link/:id
router.get('/:id', auth, async (req, res) => {
  try {
    const link = await Link.findById(req.params.id);
    res.json(link);
  } catch (error) {
    res.status(500).json({
      message: 'Error getting link by ID',
    });
  }
});

module.exports = router;

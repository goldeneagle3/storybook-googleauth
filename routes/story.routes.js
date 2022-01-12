const express = require('express');

const { ensureAuth } = require('../middleware/auth');
const storyCtrl = require('../controllers/story.controller.js');

const router = express.Router();

// @desc    Show add page
// @route   GET /stories/add
router.get('/add', ensureAuth, storyCtrl.showPostPage)

router
  .route('/')
  .post(ensureAuth, storyCtrl.create)
  .get(ensureAuth, storyCtrl.list);

router
  .route('/:id')
  .get(ensureAuth, storyCtrl.read)
  .put(ensureAuth, storyCtrl.update)
  .delete(ensureAuth, storyCtrl.remove);

router.route("/edit/:id").get(ensureAuth,storyCtrl.showEdit)
router.route("/user/:userId").get(ensureAuth,storyCtrl.listByUser)


module.exports = router
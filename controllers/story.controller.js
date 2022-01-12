const Story = require('./../models/story.model');

const showPostPage = (req, res) => {
  res.render('stories/add');
};

const create = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Story.create(req.body);
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
};

const list = async (req, res) => {
  try {
    const stories = await Story.find({ status: 'public' })
      .sort('-updatedAt')
      .populate('user')
      .lean();

    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
};

const read = async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user._id != req.user.id && story.status == 'private') {
      res.render('error/404');
    } else {
      res.render('stories/show', {
        story,
      });
    }
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
};

const showEdit = async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      res.render('stories/edit', {
        story,
      });
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
};

const update = async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user?.id) {
      res.redirect('/stories');
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
};

const remove = async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      await Story.remove({ _id: req.params.id });
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
};

const listByUser = async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .sort('-updatedAt')
      .populate('user')
      .lean();

    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
};

module.exports = {
  showPostPage,
  create,
  list,
  read,
  showEdit,
  update,
  remove,
  listByUser,
};

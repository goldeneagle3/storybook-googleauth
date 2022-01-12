const Story = require('../models/story.model')


const loginPage = (req, res) => {
  res.render('login', {
    layout: 'login',
  })
}

const dashboard = async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean()
    res.render('dashboard', {
      name: req.user.firstName,
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
}



module.exports = {
  loginPage,
  dashboard
}
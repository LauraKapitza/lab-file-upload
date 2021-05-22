const express = require('express');
const router = express.Router();

const User = require('../models/User.model');
const Post = require('../models/Post.model');
const mongoose = require('mongoose');

const routeGuard = require('../configs/route-guard.config');

const fileUploader = require('../configs/cloudinary.config.js');

//
// ROUTES FOR POSTS
//


/* GET home page */
router.get('/', (req, res) => {
  Post.find()
    .then(posts => {
      const data = {
        title: 'App created with Ironhack generator 🚀',
        posts: posts
      }
      res.render('index', data)
    })
    .catch(err => next(err))
  
});

//POST route to create a post including file upload
router.post('/', fileUploader.single('image'), (req, res, next) => {
  const {content} = req.body;

  if (content === '') {
    res.render('posts/post-form', {
      errorMessage: "Please provide both, content and image to create a post."
    });
    return;
  }

  Post.create({
    content,
    creatorId: req.session.currentUser,//id of user,
    picPath: req.file.path,
    picName: req.file.originalname
  })
    .then(() => res.redirect('/'))
    .catch(err => next(err))


})


//GET route to dpslay the post-form
router.get('/post-form', routeGuard, (req, res) => {
  res.render('posts/post-form')
})


//GET route to display post-details
router.get('/post/:id', (req, res, next) => {
  const id = req.params.id;
  Post.findById(id)
    .populate('creatorId')
    .populate({
      path: 'comments',
      populate: {
        path: 'authorId',
        model: 'User'
      }
    })
    .then(post => {
      res.render('posts/post-details', {post: post})
    })
    .catch(err => next(err))
})


//
// ROUTES FOR COMMENTS
//

router.post('/post/:id', fileUploader.array('images', 5), (req, res, next) => {
  let id = req.params.id;
  Post.findById(id)
    .then(post => {
      const arrImg = [];
      req.files.forEach(image => {
        const {path, originalname} = image;
        arrImg.push({path, originalname})
      })

      const comment = {
        content: req.body.content,
        authorId: req.session.currentUser,
        images: arrImg,

      }
      post.comments.push(comment)

      post.save()
        .then(() => res.redirect('/post/:id'))
        .catch(err => next(err))

    })
    .catch(err => next(err))
})

router.get('/comment/:id', routeGuard, (req, res) => {
  let id = req.params.id
  res.render('posts/comment-form.hbs', {id})
})



module.exports = router;

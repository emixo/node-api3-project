const express = require('express');

const Users = require('./userDb')
const Posts = require('../posts/postDb')

const router = express.Router();

router.post('/', validateUser('name'),(req, res) => {
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(err => {
    res.status(400).json({message: 'missing name field'})
  })
});

router.post('/:id/posts', validateUserId, validatePost('text'), (req, res) => {
  const comment = {...req.body, user_id: req.params.id}
  Posts.insert(comment)
  .then(post => {
    res.status(201).json(post)
  })
  .catch(err => {
    res.status(500).json({message: 'server error adding text'})
  })
  
});

router.get('/', (req, res) => {
  Users.get()
  .then(user => {
    res.status(200).json({headers: req.headers, user})
  })
  .catch(err => {
    res.status(500).json({message:'server error recieving users'})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    res.status(500).json({message: 'server error recieving posts'})
  })
});

router.get('/:id/posts', validateUserId, (req, res) => {
  Users.getUserPosts(req.params.id)
  .then(post => {
    res.status(200).json(post)
  })
  .catch(err => {
    res.status(500).json({message:'server error recieving posts'})
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
  .then(user => {
    if (user) {
      res.status(200).json({message: 'User has been deleted'})
    } else {
      res.status(404).json({message: 'Could not find user'})
    }
  })
  .catch(err => {
    res.status(500).json({message: 'server error deleting user'})
  })
});

router.put('/:id', validateUserId, (req, res) => {
  Users.update(req.params.id, req.body)
  .then(post => {
    if(post) {
      res.status(201).json(post)
    } else {
      res.status(400).json({message: 'missing a text field'})
    }
  })
  .catch(err => {
    res.status(500).json({message: 'server error'})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
  .then(user => {
    if (user) {
      req.user = user
      next()
    } else {
      res.status(404).json({message: 'User not found'})
    }
  })
  .catch(err => {
    res.status(500).json({message: 'server error getting users'})
  })
}

function validateUser(prop) {
  return (req, res ,next) => {
    if (!req.body[prop]) {
      res.status(400).json({message: 'missing data'})
    } else {
      next()
    }
  }
  
}

function validatePost(props) {
  return (req, res, next) => {
    if (!req.body[props]) {
      res.status(400).json({message: 'missing data'})
    } else {
      next()
    }
  }
}

module.exports = router;

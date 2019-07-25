function create(req, res) {
    const db = req.app.get('db');
  
    const { email, password } = req.body;
  
    db.users // heres the new stuff, using massive to actually query the database.
      .save({
        email,
        password,
      })
      .then(user => res.status(201).json(user)) // returns a promise so we need to use .then
      .catch(err => {
        console.error(err); // if something happens we handle the error as well.
        res.status(500).end();
      });

      db.users
        .insert(
            {
            email,
            password,
            user_profiles: [
                // this is what is specifying the object
                // to insert into the related 'user_profiles' table
                {
                   userId: undefined,
                    about: null,
                    thumbnail: null,
                },
            ],
            },
            {
            deepInsert: true, // this option here tells massive to create the related object
            }
        )
        .then(user => res.status(201).json(user))
        .catch(err => {
            console.error(err);
        });
  }

  function list(req, res) {
    const db = req.app.get('db');
  
    db.users
      .find()
      .then(users => res.status(200).json(users))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  }

  function getById(req, res) {
    const db = req.app.get('db');
  
    db.users
      .findOne(req.params.id)
      .then(user => res.status(200).json(user))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  }

  function getProfile(req, res) {
    const db = req.app.get('db');
  
    db.user_profiles
      .findOne({
        userId: req.params.id,
      })
      .then(profile => res.status(200).json(profile))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  }

  function createPosts(req, res) {
    const db = req.app.get('db');
    const {content, userId} = req.body;

    db.posts   
        .insert({
            content,
            userId
        })
        .then(user => res.status(201).json(user))
        .catch(err => {
            console.error(err);
        });
  }

  function createComments(req, res) {
      const db = req.app.get('db');
      const {userId, postId, comment} = req.body;

      db.comments
        .insert({
            userId,
            postId,
            comment
        })
        .then(user => res.status(201).json(user))
        .catch(err => {
            console.error(err);
        });
  }

  function getPostById(req, res) {
    const db = req.app.get('db');
    const commentList = [];

    if (req.query.comments === '') {
    db.posts
      .find(req.params.id)
      .then(post => {
          commentList.push(post)
          db.comments.find({
              postId: req.params.id
          })
          .then(com => {
              commentList.push(com)
              res.status(200).json(commentList)
          })
      })
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
    }
    else {
        db.posts
      .findOne(req.params.id)
      .then(post => res.status(200).json(post))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
    } 
  }

  function getPostByUser(req, res) {
    const db = req.app.get('db');

    db.posts
      .find({
          userId: req.params.id
        })
      .then(post => res.status(200).json(post))
      .catch(err => {
        console.error(err);
        res.status(500).end();
      });
  }

  function updatePosts(req, res) {
    const db = req.app.get('db');
    const {updatedPost} = req.body;

    db.posts.update({
        id: req.params.id
    },
    {
        content: updatedPost
    })
    .then(post => res.status(201).json(post))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
  }

  function updateComments(req, res) {
    const db = req.app.get('db');
    const {updatedComment} = req.body;

    db.comments.update({
        userId: req.params.userId,
        id: req.params.id
    },
    {
        comment: updatedComment
    })
    .then(post => res.status(201).json(post))
    .catch(err => {
      console.error(err);
      res.status(500).end();
    });
  }
  
  
  module.exports = {
    create,
    list,
    getById,
    getProfile,
    createPosts,
    createComments,
    getPostById,
    getPostByUser,
    updatePosts,
    updateComments
  };
  
  // server/index.js - register the handler
  
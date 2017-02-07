'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Emotion = mongoose.model('Emotion'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  emotion;

/**
 * Emotion routes tests
 */
describe('Emotion CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Emotion
    user.save(function () {
      emotion = {
        name: 'Emotion name'
      };

      done();
    });
  });

  it('should be able to save a Emotion if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Emotion
        agent.post('/api/emotions')
          .send(emotion)
          .expect(200)
          .end(function (emotionSaveErr, emotionSaveRes) {
            // Handle Emotion save error
            if (emotionSaveErr) {
              return done(emotionSaveErr);
            }

            // Get a list of Emotions
            agent.get('/api/emotions')
              .end(function (emotionsGetErr, emotionsGetRes) {
                // Handle Emotions save error
                if (emotionsGetErr) {
                  return done(emotionsGetErr);
                }

                // Get Emotions list
                var emotions = emotionsGetRes.body;

                // Set assertions
                (emotions[0].user._id).should.equal(userId);
                (emotions[0].name).should.match('Emotion name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Emotion if not logged in', function (done) {
    agent.post('/api/emotions')
      .send(emotion)
      .expect(403)
      .end(function (emotionSaveErr, emotionSaveRes) {
        // Call the assertion callback
        done(emotionSaveErr);
      });
  });

  it('should not be able to save an Emotion if no name is provided', function (done) {
    // Invalidate name field
    emotion.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Emotion
        agent.post('/api/emotions')
          .send(emotion)
          .expect(400)
          .end(function (emotionSaveErr, emotionSaveRes) {
            // Set message assertion
            (emotionSaveRes.body.message).should.match('Please fill Emotion name');

            // Handle Emotion save error
            done(emotionSaveErr);
          });
      });
  });

  it('should be able to update an Emotion if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Emotion
        agent.post('/api/emotions')
          .send(emotion)
          .expect(200)
          .end(function (emotionSaveErr, emotionSaveRes) {
            // Handle Emotion save error
            if (emotionSaveErr) {
              return done(emotionSaveErr);
            }

            // Update Emotion name
            emotion.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Emotion
            agent.put('/api/emotions/' + emotionSaveRes.body._id)
              .send(emotion)
              .expect(200)
              .end(function (emotionUpdateErr, emotionUpdateRes) {
                // Handle Emotion update error
                if (emotionUpdateErr) {
                  return done(emotionUpdateErr);
                }

                // Set assertions
                (emotionUpdateRes.body._id).should.equal(emotionSaveRes.body._id);
                (emotionUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Emotions if not signed in', function (done) {
    // Create new Emotion model instance
    var emotionObj = new Emotion(emotion);

    // Save the emotion
    emotionObj.save(function () {
      // Request Emotions
      request(app).get('/api/emotions')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Emotion if not signed in', function (done) {
    // Create new Emotion model instance
    var emotionObj = new Emotion(emotion);

    // Save the Emotion
    emotionObj.save(function () {
      request(app).get('/api/emotions/' + emotionObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', emotion.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Emotion with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/emotions/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Emotion is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Emotion which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Emotion
    request(app).get('/api/emotions/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Emotion with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Emotion if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Emotion
        agent.post('/api/emotions')
          .send(emotion)
          .expect(200)
          .end(function (emotionSaveErr, emotionSaveRes) {
            // Handle Emotion save error
            if (emotionSaveErr) {
              return done(emotionSaveErr);
            }

            // Delete an existing Emotion
            agent.delete('/api/emotions/' + emotionSaveRes.body._id)
              .send(emotion)
              .expect(200)
              .end(function (emotionDeleteErr, emotionDeleteRes) {
                // Handle emotion error error
                if (emotionDeleteErr) {
                  return done(emotionDeleteErr);
                }

                // Set assertions
                (emotionDeleteRes.body._id).should.equal(emotionSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Emotion if not signed in', function (done) {
    // Set Emotion user
    emotion.user = user;

    // Create new Emotion model instance
    var emotionObj = new Emotion(emotion);

    // Save the Emotion
    emotionObj.save(function () {
      // Try deleting Emotion
      request(app).delete('/api/emotions/' + emotionObj._id)
        .expect(403)
        .end(function (emotionDeleteErr, emotionDeleteRes) {
          // Set message assertion
          (emotionDeleteRes.body.message).should.match('User is not authorized');

          // Handle Emotion error error
          done(emotionDeleteErr);
        });

    });
  });

  it('should be able to get a single Emotion that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Emotion
          agent.post('/api/emotions')
            .send(emotion)
            .expect(200)
            .end(function (emotionSaveErr, emotionSaveRes) {
              // Handle Emotion save error
              if (emotionSaveErr) {
                return done(emotionSaveErr);
              }

              // Set assertions on new Emotion
              (emotionSaveRes.body.name).should.equal(emotion.name);
              should.exist(emotionSaveRes.body.user);
              should.equal(emotionSaveRes.body.user._id, orphanId);

              // force the Emotion to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Emotion
                    agent.get('/api/emotions/' + emotionSaveRes.body._id)
                      .expect(200)
                      .end(function (emotionInfoErr, emotionInfoRes) {
                        // Handle Emotion error
                        if (emotionInfoErr) {
                          return done(emotionInfoErr);
                        }

                        // Set assertions
                        (emotionInfoRes.body._id).should.equal(emotionSaveRes.body._id);
                        (emotionInfoRes.body.name).should.equal(emotion.name);
                        should.equal(emotionInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Emotion.remove().exec(done);
    });
  });
});

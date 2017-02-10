'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Sound = mongoose.model('Sound'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  sound;

/**
 * Sound routes tests
 */
describe('Sound CRUD tests', function () {

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

    // Save a user to the test db and create new Sound
    user.save(function () {
      sound = {
        name: 'Sound name'
      };

      done();
    });
  });

  it('should be able to save a Sound if logged in', function (done) {
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

        // Save a new Sound
        agent.post('/api/sounds')
          .send(sound)
          .expect(200)
          .end(function (soundSaveErr, soundSaveRes) {
            // Handle Sound save error
            if (soundSaveErr) {
              return done(soundSaveErr);
            }

            // Get a list of Sounds
            agent.get('/api/sounds')
              .end(function (soundsGetErr, soundsGetRes) {
                // Handle Sounds save error
                if (soundsGetErr) {
                  return done(soundsGetErr);
                }

                // Get Sounds list
                var sounds = soundsGetRes.body;

                // Set assertions
                (sounds[0].user._id).should.equal(userId);
                (sounds[0].name).should.match('Sound name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Sound if not logged in', function (done) {
    agent.post('/api/sounds')
      .send(sound)
      .expect(403)
      .end(function (soundSaveErr, soundSaveRes) {
        // Call the assertion callback
        done(soundSaveErr);
      });
  });

  it('should not be able to save an Sound if no name is provided', function (done) {
    // Invalidate name field
    sound.name = '';

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

        // Save a new Sound
        agent.post('/api/sounds')
          .send(sound)
          .expect(400)
          .end(function (soundSaveErr, soundSaveRes) {
            // Set message assertion
            (soundSaveRes.body.message).should.match('Please fill Sound name');

            // Handle Sound save error
            done(soundSaveErr);
          });
      });
  });

  it('should be able to update an Sound if signed in', function (done) {
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

        // Save a new Sound
        agent.post('/api/sounds')
          .send(sound)
          .expect(200)
          .end(function (soundSaveErr, soundSaveRes) {
            // Handle Sound save error
            if (soundSaveErr) {
              return done(soundSaveErr);
            }

            // Update Sound name
            sound.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Sound
            agent.put('/api/sounds/' + soundSaveRes.body._id)
              .send(sound)
              .expect(200)
              .end(function (soundUpdateErr, soundUpdateRes) {
                // Handle Sound update error
                if (soundUpdateErr) {
                  return done(soundUpdateErr);
                }

                // Set assertions
                (soundUpdateRes.body._id).should.equal(soundSaveRes.body._id);
                (soundUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Sounds if not signed in', function (done) {
    // Create new Sound model instance
    var soundObj = new Sound(sound);

    // Save the sound
    soundObj.save(function () {
      // Request Sounds
      request(app).get('/api/sounds')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Sound if not signed in', function (done) {
    // Create new Sound model instance
    var soundObj = new Sound(sound);

    // Save the Sound
    soundObj.save(function () {
      request(app).get('/api/sounds/' + soundObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', sound.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Sound with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/sounds/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Sound is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Sound which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Sound
    request(app).get('/api/sounds/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Sound with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Sound if signed in', function (done) {
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

        // Save a new Sound
        agent.post('/api/sounds')
          .send(sound)
          .expect(200)
          .end(function (soundSaveErr, soundSaveRes) {
            // Handle Sound save error
            if (soundSaveErr) {
              return done(soundSaveErr);
            }

            // Delete an existing Sound
            agent.delete('/api/sounds/' + soundSaveRes.body._id)
              .send(sound)
              .expect(200)
              .end(function (soundDeleteErr, soundDeleteRes) {
                // Handle sound error error
                if (soundDeleteErr) {
                  return done(soundDeleteErr);
                }

                // Set assertions
                (soundDeleteRes.body._id).should.equal(soundSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Sound if not signed in', function (done) {
    // Set Sound user
    sound.user = user;

    // Create new Sound model instance
    var soundObj = new Sound(sound);

    // Save the Sound
    soundObj.save(function () {
      // Try deleting Sound
      request(app).delete('/api/sounds/' + soundObj._id)
        .expect(403)
        .end(function (soundDeleteErr, soundDeleteRes) {
          // Set message assertion
          (soundDeleteRes.body.message).should.match('User is not authorized');

          // Handle Sound error error
          done(soundDeleteErr);
        });

    });
  });

  it('should be able to get a single Sound that has an orphaned user reference', function (done) {
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

          // Save a new Sound
          agent.post('/api/sounds')
            .send(sound)
            .expect(200)
            .end(function (soundSaveErr, soundSaveRes) {
              // Handle Sound save error
              if (soundSaveErr) {
                return done(soundSaveErr);
              }

              // Set assertions on new Sound
              (soundSaveRes.body.name).should.equal(sound.name);
              should.exist(soundSaveRes.body.user);
              should.equal(soundSaveRes.body.user._id, orphanId);

              // force the Sound to have an orphaned user reference
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

                    // Get the Sound
                    agent.get('/api/sounds/' + soundSaveRes.body._id)
                      .expect(200)
                      .end(function (soundInfoErr, soundInfoRes) {
                        // Handle Sound error
                        if (soundInfoErr) {
                          return done(soundInfoErr);
                        }

                        // Set assertions
                        (soundInfoRes.body._id).should.equal(soundSaveRes.body._id);
                        (soundInfoRes.body.name).should.equal(sound.name);
                        should.equal(soundInfoRes.body.user, undefined);

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
      Sound.remove().exec(done);
    });
  });
});

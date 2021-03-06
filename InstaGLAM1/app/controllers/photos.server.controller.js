'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Photo = mongoose.model('Photo'),
	_ = require('lodash');

/**
 * Create a Photo
 */
exports.create = function(req, res) {
  console.log(req.body);
  console.log(req.files);
  var photo = new Photo(req.body);
  photo.user = req.user;
  if(req.files.image) {
    photo.image =req.files.image.path.substring(7);
    console.log(photo.image);
  }  else
    photo.image='default.jpg';

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			var socketio = req.app.get('socketio'); // makes a socket instance
			socketio.emit('photo.created', photo); // sends the socket event to all current users

			res.redirect('/#!/photos/'+photo._id); // redirection to '/'jsonp(photo);
			
		}
	});
};

/**
 * Show the current Photo
 */
exports.read = function(req, res) {
	req.photo.views += 1;
	req.photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else 
			
			res.jsonp(req.photo);
		});
};

/**
 * Update a Photo
 */
exports.update = function(req, res) {
	var photo = req.photo ;

	photo = _.extend(photo , req.body);

	photo.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// tackle out socket instance from the app container
			//var socketio = req.app.get('socketio'); 
			// emit an event for all connected clients
			//socketio.sockets.emit('photo.created', photo); 
			res.jsonp(photo);
		}
	});
};

/**
 * Delete an Photo
 */
exports.delete = function(req, res) {
	var photo = req.photo ;

	photo.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photo);
		}
	});
};

/**
 * List of Photos
 */
exports.list = function(req, res) { 
	Photo.find().sort('-created').populate('user', 'displayName').exec(function(err, photos) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(photos);
		}
	});
};

/**
 * Photo middleware
 */
exports.photoByID = function(req, res, next, id) { 
	Photo.findById(id).populate('user', 'displayName').exec(function(err, photo) {
		if (err) return next(err);
		if (! photo) return next(new Error('Failed to load Photo ' + id));
		req.photo = photo ;
		next();
	});
};

/**
 * Photo authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.photo.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};

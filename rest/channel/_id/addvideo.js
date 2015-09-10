var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../../../controllers/channels');
var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	addVideo: {
		param: 'videoId',
		patch: [
			AuthController.EnsureAuthenticatedOrDigest,
			ChannelController.LoadChannel,
			function(req,res,next) {
				if (req.data.length==0) {
					res.status(404).json({ status:false, message:"No such channel with id " + req.params.id });
				}
				else {
					next();
				}
			},
			AuthController.CheckWrite,
			function(req,res,next) {
				req.channelData = req.data;
				req.params.id = req.params.videoId;
				next();
			},
			VideoController.LoadVideo,
			function(req,res,next) {
				if (req.data.length==0) {
					res.status(404).json({ status:false, message:"No such video with id " + req.params.videoId });
				}
				else {
					var Channel = require(__dirname + '/../../../models/channel');
					var channelData = req.channelData;
					if (channelData.videos.indexOf(req.params.videoId)==-1) {
						channelData.videos.push(req.params.videoId);
						Channel.update({"_id":req.channelData._id}, channelData, function(err,data) {
							if (err) {
								res.status(500).json({ status:false, message:"Unexpected error in query: " + err.message() });
							}
							else {
								req.data = channelData;
								next();
							}
						});
					}
					else {
						next();
					}
				}
			},
			CommonController.JsonResponse
		]
	}
};

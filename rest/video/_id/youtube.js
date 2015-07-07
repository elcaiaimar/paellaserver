var mongoose = require('mongoose');

var ChannelController = require(__dirname + '/../../../controllers/channels');
var VideoController = require(__dirname + '/../../../controllers/video');
var CommonController = require(__dirname + '/../../../controllers/common');
var AuthController = require(__dirname + '/../../../controllers/auth');

exports.routes = {
	getYoutubeId: {
		get: [
			VideoController.LoadVideo,
			function(req,res,next) {
				var youtubeId = req.data && req.data.length && req.data[0] &&
					req.data[0].pluginData.youtube && req.data[0].pluginData.youtube.id;
				req.data = { youtubeId:youtubeId };
				next();
			},
			CommonController.JsonResponse
		]
	},

	setYoutubeId: {
		param:'youtubeId',
		patch: [
			AuthController.EnsureAuthenticatedOrDigest,
			AuthController.CheckRole(['YOUTUBE','ADMIN']),
			VideoController.LoadVideo,
			function(req,res,next) {
				if (req.data && req.data[0]) {
					var video = req.data[0];
					var pluginData = JSON.parse(JSON.stringify(video.pluginData || {}));
					pluginData.youtube = {
						id: req.params.youtubeId
					};
					video.pluginData = pluginData;
					video.save(function(err) {
						if (err) {
							req.state(500).json({ status: false, message:err.toString() });
						}
						else {
							next();
						}
					});
				}
				else {
					res.state(401).json({ status:false, message: "No such video with ID " + req.id});
				}
			},
			// VideoController.UpdateField('pluginData.youtube','pluginData'),
			CommonController.JsonResponse
		]
	}
};


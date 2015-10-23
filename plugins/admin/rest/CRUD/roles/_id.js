var Model = require(__dirname + '/../../../../../models/role');
var AuthController = require(__dirname + '/../../../../../controllers/auth');

exports.routes = {
	getModel: {
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				var query = {};				
				
				Model.findById(req.params.id)
				.exec(function(err, item) {
					if(err) { return res.sendStatus(500); }
					
					if (item) {
						res.status(200).send(item);
					}
					else {
						res.sendStatus(404);
					}
				});					
			}
		]
	},
	
	removeModel: {
		delete: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				res.sendStatus(500);
			}
		]
	},

	updateModel: {
		patch: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				res.sendStatus(500);
			}
		]
	}
	
}
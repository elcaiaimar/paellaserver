/*
	404 - Not Found
	204 - Updated
	201 - Created
	200 - Response
	400 - Bad Request
	403 - Forbiden
	401 - Unauthorized
	500 - Internal Server Error
*/

var Video = require(__dirname + '/../../../../models/video');
var AuthController = require(__dirname + '/../../../../controllers/auth');

exports.routes = {
	videos: { 
		get: [
			AuthController.CheckRole(['ADMIN']),
			function(req,res) {			
				var skip = req.query.skip || 0;
				var limit = req.query.limit || 10;
				var query = JSON.parse(new Buffer(req.query.filters, 'base64').toString());
				
				
				Video.find(query).count().exec(function(errCount, count) {
					if(errCount) { return res.sendStatus(500); }
					
					Video.find(query)
					.skip(skip)
					.limit(limit)
					.populate('repository')
					.populate('owner')					
					.exec(function(err, items) {
						if(err) { return res.sendStatus(500); }
						
						res.status(200).send({
							total: count,
							skip: Number(skip),
							limit: Number(limit),
							list:items							
						});
					});					
				});
			}
		]
	}
}


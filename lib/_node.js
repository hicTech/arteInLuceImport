var _ = require("./_all.js");

var _websockets = {
	
	webSocketPool: function(url){
		var WebSocketLib = require('websocket');
		var W3CWebSocket = WebSocketLib.w3cwebsocket;
		var deasync = require("deasync");
		
		var pool = {};
		var verbose = false;
		var no_open_msg = "Unable to create websocket to "+url+": url is not correct or network is unreachable";
		
		var createWebSocket = function(set_busy, ready_fn){
			var item = {
				id: _.id("ws_pool_"),
				state: "created",
				ws: new W3CWebSocket(url)
			};
			if(!!verbose)
				_.log("WebSocket "+item.id+" created (url: "+url+") at "+_.dateStr(_.timestamp(),3));
			
			item.ws.onopen = function(){
				item.state = "ready";
				pool[item.id] = item;
				if(!!verbose)
					_.log("WebSocket "+item.id+" open at "+_.dateStr(_.timestamp(),3));
				if(_.isFunction(ready_fn)){
					if(!!set_busy)
						item.state = "busy";
					try{
						ready_fn(item);
					}catch(err){
						_.log("Error in ready function on websocket "+item.id+" open: "+err);
					}
				}
			};
			
			item.ws.onclose = function(){
				if(item.state!="closed"){
					var not_open = (item.state=="created");
					var disposing = (item.state=="disposing");
					item.state = "closed";
					if(!!verbose)
						_.log("WebSocket "+item.id+" closed at "+_.dateStr(_.timestamp(),3));
					if(!disposing)
						disposeWebSocket(item);
					if(not_open && _.isFunction(ready_fn)){ // in mancanza di rete il web socket non viene aperto: notifichiamo allora qui una eventuale ready_fn...
						try{
							ready_fn(item);
						}catch(err){
							_.log("Error in ready function on websocket "+item.id+" close (never opened): "+err);
						}
					}
				}
			};
			
			if(!_.isFunction(ready_fn)){
				while(item.state!="ready" && item.state!="closed" && 
						item.state!="disposed" && item.state!="disposing"){
					deasync.sleep(200);
				}
				if(item.state=="closed" || item.state=="disposed" || item.state=="disposing")
					throw no_open_msg;
				if(!!set_busy)
					item.state = "busy";
			}
			
			return item;
		};
		
		var disposeWebSocket = function(item){
			if(item.state != "disposed"){
				item.state = "disposing";
				if(item.state!="closed"){
					try{
						item.ws.close();
					}catch(err){}
				}
				item.state = "disposed";
				delete pool[item.id];
				if(!!verbose)
					_.log("WebSocket "+item.id+" disposed at "+_.dateStr(_.timestamp(),3));
			}
		};
		
		var getWebSocket = function(get_fn, open_item){
			var ready_item = _.is(open_item) ? open_item : 
				_.find(pool, function(item, item_id){
					return (item.state == "ready");
				});
			if(_.is(ready_item)){
				ready_item.state = "busy";
				if(_.isFunction(get_fn))
					get_fn(ready_item);
			}
			else
				ready_item = createWebSocket(true, get_fn);
			return ready_item;
		};
		
		var releaseWebSocket = function(item){
			item.state = "ready";
			item.ws.onmessage = null;
			item.ws.onerror = null;
		};
		
		
		
		/* NB: if receive_fn or error_fn returns true, the socket will be mantained busy 
		 * until the next receive_fn or error_fn call (stream mode) */
		var sendMsg = function(msg, receive_fn, error_fn, max_wait_ms, open_item){
			getWebSocket(function(item){
				if(item.state=="closed" || item.state=="disposed" || item.state=="disposing")
					error_fn(no_open_msg);
				else{
					if(!!verbose)
						_.log("Using WebSocket "+item.id+" in sendMsg");
					
					if(!_.is(max_wait_ms))
						max_wait_ms = ( 5 * 60 * 1000 );
					item.timeout = null;
					item.timeout_start = -1;
					var startWaitTimeout = function(){
						if(_.is(item.timeout))
							clearTimeout(item.timeout);
						item.timeout = setTimeout(function(){
							disposeWebSocket(item);
							var err_msg = "WEBSOCKET WAIT TIMEOUT ("+(max_wait_ms/1000)+
									" seconds) on websocket "+item.id+" (inactive from "+
									_.dateStr(item.timeout_start,3)+" to "+
									_.dateStr(_.timestamp(),3)+")"; 
							var print_msg = (!!verbose); 
							if(_.isFunction(error_fn))
								error_fn(err_msg);
							else
								print_msg = true;
							if(print_msg)
								_.log(print_msg);
						}, max_wait_ms);
						item.timeout_start = _.timestamp();
					};
					var cancelWaitTimeout = function(){
						clearTimeout(item.timeout);
						item.timeout_start = -1;
					};
					
					item.ws.onmessage = function(msg){
						cancelWaitTimeout();
						//if(!!verbose)
						//	_.log("Message received on "+item.id+" at "+_.dateStr(_.timestamp(),3));
						
						var data = _.parse(msg.data);
						var leave_open = false;
						if(_.isFunction(receive_fn)){
							try{
								leave_open = receive_fn(data);
							}catch(err){
								_.log("Websocket error: "+error+"\nwhile calling complete function:\n"+receive_fn+"\non data: "+_.toStr(data));
							}
						}
						
						if(!!leave_open)
							startWaitTimeout();
						else
							releaseWebSocket(item);
					};
					
					item.ws.onerror = function(err){
						cancelWaitTimeout();
						if(!!verbose)
							_.log("Error occourred on "+item.id+" at "+_.dateStr(_.timestamp(),3)+": "+err);
						
						var leave_open = false;
						if(_.isFunction(error_fn)){
							try{
								leave_open = error_fn(err);
							}catch(err_err){
								_.log("Websocket error: "+err_err+"\nwhile calling error function:\n"+error_fn+"\non error: "+_.toStr(err));
							}
						}
						else
							_.log("Websocket error: "+_.toStr(err));
						
						if(!!leave_open)
							startWaitTimeout();
						else
							releaseWebSocket(item);
					};
					
					var msg_str = _.toStr(msg);
					item.ws.send(msg_str);
					startWaitTimeout();
					if(!!verbose)
						_.log("Message sent on "+item.id+" at "+_.dateStr(_.timestamp(),3));
				}
			}, open_item);
		};
		
		var callMsgOrFn = function(msg_or_fn, fn_context, max_wait_ms, open_item){
			var result = null;
			var error = null;
			var complete = false;
			
			var result_fn = function(data){
				result = data;
				complete = true;
			};
			var error_fn = function(err){
				error = err;
				if(!!verbose)
					_.log("Error while using WebSocket in callMsgOrFn: "+err);
				complete = true;
			};
			
			if(_.isFunction(msg_or_fn)){
				getWebSocket(function(item){
					if(item.state=="closed" || item.state=="disposed" || item.state=="disposing")
						error_fn(no_open_msg);
					else{
						if(!!verbose)
							_.log("Using WebSocket "+item.id+" in callMsgOrFn");
						setImmediate(function(){ // necessaria per slegare l'esecuzione della funzione dalla notifica dell'evento di open...
							if(!!verbose)
								_.log("Really using WebSocket "+item.id+" in callMsgOrFn");
							try{
								var fn_ret = msg_or_fn.call(fn_context, item);
								result_fn(fn_ret);
							}catch(err){
								error_fn(err);
							}
							releaseWebSocket(item);
						});
					}
				}, open_item);
			}
			else
				sendMsg(msg_or_fn, result_fn, error_fn, max_wait_ms, open_item);
			
			while(!complete){
				deasync.sleep(500);
			}
			if(_.is(error))
				throw error;
			return result;
		};
		
		var callMsg = function(msg, max_wait_ms, open_item){
			return callMsgOrFn(msg, null, max_wait_ms, open_item);
		};
		
		var callFn = function(fn, fn_context, open_item){
			return callMsgOrFn(fn, fn_context, null, open_item);
		};
		
		
		
		var verboseMode = function(setting_verbose){
			if(_.is(setting_verbose))
				verbose = setting_verbose;
			return verbose;
		};
		
		return {
			sendMsg: sendMsg,
			callMsg: callMsg,
			callFn: callFn,
			verbose: verboseMode
		};
	}
		
};

_.mixin(_websockets);



var _file_utils = {
	
	resolvePath: function(path, relative_dir){
		if(!_.startsWith(path,"/")){
			if(!_.is(relative_dir))
				relative_dir = __dirname;
			if(_.endsWith(relative_dir, "/"))
				relative_dir = relative_dir.substring(0, relative_dir.length-1);
			
			if(_.startsWith(path,"./"))
				path = path.substring(2);
			while(_.startsWith(path,"..")){
				relative_dir = relative_dir.substring(0, relative_dir.lastIndexOf("/")); 
				path = (path.length > 3) ? path.substring(3) : "";
			}
			path = _.isNotEmptyString(path) ? (relative_dir+"/"+path) : relative_dir;
		}
		
		if(_.endsWith(path, "/"))
			path = path.substring(0, path.length-1);
		return path;
	},
	
	doesExist: function(path, relative_dir){
		var fs = require("fs");
		path = this.resolvePath(path, relative_dir);
		try{
			fs.accessSync(path);
			return true;
		}catch(err){
			return false;	
		}
	},
	
	assureDirectoryExists: function(path, relative_dir){
		var fs = require("fs");
		
		path = this.resolvePath(path, relative_dir);
		if(_.startsWith(path, "/"))
			path = path.substring(1);
		var arr = path.split("/");
		
		var curr = "";
		_.each(arr, function(folder, pos){
			if( (pos<arr.length-1) || (folder.indexOf(".")<0) ){
				curr = curr+"/"+folder;
				if(!_.doesExist(curr))
					fs.mkdirSync(curr);
			}
		});
		
		return curr;
	},
	
	readFile: function(path, relative_dir){
		var fs = require("fs");
		path = this.resolvePath(path, relative_dir);
		try{
			return _.parse(fs.readFileSync(path, {encoding: "UTF-8"}));
		}catch(err){}
	},
	
	writeFile: function(path, data, relative_dir){
		var fs = require("fs");
		path = this.resolvePath(path, relative_dir);
		try{
			_.assureDirectoryExists(path);
			fs.writeFileSync(path, _.toStr(data));
			return true;
		}catch(err){}
	},
	
	appendFile: function(path, data, relative_dir){
		var fs = require("fs");
		path = this.resolvePath(path, relative_dir);
		try{
			_.assureDirectoryExists(path);
			fs.appendFileSync(path, _.toStr(data));
			return true;
		}catch(err){}
	},
	
	deleteFile: function(path, relative_dir){
		var fs = require("fs");
		path = this.resolvePath(path, relative_dir);
		try{
			fs.unlinkSync(path);
			return true;
		}catch(err){
			return false;
		}
	},
	
	renameFile: function(path, new_path, relative_dir){
		var fs = require("fs");
		path = this.resolvePath(path, relative_dir);
		new_path = this.resolvePath(new_path, relative_dir);
		try{
			fs.renameSync(path, new_path);
			return true;
		}catch(err){
			return false;
		}
	},
	
	copyFile: function(path, copy_path, relative_dir){
		var fs = require("fs");
		path = this.resolvePath(path, relative_dir);
		new_path = this.resolvePath(copy_path, relative_dir);
		try{
			fs.copyFileSync(path, copy_path);
			return true;
		}catch(err){
			return false;
		}
	},
	
	listDir: function(path, relative_dir){
		var fs = require("fs");
		path = this.resolvePath(path, relative_dir);
		try{
			return fs.readdirSync(path);
		}catch(err){}
	}

};

_.mixin(_file_utils);



var _http_utils = {
		
	server: function(actions_obj, config, dont_start){
		var server = {
			actions_obj: _.isObject(actions_obj) ? actions_obj : {},
			config: _.isObject(config) ? config : {},
			
			createHttpServer: function(){
				var http = require('http');
				var url = require("url");
				
				var port = _.tryParse(this.config.port, 7981);
				var verbose = _.tryParse(this.config.verbose, false);
				
				var errorResponse = function(err, path, query, req, res){
					return ("<html><body><h1>Error requesting path "+path+"</h1>"+
							"<div>Request parameters:<br/>"+_.toStr(query)+"</div>"+
							"<div>Error:<br/>"+err+"</div>"+
							"</body></html>");
				};
				
				var defaultResponse = function(path, query, req, res){
					return ("<html><body><h1>Path not found: "+path+"</h1>"+
							"<div>Requested path '"+path+"' is not present in this server.</div>"+
							"<div><a onclick='history.back()'>Go back</a></div>"+
							"</body></html>");
				};
				
				var that = this;
				var server = http.createServer(function(req, res){
					// initialize request variables
					var parsed = url.parse(req.url, true); // true to get query as object
					var path = parsed.pathname.substring(1);
					var query = parsed.query;
					if(verbose)
						_.log("Calling path "+path+" with args: "+_.toStr(query));
						
					var response = "";
					var response_headers = null;
					
					// resolve action and arguments from path and params, with actions_obj and config, defaulting to the welcome action
					var path_items = path.split("/");
					var action_fn = that.actions_obj;
					var subpath = "";
					_.find(path_items, function(path_item, pos){
						action_fn = action_fn[path_item];
						if(_.isFunction(action_fn)){
							for(var i=pos+1; i<path_items.length; i++){
								subpath += ((subpath.length>0) ? "/" : "") + path_items[i]; 
							}
							return true;
						}
						else 
							return (!_.isObject(action_fn));
					});
					if( (!_.is(action_fn)) && (!_.isNotEmptyString(path)) ){
						if(_.isNotEmptyString(that.config.welcome_action))
							action_fn = that.actions_obj[that.config.welcome_action];
						else if(_.is(that.actions_obj.welcome))
							action_fn = that.actions_obj.welcome;
					}
					
					// call the action and get resulting response
					try{
						if(_.isFunction(action_fn))
							response = that.callAction(action_fn, subpath, query, req, res);
						else if(_.is(action_fn))
							response = _.toStr(action_fn);
						else if(_.isFunction(that.actions_obj._))
							response = that.actions_obj._.call(that.actions_obj, path, query, req, res);
						else
							response = defaultResponse(path, query, req, res);
					}catch(err){
						if(verbose)
							_.log("Error at call on path "+path+": "+err);
						if(_.is(that.config.error_response)){
							if(_.isFunction(that.config.error_response)){
								try{
									response = that.config.error_response(err, path, query, req, res); 
								}catch(err_err){
									if(verbose)
										_.log("Error processing 'error' server function: "+err_err);
									err = "Error processing 'error' server function: "+err_err+
											"\nThrowed error: "+err;
								}
							}
							else 
								response = _.toStr(that.config.error_response);
						}
						if(!_.isNotEmptyString(response))
							response = errorResponse(err, path, query, req, res);
					}
					
					// if response is pointing to a file, serve that file
					var req_file = _.isNotEmptyString(response) ? 
							_.resolvePath(response, that.config.public_dir) : null;
					if(_.isNotEmptyString(req_file) && _.doesExist(req_file)){
						if(that.serveFile(req_file, req, res))
							return;
					}
					
					// handle response headers and body 
					if(_.isObject(response) && _.is(response.headers)){
						response_headers = response.headers;
						response = response.body;
					}
					if(!_.is(response_headers)){
						response_headers = _.isObject(that.config.response_headers) ? 
								that.config.response_headers : {};
					}
					if(!_.isNotEmptyString(response_headers["Content-Type"])){
						response_headers["Content-Type"] = 
								(_.isObject(response) || _.isArray(response)) ? 
									"application/json" : "text/html";
					}
					
					// write out response headers and body
					res.writeHead(200, response_headers);
					if(_.is(response)){
						if(!_.isString(response))
							response = _.toStr(response);
						response = _.trimBounds(response);
						if(response_headers["Content-Type"] == "text/html"){ 
							if(!_.startsWith(response, "<"))
								response = "<div>"+response+"</div>";
							if(!_.startsWith(response, "<html>"))
								response = "<html><body>"+response+"</body></html>";
						}
						res.end(response);
					}
					else
						res.end();
				
					if(verbose)
						_.log("Call at path "+path+" terminated");
				});
				
				return server;
			},
			
			callAction: function(action, path, params, req, res){
				var action_fn = _.isFunction(action) ? action : this.actions_obj[action];
				if(_.isFunction(action_fn))
					return action_fn.call(this.actions_obj, path, params, req, res);
				else
					throw ("Action not found: "+action);
			},
			
			serveFile: function(file_path, req, res){
				var verbose = _.tryParse(this.config.verbose, false);
				if(_.isNotEmptyString(file_path) && _.doesExist(file_path)){
					if(verbose)
						_.log("Serving file "+file_path+"...");
					var ext = file_path.substring(file_path.lastIndexOf(".")+1);
					var mime = _.mimeType(ext);
					res.writeHead(200, { "Content-Type": mime });
					var fileStream = require("fs").createReadStream(file_path);
			        fileStream.pipe(res);
			        if(verbose)
						_.log("File "+file_path+" served as "+mime);
			        return true;
				}
				else{
					if(verbose)
						_.log("ERROR: file "+file_path+" not found!");
					return false;
				}
		    },
			
			start: function(){
				_.log("Starting server http://127.0.0.1:"+this.config.port+"...");
				this.http_server = this.createHttpServer(); 
				this.http_server.listen(this.config.port, "127.0.0.1");
				_.log("Server http://127.0.0.1:"+this.config.port+" started...");
			},
			restart: function(actions_obj, config, extending_currents){
				if(_.is(this.http_server))
					this.stop();
				if(_.isObject(actions_obj))
					this.actions_obj = (!!extending_currents) ? 
							_.extendObj(this.actions_obj, actions_obj, true) : actions_obj;
				if(_.isObject(config))
					this.config = (!!extending_currents) ? 
							_.extendObj(this.config, config, true) : config;
				this.start();
			},
			stop: function(){
				if(_.is(this.http_server)){
					_.log("Stopping server http://127.0.0.1:"+this.config.port+"...");
					//var closed = false;
					//this.http_server.close(function(){ closed = true; });
					// DEPRECATED ! _.wait(function(){ return closed; });
					//this.http_server = null;
					//_.log("Server http://127.0.0.1:"+this.config.port+" stopped...");
					this.http_server.close(function(){ _.log("Server http://127.0.0.1:"+this.config.port+" stopped..."); });
				}
			}
		};
		
		if(!dont_start)
			server.start();
		return server;
	},	

	server_test_actions: function(){
		return {
			test_string: "Just a simple string on this path... :-! ",
			test_fn: function(path, args, req, res){
				return ("<div>Test function, path: "+path+", args: <br/>"+_.toStr(args)+"</div>");
			},
			test_obj:{
				field:{
					action: function(path, args, req, res){
						return "Action called on provobj.field: "+path+"("+
								(_.is(args) ? _.toStr(args) : "")+")";
					}
				}
			},
			test_file: function(){
				return "controller_icon.jpg";
			},
			test_error: function(args, subpath, req, res){
				throw "Don't worry, it's just a test error! ;-)";
			},
			_: function(path, args, req, res){
				return ("Unbound action at path "+path+"!!");
			},
			welcome: "Hello dear! You are welcome! ;-)"
		};
	},
	server_test_config: function(){
		return {
			port: 7983,
			//public_dir: "/home/fabris/Immagini",
			//welcome_action: "test_string",
			error_response: function(err, path, query, req, res){
				return ("Hey, that's an error: "+err);
			},
			verbose: true
		};
	}

};

_.mixin(_http_utils);



var _general_utils = {
		
	log: function(msg){
		console.log(msg);
		var now = _.timestamp();
		var file_name = "logs/"+_.dateStr(now, false, true, "_")+".txt";
		_.appendFile(file_name, (_.hourStr(now, 3)+": "+msg+"\n"));
	},
	
	sleep: function(sleep_ms){
		var deasync = require("deasync");
		deasync.sleep(sleep_ms);
	},
	
	wait: function(condition_fn, sleep_ms){
		if(!_.isFunction(condition_fn))
			throw "_.wait: condition function is required";
		sleep_ms = _.tryParse(sleep_ms, 200);
		
		var deasync = require("deasync");
		var ok = false;
		while(!ok){
			deasync.sleep(sleep_ms);
			ok = condition_fn(); 
		}
		return ok;
	},
	
	gc: function(){
		if(_.isFunction(global.gc)){
			global.gc();
			return true;
		}
		else{
			_.log("Unable to execute the garbage collector: start node with the --expose-gc " +
					"option to make the garbage collector available to js");
			return false;
		}
	},
	
	programInfo: function(){
		return {
			_node_file: __filename,
			_node_folder: __dirname
		};
	}
};

_.mixin(_general_utils);





if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
}



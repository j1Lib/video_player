var j1Lib_video_ajax = function(url,callback,worker,orginal){
	var url_ = function(data){
		return (window.URL || window.webkitURL).createObjectURL(data);
	};
	if (orginal){
		callback(url);
	}else{
		if (worker){
			var ajax_ = new Worker("js/j1Lib_video_ajax_worker.js");
			ajax_.postMessage({ "url": url });
			ajax_.onmessage = function(e){
				callback(url_(e.data));
			};
		}else{
			var ajax_ = j1Lib_ajax(url,function(data){
				callback(url_(data.response));		
			},function(){			
			});
			ajax_.responseType = 'blob';
			ajax_.send();		
		}
	}	
};
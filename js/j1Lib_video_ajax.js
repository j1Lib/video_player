var j1Lib_ajax=function(n,t,e){var r=new XMLHttpRequest;return r.open("GET",n),r.addEventListener("load",function(){200==r.status?t(r):e(r)}),r.addEventListener("error",function(){e(r)}),r};
onmessage = function(e) {
	var ajax = j1Lib_ajax(e.data.url,function(data){
		postMessage(data.response);		
	},function(){			
	});
	ajax.responseType = 'blob';
	ajax.send();
};


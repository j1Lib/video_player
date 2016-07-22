var j1Lib_video_control = function(config){
		
	var canvas = config.bar;
	var duration = config.duration;
	
	var w = canvas.width;
	var h = canvas.height;
	this.resize = function(canvas){
		w = canvas.width;
		h = canvas.height;		
		if (this.reset){
			this.reset();
		};
	};
	this.resize(canvas);
	var load = "rgba(255,255,255,0.5)";
	var unload = "rgba(33,33,33,0.5)";	
	canvas.addEventListener('click', function(event){		
		var size = w/(part.length+1);		
		var block = parseInt(event.offsetX / size, 0);	
		var	second = event.offsetX-size*block;
		player.playAt(block,second);		
	});
	var canvas_ = canvas;
	canvas = canvas.getContext("2d");
	this.reset = function(){
		var size = w/(part.length+1);
		for (var i = 0 ; i<part.length;i++){
			canvas.fillStyle = part[i] || unload;
			var start = parseInt(i*size,0);
			var end = parseInt((i+1)*size,0);
			canvas.fillRect(start,0,end,h);
		}
	};
	var length=0;
	var part=[];
	this.setBuffered = function(i){
		part[i] = load;
		this.reset();
	};
	this.setPart = function(part_){
		for (var i = 0 ; i<part_;i++){
			part.push(unload);
		}
		this.reset();
	};
	this.setLength = function(length_){
		length = length_;
	};
	this.setProgress = function(block,second){
		var size = w/(part.length+1);
		var start = parseInt(block*size,0);
		duration.style.width=start+second+"px";
	};
	var player=null;
	this.setVideo = function(videoplayer){
		player = videoplayer;
	};
	this.show = function(){
		duration.style.display="block";
		canvas_.style.display="block";
	};
	this.hide = function(){
		duration.style.display="none";
		canvas_.style.display="none";		
	};
	this.hide();
};

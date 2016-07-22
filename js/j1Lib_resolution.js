var j1Lib_resolution = function(){
	var w = innerWidth-innerWidth*0.2;
	var h = innerHeight-innerHeight*0.2;
	h=w/1280*720;	
	player_.style.width = w+"px";
	player_.style.height = h+"px";	
	player_video_.width = w;
	player_video_.height = h;	
	player_control_.width = w;
	video_.resize(player_video_);
	video_control_.resize(player_video_);
};
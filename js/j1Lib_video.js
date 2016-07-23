var j1Lib_video = function(config){	
		
	var canvas=config.render;
	var control=config.control;
	var thread=config.thread;
	if (thread==undefined){
		thread=3;
	}
	var worker=config.worker;
	if (worker==undefined){
		worker=true;
	}
	var fps = config.fps;
	if (fps==undefined){
		fps=60;
	}
	var autoplay = config.autoplay;
	if (autoplay==undefined){
		autoplay=false;
	}
	var acao = config.acao;
	if (acao==undefined){
		acao=true;
	}
	var preload = config.preload;
	if (preload==undefined){
		preload=true;
	}
	
	var this_ = this;
	var w = 0;	
	var h = 0;
	this.resize = function(canvas){
		w = canvas.width;	
		h = canvas.height;
	};
	this.resize(canvas);
	canvas.addEventListener('click', function(){
		if (playing){
			if (playing.paused){
				playing.play();
			}else{
				control.setProgress(playing_i,playing.currentTime);
				playing.pause();
			}
		}		
	});
	control.setVideo(this);
	var title = null;	
	var video = [];
	var video_error = function(msg){
		canvas.fillStyle="rgba(33,33,33,0.8)";
		canvas.fillRect(0,0,w,h);
		canvas.fillStyle="white";
		canvas.fillText(msg,50,50);
	};
	var video_ = function(url){
		var video__ = document.createElement('video');	
		video__.src = url;
		video__.preload = "auto";
		video__.addEventListener('play', function(){
			if (playing==this){
				var this__ = this;				
				play_ = setInterval(function(){
					canvas.drawImage(this__,0,0,w,h);					
				},fps);
				control.hide();
			}			
		});
		video__.addEventListener('pause', function(){
			if (playing==this){	
				clearInterval(play_);
				control.show();
				video_error(title);				
			}
		});
		video__.addEventListener('ended', function(){			
			if (playing==this){
				clearInterval(play_);
				var i = video.indexOf(this);
				play(video[i+1]);
			}
		});
		video__.addEventListener('loadedmetadata', function(){
			var i = video.indexOf(this);
			if (i==0){
				setTimeout(function(){
					if (autoplay){
						video[0].autoplay = true;
					}else{
						video_error("按一下播放 "+title);
					}					
				},1000);
			}
			control.setBuffered(i);
			this.removeEventListener("loadedmetadata",arguments.callee);			
		});
		return video__;
	};
	var reset = function(){
		canvas.clearRect(0,0,w,h);
	};
	var play_ = null;
	var playing = null;
	var playing_i = null;
	var play = function(video__){
		playing = video__;
		playing_i = video.indexOf(video__);
		video__.currentTime=0;
		video__.muted=false;
		video__.play();
	};
	var src = "";
	var img = null;
	this.src ="";
	Object.defineProperty(this, "src", {
		get: function() {
			return src;
		},
		set: function(src_) {
			src = src_;
			j1Lib_ajax(src_+".json",function(data){
				data = JSON.parse(data.response);
				title = data.title;				
				if (typeof data.video.part === "object"){
					for (var i = 0 ; i<data.video.part.length ; i++){
						video.push(data.video.part[i]);
					}
				}else{
					for (var i = 0 ; i<=data.video.part ; i++){				
						video.push(data.video.server.replace("%server%",location.hostname)+"_"+i+"."+data.video.format);
					}
				}				
				buffer_(function(){					
					var canvas_ = canvas;
					canvas = canvas.getContext("2d");					
					video_error("播放器初始化中……");
					playing=video[0];
					playing_i = 0;
				});
				this_.duration=data.length;
				this_.part=data.video.part;
				control.setPart(video.length);
				control.setLength(data.length);
			},function(){
				canvas = canvas.getContext("2d");
				video_error("錯誤: 影片不存在");
			}).send();
		}
	});
	var jamed = [];
	var buffer = function(video_index,callback){			
		j1Lib_video_ajax(video[video_index],function(data){
			if (video[video_index]!=undefined){
				video[video_index]=video_(data);
				video[video_index].addEventListener('error', function(){			
					video_error("錯誤: 播放器緩存衝突");
				});
			}			
			if (!acao && video_index!=0 && preload){
				video[video_index].muted=true;
				video[video_index].play();
				video[video_index].addEventListener("progress", function(event){
					if( this.duration ) {
						var buffered = this.buffered.end(0) || 0;
						var percent = (buffered/this.duration) * 100;
						clearTimeout(jamed[video_index]);
						if( percent >= 100 ) {							
							this.removeEventListener("progress",arguments.callee);
							this.pause();
							this.currentTime = 0;
							callback();							
						}else if(this.currentTime<buffered){							
							this.currentTime=buffered;
							console.log(video_index+"_"+this.currentTime+"_"+buffered);							
						}else{
							var this_ = this;
							console.log(video_index+"_jamed");							
							jamed[video_index]=setTimeout(function(){
								this_.load();
								if (this_.paused){									
									this_.play();
								}
							}, 10000);
						}
					}
				},false);				
			}else{
				callback();
			}			
		},worker,!acao || video_index==0);
	};	
	var pool = 0;	
	var thread_ = function(){
		buffer(pool++,function(){			
			if (pool < video.length){
				thread_();				
			}else{
				if (--thread==0){
					console.log("Download Complete");
				}
			}
		});
	};
	var buffer_ = function(callback){
		buffer(pool++,function(){
			callback();
			for (var i=0;i<thread;i++){	
				thread_();
			}
		});		
	};
	this.pause = function(){
		playing.pause();
	};
	this.play = function(){
		playing.play();
	};
	this.playAt = function(part,second){
		if (typeof video[part] === "object"){
			playing.pause();
			play(video[part]);
			playing.currentTime=second;
		}
	};
	this.duration = "";
	this.part = 0;
};
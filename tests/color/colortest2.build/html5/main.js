
//Change this to true for a stretchy canvas!
//
var RESIZEABLE_CANVAS=false;

//Start us up!
//
window.onload=function( e ){

	if( RESIZEABLE_CANVAS ){
		window.onresize=function( e ){
			var canvas=document.getElementById( "GameCanvas" );

			//This vs window.innerWidth, which apparently doesn't account for scrollbar?
			var width=document.body.clientWidth;
			
			//This vs document.body.clientHeight, which does weird things - document seems to 'grow'...perhaps canvas resize pushing page down?
			var height=window.innerHeight;			

			canvas.width=width;
			canvas.height=height;
		}
		window.onresize( null );
	}
	
	game_canvas=document.getElementById( "GameCanvas" );
	
	game_console=document.getElementById( "GameConsole" );

	try{
	
		bbInit();
		bbMain();
		
		if( game_runner!=null ) game_runner();
		
	}catch( err ){
	
		alertError( err );
	}
}

var game_canvas;
var game_console;
var game_runner;

//${CONFIG_BEGIN}
CFG_CONFIG="debug";
CFG_HOST="winnt";
CFG_IMAGE_FILES="*.png|*.jpg";
CFG_LANG="js";
CFG_MOJO_AUTO_SUSPEND_ENABLED="false";
CFG_MUSIC_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_OPENGL_GLES20_ENABLED="false";
CFG_PARSER_FUNC_ATTRS="0";
CFG_SOUND_FILES="*.wav|*.ogg|*.mp3|*.m4a";
CFG_TARGET="html5";
CFG_TEXT_FILES="*.txt|*.xml|*.json";
//${CONFIG_END}

//${METADATA_BEGIN}
var META_DATA="[autotiles_flx.png];type=image/png;width=128;height=8;\n[button_flx.png];type=image/png;width=80;height=60;\n[cursor_flx.png];type=image/png;width=24;height=32;\n[default_flx.png];type=image/png;width=16;height=16;\n[empty_cursor_flx.png];type=image/png;width=1;height=1;\n[system_font_10_flx.png];type=image/png;width=1152;height=14;\n[system_font_11_flx.png];type=image/png;width=1152;height=15;\n[system_font_12_flx.png];type=image/png;width=1440;height=17;\n[system_font_13_flx.png];type=image/png;width=1440;height=18;\n[system_font_14_flx.png];type=image/png;width=1632;height=19;\n[system_font_15_flx.png];type=image/png;width=1728;height=21;\n[system_font_16_flx.png];type=image/png;width=1920;height=22;\n[system_font_17_flx.png];type=image/png;width=1920;height=23;\n[system_font_8_flx.png];type=image/png;width=864;height=11;\n[system_font_9_flx.png];type=image/png;width=864;height=12;\n[mojo_font.png];type=image/png;width=864;height=13;\n";
//${METADATA_END}

function getMetaData( path,key ){
	var i=META_DATA.indexOf( "["+path+"]" );
	if( i==-1 ) return "";
	i+=path.length+2;

	var e=META_DATA.indexOf( "\n",i );
	if( e==-1 ) e=META_DATA.length;

	i=META_DATA.indexOf( ";"+key+"=",i )
	if( i==-1 || i>=e ) return "";
	i+=key.length+2;

	e=META_DATA.indexOf( ";",i );
	if( e==-1 ) return "";

	return META_DATA.slice( i,e );
}

function loadString( path ){
	var xhr=new XMLHttpRequest();
	xhr.open( "GET","data/"+path,false );
	xhr.send( null );
	if( (xhr.status==200) || (xhr.status==0) ) return xhr.responseText;
	return "";
}

function loadImage( path,onloadfun ){
	var ty=getMetaData( path,"type" );
	if( ty.indexOf( "image/" )!=0 ) return null;

	var image=new Image();
	
	image.meta_width=parseInt( getMetaData( path,"width" ) );
	image.meta_height=parseInt( getMetaData( path,"height" ) );
	image.onload=onloadfun;
	image.src="data/"+path;
	
	return image;
}

function loadAudio( path ){
	var audio=new Audio( "data/"+path );
	return audio;
}

//${TRANSCODE_BEGIN}

// Javascript Monkey runtime.
//
// Placed into the public domain 24/02/2011.
// No warranty implied; use at your own risk.

//***** JavaScript Runtime *****

var D2R=0.017453292519943295;
var R2D=57.29577951308232;

var err_info="";
var err_stack=[];

var dbg_index=0;

function push_err(){
	err_stack.push( err_info );
}

function pop_err(){
	err_info=err_stack.pop();
}

function stackTrace(){
	if( !err_info.length ) return "";
	var str=err_info+"\n";
	for( var i=err_stack.length-1;i>0;--i ){
		str+=err_stack[i]+"\n";
	}
	return str;
}

function print( str ){
	if( game_console ){
		game_console.value+=str+"\n";
		game_console.scrollTop = game_console.scrollHeight - game_console.clientHeight;
	}
	if( window.console!=undefined ){
		window.console.log( str );
	}
	return 0;
}

function alertError( err ){
	if( typeof(err)=="string" && err=="" ) return;
	alert( "Monkey Runtime Error : "+err.toString()+"\n\n"+stackTrace() );
}

function error( err ){
	throw err;
}

function debugLog( str ){
	print( str );
}

function debugStop(){
	error( "STOP" );
}

function dbg_object( obj ){
	if( obj ) return obj;
	error( "Null object access" );
}

function dbg_array( arr,index ){
	if( index<0 || index>=arr.length ) error( "Array index out of range" );
	dbg_index=index;
	return arr;
}

function new_bool_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=false;
	return arr;
}

function new_number_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=0;
	return arr;
}

function new_string_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]='';
	return arr;
}

function new_array_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=[];
	return arr;
}

function new_object_array( len ){
	var arr=Array( len );
	for( var i=0;i<len;++i ) arr[i]=null;
	return arr;
}

function resize_bool_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=false;
	return arr;
}

function resize_number_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=0;
	return arr;
}

function resize_string_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]="";
	return arr;
}

function resize_array_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=[];
	return arr;
}

function resize_object_array( arr,len ){
	var i=arr.length;
	arr=arr.slice(0,len);
	if( len<=i ) return arr;
	arr.length=len;
	while( i<len ) arr[i++]=null;
	return arr;
}

function string_compare( lhs,rhs ){
	var n=Math.min( lhs.length,rhs.length ),i,t;
	for( i=0;i<n;++i ){
		t=lhs.charCodeAt(i)-rhs.charCodeAt(i);
		if( t ) return t;
	}
	return lhs.length-rhs.length;
}

function string_replace( str,find,rep ){	//no unregex replace all?!?
	var i=0;
	for(;;){
		i=str.indexOf( find,i );
		if( i==-1 ) return str;
		str=str.substring( 0,i )+rep+str.substring( i+find.length );
		i+=rep.length;
	}
}

function string_trim( str ){
	var i=0,i2=str.length;
	while( i<i2 && str.charCodeAt(i)<=32 ) i+=1;
	while( i2>i && str.charCodeAt(i2-1)<=32 ) i2-=1;
	return str.slice( i,i2 );
}

function string_starts_with( str,substr ){
	return substr.length<=str.length && str.slice(0,substr.length)==substr;
}

function string_ends_with( str,substr ){
	return substr.length<=str.length && str.slice(str.length-substr.length,str.length)==substr;
}

function string_from_chars( chars ){
	var str="",i;
	for( i=0;i<chars.length;++i ){
		str+=String.fromCharCode( chars[i] );
	}
	return str;
}


function object_downcast( obj,clas ){
	if( obj instanceof clas ) return obj;
	return null;
}

function object_implements( obj,iface ){
	if( obj && obj.implments && obj.implments[iface] ) return obj;
	return null;
}

function extend_class( clas ){
	var tmp=function(){};
	tmp.prototype=clas.prototype;
	return new tmp;
}

function ThrowableObject(){
}

ThrowableObject.prototype.toString=function(){ 
	return "Uncaught Monkey Exception"; 
}

// HTML5 mojo runtime.
//
// Copyright 2011 Mark Sibly, all rights reserved.
// No warranty implied; use at your own risk.

var gl=null;	//global WebGL context - a bit rude!

KEY_LMB=1;
KEY_RMB=2;
KEY_MMB=3;
KEY_TOUCH0=0x180;

function eatEvent( e ){
	if( e.stopPropagation ){
		e.stopPropagation();
		e.preventDefault();
	}else{
		e.cancelBubble=true;
		e.returnValue=false;
	}
}

function keyToChar( key ){
	switch( key ){
	case 8:
	case 9:
	case 13:
	case 27:
	case 32:
		return key;
	case 33:
	case 34:
	case 35:
	case 36:
	case 37:
	case 38:
	case 39:
	case 40:
	case 45:
		return key | 0x10000;
	case 46:
		return 127;
	}
	return 0;
}

//***** gxtkApp class *****

function gxtkApp(){

	if( typeof( CFG_OPENGL_GLES20_ENABLED )!="undefined" && CFG_OPENGL_GLES20_ENABLED=="true" ){
		this.gl=game_canvas.getContext( "webgl" );
		if( !this.gl ) this.gl=game_canvas.getContext( "experimental-webgl" );
	}else{
		this.gl=null;
	}

	this.graphics=new gxtkGraphics( this,game_canvas );
	this.input=new gxtkInput( this );
	this.audio=new gxtkAudio( this );

	this.loading=0;
	this.maxloading=0;

	this.updateRate=0;
	this.startMillis=(new Date).getTime();
	
	this.dead=false;
	this.suspended=false;
	
	var app=this;
	var canvas=game_canvas;
	
	function gxtkMain(){
	
		var input=app.input;
	
		canvas.onkeydown=function( e ){
			input.OnKeyDown( e.keyCode );
			var chr=keyToChar( e.keyCode );
			if( chr ) input.PutChar( chr );
			if( e.keyCode<48 || (e.keyCode>111 && e.keyCode<122) ) eatEvent( e );
		}

		canvas.onkeyup=function( e ){
			input.OnKeyUp( e.keyCode );
		}

		canvas.onkeypress=function( e ){
			if( e.charCode ){
				input.PutChar( e.charCode );
			}else if( e.which ){
				input.PutChar( e.which );
			}
		}

		canvas.onmousedown=function( e ){
			switch( e.button ){
			case 0:input.OnKeyDown( KEY_LMB );break;
			case 1:input.OnKeyDown( KEY_MMB );break;
			case 2:input.OnKeyDown( KEY_RMB );break;
			}
			eatEvent( e );
		}
		
		canvas.onmouseup=function( e ){
			switch( e.button ){
			case 0:input.OnKeyUp( KEY_LMB );break;
			case 1:input.OnKeyUp( KEY_MMB );break;
			case 2:input.OnKeyUp( KEY_RMB );break;
			}
			eatEvent( e );
		}
		
		canvas.onmouseout=function( e ){
			input.OnKeyUp( KEY_LMB );
			input.OnKeyUp( KEY_MMB );
			input.OnKeyUp( KEY_RMB );
			eatEvent( e );
		}

		canvas.onmousemove=function( e ){
			var x=e.clientX+document.body.scrollLeft;
			var y=e.clientY+document.body.scrollTop;
			var c=canvas;
			while( c ){
				x-=c.offsetLeft;
				y-=c.offsetTop;
				c=c.offsetParent;
			}
			input.OnMouseMove( x,y );
			eatEvent( e );
		}

		canvas.onfocus=function( e ){
			if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="true" ){
				app.InvokeOnResume();
			}
		}
		
		canvas.onblur=function( e ){
			if( CFG_MOJO_AUTO_SUSPEND_ENABLED=="true" ){
				app.InvokeOnSuspend();
			}
		}
		
		canvas.ontouchstart=function( e ){
			for( var i=0;i<e.changedTouches.length;++i ){
				var touch=e.changedTouches[i];
				var x=touch.pageX;
				var y=touch.pageY;
				var c=canvas;
				while( c ){
					x-=c.offsetLeft;
					y-=c.offsetTop;
					c=c.offsetParent;
				}
				input.OnTouchStart( touch.identifier,x,y );
			}
			eatEvent( e );
		}
		
		canvas.ontouchmove=function( e ){
			for( var i=0;i<e.changedTouches.length;++i ){
				var touch=e.changedTouches[i];
				var x=touch.pageX;
				var y=touch.pageY;
				var c=canvas;
				while( c ){
					x-=c.offsetLeft;
					y-=c.offsetTop;
					c=c.offsetParent;
				}
				input.OnTouchMove( touch.identifier,x,y );
			}
			eatEvent( e );
		}
		
		canvas.ontouchend=function( e ){
			for( var i=0;i<e.changedTouches.length;++i ){
				input.OnTouchEnd( e.changedTouches[i].identifier );
			}
			eatEvent( e );
		}
		
		window.ondevicemotion=function( e ){
			var tx=e.accelerationIncludingGravity.x/9.81;
			var ty=e.accelerationIncludingGravity.y/9.81;
			var tz=e.accelerationIncludingGravity.z/9.81;
			var x,y;
			switch( window.orientation ){
			case   0:x=+tx;y=-ty;break;
			case 180:x=-tx;y=+ty;break;
			case  90:x=-ty;y=-tx;break;
			case -90:x=+ty;y=+tx;break;
			}
			input.OnDeviceMotion( x,y,tz );
			eatEvent( e );
		}

		canvas.focus();

		app.InvokeOnCreate();
		app.InvokeOnRender();
	}

	game_runner=gxtkMain;
}

var timerSeq=0;

gxtkApp.prototype.SetFrameRate=function( fps ){

	var seq=++timerSeq;
	
	if( !fps ) return;
	
	var app=this;
	var updatePeriod=1000.0/fps;
	var nextUpdate=(new Date).getTime()+updatePeriod;
	
	function timeElapsed(){
		if( seq!=timerSeq ) return;

		var time;		
		var updates=0;

		for(;;){
			nextUpdate+=updatePeriod;

			app.InvokeOnUpdate();
			if( seq!=timerSeq ) return;
			
			if( nextUpdate>(new Date).getTime() ) break;
			
			if( ++updates==7 ){
				nextUpdate=(new Date).getTime();
				break;
			}
		}
		app.InvokeOnRender();
		if( seq!=timerSeq ) return;
			
		var delay=nextUpdate-(new Date).getTime();
		setTimeout( timeElapsed,delay>0 ? delay : 0 );
	}
	
	setTimeout( timeElapsed,updatePeriod );
}

gxtkApp.prototype.IncLoading=function(){
	++this.loading;
	if( this.loading>this.maxloading ) this.maxloading=this.loading;
	if( this.loading==1 ) this.SetFrameRate( 0 );
}

gxtkApp.prototype.DecLoading=function(){
	--this.loading;
	if( this.loading!=0 ) return;
	this.maxloading=0;
	this.SetFrameRate( this.updateRate );
}

gxtkApp.prototype.GetMetaData=function( path,key ){
	return getMetaData( path,key );
}

gxtkApp.prototype.Die=function( err ){
	this.dead=true;
	this.audio.OnSuspend();
	alertError( err );
}

gxtkApp.prototype.InvokeOnCreate=function(){
	if( this.dead ) return;
	
	try{
		gl=this.gl;
		this.OnCreate();
		gl=null;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnUpdate=function(){
	if( this.dead || this.suspended || !this.updateRate || this.loading ) return;
	
	try{
		gl=this.gl;
		this.input.BeginUpdate();
		this.OnUpdate();		
		this.input.EndUpdate();
		gl=null;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnSuspend=function(){
	if( this.dead || this.suspended ) return;
	
	try{
		gl=this.gl;
		this.suspended=true;
		this.OnSuspend();
		this.audio.OnSuspend();
		gl=null;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnResume=function(){
	if( this.dead || !this.suspended ) return;
	
	try{
		gl=this.gl;
		this.audio.OnResume();
		this.OnResume();
		this.suspended=false;
		gl=null;
	}catch( ex ){
		this.Die( ex );
	}
}

gxtkApp.prototype.InvokeOnRender=function(){
	if( this.dead || this.suspended ) return;
	
	try{
		gl=this.gl;
		this.graphics.BeginRender();
		if( this.loading ){
			this.OnLoading();
		}else{
			this.OnRender();
		}
		this.graphics.EndRender();
		gl=null;
	}catch( ex ){
		this.Die( ex );
	}
}

//***** GXTK API *****

gxtkApp.prototype.GraphicsDevice=function(){
	return this.graphics;
}

gxtkApp.prototype.InputDevice=function(){
	return this.input;
}

gxtkApp.prototype.AudioDevice=function(){
	return this.audio;
}

gxtkApp.prototype.AppTitle=function(){
	return document.URL;
}

gxtkApp.prototype.LoadState=function(){
	var state=localStorage.getItem( ".mojostate@"+document.URL );
	if( state ) return state;
	return "";
}

gxtkApp.prototype.SaveState=function( state ){
	localStorage.setItem( ".mojostate@"+document.URL,state );
}

gxtkApp.prototype.LoadString=function( path ){
	return loadString( path );
}

gxtkApp.prototype.SetUpdateRate=function( fps ){
	this.updateRate=fps;
	
	if( !this.loading ) this.SetFrameRate( fps );
}

gxtkApp.prototype.MilliSecs=function(){
	return ((new Date).getTime()-this.startMillis)|0;
}

gxtkApp.prototype.Loading=function(){
	return this.loading;
}

gxtkApp.prototype.OnCreate=function(){
}

gxtkApp.prototype.OnUpdate=function(){
}

gxtkApp.prototype.OnSuspend=function(){
}

gxtkApp.prototype.OnResume=function(){
}

gxtkApp.prototype.OnRender=function(){
}

gxtkApp.prototype.OnLoading=function(){
}

//***** gxtkGraphics class *****

function gxtkGraphics( app,canvas ){
	this.app=app;
	this.canvas=canvas;
	this.gc=canvas.getContext( '2d' );
	this.tmpCanvas=null;
	this.r=255;
	this.b=255;
	this.g=255;
	this.white=true;
	this.color="rgb(255,255,255)"
	this.alpha=1;
	this.blend="source-over";
	this.ix=1;this.iy=0;
	this.jx=0;this.jy=1;
	this.tx=0;this.ty=0;
	this.tformed=false;
	this.scissorX=0;
	this.scissorY=0;
	this.scissorWidth=0;
	this.scissorHeight=0;
	this.clipped=false;
}

gxtkGraphics.prototype.BeginRender=function(){
	if( this.gc ) this.gc.save();
}

gxtkGraphics.prototype.EndRender=function(){
	if( this.gc ) this.gc.restore();
}

gxtkGraphics.prototype.Mode=function(){
	if( this.gc ) return 1;
	return 0;
}

gxtkGraphics.prototype.Width=function(){
	return this.canvas.width;
}

gxtkGraphics.prototype.Height=function(){
	return this.canvas.height;
}

gxtkGraphics.prototype.LoadSurface=function( path ){
	var app=this.app;
	
	function onloadfun(){
		app.DecLoading();
	}

	app.IncLoading();

	var image=loadImage( path,onloadfun );
	if( image ) return new gxtkSurface( image,this );

	app.DecLoading();
	return null;
}

gxtkGraphics.prototype.SetAlpha=function( alpha ){
	this.alpha=alpha;
	this.gc.globalAlpha=alpha;
}

gxtkGraphics.prototype.SetColor=function( r,g,b ){
	this.r=r;
	this.g=g;
	this.b=b;
	this.white=(r==255 && g==255 && b==255);
	this.color="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
}

gxtkGraphics.prototype.SetBlend=function( blend ){
	switch( blend ){
	case 1:
		this.blend="lighter";
		break;
	default:
		this.blend="source-over";
	}
	this.gc.globalCompositeOperation=this.blend;
}

gxtkGraphics.prototype.SetScissor=function( x,y,w,h ){
	this.scissorX=x;
	this.scissorY=y;
	this.scissorWidth=w;
	this.scissorHeight=h;
	this.clipped=(x!=0 || y!=0 || w!=this.canvas.width || h!=this.canvas.height);
	this.gc.restore();
	this.gc.save();
	if( this.clipped ){
		this.gc.beginPath();
		this.gc.rect( x,y,w,h );
		this.gc.clip();
		this.gc.closePath();
	}
	this.gc.fillStyle=this.color;
	this.gc.strokeStyle=this.color;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.SetMatrix=function( ix,iy,jx,jy,tx,ty ){
	this.ix=ix;this.iy=iy;
	this.jx=jx;this.jy=jy;
	this.tx=tx;this.ty=ty;
	this.gc.setTransform( ix,iy,jx,jy,tx,ty );
	this.tformed=(ix!=1 || iy!=0 || jx!=0 || jy!=1 || tx!=0 || ty!=0);
}

gxtkGraphics.prototype.Cls=function( r,g,b ){
	if( this.tformed ) this.gc.setTransform( 1,0,0,1,0,0 );
	this.gc.fillStyle="rgb("+(r|0)+","+(g|0)+","+(b|0)+")";
	this.gc.globalAlpha=1;
	this.gc.globalCompositeOperation="source-over";
	this.gc.fillRect( 0,0,this.canvas.width,this.canvas.height );
	this.gc.fillStyle=this.color;
	this.gc.globalAlpha=this.alpha;
	this.gc.globalCompositeOperation=this.blend;
	if( this.tformed ) this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
}

gxtkGraphics.prototype.DrawPoint=function( x,y ){
	if( this.tformed ){
		var px=x;
		x=px * this.ix + y * this.jx + this.tx;
		y=px * this.iy + y * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
		this.gc.fillRect( x,y,1,1 );
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
		this.gc.fillRect( x,y,1,1 );
	}
}

gxtkGraphics.prototype.DrawRect=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
	this.gc.fillRect( x,y,w,h );
}

gxtkGraphics.prototype.DrawLine=function( x1,y1,x2,y2 ){
	if( this.tformed ){
		var x1_t=x1 * this.ix + y1 * this.jx + this.tx;
		var y1_t=x1 * this.iy + y1 * this.jy + this.ty;
		var x2_t=x2 * this.ix + y2 * this.jx + this.tx;
		var y2_t=x2 * this.iy + y2 * this.jy + this.ty;
		this.gc.setTransform( 1,0,0,1,0,0 );
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1_t,y1_t );
	  	this.gc.lineTo( x2_t,y2_t );
	  	this.gc.stroke();
	  	this.gc.closePath();
		this.gc.setTransform( this.ix,this.iy,this.jx,this.jy,this.tx,this.ty );
	}else{
	  	this.gc.beginPath();
	  	this.gc.moveTo( x1,y1 );
	  	this.gc.lineTo( x2,y2 );
	  	this.gc.stroke();
	  	this.gc.closePath();
	}
}

gxtkGraphics.prototype.DrawOval=function( x,y,w,h ){
	if( w<0 ){ x+=w;w=-w; }
	if( h<0 ){ y+=h;h=-h; }
	if( w<=0 || h<=0 ) return;
	//
  	var w2=w/2,h2=h/2;
	this.gc.save();
	this.gc.translate( x+w2,y+h2 );
	this.gc.scale( w2,h2 );
  	this.gc.beginPath();
	this.gc.arc( 0,0,1,0,Math.PI*2,false );
	this.gc.fill();
  	this.gc.closePath();
	this.gc.restore();
}

gxtkGraphics.prototype.DrawPoly=function( verts ){
	if( verts.length<6 ) return;
	this.gc.beginPath();
	this.gc.moveTo( verts[0],verts[1] );
	for( var i=2;i<verts.length;i+=2 ){
		this.gc.lineTo( verts[i],verts[i+1] );
	}
	this.gc.fill();
	this.gc.closePath();
}

gxtkGraphics.prototype.DrawSurface=function( surface,x,y ){
	if( !surface.image.complete ) return;
	
	if( this.white ){
		this.gc.drawImage( surface.image,x,y );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,0,0,surface.swidth,surface.sheight );
}

gxtkGraphics.prototype.DrawSurface2=function( surface,x,y,srcx,srcy,srcw,srch ){
	if( !surface.image.complete ) return;

	if( srcw<0 ){ srcx+=srcw;srcw=-srcw; }
	if( srch<0 ){ srcy+=srch;srch=-srch; }
	if( srcw<=0 || srch<=0 ) return;

	if( this.white ){
		this.gc.drawImage( surface.image,srcx,srcy,srcw,srch,x,y,srcw,srch );
		return;
	}
	
	this.DrawImageTinted( surface.image,x,y,srcx,srcy,srcw,srch  );
}

gxtkGraphics.prototype.DrawImageTinted=function( image,dx,dy,sx,sy,sw,sh ){

	if( !this.tmpCanvas ){
		this.tmpCanvas=document.createElement( "canvas" );
	}

	if( sw>this.tmpCanvas.width || sh>this.tmpCanvas.height ){
		this.tmpCanvas.width=Math.max( sw,this.tmpCanvas.width );
		this.tmpCanvas.height=Math.max( sh,this.tmpCanvas.height );
	}
	
	var tgc=this.tmpCanvas.getContext( "2d" );
	
	tgc.globalCompositeOperation="copy";

	tgc.drawImage( image,sx,sy,sw,sh,0,0,sw,sh );
	
	var imgData=tgc.getImageData( 0,0,sw,sh );
	
	var p=imgData.data,sz=sw*sh*4,i;
	
	for( i=0;i<sz;i+=4 ){
		p[i]=p[i]*this.r/255;
		p[i+1]=p[i+1]*this.g/255;
		p[i+2]=p[i+2]*this.b/255;
	}
	
	tgc.putImageData( imgData,0,0 );
	
	this.gc.drawImage( this.tmpCanvas,0,0,sw,sh,dx,dy,sw,sh );
}

//***** gxtkSurface class *****

function gxtkSurface( image,graphics ){
	this.image=image;
	this.graphics=graphics;
	this.swidth=image.meta_width;
	this.sheight=image.meta_height;
}

//***** GXTK API *****

gxtkSurface.prototype.Discard=function(){
	if( this.image ){
		this.image=null;
	}
}

gxtkSurface.prototype.Width=function(){
	return this.swidth;
}

gxtkSurface.prototype.Height=function(){
	return this.sheight;
}

gxtkSurface.prototype.Loaded=function(){
	return this.image.complete;
}

//***** Class gxtkInput *****

function gxtkInput( app ){
	this.app=app;
	this.keyStates=new Array( 512 );
	this.charQueue=new Array( 32 );
	this.charPut=0;
	this.charGet=0;
	this.mouseX=0;
	this.mouseY=0;
	this.joyX=0;
	this.joyY=0;
	this.joyZ=0;
	this.touchIds=new Array( 32 );
	this.touchXs=new Array( 32 );
	this.touchYs=new Array( 32 );
	this.accelX=0;
	this.accelY=0;
	this.accelZ=0;
	
	var i;
	
	for( i=0;i<512;++i ){
		this.keyStates[i]=0;
	}
	
	for( i=0;i<32;++i ){
		this.touchIds[i]=-1;
		this.touchXs[i]=0;
		this.touchYs[i]=0;
	}
}

gxtkInput.prototype.BeginUpdate=function(){
}

gxtkInput.prototype.EndUpdate=function(){
	for( var i=0;i<512;++i ){
		this.keyStates[i]&=0x100;
	}
	this.charGet=0;
	this.charPut=0;
}

gxtkInput.prototype.OnKeyDown=function( key ){
	if( (this.keyStates[key]&0x100)==0 ){
		this.keyStates[key]|=0x100;
		++this.keyStates[key];
		//
		if( key==KEY_LMB ){
			this.keyStates[KEY_TOUCH0]|=0x100;
			++this.keyStates[KEY_TOUCH0];
		}else if( key==KEY_TOUCH0 ){
			this.keyStates[KEY_LMB]|=0x100;
			++this.keyStates[KEY_LMB];
		}
		//
	}
}

gxtkInput.prototype.OnKeyUp=function( key ){
	this.keyStates[key]&=0xff;
	//
	if( key==KEY_LMB ){
		this.keyStates[KEY_TOUCH0]&=0xff;
	}else if( key==KEY_TOUCH0 ){
		this.keyStates[KEY_LMB]&=0xff;
	}
	//
}

gxtkInput.prototype.PutChar=function( chr ){
	if( this.charPut-this.charGet<32 ){
		this.charQueue[this.charPut & 31]=chr;
		this.charPut+=1;
	}
}

gxtkInput.prototype.OnMouseMove=function( x,y ){
	this.mouseX=x;
	this.mouseY=y;
	this.touchXs[0]=x;
	this.touchYs[0]=y;
}

gxtkInput.prototype.OnTouchStart=function( id,x,y ){
	for( var i=0;i<32;++i ){
		if( this.touchIds[i]==-1 ){
			this.touchIds[i]=id;
			this.touchXs[i]=x;
			this.touchYs[i]=y;
			this.OnKeyDown( KEY_TOUCH0+i );
			return;
		} 
	}
}

gxtkInput.prototype.OnTouchMove=function( id,x,y ){
	for( var i=0;i<32;++i ){
		if( this.touchIds[i]==id ){
			this.touchXs[i]=x;
			this.touchYs[i]=y;
			if( i==0 ){
				this.mouseX=x;
				this.mouseY=y;
			}
			return;
		}
	}
}

gxtkInput.prototype.OnTouchEnd=function( id ){
	for( var i=0;i<32;++i ){
		if( this.touchIds[i]==id ){
			this.touchIds[i]=-1;
			this.OnKeyUp( KEY_TOUCH0+i );
			return;
		}
	}
}

gxtkInput.prototype.OnDeviceMotion=function( x,y,z ){
	this.accelX=x;
	this.accelY=y;
	this.accelZ=z;
}

//***** GXTK API *****

gxtkInput.prototype.SetKeyboardEnabled=function( enabled ){
	return 0;
}

gxtkInput.prototype.KeyDown=function( key ){
	if( key>0 && key<512 ){
		return this.keyStates[key] >> 8;
	}
	return 0;
}

gxtkInput.prototype.KeyHit=function( key ){
	if( key>0 && key<512 ){
		return this.keyStates[key] & 0xff;
	}
	return 0;
}

gxtkInput.prototype.GetChar=function(){
	if( this.charPut!=this.charGet ){
		var chr=this.charQueue[this.charGet & 31];
		this.charGet+=1;
		return chr;
	}
	return 0;
}

gxtkInput.prototype.MouseX=function(){
	return this.mouseX;
}

gxtkInput.prototype.MouseY=function(){
	return this.mouseY;
}

gxtkInput.prototype.JoyX=function( index ){
	return this.joyX;
}

gxtkInput.prototype.JoyY=function( index ){
	return this.joyY;
}

gxtkInput.prototype.JoyZ=function( index ){
	return this.joyZ;
}

gxtkInput.prototype.TouchX=function( index ){
	return this.touchXs[index];
}

gxtkInput.prototype.TouchY=function( index ){
	return this.touchYs[index];
}

gxtkInput.prototype.AccelX=function(){
	return this.accelX;
}

gxtkInput.prototype.AccelY=function(){
	return this.accelY;
}

gxtkInput.prototype.AccelZ=function(){
	return this.accelZ;
}


//***** gxtkChannel class *****
function gxtkChannel(){
	this.sample=null;
	this.audio=null;
	this.volume=1;
	this.pan=0;
	this.rate=1;
	this.flags=0;
	this.state=0;
}

//***** gxtkAudio class *****
function gxtkAudio( app ){
	this.app=app;
	this.okay=typeof(Audio)!="undefined";
	this.nextchan=0;
	this.music=null;
	this.channels=new Array(33);
	for( var i=0;i<33;++i ){
		this.channels[i]=new gxtkChannel();
	}
}

gxtkAudio.prototype.OnSuspend=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ) chan.audio.pause();
	}
}

gxtkAudio.prototype.OnResume=function(){
	var i;
	for( i=0;i<33;++i ){
		var chan=this.channels[i];
		if( chan.state==1 ) chan.audio.play();
	}
}

gxtkAudio.prototype.LoadSample=function( path ){
	var audio=loadAudio( path );
	if( audio ) return new gxtkSample( audio );
	return null;
}

gxtkAudio.prototype.PlaySample=function( sample,channel,flags ){
	if( !this.okay ) return;

	var chan=this.channels[channel];

	if( chan.state!=0 ){
		chan.audio.pause();
		chan.state=0;
	}
	
	for( var i=0;i<33;++i ){
		var chan2=this.channels[i];
		if( chan2.state==1 && chan2.audio.ended && !chan2.audio.loop ) chan.state=0;
		if( chan2.state==0 && chan2.sample ){
			chan2.sample.FreeAudio( chan2.audio );
			chan2.sample=null;
			chan2.audio=null;
		}
	}

	var audio=sample.AllocAudio();
	if( !audio ) return;
	
	audio.loop=(flags&1)!=0;
	audio.volume=chan.volume;
	audio.play();

	chan.sample=sample;
	chan.audio=audio;
	chan.flags=flags;
	chan.state=1;
}

gxtkAudio.prototype.StopChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state!=0 ){
		chan.audio.pause();
		chan.state=0;
	}
}

gxtkAudio.prototype.PauseChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==1 ){
		if( chan.audio.ended && !chan.audio.loop ){
			chan.state=0;
		}else{
			chan.audio.pause();
			chan.state=2;
		}
	}
}

gxtkAudio.prototype.ResumeChannel=function( channel ){
	var chan=this.channels[channel];
	
	if( chan.state==2 ){
		chan.audio.play();
		chan.state=1;
	}
}

gxtkAudio.prototype.ChannelState=function( channel ){
	var chan=this.channels[channel];
	if( chan.state==1 && chan.audio.ended && !chan.audio.loop ) chan.state=0;
	return chan.state;
}

gxtkAudio.prototype.SetVolume=function( channel,volume ){
	var chan=this.channels[channel];
	if( chan.state!=0 ) chan.audio.volume=volume;
	chan.volume=volume;
}

gxtkAudio.prototype.SetPan=function( channel,pan ){
	var chan=this.channels[channel];
	chan.pan=pan;
}

gxtkAudio.prototype.SetRate=function( channel,rate ){
	var chan=this.channels[channel];
	chan.rate=rate;
}

gxtkAudio.prototype.PlayMusic=function( path,flags ){
	this.StopMusic();
	
	this.music=this.LoadSample( path );
	if( !this.music ) return;
	
	this.PlaySample( this.music,32,flags );
}

gxtkAudio.prototype.StopMusic=function(){
	this.StopChannel( 32 );

	if( this.music ){
		this.music.Discard();
		this.music=null;
	}
}

gxtkAudio.prototype.PauseMusic=function(){
	this.PauseChannel( 32 );
}

gxtkAudio.prototype.ResumeMusic=function(){
	this.ResumeChannel( 32 );
}

gxtkAudio.prototype.MusicState=function(){
	return this.ChannelState( 32 );
}

gxtkAudio.prototype.SetMusicVolume=function( volume ){
	this.SetVolume( 32,volume );
}

//***** gxtkSample class *****

function gxtkSample( audio ){
	this.audio=audio;
	this.free=new Array();
	this.insts=new Array();
}

gxtkSample.prototype.Discard=function(){
}

gxtkSample.prototype.FreeAudio=function( audio ){
	this.free.push( audio );
}

gxtkSample.prototype.AllocAudio=function(){
	var audio;
	while( this.free.length ){
		audio=this.free.pop();
		try{
			audio.currentTime=0;
			return audio;
		}catch( ex ){
			print( "AUDIO ERROR1!" );
		}
	}
	
	//Max out?
	if( this.insts.length==8 ) return null;
	
	audio=new Audio( this.audio.src );
	
	//yucky loop handler for firefox!
	//
	audio.addEventListener( 'ended',function(){
		if( this.loop ){
			try{
				this.currentTime=0;
				this.play();
			}catch( ex ){
				print( "AUDIO ERROR2!" );
			}
		}
	},false );

	this.insts.push( audio );
	return audio;
}

var flixel = new Object();

flixel.systemMillisecs = function() {
	return (new Date).getTime()
}

flixel.showMouse = function() {
	document.getElementById("GameCanvas").style.cursor = 'default';
}

flixel.hideMouse = function() {
	document.getElementById("GameCanvas").style.cursor = 'url(data/flx_empty_cursor.png), auto';
}

flixel.isMobile = function() {
	if (window.Touch != undefined)
		return true;
		
	var navigator = window.navigator.userAgent||window.navigator.vendor||window.opera;
	return (/android.+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|e\-|e\/|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(di|rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|xda(\-|2|g)|yas\-|your|zeto|zte\-/i.test(navigator.substr(0,4)));
}

flixel.openURL = function(url) {
	window.open(url);
}

flixel.isIE = function(){ 
	//from https://gist.github.com/527683
	
    var v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');
 
    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );
 
    return v > 4 ? v : false; 
}
function bb_app_App(){
	Object.call(this);
}
function bb_app_App_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<105>";
	bb_app_device=bb_app_AppDevice_new.call(new bb_app_AppDevice,this);
	pop_err();
	return this;
}
bb_app_App.prototype.m_OnCreate=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.m_OnUpdate=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.m_OnSuspend=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.m_OnResume=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.m_OnRender=function(){
	push_err();
	pop_err();
	return 0;
}
bb_app_App.prototype.m_OnLoading=function(){
	push_err();
	pop_err();
	return 0;
}
function bb_flxgame_FlxGame(){
	bb_app_App.call(this);
	this.f__soundTrayTimer=.0;
	this.f__soundTrayWidth=.0;
	this.f__soundTrayHeight=.0;
	this.f__soundTrayX=.0;
	this.f__soundTrayY=.0;
	this.f__soundTrayVisible=false;
	this.f__total=0;
	this.f__state=null;
	this.f_useSoundHotKeys=false;
	this.f_useSystemCursor=false;
	this.f_useVirtualResolution=false;
	this.f_forceDebugger=false;
	this.f__debuggerUp=false;
	this.f__replay=null;
	this.f__replayRequested=false;
	this.f__recordingRequested=false;
	this.f__replaying=false;
	this.f__recording=false;
	this.f__iState=null;
	this.f__requestedState=null;
	this.f__requestedReset=false;
	this.f__created=false;
	this.f__replayTimer=.0;
	this.f__replayCancelKeys=[];
	this.f__framerate=0;
	this.f__updaterate=0;
	this.f__step=.0;
	this.f__maxAccumulation=.0;
	this.f__debugger=null;
	this.f__replayCallback=null;
	this.f__accumulator=.0;
}
bb_flxgame_FlxGame.prototype=extend_class(bb_app_App);
function bb_flxgame_FlxGame_new(t_gameSizeX,t_gameSizeY,t_initialState,t_zoom,t_updaterate,t_framerate,t_useSystemCursor){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<97>";
	bb_app_App_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<98>";
	this.f__soundTrayTimer=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<99>";
	this.f__soundTrayWidth=160.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<100>";
	this.f__soundTrayHeight=45.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<101>";
	this.f__soundTrayX=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<102>";
	this.f__soundTrayY=-this.f__soundTrayHeight;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<103>";
	this.f__soundTrayVisible=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<105>";
	bb_flxg_FlxG_Init(this,t_gameSizeX,t_gameSizeY,t_zoom);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<106>";
	bb_flxg_FlxG_Framerate=t_framerate;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<107>";
	bb_flxg_FlxG_Updaterate=t_updaterate;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<108>";
	this.f__total=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<110>";
	this.f__state=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<112>";
	this.f_useSoundHotKeys=!flixel.isMobile();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<113>";
	dbg_object(this).f_useSystemCursor=t_useSystemCursor;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<114>";
	this.f_useVirtualResolution=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<116>";
	if(!t_useSystemCursor){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<116>";
		flixel.hideMouse();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<118>";
	this.f_forceDebugger=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<119>";
	this.f__debuggerUp=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<121>";
	this.f__replay=bb_flxreplay_FlxReplay_new.call(new bb_flxreplay_FlxReplay);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<122>";
	this.f__replayRequested=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<123>";
	this.f__recordingRequested=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<124>";
	this.f__replaying=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<125>";
	this.f__recording=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<127>";
	this.f__iState=t_initialState;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<128>";
	this.f__requestedState=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<129>";
	this.f__requestedReset=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<130>";
	this.f__created=false;
	pop_err();
	return this;
}
function bb_flxgame_FlxGame_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<29>";
	bb_app_App_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<29>";
	pop_err();
	return this;
}
bb_flxgame_FlxGame.prototype.m_OnContentInit=function(){
	push_err();
	pop_err();
}
bb_flxgame_FlxGame.prototype.m__InitData=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<525>";
	bb_flxassetsmanager_FlxAssetsManager_Init();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<527>";
	var t_minSystemFontSize=8;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<528>";
	var t_maxSystemFontSize=24;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<529>";
	var t_fontPathPrefix="system_font_";
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<531>";
	var t_system=bb_flxassetsmanager_FlxAssetsManager_AddFont("system",0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<533>";
	for(var t_size=t_minSystemFontSize;t_size<=t_maxSystemFontSize;t_size=t_size+1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<534>";
		t_system.m_SetPath(t_size,t_fontPathPrefix+String(bb_math_Min(t_size,17))+"_flx"+".png");
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<537>";
	bb_flxassetsmanager_FlxAssetsManager_AddImage("default_flx","default_flx.png");
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<538>";
	bb_flxassetsmanager_FlxAssetsManager_AddImage("button_flx","button_flx.png");
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<539>";
	bb_flxassetsmanager_FlxAssetsManager_AddImage("autotiles_flx","autotiles_flx.png");
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<540>";
	bb_flxassetsmanager_FlxAssetsManager_AddImage("autotiles_alt_flx","autotiles_alt_flx.png");
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<541>";
	bb_flxassetsmanager_FlxAssetsManager_AddCursor("cursor_flx","cursor_flx.png");
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<543>";
	bb_flxassetsmanager_FlxAssetsManager_AddSound("beep_flx","beep_flx."+bb_flxsound_FlxSound_GetValidExt());
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<545>";
	this.m_OnContentInit();
	pop_err();
}
bb_flxgame_FlxGame.prototype.m__ResetFramerate=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<511>";
	bb_app_SetUpdateRate(bb_flxg_FlxG_Framerate);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<513>";
	this.f__step=1000.0/(bb_flxg_FlxG_Updaterate);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<514>";
	this.f__maxAccumulation=2000.0/(bb_flxg_FlxG_Framerate)-1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<516>";
	if(this.f__maxAccumulation<this.f__step){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<517>";
		this.f__maxAccumulation=this.f__step;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<520>";
	this.f__updaterate=bb_flxg_FlxG_Updaterate;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<521>";
	this.f__framerate=bb_flxg_FlxG_Framerate;
	pop_err();
}
bb_flxgame_FlxGame.prototype.m__Reset=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<492>";
	if(bb_flxg_FlxG_Framerate!=this.f__framerate || bb_flxg_FlxG_Updaterate!=this.f__updaterate){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<493>";
		this.m__ResetFramerate();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<496>";
	bb_random_Seed=flixel.systemMillisecs();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<498>";
	bb_flxg_FlxG_DeviceWidth=bb_graphics_DeviceWidth();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<499>";
	bb_flxg_FlxG_DeviceHeight=bb_graphics_DeviceHeight();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<501>";
	if(this.f_useVirtualResolution){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<502>";
		bb_flxg_FlxG__DeviceScaleFactorX=(bb_flxg_FlxG_DeviceWidth)/(bb_flxg_FlxG_Width);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<503>";
		bb_flxg_FlxG__DeviceScaleFactorY=(bb_flxg_FlxG_DeviceHeight)/(bb_flxg_FlxG_Height);
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<505>";
		bb_flxg_FlxG__DeviceScaleFactorX=1.0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<506>";
		bb_flxg_FlxG__DeviceScaleFactorY=1.0;
	}
	pop_err();
}
bb_flxgame_FlxGame.prototype.m__SwitchState=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<243>";
	bb_flxg_FlxG_ResetCameras(null);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<244>";
	bb_flxg_FlxG_ResetInput();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<245>";
	bb_flxg_FlxG_DestroySounds(false);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<247>";
	if(this.f__debugger!=null){
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<251>";
	var t_timeManager=bb_flxtimer_FlxTimer_Manager();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<252>";
	if(t_timeManager!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<252>";
		t_timeManager.m_Clear();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<254>";
	if(this.f__state!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<254>";
		this.f__state.m_Destroy();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<256>";
	this.f__state=this.f__requestedState;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<257>";
	this.f__state.m_Create();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<259>";
	if(bb_flxg_FlxG_Framerate!=this.f__framerate || bb_flxg_FlxG_Updaterate!=this.f__updaterate){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<260>";
		this.m__ResetFramerate();
	}
	pop_err();
}
bb_flxgame_FlxGame.prototype.m__Update=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<368>";
	bb_flxg_FlxG_Elapsed=bb_flxg_FlxG_TimeScale*(this.f__step/1000.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<370>";
	bb_flxg_FlxG_UpdateSounds();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<371>";
	bb_flxg_FlxG_UpdatePlugins();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<372>";
	this.f__state.m_Update();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<373>";
	bb_flxg_FlxG_UpdateCameras();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<375>";
	if(this.f__debuggerUp){
	}
	pop_err();
}
bb_flxgame_FlxGame.prototype.m__Step=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<265>";
	if(this.f__requestedReset){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<266>";
		this.f__requestedReset=false;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<267>";
		this.f__requestedState=object_downcast((this.f__iState.m_CreateInstance()),bb_flxstate_FlxState);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<268>";
		this.f__replayTimer=0.0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<269>";
		this.f__replayCancelKeys=[];
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<270>";
		this.m__Reset();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<271>";
		bb_flxg_FlxG_Reset();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<274>";
	if(this.f__recordingRequested){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<275>";
		this.f__recordingRequested=false;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<276>";
		this.f__replay.m_Create2(bb_flxg_FlxG_GlobalSeed);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<277>";
		this.f__recording=true;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<279>";
		if(this.f__debugger!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<281>";
			bb_flxg_FlxG_Log("FLIXEL: starting new flixel gameplay record.");
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<284>";
		if(this.f__replayRequested){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<285>";
			this.f__replayRequested=false;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<286>";
			this.f__replay.m_Rewind();
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<287>";
			bb_flxg_FlxG_GlobalSeed=((dbg_object(this.f__replay).f_seed)|0);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<289>";
			if(this.f__debugger!=null){
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<293>";
			this.f__replaying=true;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<296>";
	if(this.f__state!=this.f__requestedState){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<296>";
		this.m__SwitchState();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<298>";
	bb_flxbasic_FlxBasic__ActiveCount=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<300>";
	if(this.f__replaying){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<301>";
		if(this.f__replayCancelKeys.length>0 && !((bb_input2_KeyDown(192))!=0) && !((bb_input2_KeyDown(220))!=0)){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<302>";
			var t_i=0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<303>";
			var t_l=this.f__replayCancelKeys.length;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<305>";
			while(t_i<t_l){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<306>";
				if((bb_input2_KeyDown(dbg_array(this.f__replayCancelKeys,t_i)[dbg_index]))!=0){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<307>";
					if(this.f__replayCallback!=null){
						err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<308>";
						this.f__replayCallback.m_OnReplayComplete();
						err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<309>";
						this.f__replayCallback=null;
					}else{
						err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<311>";
						bb_flxg_FlxG_StopReplay();
					}
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<314>";
					break;
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<317>";
				t_i+=1;
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<321>";
		this.f__replay.m_PlayNextFrame();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<323>";
		if(this.f__replayTimer>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<324>";
			this.f__replayTimer-=this.f__step;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<326>";
			if(this.f__replayTimer<=0.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<327>";
				if(this.f__replayCallback!=null){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<328>";
					this.f__replayCallback.m_OnReplayComplete();
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<329>";
					this.f__replayCallback=null;
				}else{
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<331>";
					bb_flxg_FlxG_StopReplay();
				}
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<336>";
		if(this.f__replaying && dbg_object(this.f__replay).f_finished){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<337>";
			bb_flxg_FlxG_StopReplay();
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<339>";
			if(this.f__replayCallback!=null){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<340>";
				this.f__replayCallback.m_OnReplayComplete();
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<341>";
				this.f__replayCallback=null;
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<345>";
		if(this.f__debugger!=null){
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<349>";
		bb_flxg_FlxG_UpdateInput();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<352>";
	if(this.f__recording){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<353>";
		this.f__replay.m_RecordFrame();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<355>";
		if(this.f__debugger!=null){
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<360>";
	this.m__Update();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<362>";
	if(this.f__debugger!=null){
	}
	pop_err();
}
bb_flxgame_FlxGame.prototype.m_OnCreate=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<134>";
	this.m__InitData();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<135>";
	this.m__Step();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<137>";
	this.f__soundTrayX=((bb_flxg_FlxG_Width/2)|0)*bb_flxcamera_FlxCamera_DefaultZoom*bb_flxg_FlxG__DeviceScaleFactorX-this.f__soundTrayWidth/2.0+bb_flxg_FlxG_Camera.m_X();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<142>";
	pop_err();
	return 0;
}
bb_flxgame_FlxGame.prototype.m__ShowSoundTray=function(t_silent){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<233>";
	if(!t_silent){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<234>";
		bb_flxg_FlxG_Play("beep_flx",1.0,false,true);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<237>";
	this.f__soundTrayTimer=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<238>";
	this.f__soundTrayY=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<239>";
	this.f__soundTrayVisible=true;
	pop_err();
}
bb_flxgame_FlxGame.prototype.m__UpdateSoundTray=function(t_ms){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<381>";
	if(!this.f__soundTrayVisible){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<383>";
	if(this.f__soundTrayTimer>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<384>";
		this.f__soundTrayTimer-=(t_ms)/1000.0;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<386>";
		if(this.f__soundTrayY>-this.f__soundTrayHeight){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<387>";
			this.f__soundTrayY=this.f__soundTrayY-(t_ms)/1000.0*(bb_flxg_FlxG_Height)*2.0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<389>";
			if(this.f__soundTrayY<=-this.f__soundTrayHeight){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<390>";
				this.f__soundTrayVisible=false;
			}
		}
	}
	pop_err();
}
bb_flxgame_FlxGame.prototype.m_OnUpdate=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<147>";
	if(this.f_useSoundHotKeys){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<148>";
		if((bb_input2_KeyHit(48))!=0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<149>";
			bb_flxg_FlxG_Mute=!bb_flxg_FlxG_Mute;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<151>";
			if(bb_flxg_FlxG_VolumeHandler!=null){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<152>";
				if(bb_flxg_FlxG_Mute){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<153>";
					bb_flxg_FlxG_VolumeHandler.m_OnVolumeChange(0.0);
				}else{
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<155>";
					bb_flxg_FlxG_VolumeHandler.m_OnVolumeChange(bb_flxg_FlxG_Volume());
				}
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<159>";
			this.m__ShowSoundTray(false);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<162>";
		if((bb_input2_KeyHit(189))!=0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<163>";
			bb_flxg_FlxG_Mute=false;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<164>";
			bb_flxg_FlxG_Volume2(bb_flxg_FlxG_Volume()-.1);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<165>";
			this.m__ShowSoundTray(false);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<168>";
		if((bb_input2_KeyHit(187))!=0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<169>";
			bb_flxg_FlxG_Mute=false;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<170>";
			bb_flxg_FlxG_Volume2(bb_flxg_FlxG_Volume()+.1);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<171>";
			this.m__ShowSoundTray(false);
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<175>";
	this.m__UpdateSoundTray((this.f__step)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<178>";
	pop_err();
	return 0;
}
bb_flxgame_FlxGame.prototype.m__DrawSoundTray=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<437>";
	if(this.f__soundTrayVisible){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<438>";
		var t_globalVolume=((bb_flxu_FlxU_Round(bb_flxg_FlxG_Volume()*10.0))|0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<439>";
		if(bb_flxg_FlxG_Mute){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<439>";
			t_globalVolume=0;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<441>";
		bb_graphics_PushMatrix();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<443>";
		bb_graphics_Scale(1.0/bb_flxg_FlxG__DeviceScaleFactorX,1.0/bb_flxg_FlxG__DeviceScaleFactorY);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<444>";
		bb_graphics_Translate(this.f__soundTrayX,this.f__soundTrayY);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<446>";
		if(bb_flxg_FlxG__LastDrawingAlpha!=.5){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<447>";
			bb_graphics_SetAlpha(.5);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<448>";
			bb_flxg_FlxG__LastDrawingAlpha=.5;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<451>";
		if(bb_flxg_FlxG__LastDrawingColor!=-16777216){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<452>";
			bb_graphics_SetColor(0.0,0.0,0.0);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<455>";
		bb_graphics_DrawRect(0.0,0.0,this.f__soundTrayWidth,this.f__soundTrayHeight);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<457>";
		bb_graphics_SetColor(255.0,255.0,255.0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<458>";
		bb_flxg_FlxG__LastDrawingColor=-1;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<460>";
		var t_bx=20;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<461>";
		var t_by=28;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<463>";
		var t_i=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<464>";
		while(t_i<10){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<465>";
			if(t_i<t_globalVolume){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<466>";
				if(bb_flxg_FlxG__LastDrawingAlpha!=1.0){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<467>";
					bb_graphics_SetAlpha(1.0);
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<468>";
					bb_flxg_FlxG__LastDrawingAlpha=1.0;
				}
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<472>";
				if(bb_flxg_FlxG__LastDrawingAlpha!=.5){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<473>";
					bb_graphics_SetAlpha(.5);
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<474>";
					bb_flxg_FlxG__LastDrawingAlpha=.5;
				}
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<478>";
			bb_graphics_DrawRect((t_bx),(t_by),8.0,(t_i*2));
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<480>";
			t_bx+=12;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<481>";
			t_by-=2;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<482>";
			t_i+=1;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<487>";
		bb_graphics_PopMatrix();
	}
	pop_err();
}
bb_flxgame_FlxGame.prototype.m__Draw=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<398>";
	bb_graphics_Cls(dbg_object(bb_flxg_FlxG__BgColor).f_r,dbg_object(bb_flxg_FlxG__BgColor).f_g,dbg_object(bb_flxg_FlxG__BgColor).f_b);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<399>";
	bb_graphics_Scale(bb_flxg_FlxG__DeviceScaleFactorX,bb_flxg_FlxG__DeviceScaleFactorY);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<401>";
	bb_flxg_FlxG__LastDrawingColor=-1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<402>";
	bb_flxg_FlxG__LastDrawingBlend=bb_graphics_GetBlend();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<403>";
	bb_flxg_FlxG__LastDrawingAlpha=bb_graphics_GetAlpha();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<404>";
	bb_flxg_FlxG__CurrentCamera=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<406>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<407>";
	var t_l=bb_flxg_FlxG_Cameras.m_Length();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<409>";
	while(t_i<t_l){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<410>";
		bb_flxg_FlxG__CurrentCamera=bb_flxg_FlxG_Cameras.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<412>";
		if(!dbg_object(bb_flxg_FlxG__CurrentCamera).f_active){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<413>";
			t_i+=1;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<414>";
			continue;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<417>";
		if(bb_flxg_FlxG__CurrentCamera==null || !dbg_object(bb_flxg_FlxG__CurrentCamera).f_exists || !dbg_object(bb_flxg_FlxG__CurrentCamera).f_visible){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<417>";
			continue;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<419>";
		bb_flxg_FlxG__CurrentCamera.m_DrawFX();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<420>";
		bb_flxg_FlxG__CurrentCamera.m_Lock();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<421>";
		this.f__state.m_Draw();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<422>";
		bb_flxg_FlxG_DrawPlugins();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<423>";
		bb_flxg_FlxG__CurrentCamera.m_Unlock();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<425>";
		t_i+=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<429>";
	if(!bb_flxg_FlxG_Mobile){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<430>";
		this.m__DrawSoundTray();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<431>";
		bb_flxg_FlxG_Mouse.m_Draw();
	}
	pop_err();
}
bb_flxgame_FlxGame.prototype.m_OnRender=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<182>";
	if(bb_flxg_FlxG_Framerate!=this.f__framerate || bb_flxg_FlxG_Updaterate!=this.f__updaterate){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<183>";
		this.m__ResetFramerate();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<186>";
	var t_mark=bb_app_Millisecs();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<187>";
	var t_elapsedMS=t_mark-this.f__total;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<188>";
	this.f__total=t_mark;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<190>";
	if(this.f__debugger!=null){
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<193>";
		this.f__accumulator=this.f__accumulator+(t_elapsedMS);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<195>";
		if(this.f__accumulator>this.f__maxAccumulation){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<196>";
			this.f__accumulator=this.f__maxAccumulation;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<199>";
		while(this.f__accumulator>=this.f__step){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<200>";
			this.m__Step();
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<201>";
			this.f__accumulator-=this.f__step;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<205>";
	bb_flxbasic_FlxBasic__VisibleCount=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<207>";
	this.m__Draw();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<209>";
	pop_err();
	return 0;
}
bb_flxgame_FlxGame.prototype.m_OnSuspend=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<213>";
	flixel.showMouse();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<214>";
	bb_flxg_FlxG_PauseSounds();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<215>";
	pop_err();
	return 0;
}
bb_flxgame_FlxGame.prototype.m_OnResume=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<219>";
	if(!this.f__debuggerUp && !this.f_useSystemCursor){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<220>";
		flixel.hideMouse();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<223>";
	bb_flxg_FlxG_ResetInput();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<224>";
	bb_flxg_FlxG_ResumeSounds();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgame.monkey<225>";
	pop_err();
	return 0;
}
function bb_colortest2_Objects(){
	bb_flxgame_FlxGame.call(this);
}
bb_colortest2_Objects.prototype=extend_class(bb_flxgame_FlxGame);
function bb_colortest2_Objects_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<15>";
	bb_flxgame_FlxGame_new.call(this,640,480,bb_colortest2_ColorTest2_ClassObject,1.0,60,60,false);
	pop_err();
	return this;
}
function bb_flxbasic_FlxBasic(){
	Object.call(this);
	this.f_ID=0;
	this.f_exists=false;
	this.f_active=false;
	this.f_visible=false;
	this.f_alive=false;
	this.f_ignoreDrawDebug=false;
	this.f__cameras=null;
}
function bb_flxbasic_FlxBasic_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxbasic.monkey<72>";
	this.f_ID=-1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxbasic.monkey<73>";
	this.f_exists=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxbasic.monkey<74>";
	this.f_active=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxbasic.monkey<75>";
	this.f_visible=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxbasic.monkey<76>";
	this.f_alive=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxbasic.monkey<77>";
	this.f_ignoreDrawDebug=false;
	pop_err();
	return this;
}
bb_flxbasic_FlxBasic.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxbasic.monkey<170>";
	pop_err();
	return "FlxBasic";
}
bb_flxbasic_FlxBasic.prototype.m_Destroy=function(){
	push_err();
	pop_err();
}
bb_flxbasic_FlxBasic.prototype.m_Kill=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxbasic.monkey<136>";
	this.f_alive=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxbasic.monkey<137>";
	this.f_exists=false;
	pop_err();
}
var bb_flxbasic_FlxBasic__ActiveCount;
bb_flxbasic_FlxBasic.prototype.m_Update=function(){
	push_err();
	pop_err();
}
bb_flxbasic_FlxBasic.prototype.m_PreUpdate=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxbasic.monkey<93>";
	bb_flxbasic_FlxBasic__ActiveCount+=1;
	pop_err();
}
bb_flxbasic_FlxBasic.prototype.m_PostUpdate=function(){
	push_err();
	pop_err();
}
var bb_flxbasic_FlxBasic__VisibleCount;
bb_flxbasic_FlxBasic.prototype.m_Draw=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxbasic.monkey<115>";
	bb_flxbasic_FlxBasic__VisibleCount+=1;
	pop_err();
}
bb_flxbasic_FlxBasic.prototype.m_DrawDebug=function(t_camera){
	push_err();
	pop_err();
}
function bb_flxgroup_FlxGroup(){
	bb_flxbasic_FlxBasic.call(this);
	this.f__maxSize=0;
	this.f__marker=0;
	this.f__length=0;
	this.f__members=[];
	this.f__sortComparator=null;
}
bb_flxgroup_FlxGroup.prototype=extend_class(bb_flxbasic_FlxBasic);
function bb_flxgroup_FlxGroup_new(t_maxSize){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<53>";
	bb_flxbasic_FlxBasic_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<54>";
	this.f__maxSize=t_maxSize;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<55>";
	this.f__marker=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<56>";
	this.f__length=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<57>";
	this.f__cameras=null;
	pop_err();
	return this;
}
bb_flxgroup_FlxGroup.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<481>";
	pop_err();
	return "FlxGroup";
}
bb_flxgroup_FlxGroup.prototype.m_ObjectEnumerator=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<477>";
	var t_=bb_flxgroup_Enumerator_new.call(new bb_flxgroup_Enumerator,this);
	pop_err();
	return t_;
}
bb_flxgroup_FlxGroup.prototype.m_Length=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<65>";
	pop_err();
	return this.f__length;
}
bb_flxgroup_FlxGroup.prototype.m_Members=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<73>";
	pop_err();
	return this.f__members;
}
bb_flxgroup_FlxGroup.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<80>";
	var t_basic=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<81>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<83>";
	while(t_i<this.f__length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<84>";
		t_basic=dbg_array(this.f__members,t_i)[dbg_index];
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<85>";
		if(t_basic!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<85>";
			t_basic.m_Destroy();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<86>";
		t_i+=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<89>";
	this.f__length=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<90>";
	this.f__members=resize_object_array(this.f__members,this.f__length);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<91>";
	this.f__sortComparator=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<92>";
	this.f__cameras=null;
	pop_err();
}
bb_flxgroup_FlxGroup.prototype.m_Update=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<106>";
	var t_basic=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<107>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<109>";
	while(t_i<this.f__length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<110>";
		t_basic=dbg_array(this.f__members,t_i)[dbg_index];
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<111>";
		if(t_basic!=null && dbg_object(t_basic).f_exists && dbg_object(t_basic).f_active){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<112>";
			t_basic.m_PreUpdate();
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<113>";
			t_basic.m_Update();
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<114>";
			t_basic.m_PostUpdate();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<116>";
		t_i+=1;
	}
	pop_err();
}
bb_flxgroup_FlxGroup.prototype.m__IndexOf=function(t_object){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<487>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<489>";
	while(t_i<this.f__length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<490>";
		if(dbg_array(this.f__members,t_i)[dbg_index]==t_object){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<490>";
			pop_err();
			return t_i;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<491>";
		t_i+=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<494>";
	pop_err();
	return -1;
}
bb_flxgroup_FlxGroup.prototype.m_Add=function(t_object){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<176>";
	if(this.m__IndexOf(t_object)>=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<176>";
		pop_err();
		return t_object;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<178>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<180>";
	while(t_i<this.f__length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<181>";
		if(dbg_array(this.f__members,t_i)[dbg_index]==null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<182>";
			dbg_array(this.f__members,t_i)[dbg_index]=t_object
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<183>";
			if(t_i>=this.f__length){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<183>";
				this.f__length=t_i+1;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<184>";
			pop_err();
			return t_object;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<186>";
		t_i+=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<189>";
	if(this.f__maxSize>0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<190>";
		if(this.f__length==this.f__members.length){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<191>";
			if(this.f__length>=this.f__maxSize){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<192>";
				pop_err();
				return t_object;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<193>";
				if(this.f__length*2+10<=this.f__maxSize){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<194>";
					this.f__members=resize_object_array(this.f__members,this.f__length*2+10);
				}else{
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<196>";
					this.f__members=resize_object_array(this.f__members,this.f__maxSize);
				}
			}
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<200>";
		if(this.f__length==this.f__members.length){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<201>";
			this.f__members=resize_object_array(this.f__members,this.f__length*2+10);
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<205>";
	dbg_array(this.f__members,t_i)[dbg_index]=t_object
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<206>";
	this.f__length+=1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<208>";
	pop_err();
	return t_object;
}
bb_flxgroup_FlxGroup.prototype.m_GetFirstAvailable=function(t_objectClass){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<344>";
	var t_basic=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<345>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<347>";
	while(t_i<this.f__length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<348>";
		t_basic=dbg_array(this.f__members,t_i)[dbg_index];
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<350>";
		if(t_basic!=null && !dbg_object(t_basic).f_exists && (t_objectClass==null || t_objectClass.m_InstanceOf(t_basic))){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<350>";
			pop_err();
			return t_basic;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<351>";
		t_i+=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<354>";
	pop_err();
	return null;
}
bb_flxgroup_FlxGroup.prototype.m_Recycle=function(t_objectClass){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<226>";
	if(this.f__maxSize>0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<227>";
		if(this.f__length<this.f__maxSize){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<228>";
			if(t_objectClass==null){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<228>";
				pop_err();
				return null;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<229>";
			var t_=this.m_Add(object_downcast((t_objectClass.m_CreateInstance()),bb_flxbasic_FlxBasic));
			pop_err();
			return t_;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<231>";
			var t_basic=dbg_array(this.f__members,this.f__marker)[dbg_index];
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<232>";
			this.f__marker+=1;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<233>";
			if(this.f__marker>=this.f__maxSize){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<233>";
				this.f__marker=0;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<234>";
			pop_err();
			return t_basic;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<237>";
		var t_basic2=this.m_GetFirstAvailable(t_objectClass);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<238>";
		if(t_basic2!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<238>";
			pop_err();
			return t_basic2;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<239>";
		if(t_objectClass==null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<239>";
			pop_err();
			return null;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<240>";
		var t_2=this.m_Add(object_downcast((t_objectClass.m_CreateInstance()),bb_flxbasic_FlxBasic));
		pop_err();
		return t_2;
	}
}
bb_flxgroup_FlxGroup.prototype.m_Draw=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<124>";
	if(this.f__cameras!=null && !this.f__cameras.m_Contains(bb_flxg_FlxG__CurrentCamera.m_ID())){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<126>";
	var t_basic=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<127>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<129>";
	while(t_i<this.f__length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<130>";
		t_basic=dbg_array(this.f__members,t_i)[dbg_index];
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<131>";
		if(t_basic!=null && dbg_object(t_basic).f_exists && dbg_object(t_basic).f_visible){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<131>";
			t_basic.m_Draw();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<132>";
		t_i+=1;
	}
	pop_err();
}
bb_flxgroup_FlxGroup.prototype.m_PreUpdate=function(){
	push_err();
	pop_err();
}
bb_flxgroup_FlxGroup.prototype.m_Kill=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<464>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<465>";
	var t_basic=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<467>";
	while(t_i<this.f__length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<468>";
		t_basic=dbg_array(this.f__members,t_i)[dbg_index];
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<469>";
		if(t_basic!=null && dbg_object(t_basic).f_exists){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<469>";
			t_basic.m_Kill();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<470>";
		t_i+=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<473>";
	bb_flxbasic_FlxBasic.prototype.m_Kill.call(this);
	pop_err();
}
function bb_flxstate_FlxState(){
	bb_flxgroup_FlxGroup.call(this);
}
bb_flxstate_FlxState.prototype=extend_class(bb_flxgroup_FlxGroup);
bb_flxstate_FlxState.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxstate.monkey<19>";
	pop_err();
	return "FlxState";
}
bb_flxstate_FlxState.prototype.m_Create=function(){
	push_err();
	pop_err();
}
function bb_flxstate_FlxState_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxstate.monkey<5>";
	bb_flxgroup_FlxGroup_new.call(this,0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxstate.monkey<5>";
	pop_err();
	return this;
}
function bb_colortest2_ColorTest2(){
	bb_flxstate_FlxState.call(this);
	this.f_hsv=[];
	this.f_hsvIndex=0;
	this.f_canvas=null;
	this.f_lastRect=null;
}
bb_colortest2_ColorTest2.prototype=extend_class(bb_flxstate_FlxState);
var bb_colortest2_ColorTest2_ClassObject;
bb_colortest2_ColorTest2.prototype.m_Create=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<58>";
	this.f_hsv=bb_fptflxcolor_FptFlxColor_GetHSVColorWheel(255);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<59>";
	this.f_hsvIndex=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<60>";
	this.f_canvas=(bb_flxsprite_FlxSprite_new.call(new bb_flxsprite_FlxSprite,32.0,32.0,"")).m_MakeGraphic(580,380,-16777216);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<61>";
	this.m_Add(this.f_canvas);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<63>";
	this.f_lastRect=bb_flxrect_FlxRect_new.call(new bb_flxrect_FlxRect,16.0,16.0,32.0,32.0);
	pop_err();
}
bb_colortest2_ColorTest2.prototype.m_Update=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<71>";
	bb_flxgroup_FlxGroup.prototype.m_Update.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<73>";
	if(this.f_hsvIndex<359){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<75>";
		var t_rect=(bb_flxsprite_FlxSprite_new.call(new bb_flxsprite_FlxSprite,dbg_object(this.f_lastRect).f_x,dbg_object(this.f_lastRect).f_y,"")).m_MakeGraphic(((dbg_object(this.f_lastRect).f_width)|0),((dbg_object(this.f_lastRect).f_height)|0),dbg_array(this.f_hsv,this.f_hsvIndex)[dbg_index]);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<76>";
		this.m_Add(t_rect);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<78>";
		dbg_object(this.f_lastRect).f_x=dbg_object(this.f_lastRect).f_x+16.0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<80>";
		if(dbg_object(this.f_lastRect).f_x>=580.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<81>";
			dbg_object(this.f_lastRect).f_x=16.0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<82>";
			dbg_object(this.f_lastRect).f_y=dbg_object(this.f_lastRect).f_y+24.0;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<85>";
		this.f_hsvIndex+=1;
	}
	pop_err();
}
function bb_colortest2_ColorTest2_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<33>";
	bb_flxstate_FlxState_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<33>";
	pop_err();
	return this;
}
function bb_colortest2_ColorTest2Class(){
	Object.call(this);
	this.implments={bb_flxextern_FlxClass:1};
}
function bb_colortest2_ColorTest2Class_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<21>";
	pop_err();
	return this;
}
bb_colortest2_ColorTest2Class.prototype.m_CreateInstance=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<24>";
	var t_=(bb_colortest2_ColorTest2_new.call(new bb_colortest2_ColorTest2));
	pop_err();
	return t_;
}
bb_colortest2_ColorTest2Class.prototype.m_InstanceOf=function(t_object){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<28>";
	var t_=object_downcast((t_object),bb_colortest2_ColorTest2)!=null;
	pop_err();
	return t_;
}
function bb_app_AppDevice(){
	gxtkApp.call(this);
	this.f_app=null;
	this.f_updateRate=0;
}
bb_app_AppDevice.prototype=extend_class(gxtkApp);
function bb_app_AppDevice_new(t_app){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<45>";
	dbg_object(this).f_app=t_app;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<46>";
	bb_graphics_SetGraphicsContext(bb_graphics_GraphicsContext_new.call(new bb_graphics_GraphicsContext,this.GraphicsDevice()));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<47>";
	bb_input2_SetInputDevice(this.InputDevice());
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<48>";
	bb_audio_SetAudioDevice(this.AudioDevice());
	pop_err();
	return this;
}
function bb_app_AppDevice_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<42>";
	pop_err();
	return this;
}
bb_app_AppDevice.prototype.OnCreate=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<52>";
	bb_graphics_SetFont(null,32);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<53>";
	var t_=this.f_app.m_OnCreate();
	pop_err();
	return t_;
}
bb_app_AppDevice.prototype.OnUpdate=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<57>";
	var t_=this.f_app.m_OnUpdate();
	pop_err();
	return t_;
}
bb_app_AppDevice.prototype.OnSuspend=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<61>";
	var t_=this.f_app.m_OnSuspend();
	pop_err();
	return t_;
}
bb_app_AppDevice.prototype.OnResume=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<65>";
	var t_=this.f_app.m_OnResume();
	pop_err();
	return t_;
}
bb_app_AppDevice.prototype.OnRender=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<69>";
	bb_graphics_BeginRender();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<70>";
	var t_r=this.f_app.m_OnRender();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<71>";
	bb_graphics_EndRender();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<72>";
	pop_err();
	return t_r;
}
bb_app_AppDevice.prototype.OnLoading=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<76>";
	bb_graphics_BeginRender();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<77>";
	var t_r=this.f_app.m_OnLoading();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<78>";
	bb_graphics_EndRender();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<79>";
	pop_err();
	return t_r;
}
bb_app_AppDevice.prototype.SetUpdateRate=function(t_hertz){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<83>";
	gxtkApp.prototype.SetUpdateRate.call(this,t_hertz);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<84>";
	this.f_updateRate=t_hertz;
	pop_err();
	return 0;
}
function bb_graphics_GraphicsContext(){
	Object.call(this);
	this.f_device=null;
	this.f_defaultFont=null;
	this.f_font=null;
	this.f_firstChar=0;
	this.f_matrixSp=0;
	this.f_ix=1.0;
	this.f_iy=.0;
	this.f_jx=.0;
	this.f_jy=1.0;
	this.f_tx=.0;
	this.f_ty=.0;
	this.f_tformed=0;
	this.f_matDirty=0;
	this.f_color_r=.0;
	this.f_color_g=.0;
	this.f_color_b=.0;
	this.f_alpha=.0;
	this.f_blend=0;
	this.f_scissor_x=.0;
	this.f_scissor_y=.0;
	this.f_scissor_width=.0;
	this.f_scissor_height=.0;
	this.f_matrixStack=new_number_array(192);
}
function bb_graphics_GraphicsContext_new(t_device){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<210>";
	dbg_object(this).f_device=t_device;
	pop_err();
	return this;
}
function bb_graphics_GraphicsContext_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<207>";
	pop_err();
	return this;
}
var bb_graphics_context;
function bb_graphics_SetGraphicsContext(t_gc){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<250>";
	bb_graphics_context=t_gc;
	pop_err();
	return 0;
}
var bb_input2_device;
function bb_input2_SetInputDevice(t_dev){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<40>";
	bb_input2_device=t_dev;
	pop_err();
	return 0;
}
var bb_audio_device;
function bb_audio_SetAudioDevice(t_dev){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<60>";
	bb_audio_device=t_dev;
	pop_err();
	return 0;
}
var bb_app_device;
function bb_flxg_FlxG(){
	Object.call(this);
}
var bb_flxg_FlxG__Game;
var bb_flxg_FlxG_Width;
var bb_flxg_FlxG_Height;
var bb_flxg_FlxG_Mute;
var bb_flxg_FlxG__Volume;
var bb_flxg_FlxG_Sounds;
var bb_flxg_FlxG_VolumeHandler;
var bb_flxg_FlxG__BitmapCache;
function bb_flxg_FlxG_ClearBitmapCache(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<424>";
	if(bb_flxg_FlxG__BitmapCache==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<424>";
		bb_flxg_FlxG__BitmapCache=bb_flxresourcesmanager_FlxResourcesManager_new.call(new bb_flxresourcesmanager_FlxResourcesManager);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<426>";
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<426>";
	var t_=bb_flxg_FlxG__BitmapCache.m_Resources().m_Values().m_ObjectEnumerator();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<426>";
	while(t_.m_HasNext()){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<426>";
		var t_image=t_.m_NextObject();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<427>";
		if(t_image!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<427>";
			t_image.m_Discard();
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<430>";
	bb_flxg_FlxG__BitmapCache.m_Clear();
	pop_err();
}
var bb_flxg_FlxG_Cameras;
var bb_flxg_FlxG_Plugins;
function bb_flxg_FlxG_AddPlugin(t_plugin){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<551>";
	var t_pluginList=bb_flxg_FlxG_Plugins;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<552>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<553>";
	var t_l=t_pluginList.m_Length();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<555>";
	while(t_i<t_l){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<556>";
		if(t_pluginList.m_Get2(t_i).m_ToString()==t_plugin.m_ToString()){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<557>";
			pop_err();
			return t_plugin;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<560>";
		t_i+=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<563>";
	t_pluginList.m_Push2(t_plugin);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<564>";
	pop_err();
	return t_plugin;
}
var bb_flxg_FlxG_Accel;
var bb_flxg_FlxG_Keys;
var bb_flxg_FlxG_Mouse;
var bb_flxg_FlxG__Joystick;
var bb_flxg_FlxG__Touch;
var bb_flxg_FlxG_Mobile;
var bb_flxg_FlxG_Scores;
var bb_flxg_FlxG_Levels;
var bb_flxg_FlxG_VisualDebug;
function bb_flxg_FlxG_Init(t_game,t_width,t_height,t_zoom){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<606>";
	bb_flxg_FlxG__Game=t_game;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<607>";
	bb_flxg_FlxG_Width=t_width;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<608>";
	bb_flxg_FlxG_Height=t_height;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<610>";
	bb_flxg_FlxG_Mute=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<611>";
	bb_flxg_FlxG__Volume=.5;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<612>";
	bb_flxg_FlxG_Sounds=bb_flxgroup_FlxGroup_new.call(new bb_flxgroup_FlxGroup,0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<613>";
	bb_flxg_FlxG_VolumeHandler=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<615>";
	bb_flxg_FlxG_ClearBitmapCache();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<617>";
	bb_flxcamera_FlxCamera_DefaultZoom=t_zoom;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<618>";
	bb_flxg_FlxG_Cameras=bb_stack_Stack_new.call(new bb_stack_Stack);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<620>";
	bb_flxg_FlxG_Plugins=bb_stack_Stack2_new.call(new bb_stack_Stack2);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<621>";
	bb_flxg_FlxG_AddPlugin(bb_debugpathdisplay_DebugPathDisplay_new.call(new bb_debugpathdisplay_DebugPathDisplay));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<622>";
	bb_flxg_FlxG_AddPlugin(bb_timermanager_TimerManager_new.call(new bb_timermanager_TimerManager));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<624>";
	bb_flxg_FlxG_Accel=bb_accel_Accel_new.call(new bb_accel_Accel);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<625>";
	bb_flxg_FlxG_Keys=bb_keyboard_Keyboard_new.call(new bb_keyboard_Keyboard);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<626>";
	bb_flxg_FlxG_Mouse=bb_mouse_Mouse_new.call(new bb_mouse_Mouse);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<628>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<629>";
		dbg_array(bb_flxg_FlxG__Joystick,t_i)[dbg_index]=bb_joystick_Joystick_new.call(new bb_joystick_Joystick,t_i)
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<632>";
	for(var t_i2=0;t_i2<32;t_i2=t_i2+1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<633>";
		dbg_array(bb_flxg_FlxG__Touch,t_i2)[dbg_index]=bb_touch_Touch_new.call(new bb_touch_Touch,t_i2)
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<636>";
	bb_flxg_FlxG_Mobile=flixel.isMobile();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<638>";
	bb_flxg_FlxG_Scores=bb_stack_Stack5_new.call(new bb_stack_Stack5);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<639>";
	bb_flxg_FlxG_Levels=bb_stack_Stack5_new.call(new bb_stack_Stack5);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<640>";
	bb_flxg_FlxG_VisualDebug=false;
	pop_err();
}
var bb_flxg_FlxG_Framerate;
var bb_flxg_FlxG_Updaterate;
var bb_flxg_FlxG_DeviceWidth;
var bb_flxg_FlxG_DeviceHeight;
var bb_flxg_FlxG__DeviceScaleFactorX;
var bb_flxg_FlxG__DeviceScaleFactorY;
var bb_flxg_FlxG_Music;
function bb_flxg_FlxG_DestroySounds(t_forceDestroy){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<331>";
	if(bb_flxg_FlxG_Music!=null && (t_forceDestroy || !dbg_object(bb_flxg_FlxG_Music).f_survive)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<332>";
		bb_flxg_FlxG_Music.m_Destroy();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<333>";
		bb_flxg_FlxG_Music=null;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<336>";
	var t_sound=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<338>";
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<338>";
	var t_=bb_flxg_FlxG_Sounds.m_ObjectEnumerator();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<338>";
	while(t_.m_HasNext()){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<338>";
		var t_basic=t_.m_NextObject();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<339>";
		t_sound=object_downcast((t_basic),bb_flxsound_FlxSound);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<341>";
		if(t_sound!=null && (t_forceDestroy || !dbg_object(t_sound).f_survive)){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<342>";
			t_sound.m_Destroy();
		}
	}
	pop_err();
}
var bb_flxg_FlxG__SoundCache;
function bb_flxg_FlxG_ClearSoundCache(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<438>";
	if(bb_flxg_FlxG__SoundCache==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<438>";
		bb_flxg_FlxG__SoundCache=bb_flxresourcesmanager_FlxResourcesManager2_new.call(new bb_flxresourcesmanager_FlxResourcesManager2);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<440>";
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<440>";
	var t_=bb_flxg_FlxG__SoundCache.m_Resources().m_Values().m_ObjectEnumerator();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<440>";
	while(t_.m_HasNext()){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<440>";
		var t_sound=t_.m_NextObject();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<441>";
		if(t_sound!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<441>";
			t_sound.m_Discard();
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<444>";
	bb_flxg_FlxG__SoundCache.m_Clear();
	pop_err();
}
function bb_flxg_FlxG_ResetInput(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<251>";
	for(var t_i=0;t_i<4;t_i=t_i+1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<252>";
		dbg_array(bb_flxg_FlxG__Joystick,t_i)[dbg_index].m_Reset();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<255>";
	for(var t_i2=0;t_i2<32;t_i2=t_i2+1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<256>";
		dbg_array(bb_flxg_FlxG__Touch,t_i2)[dbg_index].m_Reset();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<259>";
	bb_flxg_FlxG_Accel.m_Reset();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<260>";
	bb_flxg_FlxG_Mouse.m_Reset();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<263>";
	bb_flxg_FlxG_Keys.m_Reset();
	pop_err();
}
var bb_flxg_FlxG_Level;
var bb_flxg_FlxG_Score;
var bb_flxg_FlxG_TimeScale;
var bb_flxg_FlxG_Elapsed;
var bb_flxg_FlxG_GlobalSeed;
var bb_flxg_FlxG_WorldBounds;
var bb_flxg_FlxG_WorldDivisions;
function bb_flxg_FlxG_GetPlugin(t_creator){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<568>";
	var t_pluginList=bb_flxg_FlxG_Plugins;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<569>";
	var t_plugin=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<570>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<571>";
	var t_l=t_pluginList.m_Length();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<573>";
	while(t_i<t_l){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<574>";
		t_plugin=t_pluginList.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<575>";
		if(t_creator.m_InstanceOf(t_plugin)){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<575>";
			pop_err();
			return t_plugin;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<577>";
		t_i+=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<580>";
	pop_err();
	return null;
}
function bb_flxg_FlxG_Reset(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<644>";
	bb_flxg_FlxG_ClearBitmapCache();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<645>";
	bb_flxg_FlxG_DestroySounds(true);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<646>";
	bb_flxg_FlxG_ClearSoundCache();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<647>";
	bb_flxg_FlxG_ResetInput();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<648>";
	bb_flxg_FlxG_Levels.m_Clear();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<649>";
	bb_flxg_FlxG_Scores.m_Clear();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<650>";
	bb_flxg_FlxG_Level=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<651>";
	bb_flxg_FlxG_Score=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<652>";
	bb_flxg_FlxG_TimeScale=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<653>";
	bb_flxg_FlxG_Elapsed=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<654>";
	bb_flxg_FlxG_GlobalSeed=((bb_random_Rnd2(1.0,10000000.0))|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<655>";
	bb_flxg_FlxG_WorldBounds=bb_flxrect_FlxRect_new.call(new bb_flxrect_FlxRect,-10.0,-10.0,(bb_flxg_FlxG_Width+20),(bb_flxg_FlxG_Height+20));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<656>";
	bb_flxg_FlxG_WorldDivisions=6;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<657>";
	var t_debugPathDisplay=object_downcast((bb_flxg_FlxG_GetPlugin(bb_debugpathdisplay_DebugPathDisplay_ClassObject)),bb_debugpathdisplay_DebugPathDisplay);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<658>";
	if(t_debugPathDisplay!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<658>";
		t_debugPathDisplay.m_Clear();
	}
	pop_err();
}
function bb_flxg_FlxG_Log(t_data){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<155>";
	print(t_data);
	pop_err();
}
var bb_flxg_FlxG_Camera;
var bb_flxg_FlxG__BgColor;
function bb_flxg_FlxG_BgColor(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<515>";
	if(bb_flxg_FlxG_Camera==null || !dbg_object(bb_flxg_FlxG_Camera).f_alive){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<515>";
		pop_err();
		return dbg_object(bb_flxg_FlxG__BgColor).f_argb;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<516>";
	var t_=bb_flxg_FlxG_Camera.m_BgColor();
	pop_err();
	return t_;
}
function bb_flxg_FlxG_AddCamera(t_newCamera){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<456>";
	bb_flxg_FlxG_Cameras.m_Push(t_newCamera);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<457>";
	pop_err();
	return t_newCamera;
}
function bb_flxg_FlxG_ResetCameras(t_newCamera){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<466>";
	var t_cam=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<467>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<468>";
	var t_l=bb_flxg_FlxG_Cameras.m_Length();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<470>";
	while(t_i<t_l){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<471>";
		t_cam=bb_flxg_FlxG_Cameras.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<472>";
		t_cam.m_Destroy();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<473>";
		t_i+=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<476>";
	bb_flxg_FlxG_Cameras.m_Clear();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<477>";
	bb_flxg_FlxG_Camera=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<479>";
	if(t_newCamera==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<479>";
		t_newCamera=bb_flxcamera_FlxCamera_new.call(new bb_flxcamera_FlxCamera,0,0,bb_flxg_FlxG_Width,bb_flxg_FlxG_Height,0.0);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<481>";
	bb_flxg_FlxG_Camera=bb_flxg_FlxG_AddCamera(t_newCamera);
	pop_err();
}
function bb_flxg_FlxG_StopReplay(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<213>";
	dbg_object(bb_flxg_FlxG__Game).f__replaying=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<215>";
	if(dbg_object(bb_flxg_FlxG__Game).f__debugger!=null){
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<219>";
	bb_flxg_FlxG_ResetInput();
	pop_err();
}
function bb_flxg_FlxG_Joystick(t_unit){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<762>";
	var t_=dbg_array(bb_flxg_FlxG__Joystick,t_unit)[dbg_index];
	pop_err();
	return t_;
}
function bb_flxg_FlxG_TouchCount(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<774>";
	pop_err();
	return 32;
}
function bb_flxg_FlxG_Touch(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<766>";
	var t_=dbg_array(bb_flxg_FlxG__Touch,t_index)[dbg_index];
	pop_err();
	return t_;
}
function bb_flxg_FlxG_UpdateInput(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<663>";
	bb_flxg_FlxG_Accel.m_Update2(bb_input2_AccelX(),bb_input2_AccelY(),bb_input2_AccelZ());
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<690>";
	if(!bb_flxg_FlxG_Mobile){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<691>";
		bb_flxg_FlxG_Keys.m_Update();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<694>";
	dbg_array(bb_flxg_FlxG__Touch,0)[dbg_index].m_Update3(bb_input2_TouchX(0),bb_input2_TouchY(0));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<717>";
	if(!dbg_object(bb_flxg_FlxG__Game).f__debuggerUp || !dbg_object(dbg_object(bb_flxg_FlxG__Game).f__debugger).f_hasMouse){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<718>";
		bb_flxg_FlxG_Mouse.m_Update3(bb_input2_MouseX(),bb_input2_MouseY());
	}
	pop_err();
}
function bb_flxg_FlxG_UpdateSounds(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<348>";
	if(bb_flxg_FlxG_Music!=null && dbg_object(bb_flxg_FlxG_Music).f_active){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<349>";
		bb_flxg_FlxG_Music.m_Update();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<352>";
	if(bb_flxg_FlxG_Sounds!=null && dbg_object(bb_flxg_FlxG_Sounds).f_active){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<353>";
		bb_flxg_FlxG_Sounds.m_Update();
	}
	pop_err();
}
function bb_flxg_FlxG_UpdatePlugins(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<736>";
	var t_plugin=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<737>";
	var t_pluginList=bb_flxg_FlxG_Plugins;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<738>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<739>";
	var t_l=t_pluginList.m_Length();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<741>";
	while(t_i<t_l){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<742>";
		t_plugin=t_pluginList.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<743>";
		if(dbg_object(t_plugin).f_exists && dbg_object(t_plugin).f_active){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<743>";
			t_plugin.m_Update();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<744>";
		t_i+=1;
	}
	pop_err();
}
function bb_flxg_FlxG_Random(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<178>";
	bb_flxg_FlxG_GlobalSeed=bb_flxg_FlxG_GlobalSeed*1664525+1013904223|0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<179>";
	var t_=bb_flxu_FlxU_Srand(bb_flxg_FlxG_GlobalSeed);
	pop_err();
	return t_;
}
function bb_flxg_FlxG_UpdateCameras(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<723>";
	var t_cam=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<724>";
	var t_cams=bb_flxg_FlxG_Cameras;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<725>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<726>";
	var t_l=t_cams.m_Length();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<728>";
	while(t_i<t_l){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<729>";
		t_cam=t_cams.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<730>";
		if(t_cam!=null && dbg_object(t_cam).f_exists && dbg_object(t_cam).f_active){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<730>";
			t_cam.m_Update();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<731>";
		t_i+=1;
	}
	pop_err();
}
function bb_flxg_FlxG_Volume(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<301>";
	pop_err();
	return bb_flxg_FlxG__Volume;
}
function bb_flxg_FlxG_Volume2(t_volume){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<305>";
	bb_flxg_FlxG__Volume=t_volume;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<307>";
	if(bb_flxg_FlxG__Volume<0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<308>";
		bb_flxg_FlxG__Volume=0.0;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<309>";
		if(bb_flxg_FlxG__Volume>1.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<310>";
			bb_flxg_FlxG__Volume=1.0;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<313>";
	if(bb_flxg_FlxG_VolumeHandler!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<314>";
		if(bb_flxg_FlxG_Mute){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<315>";
			bb_flxg_FlxG_VolumeHandler.m_OnVolumeChange(0.0);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<317>";
			bb_flxg_FlxG_VolumeHandler.m_OnVolumeChange(bb_flxg_FlxG__Volume);
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<321>";
	if(bb_flxg_FlxG_Music!=null && dbg_object(bb_flxg_FlxG_Music).f_active){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<322>";
		bb_flxg_FlxG_Music.m__UpdateTransform();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<325>";
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<325>";
	var t_=bb_flxg_FlxG_Sounds.m_ObjectEnumerator();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<325>";
	while(t_.m_HasNext()){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<325>";
		var t_basic=t_.m_NextObject();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<326>";
		object_downcast((t_basic),bb_flxsound_FlxSound).m__UpdateTransform();
	}
	pop_err();
}
function bb_flxg_FlxG_AddSound(t_sound,t_soundLoader){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<434>";
	var t_=bb_flxg_FlxG__SoundCache.m_GetResource2(t_sound,t_soundLoader);
	pop_err();
	return t_;
}
function bb_flxg_FlxG_LoadSound(t_sound,t_volume,t_looped,t_autoDestroy,t_autoPlay,t_stopPrevious){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<285>";
	var t_s=object_downcast((bb_flxg_FlxG_Sounds.m_Recycle(bb_flxsound_FlxSound_ClassObject)),bb_flxsound_FlxSound);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<287>";
	t_s.m_Load2(t_sound,t_looped,t_autoDestroy,t_stopPrevious);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<288>";
	t_s.m_Volume2(t_volume);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<289>";
	if(t_autoPlay){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<289>";
		t_s.m_Play(false);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<291>";
	pop_err();
	return t_s;
}
function bb_flxg_FlxG_Play(t_sound,t_volume,t_looped,t_autoDestroy){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<295>";
	var t_s=bb_flxg_FlxG_LoadSound(t_sound,t_volume,t_looped,t_autoDestroy,true,false);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<296>";
	if(!t_looped){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<296>";
		dbg_object(t_s).f_exists=false;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<297>";
	pop_err();
	return t_s;
}
var bb_flxg_FlxG__LastDrawingColor;
var bb_flxg_FlxG__LastDrawingBlend;
var bb_flxg_FlxG__LastDrawingAlpha;
var bb_flxg_FlxG__CurrentCamera;
function bb_flxg_FlxG_DrawPlugins(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<749>";
	var t_plugin=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<750>";
	var t_pluginList=bb_flxg_FlxG_Plugins;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<751>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<752>";
	var t_l=t_pluginList.m_Length();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<754>";
	while(t_i<t_l){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<755>";
		t_plugin=t_pluginList.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<756>";
		if(dbg_object(t_plugin).f_exists && dbg_object(t_plugin).f_visible){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<756>";
			t_plugin.m_Draw();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<757>";
		t_i+=1;
	}
	pop_err();
}
function bb_flxg_FlxG_PauseSounds(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<358>";
	if(bb_flxg_FlxG_Music!=null && dbg_object(bb_flxg_FlxG_Music).f_exists && dbg_object(bb_flxg_FlxG_Music).f_active){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<359>";
		bb_flxg_FlxG_Music.m_Pause();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<362>";
	var t_sound=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<364>";
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<364>";
	var t_=bb_flxg_FlxG_Sounds.m_ObjectEnumerator();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<364>";
	while(t_.m_HasNext()){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<364>";
		var t_basic=t_.m_NextObject();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<365>";
		t_sound=object_downcast((t_basic),bb_flxsound_FlxSound);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<367>";
		if(t_sound!=null && dbg_object(t_sound).f_exists && dbg_object(t_sound).f_active){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<368>";
			t_sound.m_Pause();
		}
	}
	pop_err();
}
function bb_flxg_FlxG_ResumeSounds(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<374>";
	if(bb_flxg_FlxG_Music!=null && dbg_object(bb_flxg_FlxG_Music).f_exists){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<375>";
		bb_flxg_FlxG_Music.m_Play(false);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<378>";
	var t_sound=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<380>";
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<380>";
	var t_=bb_flxg_FlxG_Sounds.m_ObjectEnumerator();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<380>";
	while(t_.m_HasNext()){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<380>";
		var t_basic=t_.m_NextObject();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<381>";
		t_sound=object_downcast((t_basic),bb_flxsound_FlxSound);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<383>";
		if(t_sound!=null && dbg_object(t_sound).f_exists){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<384>";
			t_sound.m_Resume();
		}
	}
	pop_err();
}
function bb_flxg_FlxG_CheckBitmapCache(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<390>";
	var t_=bb_flxg_FlxG__BitmapCache.m_CheckResource(t_key);
	pop_err();
	return t_;
}
function bb_flxg_FlxG_AddBitmap(t_graphic,t_graphicLoader,t_unique,t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<394>";
	if(t_key.length==0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<395>";
		t_key=t_graphic;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<397>";
		if(t_unique && bb_flxg_FlxG_CheckBitmapCache(t_key)){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<398>";
			var t_inc=0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<399>";
			var t_ukey="";
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<401>";
			do{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<402>";
				t_ukey=t_key+String(t_inc);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<403>";
				t_inc+=1;
			}while(!(bb_flxg_FlxG_CheckBitmapCache(t_ukey)));
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<406>";
			t_key=t_ukey;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxg.monkey<410>";
	var t_=bb_flxg_FlxG__BitmapCache.m_GetResource(t_key,t_graphicLoader);
	pop_err();
	return t_;
}
function bb_set_Set(){
	Object.call(this);
	this.f_map=null;
}
bb_set_Set.prototype.m_Contains=function(t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/set.monkey<32>";
	var t_=this.f_map.m_Contains(t_value);
	pop_err();
	return t_;
}
function bb_set_IntSet(){
	bb_set_Set.call(this);
}
bb_set_IntSet.prototype=extend_class(bb_set_Set);
function bb_graphics_Image(){
	Object.call(this);
	this.f_surface=null;
	this.f_source=null;
	this.f_width=0;
	this.f_height=0;
	this.f_frames=[];
	this.f_flags=0;
	this.f_tx=.0;
	this.f_ty=.0;
}
bb_graphics_Image.prototype.m_Discard=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<116>";
	if(((this.f_surface)!=null) && !((this.f_source)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<117>";
		this.f_surface.Discard();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<118>";
		this.f_surface=null;
	}
	pop_err();
	return 0;
}
var bb_graphics_Image_DefaultFlags;
function bb_graphics_Image_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<64>";
	pop_err();
	return this;
}
bb_graphics_Image.prototype.m_SetHandle=function(t_tx,t_ty){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<110>";
	dbg_object(this).f_tx=t_tx;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<111>";
	dbg_object(this).f_ty=t_ty;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<112>";
	dbg_object(this).f_flags=dbg_object(this).f_flags&-2;
	pop_err();
	return 0;
}
bb_graphics_Image.prototype.m_ApplyFlags=function(t_iflags){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<180>";
	this.f_flags=t_iflags;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<182>";
	if((this.f_flags&2)!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<183>";
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<183>";
		var t_=this.f_frames;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<183>";
		var t_2=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<183>";
		while(t_2<t_.length){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<183>";
			var t_f=dbg_array(t_,t_2)[dbg_index];
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<183>";
			t_2=t_2+1;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<184>";
			dbg_object(t_f).f_x+=1;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<186>";
		this.f_width-=2;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<189>";
	if((this.f_flags&4)!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<190>";
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<190>";
		var t_3=this.f_frames;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<190>";
		var t_4=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<190>";
		while(t_4<t_3.length){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<190>";
			var t_f2=dbg_array(t_3,t_4)[dbg_index];
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<190>";
			t_4=t_4+1;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<191>";
			dbg_object(t_f2).f_y+=1;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<193>";
		this.f_height-=2;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<196>";
	if((this.f_flags&1)!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<197>";
		this.m_SetHandle((this.f_width)/2.0,(this.f_height)/2.0);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<200>";
	if(this.f_frames.length==1 && dbg_object(dbg_array(this.f_frames,0)[dbg_index]).f_x==0 && dbg_object(dbg_array(this.f_frames,0)[dbg_index]).f_y==0 && this.f_width==this.f_surface.Width() && this.f_height==this.f_surface.Height()){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<201>";
		this.f_flags|=65536;
	}
	pop_err();
	return 0;
}
bb_graphics_Image.prototype.m_Load=function(t_path,t_nframes,t_iflags){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<133>";
	this.f_surface=dbg_object(bb_graphics_context).f_device.LoadSurface(t_path);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<134>";
	if(!((this.f_surface)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<134>";
		pop_err();
		return null;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<136>";
	this.f_width=((this.f_surface.Width()/t_nframes)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<137>";
	this.f_height=this.f_surface.Height();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<139>";
	this.f_frames=new_object_array(t_nframes);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<141>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<142>";
		dbg_array(this.f_frames,t_i)[dbg_index]=bb_graphics_Frame_new.call(new bb_graphics_Frame,t_i*this.f_width,0)
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<145>";
	this.m_ApplyFlags(t_iflags);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<147>";
	pop_err();
	return this;
}
bb_graphics_Image.prototype.m_Grab=function(t_x,t_y,t_iwidth,t_iheight,t_nframes,t_iflags,t_source){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<152>";
	dbg_object(this).f_source=t_source;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<153>";
	this.f_surface=dbg_object(t_source).f_surface;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<155>";
	this.f_width=t_iwidth;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<156>";
	this.f_height=t_iheight;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<158>";
	this.f_frames=new_object_array(t_nframes);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<160>";
	var t_ix=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<160>";
	var t_iy=t_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<162>";
	for(var t_i=0;t_i<t_nframes;t_i=t_i+1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<163>";
		if(t_ix+this.f_width>dbg_object(t_source).f_width){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<164>";
			t_ix=0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<165>";
			t_iy+=this.f_height;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<167>";
		if(t_ix+this.f_width>dbg_object(t_source).f_width || t_iy+this.f_height>dbg_object(t_source).f_height){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<168>";
			error("Image frame outside surface");
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<170>";
		dbg_array(this.f_frames,t_i)[dbg_index]=bb_graphics_Frame_new.call(new bb_graphics_Frame,t_ix+dbg_object(dbg_array(dbg_object(t_source).f_frames,0)[dbg_index]).f_x,t_iy+dbg_object(dbg_array(dbg_object(t_source).f_frames,0)[dbg_index]).f_y)
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<171>";
		t_ix+=this.f_width;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<174>";
	this.m_ApplyFlags(t_iflags);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<176>";
	pop_err();
	return this;
}
bb_graphics_Image.prototype.m_GrabImage=function(t_x,t_y,t_width,t_height,t_frames,t_flags){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<105>";
	if(dbg_object(this).f_frames.length!=1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<105>";
		pop_err();
		return null;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<106>";
	var t_=(bb_graphics_Image_new.call(new bb_graphics_Image)).m_Grab(t_x,t_y,t_width,t_height,t_frames,t_flags,this);
	pop_err();
	return t_;
}
bb_graphics_Image.prototype.m_Width=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<77>";
	pop_err();
	return this.f_width;
}
bb_graphics_Image.prototype.m_Height=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<81>";
	pop_err();
	return this.f_height;
}
bb_graphics_Image.prototype.m_Frames=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<89>";
	var t_=this.f_frames.length;
	pop_err();
	return t_;
}
function bb_flxresourcesmanager_FlxResourcesManager(){
	Object.call(this);
	this.f__resources=null;
}
function bb_flxresourcesmanager_FlxResourcesManager_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<15>";
	this.f__resources=bb_map_StringMap_new.call(new bb_map_StringMap);
	pop_err();
	return this;
}
bb_flxresourcesmanager_FlxResourcesManager.prototype.m_Resources=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<42>";
	pop_err();
	return this.f__resources;
}
bb_flxresourcesmanager_FlxResourcesManager.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<46>";
	this.f__resources.m_Clear();
	pop_err();
}
bb_flxresourcesmanager_FlxResourcesManager.prototype.m_CheckResource=function(t_name){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<38>";
	var t_=this.f__resources.m_Get(t_name)!=null;
	pop_err();
	return t_;
}
bb_flxresourcesmanager_FlxResourcesManager.prototype.m_GetResource=function(t_name,t_loader){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<20>";
	var t_resource=this.f__resources.m_Get(t_name);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<22>";
	if(t_resource!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<23>";
		pop_err();
		return t_resource;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<26>";
	t_resource=t_loader.m_Load3(t_name);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<27>";
	if(t_resource==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<27>";
		error("Resource "+t_name+" can't be loaded");
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<29>";
	this.f__resources.m_Set(t_name,t_resource);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<30>";
	pop_err();
	return t_resource;
}
function bb_map_Map(){
	Object.call(this);
	this.f_root=null;
}
function bb_map_Map_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
bb_map_Map.prototype.m_Values=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<117>";
	var t_=bb_map_MapValues_new.call(new bb_map_MapValues,this);
	pop_err();
	return t_;
}
bb_map_Map.prototype.m_FirstNode=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<137>";
	if(!((this.f_root)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<137>";
		pop_err();
		return null;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<139>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<140>";
	while((dbg_object(t_node).f_left)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<141>";
		t_node=dbg_object(t_node).f_left;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<143>";
	pop_err();
	return t_node;
}
bb_map_Map.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<13>";
	this.f_root=null;
	pop_err();
	return 0;
}
bb_map_Map.prototype.m_Compare=function(t_lhs,t_rhs){
}
bb_map_Map.prototype.m_FindNode=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<157>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<160>";
		var t_cmp=this.m_Compare(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
bb_map_Map.prototype.m_Get=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<101>";
	var t_node=this.m_FindNode(t_key);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<102>";
	if((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<102>";
		pop_err();
		return dbg_object(t_node).f_value;
	}
	pop_err();
	return null;
}
bb_map_Map.prototype.m_RotateLeft=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<252>";
	dbg_object(t_node).f_right=dbg_object(t_child).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).f_left)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).f_left).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<256>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<264>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<266>";
	dbg_object(t_child).f_left=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<267>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map.prototype.m_RotateRight=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<272>";
	dbg_object(t_node).f_left=dbg_object(t_child).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).f_right)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).f_right).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<276>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<284>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<286>";
	dbg_object(t_child).f_right=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<287>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map.prototype.m_InsertFixup=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).f_parent)!=null) && dbg_object(dbg_object(t_node).f_parent).f_color==-1 && ((dbg_object(dbg_object(t_node).f_parent).f_parent)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).f_parent==dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_right;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<223>";
					this.m_RotateLeft(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<227>";
				this.m_RotateRight(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<239>";
					this.m_RotateRight(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<243>";
				this.m_RotateLeft(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<247>";
	dbg_object(this.f_root).f_color=1;
	pop_err();
	return 0;
}
bb_map_Map.prototype.m_Set=function(t_key,t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<29>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<34>";
		t_cmp=this.m_Compare(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<40>";
				dbg_object(t_node).f_value=t_value;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<45>";
	t_node=bb_map_Node_new.call(new bb_map_Node,t_key,t_value,-1,t_parent);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).f_right=t_node;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).f_left=t_node;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<53>";
		this.m_InsertFixup(t_node);
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<55>";
		this.f_root=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
function bb_map_StringMap(){
	bb_map_Map.call(this);
}
bb_map_StringMap.prototype=extend_class(bb_map_Map);
function bb_map_StringMap_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<551>";
	bb_map_Map_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
bb_map_StringMap.prototype.m_Compare=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<554>";
	var t_=string_compare(t_lhs,t_rhs);
	pop_err();
	return t_;
}
function bb_map_MapValues(){
	Object.call(this);
	this.f_map=null;
}
function bb_map_MapValues_new(t_map){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<519>";
	dbg_object(this).f_map=t_map;
	pop_err();
	return this;
}
function bb_map_MapValues_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<516>";
	pop_err();
	return this;
}
bb_map_MapValues.prototype.m_ObjectEnumerator=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<523>";
	var t_=bb_map_ValueEnumerator_new.call(new bb_map_ValueEnumerator,this.f_map.m_FirstNode());
	pop_err();
	return t_;
}
function bb_map_ValueEnumerator(){
	Object.call(this);
	this.f_node=null;
}
function bb_map_ValueEnumerator_new(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<481>";
	dbg_object(this).f_node=t_node;
	pop_err();
	return this;
}
function bb_map_ValueEnumerator_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<478>";
	pop_err();
	return this;
}
bb_map_ValueEnumerator.prototype.m_HasNext=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<485>";
	var t_=this.f_node!=null;
	pop_err();
	return t_;
}
bb_map_ValueEnumerator.prototype.m_NextObject=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<489>";
	var t_t=this.f_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<490>";
	this.f_node=this.f_node.m_NextNode();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<491>";
	pop_err();
	return dbg_object(t_t).f_value;
}
function bb_map_Node(){
	Object.call(this);
	this.f_left=null;
	this.f_right=null;
	this.f_parent=null;
	this.f_value=null;
	this.f_key="";
	this.f_color=0;
}
bb_map_Node.prototype.m_NextNode=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<385>";
	var t_node=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<386>";
	if((this.f_right)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<387>";
		t_node=this.f_right;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<388>";
		while((dbg_object(t_node).f_left)!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<389>";
			t_node=dbg_object(t_node).f_left;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<391>";
		pop_err();
		return t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<393>";
	t_node=this;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<394>";
	var t_parent=dbg_object(this).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<395>";
	while(((t_parent)!=null) && t_node==dbg_object(t_parent).f_right){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<396>";
		t_node=t_parent;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<397>";
		t_parent=dbg_object(t_parent).f_parent;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<399>";
	pop_err();
	return t_parent;
}
function bb_map_Node_new(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<364>";
	dbg_object(this).f_key=t_key;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<365>";
	dbg_object(this).f_value=t_value;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<366>";
	dbg_object(this).f_color=t_color;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<367>";
	dbg_object(this).f_parent=t_parent;
	pop_err();
	return this;
}
function bb_map_Node_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function bb_flxcamera_FlxCamera(){
	bb_flxbasic_FlxBasic.call(this);
	this.f_target=null;
	this.f_scroll=null;
	this.f_deadzone=null;
	this.f_bounds=null;
	this.f__color=null;
	this.f__bgColor=null;
	this.f__fxFlashComplete=null;
	this.f__fxFadeComplete=null;
	this.f__fxShakeComplete=null;
	this.f__fxShakeOffset=null;
	this.f__fill=null;
	this.f__zoom=.0;
	this.f__scaleX=.0;
	this.f__scaleY=.0;
	this.f__width=.0;
	this.f__realWidth=.0;
	this.f__height=.0;
	this.f__realHeight=.0;
	this.f__x=.0;
	this.f__realX=.0;
	this.f__realY=.0;
	this.f__clipped=false;
	this.f__y=.0;
	this.f__point=null;
	this.f__alpha=.0;
	this.f__fxFlashColor=0;
	this.f__fxFlashDuration=.0;
	this.f__fxFlashAlpha=.0;
	this.f__fxFadeColor=0;
	this.f__fxFadeDuration=.0;
	this.f__fxFadeAlpha=.0;
	this.f__fxShakeIntensity=.0;
	this.f__fxShakeDuration=.0;
	this.f__fxShakeDirection=0;
	this.f__id=0;
}
bb_flxcamera_FlxCamera.prototype=extend_class(bb_flxbasic_FlxBasic);
var bb_flxcamera_FlxCamera_DefaultZoom;
bb_flxcamera_FlxCamera.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<529>";
	pop_err();
	return "FlxCamera";
}
bb_flxcamera_FlxCamera.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<150>";
	this.f_target=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<151>";
	this.f_scroll=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<152>";
	this.f_deadzone=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<153>";
	this.f_bounds=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<154>";
	this.f__color=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<155>";
	this.f__bgColor=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<156>";
	this.f__fxFlashComplete=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<157>";
	this.f__fxFadeComplete=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<158>";
	this.f__fxShakeComplete=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<159>";
	this.f__fxShakeOffset=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<160>";
	this.f__fill=null;
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_Zoom=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<442>";
	pop_err();
	return this.f__zoom;
}
bb_flxcamera_FlxCamera.prototype.m_SetScale=function(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<492>";
	this.f__scaleX=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<493>";
	this.f__scaleY=t_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<494>";
	this.f__realWidth=bb_math_Min2((bb_flxg_FlxG_DeviceWidth),Math.floor(this.f__width*this.f__scaleX*bb_flxg_FlxG__DeviceScaleFactorX));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<495>";
	this.f__realHeight=bb_math_Min2((bb_flxg_FlxG_DeviceHeight),Math.floor(this.f__height*this.f__scaleY*bb_flxg_FlxG__DeviceScaleFactorY));
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_Zoom2=function(t_zoom){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<446>";
	if(t_zoom==0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<447>";
		this.f__zoom=bb_flxcamera_FlxCamera_DefaultZoom;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<449>";
		this.f__zoom=t_zoom;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<452>";
	this.m_SetScale(this.f__zoom,this.f__zoom);
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_X=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<398>";
	pop_err();
	return this.f__x;
}
bb_flxcamera_FlxCamera.prototype.m__IsClipped=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<534>";
	var t_=this.f__realX!=0.0 || this.f__realY!=0.0 || this.f__realWidth!=(bb_flxg_FlxG_DeviceWidth) || this.f__realHeight!=(bb_flxg_FlxG_DeviceHeight);
	pop_err();
	return t_;
}
bb_flxcamera_FlxCamera.prototype.m_X2=function(t_x){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<402>";
	this.f__x=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<403>";
	this.f__realX=this.f__x*bb_flxg_FlxG__DeviceScaleFactorX;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<405>";
	this.f__clipped=this.m__IsClipped();
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_Y=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<409>";
	pop_err();
	return this.f__y;
}
bb_flxcamera_FlxCamera.prototype.m_Y2=function(t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<413>";
	this.f__y=t_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<414>";
	this.f__realY=this.f__y*bb_flxg_FlxG__DeviceScaleFactorY;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<416>";
	this.f__clipped=this.m__IsClipped();
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_Width=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<420>";
	pop_err();
	return this.f__width;
}
bb_flxcamera_FlxCamera.prototype.m_Width2=function(t_width){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<424>";
	this.f__width=t_width;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<425>";
	this.f__realWidth=bb_math_Min2((bb_flxg_FlxG_DeviceWidth),Math.floor(this.f__width*this.f__scaleX*bb_flxg_FlxG__DeviceScaleFactorX));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<427>";
	this.f__clipped=this.m__IsClipped();
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_Height=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<431>";
	pop_err();
	return this.f__height;
}
bb_flxcamera_FlxCamera.prototype.m_Height2=function(t_height){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<435>";
	this.f__height=t_height;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<436>";
	this.f__realHeight=bb_math_Min2((bb_flxg_FlxG_DeviceHeight),Math.floor(this.f__height*this.f__scaleY*bb_flxg_FlxG__DeviceScaleFactorY));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<438>";
	this.f__clipped=this.m__IsClipped();
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_BgColor=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<480>";
	pop_err();
	return dbg_object(this.f__bgColor).f_argb;
}
bb_flxcamera_FlxCamera.prototype.m_BgColor2=function(t_color){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<484>";
	this.f__bgColor.m_SetARGB(t_color);
	pop_err();
}
var bb_flxcamera_FlxCamera__Inkrement;
function bb_flxcamera_FlxCamera_new(t_x,t_y,t_width,t_height,t_zoom){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<110>";
	bb_flxbasic_FlxBasic_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<111>";
	this.m_Zoom2(t_zoom);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<112>";
	this.m_X2(t_x);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<113>";
	this.m_Y2(t_y);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<114>";
	this.m_Width2(t_width);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<115>";
	this.m_Height2(t_height);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<116>";
	this.f_target=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<117>";
	this.f_deadzone=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<118>";
	this.f_scroll=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<119>";
	this.f__point=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<120>";
	this.f_bounds=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<121>";
	this.f__bgColor=bb_flxcolor_FlxColor_new.call(new bb_flxcolor_FlxColor,bb_flxg_FlxG_BgColor());
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<122>";
	this.f__color=bb_flxcolor_FlxColor_new.call(new bb_flxcolor_FlxColor,-1);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<123>";
	this.f__alpha=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<125>";
	this.f__fxFlashColor=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<126>";
	this.f__fxFlashDuration=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<127>";
	this.f__fxFlashComplete=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<128>";
	this.f__fxFlashAlpha=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<130>";
	this.f__fxFadeColor=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<131>";
	this.f__fxFadeDuration=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<132>";
	this.f__fxFadeComplete=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<133>";
	this.f__fxFadeAlpha=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<135>";
	this.f__fxShakeIntensity=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<136>";
	this.f__fxShakeDuration=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<137>";
	this.f__fxShakeComplete=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<138>";
	this.f__fxShakeOffset=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<139>";
	this.f__fxShakeDirection=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<141>";
	this.f_active=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<143>";
	this.f__fill=bb_flxcolor_FlxColor_new.call(new bb_flxcolor_FlxColor,0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<145>";
	this.f__id=bb_flxcamera_FlxCamera__Inkrement;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<146>";
	bb_flxcamera_FlxCamera__Inkrement+=1;
	pop_err();
	return this;
}
function bb_flxcamera_FlxCamera_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<12>";
	bb_flxbasic_FlxBasic_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<12>";
	pop_err();
	return this;
}
bb_flxcamera_FlxCamera.prototype.m_FocusOn=function(t_point){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<316>";
	if(dbg_object(t_point).f_x>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<317>";
		dbg_object(t_point).f_x+=0.0000001;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<319>";
		dbg_object(t_point).f_x-=0.0000001;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<322>";
	if(dbg_object(t_point).f_y>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<323>";
		dbg_object(t_point).f_y+=0.0000001;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<325>";
		dbg_object(t_point).f_y-=0.0000001;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<328>";
	this.f_scroll.m_Make(dbg_object(t_point).f_x-this.f__width*.5,dbg_object(t_point).f_y-this.f__height*.5);
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_Update=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<208>";
	if(this.f_target!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<209>";
		if(this.f_deadzone==null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<210>";
			this.m_FocusOn(this.f_target.m_GetMidpoint(this.f__point));
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<212>";
			var t_edge=.0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<213>";
			var t_targetX=.0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<214>";
			var t_targetY=.0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<216>";
			if(dbg_object(this.f_target).f_x>0.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<217>";
				t_targetX=dbg_object(this.f_target).f_x+0.0000001;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<219>";
				t_targetX=dbg_object(this.f_target).f_x-0.0000001;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<222>";
			if(dbg_object(this.f_target).f_y>0.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<223>";
				t_targetY=dbg_object(this.f_target).f_y+0.0000001;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<225>";
				t_targetY=dbg_object(this.f_target).f_y-0.0000001;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<228>";
			t_edge=t_targetX-dbg_object(this.f_deadzone).f_x;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<229>";
			if(dbg_object(this.f_scroll).f_x>t_edge){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<229>";
				dbg_object(this.f_scroll).f_x=t_edge;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<230>";
			t_edge=t_targetX+dbg_object(this.f_target).f_width-dbg_object(this.f_deadzone).f_x-dbg_object(this.f_deadzone).f_width;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<231>";
			if(dbg_object(this.f_scroll).f_x<t_edge){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<231>";
				dbg_object(this.f_scroll).f_x=t_edge;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<233>";
			t_edge=t_targetY-dbg_object(this.f_deadzone).f_y;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<234>";
			if(dbg_object(this.f_scroll).f_y>t_edge){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<234>";
				dbg_object(this.f_scroll).f_y=t_edge;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<235>";
			t_edge=t_targetY+dbg_object(this.f_target).f_height-dbg_object(this.f_deadzone).f_y-dbg_object(this.f_deadzone).f_height;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<236>";
			if(dbg_object(this.f_scroll).f_y<t_edge){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<236>";
				dbg_object(this.f_scroll).f_y=t_edge;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<240>";
	if(this.f_bounds!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<241>";
		if(dbg_object(this.f_scroll).f_x<this.f_bounds.m_Left()){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<241>";
			dbg_object(this.f_scroll).f_x=this.f_bounds.m_Left();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<242>";
		if(dbg_object(this.f_scroll).f_x>this.f_bounds.m_Right()-this.f__width){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<242>";
			dbg_object(this.f_scroll).f_x=this.f_bounds.m_Right()-this.f__width;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<243>";
		if(dbg_object(this.f_scroll).f_y<this.f_bounds.m_Top()){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<243>";
			dbg_object(this.f_scroll).f_y=this.f_bounds.m_Top();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<244>";
		if(dbg_object(this.f_scroll).f_y>this.f_bounds.m_Bottom()-this.f__height){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<244>";
			dbg_object(this.f_scroll).f_y=this.f_bounds.m_Bottom()-this.f__height;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<247>";
	if(this.f__fxFlashAlpha>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<248>";
		this.f__fxFlashAlpha-=bb_flxg_FlxG_Elapsed/this.f__fxFlashDuration;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<250>";
		if(this.f__fxFlashAlpha<=0.0 && this.f__fxFlashComplete!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<251>";
			this.f__fxFlashComplete.m_OnFlashComplete();
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<252>";
			this.f__fxFlashComplete=null;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<256>";
	if(this.f__fxFadeAlpha>0.0 && this.f__fxFadeAlpha<1.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<257>";
		this.f__fxFadeAlpha+=bb_flxg_FlxG_Elapsed/this.f__fxFadeDuration;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<259>";
		if(this.f__fxFadeAlpha>=1.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<260>";
			this.f__fxFadeAlpha=1.0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<261>";
			if(this.f__fxFadeComplete!=null){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<262>";
				this.f__fxFadeComplete.m_OnFadeComplete();
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<263>";
				this.f__fxFadeComplete=null;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<268>";
	if(this.f__fxShakeDuration>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<269>";
		this.f__fxShakeDuration-=bb_flxg_FlxG_Elapsed;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<270>";
		if(this.f__fxShakeDuration<=0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<271>";
			this.f__fxShakeOffset.m_Make(0.0,0.0);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<273>";
			if(this.f__fxShakeComplete!=null){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<274>";
				this.f__fxShakeComplete.m_OnShakeComplete();
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<275>";
				this.f__fxShakeComplete=null;
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<278>";
			if(this.f__fxShakeDirection==0 || this.f__fxShakeDirection==1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<279>";
				dbg_object(this.f__fxShakeOffset).f_x=(bb_flxg_FlxG_Random()*this.f__fxShakeIntensity*this.f__width*2.0-this.f__fxShakeIntensity*this.f__width)*this.f__zoom;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<282>";
			if(this.f__fxShakeDirection==0 || this.f__fxShakeDirection==2){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<283>";
				dbg_object(this.f__fxShakeOffset).f_y=(bb_flxg_FlxG_Random()*this.f__fxShakeIntensity*this.f__height*2.0-this.f__fxShakeIntensity*this.f__height)*this.f__zoom;
			}
		}
	}
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_Fill=function(t_color,t_blendAlpha){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<499>";
	if(t_blendAlpha){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<500>";
		this.f__fill.m_SetARGB(t_color);
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<502>";
		this.f__fill.m_SetRGB(t_color);
	}
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_DrawFX=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<507>";
	if(this.f__fxFlashAlpha>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<508>";
		var t_alphaComponent=.0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<510>";
		t_alphaComponent=(this.f__fxFlashColor>>24);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<511>";
		if(t_alphaComponent<=0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<511>";
			t_alphaComponent=255.0;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<512>";
		this.m_Fill((((t_alphaComponent*this.f__fxFlashAlpha)|0)<<24)+(this.f__fxFlashColor&16777215),true);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<515>";
	if(this.f__fxFadeAlpha>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<516>";
		var t_alphaComponent2=.0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<518>";
		t_alphaComponent2=(this.f__fxFadeColor>>24);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<519>";
		if(t_alphaComponent2<=0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<519>";
			t_alphaComponent2=255.0;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<520>";
		this.m_Fill((((t_alphaComponent2*this.f__fxFadeAlpha)|0)<<24)+(this.f__fxFadeColor&16777215),true);
	}
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_Lock=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<164>";
	if(this.f__clipped){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<165>";
		if(dbg_object(this.f__fxShakeOffset).f_x!=0.0 || dbg_object(this.f__fxShakeOffset).f_y!=0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<166>";
			bb_graphics_SetScissor(this.f__realX+dbg_object(this.f__fxShakeOffset).f_x*bb_flxg_FlxG__DeviceScaleFactorX,this.f__realY+dbg_object(this.f__fxShakeOffset).f_y*bb_flxg_FlxG__DeviceScaleFactorY,this.f__realWidth,this.f__realHeight);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<168>";
			bb_graphics_SetScissor(this.f__realX,this.f__realY,this.f__realWidth,this.f__realHeight);
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<172>";
	bb_graphics_PushMatrix();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<174>";
	bb_graphics_Translate(this.f__x+dbg_object(this.f__fxShakeOffset).f_x,this.f__y+dbg_object(this.f__fxShakeOffset).f_y);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<175>";
	bb_graphics_Scale(this.f__scaleX,this.f__scaleY);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<177>";
	if(this.f__clipped || dbg_object(this.f__bgColor).f_argb!=dbg_object(bb_flxg_FlxG__BgColor).f_argb){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<178>";
		bb_graphics_SetColor(dbg_object(this.f__bgColor).f_r,dbg_object(this.f__bgColor).f_g,dbg_object(this.f__bgColor).f_b);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<179>";
		bb_graphics_DrawRect(0.0,0.0,this.f__width,this.f__height);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<180>";
		bb_flxg_FlxG__LastDrawingColor=dbg_object(this.f__bgColor).f_argb;
	}
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_ID=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<525>";
	pop_err();
	return this.f__id;
}
bb_flxcamera_FlxCamera.prototype.m_Unlock=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<185>";
	if(dbg_object(this.f__fill).f_argb!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<186>";
		if(dbg_object(this.f__fill).f_argb!=bb_flxg_FlxG__LastDrawingColor){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<187>";
			bb_graphics_SetColor(dbg_object(this.f__fill).f_r,dbg_object(this.f__fill).f_g,dbg_object(this.f__fill).f_b);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<188>";
			bb_flxg_FlxG__LastDrawingColor=dbg_object(this.f__fill).f_argb;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<191>";
		if(bb_flxg_FlxG__LastDrawingAlpha!=dbg_object(this.f__fill).f_a){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<192>";
			bb_graphics_SetAlpha(dbg_object(this.f__fill).f_a);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<193>";
			bb_flxg_FlxG__LastDrawingAlpha=dbg_object(this.f__fill).f_a;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<196>";
		bb_graphics_DrawRect(0.0,0.0,this.f__width,this.f__height);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<199>";
	bb_graphics_PopMatrix();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<200>";
	this.f__fill.m_SetARGB(0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<202>";
	if(this.f__clipped){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<203>";
		bb_graphics_SetScissor(0.0,0.0,(bb_flxg_FlxG_DeviceWidth),(bb_flxg_FlxG_DeviceHeight));
	}
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_Color=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<472>";
	pop_err();
	return dbg_object(this.f__color).f_argb;
}
bb_flxcamera_FlxCamera.prototype.m_Color2=function(t_color){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<476>";
	this.f__color.m_SetRGB(t_color);
	pop_err();
}
bb_flxcamera_FlxCamera.prototype.m_Alpha=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<456>";
	pop_err();
	return this.f__alpha;
}
bb_flxcamera_FlxCamera.prototype.m_Alpha2=function(t_alpha){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxcamera.monkey<460>";
	this.f__alpha=t_alpha;
	pop_err();
}
function bb_stack_Stack(){
	Object.call(this);
	this.f_data=[];
	this.f_length=0;
}
function bb_stack_Stack_new(){
	push_err();
	pop_err();
	return this;
}
function bb_stack_Stack_new2(t_data){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<13>";
	dbg_object(this).f_data=t_data.slice(0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<14>";
	dbg_object(this).f_length=t_data.length;
	pop_err();
	return this;
}
bb_stack_Stack.prototype.m_Length=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<38>";
	pop_err();
	return this.f_length;
}
bb_stack_Stack.prototype.m_Get2=function(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<73>";
	var t_=dbg_array(this.f_data,t_index)[dbg_index];
	pop_err();
	return t_;
}
bb_stack_Stack.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<34>";
	this.f_length=0;
	pop_err();
	return 0;
}
bb_stack_Stack.prototype.m_Push=function(t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<52>";
	if(this.f_length==this.f_data.length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<53>";
		this.f_data=resize_object_array(this.f_data,this.f_length*2+10);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<55>";
	dbg_array(this.f_data,this.f_length)[dbg_index]=t_value
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<56>";
	this.f_length+=1;
	pop_err();
	return 0;
}
function bb_stack_Stack2(){
	Object.call(this);
	this.f_data=[];
	this.f_length=0;
}
function bb_stack_Stack2_new(){
	push_err();
	pop_err();
	return this;
}
function bb_stack_Stack2_new2(t_data){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<13>";
	dbg_object(this).f_data=t_data.slice(0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<14>";
	dbg_object(this).f_length=t_data.length;
	pop_err();
	return this;
}
bb_stack_Stack2.prototype.m_Length=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<38>";
	pop_err();
	return this.f_length;
}
bb_stack_Stack2.prototype.m_Get2=function(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<73>";
	var t_=dbg_array(this.f_data,t_index)[dbg_index];
	pop_err();
	return t_;
}
bb_stack_Stack2.prototype.m_Push2=function(t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<52>";
	if(this.f_length==this.f_data.length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<53>";
		this.f_data=resize_object_array(this.f_data,this.f_length*2+10);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<55>";
	dbg_array(this.f_data,this.f_length)[dbg_index]=t_value
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<56>";
	this.f_length+=1;
	pop_err();
	return 0;
}
function bb_debugpathdisplay_DebugPathDisplay(){
	bb_flxbasic_FlxBasic.call(this);
	this.f__paths=null;
}
bb_debugpathdisplay_DebugPathDisplay.prototype=extend_class(bb_flxbasic_FlxBasic);
function bb_debugpathdisplay_DebugPathDisplay_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<15>";
	bb_flxbasic_FlxBasic_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<16>";
	this.f__paths=bb_stack_Stack3_new.call(new bb_stack_Stack3);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<17>";
	this.f_active=false;
	pop_err();
	return this;
}
bb_debugpathdisplay_DebugPathDisplay.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<61>";
	pop_err();
	return "DebugPathDisplay";
}
var bb_debugpathdisplay_DebugPathDisplay_ClassObject;
bb_debugpathdisplay_DebugPathDisplay.prototype.m_Remove=function(t_path){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<44>";
	this.f__paths.m_RemoveEach(t_path);
	pop_err();
}
bb_debugpathdisplay_DebugPathDisplay.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<48>";
	var t_i=this.f__paths.m_Length()-1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<49>";
	var t_path=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<51>";
	while(t_i>=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<52>";
		t_path=this.f__paths.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<53>";
		if(t_path!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<53>";
			t_path.m_Destroy();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<54>";
		t_i-=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<57>";
	this.f__paths.m_Clear();
	pop_err();
}
bb_debugpathdisplay_DebugPathDisplay.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<21>";
	bb_flxbasic_FlxBasic.prototype.m_Destroy.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<22>";
	this.m_Clear();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<23>";
	this.f__paths=null;
	pop_err();
}
bb_debugpathdisplay_DebugPathDisplay.prototype.m_Draw=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<27>";
	if(!bb_flxg_FlxG_VisualDebug || this.f_ignoreDrawDebug){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<29>";
	var t_i=this.f__paths.m_Length()-1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<30>";
	var t_path=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<32>";
	while(t_i>=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<33>";
		t_path=this.f__paths.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<34>";
		if(t_path!=null && !dbg_object(t_path).f_ignoreDrawDebug){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<34>";
			t_path.m_DrawDebug(null);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<35>";
		t_i-=1;
	}
	pop_err();
}
function bb_flxpath_FlxPath(){
	Object.call(this);
	this.f_debugScrollFactor=null;
	this.f__point=null;
	this.f_nodes=null;
	this.f__debugNodeColor=null;
	this.f_ignoreDrawDebug=false;
	this.f_debugColor=0;
}
function bb_flxpath_FlxPath_Manager(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<213>";
	var t_=object_downcast((bb_flxg_FlxG_GetPlugin(bb_debugpathdisplay_DebugPathDisplay_ClassObject)),bb_debugpathdisplay_DebugPathDisplay);
	pop_err();
	return t_;
}
bb_flxpath_FlxPath.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<47>";
	var t_debugPathDisplay=bb_flxpath_FlxPath_Manager();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<48>";
	if(t_debugPathDisplay!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<48>";
		t_debugPathDisplay.m_Remove(this);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<50>";
	this.f_debugScrollFactor=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<51>";
	this.f__point=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<52>";
	this.f_nodes=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<53>";
	this.f__debugNodeColor=null;
	pop_err();
}
bb_flxpath_FlxPath.prototype.m_DrawDebug=function(t_camera){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<118>";
	if(this.f_nodes.m_Length()<=0){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<119>";
	if(t_camera==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<119>";
		t_camera=bb_flxg_FlxG_Camera;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<121>";
	var t_node=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<122>";
	var t_nextNode=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<123>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<124>";
	var t_l=this.f_nodes.m_Length();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<126>";
	var t_fromX=.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<127>";
	var t_fromY=.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<129>";
	while(t_i<t_l){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<130>";
		t_node=this.f_nodes.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<132>";
		dbg_object(this.f__point).f_x=dbg_object(t_node).f_x-((dbg_object(dbg_object(t_camera).f_scroll).f_x*dbg_object(this.f_debugScrollFactor).f_x)|0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<133>";
		dbg_object(this.f__point).f_y=dbg_object(t_node).f_y-((dbg_object(dbg_object(t_camera).f_scroll).f_y*dbg_object(this.f_debugScrollFactor).f_y)|0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<135>";
		if(dbg_object(this.f__point).f_x>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<136>";
			dbg_object(this.f__point).f_x=((dbg_object(this.f__point).f_x+0.0000001)|0);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<138>";
			dbg_object(this.f__point).f_x=((dbg_object(this.f__point).f_x-0.0000001)|0);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<141>";
		if(dbg_object(this.f__point).f_y>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<142>";
			dbg_object(this.f__point).f_y=((dbg_object(this.f__point).f_y+0.0000001)|0);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<144>";
			dbg_object(this.f__point).f_y=((dbg_object(this.f__point).f_y-0.0000001)|0);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<147>";
		var t_nodeSize=2;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<148>";
		if(t_i==0 || t_i==t_l-1){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<148>";
			t_nodeSize*=2;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<150>";
		if(this.f__debugNodeColor==null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<150>";
			this.f__debugNodeColor=bb_flxcolor_FlxColor_new.call(new bb_flxcolor_FlxColor,-1);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<151>";
		this.f__debugNodeColor.m_SetARGB(-1);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<153>";
		if(t_l>1){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<154>";
			if(t_i==0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<155>";
				this.f__debugNodeColor.m_SetARGB(-16715227);
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<157>";
				if(t_i==t_l-1){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<158>";
					this.f__debugNodeColor.m_SetARGB(-65518);
				}
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<162>";
		bb_graphics_SetAlpha(.5);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<164>";
		if(bb_flxg_FlxG__LastDrawingColor!=dbg_object(this.f__debugNodeColor).f_argb){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<165>";
			bb_graphics_SetColor(dbg_object(this.f__debugNodeColor).f_r,dbg_object(this.f__debugNodeColor).f_g,dbg_object(this.f__debugNodeColor).f_b);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<166>";
			bb_flxg_FlxG__LastDrawingColor=dbg_object(this.f__debugNodeColor).f_argb;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<169>";
		bb_graphics_DrawRect(dbg_object(this.f__point).f_x-(t_nodeSize)*0.5,dbg_object(this.f__point).f_y-(t_nodeSize)*0.5,(t_nodeSize),(t_nodeSize));
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<171>";
		if(t_i==t_l-1){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<171>";
			break;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<173>";
		var t_linealpha=.3;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<175>";
		t_nextNode=this.f_nodes.m_Get2(t_i+1);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<177>";
		this.f__debugNodeColor.m_SetARGB(this.f_debugColor);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<179>";
		bb_graphics_SetAlpha(t_linealpha);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<181>";
		if(bb_flxg_FlxG__LastDrawingColor!=dbg_object(this.f__debugNodeColor).f_argb){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<182>";
			bb_graphics_SetColor(dbg_object(this.f__debugNodeColor).f_r,dbg_object(this.f__debugNodeColor).f_g,dbg_object(this.f__debugNodeColor).f_b);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<183>";
			bb_flxg_FlxG__LastDrawingColor=dbg_object(this.f__debugNodeColor).f_argb;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<186>";
		t_fromX=dbg_object(this.f__point).f_x;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<187>";
		t_fromY=dbg_object(this.f__point).f_y;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<189>";
		dbg_object(this.f__point).f_x=dbg_object(t_nextNode).f_x-((dbg_object(dbg_object(t_camera).f_scroll).f_x*dbg_object(this.f_debugScrollFactor).f_x)|0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<190>";
		dbg_object(this.f__point).f_y=dbg_object(t_nextNode).f_y-((dbg_object(dbg_object(t_camera).f_scroll).f_y*dbg_object(this.f_debugScrollFactor).f_y)|0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<192>";
		if(dbg_object(this.f__point).f_x>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<193>";
			dbg_object(this.f__point).f_x=((dbg_object(this.f__point).f_x+0.0000001)|0);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<195>";
			dbg_object(this.f__point).f_x=((dbg_object(this.f__point).f_x-0.0000001)|0);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<198>";
		if(dbg_object(this.f__point).f_y>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<199>";
			dbg_object(this.f__point).f_y=((dbg_object(this.f__point).f_y+0.0000001)|0);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<201>";
			dbg_object(this.f__point).f_y=((dbg_object(this.f__point).f_y-0.0000001)|0);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<204>";
		bb_graphics_DrawLine(t_fromX,t_fromY,dbg_object(this.f__point).f_x,dbg_object(this.f__point).f_y);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<206>";
		t_i+=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpath.monkey<209>";
	bb_graphics_SetAlpha(1.0);
	pop_err();
}
function bb_stack_Stack3(){
	Object.call(this);
	this.f_data=[];
	this.f_length=0;
}
function bb_stack_Stack3_new(){
	push_err();
	pop_err();
	return this;
}
function bb_stack_Stack3_new2(t_data){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<13>";
	dbg_object(this).f_data=t_data.slice(0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<14>";
	dbg_object(this).f_length=t_data.length;
	pop_err();
	return this;
}
bb_stack_Stack3.prototype.m_Length=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<38>";
	pop_err();
	return this.f_length;
}
bb_stack_Stack3.prototype.m_Get2=function(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<73>";
	var t_=dbg_array(this.f_data,t_index)[dbg_index];
	pop_err();
	return t_;
}
bb_stack_Stack3.prototype.m_Equals=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<26>";
	var t_=t_lhs==t_rhs;
	pop_err();
	return t_;
}
bb_stack_Stack3.prototype.m_RemoveEach=function(t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<95>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<96>";
	while(t_i<this.f_length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<97>";
		if(!this.m_Equals(dbg_array(this.f_data,t_i)[dbg_index],t_value)){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<98>";
			t_i+=1;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<99>";
			continue;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<101>";
		var t_b=t_i;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<101>";
		var t_e=t_i+1;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<102>";
		while(t_e<this.f_length && this.m_Equals(dbg_array(this.f_data,t_e)[dbg_index],t_value)){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<103>";
			t_e+=1;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<105>";
		while(t_e<this.f_length){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<106>";
			dbg_array(this.f_data,t_b)[dbg_index]=dbg_array(this.f_data,t_e)[dbg_index]
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<107>";
			t_b+=1;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<108>";
			t_e+=1;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<110>";
		this.f_length-=t_e-t_b;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<111>";
		t_i+=1;
	}
	pop_err();
	return 0;
}
bb_stack_Stack3.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<34>";
	this.f_length=0;
	pop_err();
	return 0;
}
function bb_timermanager_TimerManager(){
	bb_flxbasic_FlxBasic.call(this);
	this.f__timers=null;
}
bb_timermanager_TimerManager.prototype=extend_class(bb_flxbasic_FlxBasic);
function bb_timermanager_TimerManager_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<15>";
	bb_flxbasic_FlxBasic_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<16>";
	this.f__timers=bb_stack_Stack4_new.call(new bb_stack_Stack4);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<17>";
	this.f_visible=false;
	pop_err();
	return this;
}
bb_timermanager_TimerManager.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<60>";
	pop_err();
	return "TimerManager";
}
var bb_timermanager_TimerManager_ClassObject;
bb_timermanager_TimerManager.prototype.m_Remove2=function(t_timer){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<43>";
	this.f__timers.m_RemoveEach2(t_timer);
	pop_err();
}
bb_timermanager_TimerManager.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<47>";
	var t_i=this.f__timers.m_Length()-1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<48>";
	var t_timer=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<50>";
	while(t_i>=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<51>";
		t_timer=this.f__timers.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<52>";
		if(t_timer!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<52>";
			t_timer.m_Destroy();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<53>";
		t_i-=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<56>";
	this.f__timers.m_Clear();
	pop_err();
}
bb_timermanager_TimerManager.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<21>";
	this.m_Clear();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<22>";
	this.f__timers=null;
	pop_err();
}
bb_timermanager_TimerManager.prototype.m_Update=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<26>";
	var t_i=this.f__timers.m_Length()-1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<27>";
	var t_timer=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<29>";
	while(t_i>=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<30>";
		t_timer=this.f__timers.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<31>";
		if(t_timer!=null && !dbg_object(t_timer).f_paused && !dbg_object(t_timer).f_finished && dbg_object(t_timer).f_time>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<32>";
			t_timer.m_Update();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<34>";
		t_i-=1;
	}
	pop_err();
}
function bb_flxtimer_FlxTimer(){
	Object.call(this);
	this.f_finished=false;
	this.f__callback=null;
	this.f_paused=false;
	this.f_time=.0;
	this.f__timeCounter=.0;
	this.f__loopsCounter=0;
	this.f_loops=0;
}
function bb_flxtimer_FlxTimer_Manager(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<97>";
	var t_=object_downcast((bb_flxg_FlxG_GetPlugin(bb_timermanager_TimerManager_ClassObject)),bb_timermanager_TimerManager);
	pop_err();
	return t_;
}
bb_flxtimer_FlxTimer.prototype.m_Stop=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<76>";
	this.f_finished=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<78>";
	var t_timerManger=bb_flxtimer_FlxTimer_Manager();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<79>";
	if(t_timerManger!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<79>";
		t_timerManger.m_Remove2(this);
	}
	pop_err();
}
bb_flxtimer_FlxTimer.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<38>";
	this.m_Stop();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<39>";
	this.f__callback=null;
	pop_err();
}
bb_flxtimer_FlxTimer.prototype.m_Update=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<43>";
	this.f__timeCounter+=bb_flxg_FlxG_Elapsed;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<45>";
	while(this.f__timeCounter>=this.f_time && !this.f_paused && !this.f_finished){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<46>";
		this.f__timeCounter-=this.f_time;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<48>";
		this.f__loopsCounter+=1;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<49>";
		if(this.f_loops>0 && this.f__loopsCounter>=this.f_loops){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<49>";
			this.m_Stop();
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<51>";
		if(this.f__callback!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtimer.monkey<51>";
			this.f__callback.m_OnTimerTick(this);
		}
	}
	pop_err();
}
function bb_stack_Stack4(){
	Object.call(this);
	this.f_data=[];
	this.f_length=0;
}
function bb_stack_Stack4_new(){
	push_err();
	pop_err();
	return this;
}
function bb_stack_Stack4_new2(t_data){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<13>";
	dbg_object(this).f_data=t_data.slice(0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<14>";
	dbg_object(this).f_length=t_data.length;
	pop_err();
	return this;
}
bb_stack_Stack4.prototype.m_Length=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<38>";
	pop_err();
	return this.f_length;
}
bb_stack_Stack4.prototype.m_Get2=function(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<73>";
	var t_=dbg_array(this.f_data,t_index)[dbg_index];
	pop_err();
	return t_;
}
bb_stack_Stack4.prototype.m_Equals2=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<26>";
	var t_=t_lhs==t_rhs;
	pop_err();
	return t_;
}
bb_stack_Stack4.prototype.m_RemoveEach2=function(t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<95>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<96>";
	while(t_i<this.f_length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<97>";
		if(!this.m_Equals2(dbg_array(this.f_data,t_i)[dbg_index],t_value)){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<98>";
			t_i+=1;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<99>";
			continue;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<101>";
		var t_b=t_i;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<101>";
		var t_e=t_i+1;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<102>";
		while(t_e<this.f_length && this.m_Equals2(dbg_array(this.f_data,t_e)[dbg_index],t_value)){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<103>";
			t_e+=1;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<105>";
		while(t_e<this.f_length){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<106>";
			dbg_array(this.f_data,t_b)[dbg_index]=dbg_array(this.f_data,t_e)[dbg_index]
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<107>";
			t_b+=1;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<108>";
			t_e+=1;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<110>";
		this.f_length-=t_e-t_b;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<111>";
		t_i+=1;
	}
	pop_err();
	return 0;
}
bb_stack_Stack4.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<34>";
	this.f_length=0;
	pop_err();
	return 0;
}
function bb_accel_Accel(){
	Object.call(this);
	this.f_x=.0;
	this.f_y=.0;
	this.f_z=.0;
}
function bb_accel_Accel_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<15>";
	this.f_x=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<16>";
	this.f_y=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<17>";
	this.f_z=0.0;
	pop_err();
	return this;
}
bb_accel_Accel.prototype.m_Reset=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<27>";
	this.f_x=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<28>";
	this.f_y=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<29>";
	this.f_z=0.0;
	pop_err();
}
bb_accel_Accel.prototype.m_PlaybackXYZ=function(t_record){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<41>";
	this.f_x=dbg_object(t_record).f_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<42>";
	this.f_y=dbg_object(t_record).f_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<43>";
	this.f_z=dbg_object(t_record).f_z;
	pop_err();
}
bb_accel_Accel.prototype.m_Update2=function(t_x,t_y,t_z){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<21>";
	dbg_object(this).f_x=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<22>";
	dbg_object(this).f_y=t_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<23>";
	dbg_object(this).f_z=t_z;
	pop_err();
}
bb_accel_Accel.prototype.m_RecordXYZ=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<33>";
	if(this.f_x==0.0 && this.f_y==0.0 && this.f_z==0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<34>";
		pop_err();
		return null;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/accel.monkey<37>";
	var t_=bb_xyzrecord_XYZRecord_new.call(new bb_xyzrecord_XYZRecord,this.f_x,this.f_y,this.f_z);
	pop_err();
	return t_;
}
function bb_input_Input(){
	Object.call(this);
	this.f__from=0;
	this.f__to=0;
}
var bb_input_Input__Map;
function bb_input_Input_new(t_fromKey,t_toKey){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<18>";
	if(dbg_array(bb_input_Input__Map,0)[dbg_index]==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<19>";
		var t_i=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<20>";
		var t_l=bb_input_Input__Map.length;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<22>";
		while(t_i<t_l){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<23>";
			dbg_array(bb_input_Input__Map,t_i)[dbg_index]=bb_input_InputState_new.call(new bb_input_InputState)
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<24>";
			t_i+=1;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<28>";
	this.f__from=t_fromKey;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<29>";
	this.f__to=t_toKey+1;
	pop_err();
	return this;
}
function bb_input_Input_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<8>";
	pop_err();
	return this;
}
bb_input_Input.prototype.m_Reset=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<63>";
	var t_i=this.f__from;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<64>";
	var t_is=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<66>";
	while(t_i<this.f__to){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<67>";
		t_is=dbg_array(bb_input_Input__Map,t_i)[dbg_index];
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<68>";
		dbg_object(t_is).f_current=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<69>";
		dbg_object(t_is).f_last=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<70>";
		t_i+=1;
	}
	pop_err();
}
bb_input_Input.prototype.m_Reset2=function(t_fromKey,t_toKey){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<75>";
	var t_i=t_fromKey;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<76>";
	var t_is=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<78>";
	while(t_i<t_toKey){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<79>";
		t_is=dbg_array(bb_input_Input__Map,t_i)[dbg_index];
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<80>";
		dbg_object(t_is).f_current=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<81>";
		dbg_object(t_is).f_last=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<82>";
		t_i+=1;
	}
	pop_err();
}
bb_input_Input.prototype.m_PlaybackKeys=function(t_record){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<139>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<140>";
	var t_l=t_record.m_Length();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<141>";
	var t_kr=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<143>";
	while(t_i<t_l){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<144>";
		t_kr=t_record.m_Get2(t_i);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<145>";
		dbg_object(dbg_array(bb_input_Input__Map,dbg_object(t_kr).f_code)[dbg_index]).f_current=dbg_object(t_kr).f_value;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<146>";
		t_i+=1;
	}
	pop_err();
}
bb_input_Input.prototype.m_Update=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<33>";
	var t_i=this.f__from;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<34>";
	var t_is=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<36>";
	while(t_i<this.f__to){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<37>";
		t_is=dbg_array(bb_input_Input__Map,t_i)[dbg_index];
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<39>";
		if((bb_input2_KeyDown(t_i))!=0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<40>";
			if(dbg_object(t_is).f_last<1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<41>";
				dbg_object(t_is).f_current=2;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<43>";
				dbg_object(t_is).f_current=1;
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<46>";
			if(dbg_object(t_is).f_last>0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<47>";
				dbg_object(t_is).f_current=-1;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<49>";
				dbg_object(t_is).f_current=0;
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<53>";
		dbg_object(t_is).f_last=dbg_object(t_is).f_current;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<54>";
		t_i+=1;
	}
	pop_err();
}
bb_input_Input.prototype.m_Update3=function(t_x,t_y){
	push_err();
	pop_err();
	return;
}
bb_input_Input.prototype.m_RecordKeys=function(t_data){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<119>";
	var t_i=this.f__from;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<120>";
	var t_is=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<122>";
	while(t_i<this.f__to){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<123>";
		t_is=dbg_array(bb_input_Input__Map,t_i)[dbg_index];
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<124>";
		t_i+=1;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<126>";
		if(dbg_object(t_is).f_current==0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<126>";
			continue;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<128>";
		if(t_data==null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<129>";
			t_data=bb_stack_Stack7_new.call(new bb_stack_Stack7);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<132>";
		t_data.m_Push3(bb_keyrecord_KeyRecord_new.call(new bb_keyrecord_KeyRecord,t_i-1,dbg_object(t_is).f_current));
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<135>";
	pop_err();
	return t_data;
}
function bb_keyboard_Keyboard(){
	bb_input_Input.call(this);
}
bb_keyboard_Keyboard.prototype=extend_class(bb_input_Input);
function bb_keyboard_Keyboard_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/keyboard.monkey<9>";
	bb_input_Input_new.call(this,8,222);
	pop_err();
	return this;
}
function bb_input_InputState(){
	Object.call(this);
	this.f_current=0;
	this.f_last=0;
}
function bb_input_InputState_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<181>";
	this.f_current=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/input.monkey<182>";
	this.f_last=0;
	pop_err();
	return this;
}
function bb_xydevice_XYDevice(){
	bb_input_Input.call(this);
	this.f_x=.0;
	this.f_y=.0;
	this.f_screenX=.0;
	this.f_screenY=.0;
	this.f__lastX=0;
	this.f__lastY=0;
	this.f__point=null;
	this.f__globalScreenPosition=null;
}
bb_xydevice_XYDevice.prototype=extend_class(bb_input_Input);
function bb_xydevice_XYDevice_new(t_fromKey,t_toKey){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<36>";
	bb_input_Input_new.call(this,t_fromKey,t_toKey);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<38>";
	this.f_x=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<39>";
	this.f_y=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<40>";
	this.f_screenX=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<41>";
	this.f_screenY=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<42>";
	this.f__lastX=-1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<43>";
	this.f__lastY=-1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<44>";
	this.f__point=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<45>";
	this.f__globalScreenPosition=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	pop_err();
	return this;
}
function bb_xydevice_XYDevice_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<15>";
	bb_input_Input_new2.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<15>";
	pop_err();
	return this;
}
bb_xydevice_XYDevice.prototype.m__UpdateXY=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<104>";
	var t_camera=bb_flxg_FlxG_Camera;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<106>";
	this.f_screenX=(dbg_object(this.f__globalScreenPosition).f_x-t_camera.m_X())/(t_camera.m_Zoom()*bb_flxg_FlxG__DeviceScaleFactorX);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<107>";
	this.f_screenY=(dbg_object(this.f__globalScreenPosition).f_y-t_camera.m_Y())/(t_camera.m_Zoom()*bb_flxg_FlxG__DeviceScaleFactorY);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<109>";
	dbg_object(this).f_x=this.f_screenX+dbg_object(dbg_object(t_camera).f_scroll).f_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<110>";
	dbg_object(this).f_y=this.f_screenY+dbg_object(dbg_object(t_camera).f_scroll).f_y;
	pop_err();
}
bb_xydevice_XYDevice.prototype.m_PlaybackXY=function(t_record){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<97>";
	dbg_object(this.f__globalScreenPosition).f_x=(dbg_object(t_record).f_x);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<98>";
	dbg_object(this.f__globalScreenPosition).f_y=(dbg_object(t_record).f_y);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<100>";
	this.m__UpdateXY();
	pop_err();
}
bb_xydevice_XYDevice.prototype.m_Update3=function(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<55>";
	bb_input_Input.prototype.m_Update.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<57>";
	dbg_object(this.f__globalScreenPosition).f_x=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<58>";
	dbg_object(this.f__globalScreenPosition).f_y=t_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<60>";
	this.m__UpdateXY();
	pop_err();
}
bb_xydevice_XYDevice.prototype.m_RecordXY=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<86>";
	if((this.f__lastX)==dbg_object(this.f__globalScreenPosition).f_x && (this.f__lastY)==dbg_object(this.f__globalScreenPosition).f_y){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<87>";
		pop_err();
		return null;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<90>";
	this.f__lastX=((dbg_object(this.f__globalScreenPosition).f_x)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<91>";
	this.f__lastY=((dbg_object(this.f__globalScreenPosition).f_y)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/xydevice.monkey<93>";
	var t_=bb_xyrecord_XYRecord_new.call(new bb_xyrecord_XYRecord,this.f__lastX,this.f__lastY);
	pop_err();
	return t_;
}
function bb_mouse_Mouse(){
	bb_xydevice_XYDevice.call(this);
	this.f__cursor=null;
}
bb_mouse_Mouse.prototype=extend_class(bb_xydevice_XYDevice);
function bb_mouse_Mouse_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<25>";
	bb_xydevice_XYDevice_new.call(this,1,3);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<27>";
	this.f__cursor=bb_mouse_FlxCursor_new.call(new bb_mouse_FlxCursor);
	pop_err();
	return this;
}
bb_mouse_Mouse.prototype.m_Draw=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<126>";
	if(!dbg_object(this.f__cursor).f_visible){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<128>";
	if(bb_flxg_FlxG__LastDrawingBlend!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<129>";
		bb_graphics_SetBlend(0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<130>";
		bb_flxg_FlxG__LastDrawingBlend=0;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<133>";
	if(bb_flxg_FlxG__LastDrawingColor!=-1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<134>";
		bb_graphics_SetColor(255.0,255.0,255.0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<135>";
		bb_flxg_FlxG__LastDrawingColor=-1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<138>";
	if(bb_flxg_FlxG__LastDrawingAlpha!=1.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<139>";
		bb_graphics_SetAlpha(1.0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<140>";
		bb_flxg_FlxG__LastDrawingAlpha=1.0;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<143>";
	bb_graphics_Translate(dbg_object(this.f__cursor).f_x,dbg_object(this.f__cursor).f_y);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<145>";
	bb_graphics_PushMatrix();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<146>";
	bb_graphics_Scale(dbg_object(this.f__cursor).f_scale*bb_flxg_FlxG_Camera.m_Zoom(),dbg_object(this.f__cursor).f_scale*bb_flxg_FlxG_Camera.m_Zoom());
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<147>";
	bb_graphics_DrawImage(dbg_object(this.f__cursor).f_pixels,0.0,0.0,0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<148>";
	bb_graphics_PopMatrix();
	pop_err();
}
bb_mouse_Mouse.prototype.m__UpdateXY=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<152>";
	dbg_object(this.f__cursor).f_x=dbg_object(this.f__globalScreenPosition).f_x/bb_flxg_FlxG__DeviceScaleFactorX;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<153>";
	dbg_object(this.f__cursor).f_y=dbg_object(this.f__globalScreenPosition).f_y/bb_flxg_FlxG__DeviceScaleFactorY;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<155>";
	bb_xydevice_XYDevice.prototype.m__UpdateXY.call(this);
	pop_err();
}
function bb_flxpoint_FlxPoint(){
	Object.call(this);
	this.f_x=.0;
	this.f_y=.0;
}
function bb_flxpoint_FlxPoint_new(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpoint.monkey<28>";
	dbg_object(this).f_x=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpoint.monkey<29>";
	dbg_object(this).f_y=t_y;
	pop_err();
	return this;
}
bb_flxpoint_FlxPoint.prototype.m_Make=function(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpoint.monkey<41>";
	dbg_object(this).f_x=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpoint.monkey<42>";
	dbg_object(this).f_y=t_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxpoint.monkey<43>";
	pop_err();
	return this;
}
function bb_mouse_FlxCursor(){
	bb_flxpoint_FlxPoint.call(this);
	this.f_pixels=null;
	this.f_scale=.0;
	this.f_visible=false;
}
bb_mouse_FlxCursor.prototype=extend_class(bb_flxpoint_FlxPoint);
function bb_mouse_FlxCursor_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<169>";
	bb_flxpoint_FlxPoint_new.call(this,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<171>";
	this.f_pixels=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<172>";
	this.f_scale=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/mouse.monkey<173>";
	this.f_visible=false;
	pop_err();
	return this;
}
function bb_joystick_Joystick(){
	bb_input_Input.call(this);
	this.f_unit=0;
	this.f__x=new_number_array(2);
	this.f__y=new_number_array(2);
	this.f__z=new_number_array(2);
}
bb_joystick_Joystick.prototype=extend_class(bb_input_Input);
function bb_joystick_Joystick_new(t_unit){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<21>";
	bb_input_Input_new.call(this,t_unit<<4|256,32|t_unit<<4|256);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<22>";
	dbg_object(this).f_unit=t_unit;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<24>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<26>";
	while(t_i<2){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<27>";
		dbg_array(this.f__x,t_i)[dbg_index]=0.0
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<28>";
		dbg_array(this.f__y,t_i)[dbg_index]=0.0
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<29>";
		dbg_array(this.f__z,t_i)[dbg_index]=0.0
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<31>";
		t_i+=1;
	}
	pop_err();
	return this;
}
function bb_joystick_Joystick_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<6>";
	bb_input_Input_new2.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<6>";
	pop_err();
	return this;
}
bb_joystick_Joystick.prototype.m_Reset=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<50>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<52>";
	while(t_i<2){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<53>";
		dbg_array(this.f__x,t_i)[dbg_index]=0.0
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<54>";
		dbg_array(this.f__y,t_i)[dbg_index]=0.0
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<55>";
		dbg_array(this.f__z,t_i)[dbg_index]=0.0
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<57>";
		t_i+=1;
	}
	pop_err();
}
bb_joystick_Joystick.prototype.m_PlaybackXYZ2=function(t_record){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<117>";
	var t_xyz=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<118>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<119>";
	var t_l=t_record.length;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<121>";
	while(t_i<t_l){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<122>";
		t_xyz=dbg_array(t_record,t_i)[dbg_index];
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<124>";
		dbg_array(this.f__x,t_i)[dbg_index]=dbg_object(t_xyz).f_x
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<125>";
		dbg_array(this.f__y,t_i)[dbg_index]=dbg_object(t_xyz).f_y
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<126>";
		dbg_array(this.f__z,t_i)[dbg_index]=dbg_object(t_xyz).f_z
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<128>";
		t_i+=1;
	}
	pop_err();
}
bb_joystick_Joystick.prototype.m_Update=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<36>";
	bb_input_Input.prototype.m_Update.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<38>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<40>";
	while(t_i<2){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<41>";
		dbg_array(this.f__x,t_i)[dbg_index]=bb_input2_JoyX(t_i,this.f_unit)
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<42>";
		dbg_array(this.f__y,t_i)[dbg_index]=bb_input2_JoyY(t_i,this.f_unit)
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<43>";
		dbg_array(this.f__z,t_i)[dbg_index]=bb_input2_JoyZ(t_i,this.f_unit)
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/joystick.monkey<45>";
		t_i+=1;
	}
	pop_err();
}
function bb_touch_Touch(){
	bb_xydevice_XYDevice.call(this);
	this.f_index=0;
}
bb_touch_Touch.prototype=extend_class(bb_xydevice_XYDevice);
function bb_touch_Touch_new(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/touch.monkey<10>";
	bb_xydevice_XYDevice_new.call(this,384+t_index,384+t_index);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/touch.monkey<11>";
	dbg_object(this).f_index=t_index;
	pop_err();
	return this;
}
function bb_touch_Touch_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/touch.monkey<5>";
	bb_xydevice_XYDevice_new2.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/input/touch.monkey<5>";
	pop_err();
	return this;
}
function bb_stack_Stack5(){
	Object.call(this);
	this.f_data=[];
	this.f_length=0;
}
function bb_stack_Stack5_new(){
	push_err();
	pop_err();
	return this;
}
function bb_stack_Stack5_new2(t_data){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<13>";
	dbg_object(this).f_data=t_data.slice(0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<14>";
	dbg_object(this).f_length=t_data.length;
	pop_err();
	return this;
}
bb_stack_Stack5.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<34>";
	this.f_length=0;
	pop_err();
	return 0;
}
function bb_flxreplay_FlxReplay(){
	Object.call(this);
	this.f_seed=.0;
	this.f_frame=0;
	this.f_frameCount=0;
	this.f_finished=false;
	this.f__frames=[];
	this.f__capacity=0;
	this.f__marker=0;
}
function bb_flxreplay_FlxReplay_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<30>";
	this.f_seed=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<31>";
	this.f_frame=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<32>";
	this.f_frameCount=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<33>";
	this.f_finished=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<34>";
	this.f__frames=[];
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<35>";
	this.f__capacity=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<36>";
	this.f__marker=0;
	pop_err();
	return this;
}
bb_flxreplay_FlxReplay.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<40>";
	if(this.f__frames.length==0){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<42>";
	var t_i=this.f_frameCount-1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<44>";
	while(t_i>=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<45>";
		dbg_array(this.f__frames,t_i)[dbg_index].m_Destroy();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<46>";
		t_i-=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<49>";
	this.f__frames=[];
	pop_err();
}
bb_flxreplay_FlxReplay.prototype.m__Init=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<281>";
	this.f__capacity=100;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<282>";
	this.f__frames=resize_object_array(this.f__frames,this.f__capacity);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<283>";
	this.f_frameCount=0;
	pop_err();
}
bb_flxreplay_FlxReplay.prototype.m_Rewind=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<274>";
	this.f__marker=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<275>";
	this.f_frame=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<276>";
	this.f_finished=false;
	pop_err();
}
bb_flxreplay_FlxReplay.prototype.m_Create2=function(t_seed){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<53>";
	this.m_Destroy();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<54>";
	this.m__Init();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<55>";
	dbg_object(this).f_seed=(t_seed);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<56>";
	this.m_Rewind();
	pop_err();
}
bb_flxreplay_FlxReplay.prototype.m_PlayNextFrame=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<225>";
	bb_flxg_FlxG_ResetInput();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<227>";
	if(this.f__marker>=this.f_frameCount){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<228>";
		this.f_finished=true;
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<232>";
	if(dbg_object(dbg_array(this.f__frames,this.f__marker)[dbg_index]).f_frame!=this.f_frame){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<233>";
		this.f_frame+=1;
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<237>";
	this.f_frame+=1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<239>";
	var t_fr=dbg_array(this.f__frames,this.f__marker)[dbg_index];
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<240>";
	this.f__marker+=1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<242>";
	if(dbg_object(t_fr).f_keys!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<242>";
		bb_flxg_FlxG_Keys.m_PlaybackKeys(dbg_object(t_fr).f_keys);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<243>";
	if(dbg_object(t_fr).f_mouse!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<243>";
		bb_flxg_FlxG_Mouse.m_PlaybackXY(dbg_object(t_fr).f_mouse);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<245>";
	if(dbg_object(t_fr).f_joystick!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<246>";
		var t_i=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<247>";
		var t_l=dbg_object(t_fr).f_joystick.m_Length();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<249>";
		while(t_i<t_l){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<250>";
			bb_flxg_FlxG_Joystick(t_i).m_PlaybackXYZ2(dbg_object(t_fr).f_joystick.m_Get2(t_i));
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<251>";
			t_i+=1;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<255>";
	if(dbg_object(t_fr).f_touch!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<256>";
		var t_i2=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<257>";
		var t_l2=bb_flxg_FlxG_TouchCount();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<258>";
		var t_tr=null;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<260>";
		while(t_i2<t_l2){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<261>";
			t_tr=dbg_object(t_fr).f_touch.m_Get2(t_i2);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<262>";
			if(t_tr==null){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<262>";
				break;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<264>";
			bb_flxg_FlxG_Touch(t_i2).m_PlaybackXY(t_tr);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<266>";
			t_i2+=1;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<270>";
	if(dbg_object(t_fr).f_accel!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<270>";
		bb_flxg_FlxG_Accel.m_PlaybackXYZ(dbg_object(t_fr).f_accel);
	}
	pop_err();
}
bb_flxreplay_FlxReplay.prototype.m_RecordFrame=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<106>";
	var t_accelRecord=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<107>";
	var t_joystickRecord=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<108>";
	var t_touchRecord=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<109>";
	var t_keysRecord=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<110>";
	var t_mouseRecord=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<113>";
	t_accelRecord=bb_flxg_FlxG_Accel.m_RecordXYZ();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<152>";
	if(!bb_flxg_FlxG_Mobile){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<153>";
		t_keysRecord=bb_flxg_FlxG_Keys.m_RecordKeys(t_keysRecord);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<196>";
	var t_touchXYRecord=bb_flxg_FlxG_Touch(0).m_RecordXY();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<198>";
	if(t_touchXYRecord!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<199>";
		if(t_touchRecord==null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<199>";
			t_touchRecord=bb_stack_Stack9_new.call(new bb_stack_Stack9);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<200>";
		t_touchRecord.m_Insert(0,t_touchXYRecord);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<203>";
	t_keysRecord=bb_flxg_FlxG_Touch(0).m_RecordKeys(t_keysRecord);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<206>";
	t_mouseRecord=bb_flxg_FlxG_Mouse.m_RecordXY();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<207>";
	t_keysRecord=bb_flxg_FlxG_Mouse.m_RecordKeys(t_keysRecord);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<209>";
	if(t_keysRecord==null && t_mouseRecord==null && t_joystickRecord==null && t_touchRecord==null && t_accelRecord==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<210>";
		this.f_frame+=1;
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<214>";
	dbg_array(this.f__frames,this.f_frameCount)[dbg_index]=(bb_framerecord_FrameRecord_new.call(new bb_framerecord_FrameRecord)).m_Create3(this.f_frame,t_keysRecord,t_mouseRecord,t_joystickRecord,t_touchRecord,t_accelRecord)
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<215>";
	this.f_frame+=1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<216>";
	this.f_frameCount+=1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<218>";
	if(this.f_frameCount>=this.f__capacity){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<219>";
		this.f__capacity*=2;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxreplay.monkey<220>";
		this.f__frames=resize_object_array(this.f__frames,this.f__capacity);
	}
	pop_err();
}
function bb_framerecord_FrameRecord(){
	Object.call(this);
	this.f_keys=null;
	this.f_mouse=null;
	this.f_joystick=null;
	this.f_touch=null;
	this.f_accel=null;
	this.f_frame=0;
}
bb_framerecord_FrameRecord.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<39>";
	this.f_keys=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<40>";
	this.f_mouse=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<41>";
	this.f_joystick=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<42>";
	this.f_touch=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<43>";
	this.f_accel=null;
	pop_err();
}
function bb_framerecord_FrameRecord_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<22>";
	this.f_frame=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<23>";
	this.f_keys=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<24>";
	this.f_mouse=null;
	pop_err();
	return this;
}
bb_framerecord_FrameRecord.prototype.m_Create3=function(t_frame,t_keys,t_mouse,t_joystick,t_touch,t_accel){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<28>";
	dbg_object(this).f_frame=t_frame;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<29>";
	dbg_object(this).f_keys=t_keys;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<30>";
	dbg_object(this).f_mouse=t_mouse;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<31>";
	dbg_object(this).f_joystick=t_joystick;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<32>";
	dbg_object(this).f_touch=t_touch;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<33>";
	dbg_object(this).f_accel=t_accel;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/framerecord.monkey<35>";
	pop_err();
	return this;
}
function bbMain(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<8>";
	bb_colortest2_Objects_new.call(new bb_colortest2_Objects);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/tests/color/colortest2.monkey<9>";
	pop_err();
	return 0;
}
function bb_graphics_Frame(){
	Object.call(this);
	this.f_x=0;
	this.f_y=0;
}
function bb_graphics_Frame_new(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<56>";
	dbg_object(this).f_x=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<57>";
	dbg_object(this).f_y=t_y;
	pop_err();
	return this;
}
function bb_graphics_Frame_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<51>";
	pop_err();
	return this;
}
function bb_graphics_LoadImage(t_path,t_frameCount,t_flags){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<277>";
	var t_=(bb_graphics_Image_new.call(new bb_graphics_Image)).m_Load(t_path,t_frameCount,t_flags);
	pop_err();
	return t_;
}
function bb_graphics_LoadImage2(t_path,t_frameWidth,t_frameHeight,t_frameCount,t_flags){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<281>";
	var t_atlas=(bb_graphics_Image_new.call(new bb_graphics_Image)).m_Load(t_path,1,0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<282>";
	if((t_atlas)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<282>";
		var t_=t_atlas.m_GrabImage(0,0,t_frameWidth,t_frameHeight,t_frameCount,t_flags);
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bb_graphics_SetFont(t_font,t_firstChar){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<552>";
	if(!((t_font)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<553>";
		if(!((dbg_object(bb_graphics_context).f_defaultFont)!=null)){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<554>";
			dbg_object(bb_graphics_context).f_defaultFont=bb_graphics_LoadImage("mojo_font.png",96,2);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<556>";
		t_font=dbg_object(bb_graphics_context).f_defaultFont;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<557>";
		t_firstChar=32;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<559>";
	dbg_object(bb_graphics_context).f_font=t_font;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<560>";
	dbg_object(bb_graphics_context).f_firstChar=t_firstChar;
	pop_err();
	return 0;
}
var bb_graphics_renderDevice;
function bb_graphics_SetMatrix(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<331>";
	dbg_object(bb_graphics_context).f_ix=t_ix;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<332>";
	dbg_object(bb_graphics_context).f_iy=t_iy;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<333>";
	dbg_object(bb_graphics_context).f_jx=t_jx;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<334>";
	dbg_object(bb_graphics_context).f_jy=t_jy;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<335>";
	dbg_object(bb_graphics_context).f_tx=t_tx;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<336>";
	dbg_object(bb_graphics_context).f_ty=t_ty;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<337>";
	dbg_object(bb_graphics_context).f_tformed=((t_ix!=1.0 || t_iy!=0.0 || t_jx!=0.0 || t_jy!=1.0 || t_tx!=0.0 || t_ty!=0.0)?1:0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<338>";
	dbg_object(bb_graphics_context).f_matDirty=1;
	pop_err();
	return 0;
}
function bb_graphics_SetMatrix2(t_m){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<327>";
	bb_graphics_SetMatrix(dbg_array(t_m,0)[dbg_index],dbg_array(t_m,1)[dbg_index],dbg_array(t_m,2)[dbg_index],dbg_array(t_m,3)[dbg_index],dbg_array(t_m,4)[dbg_index],dbg_array(t_m,5)[dbg_index]);
	pop_err();
	return 0;
}
function bb_graphics_SetColor(t_r,t_g,t_b){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<286>";
	dbg_object(bb_graphics_context).f_color_r=t_r;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<287>";
	dbg_object(bb_graphics_context).f_color_g=t_g;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<288>";
	dbg_object(bb_graphics_context).f_color_b=t_b;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<289>";
	dbg_object(bb_graphics_context).f_device.SetColor(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_graphics_SetAlpha(t_alpha){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<297>";
	dbg_object(bb_graphics_context).f_alpha=t_alpha;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<298>";
	dbg_object(bb_graphics_context).f_device.SetAlpha(t_alpha);
	pop_err();
	return 0;
}
function bb_graphics_SetBlend(t_blend){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<306>";
	dbg_object(bb_graphics_context).f_blend=t_blend;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<307>";
	dbg_object(bb_graphics_context).f_device.SetBlend(t_blend);
	pop_err();
	return 0;
}
function bb_graphics_DeviceWidth(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<269>";
	var t_=dbg_object(bb_graphics_context).f_device.Width();
	pop_err();
	return t_;
}
function bb_graphics_DeviceHeight(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<273>";
	var t_=dbg_object(bb_graphics_context).f_device.Height();
	pop_err();
	return t_;
}
function bb_graphics_SetScissor(t_x,t_y,t_width,t_height){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<315>";
	dbg_object(bb_graphics_context).f_scissor_x=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<316>";
	dbg_object(bb_graphics_context).f_scissor_y=t_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<317>";
	dbg_object(bb_graphics_context).f_scissor_width=t_width;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<318>";
	dbg_object(bb_graphics_context).f_scissor_height=t_height;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<319>";
	dbg_object(bb_graphics_context).f_device.SetScissor(((t_x)|0),((t_y)|0),((t_width)|0),((t_height)|0));
	pop_err();
	return 0;
}
function bb_graphics_BeginRender(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<254>";
	if(!((dbg_object(bb_graphics_context).f_device.Mode())!=0)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<254>";
		pop_err();
		return 0;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<255>";
	bb_graphics_renderDevice=dbg_object(bb_graphics_context).f_device;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<256>";
	dbg_object(bb_graphics_context).f_matrixSp=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<257>";
	bb_graphics_SetMatrix(1.0,0.0,0.0,1.0,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<258>";
	bb_graphics_SetColor(255.0,255.0,255.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<259>";
	bb_graphics_SetAlpha(1.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<260>";
	bb_graphics_SetBlend(0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<261>";
	bb_graphics_SetScissor(0.0,0.0,(bb_graphics_DeviceWidth()),(bb_graphics_DeviceHeight()));
	pop_err();
	return 0;
}
function bb_graphics_EndRender(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<265>";
	bb_graphics_renderDevice=null;
	pop_err();
	return 0;
}
function bb_flxassetsmanager_FlxAssetsManager(){
	Object.call(this);
}
var bb_flxassetsmanager_FlxAssetsManager__Fonts;
var bb_flxassetsmanager_FlxAssetsManager__Images;
var bb_flxassetsmanager_FlxAssetsManager__Sounds;
var bb_flxassetsmanager_FlxAssetsManager__Music;
var bb_flxassetsmanager_FlxAssetsManager__Cursors;
var bb_flxassetsmanager_FlxAssetsManager__Strings;
function bb_flxassetsmanager_FlxAssetsManager_Init(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<20>";
	bb_flxassetsmanager_FlxAssetsManager__Fonts=new_object_array(3);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<22>";
	var t_l=bb_flxassetsmanager_FlxAssetsManager__Fonts.length;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<23>";
	for(var t_i=0;t_i<t_l;t_i=t_i+1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<24>";
		dbg_array(bb_flxassetsmanager_FlxAssetsManager__Fonts,t_i)[dbg_index]=bb_map_StringMap2_new.call(new bb_map_StringMap2)
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<27>";
	bb_flxassetsmanager_FlxAssetsManager__Images=bb_map_StringMap3_new.call(new bb_map_StringMap3);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<28>";
	bb_flxassetsmanager_FlxAssetsManager__Sounds=bb_map_StringMap3_new.call(new bb_map_StringMap3);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<29>";
	bb_flxassetsmanager_FlxAssetsManager__Music=bb_map_StringMap3_new.call(new bb_map_StringMap3);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<30>";
	bb_flxassetsmanager_FlxAssetsManager__Cursors=bb_map_StringMap3_new.call(new bb_map_StringMap3);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<31>";
	bb_flxassetsmanager_FlxAssetsManager__Strings=bb_map_StringMap3_new.call(new bb_map_StringMap3);
	pop_err();
}
function bb_flxassetsmanager_FlxAssetsManager_AddFont(t_name,t_driver){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<35>";
	var t_font=dbg_array(bb_flxassetsmanager_FlxAssetsManager__Fonts,t_driver)[dbg_index].m_Get(t_name);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<36>";
	if(t_font!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<36>";
		pop_err();
		return t_font;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<38>";
	t_font=bb_flxfont_FlxFont_new.call(new bb_flxfont_FlxFont,t_name);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<39>";
	dbg_array(bb_flxassetsmanager_FlxAssetsManager__Fonts,t_driver)[dbg_index].m_Set2(t_name,t_font);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<41>";
	pop_err();
	return t_font;
}
function bb_flxassetsmanager_FlxAssetsManager_AddImage(t_name,t_path){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<57>";
	bb_flxassetsmanager_FlxAssetsManager__Images.m_Set3(t_name,t_path);
	pop_err();
}
function bb_flxassetsmanager_FlxAssetsManager_AddCursor(t_cursor,t_path){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<105>";
	bb_flxassetsmanager_FlxAssetsManager__Cursors.m_Set3(t_cursor,t_path);
	pop_err();
}
function bb_flxassetsmanager_FlxAssetsManager_AddSound(t_name,t_path){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<73>";
	bb_flxassetsmanager_FlxAssetsManager__Sounds.m_Set3(t_name,t_path);
	pop_err();
}
function bb_flxassetsmanager_FlxAssetsManager_GetMusicPath(t_name){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<97>";
	var t_=bb_flxassetsmanager_FlxAssetsManager__Music.m_Get(t_name);
	pop_err();
	return t_;
}
function bb_flxassetsmanager_FlxAssetsManager_GetSoundPath(t_name){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<81>";
	var t_=bb_flxassetsmanager_FlxAssetsManager__Sounds.m_Get(t_name);
	pop_err();
	return t_;
}
function bb_flxassetsmanager_FlxAssetsManager_GetImagePath(t_name){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxassetsmanager.monkey<65>";
	var t_=bb_flxassetsmanager_FlxAssetsManager__Images.m_Get(t_name);
	pop_err();
	return t_;
}
function bb_flxfont_FlxFont(){
	Object.call(this);
	this.f__name="";
	this.f__paths=null;
	this.f__minSize=65536;
	this.f__maxSize=-1;
}
function bb_flxfont_FlxFont_new(t_name){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxfont.monkey<12>";
	this.f__name=t_name;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxfont.monkey<13>";
	this.f__paths=bb_map_IntMap_new.call(new bb_map_IntMap);
	pop_err();
	return this;
}
function bb_flxfont_FlxFont_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxfont.monkey<3>";
	pop_err();
	return this;
}
bb_flxfont_FlxFont.prototype.m_MinSize=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxfont.monkey<21>";
	pop_err();
	return this.f__minSize;
}
bb_flxfont_FlxFont.prototype.m_MinSize2=function(t_size){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxfont.monkey<25>";
	this.f__minSize=bb_math_Min(this.f__minSize,t_size);
	pop_err();
}
bb_flxfont_FlxFont.prototype.m_MaxSize=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxfont.monkey<29>";
	pop_err();
	return this.f__maxSize;
}
bb_flxfont_FlxFont.prototype.m_MaxSize2=function(t_size){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxfont.monkey<33>";
	this.f__maxSize=bb_math_Max(this.f__maxSize,t_size);
	pop_err();
}
bb_flxfont_FlxFont.prototype.m_SetPath=function(t_size,t_path){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxfont.monkey<37>";
	this.f__paths.m_Set4(t_size,t_path);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxfont.monkey<39>";
	this.m_MinSize2(t_size);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxfont.monkey<40>";
	this.m_MaxSize2(t_size);
	pop_err();
}
function bb_map_Map2(){
	Object.call(this);
	this.f_root=null;
}
function bb_map_Map2_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
bb_map_Map2.prototype.m_Compare=function(t_lhs,t_rhs){
}
bb_map_Map2.prototype.m_FindNode=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<157>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<160>";
		var t_cmp=this.m_Compare(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
bb_map_Map2.prototype.m_Get=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<101>";
	var t_node=this.m_FindNode(t_key);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<102>";
	if((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<102>";
		pop_err();
		return dbg_object(t_node).f_value;
	}
	pop_err();
	return null;
}
bb_map_Map2.prototype.m_RotateLeft2=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<252>";
	dbg_object(t_node).f_right=dbg_object(t_child).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).f_left)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).f_left).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<256>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<264>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<266>";
	dbg_object(t_child).f_left=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<267>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map2.prototype.m_RotateRight2=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<272>";
	dbg_object(t_node).f_left=dbg_object(t_child).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).f_right)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).f_right).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<276>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<284>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<286>";
	dbg_object(t_child).f_right=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<287>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map2.prototype.m_InsertFixup2=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).f_parent)!=null) && dbg_object(dbg_object(t_node).f_parent).f_color==-1 && ((dbg_object(dbg_object(t_node).f_parent).f_parent)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).f_parent==dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_right;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<223>";
					this.m_RotateLeft2(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<227>";
				this.m_RotateRight2(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<239>";
					this.m_RotateRight2(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<243>";
				this.m_RotateLeft2(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<247>";
	dbg_object(this.f_root).f_color=1;
	pop_err();
	return 0;
}
bb_map_Map2.prototype.m_Set2=function(t_key,t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<29>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<34>";
		t_cmp=this.m_Compare(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<40>";
				dbg_object(t_node).f_value=t_value;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<45>";
	t_node=bb_map_Node2_new.call(new bb_map_Node2,t_key,t_value,-1,t_parent);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).f_right=t_node;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).f_left=t_node;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<53>";
		this.m_InsertFixup2(t_node);
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<55>";
		this.f_root=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
function bb_map_StringMap2(){
	bb_map_Map2.call(this);
}
bb_map_StringMap2.prototype=extend_class(bb_map_Map2);
function bb_map_StringMap2_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<551>";
	bb_map_Map2_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
bb_map_StringMap2.prototype.m_Compare=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<554>";
	var t_=string_compare(t_lhs,t_rhs);
	pop_err();
	return t_;
}
function bb_flxobject_FlxObject(){
	bb_flxbasic_FlxBasic.call(this);
	this.f_x=.0;
	this.f_y=.0;
	this.f_width=.0;
	this.f_height=.0;
	this.f_last=null;
	this.f_mass=.0;
	this.f_elasticity=.0;
	this.f_health=.0;
	this.f_immovable=false;
	this.f_moves=false;
	this.f_touching=0;
	this.f_wasTouching=0;
	this.f_allowCollisions=0;
	this.f_velocity=null;
	this.f_acceleration=null;
	this.f_drag=null;
	this.f_maxVelocity=null;
	this.f_angle=.0;
	this.f_angularVelocity=.0;
	this.f_angularAcceleration=.0;
	this.f_angularDrag=.0;
	this.f_maxAngular=.0;
	this.f_scrollFactor=null;
	this.f__flicker=false;
	this.f__flickerTimer=.0;
	this.f__point=null;
	this.f__rect=null;
	this.f_path=null;
	this.f_pathSpeed=.0;
	this.f_pathAngle=.0;
	this.f__debugBoundingBoxColor=null;
	this.f__pathNodeIndex=0;
	this.f__pathMode=0;
	this.f__pathInc=0;
	this.f__pathRotate=false;
}
bb_flxobject_FlxObject.prototype=extend_class(bb_flxbasic_FlxBasic);
bb_flxobject_FlxObject.prototype.m_GetMidpoint=function(t_point){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<510>";
	if(t_point==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<510>";
		t_point=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<511>";
	dbg_object(t_point).f_x=this.f_x+this.f_width*.5;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<512>";
	dbg_object(t_point).f_y=this.f_y+this.f_height*.5;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<513>";
	pop_err();
	return t_point;
}
function bb_flxobject_FlxObject_new(t_x,t_y,t_width,t_height){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<171>";
	bb_flxbasic_FlxBasic_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<172>";
	dbg_object(this).f_x=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<173>";
	dbg_object(this).f_y=t_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<174>";
	this.f_last=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,t_x,t_y);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<175>";
	dbg_object(this).f_width=t_width;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<176>";
	dbg_object(this).f_height=t_height;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<177>";
	this.f_mass=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<178>";
	this.f_elasticity=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<180>";
	this.f_health=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<182>";
	this.f_immovable=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<183>";
	this.f_moves=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<185>";
	this.f_touching=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<186>";
	this.f_wasTouching=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<187>";
	this.f_allowCollisions=15;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<189>";
	this.f_velocity=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<190>";
	this.f_acceleration=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<191>";
	this.f_drag=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<192>";
	this.f_maxVelocity=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,10000.0,10000.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<194>";
	this.f_angle=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<195>";
	this.f_angularVelocity=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<196>";
	this.f_angularAcceleration=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<197>";
	this.f_angularDrag=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<198>";
	this.f_maxAngular=10000.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<200>";
	this.f_scrollFactor=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,1.0,1.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<201>";
	this.f__flicker=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<202>";
	this.f__flickerTimer=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<204>";
	this.f__point=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<205>";
	this.f__rect=bb_flxrect_FlxRect_new.call(new bb_flxrect_FlxRect,0.0,0.0,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<207>";
	this.f_path=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<208>";
	this.f_pathSpeed=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<209>";
	this.f_pathAngle=0.0;
	pop_err();
	return this;
}
bb_flxobject_FlxObject.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<213>";
	this.f_velocity=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<214>";
	this.f_acceleration=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<215>";
	this.f_drag=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<216>";
	this.f_maxVelocity=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<217>";
	this.f_scrollFactor=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<218>";
	this.f__point=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<219>";
	this.f__rect=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<220>";
	this.f_last=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<221>";
	this.f__cameras=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<222>";
	if(this.f_path!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<222>";
		this.f_path.m_Destroy();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<223>";
	this.f_path=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<224>";
	this.f__debugBoundingBoxColor=null;
	pop_err();
}
bb_flxobject_FlxObject.prototype.m__AdvancePath=function(t_snap){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<750>";
	if(t_snap){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<751>";
		var t_oldNode=dbg_object(this.f_path).f_nodes.m_Get2(this.f__pathNodeIndex);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<752>";
		if(t_oldNode!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<753>";
			if((this.f__pathMode&32)==0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<754>";
				this.f_x=dbg_object(t_oldNode).f_x-this.f_width*.5;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<757>";
			if((this.f__pathMode&16)==0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<758>";
				this.f_y=dbg_object(t_oldNode).f_y-this.f_height*.5;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<763>";
	this.f__pathNodeIndex+=this.f__pathInc;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<765>";
	if((this.f__pathMode&1)>0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<766>";
		if(this.f__pathNodeIndex<0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<767>";
			this.f__pathNodeIndex=0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<768>";
			this.f_pathSpeed=0.0;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<771>";
		if((this.f__pathMode&2)>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<772>";
			if(this.f__pathNodeIndex>=dbg_object(this.f_path).f_nodes.m_Length()){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<773>";
				this.f__pathNodeIndex=0;
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<776>";
			if((this.f__pathMode&4)>0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<777>";
				if(this.f__pathNodeIndex<0){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<778>";
					this.f__pathNodeIndex=dbg_object(this.f_path).f_nodes.m_Length()-1;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<779>";
					if(this.f__pathNodeIndex<0){
						err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<779>";
						this.f__pathNodeIndex=0;
					}
				}
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<782>";
				if((this.f__pathMode&8)>0){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<783>";
					if(this.f__pathInc>0){
						err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<784>";
						if(this.f__pathNodeIndex>=dbg_object(this.f_path).f_nodes.m_Length()){
							err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<785>";
							this.f__pathNodeIndex=dbg_object(this.f_path).f_nodes.m_Length()-2;
							err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<787>";
							if(this.f__pathNodeIndex<0){
								err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<787>";
								this.f__pathNodeIndex=0;
							}
							err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<788>";
							this.f__pathInc=-this.f__pathInc;
						}
					}else{
						err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<791>";
						if(this.f__pathNodeIndex<0){
							err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<792>";
							this.f__pathNodeIndex=1;
							err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<793>";
							if(this.f__pathNodeIndex>=dbg_object(this.f_path).f_nodes.m_Length()){
								err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<794>";
								this.f__pathNodeIndex=dbg_object(this.f_path).f_nodes.m_Length()-1;
							}
							err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<797>";
							if(this.f__pathNodeIndex<0){
								err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<797>";
								this.f__pathNodeIndex=0;
							}
							err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<798>";
							this.f__pathInc=-this.f__pathInc;
						}
					}
				}else{
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<802>";
					if(this.f__pathNodeIndex>=dbg_object(this.f_path).f_nodes.m_Length()){
						err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<803>";
						this.f__pathNodeIndex=dbg_object(this.f_path).f_nodes.m_Length()-1;
						err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<804>";
						this.f_pathSpeed=0.0;
					}
				}
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<808>";
	var t_=dbg_object(this.f_path).f_nodes.m_Get2(this.f__pathNodeIndex);
	pop_err();
	return t_;
}
bb_flxobject_FlxObject.prototype.m__UpdatePathMotion=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<812>";
	dbg_object(this.f__point).f_x=this.f_x+this.f_width*.5;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<813>";
	dbg_object(this.f__point).f_y=this.f_y+this.f_height*.5;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<815>";
	var t_node=dbg_object(this.f_path).f_nodes.m_Get2(this.f__pathNodeIndex);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<816>";
	var t_deltaX=dbg_object(t_node).f_x-dbg_object(this.f__point).f_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<817>";
	var t_deltaY=dbg_object(t_node).f_y-dbg_object(this.f__point).f_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<819>";
	var t_horizontalOnly=(this.f__pathMode&16)>0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<820>";
	var t_verticalOnly=(this.f__pathMode&32)>0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<822>";
	if(t_horizontalOnly){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<823>";
		if(bb_math_Abs2(t_deltaX)<this.f_pathSpeed*bb_flxg_FlxG_Elapsed){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<823>";
			t_node=this.m__AdvancePath(true);
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<825>";
		if(t_verticalOnly){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<826>";
			if(bb_math_Abs2(t_deltaY)<this.f_pathSpeed*bb_flxg_FlxG_Elapsed){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<826>";
				t_node=this.m__AdvancePath(true);
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<829>";
			if(Math.sqrt(t_deltaX*t_deltaX+t_deltaY*t_deltaY)<this.f_pathSpeed*bb_flxg_FlxG_Elapsed){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<830>";
				t_node=this.m__AdvancePath(true);
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<834>";
	if(this.f_pathSpeed!=0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<835>";
		dbg_object(this.f__point).f_x=this.f_x+this.f_width*.5;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<836>";
		dbg_object(this.f__point).f_y=this.f_y+this.f_height*.5;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<837>";
		if(t_horizontalOnly || dbg_object(this.f__point).f_y==dbg_object(t_node).f_y){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<838>";
			if(dbg_object(this.f__point).f_x<dbg_object(t_node).f_x){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<839>";
				dbg_object(this.f_velocity).f_x=this.f_pathSpeed;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<841>";
				dbg_object(this.f_velocity).f_x=-this.f_pathSpeed;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<844>";
			if(dbg_object(this.f_velocity).f_x<0.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<845>";
				this.f_pathAngle=-90.0;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<847>";
				this.f_pathAngle=90.0;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<850>";
			if(!t_horizontalOnly){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<850>";
				dbg_object(this.f_velocity).f_y=0.0;
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<852>";
			if(t_verticalOnly || dbg_object(this.f__point).f_x==dbg_object(t_node).f_x){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<853>";
				if(dbg_object(this.f__point).f_y<dbg_object(t_node).f_y){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<854>";
					dbg_object(this.f_velocity).f_y=this.f_pathSpeed;
				}else{
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<856>";
					dbg_object(this.f_velocity).f_y=-this.f_pathSpeed;
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<859>";
				if(dbg_object(this.f_velocity).f_y<0.0){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<860>";
					this.f_pathAngle=0.0;
				}else{
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<862>";
					this.f_pathAngle=180.0;
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<865>";
				if(!t_verticalOnly){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<865>";
					dbg_object(this.f_velocity).f_x=0.0;
				}
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<868>";
				this.f_pathAngle=bb_flxu_FlxU_GetAngle(this.f__point,t_node);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<869>";
				bb_flxu_FlxU_RotatePoint(0.0,this.f_pathSpeed,0.0,0.0,this.f_pathAngle,this.f_velocity);
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<872>";
		if(this.f__pathRotate){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<873>";
			this.f_angularVelocity=0.0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<874>";
			this.f_angularAcceleration=0.0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<875>";
			this.f_angle=this.f_pathAngle;
		}
	}
	pop_err();
}
bb_flxobject_FlxObject.prototype.m_PreUpdate=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<228>";
	bb_flxbasic_FlxBasic__ActiveCount+=1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<230>";
	if(this.f__flickerTimer!=0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<231>";
		if(this.f__flickerTimer>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<232>";
			this.f__flickerTimer-=bb_flxg_FlxG_Elapsed;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<233>";
			if(this.f__flickerTimer<=0.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<234>";
				this.f__flickerTimer=0.0;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<235>";
				this.f__flicker=false;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<240>";
	dbg_object(this.f_last).f_x=this.f_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<241>";
	dbg_object(this.f_last).f_y=this.f_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<243>";
	if(this.f_path!=null && this.f_pathSpeed!=0.0 && dbg_object(this.f_path).f_nodes.m_Get2(this.f__pathNodeIndex)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<244>";
		this.m__UpdatePathMotion();
	}
	pop_err();
}
bb_flxobject_FlxObject.prototype.m__UpdateMotion=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<728>";
	var t_delta=.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<729>";
	var t_velocityDelta=.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<731>";
	t_velocityDelta=(bb_flxu_FlxU_ComputeVelocity(this.f_angularVelocity,this.f_angularAcceleration,this.f_angularDrag,this.f_maxAngular)-this.f_angularVelocity)/2.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<732>";
	this.f_angularVelocity+=t_velocityDelta;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<733>";
	this.f_angle+=this.f_angularVelocity*bb_flxg_FlxG_Elapsed;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<734>";
	this.f_angularVelocity+=t_velocityDelta;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<736>";
	t_velocityDelta=(bb_flxu_FlxU_ComputeVelocity(dbg_object(this.f_velocity).f_x,dbg_object(this.f_acceleration).f_x,dbg_object(this.f_drag).f_x,dbg_object(this.f_maxVelocity).f_x)-dbg_object(this.f_velocity).f_x)/2.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<737>";
	dbg_object(this.f_velocity).f_x+=t_velocityDelta;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<738>";
	t_delta=dbg_object(this.f_velocity).f_x*bb_flxg_FlxG_Elapsed;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<739>";
	dbg_object(this.f_velocity).f_x+=t_velocityDelta;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<740>";
	this.f_x+=t_delta;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<742>";
	t_velocityDelta=(bb_flxu_FlxU_ComputeVelocity(dbg_object(this.f_velocity).f_y,dbg_object(this.f_acceleration).f_y,dbg_object(this.f_drag).f_y,dbg_object(this.f_maxVelocity).f_y)-dbg_object(this.f_velocity).f_y)/2.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<743>";
	dbg_object(this.f_velocity).f_y+=t_velocityDelta;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<744>";
	t_delta=dbg_object(this.f_velocity).f_y*bb_flxg_FlxG_Elapsed;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<745>";
	dbg_object(this.f_velocity).f_y+=t_velocityDelta;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<746>";
	this.f_y+=t_delta;
	pop_err();
}
bb_flxobject_FlxObject.prototype.m_PostUpdate=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<249>";
	if(this.f_moves){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<249>";
		this.m__UpdateMotion();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<251>";
	this.f_wasTouching=this.f_touching;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<252>";
	this.f_touching=0;
	pop_err();
}
bb_flxobject_FlxObject.prototype.m_GetScreenXY=function(t_point,t_camera){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<467>";
	if(t_point==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<467>";
		t_point=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<468>";
	if(t_camera==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<468>";
		t_camera=bb_flxg_FlxG_Camera;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<470>";
	dbg_object(t_point).f_x=this.f_x-((dbg_object(dbg_object(t_camera).f_scroll).f_x*dbg_object(this.f_scrollFactor).f_x)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<471>";
	dbg_object(t_point).f_y=this.f_y-((dbg_object(dbg_object(t_camera).f_scroll).f_y*dbg_object(this.f_scrollFactor).f_y)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<473>";
	if(dbg_object(t_point).f_x>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<474>";
		dbg_object(t_point).f_x+=0.0000001;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<476>";
		dbg_object(t_point).f_x-=0.0000001;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<479>";
	if(dbg_object(t_point).f_y>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<480>";
		dbg_object(t_point).f_y+=0.0000001;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<482>";
		dbg_object(t_point).f_y-=0.0000001;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<485>";
	pop_err();
	return t_point;
}
bb_flxobject_FlxObject.prototype.m_OnScreen=function(t_camera){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<460>";
	if(t_camera==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<460>";
		t_camera=bb_flxg_FlxG_Camera;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<462>";
	this.m_GetScreenXY(this.f__point,t_camera);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<463>";
	var t_=dbg_object(this.f__point).f_x+this.f_width>0.0 && dbg_object(this.f__point).f_x<t_camera.m_Width() && dbg_object(this.f__point).f_y+this.f_height>0.0 && dbg_object(this.f__point).f_y<t_camera.m_Height();
	pop_err();
	return t_;
}
bb_flxobject_FlxObject.prototype.m_DrawDebug=function(t_camera){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<264>";
	if(t_camera==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<264>";
		t_camera=bb_flxg_FlxG_Camera;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<266>";
	var t_boundingBoxX=this.f_x-((dbg_object(dbg_object(t_camera).f_scroll).f_x*dbg_object(this.f_scrollFactor).f_x)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<267>";
	var t_boundingBoxY=this.f_y-((dbg_object(dbg_object(t_camera).f_scroll).f_y*dbg_object(this.f_scrollFactor).f_y)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<269>";
	if(t_boundingBoxX>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<270>";
		t_boundingBoxX+=0.0000001;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<272>";
		t_boundingBoxX-=0.0000001;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<275>";
	if(t_boundingBoxY>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<276>";
		t_boundingBoxY+=0.0000001;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<278>";
		t_boundingBoxY-=0.0000001;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<281>";
	var t_boundingBoxWidth=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<282>";
	var t_boundingBoxHeight=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<284>";
	if(this.f_width!=((this.f_width)|0)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<285>";
		t_boundingBoxWidth=((this.f_width)|0);
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<287>";
		t_boundingBoxWidth=((this.f_width-1.0)|0);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<290>";
	if(this.f_height!=((this.f_height)|0)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<291>";
		t_boundingBoxHeight=((this.f_height)|0);
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<293>";
		t_boundingBoxHeight=((this.f_height-1.0)|0);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<296>";
	if(this.f__debugBoundingBoxColor==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<296>";
		this.f__debugBoundingBoxColor=bb_flxcolor_FlxColor_new.call(new bb_flxcolor_FlxColor,-1);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<297>";
	if((this.f_allowCollisions)!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<298>";
		if(this.f_allowCollisions!=15){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<299>";
			this.f__debugBoundingBoxColor.m_SetARGB(-1040641);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<300>";
			if(this.f_immovable){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<301>";
				this.f__debugBoundingBoxColor.m_SetARGB(-16715227);
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<303>";
				this.f__debugBoundingBoxColor.m_SetARGB(-65518);
			}
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<306>";
		this.f__debugBoundingBoxColor.m_SetARGB(-16740119);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<309>";
	bb_graphics_SetAlpha(.5);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<311>";
	if(bb_flxg_FlxG__LastDrawingColor!=dbg_object(this.f__debugBoundingBoxColor).f_argb){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<312>";
		bb_graphics_SetColor(dbg_object(this.f__debugBoundingBoxColor).f_r,dbg_object(this.f__debugBoundingBoxColor).f_g,dbg_object(this.f__debugBoundingBoxColor).f_b);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<313>";
		bb_flxg_FlxG__LastDrawingColor=dbg_object(this.f__debugBoundingBoxColor).f_argb;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<316>";
	bb_graphics_DrawLine(t_boundingBoxX,t_boundingBoxY,t_boundingBoxX+(t_boundingBoxWidth),t_boundingBoxY);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<317>";
	bb_graphics_DrawLine(t_boundingBoxX+(t_boundingBoxWidth),t_boundingBoxY,t_boundingBoxX+(t_boundingBoxWidth),t_boundingBoxY+(t_boundingBoxHeight));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<318>";
	bb_graphics_DrawLine(t_boundingBoxX+(t_boundingBoxWidth),t_boundingBoxY+(t_boundingBoxHeight),t_boundingBoxX,t_boundingBoxY+(t_boundingBoxHeight));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<319>";
	bb_graphics_DrawLine(t_boundingBoxX,t_boundingBoxY+(t_boundingBoxHeight),t_boundingBoxX,t_boundingBoxY);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<321>";
	bb_graphics_SetAlpha(1.0);
	pop_err();
}
bb_flxobject_FlxObject.prototype.m_Draw=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<256>";
	if(this.f__cameras!=null && !this.f__cameras.m_Contains(bb_flxg_FlxG__CurrentCamera.m_ID())){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<257>";
	if(!this.m_OnScreen(bb_flxg_FlxG__CurrentCamera)){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<259>";
	bb_flxbasic_FlxBasic__VisibleCount+=1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<260>";
	if(bb_flxg_FlxG_VisualDebug && !this.f_ignoreDrawDebug){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<260>";
		this.m_DrawDebug(bb_flxg_FlxG__CurrentCamera);
	}
	pop_err();
}
bb_flxobject_FlxObject.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxobject.monkey<723>";
	pop_err();
	return "FlxObject";
}
function bb_flxsprite_FlxSprite(){
	bb_flxobject_FlxObject.call(this);
	this.f_offset=null;
	this.f_origin=null;
	this.f_scale=null;
	this.f__alpha=.0;
	this.f__color=null;
	this.f_blend=0;
	this.f_finished=false;
	this.f__facing=0;
	this.f__animations=null;
	this.f__flipped=false;
	this.f__curAnim=null;
	this.f__curFrame=0;
	this.f__curIndex=0;
	this.f__frameTimer=.0;
	this.f__callback=null;
	this.f__surfaceColor=null;
	this.f__mixedColor=null;
	this.f__bakedRotation=.0;
	this.f__pixels=null;
	this.f_frameWidth=0;
	this.f_frameHeight=0;
	this.f__halfWidth=.0;
	this.f__halfHeight=.0;
	this.f_frames=0;
	this.f__camera=null;
	this.f_dirty=false;
	this.f__flipNeeded=false;
	this.f__matrix=new_number_array(6);
}
bb_flxsprite_FlxSprite.prototype=extend_class(bb_flxobject_FlxObject);
var bb_flxsprite_FlxSprite__GraphicLoader;
bb_flxsprite_FlxSprite.prototype.m__ResetHelpers=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<514>";
	this.f__halfWidth=(this.f_frameWidth)*.5;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<515>";
	this.f__halfHeight=(this.f_frameHeight)*.5;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<516>";
	this.f_origin.m_Make(this.f__halfWidth,this.f__halfHeight);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<518>";
	if(this.f__pixels!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<519>";
		this.f_frames=this.f__pixels.m_Frames();
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<521>";
		this.f_frames=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<524>";
	this.f__curIndex=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<525>";
	this.f__mixedColor.m_SetARGB(-1);
	pop_err();
}
bb_flxsprite_FlxSprite.prototype.m_LoadGraphic=function(t_graphic,t_animated,t_reverse,t_width,t_height,t_unique){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<131>";
	this.f__bakedRotation=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<133>";
	dbg_object(bb_flxsprite_FlxSprite__GraphicLoader).f_name=t_graphic;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<134>";
	dbg_object(bb_flxsprite_FlxSprite__GraphicLoader).f_animated=t_animated;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<135>";
	dbg_object(bb_flxsprite_FlxSprite__GraphicLoader).f_width=(t_width);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<136>";
	dbg_object(bb_flxsprite_FlxSprite__GraphicLoader).f_height=(t_height);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<138>";
	this.f__pixels=bb_flxg_FlxG_AddBitmap(t_graphic,(bb_flxsprite_FlxSprite__GraphicLoader),t_unique,"");
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<140>";
	this.f__flipped=t_reverse;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<142>";
	dbg_object(this).f_width=(this.f__pixels.m_Width());
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<143>";
	this.f_frameWidth=((dbg_object(this).f_width)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<145>";
	dbg_object(this).f_height=(this.f__pixels.m_Height());
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<146>";
	this.f_frameHeight=((dbg_object(this).f_height)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<148>";
	this.m__ResetHelpers();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<150>";
	pop_err();
	return this;
}
function bb_flxsprite_FlxSprite_new(t_x,t_y,t_simpleGraphic){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<81>";
	bb_flxobject_FlxObject_new.call(this,t_x,t_y,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<83>";
	this.f_offset=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<84>";
	this.f_origin=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<86>";
	this.f_scale=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,1.0,1.0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<87>";
	this.f__alpha=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<88>";
	this.f__color=bb_flxcolor_FlxColor_new.call(new bb_flxcolor_FlxColor,-1);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<89>";
	this.f_blend=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<90>";
	this.f__cameras=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<92>";
	this.f_finished=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<93>";
	this.f__facing=2;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<94>";
	this.f__animations=bb_map_StringMap5_new.call(new bb_map_StringMap5);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<95>";
	this.f__flipped=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<96>";
	this.f__curAnim=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<97>";
	this.f__curFrame=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<98>";
	this.f__curIndex=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<99>";
	this.f__frameTimer=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<101>";
	this.f__callback=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<103>";
	this.f__surfaceColor=bb_flxcolor_FlxColor_new.call(new bb_flxcolor_FlxColor,-1);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<104>";
	this.f__mixedColor=bb_flxcolor_FlxColor_new.call(new bb_flxcolor_FlxColor,-1);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<106>";
	if(t_simpleGraphic.length==0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<107>";
		t_simpleGraphic="default_flx";
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<110>";
	this.m_LoadGraphic(t_simpleGraphic,false,false,0,0,false);
	pop_err();
	return this;
}
bb_flxsprite_FlxSprite.prototype.m_MakeGraphic=function(t_width,t_height,t_color){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<160>";
	this.f__pixels=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<161>";
	this.f__bakedRotation=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<162>";
	this.f__surfaceColor.m_SetARGB(t_color);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<164>";
	dbg_object(this).f_width=(t_width);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<165>";
	this.f_frameWidth=t_width;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<166>";
	dbg_object(this).f_height=(t_height);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<167>";
	this.f_frameHeight=t_height;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<169>";
	this.m__ResetHelpers();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<171>";
	pop_err();
	return this;
}
bb_flxsprite_FlxSprite.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<114>";
	if(this.f__animations!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<115>";
		this.f__animations.m_Clear();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<116>";
		this.f__animations=null;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<119>";
	this.f_offset=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<120>";
	this.f_origin=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<121>";
	this.f_scale=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<122>";
	this.f__curAnim=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<123>";
	this.f__callback=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<124>";
	this.f__color=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<125>";
	this.f__surfaceColor=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<126>";
	this.f__mixedColor=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<127>";
	this.f__camera=null;
	pop_err();
}
bb_flxsprite_FlxSprite.prototype.m__CalcFrame=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<564>";
	if(this.f__callback!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<565>";
		if(this.f__curAnim!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<566>";
			this.f__callback.m_OnAnimationFrame(dbg_object(this.f__curAnim).f_name,this.f__curFrame,this.f__curIndex);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<568>";
			this.f__callback.m_OnAnimationFrame("",this.f__curFrame,this.f__curIndex);
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<571>";
	this.f_dirty=false;
	pop_err();
}
bb_flxsprite_FlxSprite.prototype.m__UpdateAnimation=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<534>";
	if(this.f__bakedRotation>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<535>";
		var t_oldIndex=this.f__curIndex;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<536>";
		var t_angleHelper=((this.f_angle % 360.0)|0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<538>";
		if(t_angleHelper<0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<538>";
			t_angleHelper+=360;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<539>";
		this.f__curIndex=(((t_angleHelper)/this.f__bakedRotation+0.5)|0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<541>";
		if(t_oldIndex!=this.f__curIndex){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<541>";
			this.f_dirty=true;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<543>";
		if(this.f__curAnim!=null && dbg_object(this.f__curAnim).f_delay>0.0 && (dbg_object(this.f__curAnim).f_looped || !this.f_finished)){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<544>";
			this.f__frameTimer+=bb_flxg_FlxG_Elapsed;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<545>";
			while(this.f__frameTimer>dbg_object(this.f__curAnim).f_delay){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<546>";
				this.f__frameTimer-=dbg_object(this.f__curAnim).f_delay;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<548>";
				if(this.f__curFrame==dbg_object(this.f__curAnim).f_frames.length-1){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<549>";
					if(dbg_object(this.f__curAnim).f_looped){
						err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<549>";
						this.f__curFrame=0;
					}
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<550>";
					this.f_finished=true;
				}else{
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<552>";
					this.f__curFrame+=1;
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<555>";
				this.f__curIndex=dbg_array(dbg_object(this.f__curAnim).f_frames,this.f__curFrame)[dbg_index];
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<556>";
				this.f_dirty=true;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<560>";
	if(this.f_dirty){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<560>";
		this.m__CalcFrame();
	}
	pop_err();
}
bb_flxsprite_FlxSprite.prototype.m_PostUpdate=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<175>";
	bb_flxobject_FlxObject.prototype.m_PostUpdate.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<176>";
	this.m__UpdateAnimation();
	pop_err();
}
bb_flxsprite_FlxSprite.prototype.m_OnScreen=function(t_camera){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<492>";
	if(t_camera==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<492>";
		t_camera=bb_flxg_FlxG_Camera;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<493>";
	this.m_GetScreenXY(this.f__point,t_camera);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<495>";
	dbg_object(this.f__point).f_x=dbg_object(this.f__point).f_x-dbg_object(this.f_offset).f_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<496>";
	dbg_object(this.f__point).f_y=dbg_object(this.f__point).f_y-dbg_object(this.f_offset).f_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<498>";
	if((this.f_angle==0.0 || this.f__bakedRotation>0.0) && dbg_object(this.f_scale).f_x==1.0 && dbg_object(this.f_scale).f_y==1.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<499>";
		var t_=dbg_object(this.f__point).f_x+(this.f_frameWidth)>0.0 && dbg_object(this.f__point).f_x<t_camera.m_Width() && dbg_object(this.f__point).f_y+(this.f_frameHeight)>0.0 && dbg_object(this.f__point).f_y<t_camera.m_Height();
		pop_err();
		return t_;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<502>";
	var t_radius=Math.sqrt(this.f__halfWidth*this.f__halfWidth+this.f__halfHeight*this.f__halfHeight)*bb_math_Max2(bb_math_Abs2(dbg_object(this.f_scale).f_x),bb_math_Abs2(dbg_object(this.f_scale).f_y));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<503>";
	dbg_object(this.f__point).f_x+=this.f__halfWidth;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<504>";
	dbg_object(this.f__point).f_y+=this.f__halfHeight;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<506>";
	var t_2=dbg_object(this.f__point).f_x+t_radius>0.0 && dbg_object(this.f__point).f_x-t_radius<t_camera.m_Width() && dbg_object(this.f__point).f_y+t_radius>0.0 && dbg_object(this.f__point).f_y-t_radius<t_camera.m_Height();
	pop_err();
	return t_2;
}
bb_flxsprite_FlxSprite.prototype.m__DrawSurface=function(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<510>";
	bb_graphics_DrawRect(t_x,t_y,(this.f_frameWidth),(this.f_frameHeight));
	pop_err();
}
bb_flxsprite_FlxSprite.prototype.m_Draw=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<180>";
	if(this.f__flickerTimer!=0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<181>";
		this.f__flicker=!this.f__flicker;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<182>";
		if(this.f__flicker){
			pop_err();
			return;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<185>";
	this.f__camera=bb_flxg_FlxG__CurrentCamera;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<187>";
	if(this.f__cameras!=null && !this.f__cameras.m_Contains(this.f__camera.m_ID())){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<188>";
	if(!this.m_OnScreen(this.f__camera)){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<190>";
	if(this.f_dirty){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<190>";
		this.m__CalcFrame();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<192>";
	if(bb_flxg_FlxG__LastDrawingBlend!=this.f_blend){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<193>";
		bb_graphics_SetBlend(this.f_blend);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<194>";
		bb_flxg_FlxG__LastDrawingBlend=this.f_blend;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<197>";
	dbg_object(this.f__point).f_x=this.f_x-((dbg_object(dbg_object(this.f__camera).f_scroll).f_x*dbg_object(this.f_scrollFactor).f_x)|0)-dbg_object(this.f_offset).f_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<198>";
	dbg_object(this.f__point).f_y=this.f_y-((dbg_object(dbg_object(this.f__camera).f_scroll).f_y*dbg_object(this.f_scrollFactor).f_y)|0)-dbg_object(this.f_offset).f_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<200>";
	if(dbg_object(this.f__point).f_x>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<201>";
		dbg_object(this.f__point).f_x+=0.0000001;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<203>";
		dbg_object(this.f__point).f_x-=0.0000001;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<206>";
	if(dbg_object(this.f__point).f_y>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<207>";
		dbg_object(this.f__point).f_y+=0.0000001;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<209>";
		dbg_object(this.f__point).f_y-=0.0000001;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<212>";
	if(this.f__pixels!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<213>";
		if(this.f__camera.m_Color()!=-1){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<214>";
			this.f__mixedColor.m_MixRGB2(this.f__color,dbg_object(this.f__camera).f__color);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<216>";
			if(bb_flxg_FlxG__LastDrawingColor!=dbg_object(this.f__mixedColor).f_argb){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<217>";
				bb_graphics_SetColor(dbg_object(this.f__mixedColor).f_r,dbg_object(this.f__mixedColor).f_g,dbg_object(this.f__mixedColor).f_b);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<218>";
				bb_flxg_FlxG__LastDrawingColor=dbg_object(this.f__mixedColor).f_argb;
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<221>";
			if(bb_flxg_FlxG__LastDrawingColor!=dbg_object(this.f__color).f_argb){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<222>";
				bb_graphics_SetColor(dbg_object(this.f__color).f_r,dbg_object(this.f__color).f_g,dbg_object(this.f__color).f_b);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<223>";
				bb_flxg_FlxG__LastDrawingColor=dbg_object(this.f__color).f_argb;
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<227>";
		if(this.f__camera.m_Alpha()<1.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<228>";
			var t__mixedAlpha=this.f__camera.m_Alpha()*this.f__alpha;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<230>";
			if(bb_flxg_FlxG__LastDrawingAlpha!=t__mixedAlpha){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<231>";
				bb_graphics_SetAlpha(t__mixedAlpha);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<232>";
				bb_flxg_FlxG__LastDrawingAlpha=t__mixedAlpha;
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<235>";
			if(bb_flxg_FlxG__LastDrawingAlpha!=this.f__alpha){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<236>";
				bb_graphics_SetAlpha(this.f__alpha);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<237>";
				bb_flxg_FlxG__LastDrawingAlpha=this.f__alpha;
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<241>";
		if((this.f_angle==0.0 || this.f__bakedRotation>0.0) && dbg_object(this.f_scale).f_x==1.0 && dbg_object(this.f_scale).f_y==1.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<242>";
			if(!this.f__flipNeeded){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<243>";
				bb_graphics_DrawImage(this.f__pixels,dbg_object(this.f__point).f_x,dbg_object(this.f__point).f_y,this.f__curIndex);
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<245>";
				bb_graphics_PushMatrix();
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<246>";
				bb_graphics_Transform(-1.0,0.0,0.0,1.0,dbg_object(this.f__point).f_x+this.f__halfWidth,dbg_object(this.f__point).f_y+this.f__halfHeight);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<247>";
				bb_graphics_DrawImage(this.f__pixels,-this.f__halfWidth,-this.f__halfHeight,this.f__curIndex);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<248>";
				bb_graphics_PopMatrix();
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<251>";
			bb_graphics_PushMatrix();
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<253>";
			dbg_array(this.f__matrix,4)[dbg_index]=dbg_object(this.f__point).f_x+dbg_object(this.f_origin).f_x
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<254>";
			dbg_array(this.f__matrix,5)[dbg_index]=dbg_object(this.f__point).f_y+dbg_object(this.f_origin).f_y
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<257>";
			dbg_array(this.f__matrix,0)[dbg_index]=dbg_object(this.f_scale).f_x
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<258>";
			dbg_array(this.f__matrix,3)[dbg_index]=dbg_object(this.f_scale).f_y
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<261>";
			if(this.f_angle!=0.0 && this.f__bakedRotation==0.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<262>";
				var t_sin=-Math.sin((this.f_angle)*D2R);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<263>";
				var t_cos=Math.cos((this.f_angle)*D2R);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<265>";
				dbg_array(this.f__matrix,1)[dbg_index]=-t_sin*dbg_array(this.f__matrix,3)[dbg_index]
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<266>";
				dbg_array(this.f__matrix,2)[dbg_index]=dbg_array(this.f__matrix,0)[dbg_index]*t_sin
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<267>";
				dbg_array(this.f__matrix,0)[dbg_index]*=t_cos
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<268>";
				dbg_array(this.f__matrix,3)[dbg_index]=t_cos*dbg_array(this.f__matrix,3)[dbg_index]
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<271>";
			bb_graphics_Transform(dbg_array(this.f__matrix,0)[dbg_index],dbg_array(this.f__matrix,1)[dbg_index],dbg_array(this.f__matrix,2)[dbg_index],dbg_array(this.f__matrix,3)[dbg_index],dbg_array(this.f__matrix,4)[dbg_index],dbg_array(this.f__matrix,5)[dbg_index]);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<273>";
			if(this.f__flipNeeded){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<274>";
				bb_graphics_Transform(-1.0,0.0,0.0,1.0,this.f__halfWidth-dbg_object(this.f_origin).f_x,this.f__halfHeight-dbg_object(this.f_origin).f_y);
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<277>";
			bb_graphics_DrawImage(this.f__pixels,-dbg_object(this.f_origin).f_x,-dbg_object(this.f_origin).f_y,this.f__curIndex);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<278>";
			bb_graphics_PopMatrix();
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<281>";
		if(this.f__camera.m_Color()!=-1){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<282>";
			this.f__mixedColor.m_MixRGB2(this.f__surfaceColor,dbg_object(this.f__camera).f__color);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<284>";
			if(dbg_object(this.f__color).f_argb!=-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<285>";
				this.f__mixedColor.m_MixRGB(this.f__color);
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<288>";
			if(bb_flxg_FlxG__LastDrawingColor!=dbg_object(this.f__mixedColor).f_argb){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<289>";
				bb_graphics_SetColor(dbg_object(this.f__mixedColor).f_r,dbg_object(this.f__mixedColor).f_g,dbg_object(this.f__mixedColor).f_b);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<290>";
				bb_flxg_FlxG__LastDrawingColor=dbg_object(this.f__mixedColor).f_argb;
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<293>";
			if(dbg_object(this.f__color).f_argb!=-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<294>";
				this.f__mixedColor.m_MixRGB2(this.f__surfaceColor,this.f__color);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<296>";
				if(bb_flxg_FlxG__LastDrawingColor!=dbg_object(this.f__mixedColor).f_argb){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<297>";
					bb_graphics_SetColor(dbg_object(this.f__mixedColor).f_r,dbg_object(this.f__mixedColor).f_g,dbg_object(this.f__mixedColor).f_b);
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<298>";
					bb_flxg_FlxG__LastDrawingColor=dbg_object(this.f__mixedColor).f_argb;
				}
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<301>";
				if(bb_flxg_FlxG__LastDrawingColor!=dbg_object(this.f__surfaceColor).f_argb){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<302>";
					bb_graphics_SetColor(dbg_object(this.f__surfaceColor).f_r,dbg_object(this.f__surfaceColor).f_g,dbg_object(this.f__surfaceColor).f_b);
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<303>";
					bb_flxg_FlxG__LastDrawingColor=dbg_object(this.f__surfaceColor).f_argb;
				}
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<308>";
		if(this.f__camera.m_Alpha()<1.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<309>";
			var t__mixedAlpha2=this.f__camera.m_Alpha()*this.f__alpha;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<311>";
			if(dbg_object(this.f__surfaceColor).f_a<1.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<312>";
				t__mixedAlpha2*=dbg_object(this.f__surfaceColor).f_a;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<315>";
			if(bb_flxg_FlxG__LastDrawingAlpha!=t__mixedAlpha2){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<316>";
				bb_graphics_SetAlpha(t__mixedAlpha2);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<317>";
				bb_flxg_FlxG__LastDrawingAlpha=t__mixedAlpha2;
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<320>";
			if(dbg_object(this.f__surfaceColor).f_a<1.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<321>";
				var t__mixedAlpha3=dbg_object(this.f__surfaceColor).f_a*this.f__alpha;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<323>";
				if(bb_flxg_FlxG__LastDrawingAlpha!=t__mixedAlpha3){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<324>";
					bb_graphics_SetAlpha(t__mixedAlpha3);
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<325>";
					bb_flxg_FlxG__LastDrawingAlpha=t__mixedAlpha3;
				}
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<328>";
				if(bb_flxg_FlxG__LastDrawingAlpha!=this.f__alpha){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<329>";
					bb_graphics_SetAlpha(this.f__alpha);
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<330>";
					bb_flxg_FlxG__LastDrawingAlpha=this.f__alpha;
				}
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<335>";
		if((this.f_angle==0.0 || this.f__bakedRotation>0.0) && dbg_object(this.f_scale).f_x==1.0 && dbg_object(this.f_scale).f_y==1.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<336>";
			this.m__DrawSurface(dbg_object(this.f__point).f_x,dbg_object(this.f__point).f_y);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<338>";
			bb_graphics_PushMatrix();
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<340>";
			dbg_array(this.f__matrix,4)[dbg_index]=dbg_object(this.f__point).f_x+dbg_object(this.f_origin).f_x
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<341>";
			dbg_array(this.f__matrix,5)[dbg_index]=dbg_object(this.f__point).f_y+dbg_object(this.f_origin).f_y
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<344>";
			dbg_array(this.f__matrix,0)[dbg_index]=dbg_object(this.f_scale).f_x
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<345>";
			dbg_array(this.f__matrix,3)[dbg_index]=dbg_object(this.f_scale).f_y
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<348>";
			if(this.f_angle!=0.0 && this.f__bakedRotation==0.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<349>";
				var t_sin2=-Math.sin((this.f_angle)*D2R);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<350>";
				var t_cos2=Math.cos((this.f_angle)*D2R);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<352>";
				dbg_array(this.f__matrix,1)[dbg_index]=-t_sin2*dbg_array(this.f__matrix,3)[dbg_index]
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<353>";
				dbg_array(this.f__matrix,2)[dbg_index]=dbg_array(this.f__matrix,0)[dbg_index]*t_sin2
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<354>";
				dbg_array(this.f__matrix,0)[dbg_index]*=t_cos2
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<355>";
				dbg_array(this.f__matrix,3)[dbg_index]=t_cos2*dbg_array(this.f__matrix,3)[dbg_index]
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<358>";
			bb_graphics_Transform(dbg_array(this.f__matrix,0)[dbg_index],dbg_array(this.f__matrix,1)[dbg_index],dbg_array(this.f__matrix,2)[dbg_index],dbg_array(this.f__matrix,3)[dbg_index],dbg_array(this.f__matrix,4)[dbg_index],dbg_array(this.f__matrix,5)[dbg_index]);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<359>";
			this.m__DrawSurface(-dbg_object(this.f_origin).f_x,-dbg_object(this.f_origin).f_y);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<360>";
			bb_graphics_PopMatrix();
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<364>";
	bb_flxbasic_FlxBasic__VisibleCount+=1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<365>";
	if(bb_flxg_FlxG_VisualDebug && !this.f_ignoreDrawDebug){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<365>";
		this.m_DrawDebug(this.f__camera);
	}
	pop_err();
}
bb_flxsprite_FlxSprite.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<529>";
	pop_err();
	return "FlxSprite";
}
function bb_flxtext_FlxText(){
	bb_flxsprite_FlxSprite.call(this);
	this.f__driver=null;
	this.f__shadow=null;
}
bb_flxtext_FlxText.prototype=extend_class(bb_flxsprite_FlxSprite);
bb_flxtext_FlxText.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<53>";
	this.f__driver.m_Destroy();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<54>";
	this.f__driver=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<55>";
	this.f__shadow=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<57>";
	bb_flxsprite_FlxSprite.prototype.m_Destroy.call(this);
	pop_err();
}
bb_flxtext_FlxText.prototype.m__DrawSurface=function(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<137>";
	if(dbg_object(this.f__shadow).f_argb!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<138>";
		var t_oldColor=bb_flxg_FlxG__LastDrawingColor;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<139>";
		var t_oldAlpha=((bb_flxg_FlxG__LastDrawingAlpha)|0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<141>";
		if(this.f__camera.m_Color()!=-1){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<142>";
			this.f__mixedColor.m_MixRGB2(this.f__shadow,dbg_object(this.f__camera).f__color);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<144>";
			if(bb_flxg_FlxG__LastDrawingColor!=dbg_object(this.f__mixedColor).f_argb){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<145>";
				bb_graphics_SetColor(dbg_object(this.f__mixedColor).f_r,dbg_object(this.f__mixedColor).f_g,dbg_object(this.f__mixedColor).f_b);
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<148>";
			if(bb_flxg_FlxG__LastDrawingColor!=dbg_object(this.f__shadow).f_argb){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<149>";
				bb_graphics_SetColor(dbg_object(this.f__shadow).f_r,dbg_object(this.f__shadow).f_g,dbg_object(this.f__shadow).f_b);
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<153>";
		if(this.f__camera.m_Alpha()<1.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<154>";
			var t__mixedAlpha=this.f__camera.m_Alpha()*dbg_object(this.f__shadow).f_a;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<156>";
			if(bb_flxg_FlxG__LastDrawingAlpha!=t__mixedAlpha){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<157>";
				bb_graphics_SetAlpha(t__mixedAlpha);
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<160>";
			if(bb_flxg_FlxG__LastDrawingAlpha!=dbg_object(this.f__shadow).f_a){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<161>";
				bb_graphics_SetAlpha(dbg_object(this.f__shadow).f_a);
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<164>";
		this.f__driver.m_Draw2(t_x+1.0,t_y+1.0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<166>";
		this.f__mixedColor.m_SetRGB(t_oldColor);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<167>";
		bb_graphics_SetColor(dbg_object(this.f__mixedColor).f_r,dbg_object(this.f__mixedColor).f_g,dbg_object(this.f__mixedColor).f_b);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<168>";
		bb_graphics_SetAlpha(t_oldAlpha);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<171>";
	this.f__driver.m_Draw2(t_x,t_y);
	pop_err();
}
bb_flxtext_FlxText.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext.monkey<179>";
	pop_err();
	return "FlxText";
}
function bb_map_Map3(){
	Object.call(this);
	this.f_root=null;
}
function bb_map_Map3_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
bb_map_Map3.prototype.m_Compare=function(t_lhs,t_rhs){
}
bb_map_Map3.prototype.m_RotateLeft3=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<252>";
	dbg_object(t_node).f_right=dbg_object(t_child).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).f_left)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).f_left).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<256>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<264>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<266>";
	dbg_object(t_child).f_left=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<267>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map3.prototype.m_RotateRight3=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<272>";
	dbg_object(t_node).f_left=dbg_object(t_child).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).f_right)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).f_right).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<276>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<284>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<286>";
	dbg_object(t_child).f_right=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<287>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map3.prototype.m_InsertFixup3=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).f_parent)!=null) && dbg_object(dbg_object(t_node).f_parent).f_color==-1 && ((dbg_object(dbg_object(t_node).f_parent).f_parent)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).f_parent==dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_right;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<223>";
					this.m_RotateLeft3(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<227>";
				this.m_RotateRight3(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<239>";
					this.m_RotateRight3(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<243>";
				this.m_RotateLeft3(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<247>";
	dbg_object(this.f_root).f_color=1;
	pop_err();
	return 0;
}
bb_map_Map3.prototype.m_Set3=function(t_key,t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<29>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<34>";
		t_cmp=this.m_Compare(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<40>";
				dbg_object(t_node).f_value=t_value;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<45>";
	t_node=bb_map_Node4_new.call(new bb_map_Node4,t_key,t_value,-1,t_parent);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).f_right=t_node;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).f_left=t_node;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<53>";
		this.m_InsertFixup3(t_node);
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<55>";
		this.f_root=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
bb_map_Map3.prototype.m_FindNode=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<157>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<160>";
		var t_cmp=this.m_Compare(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
bb_map_Map3.prototype.m_Get=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<101>";
	var t_node=this.m_FindNode(t_key);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<102>";
	if((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<102>";
		pop_err();
		return dbg_object(t_node).f_value;
	}
	pop_err();
	return "";
}
function bb_map_StringMap3(){
	bb_map_Map3.call(this);
}
bb_map_StringMap3.prototype=extend_class(bb_map_Map3);
function bb_map_StringMap3_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<551>";
	bb_map_Map3_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
bb_map_StringMap3.prototype.m_Compare=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<554>";
	var t_=string_compare(t_lhs,t_rhs);
	pop_err();
	return t_;
}
function bb_map_Node2(){
	Object.call(this);
	this.f_key="";
	this.f_right=null;
	this.f_left=null;
	this.f_value=null;
	this.f_color=0;
	this.f_parent=null;
}
function bb_map_Node2_new(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<364>";
	dbg_object(this).f_key=t_key;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<365>";
	dbg_object(this).f_value=t_value;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<366>";
	dbg_object(this).f_color=t_color;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<367>";
	dbg_object(this).f_parent=t_parent;
	pop_err();
	return this;
}
function bb_map_Node2_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function bb_map_Map4(){
	Object.call(this);
	this.f_root=null;
}
function bb_map_Map4_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
bb_map_Map4.prototype.m_Compare2=function(t_lhs,t_rhs){
}
bb_map_Map4.prototype.m_RotateLeft4=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<252>";
	dbg_object(t_node).f_right=dbg_object(t_child).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).f_left)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).f_left).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<256>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<264>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<266>";
	dbg_object(t_child).f_left=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<267>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map4.prototype.m_RotateRight4=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<272>";
	dbg_object(t_node).f_left=dbg_object(t_child).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).f_right)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).f_right).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<276>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<284>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<286>";
	dbg_object(t_child).f_right=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<287>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map4.prototype.m_InsertFixup4=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).f_parent)!=null) && dbg_object(dbg_object(t_node).f_parent).f_color==-1 && ((dbg_object(dbg_object(t_node).f_parent).f_parent)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).f_parent==dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_right;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<223>";
					this.m_RotateLeft4(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<227>";
				this.m_RotateRight4(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<239>";
					this.m_RotateRight4(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<243>";
				this.m_RotateLeft4(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<247>";
	dbg_object(this.f_root).f_color=1;
	pop_err();
	return 0;
}
bb_map_Map4.prototype.m_Set4=function(t_key,t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<29>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<34>";
		t_cmp=this.m_Compare2(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<40>";
				dbg_object(t_node).f_value=t_value;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<45>";
	t_node=bb_map_Node3_new.call(new bb_map_Node3,t_key,t_value,-1,t_parent);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).f_right=t_node;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).f_left=t_node;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<53>";
		this.m_InsertFixup4(t_node);
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<55>";
		this.f_root=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
function bb_map_IntMap(){
	bb_map_Map4.call(this);
}
bb_map_IntMap.prototype=extend_class(bb_map_Map4);
function bb_map_IntMap_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<534>";
	bb_map_Map4_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<534>";
	pop_err();
	return this;
}
bb_map_IntMap.prototype.m_Compare2=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<537>";
	var t_=t_lhs-t_rhs;
	pop_err();
	return t_;
}
function bb_math_Min(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<51>";
	if(t_x<t_y){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<51>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<52>";
	pop_err();
	return t_y;
}
function bb_math_Min2(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<78>";
	if(t_x<t_y){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<78>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<79>";
	pop_err();
	return t_y;
}
function bb_map_Node3(){
	Object.call(this);
	this.f_key=0;
	this.f_right=null;
	this.f_left=null;
	this.f_value="";
	this.f_color=0;
	this.f_parent=null;
}
function bb_map_Node3_new(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<364>";
	dbg_object(this).f_key=t_key;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<365>";
	dbg_object(this).f_value=t_value;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<366>";
	dbg_object(this).f_color=t_color;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<367>";
	dbg_object(this).f_parent=t_parent;
	pop_err();
	return this;
}
function bb_map_Node3_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function bb_math_Max(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<56>";
	if(t_x>t_y){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<56>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<57>";
	pop_err();
	return t_y;
}
function bb_math_Max2(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<83>";
	if(t_x>t_y){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<83>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<84>";
	pop_err();
	return t_y;
}
function bb_map_Node4(){
	Object.call(this);
	this.f_key="";
	this.f_right=null;
	this.f_left=null;
	this.f_value="";
	this.f_color=0;
	this.f_parent=null;
}
function bb_map_Node4_new(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<364>";
	dbg_object(this).f_key=t_key;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<365>";
	dbg_object(this).f_value=t_value;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<366>";
	dbg_object(this).f_color=t_color;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<367>";
	dbg_object(this).f_parent=t_parent;
	pop_err();
	return this;
}
function bb_map_Node4_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function bb_flxtilemap_FlxTilemap(){
	bb_flxobject_FlxObject.call(this);
	this.f__tiles=null;
	this.f__camera=null;
	this.f__buffer=null;
	this.f__tileObjects=[];
	this.f__buffers=null;
	this.f__tileWidth=0;
	this.f__tileHeight=0;
	this.f_widthInTiles=0;
	this.f_heightInTiles=0;
	this.f__screenRows=0;
	this.f__screenColumns=0;
	this.f__screenXInTiles=0;
	this.f__screenYInTiles=0;
	this.f__rects=[];
}
bb_flxtilemap_FlxTilemap.prototype=extend_class(bb_flxobject_FlxObject);
bb_flxtilemap_FlxTilemap.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<90>";
	this.f__tiles=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<91>";
	this.f__camera=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<92>";
	this.f__buffer=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<94>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<95>";
	var t_l=this.f__tileObjects.length;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<97>";
	while(t_i<t_l){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<98>";
		if(dbg_array(this.f__tileObjects,t_i)[dbg_index]!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<99>";
			dbg_array(this.f__tileObjects,t_i)[dbg_index].m_Destroy();
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<100>";
			dbg_array(this.f__tileObjects,t_i)[dbg_index]=null
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<103>";
		t_i+=1;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<106>";
	this.f__buffers.m_Clear();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<107>";
	this.f__buffers=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<109>";
	bb_flxobject_FlxObject.prototype.m_Destroy.call(this);
	pop_err();
}
bb_flxtilemap_FlxTilemap.prototype.m_Draw=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<204>";
	if(this.f__flickerTimer!=0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<205>";
		this.f__flicker=!this.f__flicker;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<206>";
		if(this.f__flicker){
			pop_err();
			return;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<209>";
	this.f__camera=bb_flxg_FlxG__CurrentCamera;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<211>";
	if(this.f__cameras!=null && !this.f__cameras.m_Contains(this.f__camera.m_ID())){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<213>";
	this.f__buffer=this.f__buffers.m_Get2(this.f__camera.m_ID());
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<215>";
	if(this.f__buffer==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<216>";
		this.f__buffer=bb_flxtilemapbuffer_FlxTilemapBuffer_new.call(new bb_flxtilemapbuffer_FlxTilemapBuffer,(this.f__tileWidth),(this.f__tileHeight),this.f_widthInTiles,this.f_heightInTiles,this.f__camera);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<217>";
		this.f__buffers.m_Set7(this.f__camera.m_ID(),this.f__buffer);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<220>";
	this.f__screenRows=dbg_object(this.f__buffer).f_rows;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<221>";
	this.f__screenColumns=dbg_object(this.f__buffer).f_columns;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<223>";
	if(!dbg_object(this.f__buffer).f_dirty){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<224>";
		dbg_object(this.f__point).f_x=this.f_x-((dbg_object(dbg_object(this.f__camera).f_scroll).f_x*dbg_object(this.f_scrollFactor).f_x)|0)+dbg_object(this.f__buffer).f_x;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<225>";
		dbg_object(this.f__point).f_y=this.f_y-((dbg_object(dbg_object(this.f__camera).f_scroll).f_y*dbg_object(this.f_scrollFactor).f_y)|0)+dbg_object(this.f__buffer).f_y;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<227>";
		dbg_object(this.f__buffer).f_dirty=dbg_object(this.f__point).f_x>0.0 || dbg_object(this.f__point).f_y>0.0 || dbg_object(this.f__point).f_x+dbg_object(this.f__buffer).f_width<this.f__camera.m_Width() || dbg_object(this.f__point).f_y+dbg_object(this.f__buffer).f_height<this.f__camera.m_Height();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<230>";
	if(dbg_object(this.f__buffer).f_dirty){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<231>";
		dbg_object(this.f__point).f_x=((dbg_object(dbg_object(this.f__camera).f_scroll).f_x*dbg_object(this.f_scrollFactor).f_x)|0)-this.f_x;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<232>";
		dbg_object(this.f__point).f_y=((dbg_object(dbg_object(this.f__camera).f_scroll).f_y*dbg_object(this.f_scrollFactor).f_y)|0)-this.f_y;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<234>";
		if(dbg_object(this.f__point).f_x>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<235>";
			this.f__screenXInTiles=(((dbg_object(this.f__point).f_x+0.0000001)/(this.f__tileWidth))|0);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<237>";
			this.f__screenXInTiles=(((dbg_object(this.f__point).f_x-0.0000001)/(this.f__tileWidth))|0);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<240>";
		if(dbg_object(this.f__point).f_y>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<241>";
			this.f__screenYInTiles=(((dbg_object(this.f__point).f_y+0.0000001)/(this.f__tileHeight))|0);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<243>";
			this.f__screenYInTiles=(((dbg_object(this.f__point).f_y-0.0000001)/(this.f__tileHeight))|0);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<246>";
		if(this.f__screenXInTiles<0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<246>";
			this.f__screenXInTiles=0;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<247>";
		if(this.f__screenXInTiles>this.f_widthInTiles-this.f__screenColumns){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<247>";
			this.f__screenXInTiles=this.f_widthInTiles-this.f__screenColumns;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<248>";
		if(this.f__screenYInTiles<0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<248>";
			this.f__screenYInTiles=0;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<249>";
		if(this.f__screenYInTiles>this.f_heightInTiles-this.f__screenRows){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<249>";
			this.f__screenYInTiles=this.f_heightInTiles-this.f__screenRows;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<251>";
		dbg_object(this.f__buffer).f_x=(this.f__screenXInTiles*this.f__tileWidth);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<252>";
		dbg_object(this.f__buffer).f_y=(this.f__screenYInTiles*this.f__tileHeight);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<255>";
	dbg_object(this.f__point).f_x=this.f_x-((dbg_object(dbg_object(this.f__camera).f_scroll).f_x*dbg_object(this.f_scrollFactor).f_x)|0)+dbg_object(this.f__buffer).f_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<256>";
	dbg_object(this.f__point).f_y=this.f_y-((dbg_object(dbg_object(this.f__camera).f_scroll).f_y*dbg_object(this.f_scrollFactor).f_y)|0)+dbg_object(this.f__buffer).f_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<258>";
	if(bb_flxg_FlxG__LastDrawingBlend!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<259>";
		bb_graphics_SetBlend(0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<260>";
		bb_flxg_FlxG__LastDrawingBlend=0;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<263>";
	if(bb_flxg_FlxG__LastDrawingColor!=this.f__camera.m_Color()){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<264>";
		bb_graphics_SetColor(dbg_object(dbg_object(this.f__camera).f__color).f_r,dbg_object(dbg_object(this.f__camera).f__color).f_g,dbg_object(dbg_object(this.f__camera).f__color).f_b);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<265>";
		bb_flxg_FlxG__LastDrawingColor=this.f__camera.m_Color();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<268>";
	var t_alpha=dbg_object(dbg_object(this.f__camera).f__color).f_a*this.f__camera.m_Alpha();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<270>";
	if(bb_flxg_FlxG__LastDrawingAlpha!=t_alpha){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<271>";
		bb_graphics_SetAlpha(t_alpha);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<272>";
		bb_flxg_FlxG__LastDrawingAlpha=t_alpha;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<275>";
	bb_graphics_PushMatrix();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<276>";
	bb_graphics_Translate(dbg_object(this.f__point).f_x,dbg_object(this.f__point).f_y);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<278>";
	var t_rowIndex=this.f__screenYInTiles*this.f_widthInTiles+this.f__screenXInTiles;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<279>";
	var t_row=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<280>";
	var t_column=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<281>";
	var t_columnIndex=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<283>";
	dbg_object(this.f__point).f_y=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<285>";
	if(dbg_object(this.f__buffer).f_scaleFixX==1.0 || dbg_object(this.f__buffer).f_scaleFixY==1.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<286>";
		while(t_row<this.f__screenRows){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<287>";
			t_columnIndex=t_rowIndex;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<288>";
			t_column=0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<289>";
			dbg_object(this.f__point).f_x=0.0;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<291>";
			while(t_column<this.f__screenColumns){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<292>";
				this.f__rect=dbg_array(this.f__rects,t_columnIndex)[dbg_index];
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<294>";
				if(this.f__rect!=null){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<295>";
					bb_graphics_DrawImageRect(this.f__tiles,dbg_object(this.f__point).f_x,dbg_object(this.f__point).f_y,((dbg_object(this.f__rect).f_x)|0),((dbg_object(this.f__rect).f_y)|0),((dbg_object(this.f__rect).f_width)|0),((dbg_object(this.f__rect).f_height)|0),0);
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<297>";
					if(bb_flxg_FlxG_VisualDebug && !this.f_ignoreDrawDebug){
					}
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<302>";
				dbg_object(this.f__point).f_x=dbg_object(this.f__point).f_x+(this.f__tileWidth);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<303>";
				t_column+=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<304>";
				t_columnIndex+=1;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<307>";
			t_rowIndex+=this.f_widthInTiles;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<308>";
			dbg_object(this.f__point).f_y=dbg_object(this.f__point).f_y+(this.f__tileHeight);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<309>";
			t_row+=1;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<312>";
		t_row=this.f__screenRows-1;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<313>";
		dbg_object(this.f__point).f_y=(t_row*this.f__tileHeight);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<314>";
		t_rowIndex+=this.f_widthInTiles*t_row;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<316>";
		while(t_row>=0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<317>";
			t_column=this.f__screenColumns-1;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<318>";
			dbg_object(this.f__point).f_x=(t_column*this.f__tileWidth);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<319>";
			t_columnIndex=t_rowIndex+t_column;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<321>";
			while(t_column>=0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<322>";
				this.f__rect=dbg_array(this.f__rects,t_columnIndex)[dbg_index];
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<324>";
				if(this.f__rect!=null){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<325>";
					bb_graphics_DrawImageRect2(this.f__tiles,dbg_object(this.f__point).f_x,dbg_object(this.f__point).f_y,((dbg_object(this.f__rect).f_x)|0),((dbg_object(this.f__rect).f_y)|0),((dbg_object(this.f__rect).f_width)|0),((dbg_object(this.f__rect).f_height)|0),0.0,dbg_object(this.f__buffer).f_scaleFixX,dbg_object(this.f__buffer).f_scaleFixY,0);
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<327>";
					if(bb_flxg_FlxG_VisualDebug && !this.f_ignoreDrawDebug){
					}
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<332>";
				dbg_object(this.f__point).f_x=dbg_object(this.f__point).f_x-(this.f__tileWidth);
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<333>";
				t_column-=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<334>";
				t_columnIndex-=1;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<337>";
			t_rowIndex-=this.f_widthInTiles;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<338>";
			dbg_object(this.f__point).f_y=dbg_object(this.f__point).f_y-(this.f__tileHeight);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<339>";
			t_row-=1;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<342>";
	bb_graphics_PopMatrix();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<344>";
	bb_flxbasic_FlxBasic__VisibleCount+=1;
	pop_err();
}
bb_flxtilemap_FlxTilemap.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtilemap.monkey<833>";
	pop_err();
	return "FlxTilemap";
}
function bb_flxsound_FlxSound(){
	bb_flxbasic_FlxBasic.call(this);
	this.f_survive=false;
	this.f__paused=false;
	this.f__channel=0;
	this.f__looped=false;
	this.f_autoDestroy=false;
	this.f__sound=null;
	this.f__target=null;
	this.f_x=.0;
	this.f_y=.0;
	this.f__radius=.0;
	this.f__pan=false;
	this.f__soundPan=.0;
	this.f__fadeOutTimer=.0;
	this.f__pauseOnFadeOut=false;
	this.f__fadeOutTotal=.0;
	this.f__fadeInTimer=.0;
	this.f__fadeInTotal=.0;
	this.f__volumeAdjust=.0;
	this.f__oldMute=false;
	this.f__volume=.0;
	this.f__soundVolume=.0;
	this.f_name="";
	this.f_artist="";
}
bb_flxsound_FlxSound.prototype=extend_class(bb_flxbasic_FlxBasic);
function bb_flxsound_FlxSound_GetValidExt(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<293>";
	if(flixel.isIE()){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<294>";
		pop_err();
		return "mp3";
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<296>";
		pop_err();
		return "ogg";
	}
}
var bb_flxsound_FlxSound__LoopedChannels;
bb_flxsound_FlxSound.prototype.m_Stop=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<236>";
	this.f__paused=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<238>";
	if(this.f__channel>=0 && this.f_exists){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<239>";
		bb_audio_StopChannel(this.f__channel);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<240>";
		if(this.f__looped){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<240>";
			dbg_array(bb_flxsound_FlxSound__LoopedChannels,this.f__channel)[dbg_index]=false
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<241>";
		this.f__channel=-1;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<242>";
		this.f_active=false;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<244>";
		if(this.f_autoDestroy){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<245>";
			this.m_Destroy();
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<248>";
		this.f_exists=false;
	}
	pop_err();
}
bb_flxsound_FlxSound.prototype.m_Kill=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<151>";
	this.m_Stop();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<152>";
	bb_flxbasic_FlxBasic.prototype.m_Kill.call(this);
	pop_err();
}
bb_flxsound_FlxSound.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<79>";
	this.m_Kill();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<80>";
	this.f__sound=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<81>";
	this.f__target=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<83>";
	bb_flxbasic_FlxBasic.prototype.m_Destroy.call(this);
	pop_err();
}
bb_flxsound_FlxSound.prototype.m_Pause=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<225>";
	if(this.f__channel<0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<226>";
		this.f_exists=false;
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<230>";
	bb_audio_PauseChannel(this.f__channel);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<231>";
	this.f__paused=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<232>";
	this.f_active=false;
	pop_err();
}
bb_flxsound_FlxSound.prototype.m__SetTransform=function(t_volume,t_pan){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<304>";
	if(this.f__channel>=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<305>";
		bb_audio_SetChannelVolume(this.f__channel,t_volume);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<306>";
		bb_audio_SetChannelPan(this.f__channel,t_pan);
	}
	pop_err();
}
bb_flxsound_FlxSound.prototype.m__UpdateTransform=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<337>";
	if(!bb_flxg_FlxG_Mute){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<338>";
		this.f__soundVolume=bb_flxg_FlxG__Volume*this.f__volume*this.f__volumeAdjust;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<340>";
		this.f__soundVolume=0.0;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<343>";
	if(this.f__soundVolume<0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<343>";
		this.f__soundVolume=0.0;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<344>";
	this.m__SetTransform(this.f__soundVolume,this.f__soundPan);
	pop_err();
}
bb_flxsound_FlxSound.prototype.m_Update=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<87>";
	if(this.f__paused){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<89>";
	var t_radial=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<90>";
	var t_fade=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<91>";
	var t_updateNeeded=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<93>";
	if(this.f__target!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<95>";
		t_radial=1.0-bb_flxu_FlxU_GetDistance2(dbg_object(this.f__target).f_x,dbg_object(this.f__target).f_y,this.f_x,this.f_y)/this.f__radius;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<96>";
		if(t_radial<0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<96>";
			t_radial=0.0;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<98>";
		if(this.f__pan){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<100>";
			var t_d=-(dbg_object(this.f__target).f_x-this.f_x)/this.f__radius;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<102>";
			if(t_d<-1.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<103>";
				t_d=-1.0;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<104>";
				if(t_d>1.0){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<105>";
					t_d=1.0;
				}
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<108>";
			this.f__soundPan=t_d;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<111>";
		t_updateNeeded=true;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<114>";
	if(this.f__fadeOutTimer>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<115>";
		this.f__fadeOutTimer-=bb_flxg_FlxG_Elapsed;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<117>";
		if(this.f__fadeOutTimer<=0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<118>";
			if(this.f__pauseOnFadeOut){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<119>";
				this.m_Pause();
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<121>";
				this.m_Stop();
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<125>";
		t_fade=this.f__fadeOutTimer/this.f__fadeOutTotal;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<126>";
		if(t_fade<0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<126>";
			t_fade=0.0;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<128>";
		t_updateNeeded=true;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<129>";
		if(this.f__fadeInTimer>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<130>";
			this.f__fadeInTimer-=bb_flxg_FlxG_Elapsed;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<132>";
			t_fade=this.f__fadeInTimer/this.f__fadeInTotal;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<133>";
			if(t_fade<0.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<133>";
				t_fade=0.0;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<134>";
			t_fade=1.0-t_fade;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<136>";
			t_updateNeeded=true;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<139>";
	this.f__volumeAdjust=t_radial*t_fade;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<141>";
	if(this.f__oldMute!=bb_flxg_FlxG_Mute){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<142>";
		this.m__UpdateTransform();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<143>";
		this.f__oldMute=bb_flxg_FlxG_Mute;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<144>";
		t_updateNeeded=true;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<147>";
	if(t_updateNeeded){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<147>";
		this.m__UpdateTransform();
	}
	pop_err();
}
var bb_flxsound_FlxSound_ClassObject;
bb_flxsound_FlxSound.prototype.m__CreateSound=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<311>";
	this.m_Destroy();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<312>";
	this.f_x=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<313>";
	this.f_y=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<314>";
	this.f__sound=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<315>";
	this.f__channel=-1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<316>";
	this.f__paused=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<317>";
	this.f__volume=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<318>";
	this.f__volumeAdjust=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<319>";
	this.f__looped=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<320>";
	this.f__target=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<321>";
	this.f__radius=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<322>";
	this.f__pan=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<323>";
	this.f__fadeOutTimer=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<324>";
	this.f__fadeOutTotal=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<325>";
	this.f__pauseOnFadeOut=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<326>";
	this.f__fadeInTimer=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<327>";
	this.f__fadeInTotal=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<328>";
	this.f_exists=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<329>";
	this.f_active=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<330>";
	this.f_visible=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<331>";
	this.f_name="";
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<332>";
	this.f_artist="";
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<333>";
	this.f_autoDestroy=false;
	pop_err();
}
var bb_flxsound_FlxSound__NextChannel;
bb_flxsound_FlxSound.prototype.m__GetFreeChannel=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<349>";
	var t_i=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<351>";
	if(bb_audio_ChannelState(0)>=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<352>";
		while(t_i<32){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<353>";
			if(bb_audio_ChannelState(t_i)==0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<353>";
				pop_err();
				return t_i;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<354>";
			t_i+=1;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<357>";
		var t_counter=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<359>";
		do{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<360>";
			bb_flxsound_FlxSound__NextChannel+=1;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<361>";
			if(bb_flxsound_FlxSound__NextChannel>=32){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<361>";
				bb_flxsound_FlxSound__NextChannel=0;
			}
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<363>";
			t_counter+=1;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<364>";
			if(t_counter>=32){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<365>";
				bb_flxg_FlxG_Log("Free channels for sound "+this.f_name+" are not found");
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<366>";
				break;
			}
		}while(!(!dbg_array(bb_flxsound_FlxSound__LoopedChannels,bb_flxsound_FlxSound__NextChannel)[dbg_index]));
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<370>";
		pop_err();
		return bb_flxsound_FlxSound__NextChannel;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<373>";
	pop_err();
	return -1;
}
var bb_flxsound_FlxSound__SoundLoader;
bb_flxsound_FlxSound.prototype.m_Load2=function(t_sound,t_looped,t_autoDestroy,t_stopPrevious){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<156>";
	if(t_stopPrevious){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<156>";
		this.m_Stop();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<158>";
	this.m__CreateSound();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<160>";
	this.f__channel=this.m__GetFreeChannel();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<161>";
	if(t_looped && this.f__channel>=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<161>";
		dbg_array(bb_flxsound_FlxSound__LoopedChannels,this.f__channel)[dbg_index]=true
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<163>";
	this.f_name=t_sound;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<164>";
	this.f__sound=bb_flxg_FlxG_AddSound(t_sound,(bb_flxsound_FlxSound__SoundLoader));
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<165>";
	this.f__looped=t_looped;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<166>";
	this.m__UpdateTransform();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<167>";
	if(this.f__sound!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<167>";
		this.f_exists=true;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<168>";
	pop_err();
	return this;
}
bb_flxsound_FlxSound.prototype.m_Volume=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<266>";
	pop_err();
	return this.f__volume;
}
bb_flxsound_FlxSound.prototype.m_Volume2=function(t_volume){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<270>";
	this.f__volume=t_volume;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<272>";
	if(this.f__volume<0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<273>";
		this.f__volume=0.0;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<274>";
		if(this.f__volume>1.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<275>";
			this.f__volume=1.0;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<278>";
	this.m__UpdateTransform();
	pop_err();
}
bb_flxsound_FlxSound.prototype.m_Play=function(t_forceRestart){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<182>";
	if(t_forceRestart){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<183>";
		var t_oldAutoDestroy=this.f_autoDestroy;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<184>";
		this.f_autoDestroy=false;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<185>";
		this.m_Stop();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<186>";
		this.f_autoDestroy=t_oldAutoDestroy;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<189>";
	if(this.f__channel<0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<190>";
		this.f__channel=this.m__GetFreeChannel();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<191>";
		if(this.f__channel<0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<192>";
			this.f_exists=false;
			pop_err();
			return;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<194>";
			if(this.f__looped){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<195>";
				dbg_array(bb_flxsound_FlxSound__LoopedChannels,this.f__channel)[dbg_index]=true
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<199>";
	this.m__UpdateTransform();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<201>";
	if(!this.f__paused){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<202>";
		bb_audio_PlaySound(this.f__sound,this.f__channel,((this.f__looped)?1:0));
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<204>";
		bb_audio_ResumeChannel(this.f__channel);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<207>";
	this.f_active=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<208>";
	this.f__paused=false;
	pop_err();
}
bb_flxsound_FlxSound.prototype.m_Resume=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<212>";
	if(!this.f__paused){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<214>";
	if(this.f__channel<0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<215>";
		this.f_exists=false;
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<219>";
	bb_audio_ResumeChannel(this.f__channel);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<220>";
	this.f__paused=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<221>";
	this.f_active=true;
	pop_err();
}
bb_flxsound_FlxSound.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<286>";
	pop_err();
	return "FlxSound";
}
function bb_flxsound_FlxSound_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<73>";
	bb_flxbasic_FlxBasic_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<74>";
	this.f__channel=-1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<75>";
	this.m__CreateSound();
	pop_err();
	return this;
}
function bb_app_SetUpdateRate(t_hertz){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<141>";
	var t_=bb_app_device.SetUpdateRate(t_hertz);
	pop_err();
	return t_;
}
var bb_random_Seed;
function bb_flxmusic_FlxMusic(){
	bb_flxsound_FlxSound.call(this);
	this.f__filename="";
}
bb_flxmusic_FlxMusic.prototype=extend_class(bb_flxsound_FlxSound);
bb_flxmusic_FlxMusic.prototype.m_Pause=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<58>";
	if(!this.f_active){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<60>";
	bb_audio_PauseMusic();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<61>";
	this.f__paused=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<62>";
	this.f_active=false;
	pop_err();
}
bb_flxmusic_FlxMusic.prototype.m_Stop=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<66>";
	this.f__paused=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<67>";
	this.f_active=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<69>";
	bb_audio_StopMusic();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<71>";
	if(this.f_autoDestroy){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<72>";
		this.m_Destroy();
	}
	pop_err();
}
bb_flxmusic_FlxMusic.prototype.m_Play=function(t_forceRestart){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<30>";
	if(t_forceRestart){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<31>";
		var t_oldAutoDestroy=this.f_autoDestroy;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<32>";
		this.f_autoDestroy=false;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<33>";
		this.m_Stop();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<34>";
		this.f_autoDestroy=t_oldAutoDestroy;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<37>";
	this.m__UpdateTransform();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<39>";
	if(!this.f__paused){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<40>";
		bb_audio_PlayMusic(this.f__filename,((this.f__looped)?1:0));
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<42>";
		bb_audio_ResumeMusic();
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<45>";
	this.f_active=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<46>";
	this.f__paused=false;
	pop_err();
}
bb_flxmusic_FlxMusic.prototype.m_Kill=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<15>";
	bb_flxsound_FlxSound.prototype.m_Kill.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<16>";
	this.m_Stop();
	pop_err();
}
bb_flxmusic_FlxMusic.prototype.m_Load2=function(t_music,t_looped,t_autoDestroy,t_stopPrevious){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<20>";
	this.m_Stop();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<21>";
	this.m__CreateSound();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<22>";
	this.f__filename=bb_flxassetsmanager_FlxAssetsManager_GetMusicPath(t_music);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<23>";
	this.f__looped=t_looped;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<24>";
	this.m__UpdateTransform();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<25>";
	this.f_exists=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<26>";
	var t_=(this);
	pop_err();
	return t_;
}
bb_flxmusic_FlxMusic.prototype.m_Resume=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<50>";
	if(!this.f__paused){
		pop_err();
		return;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<52>";
	bb_audio_ResumeMusic();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<53>";
	this.f__paused=false;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<54>";
	this.f_active=true;
	pop_err();
}
bb_flxmusic_FlxMusic.prototype.m_ToString=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<77>";
	pop_err();
	return "FlxMusic";
}
bb_flxmusic_FlxMusic.prototype.m__SetTransform=function(t_volume,t_pan){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxmusic.monkey<95>";
	bb_audio_SetMusicVolume(t_volume);
	pop_err();
}
function bb_audio_StopChannel(t_channel){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<73>";
	bb_audio_device.StopChannel(t_channel);
	pop_err();
	return 0;
}
function bb_audio_Sound(){
	Object.call(this);
	this.f_sample=null;
}
bb_audio_Sound.prototype.m_Discard=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<49>";
	if((this.f_sample)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<50>";
		this.f_sample.Discard();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<51>";
		this.f_sample=null;
	}
	pop_err();
	return 0;
}
function bb_audio_Sound_new(t_sample){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<45>";
	dbg_object(this).f_sample=t_sample;
	pop_err();
	return this;
}
function bb_audio_Sound_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<42>";
	pop_err();
	return this;
}
function bb_flxgroup_Enumerator(){
	Object.call(this);
	this.f__group=null;
	this.f__index=0;
}
function bb_flxgroup_Enumerator_new(t_group){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<548>";
	this.f__group=t_group;
	pop_err();
	return this;
}
function bb_flxgroup_Enumerator_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<545>";
	pop_err();
	return this;
}
bb_flxgroup_Enumerator.prototype.m_HasNext=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<552>";
	var t_=this.f__index<this.f__group.m_Length();
	pop_err();
	return t_;
}
bb_flxgroup_Enumerator.prototype.m_NextObject=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<556>";
	this.f__index+=1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxgroup.monkey<557>";
	var t_=dbg_array(this.f__group.m_Members(),this.f__index-1)[dbg_index];
	pop_err();
	return t_;
}
function bb_flxresourcesmanager_FlxResourcesManager2(){
	Object.call(this);
	this.f__resources=null;
}
function bb_flxresourcesmanager_FlxResourcesManager2_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<15>";
	this.f__resources=bb_map_StringMap4_new.call(new bb_map_StringMap4);
	pop_err();
	return this;
}
bb_flxresourcesmanager_FlxResourcesManager2.prototype.m_Resources=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<42>";
	pop_err();
	return this.f__resources;
}
bb_flxresourcesmanager_FlxResourcesManager2.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<46>";
	this.f__resources.m_Clear();
	pop_err();
}
bb_flxresourcesmanager_FlxResourcesManager2.prototype.m_GetResource2=function(t_name,t_loader){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<20>";
	var t_resource=this.f__resources.m_Get(t_name);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<22>";
	if(t_resource!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<23>";
		pop_err();
		return t_resource;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<26>";
	t_resource=t_loader.m_Load3(t_name);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<27>";
	if(t_resource==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<27>";
		error("Resource "+t_name+" can't be loaded");
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<29>";
	this.f__resources.m_Set5(t_name,t_resource);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<30>";
	pop_err();
	return t_resource;
}
function bb_map_Map5(){
	Object.call(this);
	this.f_root=null;
}
function bb_map_Map5_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
bb_map_Map5.prototype.m_Values=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<117>";
	var t_=bb_map_MapValues2_new.call(new bb_map_MapValues2,this);
	pop_err();
	return t_;
}
bb_map_Map5.prototype.m_FirstNode=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<137>";
	if(!((this.f_root)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<137>";
		pop_err();
		return null;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<139>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<140>";
	while((dbg_object(t_node).f_left)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<141>";
		t_node=dbg_object(t_node).f_left;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<143>";
	pop_err();
	return t_node;
}
bb_map_Map5.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<13>";
	this.f_root=null;
	pop_err();
	return 0;
}
bb_map_Map5.prototype.m_Compare=function(t_lhs,t_rhs){
}
bb_map_Map5.prototype.m_FindNode=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<157>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<160>";
		var t_cmp=this.m_Compare(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
bb_map_Map5.prototype.m_Get=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<101>";
	var t_node=this.m_FindNode(t_key);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<102>";
	if((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<102>";
		pop_err();
		return dbg_object(t_node).f_value;
	}
	pop_err();
	return null;
}
bb_map_Map5.prototype.m_RotateLeft5=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<252>";
	dbg_object(t_node).f_right=dbg_object(t_child).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).f_left)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).f_left).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<256>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<264>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<266>";
	dbg_object(t_child).f_left=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<267>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map5.prototype.m_RotateRight5=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<272>";
	dbg_object(t_node).f_left=dbg_object(t_child).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).f_right)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).f_right).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<276>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<284>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<286>";
	dbg_object(t_child).f_right=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<287>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map5.prototype.m_InsertFixup5=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).f_parent)!=null) && dbg_object(dbg_object(t_node).f_parent).f_color==-1 && ((dbg_object(dbg_object(t_node).f_parent).f_parent)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).f_parent==dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_right;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<223>";
					this.m_RotateLeft5(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<227>";
				this.m_RotateRight5(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<239>";
					this.m_RotateRight5(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<243>";
				this.m_RotateLeft5(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<247>";
	dbg_object(this.f_root).f_color=1;
	pop_err();
	return 0;
}
bb_map_Map5.prototype.m_Set5=function(t_key,t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<29>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<34>";
		t_cmp=this.m_Compare(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<40>";
				dbg_object(t_node).f_value=t_value;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<45>";
	t_node=bb_map_Node5_new.call(new bb_map_Node5,t_key,t_value,-1,t_parent);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).f_right=t_node;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).f_left=t_node;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<53>";
		this.m_InsertFixup5(t_node);
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<55>";
		this.f_root=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
function bb_map_StringMap4(){
	bb_map_Map5.call(this);
}
bb_map_StringMap4.prototype=extend_class(bb_map_Map5);
function bb_map_StringMap4_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<551>";
	bb_map_Map5_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
bb_map_StringMap4.prototype.m_Compare=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<554>";
	var t_=string_compare(t_lhs,t_rhs);
	pop_err();
	return t_;
}
function bb_map_MapValues2(){
	Object.call(this);
	this.f_map=null;
}
function bb_map_MapValues2_new(t_map){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<519>";
	dbg_object(this).f_map=t_map;
	pop_err();
	return this;
}
function bb_map_MapValues2_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<516>";
	pop_err();
	return this;
}
bb_map_MapValues2.prototype.m_ObjectEnumerator=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<523>";
	var t_=bb_map_ValueEnumerator2_new.call(new bb_map_ValueEnumerator2,this.f_map.m_FirstNode());
	pop_err();
	return t_;
}
function bb_map_ValueEnumerator2(){
	Object.call(this);
	this.f_node=null;
}
function bb_map_ValueEnumerator2_new(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<481>";
	dbg_object(this).f_node=t_node;
	pop_err();
	return this;
}
function bb_map_ValueEnumerator2_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<478>";
	pop_err();
	return this;
}
bb_map_ValueEnumerator2.prototype.m_HasNext=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<485>";
	var t_=this.f_node!=null;
	pop_err();
	return t_;
}
bb_map_ValueEnumerator2.prototype.m_NextObject=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<489>";
	var t_t=this.f_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<490>";
	this.f_node=this.f_node.m_NextNode();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<491>";
	pop_err();
	return dbg_object(t_t).f_value;
}
function bb_map_Node5(){
	Object.call(this);
	this.f_left=null;
	this.f_right=null;
	this.f_parent=null;
	this.f_value=null;
	this.f_key="";
	this.f_color=0;
}
bb_map_Node5.prototype.m_NextNode=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<385>";
	var t_node=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<386>";
	if((this.f_right)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<387>";
		t_node=this.f_right;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<388>";
		while((dbg_object(t_node).f_left)!=null){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<389>";
			t_node=dbg_object(t_node).f_left;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<391>";
		pop_err();
		return t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<393>";
	t_node=this;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<394>";
	var t_parent=dbg_object(this).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<395>";
	while(((t_parent)!=null) && t_node==dbg_object(t_parent).f_right){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<396>";
		t_node=t_parent;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<397>";
		t_parent=dbg_object(t_parent).f_parent;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<399>";
	pop_err();
	return t_parent;
}
function bb_map_Node5_new(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<364>";
	dbg_object(this).f_key=t_key;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<365>";
	dbg_object(this).f_value=t_value;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<366>";
	dbg_object(this).f_color=t_color;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<367>";
	dbg_object(this).f_parent=t_parent;
	pop_err();
	return this;
}
function bb_map_Node5_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function bb_random_Rnd(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/random.monkey<21>";
	bb_random_Seed=bb_random_Seed*1664525+1013904223|0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/random.monkey<22>";
	var t_=(bb_random_Seed>>8&16777215)/16777216.0;
	pop_err();
	return t_;
}
function bb_random_Rnd2(t_low,t_high){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/random.monkey<30>";
	var t_=bb_random_Rnd3(t_high-t_low)+t_low;
	pop_err();
	return t_;
}
function bb_random_Rnd3(t_range){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/random.monkey<26>";
	var t_=bb_random_Rnd()*t_range;
	pop_err();
	return t_;
}
function bb_flxrect_FlxRect(){
	Object.call(this);
	this.f_x=.0;
	this.f_y=.0;
	this.f_width=.0;
	this.f_height=.0;
}
function bb_flxrect_FlxRect_new(t_x,t_y,t_width,t_height){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxrect.monkey<36>";
	dbg_object(this).f_x=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxrect.monkey<37>";
	dbg_object(this).f_y=t_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxrect.monkey<38>";
	dbg_object(this).f_width=t_width;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxrect.monkey<39>";
	dbg_object(this).f_height=t_height;
	pop_err();
	return this;
}
bb_flxrect_FlxRect.prototype.m_Left=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxrect.monkey<44>";
	pop_err();
	return this.f_x;
}
bb_flxrect_FlxRect.prototype.m_Right=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxrect.monkey<49>";
	var t_=this.f_x+this.f_width;
	pop_err();
	return t_;
}
bb_flxrect_FlxRect.prototype.m_Top=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxrect.monkey<54>";
	pop_err();
	return this.f_y;
}
bb_flxrect_FlxRect.prototype.m_Bottom=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxrect.monkey<59>";
	var t_=this.f_y+this.f_height;
	pop_err();
	return t_;
}
function bb_debugpathdisplay_DebugPathDisplayClass(){
	Object.call(this);
	this.implments={bb_flxextern_FlxClass:1};
}
function bb_debugpathdisplay_DebugPathDisplayClass_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<67>";
	pop_err();
	return this;
}
bb_debugpathdisplay_DebugPathDisplayClass.prototype.m_CreateInstance=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<70>";
	var t_=(bb_debugpathdisplay_DebugPathDisplay_new.call(new bb_debugpathdisplay_DebugPathDisplay));
	pop_err();
	return t_;
}
bb_debugpathdisplay_DebugPathDisplayClass.prototype.m_InstanceOf=function(t_object){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/debugpathdisplay.monkey<74>";
	var t_=object_downcast((t_object),bb_debugpathdisplay_DebugPathDisplay)!=null;
	pop_err();
	return t_;
}
function bb_stack_Stack6(){
	Object.call(this);
	this.f_length=0;
	this.f_data=[];
}
bb_stack_Stack6.prototype.m_Length=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<38>";
	pop_err();
	return this.f_length;
}
bb_stack_Stack6.prototype.m_Get2=function(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<73>";
	var t_=dbg_array(this.f_data,t_index)[dbg_index];
	pop_err();
	return t_;
}
function bb_flxcolor_FlxColor(){
	Object.call(this);
	this.f_r=.0;
	this.f_g=.0;
	this.f_b=.0;
	this.f_a=.0;
	this.f_argb=0;
}
bb_flxcolor_FlxColor.prototype.m__parseARGB=function(t_argb){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<69>";
	this.f_r=(t_argb>>16&255);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<70>";
	this.f_g=(t_argb>>8&255);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<71>";
	this.f_b=(t_argb&255);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<72>";
	this.f_a=(t_argb>>24&255)/255.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<73>";
	dbg_object(this).f_argb=t_argb;
	pop_err();
}
function bb_flxcolor_FlxColor_new(t_argb){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<13>";
	this.m__parseARGB(t_argb);
	pop_err();
	return this;
}
function bb_flxcolor_FlxColor_ARGB(t_argb){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<58>";
	var t_=bb_flxcolor_FlxColor_new.call(new bb_flxcolor_FlxColor,t_argb);
	pop_err();
	return t_;
}
bb_flxcolor_FlxColor.prototype.m_SetARGB=function(t_argb){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<17>";
	this.m__parseARGB(t_argb);
	pop_err();
}
bb_flxcolor_FlxColor.prototype.m_SetRGB=function(t_rgb){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<21>";
	this.f_r=(t_rgb>>16&255);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<22>";
	this.f_g=(t_rgb>>8&255);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<23>";
	this.f_b=(t_rgb&255);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<24>";
	this.f_a=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<26>";
	dbg_object(this).f_argb=t_rgb|-16777216;
	pop_err();
}
bb_flxcolor_FlxColor.prototype.m_MixRGB=function(t_fore){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<30>";
	this.f_r=this.f_r*dbg_object(t_fore).f_r/255.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<31>";
	this.f_g=this.f_g*dbg_object(t_fore).f_g/255.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<32>";
	this.f_b=this.f_b*dbg_object(t_fore).f_b/255.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<33>";
	this.f_a=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<35>";
	dbg_object(this).f_argb=-16777216|((this.f_r)|0)<<16|((this.f_g)|0)<<8|((this.f_b)|0);
	pop_err();
}
bb_flxcolor_FlxColor.prototype.m_MixRGB2=function(t_back,t_fore){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<39>";
	this.f_r=dbg_object(t_back).f_r*dbg_object(t_fore).f_r/255.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<40>";
	this.f_g=dbg_object(t_back).f_g*dbg_object(t_fore).f_g/255.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<41>";
	this.f_b=dbg_object(t_back).f_b*dbg_object(t_fore).f_b/255.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<42>";
	this.f_a=1.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxcolor.monkey<44>";
	dbg_object(this).f_argb=-16777216|((this.f_r)|0)<<16|((this.f_g)|0)<<8|((this.f_b)|0);
	pop_err();
}
function bb_keyrecord_KeyRecord(){
	Object.call(this);
	this.f_value=0;
	this.f_code=0;
}
function bb_keyrecord_KeyRecord_new(t_code,t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/keyrecord.monkey<7>";
	dbg_object(this).f_code=t_code;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/keyrecord.monkey<8>";
	dbg_object(this).f_value=t_value;
	pop_err();
	return this;
}
function bb_keyrecord_KeyRecord_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/keyrecord.monkey<1>";
	pop_err();
	return this;
}
function bb_stack_Stack7(){
	Object.call(this);
	this.f_length=0;
	this.f_data=[];
}
bb_stack_Stack7.prototype.m_Length=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<38>";
	pop_err();
	return this.f_length;
}
bb_stack_Stack7.prototype.m_Get2=function(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<73>";
	var t_=dbg_array(this.f_data,t_index)[dbg_index];
	pop_err();
	return t_;
}
function bb_stack_Stack7_new(){
	push_err();
	pop_err();
	return this;
}
function bb_stack_Stack7_new2(t_data){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<13>";
	dbg_object(this).f_data=t_data.slice(0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<14>";
	dbg_object(this).f_length=t_data.length;
	pop_err();
	return this;
}
bb_stack_Stack7.prototype.m_Push3=function(t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<52>";
	if(this.f_length==this.f_data.length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<53>";
		this.f_data=resize_object_array(this.f_data,this.f_length*2+10);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<55>";
	dbg_array(this.f_data,this.f_length)[dbg_index]=t_value
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<56>";
	this.f_length+=1;
	pop_err();
	return 0;
}
function bb_xyrecord_XYRecord(){
	Object.call(this);
	this.f_x=0;
	this.f_y=0;
}
function bb_xyrecord_XYRecord_new(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/xyrecord.monkey<10>";
	dbg_object(this).f_x=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/xyrecord.monkey<11>";
	dbg_object(this).f_y=t_y;
	pop_err();
	return this;
}
function bb_xyrecord_XYRecord_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/xyrecord.monkey<3>";
	pop_err();
	return this;
}
function bb_xyzrecord_XYZRecord(){
	Object.call(this);
	this.f_x=.0;
	this.f_y=.0;
	this.f_z=.0;
}
function bb_xyzrecord_XYZRecord_new(t_x,t_y,t_z){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/xyzrecord.monkey<12>";
	dbg_object(this).f_x=t_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/xyzrecord.monkey<13>";
	dbg_object(this).f_y=t_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/xyzrecord.monkey<14>";
	dbg_object(this).f_z=t_z;
	pop_err();
	return this;
}
function bb_xyzrecord_XYZRecord_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/replay/xyzrecord.monkey<3>";
	pop_err();
	return this;
}
function bb_stack_Stack8(){
	Object.call(this);
	this.f_length=0;
	this.f_data=[];
}
bb_stack_Stack8.prototype.m_Length=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<38>";
	pop_err();
	return this.f_length;
}
bb_stack_Stack8.prototype.m_Get2=function(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<73>";
	var t_=dbg_array(this.f_data,t_index)[dbg_index];
	pop_err();
	return t_;
}
function bb_stack_Stack9(){
	Object.call(this);
	this.f_data=[];
	this.f_length=0;
}
bb_stack_Stack9.prototype.m_Get2=function(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<73>";
	var t_=dbg_array(this.f_data,t_index)[dbg_index];
	pop_err();
	return t_;
}
function bb_stack_Stack9_new(){
	push_err();
	pop_err();
	return this;
}
function bb_stack_Stack9_new2(t_data){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<13>";
	dbg_object(this).f_data=t_data.slice(0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<14>";
	dbg_object(this).f_length=t_data.length;
	pop_err();
	return this;
}
bb_stack_Stack9.prototype.m_Insert=function(t_index,t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<77>";
	if(this.f_length==this.f_data.length){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<78>";
		this.f_data=resize_object_array(this.f_data,this.f_length*2+10);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<80>";
	for(var t_i=this.f_length;t_i>t_index;t_i=t_i+-1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<81>";
		dbg_array(this.f_data,t_i)[dbg_index]=dbg_array(this.f_data,t_i-1)[dbg_index]
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<83>";
	dbg_array(this.f_data,t_index)[dbg_index]=t_value
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<84>";
	this.f_length+=1;
	pop_err();
	return 0;
}
function bb_flxdebugger_FlxDebugger(){
	Object.call(this);
	this.f_hasMouse=false;
}
function bb_timermanager_TimerManagerClass(){
	Object.call(this);
	this.implments={bb_flxextern_FlxClass:1};
}
function bb_timermanager_TimerManagerClass_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<66>";
	pop_err();
	return this;
}
bb_timermanager_TimerManagerClass.prototype.m_CreateInstance=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<69>";
	var t_=(bb_timermanager_TimerManager_new.call(new bb_timermanager_TimerManager));
	pop_err();
	return t_;
}
bb_timermanager_TimerManagerClass.prototype.m_InstanceOf=function(t_object){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/timermanager.monkey<73>";
	var t_=object_downcast((t_object),bb_timermanager_TimerManager)!=null;
	pop_err();
	return t_;
}
function bb_input2_KeyDown(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<73>";
	var t_=bb_input2_device.KeyDown(t_key);
	pop_err();
	return t_;
}
function bb_input2_AccelX(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<160>";
	var t_=bb_input2_device.AccelX();
	pop_err();
	return t_;
}
function bb_input2_AccelY(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<164>";
	var t_=bb_input2_device.AccelY();
	pop_err();
	return t_;
}
function bb_input2_AccelZ(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<168>";
	var t_=bb_input2_device.AccelZ();
	pop_err();
	return t_;
}
function bb_input2_TouchX(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<109>";
	var t_=bb_input2_device.TouchX(t_index);
	pop_err();
	return t_;
}
function bb_input2_TouchY(t_index){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<113>";
	var t_=bb_input2_device.TouchY(t_index);
	pop_err();
	return t_;
}
function bb_input2_MouseX(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<92>";
	var t_=bb_input2_device.MouseX();
	pop_err();
	return t_;
}
function bb_input2_MouseY(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<96>";
	var t_=bb_input2_device.MouseY();
	pop_err();
	return t_;
}
function bb_flxu_FlxU(){
	Object.call(this);
}
function bb_flxu_FlxU_GetDistance(t_point1,t_point2){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<403>";
	var t_dx=dbg_object(t_point1).f_x-dbg_object(t_point2).f_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<404>";
	var t_dy=dbg_object(t_point1).f_y-dbg_object(t_point2).f_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<406>";
	var t_=Math.sqrt(t_dx*t_dx+t_dy*t_dy);
	pop_err();
	return t_;
}
function bb_flxu_FlxU_GetDistance2(t_x1,t_y1,t_x2,t_y2){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<410>";
	var t_dx=t_x1-t_x2;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<411>";
	var t_dy=t_y1-t_y2;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<413>";
	var t_=Math.sqrt(t_dx*t_dx+t_dy*t_dy);
	pop_err();
	return t_;
}
function bb_flxu_FlxU_Srand(t_seed){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<57>";
	var t_=(((t_seed)|0)>>8&16777215)/16777216.0;
	pop_err();
	return t_;
}
function bb_flxu_FlxU_Round(t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<37>";
	if(t_value>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<38>";
		var t_=((t_value+.5)|0);
		pop_err();
		return t_;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<40>";
		var t_2=((t_value-.5)|0);
		pop_err();
		return t_2;
	}
}
function bb_flxu_FlxU_GetAngle(t_point1,t_point2){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<371>";
	var t_x=dbg_object(t_point2).f_x-dbg_object(t_point1).f_x;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<372>";
	var t_y=dbg_object(t_point2).f_y-dbg_object(t_point1).f_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<374>";
	if(t_x==0.0 && t_y==0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<374>";
		pop_err();
		return 0.0;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<376>";
	var t_c1=0.78539816250000005;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<377>";
	var t_c2=3.0*t_c1;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<378>";
	var t_ay=bb_math_Abs2(t_y);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<379>";
	var t_angle=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<381>";
	if(t_x>=0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<382>";
		t_angle=t_c1-t_c1*((t_x-t_ay)/(t_x+t_ay));
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<384>";
		t_angle=t_c2-t_c1*((t_x+t_ay)/(t_ay-t_x));
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<387>";
	if(t_y<0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<388>";
		t_angle=-t_angle*57.2957796;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<390>";
		t_angle=t_angle*57.2957796;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<393>";
	if(t_angle>90.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<394>";
		t_angle=t_angle-270.0;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<396>";
		t_angle=t_angle+90.0;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<399>";
	pop_err();
	return t_angle;
}
function bb_flxu_FlxU_RotatePoint(t_x,t_y,t_pivotX,t_pivotY,t_angle,t_point){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<313>";
	var t_sin=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<314>";
	var t_cos=0.0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<315>";
	var t_radians=t_angle*-0.017453293;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<317>";
	while(t_radians<-3.14159265){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<318>";
		t_radians+=6.28318531;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<321>";
	while(t_radians>3.14159265){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<322>";
		t_radians=t_radians-6.28318531;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<325>";
	if(t_radians<0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<326>";
		t_sin=1.27323954*t_radians+.405284735*t_radians*t_radians;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<327>";
		if(t_sin<0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<328>";
			t_sin=.225*(t_sin*-t_sin-t_sin)+t_sin;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<330>";
			t_sin=.225*(t_sin*t_sin-t_sin)+t_sin;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<333>";
		t_sin=1.27323954*t_radians-0.405284735*t_radians*t_radians;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<334>";
		if(t_sin<0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<335>";
			t_sin=.225*(t_sin*-t_sin-t_sin)+t_sin;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<337>";
			t_sin=.225*(t_sin*t_sin-t_sin)+t_sin;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<341>";
	t_radians+=1.57079633;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<342>";
	if(t_radians>3.14159265){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<342>";
		t_radians-=6.28318531;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<344>";
	if(t_radians<0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<345>";
		t_cos=1.27323954*t_radians+0.405284735*t_radians*t_radians;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<346>";
		if(t_cos<0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<347>";
			t_cos=.225*(t_cos*-t_cos-t_cos)+t_cos;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<349>";
			t_cos=.225*(t_cos*t_cos-t_cos)+t_cos;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<352>";
		t_cos=1.27323954*t_radians-0.405284735*t_radians*t_radians;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<353>";
		if(t_cos<0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<354>";
			t_cos=.225*(t_cos*-t_cos-t_cos)+t_cos;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<356>";
			t_cos=.225*(t_cos*t_cos-t_cos)+t_cos;
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<360>";
	var t_dx=t_x-t_pivotX;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<361>";
	var t_dy=t_pivotY+t_y;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<363>";
	if(t_point==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<363>";
		t_point=bb_flxpoint_FlxPoint_new.call(new bb_flxpoint_FlxPoint,0.0,0.0);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<364>";
	dbg_object(t_point).f_x=t_pivotX+t_cos*t_dx-t_sin*t_dy;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<365>";
	dbg_object(t_point).f_y=t_pivotY-t_sin*t_dx-t_cos*t_dy;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<367>";
	pop_err();
	return t_point;
}
function bb_flxu_FlxU_ComputeVelocity(t_velocity,t_acceleration,t_drag,t_max){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<286>";
	if(t_acceleration!=0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<287>";
		t_velocity+=t_acceleration*bb_flxg_FlxG_Elapsed;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<289>";
		if(t_drag!=0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<290>";
			t_drag*=bb_flxg_FlxG_Elapsed;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<292>";
			if(t_velocity-t_drag>0.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<293>";
				t_velocity-=t_drag;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<294>";
				if(t_velocity+t_drag<0.0){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<295>";
					t_velocity+=t_drag;
				}else{
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<297>";
					t_velocity=0.0;
				}
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<301>";
	if(t_velocity!=0.0 && t_max!=10000.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<302>";
		if(t_velocity>t_max){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<303>";
			t_velocity=t_max;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<304>";
			if(t_velocity<-t_max){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<305>";
				t_velocity=-t_max;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxu.monkey<309>";
	pop_err();
	return t_velocity;
}
function bb_audio_PauseChannel(t_channel){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<77>";
	bb_audio_device.PauseChannel(t_channel);
	pop_err();
	return 0;
}
function bb_audio_SetChannelVolume(t_channel,t_volume){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<89>";
	bb_audio_device.SetVolume(t_channel,t_volume);
	pop_err();
	return 0;
}
function bb_audio_SetChannelPan(t_channel,t_pan){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<93>";
	bb_audio_device.SetPan(t_channel,t_pan);
	pop_err();
	return 0;
}
function bb_input2_KeyHit(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<77>";
	var t_=bb_input2_device.KeyHit(t_key);
	pop_err();
	return t_;
}
function bb_flxsound_FlxSoundClass(){
	Object.call(this);
	this.implments={bb_flxextern_FlxClass:1};
}
function bb_flxsound_FlxSoundClass_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<385>";
	pop_err();
	return this;
}
bb_flxsound_FlxSoundClass.prototype.m_CreateInstance=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<388>";
	var t_=(bb_flxsound_FlxSound_new.call(new bb_flxsound_FlxSound));
	pop_err();
	return t_;
}
bb_flxsound_FlxSoundClass.prototype.m_InstanceOf=function(t_object){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<392>";
	var t_=object_downcast((t_object),bb_flxsound_FlxSound)!=null;
	pop_err();
	return t_;
}
function bb_audio_ChannelState(t_channel){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<85>";
	var t_=bb_audio_device.ChannelState(t_channel);
	pop_err();
	return t_;
}
function bb_flxresourcesmanager_FlxResourceLoader(){
	Object.call(this);
}
function bb_flxresourcesmanager_FlxResourceLoader_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<3>";
	pop_err();
	return this;
}
bb_flxresourcesmanager_FlxResourceLoader.prototype.m_Load3=function(t_name){
}
function bb_flxsound_FlxSoundLoader(){
	bb_flxresourcesmanager_FlxResourceLoader.call(this);
}
bb_flxsound_FlxSoundLoader.prototype=extend_class(bb_flxresourcesmanager_FlxResourceLoader);
function bb_flxsound_FlxSoundLoader_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<397>";
	bb_flxresourcesmanager_FlxResourceLoader_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<397>";
	pop_err();
	return this;
}
bb_flxsound_FlxSoundLoader.prototype.m_Load3=function(t_name){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsound.monkey<400>";
	var t_=bb_audio_LoadSound(bb_flxassetsmanager_FlxAssetsManager_GetSoundPath(t_name));
	pop_err();
	return t_;
}
function bb_audio_PlaySound(t_sound,t_channel,t_flags){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<69>";
	if((dbg_object(t_sound).f_sample)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<69>";
		bb_audio_device.PlaySample(dbg_object(t_sound).f_sample,t_channel,t_flags);
	}
	pop_err();
	return 0;
}
function bb_audio_ResumeChannel(t_channel){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<81>";
	bb_audio_device.ResumeChannel(t_channel);
	pop_err();
	return 0;
}
function bb_app_Millisecs(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/app.monkey<149>";
	var t_=bb_app_device.MilliSecs();
	pop_err();
	return t_;
}
function bb_graphics_DebugRenderDevice(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<240>";
	if(!((bb_graphics_renderDevice)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<240>";
		error("Rendering operations can only be performed inside OnRender");
	}
	pop_err();
	return 0;
}
function bb_graphics_Cls(t_r,t_g,t_b){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<390>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<392>";
	bb_graphics_renderDevice.Cls(t_r,t_g,t_b);
	pop_err();
	return 0;
}
function bb_graphics_Transform(t_ix,t_iy,t_jx,t_jy,t_tx,t_ty){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<367>";
	var t_ix2=t_ix*dbg_object(bb_graphics_context).f_ix+t_iy*dbg_object(bb_graphics_context).f_jx;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<368>";
	var t_iy2=t_ix*dbg_object(bb_graphics_context).f_iy+t_iy*dbg_object(bb_graphics_context).f_jy;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<369>";
	var t_jx2=t_jx*dbg_object(bb_graphics_context).f_ix+t_jy*dbg_object(bb_graphics_context).f_jx;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<370>";
	var t_jy2=t_jx*dbg_object(bb_graphics_context).f_iy+t_jy*dbg_object(bb_graphics_context).f_jy;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<371>";
	var t_tx2=t_tx*dbg_object(bb_graphics_context).f_ix+t_ty*dbg_object(bb_graphics_context).f_jx+dbg_object(bb_graphics_context).f_tx;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<372>";
	var t_ty2=t_tx*dbg_object(bb_graphics_context).f_iy+t_ty*dbg_object(bb_graphics_context).f_jy+dbg_object(bb_graphics_context).f_ty;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<373>";
	bb_graphics_SetMatrix(t_ix2,t_iy2,t_jx2,t_jy2,t_tx2,t_ty2);
	pop_err();
	return 0;
}
function bb_graphics_Transform2(t_m){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<363>";
	bb_graphics_Transform(dbg_array(t_m,0)[dbg_index],dbg_array(t_m,1)[dbg_index],dbg_array(t_m,2)[dbg_index],dbg_array(t_m,3)[dbg_index],dbg_array(t_m,4)[dbg_index],dbg_array(t_m,5)[dbg_index]);
	pop_err();
	return 0;
}
function bb_graphics_Scale(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<381>";
	bb_graphics_Transform(t_x,0.0,0.0,t_y,0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_GetBlend(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<311>";
	pop_err();
	return dbg_object(bb_graphics_context).f_blend;
}
function bb_graphics_GetAlpha(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<302>";
	pop_err();
	return dbg_object(bb_graphics_context).f_alpha;
}
function bb_graphics_PushMatrix(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<346>";
	var t_sp=dbg_object(bb_graphics_context).f_matrixSp;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<347>";
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+0)[dbg_index]=dbg_object(bb_graphics_context).f_ix
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<348>";
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+1)[dbg_index]=dbg_object(bb_graphics_context).f_iy
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<349>";
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+2)[dbg_index]=dbg_object(bb_graphics_context).f_jx
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<350>";
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+3)[dbg_index]=dbg_object(bb_graphics_context).f_jy
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<351>";
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+4)[dbg_index]=dbg_object(bb_graphics_context).f_tx
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<352>";
	dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+5)[dbg_index]=dbg_object(bb_graphics_context).f_ty
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<353>";
	dbg_object(bb_graphics_context).f_matrixSp=t_sp+6;
	pop_err();
	return 0;
}
function bb_graphics_Translate(t_x,t_y){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<377>";
	bb_graphics_Transform(1.0,0.0,0.0,1.0,t_x,t_y);
	pop_err();
	return 0;
}
function bb_graphics_ValidateMatrix(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<233>";
	if((dbg_object(bb_graphics_context).f_matDirty)!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<234>";
		dbg_object(bb_graphics_context).f_device.SetMatrix(dbg_object(bb_graphics_context).f_ix,dbg_object(bb_graphics_context).f_iy,dbg_object(bb_graphics_context).f_jx,dbg_object(bb_graphics_context).f_jy,dbg_object(bb_graphics_context).f_tx,dbg_object(bb_graphics_context).f_ty);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<235>";
		dbg_object(bb_graphics_context).f_matDirty=0;
	}
	pop_err();
	return 0;
}
function bb_graphics_DrawRect(t_x,t_y,t_w,t_h){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<405>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<407>";
	bb_graphics_ValidateMatrix();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<408>";
	bb_graphics_renderDevice.DrawRect(t_x,t_y,t_w,t_h);
	pop_err();
	return 0;
}
function bb_map_Map6(){
	Object.call(this);
	this.f_root=null;
}
bb_map_Map6.prototype.m_Compare2=function(t_lhs,t_rhs){
}
bb_map_Map6.prototype.m_FindNode2=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<157>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<160>";
		var t_cmp=this.m_Compare2(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
bb_map_Map6.prototype.m_Contains=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<25>";
	var t_=this.m_FindNode2(t_key)!=null;
	pop_err();
	return t_;
}
function bb_map_Node6(){
	Object.call(this);
	this.f_key=0;
	this.f_right=null;
	this.f_left=null;
}
function bb_graphics_PopMatrix(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<357>";
	var t_sp=dbg_object(bb_graphics_context).f_matrixSp-6;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<358>";
	bb_graphics_SetMatrix(dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+0)[dbg_index],dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+1)[dbg_index],dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+2)[dbg_index],dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+3)[dbg_index],dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+4)[dbg_index],dbg_array(dbg_object(bb_graphics_context).f_matrixStack,t_sp+5)[dbg_index]);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<359>";
	dbg_object(bb_graphics_context).f_matrixSp=t_sp;
	pop_err();
	return 0;
}
function bb_graphics_DrawImage(t_image,t_x,t_y,t_frame){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<453>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<455>";
	var t_f=dbg_array(dbg_object(t_image).f_frames,t_frame)[dbg_index];
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<457>";
	if((dbg_object(bb_graphics_context).f_tformed)!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<458>";
		bb_graphics_PushMatrix();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<460>";
		bb_graphics_Translate(t_x-dbg_object(t_image).f_tx,t_y-dbg_object(t_image).f_ty);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<462>";
		bb_graphics_ValidateMatrix();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<464>";
		if((dbg_object(t_image).f_flags&65536)!=0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<465>";
			dbg_object(bb_graphics_context).f_device.DrawSurface(dbg_object(t_image).f_surface,0.0,0.0);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<467>";
			dbg_object(bb_graphics_context).f_device.DrawSurface2(dbg_object(t_image).f_surface,0.0,0.0,dbg_object(t_f).f_x,dbg_object(t_f).f_y,dbg_object(t_image).f_width,dbg_object(t_image).f_height);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<470>";
		bb_graphics_PopMatrix();
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<472>";
		bb_graphics_ValidateMatrix();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<474>";
		if((dbg_object(t_image).f_flags&65536)!=0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<475>";
			dbg_object(bb_graphics_context).f_device.DrawSurface(dbg_object(t_image).f_surface,t_x-dbg_object(t_image).f_tx,t_y-dbg_object(t_image).f_ty);
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<477>";
			dbg_object(bb_graphics_context).f_device.DrawSurface2(dbg_object(t_image).f_surface,t_x-dbg_object(t_image).f_tx,t_y-dbg_object(t_image).f_ty,dbg_object(t_f).f_x,dbg_object(t_f).f_y,dbg_object(t_image).f_width,dbg_object(t_image).f_height);
		}
	}
	pop_err();
	return 0;
}
function bb_graphics_Rotate(t_angle){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<385>";
	bb_graphics_Transform(Math.cos((t_angle)*D2R),-Math.sin((t_angle)*D2R),Math.sin((t_angle)*D2R),Math.cos((t_angle)*D2R),0.0,0.0);
	pop_err();
	return 0;
}
function bb_graphics_DrawImage2(t_image,t_x,t_y,t_rotation,t_scaleX,t_scaleY,t_frame){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<484>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<486>";
	var t_f=dbg_array(dbg_object(t_image).f_frames,t_frame)[dbg_index];
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<488>";
	bb_graphics_PushMatrix();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<490>";
	bb_graphics_Translate(t_x,t_y);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<491>";
	bb_graphics_Rotate(t_rotation);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<492>";
	bb_graphics_Scale(t_scaleX,t_scaleY);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<494>";
	bb_graphics_Translate(-dbg_object(t_image).f_tx,-dbg_object(t_image).f_ty);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<496>";
	bb_graphics_ValidateMatrix();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<498>";
	if((dbg_object(t_image).f_flags&65536)!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<499>";
		dbg_object(bb_graphics_context).f_device.DrawSurface(dbg_object(t_image).f_surface,0.0,0.0);
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<501>";
		dbg_object(bb_graphics_context).f_device.DrawSurface2(dbg_object(t_image).f_surface,0.0,0.0,dbg_object(t_f).f_x,dbg_object(t_f).f_y,dbg_object(t_image).f_width,dbg_object(t_image).f_height);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<504>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
function bb_audio_PauseMusic(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<109>";
	bb_audio_device.PauseMusic();
	pop_err();
	return 0;
}
function bb_audio_StopMusic(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<105>";
	bb_audio_device.StopMusic();
	pop_err();
	return 0;
}
function bb_audio_PlayMusic(t_path,t_flags){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<101>";
	var t_=bb_audio_device.PlayMusic(t_path,t_flags);
	pop_err();
	return t_;
}
function bb_audio_ResumeMusic(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<113>";
	bb_audio_device.ResumeMusic();
	pop_err();
	return 0;
}
function bb_fptflxcolor_FptFlxColor(){
	Object.call(this);
}
function bb_fptflxcolor_FptFlxColor_GetColor32(t_alpha,t_red,t_green,t_blue){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<398>";
	var t_=t_alpha<<24|t_red<<16|t_green<<8|t_blue;
	pop_err();
	return t_;
}
function bb_fptflxcolor_FptFlxColor_HSVtoRGB(t_h,t_s,t_v,t_alpha){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<223>";
	var t_result=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<225>";
	if(t_s==0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<226>";
		t_result=bb_fptflxcolor_FptFlxColor_GetColor32(t_alpha,((t_v*255.0)|0),((t_v*255.0)|0),((t_v*255.0)|0));
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<228>";
		t_h=t_h/60.0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<229>";
		var t_f=t_h-((t_h)|0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<230>";
		var t_p=t_v*(1.0-t_s);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<231>";
		var t_q=t_v*(1.0-t_s*t_f);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<232>";
		var t_t=t_v*(1.0-t_s*(1.0-t_f));
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<234>";
		var t_=((t_h)|0);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<235>";
		if(t_==0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<236>";
			t_result=bb_fptflxcolor_FptFlxColor_GetColor32(t_alpha,((t_v*255.0)|0),((t_t*255.0)|0),((t_p*255.0)|0));
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<237>";
			if(t_==1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<238>";
				t_result=bb_fptflxcolor_FptFlxColor_GetColor32(t_alpha,((t_q*255.0)|0),((t_v*255.0)|0),((t_p*255.0)|0));
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<239>";
				if(t_==2){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<240>";
					t_result=bb_fptflxcolor_FptFlxColor_GetColor32(t_alpha,((t_p*255.0)|0),((t_v*255.0)|0),((t_t*255.0)|0));
				}else{
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<241>";
					if(t_==3){
						err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<242>";
						t_result=bb_fptflxcolor_FptFlxColor_GetColor32(t_alpha,((t_p*255.0)|0),((t_q*255.0)|0),((t_v*255.0)|0));
					}else{
						err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<243>";
						if(t_==4){
							err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<244>";
							t_result=bb_fptflxcolor_FptFlxColor_GetColor32(t_alpha,((t_t*255.0)|0),((t_p*255.0)|0),((t_v*255.0)|0));
						}else{
							err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<245>";
							if(t_==5){
								err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<246>";
								t_result=bb_fptflxcolor_FptFlxColor_GetColor32(t_alpha,((t_v*255.0)|0),((t_p*255.0)|0),((t_q*255.0)|0));
							}else{
								err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<248>";
								bb_flxg_FlxG_Log("FlxColor Error: HSVtoRGB : Unknown color");
							}
						}
					}
				}
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<252>";
	pop_err();
	return t_result;
}
function bb_fptflxcolor_FptFlxColor_GetHSVColorWheel(t_alpha){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<30>";
	var t_colors=new_number_array(359);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<32>";
	for(var t_c=0;t_c<359;t_c=t_c+1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<33>";
		dbg_array(t_colors,t_c)[dbg_index]=bb_fptflxcolor_FptFlxColor_HSVtoRGB((t_c),1.0,1.0,t_alpha)
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/plugin/photonstorm/fptflxcolor.monkey<36>";
	pop_err();
	return t_colors;
}
function bb_flxanim_FlxAnim(){
	Object.call(this);
	this.f_delay=.0;
	this.f_looped=false;
	this.f_frames=[];
	this.f_name="";
}
function bb_map_Map7(){
	Object.call(this);
	this.f_root=null;
}
function bb_map_Map7_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<7>";
	pop_err();
	return this;
}
bb_map_Map7.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<13>";
	this.f_root=null;
	pop_err();
	return 0;
}
function bb_map_StringMap5(){
	bb_map_Map7.call(this);
}
bb_map_StringMap5.prototype=extend_class(bb_map_Map7);
function bb_map_StringMap5_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<551>";
	bb_map_Map7_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<551>";
	pop_err();
	return this;
}
function bb_flxresourcesmanager_FlxResourceLoader2(){
	Object.call(this);
}
function bb_flxresourcesmanager_FlxResourceLoader2_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxresourcesmanager.monkey<3>";
	pop_err();
	return this;
}
bb_flxresourcesmanager_FlxResourceLoader2.prototype.m_Load3=function(t_name){
}
function bb_flxsprite_FlxGraphicLoader(){
	bb_flxresourcesmanager_FlxResourceLoader2.call(this);
	this.f_name="";
	this.f_animated=false;
	this.f_width=.0;
	this.f_height=.0;
}
bb_flxsprite_FlxGraphicLoader.prototype=extend_class(bb_flxresourcesmanager_FlxResourceLoader2);
function bb_flxsprite_FlxGraphicLoader_new(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<589>";
	bb_flxresourcesmanager_FlxResourceLoader2_new.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<589>";
	pop_err();
	return this;
}
bb_flxsprite_FlxGraphicLoader.prototype.m_Load3=function(t_name){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<597>";
	var t_image=bb_graphics_LoadImage(bb_flxassetsmanager_FlxAssetsManager_GetImagePath(dbg_object(this).f_name),1,bb_graphics_Image_DefaultFlags);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<599>";
	if(!this.f_animated){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<600>";
		pop_err();
		return t_image;
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<602>";
		var t_frames=0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<604>";
		if(this.f_width==0.0 && this.f_height==0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<605>";
			this.f_width=(t_image.m_Height());
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<606>";
			if(this.f_width==0.0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<607>";
				this.f_width=this.f_height;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<608>";
				if(this.f_height==0.0){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<609>";
					this.f_height=this.f_width;
				}
			}
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<612>";
		if(this.f_height==0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<613>";
			t_frames=((Math.ceil((t_image.m_Width())/this.f_width))|0);
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<614>";
			this.f_height=this.f_width;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<616>";
			t_frames=((Math.ceil((t_image.m_Width()*t_image.m_Height())/(this.f_width*this.f_height)))|0);
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxsprite.monkey<619>";
		var t_=t_image.m_GrabImage(0,0,((this.f_width)|0),((this.f_height)|0),t_frames,bb_graphics_Image_DefaultFlags);
		pop_err();
		return t_;
	}
}
function bb_graphics_DrawLine(t_x1,t_y1,t_x2,t_y2){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<413>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<415>";
	bb_graphics_ValidateMatrix();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<416>";
	bb_graphics_renderDevice.DrawLine(t_x1,t_y1,t_x2,t_y2);
	pop_err();
	return 0;
}
function bb_input2_JoyX(t_index,t_unit){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<140>";
	var t_=bb_input2_device.JoyX(t_index|t_unit<<4);
	pop_err();
	return t_;
}
function bb_input2_JoyY(t_index,t_unit){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<144>";
	var t_=bb_input2_device.JoyY(t_index|t_unit<<4);
	pop_err();
	return t_;
}
function bb_input2_JoyZ(t_index,t_unit){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/input.monkey<148>";
	var t_=bb_input2_device.JoyZ(t_index|t_unit<<4);
	pop_err();
	return t_;
}
function bb_math_Abs(t_x){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<46>";
	if(t_x>=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<46>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<47>";
	var t_=-t_x;
	pop_err();
	return t_;
}
function bb_math_Abs2(t_x){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<73>";
	if(t_x>=0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<73>";
		pop_err();
		return t_x;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/math.monkey<74>";
	var t_=-t_x;
	pop_err();
	return t_;
}
function bb_map_Node7(){
	Object.call(this);
}
function bb_driver_FlxTextDriver(){
	Object.call(this);
	this.f__textLines=null;
}
bb_driver_FlxTextDriver.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext/driver.monkey<91>";
	var t_l=this.f__textLines.m_Length();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext/driver.monkey<92>";
	for(var t_i=0;t_i<t_l;t_i=t_i+1){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext/driver.monkey<93>";
		this.f__textLines.m_Set6(t_i,null);
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/flxtext/driver.monkey<96>";
	this.f__textLines.m_Clear();
	pop_err();
}
bb_driver_FlxTextDriver.prototype.m_Draw2=function(t_x,t_y){
}
function bb_driver_FlxTextDriverTextLine(){
	Object.call(this);
}
function bb_stack_Stack10(){
	Object.call(this);
	this.f_length=0;
	this.f_data=[];
}
bb_stack_Stack10.prototype.m_Length=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<38>";
	pop_err();
	return this.f_length;
}
bb_stack_Stack10.prototype.m_Set6=function(t_index,t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<69>";
	dbg_array(this.f_data,t_index)[dbg_index]=t_value
	pop_err();
	return 0;
}
bb_stack_Stack10.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/stack.monkey<34>";
	this.f_length=0;
	pop_err();
	return 0;
}
function bb_flxtilemapbuffer_FlxTilemapBuffer(){
	Object.call(this);
	this.f_columns=0;
	this.f_rows=0;
	this.f_width=.0;
	this.f_height=.0;
	this.f_dirty=false;
	this.f_scaleFixX=.0;
	this.f_scaleFixY=.0;
	this.f_x=.0;
	this.f_y=.0;
}
function bb_flxtilemapbuffer_FlxTilemapBuffer_new(t_tileWidth,t_tileHeight,t_widthInTiles,t_heightInTiles,t_camera){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<28>";
	if(t_camera==null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<28>";
		t_camera=bb_flxg_FlxG_Camera;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<30>";
	this.f_columns=((Math.ceil(t_camera.m_Width()/t_tileWidth)+1.0)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<31>";
	if(this.f_columns>t_widthInTiles){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<31>";
		this.f_columns=t_widthInTiles;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<33>";
	this.f_rows=((Math.ceil(t_camera.m_Height()/t_tileHeight)+1.0)|0);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<34>";
	if(this.f_rows>t_heightInTiles){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<34>";
		this.f_rows=t_heightInTiles;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<36>";
	this.f_width=(this.f_columns)*t_tileWidth;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<37>";
	this.f_height=(this.f_rows)*t_tileHeight;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<39>";
	this.f_dirty=true;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<41>";
	var t_scaledTileWidth=t_tileWidth*t_camera.m_Zoom()*bb_flxg_FlxG__DeviceScaleFactorX;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<42>";
	var t_scaledTileHeight=t_tileHeight*t_camera.m_Zoom()*bb_flxg_FlxG__DeviceScaleFactorY;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<43>";
	var t_roundScaledTileWidth=bb_flxu_FlxU_Round(t_scaledTileWidth);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<44>";
	var t_roundScaledTileHeight=bb_flxu_FlxU_Round(t_scaledTileHeight);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<46>";
	if(bb_math_Abs2(t_roundScaledTileWidth-t_scaledTileWidth)>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<47>";
		t_roundScaledTileWidth=t_roundScaledTileWidth+1.0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<49>";
		if(t_roundScaledTileWidth-t_scaledTileWidth>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<50>";
			this.f_scaleFixX=t_roundScaledTileWidth/t_scaledTileWidth;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<52>";
			this.f_scaleFixX=t_scaledTileWidth/t_roundScaledTileWidth;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<55>";
		this.f_scaleFixX=1.0;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<58>";
	if(bb_math_Abs2(t_roundScaledTileHeight-t_scaledTileHeight)>0.0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<59>";
		t_roundScaledTileHeight=t_roundScaledTileHeight+1.0;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<61>";
		if(t_roundScaledTileHeight-t_scaledTileHeight>0.0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<62>";
			this.f_scaleFixY=t_roundScaledTileHeight/t_scaledTileHeight;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<64>";
			this.f_scaleFixY=t_scaledTileHeight/t_roundScaledTileHeight;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<67>";
		this.f_scaleFixY=1.0;
	}
	pop_err();
	return this;
}
function bb_flxtilemapbuffer_FlxTilemapBuffer_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtilemapbuffer.monkey<7>";
	pop_err();
	return this;
}
function bb_flxtile_FlxTile(){
	bb_flxobject_FlxObject.call(this);
	this.f_callback=null;
	this.f_tilemap=null;
	this.f_filter=null;
}
bb_flxtile_FlxTile.prototype=extend_class(bb_flxobject_FlxObject);
bb_flxtile_FlxTile.prototype.m_Destroy=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtile.monkey<35>";
	bb_flxobject_FlxObject.prototype.m_Destroy.call(this);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtile.monkey<36>";
	this.f_callback=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtile.monkey<37>";
	this.f_tilemap=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/flixel/system/flxtile.monkey<38>";
	this.f_filter=null;
	pop_err();
}
function bb_map_Map8(){
	Object.call(this);
	this.f_root=null;
}
bb_map_Map8.prototype.m_Clear=function(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<13>";
	this.f_root=null;
	pop_err();
	return 0;
}
bb_map_Map8.prototype.m_Compare2=function(t_lhs,t_rhs){
}
bb_map_Map8.prototype.m_FindNode2=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<157>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<159>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<160>";
		var t_cmp=this.m_Compare2(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<161>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<162>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<163>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<164>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<166>";
				pop_err();
				return t_node;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<169>";
	pop_err();
	return t_node;
}
bb_map_Map8.prototype.m_Get2=function(t_key){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<101>";
	var t_node=this.m_FindNode2(t_key);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<102>";
	if((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<102>";
		pop_err();
		return dbg_object(t_node).f_value;
	}
	pop_err();
	return null;
}
bb_map_Map8.prototype.m_RotateLeft6=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<251>";
	var t_child=dbg_object(t_node).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<252>";
	dbg_object(t_node).f_right=dbg_object(t_child).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<253>";
	if((dbg_object(t_child).f_left)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<254>";
		dbg_object(dbg_object(t_child).f_left).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<256>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<257>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<258>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<259>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<261>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<264>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<266>";
	dbg_object(t_child).f_left=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<267>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map8.prototype.m_RotateRight6=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<271>";
	var t_child=dbg_object(t_node).f_left;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<272>";
	dbg_object(t_node).f_left=dbg_object(t_child).f_right;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<273>";
	if((dbg_object(t_child).f_right)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<274>";
		dbg_object(dbg_object(t_child).f_right).f_parent=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<276>";
	dbg_object(t_child).f_parent=dbg_object(t_node).f_parent;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<277>";
	if((dbg_object(t_node).f_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<278>";
		if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<279>";
			dbg_object(dbg_object(t_node).f_parent).f_right=t_child;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<281>";
			dbg_object(dbg_object(t_node).f_parent).f_left=t_child;
		}
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<284>";
		this.f_root=t_child;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<286>";
	dbg_object(t_child).f_right=t_node;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<287>";
	dbg_object(t_node).f_parent=t_child;
	pop_err();
	return 0;
}
bb_map_Map8.prototype.m_InsertFixup6=function(t_node){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<212>";
	while(((dbg_object(t_node).f_parent)!=null) && dbg_object(dbg_object(t_node).f_parent).f_color==-1 && ((dbg_object(dbg_object(t_node).f_parent).f_parent)!=null)){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<213>";
		if(dbg_object(t_node).f_parent==dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<214>";
			var t_uncle=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_right;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<215>";
			if(((t_uncle)!=null) && dbg_object(t_uncle).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<216>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<217>";
				dbg_object(t_uncle).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<218>";
				dbg_object(dbg_object(t_uncle).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<219>";
				t_node=dbg_object(t_uncle).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<221>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_right){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<222>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<223>";
					this.m_RotateLeft6(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<225>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<226>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<227>";
				this.m_RotateRight6(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<230>";
			var t_uncle2=dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_left;
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<231>";
			if(((t_uncle2)!=null) && dbg_object(t_uncle2).f_color==-1){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<232>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<233>";
				dbg_object(t_uncle2).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<234>";
				dbg_object(dbg_object(t_uncle2).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<235>";
				t_node=dbg_object(t_uncle2).f_parent;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<237>";
				if(t_node==dbg_object(dbg_object(t_node).f_parent).f_left){
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<238>";
					t_node=dbg_object(t_node).f_parent;
					err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<239>";
					this.m_RotateRight6(t_node);
				}
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<241>";
				dbg_object(dbg_object(t_node).f_parent).f_color=1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<242>";
				dbg_object(dbg_object(dbg_object(t_node).f_parent).f_parent).f_color=-1;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<243>";
				this.m_RotateLeft6(dbg_object(dbg_object(t_node).f_parent).f_parent);
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<247>";
	dbg_object(this.f_root).f_color=1;
	pop_err();
	return 0;
}
bb_map_Map8.prototype.m_Set7=function(t_key,t_value){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<29>";
	var t_node=this.f_root;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_parent=null;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<30>";
	var t_cmp=0;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<32>";
	while((t_node)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<33>";
		t_parent=t_node;
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<34>";
		t_cmp=this.m_Compare2(t_key,dbg_object(t_node).f_key);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<35>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<36>";
			t_node=dbg_object(t_node).f_right;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<37>";
			if(t_cmp<0){
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<38>";
				t_node=dbg_object(t_node).f_left;
			}else{
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<40>";
				dbg_object(t_node).f_value=t_value;
				err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<41>";
				pop_err();
				return false;
			}
		}
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<45>";
	t_node=bb_map_Node8_new.call(new bb_map_Node8,t_key,t_value,-1,t_parent);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<47>";
	if((t_parent)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<48>";
		if(t_cmp>0){
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<49>";
			dbg_object(t_parent).f_right=t_node;
		}else{
			err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<51>";
			dbg_object(t_parent).f_left=t_node;
		}
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<53>";
		this.m_InsertFixup6(t_node);
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<55>";
		this.f_root=t_node;
	}
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<57>";
	pop_err();
	return true;
}
function bb_map_IntMap2(){
	bb_map_Map8.call(this);
}
bb_map_IntMap2.prototype=extend_class(bb_map_Map8);
bb_map_IntMap2.prototype.m_Compare2=function(t_lhs,t_rhs){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<537>";
	var t_=t_lhs-t_rhs;
	pop_err();
	return t_;
}
function bb_map_Node8(){
	Object.call(this);
	this.f_key=0;
	this.f_right=null;
	this.f_left=null;
	this.f_value=null;
	this.f_color=0;
	this.f_parent=null;
}
function bb_map_Node8_new(t_key,t_value,t_color,t_parent){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<364>";
	dbg_object(this).f_key=t_key;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<365>";
	dbg_object(this).f_value=t_value;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<366>";
	dbg_object(this).f_color=t_color;
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<367>";
	dbg_object(this).f_parent=t_parent;
	pop_err();
	return this;
}
function bb_map_Node8_new2(){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/monkey/map.monkey<361>";
	pop_err();
	return this;
}
function bb_graphics_DrawImageRect(t_image,t_x,t_y,t_srcX,t_srcY,t_srcWidth,t_srcHeight,t_frame){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<509>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<511>";
	var t_f=dbg_array(dbg_object(t_image).f_frames,t_frame)[dbg_index];
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<513>";
	if((dbg_object(bb_graphics_context).f_tformed)!=0){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<514>";
		bb_graphics_PushMatrix();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<517>";
		bb_graphics_Translate(-dbg_object(t_image).f_tx+t_x,-dbg_object(t_image).f_ty+t_y);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<519>";
		bb_graphics_ValidateMatrix();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<521>";
		dbg_object(bb_graphics_context).f_device.DrawSurface2(dbg_object(t_image).f_surface,0.0,0.0,t_srcX+dbg_object(t_f).f_x,t_srcY+dbg_object(t_f).f_y,t_srcWidth,t_srcHeight);
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<523>";
		bb_graphics_PopMatrix();
	}else{
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<525>";
		bb_graphics_ValidateMatrix();
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<527>";
		dbg_object(bb_graphics_context).f_device.DrawSurface2(dbg_object(t_image).f_surface,-dbg_object(t_image).f_tx+t_x,-dbg_object(t_image).f_ty+t_y,t_srcX+dbg_object(t_f).f_x,t_srcY+dbg_object(t_f).f_y,t_srcWidth,t_srcHeight);
	}
	pop_err();
	return 0;
}
function bb_graphics_DrawImageRect2(t_image,t_x,t_y,t_srcX,t_srcY,t_srcWidth,t_srcHeight,t_rotation,t_scaleX,t_scaleY,t_frame){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<533>";
	bb_graphics_DebugRenderDevice();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<535>";
	var t_f=dbg_array(dbg_object(t_image).f_frames,t_frame)[dbg_index];
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<537>";
	bb_graphics_PushMatrix();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<539>";
	bb_graphics_Translate(t_x,t_y);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<540>";
	bb_graphics_Rotate(t_rotation);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<541>";
	bb_graphics_Scale(t_scaleX,t_scaleY);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<542>";
	bb_graphics_Translate(-dbg_object(t_image).f_tx,-dbg_object(t_image).f_ty);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<544>";
	bb_graphics_ValidateMatrix();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<546>";
	dbg_object(bb_graphics_context).f_device.DrawSurface2(dbg_object(t_image).f_surface,0.0,0.0,t_srcX+dbg_object(t_f).f_x,t_srcY+dbg_object(t_f).f_y,t_srcWidth,t_srcHeight);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/graphics.monkey<548>";
	bb_graphics_PopMatrix();
	pop_err();
	return 0;
}
function bb_audio_SetMusicVolume(t_volume){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<121>";
	bb_audio_device.SetMusicVolume(t_volume);
	pop_err();
	return 0;
}
function bb_audio_LoadSound(t_path){
	push_err();
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<64>";
	var t_sample=bb_audio_device.LoadSample(t_path);
	err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<65>";
	if((t_sample)!=null){
		err_info="C:/Users/akazantsev/Documents/Downloads/Monkey/Monkey/modules/mojo/audio.monkey<65>";
		var t_=bb_audio_Sound_new.call(new bb_audio_Sound,t_sample);
		pop_err();
		return t_;
	}
	pop_err();
	return null;
}
function bbInit(){
	bb_colortest2_ColorTest2_ClassObject=(bb_colortest2_ColorTest2Class_new.call(new bb_colortest2_ColorTest2Class));
	bb_graphics_context=null;
	bb_input2_device=null;
	bb_audio_device=null;
	bb_app_device=null;
	bb_flxg_FlxG__Game=null;
	bb_flxg_FlxG_Width=0;
	bb_flxg_FlxG_Height=0;
	bb_flxg_FlxG_Mute=false;
	bb_flxg_FlxG__Volume=.0;
	bb_flxg_FlxG_Sounds=null;
	bb_flxg_FlxG_VolumeHandler=null;
	bb_flxg_FlxG__BitmapCache=null;
	bb_flxcamera_FlxCamera_DefaultZoom=.0;
	bb_flxg_FlxG_Cameras=null;
	bb_flxg_FlxG_Plugins=null;
	bb_flxg_FlxG_Accel=null;
	bb_input_Input__Map=new_object_array(416);
	bb_flxg_FlxG_Keys=null;
	bb_flxg_FlxG_Mouse=null;
	bb_flxg_FlxG__Joystick=new_object_array(4);
	bb_flxg_FlxG__Touch=new_object_array(32);
	bb_flxg_FlxG_Mobile=false;
	bb_flxg_FlxG_Scores=null;
	bb_flxg_FlxG_Levels=null;
	bb_flxg_FlxG_VisualDebug=false;
	bb_flxg_FlxG_Framerate=0;
	bb_flxg_FlxG_Updaterate=0;
	bb_graphics_Image_DefaultFlags=0;
	bb_graphics_renderDevice=null;
	bb_flxassetsmanager_FlxAssetsManager__Fonts=[];
	bb_flxassetsmanager_FlxAssetsManager__Images=null;
	bb_flxassetsmanager_FlxAssetsManager__Sounds=null;
	bb_flxassetsmanager_FlxAssetsManager__Music=null;
	bb_flxassetsmanager_FlxAssetsManager__Cursors=null;
	bb_flxassetsmanager_FlxAssetsManager__Strings=null;
	bb_random_Seed=1234;
	bb_flxg_FlxG_DeviceWidth=0;
	bb_flxg_FlxG_DeviceHeight=0;
	bb_flxg_FlxG__DeviceScaleFactorX=1.0;
	bb_flxg_FlxG__DeviceScaleFactorY=1.0;
	bb_flxg_FlxG_Music=null;
	bb_flxsound_FlxSound__LoopedChannels=new_bool_array(32);
	bb_flxg_FlxG__SoundCache=null;
	bb_flxg_FlxG_Level=0;
	bb_flxg_FlxG_Score=0;
	bb_flxg_FlxG_TimeScale=.0;
	bb_flxg_FlxG_Elapsed=.0;
	bb_flxg_FlxG_GlobalSeed=0;
	bb_flxg_FlxG_WorldBounds=null;
	bb_flxg_FlxG_WorldDivisions=0;
	bb_debugpathdisplay_DebugPathDisplay_ClassObject=(bb_debugpathdisplay_DebugPathDisplayClass_new.call(new bb_debugpathdisplay_DebugPathDisplayClass));
	bb_flxg_FlxG_Camera=null;
	bb_flxg_FlxG__BgColor=bb_flxcolor_FlxColor_ARGB(-16777216);
	bb_flxcamera_FlxCamera__Inkrement=0;
	bb_timermanager_TimerManager_ClassObject=(bb_timermanager_TimerManagerClass_new.call(new bb_timermanager_TimerManagerClass));
	bb_flxbasic_FlxBasic__ActiveCount=0;
	bb_flxsound_FlxSound_ClassObject=bb_flxsound_FlxSoundClass_new.call(new bb_flxsound_FlxSoundClass);
	bb_flxsound_FlxSound__NextChannel=-1;
	bb_flxsound_FlxSound__SoundLoader=bb_flxsound_FlxSoundLoader_new.call(new bb_flxsound_FlxSoundLoader);
	bb_flxbasic_FlxBasic__VisibleCount=0;
	bb_flxg_FlxG__LastDrawingColor=0;
	bb_flxg_FlxG__LastDrawingBlend=0;
	bb_flxg_FlxG__LastDrawingAlpha=.0;
	bb_flxg_FlxG__CurrentCamera=null;
	bb_flxsprite_FlxSprite__GraphicLoader=bb_flxsprite_FlxGraphicLoader_new.call(new bb_flxsprite_FlxGraphicLoader);
}
//${TRANSCODE_END}

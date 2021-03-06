@import 'SketchLibrary.js'

//	------------
//	INITIALIZERS
//	------------

coscript.shouldKeepAround = true;

$.runtime.loadBundle($.paths.resourcesPath+"/Archetype.bundle");


//	--------------------
//	PLUGIN FUNCTIONALITY
//	--------------------

var buildTemplateFromLayers = function(layers){
	var template = [];

	for(var i = 0, len = layers.count(); i<len; i++){
		var layer = layers.objectAtIndex(i), $layer = $(layer);
		
		var frame = layer.frame();
		var subLayers = $layer.isGroup ?
			buildTemplateFromLayers(layer.layers()) : [];

		template.push({
			isVisible: layer.isVisible(),
			isText: $layer.isText,
			name: layer.name(),
			layers: subLayers,

			width: frame.width(),
			height: frame.height()
		});
	}

	return template;
};

var buildDOMTemplateFromArtboard = function(artboard){
	return buildTemplateFromLayers(artboard.layers());
};

var buildDOMTemplateFromCurrentArtboard = function(){
	var artboard = $.artboard;

	if(artboard) return buildDOMTemplateFromArtboard(artboard);

	return false;
};


var adjustCurrentArtboardUsingFrames = function(frames){
	var adjustFrames = function(layers, frames, relativeFrame){
		for(var i = 0, len = frames.length; i<len; i++){
			var layer = layers.objectAtIndex(i), $layer = $(layer);
			var frame = frames[i];

			$layer.setFrame(
				frame.x-relativeFrame.x,
				frame.y-relativeFrame.y,
				frame.width,
				frame.height
			);

			if($layer.isGroup){
				adjustFrames(layer.layers(), frame.childFrames, frame);
			}
		}
	};

	adjustFrames($.artboard.layers(), frames, { x: 0, y: 0 });

	$.refresh();
};
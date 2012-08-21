'/**
 '* FlxDisplay
 '* -- Part of the Flixel Power Tools set
 '* 
 '* v1.3 Added "screenWrap", "alphaMask" and "alphaMaskFlxSprite" methods
 '* v1.2 Added "space" method
 '* v1.1 Updated for the Flixel 2.5 Plugin system
 '* 
 '* @version 1.3 - June 15th 2011
 '* @link http://www.photonstorm.com
 '* @author Richard Davey / Photon Storm
 '* Copyright: Monkey port - 2012 Aleksey 'KaaPex' Kazantsev 
'*/
Strict

import flixel
	
Class FlxDisplay 

#rem	
	public function pad():void
	{
		//	Pad the sprite out with empty pixels left/right/above/below it
	}
	
	public function flip():void
	{
		//	mirror / reverse?
		//	Flip image data horizontally / vertically without changing the angle
	}
	
	/**
	 * Takes two source images (typically from Embedded bitmaps) and puts the resulting image into the output FlxSprite.<br>
	 * Note: It assumes the source and mask are the same size. Different sizes may result in undesired results.<br>
	 * It works by copying the source image (your picture) into the output sprite. Then it removes all areas of it that do not<br>
	 * have an alpha color value in the mask image. So if you draw a big black circle in your mask with a transparent edge, you'll<br>
	 * get a circular image appear. Look at the mask PNG files in the assets/pics folder for examples.
	 * 
	 * @param	source		The source image. Typically the one with the image / picture / texture in it.
	 * @param	mask		The mask to apply. Remember the non-alpha zero areas are the parts that will display.
	 * @param	output		The FlxSprite you wish the resulting image to be placed in (will adjust width/height of image)
	 * 
	 * @return	The output FlxSprite for those that like chaining
	 */
	public static function alphaMask(source:Class, mask:Class, output:FlxSprite):FlxSprite
	{
		var data:BitmapData = (new source).bitmapData;
		
		data.copyChannel((new mask).bitmapData, new Rectangle(0, 0, data.width, data.height), new Point, BitmapDataChannel.ALPHA, BitmapDataChannel.ALPHA);
		
		output.pixels = data;
		
		return output;
	}
	
	/**
	 * Takes the image data from two FlxSprites and puts the resulting image into the output FlxSprite.<br>
	 * Note: It assumes the source and mask are the same size. Different sizes may result in undesired results.<br>
	 * It works by copying the source image (your picture) into the output sprite. Then it removes all areas of it that do not<br>
	 * have an alpha color value in the mask image. So if you draw a big black circle in your mask with a transparent edge, you'll<br>
	 * get a circular image appear. Look at the mask PNG files in the assets/pics folder for examples.
	 * 
	 * @param	source		The source FlxSprite. Typically the one with the image / picture / texture in it.
	 * @param	mask		The FlxSprite containing the mask to apply. Remember the non-alpha zero areas are the parts that will display.
	 * @param	output		The FlxSprite you wish the resulting image to be placed in (will adjust width/height of image)
	 * 
	 * @return	The output FlxSprite for those that like chaining
	 */
	public static function alphaMaskFlxSprite(source:FlxSprite, mask:FlxSprite, output:FlxSprite):FlxSprite
	{
		var data:BitmapData = source.pixels;
		
		data.copyChannel(mask.pixels, new Rectangle(0, 0, source.width, source.height), new Point, BitmapDataChannel.ALPHA, BitmapDataChannel.ALPHA);
		
		output.pixels = data;
		
		return output;
	}
#End	
	'/**
	 '* Checks the x/y coordinates of the source FlxSprite and keeps them within the area of 0, 0, FlxG.width, FlxG.height (i.e. wraps it around the screen)
	 '* 
	 '* @param	source				The FlxSprite to keep within the screen
	 '*/
	Function ScreenWrap:Void(source:FlxSprite)
		If (source.x < 0) Then
			source.x = FlxG.Width
		Else If (source.x > FlxG.Width)
			source.x = 0
		Endif
		
		If (source.y < 0)
			source.y = FlxG.Height
		Else If (source.y > FlxG.Height)
			source.y = 0
		Endif
	End Function
	#rem
	/**
	 * Takes the bitmapData from the given source FlxSprite and rotates it 90 degrees clockwise.<br>
	 * Can be useful if you need to control a sprite under rotation but it isn't drawn facing right.<br>
	 * This change overwrites FlxSprite.pixels, but will not work with animated sprites.
	 * 
	 * @param	source		The FlxSprite who's image data you wish to rotate clockwise
	 */
	public static function rotateClockwise(source:FlxSprite):void
	{
	}
	#end	
	'/**
	 '* Aligns a set of FlxSprites so there is equal spacing between them
	 '* 
	 '* @param	sprites				An Array of FlxSprites
	 '* @param	startX				The base X coordinate to start the spacing from
	 '* @param	startY				The base Y coordinate to start the spacing from
	 '* @param	horizontalSpacing	The amount of pixels between each sprite horizontally (default 0)
	 '* @param	verticalSpacing		The amount of pixels between each sprite vertically (default 0)
	 '* @param	spaceFromBounds		If set to true the h/v spacing values will be added to the width/height of the sprite, if false it will ignore this
	 '*/
	Function Space:Void(sprites:FlxSprite[], startX:Int, startY:Int, horizontalSpacing:Int = 0, verticalSpacing:Int = 0, spaceFromBounds:Bool = False)

		Local prevWidth:Int = 0
		Local prevHeight:Int = 0
		Local i:Int = 0
		For Local sprite:FlxSprite = Eachin sprites
			
			If (spaceFromBounds) Then
				sprite.x = startX + prevWidth + (i * horizontalSpacing)
				sprite.y = startY + prevHeight + (i * verticalSpacing)
			Else
				sprite.x = startX + (i * horizontalSpacing)
				sprite.y = startY + (i * verticalSpacing)
			Endif
			i += 1
		Next
	End Function

	'/**
	 '* Centers the given FlxSprite on the screen, either by the X axis, Y axis, or both
	 '* 
	 '* @param	source	The FlxSprite to center
	 '* @param	xAxis	Boolean true if you want it centered on X (i.e. in the middle of the screen)
	 '* @param	yAxis	Boolean	true if you want it centered on Y
	 '* 
	 '* @return	The FlxSprite for chaining
	 '*/
	Function ScreenCenter:FlxSprite(source:FlxSprite, xAxis:Bool = True, yAxis:Bool = False)
		If (xAxis) Then
			source.x = (FlxG.Width / 2) - (source.width / 2)
		Endif
		
		If (yAxis) Then
			source.y = (FlxG.Height / 2) - (source.height / 2)
		Endif

		return source
	End Function
	
End Class
'/**
 '* FlxGridOverlay
 '* -- Part of the Flixel Power Tools set
 '* 
 '* v1.1 Updated for the Flixel 2.5 Plugin system
 '* 
 '* @version 1.1 - April 23rd 2011
 '* @link http://www.photonstorm.com
 '* @author Richard Davey / Photon Storm
 '* Copyright: Monkey port - 2012 Aleksey 'KaaPex' Kazantsev  
'*/
Strict
Import flixel
	
Class FlxGridOverlay 
	
	'/**
	 '* Creates an FlxSprite of the given width and height filled with a checkerboard pattern.<br />
	 '* Each grid cell is the specified width and height, and alternates between two colors.<br />
	 '* If alternate is true each row of the pattern will be offset, for a proper checkerboard style. If false each row will be the same colour, creating a striped-pattern effect.<br />
	 '* So to create an 8x8 grid you'd call create(8,8)
	 '* 
	 '* @param	cellWidth		The grid cell width
	 '* @param	cellHeight		The grid cell height
	 '* @param	width			The width of the FlxSprite. If -1 it will be the size of the game (FlxG.width)
	 '* @param	height			The height of the FlxSprite. If -1 it will be the size of the game (FlxG.height)
	 '* @param	addLegend		TODO
	 '* @param	alternate		Should the pattern alternate on each new row? Default true = checkerboard effect. False = vertical stripes
	 '* @param	color1			The first fill colour in 0xAARRGGBB format
	 '* @param	color2			The second fill colour in 0xAARRGGBB format
	 '* 
	 '* @return	FlxSprite of given width/height
	 '*/
	Function Create:FlxSprite(cellWidth:Int, cellHeight:Int, width:Int = -1, height:Int = -1, addLegend:Bool = False, alternate:Bool = True, color1:Int = $ffe7e6e6, color2:Int = $ffd9d5d5)
		If (width = -1) Then
			width = FlxG.Width
		Endif
		
		If (height = -1) Then
			height = FlxG.Height
		Endif
		
		If (width < cellWidth Or height < cellHeight) Then
			Return Null
		Endif
		
		Local grid:Int[] = CreateGrid(cellWidth, cellHeight, width, height, alternate, color1, color2)
		
		Local output:FlxSprite = New FlxSprite().MakeGraphic(width, height)
		Local img:Image = CreateImage(width, height)
		img.WritePixels( grid, 0, 0, width, height)
		output.Pixels = img
		output.dirty = true
		
		Return output
	End Function
	#rem
	'/**
	 '* Creates a checkerboard pattern of the given width/height and overlays it onto the given FlxSprite.<br />
	 '* Each grid cell is the specified width and height, and alternates between two colors.<br />
	 '* If alternate is true each row of the pattern will be offset, for a proper checkerboard style. If false each row will be the same colour, creating a striped-pattern effect.<br />
	 '* So to create an 8x8 grid you'd call create(8,8,
	 '* 
	 '* @param	source			The FlxSprite you wish to draw the grid on-top of. This updates its pixels value, not just the current frame (don't use animated sprites!)
	 '* @param	cellWidth		The grid cell width
	 '* @param	cellHeight		The grid cell height
	 '* @param	width			The width of the FlxSprite. If -1 it will be the size of the game (FlxG.width)
	 '* @param	height			The height of the FlxSprite. If -1 it will be the size of the game (FlxG.height)
	 '* @param	addLegend		TODO
	 '* @param	alternate		Should the pattern alternate on each new row? Default true = checkerboard effect. False = vertical stripes
	 '* @param	color1			The first fill colour in 0xAARRGGBB format
	 '* @param	color2			The second fill colour in 0xAARRGGBB format
	 '* 
	 '* @return	The modified source FlxSprite
	 '*/
	Function Overlay:FlxSprite(source:FlxSprite, cellWidth:Int, cellHeight:Int, width:Int = -1, height:Int = -1, addLegend:Bool = False, alternate:Bool = True, color1:Int = $88e7e6e6, color2:Int = $88d9d5d5)
		If (width = -1) Then
			width = FlxG.Width
		Endif
		
		If (height = -1) Then
			height = FlxG.Height
		Endif
		
		If (width < cellWidth Or height < cellHeight) Then
			Return Null
		Endif
		
		Local grid:Int[] = CreateGrid(cellWidth, cellHeight, width, height, alternate, color1, color2)
		
		'Local pixels:Image = source.Pixels
		
		'pixels.copyPixels(grid, New Rectangle(0, 0, width, height), New Point(0, 0), Null, Null, True)
		
		'source.Pixels.WritePixels( pixels, 0, 0, width, height)
		
		Return source
	End Function
	#end
	Function AddLegend:FlxSprite(source:FlxSprite, cellWidth:Int, cellHeight:Int, xAxis:Bool = True, yAxis:Bool = True)
		If (cellWidth > source.width) Then
			Error("cellWidth larger than FlxSprites width")
			return source
		Endif
		
		If (cellHeight > source.height) Then
			Error("cellHeight larger than FlxSprites height")
			Return source
		Endif
		
		If (source.width < cellWidth Or source.height < cellHeight) Then
			Error("source FlxSprite width or height smaller than requested cell width or height")
			Return source
		Endif
		
		'//	Valid cell width/height and source to work on
		
		Return source
		
	End Function
	
	Function CreateGrid:Int[](cellWidth:Int, cellHeight:Int, width:Int, height:Int, alternate:Bool, color1:Int, color2:Int)
		'//	How many cells can we fit into the width/height? (round it UP if not even, then trim back)
		
		Local rowColor:int = color1
		Local lastColor:int = color1
		Local grid:Int[] = New Int[width*height]
		
		'//	If there aren't an even number of cells in a row then we need to swap the lastColor value
		
		Local y:Int = 0 		
		Repeat
			If (y > 0 And lastColor = rowColor And alternate) Then
				If (lastColor = color1) Then
					lastColor = color2 
				Else
					lastColor = color1
				Endif	
			Else If (y > 0 And lastColor <> rowColor And alternate = False) Then
				If (lastColor = color2) Then
					lastColor = color1
				Else 
					lastColor = color2
				Endif	
			Endif

			Local x:Int = 0
			Repeat
				If (x = 0) Then
					rowColor = lastColor
				Endif
				
				For Local i:Int = x Until x+cellWidth
					For Local j:Int = y Until y+cellHeight
						grid[i+j*width] = lastColor		
					Next
				Next
				
				If (lastColor = color1) Then
					lastColor = color2
				Else
					lastColor = color1
				Endif
				x += cellWidth
			Until x >= width
			y += cellHeight 
		Until y >= height
		Return grid
	End Function
	
End Class
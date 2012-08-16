Import flixel

Class ControlTestScene2 Extends FlxGroup
	Field map:FlxTilemap
	
	Method New() 
		Super.New(1)
		
		map = New FlxTilemap()
		map.LoadMap(FlxAssetsManager.GetString("platformerMapCSV"), "platformerTilesPNG", 16, 16, 0, 0, 1, 31)
		
		map.y = -32
		
		FlxG.Camera.SetBounds(0, 0, 320, 256)
		FlxG.WorldBounds = New FlxRect(0, -32, 320, 288)
		
		Add(map)
	End Method
	
End Class
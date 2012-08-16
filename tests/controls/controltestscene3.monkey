Import flixel

Class ControlTestScene3 Extends FlxGroup
	Field map:FlxTilemap
		
	Method New() 
		Super.New(1)
		
		map = New FlxTilemap()
		map.LoadMap(FlxAssetsManager.GetString("bigMapCSV"), "platformerTilesPNG", 16, 16, 0, 0, 1, 31)
		
		FlxG.Camera.SetBounds(0, 0, map.width, map.height)
		FlxG.WorldBounds = New FlxRect(0, 0, map.width, map.height)
		
		Add(map)
	End Method
		
End Class
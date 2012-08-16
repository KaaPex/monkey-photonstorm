Import flixel

Class ControlTestScene1 Extends FlxGroup
	Field map:FlxTilemap
	
	Const TILE_WIDTH:Int = 16
	Const TILE_HEIGHT:Int = 16
	
	Method New() 
		Super.New(1)
		
		map = New FlxTilemap()
		map.LoadMap(FlxAssetsManager.GetString("scifiMap1CSV"), "scifiTilesPNG", TILE_WIDTH, TILE_HEIGHT, FlxTilemap.OFF, 0, 1, 55)
		'//map.y = -32;
		
		FlxG.Camera.SetBounds(0, 0, 320, 256)
		FlxG.WorldBounds = New FlxRect(0, 0, 320, 256)
		
		Add(map)
	End Method
	
End Class
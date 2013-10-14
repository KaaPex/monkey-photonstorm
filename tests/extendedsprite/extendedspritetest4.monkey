Strict
#TEXT_FILES = "*.csv"

Import "../assets/sprites/ufo.png"
Import "../assets/tiles/sci-fi-tiles.png"
Import "../assets/maps/mapCSV_SciFi_Map1.csv"

Import flixel
Import flixel.plugin.photonstorm.tests.controls.controltestscene1
Import flixel.plugin.photonstorm

#REFLECTION_FILTER = "extendedsprite*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ExtendedSpriteTest4"), 1, 60)
		
		Print ExtendedSpriteTest4.title
		Print ExtendedSpriteTest4.description
		Print ExtendedSpriteTest4.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddString("scifiMap1CSV", "mapCSV_SciFi_Map1.csv")
		FlxAssetsManager.AddImage("ufoPNG", "ufo.png")
		FlxAssetsManager.AddImage("scifiTilesPNG", "sci-fi-tiles.png")
	End Method	

End Class


class ExtendedSpriteTest4 extends FlxState
Private 
	'//	Test specific variables
		
	Field player:FlxExtendedSprite
	Field scene:ControlTestScene1
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Sprite Drag 4"
	Global description:String = "Drag through a TileMap"
	Global instructions:String = "Drag the UFO around the tile map"
	
	Method Create:Void()

		'header = new TestsHeader(instructions);
		'add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxMouseControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		player = New FlxExtendedSprite(64, 64, "ufoPNG")
		player.Solid = true
		player.allowCollisions = FlxObject.ANY
		player.EnableMouseDrag(false, true)
		
		scene = new ControlTestScene1
		
		Add(scene)
		Add(player)
		
		'//	Header overlay
		'Add(header.overlay)
	End Method
	
	Method Update:Void()
		Super.Update()
		FlxG.Collide(player, scene.map)
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FlxMouseControl.Clear()
		
		Super.Destroy()
	End Method
		
End Class
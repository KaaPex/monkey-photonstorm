Strict
#TEXT_FILES = "*.csv"

Import "../assets/sprites/humstar.png"
Import "../assets/tiles/sci-fi-tiles.png"
Import "../assets/maps/mapCSV_SciFi_Map1.csv"

Import flixel

Import flixel.plugin.photonstorm
Import controltestscene1

#REFLECTION_FILTER = "control*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ControlTest5"), 1, 60)
		
		Print ControlTest5.title
		Print ControlTest5.description
		Print ControlTest5.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddString("scifiMap1CSV", "mapCSV_SciFi_Map1.csv")
		FlxAssetsManager.AddImage("humstarPNG", "humstar.png")
		FlxAssetsManager.AddImage("scifiTilesPNG", "sci-fi-tiles.png")
	End Method	

End Class

Class ControlTest5 Extends FlxState
	'//	Test specific variables
Private 
	
	Field player:FlxSprite
	Field scene:ControlTestScene1
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Controls 5"
	Global description:String = "Acceleration and Deceleration Example"
	Global instructions:String = "Move with the cursor / arrow keys"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		'//	Our players space ship
		player = new FlxSprite(64, 64)
		player.LoadGraphic("humstarPNG", True, False, 32, 32, True)
		player.elasticity = 0.8
		player.AddAnimation("boing", [0,1,2,3,4,5], 10, True)
		player.Play("boing")
		

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxControl())
		Endif
		
		FlxControl.Create(player, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES)
		FlxControl.player1.SetMovementSpeed(200, 200, 200, 200, 100, 100)
		
		'//	setStandardSpeed is a special short-cut function, you can get more control (and the same result) by calling this instead:
		'//FlxControl.player1.setMovementSpeed(100, 100, 100, 100)
		
		'//	A basic scene for our ufo to fly around
		scene = New ControlTestScene1()
		
		'//	Bring up the Flixel debugger if you'd like to watch these values in real-time
		'FlxG.Watch(player.velocity, "x", "vx")
		'FlxG.Watch(player.velocity, "y", "vy")
		
		Add(scene)
		Add(player)
			
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Draw:Void()
        DrawText "Application has been running for: "+Millisecs()/1000.0+" seconds.",0,0
        Super.Draw()
    End
    
	Method Update:Void()		
		Super.Update()
		FlxG.Collide(player, scene.map)
	End Method
	
End Class

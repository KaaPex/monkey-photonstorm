Strict
#TEXT_FILES="*.csv"

Import "../assets/sprites/thrust_ship.png"
Import "../assets/tiles/sci-fi-tiles.png"
Import "../assets/maps/mapCSV_SciFi_Map1.csv"

Import flixel

Import flixel.plugin.photonstorm
Import controltestscene1

#REFLECTION_FILTER="control*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ControlTest6"), 1, 60)
		
		Print ControlTest6.title
		Print ControlTest6.description
		Print ControlTest6.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddString("scifiMap1CSV", "mapCSV_SciFi_Map1.csv")
		FlxAssetsManager.AddImage("thrustShipPNG", "thrust_ship.png")
		FlxAssetsManager.AddImage("scifiTilesPNG", "sci-fi-tiles.png")
	End Method	

End Class

Class ControlTest6 Extends FlxState
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
		player = New FlxSprite(160, 120, "thrustShipPNG")
		'player.LoadRotatedGraphic("thrustShipPNG", 180, -1) 'NOT YET SUPPORTED
		player.elasticity = 0.8
		

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxControl())
		Endif
		
		'//	Control the player
			
		FlxControl.Create(player, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES, 1, false, false)
		FlxControl.player1.SetRotationSpeed(200, 200, 200, 300)
		FlxControl.player1.SetRotationType(FlxControlHandler.ROTATION_INSTANT, FlxControlHandler.ROTATION_STOPPING_DECELERATES)
		FlxControl.player1.SetRotationKeys()
		FlxControl.player1.SetThrust(KEY_UP, 100, KEY_DOWN, 100)
		FlxControl.player1.SetMovementSpeed(0, 0, 200, 200, 100, 100)
		
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

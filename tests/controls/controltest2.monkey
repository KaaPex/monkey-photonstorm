Strict
#TEXT_FILES = "*.csv"

Import "../assets/sprites/chick.png"
Import "../assets/tiles/platformer_tiles.png"
Import "../assets/maps/platformer_map.csv"

Import flixel

Import flixel.plugin.photonstorm
Import controltestscene2

#REFLECTION_FILTER = "control**"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 288, GetClass("ControlTest2"), 1, 60)
		
		Print ControlTest2.title
		Print ControlTest2.description
		Print ControlTest2.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddString("platformerMapCSV", "platformer_map.csv")
		FlxAssetsManager.AddImage("chickPNG", "chick.png")
		FlxAssetsManager.AddImage("platformerTilesPNG", "platformer_tiles.png")
	End Method	

End Class

Class ControlTest2 Extends FlxState
	'//	Test specific variables
Private 
	
	Field player:FlxSprite
	Field scene:ControlTestScene2
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Controls 2"
	Global description:String = "Platformer controls with jump"
	Global instructions:String = "LEFT/RIGHT to run, SPACE to jump"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		player = New FlxSprite(64, 150)
		player.LoadGraphic("chickPNG", True, True, 16, 18, True)
		'//	The sprite is 16x18 in size, but that includes a little feather of hair on its head which we don't want to include in collision checks.
		'//	We also shave 2 pixels off each side To make it slip through gaps easier. Changing the width/height does Not change the visual sprite, just the bounding box used For physics.
		player.width = 12
		player.height = 16
		
		'//	Because we've shaved a few pixels off, we need to offset the sprite to compensate
		player.offset.x = 2;
		player.offset.y = 2;
		
		'//	The animation our sprite has
		player.AddAnimation("idle", [0], 0, false)
		player.AddAnimation("walk", [0, 1, 0, 2], 10, true)
		player.AddAnimation("jump", [1], 0, false)

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxControl())
		Endif
		
		'//	Control the sprite
		FlxControl.Create(player, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES, 1, true, false)
		FlxControl.player1.SetCursorControl(false, false, true, true)
		FlxControl.player1.SetJumpButton(KEY_SPACE, FlxControlHandler.KEYMODE_PRESSED, 200, FlxObject.FLOOR, 250, 200)
		
		'//	Because we are using the MOVEMENT_ACCELERATES type the first value is the acceleration speed of the sprite
		'//	Think of it as the time it takes to reach maximum velocity. A value of 100 means it would take 1 second. A value of 400 means it would take 0.25 of a second.
		FlxControl.player1.SetMovementSpeed(400, 0, 100, 200, 400, 0)
		
		'//	Set a downward gravity of 400px/sec
		FlxControl.player1.SetGravity(0, 400)
		
		'//	A basic scene for our chick to jump around
		scene = New ControlTestScene2()
		
		Add(scene)
		Add(player)
		
		'//	Bring up the Flixel debugger if you'd like to watch these values in real-time
		'FlxG.watch(player.acceleration, "x", "ax");
		'FlxG.watch(player.acceleration, "y", "ay");
		'FlxG.watch(player.velocity, "x", "vx");
		'FlxG.watch(player.velocity, "y", "vy");
		'FlxG.watch(player.maxVelocity, "x", "mx");
		'FlxG.watch(player.maxVelocity, "y", "my");
		'FlxG.watch(player.drag, "x", "dx");
		'FlxG.watch(player.drag, "y", "dy");
			
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Draw:Void()
        'DrawText "Application has been running for: "+Millisecs()/1000.0+" seconds.",0,0
        Super.Draw()
    End
    
	Method Update:Void()
		Super.Update()

		'// importan include after Super.Update()
		FlxG.Collide(player, scene.map)
		
		If (player.touching = FlxObject.FLOOR) Then
			If (player.velocity.x <> 0) Then
				player.Play("walk")
			Else
				player.Play("idle")
			Endif
		Else If (player.velocity.y < 0) Then
			player.Play("jump")
		Endif
		
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FlxControl.Clear()
			
		Super.Destroy()
	End Method
End Class

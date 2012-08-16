Strict
#TEXT_FILES="*.txt|*.xml|*.json|*.csv"

Import "../assets/sprites/player.png"
Import "../assets/sprites/bullet.png"

Import flixel

Import flixel.plugin.photonstorm
Import controltestscene1

#REFLECTION_FILTER="control*|flixel.flx*|flixel.plugin*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 288, GetClass("ControlTest4"), 1, 60, 60)
		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("invaderPNG", "player.png")
		FlxAssetsManager.AddImage("bulletPNG", "bullet.png")
	End Method	

End Class

Class ControlTest4 Extends FlxState
	'//	Test specific variables
Private 
	
	Field player:FlxSprite
	Field bullets:FlxGroup
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Controls 4"
	Global description:String = "Invaders sample"
	Global instructions:String = "LEFT / RIGHT to Move. Space to Fire."
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		'//	Test specific
		player = New FlxSprite(160, 200, "invaderPNG")

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FptFlxControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FptFlxControl())
		Endif
		
		'//	Control the player
		FptFlxControl.Create(player, FptFlxControlHandler.MOVEMENT_INSTANT, FptFlxControlHandler.STOPPING_INSTANT, 1, False, False)
		
		'//	200 px/sec horizontal movement, no vertical movement
		FptFlxControl.player1.SetMovementSpeed(200, 0, 200, 0)
		
		'//	Arrow keys will move the player, but only left and right
		FptFlxControl.player1.SetCursorControl(False, False, True, True);
		
		'//	Enable the SPACE BAR as a fire button. They can keep fire held down (KEYMODE_PRESSED) and fire at a rate of 1 bullet per 200ms
		FptFlxControl.player1.SetFireButton(KEY_SPACE, FptFlxControlHandler.KEYMODE_PRESSED, 200, Self, reflection.GetClass("ControlTest4").GetMethod("Fire",[]))
		
		'//	Restrict the player To this rectangular area
		FptFlxControl.player1.SetBounds(16, 200, 280, 16)
		
		'//	Bring up the Flixel debugger if you'd like to watch these values in real-time
		'FlxG.watch(player.velocity, "x", "vx");
		'FlxG.watch(player.velocity, "y", "vy");
		
		'//	The following just makes some bullets to shoot
		bullets = New FlxGroup(10)
		
		For Local i:Int = 0 Until 10
			bullets.Add(New FlxSprite(0, 0, "bulletPNG"))
		Next
		
		bullets.SetAll("exists", BoxBool(False), False)
		
		Add(bullets)
		Add(player)
			
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Fire:void()
		Local bullet:FlxSprite = FlxSprite(bullets.GetFirstAvailable())
		
		bullet.x = player.x + 5
		bullet.y = player.y
		bullet.velocity.y = -300
		bullet.exists = true
	End Method
	
	Method Draw:Void()
        'DrawText "Application has been running for: "+Millisecs()/1000.0+" seconds.",0,0
        Super.Draw()
    End Method
    
	Method Update:Void()
		Super.Update()

		'// importan include after Super.Update()
		For Local b:FlxBasic = Eachin bullets.Members()
			Local bullet:FlxSprite = FlxSprite(b)
			If (bullet.exists And bullet.y < 0)
				bullet.exists = False
			Endif
		Next
		
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FptFlxControl.Clear()
			
		Super.Destroy()
	End Method
End Class

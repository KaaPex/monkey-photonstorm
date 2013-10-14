Strict

Import flixel

Import flixel.plugin.photonstorm

Import "../assets/sprites/asteroids_ship.png"

#REFLECTION_FILTER = "weapon*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(320, 256, GetClass("WeaponTest6"), 1, 60)
		Print WeaponTest6.title
		Print WeaponTest6.description
		Print WeaponTest6.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("asteroidsShipPNG", "asteroids_ship.png")
	End Method	

End Class

Class WeaponTest6 Extends FlxState
	'//	Test specific variables
Private 
	
	Field player:FlxSprite
	Field lazer:FlxWeapon
	Field control:FlxControl
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Weapon 6"
	Global description:String = "Bullets shot at an angle"
	Global instructions:String = "Left and Right to Rotate. Control to Fire."
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		'//	Our players space ship
		player = New FlxSprite(160, 140,"asteroidsShipPNG")
		'player.LoadRotatedGraphic("asteroidsShipPNG", 180, -1) '// not supported, but its all works fine without it
		
		'//	Creates our weapon. We'll call it "lazer" and link it to the x/y coordinates of the player sprite
		lazer = new FlxWeapon("lazer", player, "x", "y")
		
		lazer.MakePixelBullet(40, 2, 2, $ff00e700, 5, 6)
			
		lazer.SetBulletSpeed(200)

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxControl())
		Endif
		
		FlxControl.Create(player, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES, 1, False, False)
		FlxControl.player1.SetDeceleration(100, 100)
		
		'//	If you have ROTATION_STOPPING_DECELERATES then you need to give a Deceleration value equal to the rotation speed
		FlxControl.player1.SetRotationSpeed(400, 400, 200, 400)
		FlxControl.player1.SetRotationType(FlxControlHandler.ROTATION_ACCELERATES, FlxControlHandler.ROTATION_STOPPING_DECELERATES)
		FlxControl.player1.SetRotationKeys()
		FlxControl.player1.SetThrust(KEY_UP, 100, KEY_DOWN, 50)
		
		'//	This is what fires the actual bullets (pressing SPACE) at a rate of 1 bullet per 250 ms, hooked to the lazer.fire method
		FlxControl.player1.SetFireButton(KEY_CONTROL, FlxControlHandler.KEYMODE_PRESSED, 50, lazer, ClassInfo(FlxWeapon.__CLASS__).GetMethod("FireFromParentAngle",[]))

		'//	The group which contains all of the bullets should be added so it is displayed
		Add(lazer.group)
		
		Add(player)
			
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Draw:Void()
        DrawText "Application has been running for: "+Millisecs()/1000.0+" seconds.",0,0
        Super.Draw()
    End
    
	Method Update:Void()
		FlxDisplay.ScreenWrap(player)
		Super.Update()
	End Method
	
End Class
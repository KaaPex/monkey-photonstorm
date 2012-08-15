Strict

Import flixel

Import flixel.plugin.photonstorm
Import "../assets/sprites/asteroids_ship.png"

#REFLECTION_FILTER="weapon*|flixel.flx*|flixel.plugin*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(640, 480, GetClass("WeaponTest6"), 1, 60, 60)
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
	Field lazer:FptFlxWeapon
	Field control:FptFlxControl
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Field title:String = "Weapon 6"
	Field description:String = "Bullets shot at an angle"
	Field instructions:String = "Left and Right to Rotate. Control to Fire."
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		'//	Our players space ship
		player = New FlxSprite(160, 140,"asteroidsShipPNG")
		'player.LoadRotatedGraphic("asteroidsShipPNG", 180, -1) '// not supported, but its all works fine without it
		
		'//	Creates our weapon. We'll call it "lazer" and link it to the x/y coordinates of the player sprite
		lazer = new FptFlxWeapon("lazer", player, "x", "y")
		
		lazer.MakePixelBullet(40, 2, 2, $ff00e700, 5, 6)
			
		lazer.SetBulletSpeed(200)

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FptFlxControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FptFlxControl())
		Endif
		
		FptFlxControl.Create(player, FptFlxControlHandler.MOVEMENT_ACCELERATES, FptFlxControlHandler.STOPPING_DECELERATES, 1, False, False)
		FptFlxControl.player1.SetDeceleration(100, 100)
		
		'//	If you have ROTATION_STOPPING_DECELERATES then you need to give a Deceleration value equal to the rotation speed
		FptFlxControl.player1.SetRotationSpeed(400, 400, 200, 400)
		FptFlxControl.player1.SetRotationType(FptFlxControlHandler.ROTATION_ACCELERATES, FptFlxControlHandler.ROTATION_STOPPING_DECELERATES)
		FptFlxControl.player1.SetRotationKeys()
		FptFlxControl.player1.SetThrust(KEY_UP, 100, KEY_DOWN, 50)
		
		'//	This is what fires the actual bullets (pressing SPACE) at a rate of 1 bullet per 250 ms, hooked to the lazer.fire method
		FptFlxControl.player1.SetFireButton(KEY_CONTROL, FptFlxControlHandler.KEYMODE_PRESSED, 50, lazer, ClassInfo(FptFlxWeapon.ClassObject).GetMethod("FireFromParentAngle",[]))

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
		FptFlxDisplay.ScreenWrap(player)
		Super.Update()
	End Method
	
End Class
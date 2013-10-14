Strict

Import flixel

Import flixel.plugin.photonstorm

Import "../assets/sprites/xenon2_ship.png"
Import "../assets/sprites/xenon2_bomb.png"


#REFLECTION_FILTER = "weapon*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(320, 256, GetClass("WeaponTest3"), 1, 60)
		Print WeaponTest3.title
		Print WeaponTest3.description
		Print WeaponTest3.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("xenon2ShipPNG", "xenon2_ship.png")
		FlxAssetsManager.AddImage("xenon2BombPNG", "xenon2_bomb.png")
	End Method	

End Class

Class WeaponTest3 Extends FlxState
	'//	Test specific variables
Private 
	
	Global player:FlxSprite
	Global lazer:FlxWeapon
	Global control:FlxControl
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Weapon 3"
	Global description:String = "Animated Bullets Example"
	Global instructions:String = "Left and Right to Move. Space to Fire."
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
'		header.showDarkBackground();
			
		'//	Our players space ship
		player = New FlxSprite(160, 200, "xenon2ShipPNG")
		
		'//	Creates our weapon. We'll call it "lazer" and link it to the x/y coordinates of the player sprite
		lazer = new FlxWeapon("lazer", player, "x", "y")
		
		'//	We're creating 20 animated bullets from the sprite sheet xenon2BombPNG. The frame width and height is 8x16.
		'//	The animation goes through frames 1,2,3,4 And Then loops at 30fps.
		'//	The 12x6 at the End is the offset so the bullet appears from the middle of the ship, Not the left-hand side.
			
		lazer.MakeAnimatedBullet(20, "xenon2BombPNG", 8, 16, [0, 1, 2, 3], 30, True, 12, 6)
		
		'//	Sets the direction and speed the bullets will be fired in
		lazer.SetBulletDirection(FlxWeapon.BULLET_UP, 180)

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxControl())
		Endif
		
		FlxControl.Create(player, FlxControlHandler.MOVEMENT_INSTANT, FlxControlHandler.STOPPING_INSTANT, 1, False, False)
		FlxControl.player1.SetMovementSpeed(200, 0, 200, 0)
		FlxControl.player1.SetCursorControl(False, False, True, True)
		FlxControl.player1.SetBounds(16, 200, 280, 16)
		
		'//	This is what fires the actual bullets (pressing SPACE) at a rate of 1 bullet per 250 ms, hooked to the lazer.fire method
		FlxControl.player1.SetFireButton(KEY_SPACE, FlxControlHandler.KEYMODE_PRESSED, 250, lazer, ClassInfo(FlxWeapon.__CLASS__).GetMethod("Fire",[]))

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
	
		Super.Update()
	End Method
	
End Class
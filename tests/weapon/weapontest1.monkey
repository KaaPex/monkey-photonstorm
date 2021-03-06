Strict

Import flixel

Import flixel.plugin.photonstorm
Import "../assets/sprites/player.png"
Import "../assets/sprites/bullet.png"


#REFLECTION_FILTER="weapon*|flixel.flx*|flixel.plugin*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(320, 256, GetClass("WeaponTest1"), 1, 60, 60)
		
		Print WeaponTest1.title
		Print WeaponTest1.description
		Print WeaponTest1.instructions	
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("invaderPNG", "player.png")
		FlxAssetsManager.AddImage("bulletPNG", "bullet.png")
	End Method	

End Class

Class WeaponTest1 Extends FlxState
	'//	Test specific variables
Private 
	
	Field player:FlxSprite
	Field lazer:FlxWeapon
	Field control:FlxControl
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Weapon 1"
	Global description:String = "Space Invaders Example"
	Global instructions:String = "LEFT / RIGHT to Move. Space to Fire."
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		'//	Our players space ship
		player = New FlxSprite(160, 200, "invaderPNG")
		
		'//	Creates our weapon. We'll call it "lazer" and link it to the x/y coordinates of the player sprite
		lazer = new FlxWeapon("lazer", player, "x", "y")
		
		'//	Tell the weapon to create 50 bullets using the bulletPNG image.
		'//	The 5 value is the x offset, which makes the bullet fire from the tip of the players ship.
		lazer.MakeImageBullet(50, "bulletPNG", 5)
		
		'//	Sets the direction and speed the bullets will be fired in
		lazer.SetBulletDirection(FlxWeapon.BULLET_UP, 200)

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FlxControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FlxControl())
		Endif
		
		FlxControl.Create(player, FlxControlHandler.MOVEMENT_INSTANT, FlxControlHandler.STOPPING_INSTANT, 1, False, False)
		FlxControl.player1.SetMovementSpeed(200, 0, 200, 0)
		FlxControl.player1.SetCursorControl(False, False, True, True)
		FlxControl.player1.SetBounds(16, 200, 280, 16)
		
		'//	This is what fires the actual bullets (pressing SPACE) at a rate of 1 bullet per 250 ms, hooked to the lazer.fire method
		FlxControl.player1.SetFireButton(KEY_SPACE, FlxControlHandler.KEYMODE_PRESSED, 250, lazer, ClassInfo(FlxWeapon.ClassObject).GetMethod("Fire",[]))

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
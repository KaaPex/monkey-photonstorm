Strict
Import mojo
Import flixel
Import flixel.plugin.photonstorm
Import "../assets/sprites/player.png"
Import "../assets/sprites/bullet.png"

#REFLECTION_FILTER="weapon*|flixel*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(640, 480, GetClass("WeaponTest1"), 1, 60, 60)
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
	Field lazer:FptFlxWeapon
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Field title:String = "Weapon 1"
	Field description:String = "Space Invaders Example"
	Field instructions:String = "LEFT / RIGHT to Move. Space to Fire.l"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		
		'//	Test specific
			
		'//	Our players space ship
		player = New FlxSprite(160, 200, "invaderPNG")
		
		'//	Creates our weapon. We'll call it "lazer" and link it to the x/y coordinates of the player sprite
		lazer = new FptFlxWeapon("lazer", player, "x", "y")
		
		'//	Tell the weapon to create 50 bullets using the bulletPNG image.
		'//	The 5 value is the x offset, which makes the bullet fire from the tip of the players ship.
		lazer.MakeImageBullet(50, "bulletPNG", 5)
		
		'//	Sets the direction and speed the bullets will be fired in
		lazer.SetBulletDirection(FptFlxWeapon.BULLET_UP, 200)
	
		#rem
		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		if (FlxG.getPlugin(FlxControl) == null)
		{
			FlxG.addPlugin(new FlxControl);
		}
		
		FlxControl.create(player, FlxControlHandler.MOVEMENT_INSTANT, FlxControlHandler.STOPPING_INSTANT, 1, false, false);
		FlxControl.player1.setMovementSpeed(200, 0, 200, 0);
		FlxControl.player1.setCursorControl(false, false, true, true);
		FlxControl.player1.setBounds(16, 200, 280, 16);
		
		'//	This is what fires the actual bullets (pressing SPACE) at a rate of 1 bullet per 250 ms, hooked to the lazer.fire method
		FlxControl.player1.setFireButton("SPACE", FlxControlHandler.KEYMODE_PRESSED, 250, lazer.fire);
		#end
		'//	The group which contains all of the bullets should be added so it is displayed
		Add(lazer.group)
		
		Add(player)
			
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Update:Void()
		If (KeyDown(KEY_SPACE) = 1) Then
			lazer.Fire()
		Endif
	
		Super.Update()
	End Method
End Class
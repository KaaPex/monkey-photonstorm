Strict

Import flixel

Import flixel.plugin.photonstorm
Import "../assets/sprites/advanced_wars_tank.png"
Import "../assets/sprites/advanced_wars_land.png"

#REFLECTION_FILTER="weapon*|flixel.flx*|flixel.plugin*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(640, 480, GetClass("WeaponTest5"), 1, 60, 60)
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("advWarsTankPNG", "advanced_wars_tank.png")
		FlxAssetsManager.AddImage("advWarsLandPNG", "advanced_wars_land.png")
	End Method	

End Class

Class WeaponTest5 Extends FlxState
	'//	Test specific variables
Private 
	
	Field tank:FlxSprite
	Field land:FlxSprite
	Field canon:FptFlxWeapon
	Field control:FptFlxControl
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Field title:String = "Weapon 5"
	Field description:String = "Advanced Wars Bullet Gravity Example"
	Field instructions:String = "Left/Right to move + mouse to aim and fire."
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		'//	Our players tank
		tank = New FlxSprite(60, 200, "advWarsTankPNG")
		
		'//	Creates our weapon. We'll call it "lazer" and link it to the x/y coordinates of the player sprite
		canon = new FptFlxWeapon("canon", tank, "x", "y")
		
		'//	Tell the weapon to create 50 bullets using the bulletPNG image.
		'//	The 5 value is the x offset, which makes the bullet fire from the tip of the players ship.
		canon.MakePixelBullet(100, 2, 2, $ffffffff, 13, 2)
		
		'//	Bullets will move at 120px/sec
		canon.SetBulletSpeed(120)
		
		'//	But bullets will have gravity pulling them down to earth at a rate of 60px/sec
		canon.SetBulletGravity(0, 60)
		
		'//	As we use the mouse to fire we need to limit how many bullets are shot at once (1 every 50ms)
		canon.SetFireRate(50)
		
		'//	This allows bullets to live within the bounds rect (stops them visually falling lower than the road)
		canon.SetBulletBounds(New FlxRect(0, 0, 320, 210))
		
		'//	Same land to drive over, yes, all stolen from Advanced Wars on the Gameboy
		land = New FlxSprite(0, 184, "advWarsLandPNG")

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FptFlxControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FptFlxControl())
		Endif
		
		FptFlxControl.Create(tank, FptFlxControlHandler.MOVEMENT_INSTANT, FptFlxControlHandler.STOPPING_INSTANT, 1, False, False)
		FptFlxControl.player1.SetMovementSpeed(200, 0, 200, 0)
		FptFlxControl.player1.SetCursorControl(False, False, True, True)
		FptFlxControl.player1.SetBounds(16, 200, 280, 16)
		
		Add(land)
		
		'//	The group which contains all of the bullets should be added so it is displayed
		Add(canon.group)
		
		Add(tank)
			
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Draw:Void()
        DrawText "Application has been running for: "+Millisecs()/1000.0+" seconds.",0,0
        Super.Draw()
    End
    
	Method Update:Void()
		If (FlxG.Mouse.Pressed()) Then
			canon.FireAtMouse()
		Endif
		Super.Update()
	End Method
	
End Class
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
		Super.New(640, 480, GetClass("WeaponTest8"), 1, 60, 60)
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("advWarsTankPNG", "advanced_wars_tank.png")
		FlxAssetsManager.AddImage("advWarsLandPNG", "advanced_wars_land.png")
	End Method	

End Class

Class WeaponTest8 Extends FlxState
	'//	Test specific variables
Private 
	
	Field tank:FlxSprite
	Field land:FlxSprite
	Field canon:FptFlxWeapon
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Field title:String = "Weapon 8"
	Field description:String = "Random Bullet Angles"
	Field instructions:String = "Left click to Fire. Random angle +20"
	
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
		canon.SetBulletSpeed(200)
		
		'//	But bullets will have gravity pulling them down to earth at a rate of 60px/sec
		canon.SetBulletGravity(0, 120)
		
		'//	As we use the mouse to fire we need to limit how many bullets are shot at once (1 every 50ms)
		canon.SetFireRate(50)
		
		'//	This allows bullets to live within the bounds rect (stops them visually falling lower than the road)
		canon.SetBulletBounds(New FlxRect(0, 0, 320, 210))
		
		'//	The bullets are fired at a fixed angle (-45 degrees) - this adds a +- 20 degree variance to each one
		canon.SetBulletRandomFactor(20)
			
		'//	Same land to drive over, yes, all stolen from Advanced Wars on the Gameboy
		land = New FlxSprite(0, 184, "advWarsLandPNG")

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
			canon.FireFromAngle(-45)
		Endif
		Super.Update()
	End Method
	
End Class
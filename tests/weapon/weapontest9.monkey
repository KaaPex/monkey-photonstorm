#rem NOT WORK YET
Strict

Import flixel

Import flixel.plugin.photonstorm
Import "../assets/sprites/advanced_wars_tank.png"
Import "../assets/pics/lance-overdose-loader_eye.png"

#REFLECTION_FILTER="weapon*|flixel.flx*|flixel.plugin*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(640, 480, GetClass("WeaponTest9"), 1, 60, 60)
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("advWarsTankPNG", "advanced_wars_tank.png")
		FlxAssetsManager.AddImage("overdoseEyePNG", "lance-overdose-loader_eye.png")
	End Method	

End Class

Class WeaponTest9 Extends FlxState
	'//	Test specific variables
Private 
	
	Field tank:FlxSprite
	Field land:FlxSprite
	Field canon:FptFlxWeapon
	Field damageSize:Int = 2
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Field title:String = "Weapon 9"
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
		canon.SetBulletSpeed(120)
		
		'//	But bullets will have gravity pulling them down to earth at a rate of 60px/sec
		canon.SetBulletGravity(0, 60)
		
		'//	As we use the mouse to fire we need to limit how many bullets are shot at once (1 every 50ms)
		canon.SetFireRate(50)		
			
		'//	Same land to drive over, yes, all stolen from Advanced Wars on the Gameboy
		land = New FlxSprite(0, 184, "overdoseEyePNG")

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
		If (FlxG.Mouse.Pressed()) Then
			canon.FireAtMouse()
		Endif
			
		If (FlxG.Keys.ONE) Then
			damageSize = 2
		Else If (FlxG.keys.TWO) Then
			damageSize = 4
		Else If (FlxG.keys.THREE) Then
			damageSize = 8
		Endif
		
		FlxG.Overlap(canon.group, land, ErasePartOfLand)
		
		Super.Update()
	End Method
	
	Method ErasePartOfLand:Void(bullet:FlxObject, theLand:FlxObject)
		if (FlxCollision.pixelPerfectCheck(bullet as FlxSprite, land))
		{
			//	Work out where into the image the bullet has landed
			var offsetX:int = bullet.x - land.x;
			var offsetY:int = bullet.y - land.y;
			
			//	Grab the BitmapData from the image, so we can modify it
			var temp:BitmapData = land.pixels;
			
			//	This erases a rect area of the image - but you could also draw a circle into it, or anything really
			temp.fillRect(new Rectangle(offsetX, offsetY, damageSize, damageSize), 0x0);
			
			//	Write it back again
			land.pixels = temp;
			
			//	And remove the bullet - you don't have to do this, it can make some interest effects if you don't!
			bullet.kill();
	End Method
	
End Class

Class ErasePartOfLand Implements FlxOverlapNotifyListener
	Method OnOverlapNotify:Void(object1:FlxObject, object2:FlxObject)
		If (FptFlxCollision.PixelPerfectCheck(FlxSprite(object1) , object2))
			'//	Work out where into the image the bullet has landed
			var offsetX:int = object1.x - object2.x;
			var offsetY:int = object1.y - object2.y;
			
			'//	Grab the BitmapData from the image, so we can modify it
			var temp:BitmapData = object2.pixels;
			
			'//	This erases a rect area of the image - but you could also draw a circle into it, or anything really
			temp.fillRect(new Rectangle(offsetX, offsetY, damageSize, damageSize), 0x0);
			
			'//	Write it back again
			object2.Pixels = temp
			
			'//	And remove the bullet - you don't have to do this, it can make some interest effects if you don't!
			object1.Kill()
		Endif		
	End Method
End Class
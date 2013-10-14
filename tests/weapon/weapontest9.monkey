Strict

Import flixel

Import flixel.plugin.photonstorm

Import "../assets/sprites/advanced_wars_tank.png"
Import "../assets/pics/lance-overdose-loader_eye.png"

#REFLECTION_FILTER="weapon*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(320, 256, GetClass("WeaponTest9"), 1, 60)
		Print WeaponTest9.title
		Print WeaponTest9.description
		Print WeaponTest9.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("advWarsTankPNG", "advanced_wars_tank.png")
		FlxAssetsManager.AddImage("overdoseEyePNG", "lance-overdose-loader_eye.png")
	End Method	

End Class

Class WeaponTest9 Extends FlxState Implements FlxOverlapNotifyListener
	'//	Test specific variables
Private 
	
	Field tank:FlxSprite
	Field land:FlxSprite
	Field canon:FlxWeapon
	Field damageSize:Int = 2
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Weapon 9"
	Global description:String = "Random Bullet Angles"
	Global instructions:String = "Left click to Fire. Random angle +20"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		'//	Our players tank
		tank = New FlxSprite(16, 132, "advWarsTankPNG")
		
		'//	Creates our weapon. We'll call it "lazer" and link it to the x/y coordinates of the player sprite
		canon = new FlxWeapon("canon", tank, "x", "y")
		
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
		land = New FlxSprite(120, 48, "overdoseEyePNG")

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
		Super.Update()
		
		If (FlxG.Mouse.Pressed()) Then
			canon.FireAtMouse()
		Endif
			
		If (FlxG.Keys.One) Then
			damageSize = 2
		Else If (FlxG.Keys.Two) Then
			damageSize = 4
		Else If (FlxG.Keys.Three) Then
			damageSize = 8
		Endif
				
		FlxG.Overlap(canon.group, land, self)		

	End Method
	
	Method OnOverlapNotify:Void(object1:FlxObject, object2:FlxObject)
		Local bullet:FlxSprite = FlxSprite(object1)
		If (FlxCollision.PixelPerfectCheck(bullet , land))
			'//	Work out where into the image the bullet has landed
			Local offsetX:int = bullet.x - land.x;
			Local offsetY:int = bullet.y - land.y;
			
			'//	Grab the BitmapData from the image, so we can modify it
			Local temp:Image = land.Pixels
			Local pixels:Int[] = New Int[damageSize * damageSize]
			For Local i:Int = 0 Until damageSize
				For Local j:Int = 0 Until damageSize
					pixels[i] = $00000000
				Next
			Next
			
			'//	This erases a rect area of the image - but you could also draw a circle into it, or anything really
			temp.WritePixels(pixels, offsetX, offsetY, damageSize, damageSize)
			'temp.fillRect(new Rectangle(offsetX, offsetY, damageSize, damageSize), 0x0);
			
			'//	Write it back again
			land.Pixels = temp
			
			'//	And remove the bullet - you don't have to do this, it can make some interest effects if you don't!
			bullet.Kill()
		Endif		
	End Method

End Class


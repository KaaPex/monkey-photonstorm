Strict

Import flixel

Import flixel.plugin.photonstorm
Import "../assets/sprites/ufo.png"
Import "../assets/sprites/chunk.png"

#REFLECTION_FILTER="weapon*|flixel.flx*|flixel.plugin*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(640, 480, GetClass("WeaponTest7"), 1, 60, 60)
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("ufoPNG", "ufo.png")
		FlxAssetsManager.AddImage("chunkPNG", "chunk.png")
	End Method	

End Class

Class WeaponTest7 Extends FlxState
	'//	Test specific variables
Private 
	
	Field ufo:FlxSprite
	Field lazer:FptFlxWeapon
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Field title:String = "Weapon 7"
	Field description:String = "Random Bullet Speed"
	Field instructions:String = "Left click to Fire at mouse"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		'header.showDarkBackground();
		
		'//	Creates our weapon. We'll call it "lazer"
		lazer = new FptFlxWeapon("lazer")
		
		'//	Tell the weapon to create 50 bullets using the chunkPNG image.
		lazer.MakeImageBullet(50, "chunkPNG")
		
		'//	This weapon will fire from a fixed (stationary) position
		lazer.SetFiringPosition(160, 140, 12, 12)
		
		'//	As we use the mouse to fire we need to limit how many bullets are shot at once (1 every 100ms)
		lazer.SetFireRate(100)
		
		'//	Bullets will move at 300px/sec
		lazer.SetBulletSpeed(300)
		
		'//	This gives the fired bullets a random speed adjustment of +- 100px/sec and offsets their launch x/y by +- 8px
		lazer.SetBulletRandomFactor(0, 100, New FlxPoint(8, 8))
			
		'//	This is a random speed of +- 200px/sec
		'//lazer.setBulletRandomFactor(0, 200);
			
		'//	Just some eye-candy, to make it look like a ufo is shooting :)
		ufo = New FlxSprite(160, 140, "ufoPNG")
		
		'//	The group which contains all of the bullets
		Add(lazer.group)
		
		Add(ufo)
			
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Draw:Void()
        DrawText "Application has been running for: "+Millisecs()/1000.0+" seconds.",0,0
        Super.Draw()
    End
    
	Method Update:Void()
		If (FlxG.Mouse.Pressed()) Then
			lazer.FireAtMouse()
		Endif
			
		Super.Update()
	End Method
	
End Class
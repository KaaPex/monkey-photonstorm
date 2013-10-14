Strict

Import flixel

Import flixel.plugin.photonstorm

Import "../assets/sprites/ufo.png"
Import "../assets/sprites/chunk.png"

#REFLECTION_FILTER = "weapon*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(320, 256, GetClass("WeaponTest2"), 1, 60)
		Print WeaponTest2.title
		Print WeaponTest2.description
		Print WeaponTest2.instructions			
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("ufoPNG", "ufo.png")
		FlxAssetsManager.AddImage("chunkPNG", "chunk.png")
	End Method	

End Class

Class WeaponTest2 Extends FlxState
	'//	Test specific variables
Private 
	
	Field ufo:FlxSprite
	Field lazer:FlxWeapon
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Weapon 2"
	Global description:String = "Fire from a fixed location to the mouse"
	Global instructions:String = "Left click to Fire at mouse"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		'header.showDarkBackground();
		
		'//	Creates our weapon. We'll call it "lazer"
		lazer = new FlxWeapon("lazer")
		
		'//	Tell the weapon to create 50 bullets using the chunkPNG image.
		lazer.MakeImageBullet(50, "chunkPNG")
		
		'//	This weapon will fire from a fixed (stationary) position
		lazer.SetFiringPosition(160, 140, 12, 12)
		
		'//	As we use the mouse to fire we need to limit how many bullets are shot at once (1 every 100ms)
		lazer.SetFireRate(100)
		
		'//	Bullets will move at 300px/sec
		lazer.SetBulletSpeed(300)
		
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
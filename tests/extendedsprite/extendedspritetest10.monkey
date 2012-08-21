Strict
#TEXT_FILES="*.txt|*.xml|*.json|*.csv"

Import "../assets/sprites/mana_card.png"

Import monkey.random
Import flixel
Import flixel.plugin.photonstorm

#REFLECTION_FILTER="extendedsprite*|flixel.flx*|flixel.plugin*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ExtendedSpriteTest10"), 1, 60, 60)
		
		Print ExtendedSpriteTest10.title
		Print ExtendedSpriteTest10.description
		Print ExtendedSpriteTest10.instructions		
		'FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("manaCardPNG", "mana_card.png")
	End Method	

End Class


Class ExtendedSpriteTest10 Extends FlxState
Private 
	'//	Test specific variables
	
	Field card:FlxExtendedSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Sprite Snap 2"
	Global description:String = "Sprite snaps to grid on release"
	Global instructions:String = "Sprite snaps to grid on release"
	
	Method Create:Void()

		'header = new TestsHeader(instructions);
		'add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FlxMouseControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		card = New FlxExtendedSprite(64, 48, "manaCardPNG")
			
		'//	This time the sprite will drag around freely / smoothly, but will snap to the 16x16 grid when released
		card.EnableMouseSnap(16, 16, false, true)
		
		'//	You should nearly always turn off lockToCenter when using mouse snap
		card.EnableMouseDrag()
		
		Add(card)
	
		'//	Header overlay
		'Add(header.overlay)
	End Method
	
	Method Update:Void()
		Super.Update()
		
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FlxMouseControl.Clear()
		
		Super.Destroy()
	End Method	
	
End Class
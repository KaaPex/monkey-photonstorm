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
		Super.New(320, 256, GetClass("ExtendedSpriteTest9"), 1, 60, 60)
		
		Print ExtendedSpriteTest9.title
		Print ExtendedSpriteTest9.description
		Print ExtendedSpriteTest9.instructions		
		'FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("manaCardPNG", "mana_card.png")
	End Method	

End Class


Class ExtendedSpriteTest9 Extends FlxState
Private 
	'//	Test specific variables
	
	Field card:FlxExtendedSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Sprite Snap 1"
	Global description:String = "Sprite snaps to grid while dragged"
	Global instructions:String = "Sprite snaps to 32x32 grid as dragged"
	
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
			
		'//	The sprite will snap to a 32x32 sized grid as you drag it around
		card.EnableMouseSnap(32, 32)
		
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
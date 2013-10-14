Strict

Import "../assets/sprites/atari130xe.png"

Import flixel
Import flixel.plugin.photonstorm
Import atari

#REFLECTION_FILTER = "extendedsprite*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ExtendedSpriteTest15"), 1, 60)
		
		Print ExtendedSpriteTest15.title
		Print ExtendedSpriteTest15.description
		Print ExtendedSpriteTest15.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("atari130xePNG", "atari130xe.png")
	End Method	

End Class


class ExtendedSpriteTest15 extends FlxState
Private 
	'//	Test specific variables
	
	Field test1:Atari

	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "External Sprite"
	Global description:String = "Using an external class sprite"
	Global instructions:String = "This sprite is built from its own class"
	
	Method Create:Void()

		'header = new TestsHeader(instructions);
		'add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxMouseControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		test1 = new Atari()
			
		Add(test1)
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
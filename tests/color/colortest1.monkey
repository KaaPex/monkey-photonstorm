Strict
Import "../assets/suite/hud.png"

Import mojo
Import flixel
Import flixel.plugin.photonstorm
Import flixel.plugin.photonstorm.tests.testsheader

#REFLECTION_FILTER="color*|flixel*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(320, 256, GetClass("ColorTest1"), 1, 60, 60)
		Print ColorTest1.title
		Print ColorTest1.description
		Print ColorTest1.instructions	
		'FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("hudPNG", "hud.png")
	End Method	

End Class

Class ColorTest1 Extends FlxState
	'//	Test specific variables
Private 
	Field canvas:FlxSprite
	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Colors 1"
	Global description:String = "Demonstrates FlxColor.GetRandomColor"
	Global instructions:String = "Demonstrates FlxColor.GetRandomColor"
	
	Method Create:Void()
		header = New TestsHeader(instructions)
		Add(header)
		FlxG.Mouse.Show()
		'//	Test specific
		canvas = New FlxSprite(32, 32).MakeGraphic(256, 176, $ff000000)	
		Add(canvas)
	
		
		'//	Header overlay
		Add(header.overlay)
	End Method
	
	Method Update:Void()
		'//	Draw a randomly coloured box onto the canvas
		Local rect:FlxSprite = New FlxSprite(FlxMath.Rand(32, 256), FlxMath.Rand(32, 176)).MakeGraphic(16, 16, FlxExtendedColor.GetRandomColor(20))
		Add(rect)

		Super.Update()
	End Method
End Class
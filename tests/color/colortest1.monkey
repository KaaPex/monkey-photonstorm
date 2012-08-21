Strict
Import mojo
Import flixel
Import flixel.plugin.photonstorm
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

End Class

Class ColorTest1 Extends FlxState
	'//	Test specific variables
Private 
	Field canvas:FlxSprite
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Colors 1"
	Global description:String = "Demonstrates FlxColor.GetRandomColor"
	Global instructions:String = "Demonstrates FlxColor.GetRandomColor"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		
		'//	Test specific
		canvas = New FlxSprite(32, 32).MakeGraphic(256, 176, $ff000000)	
		Add(canvas)
	
		
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Update:Void()
		'//	Draw a randomly coloured box onto the canvas
		Local rect:FlxSprite = New FlxSprite(FlxMath.Rand(2, 236), FlxMath.Rand(2, 156)).MakeGraphic(16, 16, FlxExtendedColor.GetRandomColor(20))
		Add(rect)

		Super.Update()
	End Method
End Class
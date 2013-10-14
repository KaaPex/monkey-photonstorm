Strict
Import mojo
Import flixel
Import flixel.plugin.photonstorm
#REFLECTION_FILTER = "color*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(320, 256, GetClass("ColorTest2"), 1, 60)
		Print ColorTest2.title
		Print ColorTest2.description
		Print ColorTest2.instructions		
		'FlxG.VisualDebug = True
	End Method

End Class

Class ColorTest2 Extends FlxState
	'//	Test specific variables
Private 
	Field canvas:FlxSprite

	Field hsv:Int[]
	Field hsvIndex:Int
	Field lastRect:FlxRect
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Colors 2"
	Global description:String = "Using the HSV color wheel"
	Global instructions:String = "Using the HSV color wheel"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		
		'//	Test specific
		hsv = FlxExtendedColor.GetHSVColorWheel()
		hsvIndex = 0
		canvas = New FlxSprite(32, 32).MakeGraphic(256, 176, $ff000000)	
		Add(canvas)
	
		lastRect = New FlxRect(8, 8, 16, 16)
		
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Update:Void()

		Super.Update()

		If (hsvIndex < 359) Then
			
			Local rect:FlxSprite = New FlxSprite(lastRect.x, lastRect.y).MakeGraphic(lastRect.width, lastRect.height, hsv[hsvIndex])
			Add(rect)
			
			lastRect.x += 8
			
			If (lastRect.x >= 240) Then
				lastRect.x = 8
				lastRect.y += 12
			Endif
			
			hsvIndex += 1
		Endif

	End Method
End Class
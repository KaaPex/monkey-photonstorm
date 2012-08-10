Strict
Import mojo
Import flixel
Import flixel.plugin.photonstorm

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(640, 480, ColorTest2.ClassObject, 1, 60, 60)
		'FlxG.VisualDebug = True
	End Method

End Class

Class ColorTest2Class Implements FlxClass

	Method CreateInstance:Object()
		Return New ColorTest2()
	End Method
	
	Method InstanceOf:Bool(object:Object)
		Return (ColorTest2(object) <> Null)
	End Method

End Class

Class ColorTest2 Extends FlxState

	Global ClassObject:FlxClass = new ColorTest2Class()
	
	'//	Test specific variables
Private 
	Field canvas:FlxSprite

	Field hsv:Int[]
	Field hsvIndex:Int
	Field lastRect:FlxRect
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Field title:String = "Colors 2"
	Field description:String = "Using the HSV color wheel"
	Field instructions:String = "Using the HSV color wheel"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		
		'//	Test specific
		hsv = FptFlxColor.GetHSVColorWheel()
		hsvIndex = 0
		canvas = New FlxSprite(32, 32).MakeGraphic(580, 380, $ff000000)	
		Add(canvas)
	
		lastRect = New FlxRect(16, 16, 32, 32)
		
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method _DrawSurface:
	
	Method Update:Void()

		Super.Update()

		If (hsvIndex < 359) Then
			
			Local rect:FlxSprite = New FlxSprite(lastRect.x, lastRect.y).MakeGraphic(lastRect.width, lastRect.height, hsv[hsvIndex])
			Add(rect)
			
			lastRect.x += 16
			
			If (lastRect.x >= 580) Then
				lastRect.x = 16
				lastRect.y += 24
			Endif
			
			hsvIndex += 1
		Endif

	End Method
End Class
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
		Super.New(640, 480, ColorTest1.ClassObject, 1, 60, 60)
		'FlxG.VisualDebug = True
	End Method

End Class

Class ColorTest1Class Implements FlxClass

	Method CreateInstance:Object()
		Return New ColorTest1()
	End Method
	
	Method InstanceOf:Bool(object:Object)
		Return (ColorTest1(object) <> Null)
	End Method

End Class

Class ColorTest1 Extends FlxState
Global ClassObject:FlxClass = new ColorTest1Class()
	'//	Test specific variables
Private 
	Field canvas:FlxSprite
'	Field header:TestsHeader

Public
	'//	Common variables
	Field title:String = "Colors 1"
	Field description:String = "Demonstrates FptFlxColor.GetRandomColor"
	Field instructions:String = "Demonstrates FptFlxColor.GetRandomColor"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		
		'//	Test specific
		canvas = New FlxSprite(32, 32).MakeGraphic(580, 380, $ff000000)	
		Add(canvas)
	
		
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Update:Void()
		'//	Draw a randomly coloured box onto the canvas
		Local rect:FlxSprite = New FlxSprite(FptFlxMath.Rand(32, 580), FptFlxMath.Rand(32, 380)).MakeGraphic(16, 16, FptFlxColor.GetRandomColor(20))
		'canvas.Pixels = canvas.Pixels & rect.Pixels
		Add(rect)

		Super.Update()
	End Method
End Class
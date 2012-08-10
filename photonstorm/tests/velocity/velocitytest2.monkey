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
		Super.New(640, 480, VelocityTest2.ClassObject, 1, 60, 60)
		FlxG.VisualDebug = True
	End Method

End Class

Class VelocityTest2Class Implements FlxClass

	Method CreateInstance:Object()
		Return New VelocityTest2()
	End Method
	
	Method InstanceOf:Bool(object:Object)
		Return (VelocityTest2(object) <> Null)
	End Method

End Class

Class VelocityTest2 Extends FlxState
Global ClassObject:FlxClass = new VelocityTest2Class()
	'//	Test specific variables
Private 
	
	Field red:FlxSprite
	Field green:FlxSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Field title:String = "Velocity 2"
	Field description:String = "Get the angle between 2 FlxObjects"
	Field instructions:String = ""
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		
		'//	Test specific
			
		'red = New FlxSprite(160, 120, "..\assets\sprites\red_ball.png")
		'green = New FlxSprite(-32, 0, "../assets/sprites/green_ball.png")
		red = New FlxSprite(160, 120)
		green = New FlxSprite(-32, 0)
			
		Add(red)
		Add(green)	
		
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Update:Void()
		Super.Update()
		green.x = FlxG.Mouse.screenX
		green.y = FlxG.Mouse.screenY
			
		Local a:Float = FptFlxVelocity.AngleBetween(red, green)
		
		FlxG.Log("Angle between red and green: " + Int(FptFlxMath.AsDegrees(a))	)
		'header.instructions.text = "Angle between red and green: " + Math.round(FlxMath.asDegrees(a));
	End Method
End Class
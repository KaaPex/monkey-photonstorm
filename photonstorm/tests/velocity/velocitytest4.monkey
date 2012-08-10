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
		Super.New(640, 480, VelocityTest4.ClassObject, 1, 60, 60)
		FlxG.VisualDebug = True
	End Method

End Class

Class VelocityTest4Class Implements FlxClass

	Method CreateInstance:Object()
		Return New VelocityTest4()
	End Method
	
	Method InstanceOf:Bool(object:Object)
		Return (VelocityTest4(object) <> Null)
	End Method

End Class

Class VelocityTest4 Extends FlxState
Global ClassObject:FlxClass = new VelocityTest4Class()
	'//	Test specific variables
Private 
	
	Field red:FlxSprite
	Field green:FlxSprite
	Field blue:FlxSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Field title:String = "Velocity 1"
	Field description:String = "Move an FlxObject towards another FlxObject"
	Field instructions:String = "Click with the mouse to position the green ball"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		
		'//	Test specific
			
		'red = New FlxSprite(160, 120, "..\assets\sprites\red_ball.png")
		'green = New FlxSprite(-32, 0, "../assets/sprites/green_ball.png")
		'blue = New FlxSprite(0, 0, "../assets/sprites/blue_ball.png")
		red = New FlxSprite(160, 120)
		green = New FlxSprite(-32, 0)
		blue = New FlxSprite(0, 0)
		blue.visible = false
			
		Add(blue)
		Add(red)
		Add(green)
	
		'//	Bring up the debugger to watch the velocity values
		'	FlxG.watch(blue.velocity, "x", "vx")
		'	FlxG.watch(blue.velocity, "y", "vy")
			
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Update:Void()
		Super.Update()
		If (blue.OnScreen() = False) Then
			blue.exists = False
		Endif
		
		If (FlxG.Mouse.JustReleased()) Then
			green.x = FlxG.Mouse.screenX
			green.y = FlxG.Mouse.screenY
			
			blue.x = red.x
			blue.y = red.y
			blue.exists = True
			blue.visible = True
			
			FptFlxVelocity.AccelerateTowardsObject(blue, green, 50, 200, 200);
		Endif
	End Method
End Class
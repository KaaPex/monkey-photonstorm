Strict
Import mojo
Import flixel
Import flixel.plugin.photonstorm
Import "../assets/sprites/red_ball.png"
Import "../assets/sprites/green_ball.png"
Import "../assets/sprites/blue_ball.png"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(640, 480, VelocityTest1.ClassObject, 1, 60, 60)
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("red_ball", "red_ball.png")
		FlxAssetsManager.AddImage("green_ball", "green_ball.png")
		FlxAssetsManager.AddImage("blue_ball", "blue_ball.png")
	End Method	

End Class

Class VelocityTest1Class Implements FlxClass

	Method CreateInstance:Object()
		Return New VelocityTest1()
	End Method
	
	Method InstanceOf:Bool(object:Object)
		Return (VelocityTest1(object) <> Null)
	End Method

End Class

Class VelocityTest1 Extends FlxState
Global ClassObject:FlxClass = new VelocityTest1Class()
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
			
		red = New FlxSprite(160, 120, "red_ball")
		green = New FlxSprite(-32, 0, "green_ball")
		blue = New FlxSprite(0, 0, "blue_ball")
		blue.visible = false
			
		Add(blue)
		Add(red)
		Add(green)
	
		
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Update:Void()
		Super.Update()
		If (FlxG.Mouse.JustReleased()) Then
			green.x = FlxG.Mouse.screenX
			green.y = FlxG.Mouse.screenY
			
			blue.x = red.x
			blue.y = red.y
			blue.visible = true
			
			FptFlxVelocity.MoveTowardsObject(blue, green, 180)
		Endif
	End Method
End Class
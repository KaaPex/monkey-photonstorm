Strict
Import mojo
Import flixel
Import flixel.plugin.photonstorm
Import "../assets/sprites/red_ball.png"
Import "../assets/sprites/green_ball.png"
#REFLECTION_FILTER="velo*|flixel*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(320, 256, GetClass("VelocityTest2"), 1, 60, 60)
		Print VelocityTest2.title
		Print VelocityTest2.description
		Print VelocityTest2.instructions
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("red_ball", "red_ball.png")
		FlxAssetsManager.AddImage("green_ball", "green_ball.png")
	End Method	

End Class

Class VelocityTest2 Extends FlxState

	'//	Test specific variables
Private 
	
	Field red:FlxSprite
	Field green:FlxSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Velocity 2"
	Global description:String = "Get the angle between 2 FlxObjects"
	Global instructions:String = ""
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		red = New FlxSprite(160, 120, "red_ball")
		green = New FlxSprite(-32, 0, "green_ball")
			
		Add(red)
		Add(green)	
		
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Update:Void()
		Super.Update()
		green.x = FlxG.Mouse.screenX
		green.y = FlxG.Mouse.screenY
			
		Local a:Float = FlxVelocity.AngleBetween(red, green)
		
		FlxG.Log("Angle between red and green: " + Int(FlxMath.AsDegrees(a))	)
		'header.instructions.text = "Angle between red and green: " + Math.round(FlxMath.asDegrees(a));
	End Method
End Class
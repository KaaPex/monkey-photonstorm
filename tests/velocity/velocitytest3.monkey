Strict
Import mojo
Import flixel
Import flixel.plugin.photonstorm

Import "../assets/sprites/red_ball.png"
Import "../assets/sprites/green_ball.png"

#REFLECTION_FILTER = "velo*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()
		Super.New(320, 256, GetClass("VelocityTest3"), 1, 60)
		Print VelocityTest3.title
		Print VelocityTest3.description
		Print VelocityTest3.instructions
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("red_ball", "red_ball.png")
		FlxAssetsManager.AddImage("green_ball", "green_ball.png")
	End Method	

End Class

Class VelocityTest3 Extends FlxState
	'//	Test specific variables
Private 
	
	Field red:FlxSprite
	Field green:FlxSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Velocity 3"
	Global description:String = "Get the distance between 2 FlxObjects"
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
		
		FlxG.Log("Distance between red and green: " + FlxVelocity.DistanceBetween(red, green) + " px" )
		'header.instructions.text = "Angle between red and green: " + Math.round(FlxMath.asDegrees(a));
	End Method
End Class
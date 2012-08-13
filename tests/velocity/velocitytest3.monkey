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
		Super.New(640, 480, GetClass("VelocityTest3"), 1, 60, 60)
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
	Field title:String = "Velocity 2"
	Field description:String = "Get the angle between 2 FlxObjects"
	Field instructions:String = ""
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		
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
		
		FlxG.Log("Distance between red and green: " + FptFlxVelocity.DistanceBetween(red, green) + " px" )
		'header.instructions.text = "Angle between red and green: " + Math.round(FlxMath.asDegrees(a));
	End Method
End Class
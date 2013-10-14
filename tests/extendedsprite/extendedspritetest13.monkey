Strict

Import "../assets/sprites/red_ball.png"

Import monkey.random
Import flixel
Import flixel.plugin.photonstorm.tests.controls.controltestscene3
Import flixel.plugin.photonstorm

#REFLECTION_FILTER = "extendedsprite*"

'import tests.TestsHeader
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ExtendedSpriteTest13"), 1, 60)
		
		Print ExtendedSpriteTest13.title
		Print ExtendedSpriteTest13.description
		Print ExtendedSpriteTest13.instructions		
		'FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("redPNG", "red_ball.png")
	End Method	

End Class


Class ExtendedSpriteTest13 Extends FlxState
Private 
	'//	Test specific variables
	
	Field ball:FlxExtendedSprite
	Field debug:FlxSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Springs 2"
	Global description:String = "Mouse Spring only active on click"
	Global instructions:String = "The spring is only active on click"
	
	Method Create:Void()

		'header = new TestsHeader(instructions)
		'add(header)
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxMouseControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		ball = New FlxExtendedSprite(160, 120, "redPNG")
			
		'//	Adds a Mouse Spring to this sprite. The first parameter (false) means the spring is always active.
		ball.EnableMouseSpring(True)
		
		'//	As the sprite is 16x16 and we want the spring to attach to the middle of it, we need an 8x8 offset
		ball.springOffsetX = 8
		ball.springOffsetY = 8
		
		debug = New FlxSprite(0, 0).MakeGraphic(FlxG.Width, FlxG.Height, $0)
		debug.Solid = false
		
		'//	Walls for the ball to rebound off, positioned just outside the camera edges
		Add(FlxCollision.CreateCameraWall(FlxG.Camera, FlxCollision.CAMERA_WALL_OUTSIDE, 16, true))
		
		Add(debug)
		Add(ball)
	
		'//	Header overlay
		'Add(header.overlay)
	End Method
	

	Method Update:Void()
		Super.Update()
		
		FlxG.Collide()
		'//	Draw the spring line to the debug sprite
		'debug.Fill($0)
		'debug.DrawLine(ball.SpringX, ball.SpringY, FlxG.Mouse.x, FlxG.Mouse.y, $ffFFFFFF, 1)
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FlxMouseControl.Clear()
		
		Super.Destroy()
	End Method	
	
End Class
Strict

Import "../assets/sprites/shinyball.png"

Import monkey.random
Import flixel
Import flixel.plugin.photonstorm.tests.controls.controltestscene1
Import flixel.plugin.photonstorm

#REFLECTION_FILTER = "extendedsprite*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ExtendedSpriteTest7"), 1, 60)
		
		Print ExtendedSpriteTest7.title
		Print ExtendedSpriteTest7.description
		Print ExtendedSpriteTest7.instructions		
		'FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("shinyBallPNG", "shinyball.png")
	End Method	

End Class


Class ExtendedSpriteTest7 Extends FlxState
Private 
	'//	Test specific variables
	
	Field ball:FlxExtendedSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Sprite Throw 1"
	Global description:String = "Throw a Sprite"
	Global instructions:String = "Throw the sprite with the mouse"
	
	Method Create:Void()

		'header = new TestsHeader(instructions);
		'add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxMouseControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		ball = New FlxExtendedSprite(64, 48, "shinyBallPNG")
			
		'//	Just to make it visually more interesting we apply gravity pulling the ball down
		ball.SetGravity(0, 100, 500, 500, 10, 10)
		
		'//	For the best feeling you should enable Mouse Drag along with Mouse Throw, but it's not essential.
		'//	If you don't enable Drag or Clicks then enabling Mouse Throw will automatically enable Mouse Clicks.
		ball.EnableMouseDrag(true, true)
		
		'//	The x/y factors depend on how fast you want the sprite to move - here we use 50, so its sprite velocity = mouse speed * 50
		ball.EnableMouseThrow(50, 50)
		
		'//	Allow the ball to rebound a little bit, but it will eventually slow to a halt
		ball.elasticity = 0.5
		
		'//	Some walls to collide against
		Add(FlxCollision.CreateCameraWall(FlxG.Camera, FlxCollision.CAMERA_WALL_OUTSIDE, 16, true))
		
		Add(ball)
		
		'//	Header overlay
		'Add(header.overlay)
	End Method
	
	Method Update:Void()
		Super.Update()

		FlxG.Collide()
		
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FlxMouseControl.Clear()
		
		Super.Destroy()
	End Method	
	
End Class
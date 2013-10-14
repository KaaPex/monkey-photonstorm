Strict

Import "../assets/sprites/shinyball.png"

Import monkey.random
Import flixel
Import flixel.plugin.photonstorm.tests.controls.controltestscene1
Import flixel.plugin.photonstorm

#REFLECTION_FILTER="extendedsprite*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ExtendedSpriteTest8"), 1, 60)
		
		Print ExtendedSpriteTest8.title
		Print ExtendedSpriteTest8.description
		Print ExtendedSpriteTest8.instructions		
		'FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("shinyBallPNG", "shinyball.png")
	End Method	

End Class


Class ExtendedSpriteTest8 Extends FlxState
Private 
	'//	Test specific variables
	
	Field ball:FlxExtendedSprite
	Field walls:FlxGroup
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Mouse Zone 1"
	Global description:String = "Limit mouse actions to an FlxRect"
	Global instructions:String = "Mouse can only click/drag/throw while in this zone"
	
	Method Create:Void()

		'header = new TestsHeader(instructions);
		'add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxMouseControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		'//	The Mouse Zone is a region outside of which mouse actions are ignored.
		'//	For example you won't be able to click, drag or throw the ball unless it's within the mouse zone.
		'//	If you are dragging the ball and the mouse leaves the zone, it'll automatically let go.
		FlxMouseControl.mouseZone = new FlxRect(0, 156, 320, 100)
		
		'//	This is just so we can visually see the mouse zone - it's not required for actual use
		Local debugZone:FlxSprite = New FlxSprite(0, 156).MakeGraphic(320, 100, $55FF0080)
		
		'//	From here on down it's mostly the same as ExtendedSpriteTest7
		ball = New FlxExtendedSprite(64, 48, "shinyBallPNG")
		
		'//	Just to make it visually more interesting we apply gravity pulling the ball down
		ball.SetGravity(0, 100)
		
		'//	For the best feeling you should enable Mouse Drag along with Mouse Throw, but it's not essential.
		'//	If you don't enable Drag or Clicks then enabling Mouse Throw will automatically enable Mouse Clicks.
		ball.EnableMouseDrag(true, true)
		
		'//	The x/y factors depend on how fast you want the sprite to move - here we use 50, so its sprite velocity = mouse speed * 50
		ball.EnableMouseThrow(50, 50)
		
		'//	Allow the ball to rebound a little bit, but it will eventually slow to a halt
		ball.elasticity = 0.5;
		
		'//	Some walls to collide against
		walls = FlxCollision.CreateCameraWall(FlxG.Camera, FlxCollision.CAMERA_WALL_OUTSIDE, 16, true)
		
		Add(debugZone)
		Add(walls)
		Add(ball)
		
		'//	Header overlay
		'Add(header.overlay)
	End Method
	
	Method Update:Void()
		Super.Update()

		FlxG.Collide(ball, walls)
		
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FlxMouseControl.Clear()
		
		Super.Destroy()
	End Method	
	
End Class
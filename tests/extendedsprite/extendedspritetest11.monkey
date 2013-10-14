Strict
#TEXT_FILES = "*.csv"

Import "../assets/tiles/platformer_tiles.png"
Import "../assets/maps/mapCSV_Group1_Map1.csv"
Import "../assets/sprites/red_ball.png"

Import monkey.random
Import flixel
Import flixel.plugin.photonstorm.tests.controls.controltestscene3
Import flixel.plugin.photonstorm

#REFLECTION_FILTER = "extendedsprite*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ExtendedSpriteTest11"), 1, 60)
		
		Print ExtendedSpriteTest11.title
		Print ExtendedSpriteTest11.description
		Print ExtendedSpriteTest11.instructions		
		'FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddString("bigMapCSV", "mapCSV_Group1_Map1.csv")
		FlxAssetsManager.AddImage("redPNG", "red_ball.png")
		FlxAssetsManager.AddImage("platformerTilesPNG", "platformer_tiles.png")
	End Method	

End Class


Class ExtendedSpriteTest11 Extends FlxState
Private 
	'//	Test specific variables
	
	Field level:ControlTestScene3
	Field ball:FlxExtendedSprite
	Field debug:FlxText
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Sprite Throw 2"
	Global description:String = "Throw a Sprite in a map"
	Global instructions:String = "Throw the sprite around the map"
	
	Method Create:Void()

		'header = new TestsHeader(instructions);
		'add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxMouseControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		level = new ControlTestScene3()
			
		ball = New FlxExtendedSprite(64, 32, "redPNG")
		
		'//	Just to make it visually more interesting we apply gravity pulling the ball down
		ball.SetGravity(0, 100, 500, 500, 10, 10)
		
		'//	For the best feeling you should enable Mouse Drag along with Mouse Throw, but it's not essential.
		'//	If you don't enable Drag or Clicks then enabling Mouse Throw will automatically enable Mouse Clicks.
		ball.EnableMouseDrag(false, true)
		
		'//	The x/y factors depend on how fast you want the sprite to move - here we use 50, so its sprite velocity = mouse speed * 50
		ball.EnableMouseThrow(50, 50)
		
		'//	Allow the ball to rebound a little bit, but it will eventually slow to a halt
		ball.elasticity = 0.5
		
		'//	Make the camera follow the ball
		FlxG.Camera.Follow(ball)
		
		'//	The deadzone is the most important thing to get right when using mouse drag AND scrolling cameras
		'//	When the mouse LEAVES the deadzone and is dragging the follow target, the camera will start to move REALLY fast.
		'//	So you need to ensure the deadzone is a good large size, and ideally link the FlxMouseControl to it
		'//	Also make sure the sprite starts WITHIN the deadzone, or it can never be dragged!
		
		FlxG.Camera.deadzone = New FlxRect(32, 32, FlxG.Width - 64, FlxG.Height - 64)
		
		FlxMouseControl.linkToDeadZone = true
		
		Add(level)
		Add(ball)
		
		debug = new FlxText(0, 32, 300, "")
		debug.scrollFactor.x = 0
		debug.scrollFactor.y = 0
		
		Add(debug);
	
		'//	Header overlay
		'Add(header.overlay)
	End Method
	
	Method Update:Void()
		Super.Update()
		'debug.Text = "Mouse x: " + int(FlxG.Mouse.x) + " y: " + int(FlxG.Mouse.y) + " sx: " + FlxG.Mouse.screenX + " sy: " + FlxG.Mouse.screenY
			
		FlxG.Collide(level, ball)
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FlxMouseControl.Clear()
		
		Super.Destroy()
	End Method	
	
End Class
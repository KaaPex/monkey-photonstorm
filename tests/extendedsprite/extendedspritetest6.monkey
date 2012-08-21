Strict
#TEXT_FILES="*.txt|*.xml|*.json|*.csv"

Import "../assets/sprites/balls.png"

Import monkey.random
Import flixel
Import flixel.plugin.photonstorm.tests.controls.controltestscene1
Import flixel.plugin.photonstorm

#REFLECTION_FILTER="extendedsprite*|flixel.flx*|flixel.plugin*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ExtendedSpriteTest6"), 1, 60, 60)
		
		Print ExtendedSpriteTest6.title
		Print ExtendedSpriteTest6.description
		Print ExtendedSpriteTest6.instructions		
		'FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("ballsPNG", "balls.png")
	End Method	

End Class


Class ExtendedSpriteTest6 Extends FlxState Implements FlxExtendedSpriteListerner
Private 
	'//	Test specific variables
	
	Field clock:FlxDelay
	Field timer:FlxText
	Field balls:FlxGroup
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Balls MiniGame"
	Global description:String = "Click all the sprites fast!"
	Global instructions:String = "Click all balls before times up!"
	
	Method Create:Void()

		'header = new TestsHeader(instructions);
		'add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FlxMouseControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		balls = new FlxGroup(32)
			
		'//	Creates 32 ball sprites that start with a random velocity and all rebound off each other
		'//	They are clickable (pixel perfect only) and when clicked call the spriteClicked function
		For Local i:Int = 0 Until 32
			Local tempBall:FlxExtendedSprite = New FlxExtendedSprite(160, 16)
			tempBall.LoadGraphic("ballsPNG", True, False, 17, 17)
			tempBall.Frame = Int(Rnd() * tempBall.frames)
			tempBall.velocity.x = -100 + Rnd() * 200
			tempBall.velocity.y = Rnd() * 100
			tempBall.elasticity = 1
			tempBall.EnableMouseClicks(True, True)
			tempBall.mousePressedCallback = self
			balls.Add(tempBall)
		Next
		
		'//	Displays the amount of time we have left in the middle
		timer = new FlxText(0, 64, FlxG.Width)
		timer.Alignment(FlxText.ALIGN_CENTER)
		timer.Size = 100
		'timer.Alpha = 0.3
		timer.Shadow = $ff000000
		
		'//	Walls for the balls to rebound off, positioned just outside the screen edges
		Add(FlxCollision.CreateCameraWall(FlxG.Camera, FlxCollision.CAMERA_WALL_OUTSIDE, 16, true))
		
		'//	A 30-second timer to beat
		clock = new FlxDelay(1000 * 30)
		timer.Text = clock.SecondsRemaining
		clock.Start()
		
		Add(timer)
		Add(balls)
		
		'//	Header overlay
		'Add(header.overlay)
	End Method
	
	Method Update:Void()
		Super.Update()
		If (clock.HasExpired) Then
			If (balls.CountLiving() > 0) Then
				timer.Text = "LOST"
			Endif
			Remove(balls)
		else
			timer.Text = clock.SecondsRemaining
			FlxG.Collide()
		Endif

	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FlxMouseControl.Clear()
		
		Super.Destroy()
	End Method
	
	'/**
	 '* This function is called when the sprite is clicked (mouse down)
	 '* 
	 '* @param	obj		The FlxExtendedSprite that was clicked (in the case of this test it's always atari)
	 '* @param	x		The x coordinate WITHIN THE SPRITE that was clicked, calculated from its origin
	 '* @param	y		The y coordinate WITHIN THE SPRITE that was clicked, calculated from its origin
	 '*/
	Method MouseReleased:Void (obj:FlxExtendedSprite, x:Int, y:Int)
	End Method
	
	Method MousePressed:Void (obj:FlxExtendedSprite, x:Int, y:Int)
		obj.Kill()
			
		If (balls.CountLiving() = 0 And clock.HasExpired = False) Then
			timer.Text = "WON!"
			'header.instructions.Text = "Balls Left: " + balls.countLiving()
			clock.Abort()
		Else
			'header.instructions.Text = "Balls Left: " + balls.countLiving()
		Endif
	End Method

	Method StartDrag:Void (obj:FlxExtendedSprite, x:Int, y:Int)
	End Method
	
	Method StopDrag:Void (obj:FlxExtendedSprite, x:Int, y:Int)
	End Method
		
End Class
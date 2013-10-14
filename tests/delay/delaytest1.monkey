Strict

Import "../assets/sprites/red_ball.png"
Import "../assets/sprites/green_ball.png"
Import "../assets/sprites/blue_ball.png"

Import flixel
Import monkey.random
Import flixel.plugin.photonstorm

#REFLECTION_FILTER="delay*"

'import tests.TestsHeader
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("DelayTest1"), 1, 60)
		
		Print DelayTest1.title
		Print DelayTest1.description
		Print DelayTest1.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("redPNG", "red_ball.png")
		FlxAssetsManager.AddImage("greenPNG", "green_ball.png")
		FlxAssetsManager.AddImage("bluePNG", "blue_ball.png")
	End Method	

End Class

Class DelayTest1 Extends FlxState

Private 

	'Field header:TestsHeader
	
	'//	Test specific variables
	Field timer:FlxDelay
	Field red:FlxSprite
	Field green:FlxSprite
	Field blue:FlxSprite
	
Public
	'//	Common variables
	Global title:String = "Delay 1"
	Global description:String = "Example of the FlxDelay timer class"
	Global instructions:String = "Sprites change position every 2000ms (2 seconds)"

		
	Method Create:Void()
		'header = new TestsHeader(instructions)
		'add(header)
		FlxG.Mouse.Show()
		'//	Test specific
		
		red = New FlxSprite(32, 32, "redPNG")
		green = New FlxSprite(96, 96, "greenPNG")
		blue = New FlxSprite(128, 128, "bluePNG")
		
		timer = new FlxDelay(2000)
		timer.Start()
		
		Add(blue)
		Add(red)
		Add(green)
		
		'//	Header overlay
		'add(header.overlay)
	End Method
	
	Method Update:Void()
	
		super.Update()

		If (timer.HasExpired) Then 
			'//	If 1000ms (1 second) has passed then the timer expires
			
			'//	Randomise the sprite positions
			red.x = Rnd(0, 320 - red.width)
			red.y = Rnd(32, 180)
			
			green.x = Rnd(0, 320 - green.width)
			green.y = Rnd(32, 180)

			blue.x = Rnd(0, 320 - blue.width)
			blue.y = Rnd(32, 180)
			
			'//	And start the timer again
			timer.Start()
		Endif
		timer.Update()
		
	End Method
		
End Class
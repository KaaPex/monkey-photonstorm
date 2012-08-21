Strict
#TEXT_FILES="*.txt|*.xml|*.json|*.csv"

Import "../assets/sprites/red_ball.png"
Import "../assets/sprites/green_ball.png"
Import "../assets/sprites/blue_ball.png"

Import monkey.random
Import flixel
Import flixel.plugin.photonstorm.tests.controls.controltestscene3
Import flixel.plugin.photonstorm

#REFLECTION_FILTER="extendedsprite*|flixel.flx*|flixel.plugin*"

'import tests.TestsHeader
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ExtendedSpriteTest14"), 1, 60, 60)
		
		Print ExtendedSpriteTest14.title
		Print ExtendedSpriteTest14.description
		Print ExtendedSpriteTest14.instructions		
		'FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("redPNG", "red_ball.png")
		FlxAssetsManager.AddImage("greenPNG", "green_ball.png")
		FlxAssetsManager.AddImage("bluePNG", "blue_ball.png")
	End Method	

End Class


Class ExtendedSpriteTest14 Extends FlxState
Private 
	'//	Test specific variables
	
	Field ball1:FlxExtendedSprite
	Field ball2:FlxExtendedSprite
	Field ball3:FlxExtendedSprite
	Field debug:FlxSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Springs 1"
	Global description:String = "Thing on a Spring!"
	Global instructions:String = "A sprite on the end of a Spring"
	
	Method Create:Void()

		'header = new TestsHeader(instructions)
		'add(header)
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FlxMouseControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		ball1 = New FlxExtendedSprite(160, 120, "redPNG")
		ball1.EnableMouseSpring(false)
		ball1.springOffsetX = 8
		ball1.springOffsetY = 8
		
		ball2 = New FlxExtendedSprite(160, 120, "greenPNG")
		ball2.EnableMouseSpring(false, false, 0.1, 0.95, -5)
		ball2.springOffsetX = 8
		ball2.springOffsetY = 8
		
		ball3 = New FlxExtendedSprite(160, 120, "bluePNG")
		ball3.EnableMouseSpring(false, false, 0.1, 0.95, 5)
		ball3.springOffsetX = 8
		ball3.springOffsetY = 8
		
		debug = New FlxSprite(0, 0).MakeGraphic(FlxG.Width, FlxG.Height, $0)
		debug.Solid = false
		
		'//	There seems to be a bug in Flixel where if you get the mouse and/or sprite well outside the camera zone via a COLLISION, the world scrolls!
		'//	If you swing these balls a lot near the bottom of the test suite you'll see what I mean. Very strange indeed.
		
		Add(debug)
		Add(ball1)
		Add(ball2)
		Add(ball3)
	
		'//	Header overlay
		'Add(header.overlay)
	End Method
	
	Method Update:Void()
		Super.Update()

		'//	Draw the spring
		
		'debug.fill(0x0);
		
		'debug.drawLine(ball1.springX, ball1.springY, FlxG.mouse.x, FlxG.mouse.y, 0xffFFFFFF, 1);
		'debug.drawLine(ball2.springX, ball2.springY, FlxG.mouse.x, FlxG.mouse.y, 0xffFFFFFF, 1);
		'debug.drawLine(ball3.springX, ball3.springY, FlxG.mouse.x, FlxG.mouse.y, 0xffFFFFFF, 1);
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FlxMouseControl.Clear()
		
		Super.Destroy()
	End Method	
	
End Class
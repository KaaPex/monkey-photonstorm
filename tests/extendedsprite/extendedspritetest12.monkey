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
		Super.New(320, 256, GetClass("ExtendedSpriteTest12"), 1, 60)
		
		Print ExtendedSpriteTest12.title
		Print ExtendedSpriteTest12.description
		Print ExtendedSpriteTest12.instructions		
		'FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("redPNG", "red_ball.png")
	End Method	

End Class


Class ExtendedSpriteTest12 Extends FlxState
Private 
	'//	Test specific variables
	
	Field ball:FlxExtendedSprite
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
		If (FlxG.GetPlugin(FlxMouseControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		ball = New FlxExtendedSprite(160, 120, "redPNG")
			
		'//	Adds a Mouse Spring to this sprite. The first parameter (false) means the spring is always active.
		ball.EnableMouseSpring(false)
		
		'//	As the sprite is 16x16 and we want the spring to attach to the middle of it, we need an 8x8 offset
		ball.springOffsetX = 8
		ball.springOffsetY = 8
		
		'//	This is just to draw the spring on, to make it visible
		debug = New FlxSprite(0, 0).MakeGraphic(FlxG.Width, FlxG.Height, $0)
		
		Add(debug)
		Add(ball)
	
		'//	Header overlay
		'Add(header.overlay)
	End Method
	
	Method Render:Void()
	
	End Method
	
	Method Update:Void()
		Super.Update()
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
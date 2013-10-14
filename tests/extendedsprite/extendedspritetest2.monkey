Strict

Import "../assets/sprites/atari800xl.png"
Import "../assets/sprites/shinyball.png"

Import flixel

Import flixel.plugin.photonstorm

#REFLECTION_FILTER="extendedsprite*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ExtendedSpriteTest2"), 1, 60)
		
		Print ExtendedSpriteTest2.title
		Print ExtendedSpriteTest2.description
		Print ExtendedSpriteTest2.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("atari800xlPNG", "atari800xl.png")
		FlxAssetsManager.AddImage("shinyBallPNG", "shinyball.png")

	End Method	

End Class


class ExtendedSpriteTest2 extends FlxState
Private 
	'//	Test specific variables
	Field items:FlxGroup
		
	Field atari:FlxExtendedSprite
	Field ball:FlxExtendedSprite

	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Sprite Drag 2"
	Global description:String = "Priority Order Sprite Drag"
	Global instructions:String = "The ball is always dragged first, even when behind"
	
	Method Create:Void()

		'header = new TestsHeader(instructions);
		'add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(FlxMouseControl.__CLASS__) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		items = New FlxGroup(3)
			
		atari = New FlxExtendedSprite(32, 32, "atari800xlPNG")
		atari.Alpha = 0.8
		atari.EnableMouseDrag()
		atari.priorityID = 1
		
		ball = New FlxExtendedSprite(64, 48, "shinyBallPNG")
		ball.EnableMouseDrag(False, True)
		ball.priorityID = 2
		
		'//	This controls the parameter used to determine which sprite is dragged when one or more of them overlap
		
		FlxMouseControl.sortIndex = "priorityID"
		FlxMouseControl.sortOrder = FlxMouseControl.ASCENDING
		
		'//	In this case the Atari computer sprite overlaps the ball, but it doesn't matter as the ball has a higher priorityID, 
		'// so it will always get dragged first regardless of its display order
			
		items.Add(ball)
		items.Add(atari)
		
		Add(items)
		'//	Header overlay
		'Add(header.overlay)
	End Method
	
	Method Update:Void()
		Super.Update()
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FlxMouseControl.Clear()
		
		Super.Destroy()
	End Method
		
End Class
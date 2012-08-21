Strict
#TEXT_FILES="*.txt|*.xml|*.json|*.csv"

Import "../assets/sprites/arrows.png"

Import flixel

Import flixel.plugin.photonstorm

#REFLECTION_FILTER="extendedsprite*|flixel.flx*|flixel.plugin*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ExtendedSpriteTest3"), 1, 60, 60)
		
		Print ExtendedSpriteTest3.title
		Print ExtendedSpriteTest3.description
		Print ExtendedSpriteTest3.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("arrowsPNG", "arrows.png")

	End Method	

End Class


class ExtendedSpriteTest3 extends FlxState
Private 
	'//	Test specific variables
	Field items:FlxGroup
		
	Field arrow1:FlxExtendedSprite
	Field arrow2:FlxExtendedSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Sprite Drag 3"
	Global description:String = "Direction Locked Dragging"
	Global instructions:String = "The arrows are direction drag-locked"
	
	Method Create:Void()

		'header = new TestsHeader(instructions);
		'add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FlxMouseControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		arrow1 = new FlxExtendedSprite(160, 160)
		arrow1.LoadGraphic("arrowsPNG", True, False, 23, 31)
		arrow1.Frame = 0
		arrow1.EnableMouseDrag(false, true)
		
		'//	This arrow can only move horizontally
		arrow1.SetDragLock(true, false)
		
		arrow2 = new FlxExtendedSprite(64, 160)
		arrow2.LoadGraphic("arrowsPNG", True, False, 23, 31)
		arrow2.Frame = 1
		arrow2.angle = 270
		arrow2.EnableMouseDrag(false, true)
		
		'//	This arrow can only move vertically
		arrow2.SetDragLock(false, true)
		
		Add(arrow1)
		Add(arrow2)
		
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
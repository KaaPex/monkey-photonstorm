Strict
#TEXT_FILES="*.txt|*.xml|*.json|*.csv"

Import "../assets/sprites/atari130xe.png"

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
		Super.New(320, 256, GetClass("ExtendedSpriteTest5"), 1, 60, 60)
		
		Print ExtendedSpriteTest5.title
		Print ExtendedSpriteTest5.description
		Print ExtendedSpriteTest5.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("atari130xePNG", "atari130xe.png")
	End Method	

End Class


Class ExtendedSpriteTest5 Extends FlxState Implements FlxExtendedSpriteListerner
Private 
	'//	Test specific variables
	
	Field atari:FlxExtendedSprite
	Field clickCounter:FlxText
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Sprite Clicks 1"
	Global description:String = "Big Clickable Sprite"
	Global instructions:String = "Click and drag the sprite!"
	
	Method Create:Void()

		'header = new TestsHeader(instructions);
		'add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FlxMouseControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		atari = New FlxExtendedSprite(64, 96, "atari130xePNG")
		atari.EnableMouseClicks(false)
		atari.EnableMouseDrag(false)
		atari.mouseReleasedCallback = self
		
		clickCounter = new FlxText(16, 32, 200, "")
		
		Add(atari)
		Add(clickCounter)
		
		'//	Header overlay
		'Add(header.overlay)
	End Method
	
	Method Update:Void()
		Super.Update()
		clickCounter.Text = "Clicks: " + atari.Clicks
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
		'header.instructions.text = "Sprite clicked at x: " + x + " y: " + y;
		
		atari.Alpha = 0.1 + (Rnd() * 0.9)
	End Method
	
	Method MousePressed:Void (obj:FlxExtendedSprite, x:Int, y:Int)
	End Method

	Method StartDrag:Void (obj:FlxExtendedSprite, x:Int, y:Int)
	End Method
	
	Method StopDrag:Void (obj:FlxExtendedSprite, x:Int, y:Int)
	End Method
		
End Class
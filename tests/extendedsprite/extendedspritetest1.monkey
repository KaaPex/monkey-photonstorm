Strict
#TEXT_FILES="*.txt|*.xml|*.json|*.csv"

Import "../assets/sprites/carrot.png"
Import "../assets/sprites/mushroom.png"
Import "../assets/sprites/melon.png"
Import "../assets/sprites/eggplant.png"
Import "../assets/sprites/tomato.png"
Import "../assets/sprites/onion.png"

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
		Super.New(320, 256, GetClass("ExtendedSpriteTest1"), 1, 60, 60)
		
		Print ExtendedSpriteTest1.title
		Print ExtendedSpriteTest1.description
		Print ExtendedSpriteTest1.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("carrotPNG", "carrot.png")
		FlxAssetsManager.AddImage("mushroomPNG", "mushroom.png")
		FlxAssetsManager.AddImage("melonPNG", "melon.png")
		FlxAssetsManager.AddImage("eggplantPNG", "eggplant.png")
		FlxAssetsManager.AddImage("tomatoPNG", "tomato.png")
		FlxAssetsManager.AddImage("onionPNG", "onion.png")
	End Method	

End Class


class ExtendedSpriteTest1 extends FlxState
Private 
	'//	Test specific variables
	
	Field tasty:FlxGroup
	
	Field carrot:FlxExtendedSprite
	Field mushroom:FlxExtendedSprite
	Field melon:FlxExtendedSprite
	Field tomato:FlxExtendedSprite
	Field onion:FlxExtendedSprite
	Field eggplant:FlxExtendedSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Sprite Drag 1"
	Global description:String = "Lots of Draggable Sprites"
	Global instructions:String = "Drag the sprites with the mouse"
	
	Method Create:Void()

		'header = new TestsHeader(instructions);
		'add(header);
		FlxG.Mouse.Show()
		'//	Test specific
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FlxMouseControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FlxMouseControl())
		Endif
		
		tasty = new FlxGroup(6)
		
		'//	You can drag the carrot from anywhere inside its bounding box (including transparent parts)
		'//	This is the fastest method of dragging (in terms of CPU) so use it if you can! Especially for rectangle shaped sprites
		carrot = New FlxExtendedSprite(32, 32, "carrotPNG")
		carrot.EnableMouseDrag()
		
		'//	The mushroom needs a pixel perfect drag, so the edges are not included
		mushroom = New FlxExtendedSprite(64, 64, "mushroomPNG")
		mushroom.EnableMouseDrag(False, True)
		
		'//	The melon and eggplant need pixel perfect clicks as well, but this time the middle of the sprites snaps to the mouse coordinates (lockCenter)
		melon = New FlxExtendedSprite(128, 128, "melonPNG")
		melon.EnableMouseDrag(True, True)
		
		eggplant = New FlxExtendedSprite(164, 132, "eggplantPNG")
		eggplant.EnableMouseDrag(True, True)
		
		'//	The tomato and onion are stuck in this fixed rectangle!
		Local cage:FlxRect = New FlxRect(16, 160, 200, 64)
		
		'//	This is just so we can see the drag bounds on-screen
		Local cageOutline:FlxSprite = New FlxSprite(cage.x, cage.y).MakeGraphic(cage.width, cage.height, $66FF0080)
		
		tomato = New FlxExtendedSprite(64, 170, "tomatoPNG")
		tomato.EnableMouseDrag(True, True, 255, cage);
		
		onion = New FlxExtendedSprite(140, 180, "onionPNG")
		onion.EnableMouseDrag(True, True, 255, cage)
		
		tasty.Add(carrot)
		tasty.Add(mushroom)
		tasty.Add(melon)
		tasty.Add(eggplant)
		tasty.Add(tomato)
		tasty.Add(onion)
		
		Add(cageOutline)
		Add(tasty)
		
		'//	Header overlay
		'Add(header.overlay)
	End Method
	
	Method Update:Void()
		Super.Update()
		
		'//	Sorts the sprites on the Y axis (the further down the screen they are, the more "on-top" they visually appear)
		tasty.Sort()
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FlxMouseControl.Clear()
		
		Super.Destroy()
	End Method
		
End Class
Strict
#TEXT_FILES="*.txt|*.xml|*.json|*.csv"

Import "../assets/sprites/ufo.png"
Import "../assets/tiles/sci-fi-tiles.png"
Import "../assets/maps/mapCSV_SciFi_Map1.csv"

Import flixel

Import flixel.plugin.photonstorm
Import controltestscene1

#REFLECTION_FILTER="control*|flixel.flx*|flixel.plugin*"

'import tests.TestsHeader;
Function Main:Int()
	New Objects()
	Return 0
End Function

Class Objects Extends FlxGame
	
	Method New()		
		Super.New(320, 256, GetClass("ControlTest1"), 1, 60, 60)
		
		Print ControlTest1.title
		Print ControlTest1.description
		Print ControlTest1.instructions		
		'FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddString("scifiMap1CSV", "mapCSV_SciFi_Map1.csv")
		FlxAssetsManager.AddImage("ufoPNG", "ufo.png")
		FlxAssetsManager.AddImage("scifiTilesPNG", "sci-fi-tiles.png")
	End Method	

End Class

Class ControlTest1 Extends FlxState
	'//	Test specific variables
Private 
	
	Field player:FlxSprite
	Field scene:ControlTestScene1
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Controls 9"
	Global description:String = "Analog Onscreen Control"
	Global instructions:String = "Move with the analog cursor? works only on IOS and Android"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		'//	Our players space ship
		player = New FlxSprite(64, 64, "ufoPNG")
		

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FlxControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FlxControl())
		Endif
		
		FlxControl.Create(player, FlxControlHandler.MOVEMENT_INSTANT, FlxControlHandler.STOPPING_INSTANT,,,,True)
		FlxControl.player1.SetStandardSpeed(100, False)
		FlxControl.player1.SetOnScreenControlBase(10,0)'sets grathics and position
		'FlxControl.player1.SetAnalogOnScreenControl()'init analog onscreen control
		FlxControl.player1.SetAnalogOnScreenControl(,True)'init digital onscreen control
		
		'//	setStandardSpeed is a special short-cut function, you can get more control (and the same result) by calling this instead:
		'//FlxControl.player1.setMovementSpeed(100, 100, 100, 100)
		
		'//	A basic scene for our ufo to fly around
		scene = New ControlTestScene1()
		
		'//	Bring up the Flixel debugger if you'd like to watch these values in real-time
		'FlxG.Watch(player.velocity, "x", "vx")
		'FlxG.Watch(player.velocity, "y", "vy")
		
		Add(scene)
		Add(player)
		Add(FlxControl.player1.analogOnScreenControl) 'base group of control
			
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Draw:Void()
        DrawText "Application has been running for: "+Millisecs()/1000.0+" seconds.",0,0
        Super.Draw()
    End
    
	Method Update:Void()
		FlxG.Collide(player, scene.map)
		Super.Update()
	End Method
	
End Class

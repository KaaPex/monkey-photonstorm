Strict
#TEXT_FILES="*.txt|*.xml|*.json|*.csv"

Import "../assets/sprites/asteroids_ship.png"

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
		Super.New(320, 256, GetClass("ControlTest7"), 1, 60, 60)
		
		Print ControlTest7.title
		Print ControlTest7.description
		Print ControlTest7.instructions		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddImage("asteroidsShipPNG", "asteroids_ship.png")
	End Method	

End Class

Class ControlTest7 Extends FlxState
	'//	Test specific variables
Private 
	
	Field player:FlxSprite
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Controls 7"
	Global description:String = "Classic Asteroids movement"
	Global instructions:String = "Left/Right to Rotate. Up to Thrust"
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		'//	Our players space ship
		player = New FlxSprite(160, 140, "asteroidsShipPNG")

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FlxControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FlxControl())
		Endif
		
		'//	We want the motion of the ship to accelerate and decelerate smoothly ...
		FlxControl.Create(player, FlxControlHandler.MOVEMENT_ACCELERATES, FlxControlHandler.STOPPING_DECELERATES, 1, false, false)
		
		'//	The UP key will thrust the ship at a speed of 100px/sec/2
		FlxControl.player1.SetThrust(KEY_UP, 100)
		
		'//	And when it's not thrusting, this is the speed at which the ship decelerates back to a stand-still
		FlxControl.player1.SetDeceleration(100, 100)
		
		'//	They can also rotate it - rotation will accelerate and decelerate (giving it a smoothing off effect)
		FlxControl.player1.SetRotationType(FlxControlHandler.ROTATION_ACCELERATES, FlxControlHandler.ROTATION_STOPPING_DECELERATES)
		
		'//	The rotation speeds - 400 for CCW and CW rotation, 200 as the max rotation speed and 400 for deceleration
		FlxControl.player1.SetRotationSpeed(400, 400, 200, 400)
		
		'//	Set the rotation keys - the default is to use LEFT/RIGHT arrows, so we don't actually need to pass anything here! but they can be whatever you need
		FlxControl.player1.SetRotationKeys()
		
		Add(player)
			
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Draw:Void()
        DrawText "Application has been running for: "+Millisecs()/1000.0+" seconds.",0,0
        Super.Draw()
    End
    
	Method Update:Void()		
		Super.Update()
		FlxDisplay.ScreenWrap(player)
	End Method
	
End Class

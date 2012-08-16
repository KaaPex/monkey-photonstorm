Strict
#TEXT_FILES="*.txt|*.xml|*.json|*.csv"

Import "../assets/sprites/red_ball.png"
Import "../assets/sprites/green_ball.png"
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
		Super.New(320, 288, GetClass("ControlTest3"), 1, 60, 60)
		
		FlxG.VisualDebug = True
	End Method
	
	Method OnContentInit:Void()
		FlxAssetsManager.AddString("scifiMap1CSV", "mapCSV_SciFi_Map1.csv")
		FlxAssetsManager.AddImage("redPNG", "red_ball.png")
		FlxAssetsManager.AddImage("greenPNG", "green_ball.png")
		FlxAssetsManager.AddImage("scifiTilesPNG", "sci-fi-tiles.png")
	End Method	

End Class

Class ControlTest3 Extends FlxState
	'//	Test specific variables
Private 
	
	Field player1:FlxSprite
	Field player2:FlxSprite
	Field scene:ControlTestScene1
	
'	Field header:TestsHeader

Public
	'//	Common variables
	Global title:String = "Controls 3"
	Global description:String = "2 Player (same keyboard) demo"
	Global instructions:String = "Red uses WASD. Green uses IJKL."
	
	Method Create:Void()
'		header = new TestsHeader(instructions);
'		Add(header);
		FlxG.Mouse.Show()
		'//	Test specific
			
		'//	Test specific
		player1 = New FlxSprite(64, 64, "redPNG")
		player1.Solid = true
		player1.elasticity = 0.9
		
		player2 = New FlxSprite(240, 150, "greenPNG")
		player2.Solid = true
		player2.elasticity = 0.9

		'//	The following are controls for the player, note that the "setFireButton" controls the speed at which bullets are fired, not the Weapon class itself
		
		'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
		If (FlxG.GetPlugin(ClassInfo(FptFlxControl.ClassObject)) = Null) Then
			FlxG.AddPlugin(New FptFlxControl())
		Endif
		
		'//	Control the players			
		FptFlxControl.Create(player1, FptFlxControlHandler.MOVEMENT_ACCELERATES, FptFlxControlHandler.STOPPING_DECELERATES, 1, false, false)
		FptFlxControl.player1.SetWASDControl()
		FptFlxControl.player1.SetStandardSpeed(200)
		
		FptFlxControl.Create(player2, FptFlxControlHandler.MOVEMENT_ACCELERATES, FptFlxControlHandler.STOPPING_DECELERATES, 2, false, false)
		FptFlxControl.player2.SetIJKLControl()
		FptFlxControl.player2.SetStandardSpeed(200)
		
		'//	A scene for our players to move around
		scene = New ControlTestScene1()
		
		Add(scene)
		Add(player1)
		Add(player2)
			
		'//	Header overlay
		'add(header.overlay);
	End Method
	
	Method Draw:Void()
        'DrawText "Application has been running for: "+Millisecs()/1000.0+" seconds.",0,0
        Super.Draw()
    End
    
	Method Update:Void()
		Super.Update()

		'// importan include after Super.Update()
		FlxG.Collide(player1, player2)
		FlxG.Collide(player1, scene)
		FlxG.Collide(player2, scene)
		
	End Method
	
	Method Destroy:Void()
		'//	Important! Clear out the plugin otherwise resources will get messed right up after a while
		FptFlxControl.Clear()
			
		Super.Destroy()
	End Method
End Class

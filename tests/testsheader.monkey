Import flixel
import flixel.plugin.photonstorm
	
class TestsHeader extends FlxGroup
	
Private 
	Field background:FlxSprite
	Field darkBackground:FlxSprite
	Field hud:FlxSprite
	'Field backButton:FlxButtonPlus
	
Public 
	Field instructions:FlxText
	Field mainMenu:Bool = False
	Field overlay:FlxGroup
	
	Method New(text:String, showButton:Bool = True) 
		Super.New()
		
		'background = FlxGradient.createGradientFlxSprite(320, 256, [0xff004080, 0xff3C3CFF])
		'FlxGridOverlay.overlay(background, 16, 16, 320, 256, False, True, 0x44e7e6e6, 0x44d9d5d5)
		
		background = FlxGridOverlay.Create( 16, 16, 320, 256, False, True, $44e7e6e6, $44d9d5d5)
		background.scrollFactor.x = 0
		background.scrollFactor.y = 0
		
		'darkBackground = FlxGradient.createGradientFlxSprite(320, 256, [0xff191919, 0xff242424])
		'FlxGridOverlay.overlay(darkBackground, 16, 16, 320, 256, false, true, 0x44e7e6e6, 0x44d9d5d5)
		'darkBackground.scrollFactor.x = 0
		'darkBackground.scrollFactor.y = 0
		'darkBackground.visible = false
		
		overlay = new FlxGroup(3)
		
		hud = New FlxSprite(0, 0, "hudPNG")
		hud.scrollFactor.x = 0
		hud.scrollFactor.y = 0
		
		instructions = new FlxText(0, FlxG.Height - 13, 320, text)
		instructions.Alignment(FlxText.ALIGN_CENTER)
		instructions.scrollFactor.x = 0
		instructions.scrollFactor.y = 0
		
		'//	Back Button
		'backButton = New FlxButtonPlus(285, 0, backToMenu)
		'var buttonUp:FlxSprite = New FlxSprite(0, 0, backUpPNG)
		'var buttonDown:FlxSprite = New FlxSprite(0, 0, backDownPNG)
		'backButton.loadGraphic(buttonUp, buttonDown)
		'backButton.visible = showButton
		
		overlay.Add(hud)
		overlay.Add(instructions)
		'overlay.Add(backButton)
		
		Add(background)
		'Add(darkBackground)
		
		'//	So we can take screen shots of any of the test suites
		'If (FlxG.getPlugin(FlxScreenGrab) == Null)
		'{
		'	FlxG.addPlugin(new FlxScreenGrab)
		'}
		
		'//	Define our hotkey (string value taken from FlxG.keys) the parameters simply say "save it right away" and "hide the mouse first"
		'FlxScreenGrab.defineHotKey("F1", true, true)
	End Method
	
	Method HideHeader:Void()
		overlay.Remove(hud)
		overlay.Remove(instructions)
		
		'backButton.x += 19
		'backButton.y += 1
		
		Remove(background)
		'Remove(darkBackground)
	End Method
	
	Method ShowDarkBackground:Void()
		background.visible = False
		'darkBackground.visible = True
	End Method
	
	Method ShowBlackBackground:void()
		background.visible = false
		'darkBackground.visible = false
	End Method
	
	Method Update:Void()
		Super.Update()
		
		'if (Registry.info != instructions.text && mainMenu)
		'{
		'	instructions.text = Registry.info
		'}
		
		'if (FlxG.keys.justReleased("ESCAPE") && mainMenu == false)
		'{
		'	backToMenu()
		'}
	End Method
	
	'Method BackToMenu():Void
	'	If (FlxFlod.isPlaying) Then
	'		FlxFlod.StopMod()
	'	Endif
	'	
	'	FlxG.SwitchState(New DemoSuiteState)
	'End Method
	
End Class
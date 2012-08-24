''/**
 '* FlxControlHandler
 '* -- Part of the Flixel Power Tools set
 '* 
 '* v1.8 Added isPressedUp/Down/Left/Right handlers
 '* v1.7 Modified update function so gravity is applied constantly
 '* v1.6 Thrust and Reverse complete, final few rotation bugs solved. Sounds hooked in for fire, jump, walk and thrust
 '* v1.5 Full support for rotation with min/max angle limits
 '* v1.4 Fixed bug in runFire causing fireRate to be ignored
 '* v1.3 Major refactoring and lots of new enhancements
 '* v1.2 First real version deployed to dev
 '* v1.1 Updated for the Flixel 2.5 Plugin system
 '* 
 '* @version 1.8 - August 16th 2011
 '* @link http://www.photonstorm.com
 '* @author Richard Davey / Photon Storm
''*/
Strict
Import reflection
Import monkey.math
Import flixel
Import flxmath
Import flxvelocity
Import flxextendedsprite
Import "./data/onscreen_control_base.png"
Import "./data/onscreen_control_knob.png"

''/**
'* Makes controlling an FlxSprite with the keyboard a LOT easier and quicker to set-up!<br>
'* Sometimes it's hard to know what values to set, especially if you want gravity, jumping, sliding, etc.<br>
'* This class helps sort that - and adds some cool extra functionality too :)
'* 
'* TODO
'* ----
'* Allow to bind Fire Button to FlxWeapon
'* Allow to enable multiple key sets. So cursors and WASD together
'* Hot Keys
'* Binding of sound effects to keys (seperate from setSounds? as those are event based)
'* If moving diagonally compensate speed parameter (times x,y velocities by 0.707 or cos/sin(45))
'* Specify animation frames to play based on velocity
'* Variable gravity (based on height, the higher the stronger the effect)
''*/

Class FlxControlHandler
	'//	Used by the FlxControl plugin
Public 
	Field enabled:Bool = False
	
Private 
	Field _entity:FlxSprite = Null
	
	Field _bounds:FlxRect
	
	Field _up:Bool
	Field _down:Bool
	Field _left:Bool
	Field _right:Bool
	Field _fire:Bool
	Field _altFire:Bool
	Field _jump:Bool
	Field _altJump:Bool
	Field _xFacing:Bool
	Field _yFacing:Bool
	Field _rotateAntiClockwise:Bool
	Field _rotateClockwise:Bool
	
	Field _upMoveSpeed:Int
	Field _downMoveSpeed:Int
	Field _leftMoveSpeed:Int
	Field _rightMoveSpeed:Int
	Field _thrustSpeed:Int
	Field _reverseSpeed:Int
	
	'//	Rotation
	Field _thrustEnabled:Bool
	Field _reverseEnabled:Bool
	Field _isRotating:Bool
	Field _antiClockwiseRotationSpeed:Float
	Field _clockwiseRotationSpeed:Float
	Field _enforceAngleLimits:Bool
	Field _minAngle:Int
	Field _maxAngle:Int
	Field _capAngularVelocity:Bool
	
	Field _xSpeedAdjust:Float = 0
	Field _ySpeedAdjust:Float = 0
	
	Field _gravityX:Int = 0
	Field _gravityY:Int = 0
	
	Field _fireRate:Int 			'// The ms delay between firing when the key is held down
	Field _nextFireTime:Int 		'// The internal time when they can Next fire
	Field _lastFiredTime:Int 	'// The internal time of when when they last fired
	Field _fireKeyMode:Int		'// The fire key mode
	Field _fireObject:Object			'// A fire object
	Field _fireParams:Object[]  '//Fire parameters with which it fire
	Field _fireCallback:MethodInfo	'// A Method To call every time they fire
	
	Field _jumpHeight:Int 		'// The pixel height amount they jump (drag And gravity also both influence this)
	Field _jumpRate:Int 			'// The ms delay between jumping when the key is held down
	Field _jumpKeyMode:Int		'// The jump key mode
	Field _nextJumpTime:Int 		'// The internal time when they can Next jump
	Field _lastJumpTime:Int 		'// The internal time of when when they last jumped
	Field _jumpFromFallTime:Int 	'// A short window of opportunity For them To jump having just fallen off the edge of a surface
	Field _extraSurfaceTime:Int 	'// Internal time of when they last collided with a valid jumpSurface
	Field _jumpSurface:Int 		'// The surfaces from FlxObject they can jump from (i.e. FlxObject.FLOOR)
	Field _jumpObject:Object	'// jump object
	Field _jumpParams:Object[]  '//Jump parameters with which it jump
	Field _jumpCallback:MethodInfo	'// A Function To call every time they jump
	
	Field _movement:Int
	Field _stopping:Int
	Field _rotation:Int
	Field _rotationStopping:Int
	Field _capVelocity:Bool
	
	Field _hotkeys:String[]			'// TODO Array
	
	Field _upKey:int
	Field _downKey:int
	Field _leftKey:int
	Field _rightKey:int
	Field _fireKey:int
	Field _altFireKey:int		'// TODO
	Field _jumpKey:int
	Field _altJumpKey:int		'// TODO
	Field _antiClockwiseKey:int
	Field _clockwiseKey:int
	Field _thrustKey:int
	Field _reverseKey:Int
	
	'//	Sounds
	Field _jumpSound:FlxSound = Null
	Field _fireSound:FlxSound = Null
	Field _walkSound:FlxSound = Null
	Field _thrustSound:FlxSound = Null
	
	'// Analog On Screen Control
	Field _analogControl:Bool = False
	Field _digitalControl:Bool = False
	Field _analogControlSize:Int = 50
	Field _onScreenBase:FlxSprite = Null
	Field _onScreenKnob:FlxExtendedSprite = Null
	
	'//	Helpers
Public 
	Field isPressedUp:Bool = False
	Field isPressedDown:Bool = False
	Field isPressedLeft:Bool = False
	Field isPressedRight:Bool = False
	
	'// Analog On Screen Control
	Field analogOnScreenControl:FlxGroup
	'/**
	'* The "Instant" Movement Type means the sprite will move at maximum speed instantly, and will not "accelerate" (or speed-up) before reaching that speed.
	 '*/
	Const MOVEMENT_INSTANT:Int = 0
	'/**
	'* The "Accelerates" Movement Type means the sprite will accelerate until it reaches maximum speed.
	 '*/
	Const MOVEMENT_ACCELERATES:Int = 1
	'/**
	'* The "Instant" Stopping Type means the sprite will stop immediately when no direction keys are being pressed, there will be no deceleration.
	 '*/
	Const STOPPING_INSTANT:Int = 0
	'/**
	'* The "Decelerates" Stopping Type means the sprite will start decelerating when no direction keys are being pressed. Deceleration continues until the speed reaches zero.
	 '*/
	Const STOPPING_DECELERATES:Int = 1
	'/**
	'* The "Never" Stopping Type means the sprite will never decelerate, any speed built up will be carried on and never reduce.
	 '*/
	Const STOPPING_NEVER:Int = 2
	
	'/**
	'* The "Instant" Movement Type means the sprite will rotate at maximum speed instantly, and will not "accelerate" (or speed-up) before reaching that speed.
	 '*/
	Const ROTATION_INSTANT:Int = 0
	'/**
	'* The "Accelerates" Rotaton Type means the sprite will accelerate until it reaches maximum rotation speed.
	 '*/
	Const ROTATION_ACCELERATES:Int = 1
	'/**
	'* The "Instant" Stopping Type means the sprite will stop rotating immediately when no rotation keys are being pressed, there will be no deceleration.
	 '*/
	Const ROTATION_STOPPING_INSTANT:Int = 0
	'/**
	'* The "Decelerates" Stopping Type means the sprite will start decelerating when no rotation keys are being pressed. Deceleration continues until rotation speed reaches zero.
	 '*/
	Const ROTATION_STOPPING_DECELERATES:Int = 1
	'/**
	'* The "Never" Stopping Type means the sprite will never decelerate, any speed built up will be carried on and never reduce.
	 '*/
	Const ROTATION_STOPPING_NEVER:Int = 2
	
	'/**
	'* This keymode fires for as long as the key is held down
	 '*/
	Const KEYMODE_PRESSED:Int = 0
	
	'/**
	'* This keyboard fires when the key has just been pressed down, and not again until it is released and re-pressed
	 '*/
	Const KEYMODE_JUST_DOWN:Int = 1
	
	'/**
	'* This keyboard fires only when the key has been pressed and then released again
	 '*/
	Const KEYMODE_RELEASED:Int = 2
	
	'/**
	'* Sets the FlxSprite to be controlled by this class, and defines the initial movement and stopping types.<br>
	'* After creating an instance of this class you should call setMovementSpeed, and one of the enableXControl functions if you need more than basic cursors.
	'* 
	'* @param	source			The FlxSprite you want this class to control. It can only control one FlxSprite at once.
	'* @param	movementType	Set to either MOVEMENT_INSTANT or MOVEMENT_ACCELERATES
	'* @param	stoppingType	Set to STOPPING_INSTANT, STOPPING_DECELERATES or STOPPING_NEVER
	'* @param	updateFacing	If true it sets the FlxSprite.facing value to the direction pressed (default false)
	'* @param	enableArrowKeys	If true it will enable all arrow keys (default) - see setCursorControl for more fine-grained control
	'* @param	onscreenBase 	The Image you want to use as base of Analog On Screen Control
	'* @param	onscreenKnob 	The Image you want to use as knob of Analog On Screen Control
	'* 
	'* @see		setMovementSpeed
	 '*/
	Method New(source:FlxSprite, movementType:Int, stoppingType:Int, updateFacing:Bool = False, enableArrowKeys:Bool = True, enableAnalogControl:Bool = False )
		_entity = source
		
		_movement = movementType
		_stopping = stoppingType
		
		_xFacing = updateFacing
		_yFacing = updateFacing
		
		_up = False
		_down = False
		_left = False
		_right = False
		
		_thrustEnabled = False
		_isRotating = False
		_enforceAngleLimits = False
		_rotation = ROTATION_INSTANT
		_rotationStopping = ROTATION_STOPPING_INSTANT
		
		If (enableArrowKeys) Then
			SetCursorControl()
		Endif
		
		If (enableAnalogControl) Then
			FlxAssetsManager.AddImage("onscreen_control_base","onscreen_control_base.png")
			FlxAssetsManager.AddImage("onscreen_control_knob","onscreen_control_knob.png")
			'//	Enable the plugin - you only need do this once (unless you destroy the plugin)
			If (FlxG.GetPlugin(ClassInfo(FlxMouseControl.ClassObject)) = Null) Then
				FlxG.AddPlugin(New FlxMouseControl())
			Endif
			
			_analogControl = True			
		Endif

		enabled = True
	End Method
	
	'/**
	'* Set the speed at which the sprite will move when a direction key is pressed.<br>
	'* All values are given in pixels per second. So an xSpeed of 100 would move the sprite 100 pixels in 1 second (1000ms)<br>
	'* Due to the nature of the internal Flash timer this amount is not 100% accurate and will vary above/below the desired distance by a few pixels.<br>
	'* 
	'* If you need different speed values for left/right or up/down then use setAdvancedMovementSpeed
	'* 
	'* @param	xSpeed			The speed in pixels per second in which the sprite will move/accelerate horizontally
	'* @param	ySpeed			The speed in pixels per second in which the sprite will move/accelerate vertically
	'* @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
	'* @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
	'* @param	xDeceleration	A deceleration speed in pixels per second to apply to the sprites horizontal movement (default 0)
	'* @param	yDeceleration	A deceleration speed in pixels per second to apply to the sprites vertical movement (default 0)
	 '*/
	Method SetMovementSpeed:Void(xSpeed:Int, ySpeed:Int, xSpeedMax:Int, ySpeedMax:Int, xDeceleration:Int = 0, yDeceleration:Int = 0)
		_leftMoveSpeed = -xSpeed
		_rightMoveSpeed = xSpeed
		_upMoveSpeed = -ySpeed
		_downMoveSpeed = ySpeed
		
		SetMaximumSpeed(xSpeedMax, ySpeedMax)
		SetDeceleration(xDeceleration, yDeceleration)
	End Method
	
	'/**
	'* If you know you need the same value for the acceleration, maximum speeds and (optionally) deceleration then this is a quick way to set them.
	'* 
	'* @param	speed			The speed in pixels per second in which the sprite will move/accelerate/decelerate
	'* @param	acceleration	If true it will set the speed value as the deceleration value (default) false will leave deceleration disabled
	 '*/
	Method SetStandardSpeed:Void(speed:Int, acceleration:Bool = True)
		If (acceleration) Then
			SetMovementSpeed(speed, speed, speed, speed, speed, speed)
		Else
			SetMovementSpeed(speed, speed, speed, speed)
		Endif
	End Method
	
	'/**
	'* Set the speed at which the sprite will move when a direction key is pressed.<br>
	'* All values are given in pixels per second. So an xSpeed of 100 would move the sprite 100 pixels in 1 second (1000ms)<br>
	'* Due to the nature of the internal Flash timer this amount is not 100% accurate and will vary above/below the desired distance by a few pixels.<br>
	'* 
	'* If you don't need different speed values for every direction on its own then use setMovementSpeed
	'* 
	'* @param	leftSpeed		The speed in pixels per second in which the sprite will move/accelerate to the left
	'* @param	rightSpeed		The speed in pixels per second in which the sprite will move/accelerate to the right
	'* @param	upSpeed			The speed in pixels per second in which the sprite will move/accelerate up
	'* @param	downSpeed		The speed in pixels per second in which the sprite will move/accelerate down
	'* @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
	'* @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
	'* @param	xDeceleration	Deceleration speed in pixels per second to apply to the sprites horizontal movement (default 0)
	'* @param	yDeceleration	Deceleration speed in pixels per second to apply to the sprites vertical movement (default 0)
	 '*/
	Method SetAdvancedMovementSpeed:Void(leftSpeed:Int, rightSpeed:Int, upSpeed:Int, downSpeed:Int, xSpeedMax:Int, ySpeedMax:Int, xDeceleration:Int = 0, yDeceleration:Int = 0)
		_leftMoveSpeed = -leftSpeed
		_rightMoveSpeed = rightSpeed
		_upMoveSpeed = -upSpeed
		_downMoveSpeed = downSpeed
		
		SetMaximumSpeed(xSpeedMax, ySpeedMax)
		SetDeceleration(xDeceleration, yDeceleration)
	End Method
	
	'/**
	'* Set the speed at which the sprite will rotate when a direction key is pressed.<br>
	'* Use this in combination with setMovementSpeed to create a Thrust like movement system.<br>
	'* All values are given in pixels per second. So an xSpeed of 100 would rotate the sprite 100 pixels in 1 second (1000ms)<br>
	'* Due to the nature of the internal Flash timer this amount is not 100% accurate and will vary above/below the desired distance by a few pixels.<br>
	 '*/
	Method SetRotationSpeed:Void(antiClockwiseSpeed:Float, clockwiseSpeed:Float, speedMax:Float, deceleration:Float)
		_antiClockwiseRotationSpeed = -antiClockwiseSpeed
		_clockwiseRotationSpeed = clockwiseSpeed
		
		SetRotationKeys()
		SetMaximumRotationSpeed(speedMax)
		SetRotationDeceleration(deceleration)
	End Method
	
	'/**
	'* 
	'* 
	'* @param	rotationType
	'* @param	stoppingType
	 '*/
	Method SetRotationType:Void(rotationType:Int, stoppingType:Int)
		_rotation = rotationType
		_rotationStopping = stoppingType
	End Method
	
	'/**
	'* Sets the maximum speed (in pixels per second) that the FlxSprite can rotate.<br>
	'* When the FlxSprite is accelerating (movement type MOVEMENT_ACCELERATES) its speed won't increase above this value.<br>
	'* However Flixel allows the velocity of an FlxSprite to be set to anything. So if you'd like to check the value and restrain it, then enable "limitVelocity".
	'* 
	'* @param	speed			The maximum speed in pixels per second in which the sprite can rotate
	'* @param	limitVelocity	If true the angular velocity of the FlxSprite will be checked and kept within the limit. If false it can be set to anything.
	 '*/
	Method SetMaximumRotationSpeed:Void(speed:Float, limitVelocity:Bool = True)
		_entity.maxAngular = speed		
		_capAngularVelocity = limitVelocity
	End Method
	
	'/**
	'* Deceleration is a speed (in pixels per second) that is applied to the sprite if stopping type is "DECELERATES" and if no rotation is taking place.<br>
	'* The velocity of the sprite will be reduced until it reaches zero.
	'* 
	'* @param	speed		The speed in pixels per second at which the sprite will have its angular rotation speed decreased
	 '*/
	Method SetRotationDeceleration:Void(speed:Float)
		_entity.angularDrag = speed
	End Method
	
	'/**
	'* Set minimum and maximum angle limits that the Sprite won't be able to rotate beyond.<br>
	'* Values must be between -180 and +180. 0 is pointing right, 90 down, 180 left, -90 up.
	'* 
	'* @param	minimumAngle	Minimum angle below which the sprite cannot rotate (must be -180 or above)
	'* @param	maximumAngle	Maximum angle above which the sprite cannot rotate (must be 180 or below)
	 '*/
	Method SetRotationLimits:Void(minimumAngle:Int, maximumAngle:Int)
		If (minimumAngle > maximumAngle Or minimumAngle < -180 Or maximumAngle > 180) Then
			FlxG.Log("FlxControlHandler setRotationLimits: Invalid Minimum / Maximum angle")
		Else
			_enforceAngleLimits = True
			_minAngle = minimumAngle
			_maxAngle = maximumAngle
		Endif
	End Method
	
	'/**
	'* Disables rotation limits set in place by setRotationLimits()
	 '*/
	Method DisableRotationLimits:Void()
		_enforceAngleLimits = False
	End Method
	
	'/**
	'* Set which keys will rotate the sprite. The speed of rotation is set in setRotationSpeed.
	'* 
	'* @param	leftRight				Use the LEFT and RIGHT arrow keys for anti-clockwise and clockwise rotation respectively.
	'* @param	upDown					Use the UP and DOWN arrow keys for anti-clockwise and clockwise rotation respectively.
	'* @param	customAntiClockwise		The String value of your own key to use for anti-clockwise rotation (as taken from org.flixel.system.input.Keyboard)
	'* @param	customClockwise			The String value of your own key to use for clockwise rotation (as taken from org.flixel.system.input.Keyboard)
	 '*/
	Method SetRotationKeys:Void(leftRight:Bool = True, upDown:Bool = False, customAntiClockwise:Int = 0, customClockwise:Int = 0)
		_isRotating = True
		_rotateAntiClockwise = True
		_rotateClockwise = True
		_antiClockwiseKey = KEY_LEFT
		_clockwiseKey = KEY_RIGHT

		If (upDown = True) Then
			_antiClockwiseKey = KEY_UP
			_clockwiseKey = KEY_DOWN
		Endif
		
		If (customAntiClockwise <> 0 And customClockwise <> 0) Then
			_antiClockwiseKey = customAntiClockwise
			_clockwiseKey = customClockwise
		Endif
	End Method
	
	'/**
	'* If you want to enable a Thrust like motion for your sprite use this to set the speed and keys.<br>
	'* This is usually used in conjunction with Rotation and it will over-ride anything already defined in setMovementSpeed.
	'* 
	'* @param	thrustKey		Specify the key String (as taken from org.flixel.system.input.Keyboard) to use for the Thrust action
	'* @param	thrustSpeed		The speed in pixels per second which the sprite will move. Acceleration or Instant movement is determined by the Movement Type.
	'* @param	reverseKey		If you want to be able to reverse, set the key string as taken from org.flixel.system.input.Keyboard (defaults to null).
	'* @param	reverseSpeed	The speed in pixels per second which the sprite will reverse. Acceleration or Instant movement is determined by the Movement Type.
	 '*/
	Method SetThrust:Void(thrustKey:Int, thrustSpeed:Float, reverseKey:Int = 0, reverseSpeed:Float = 0)
		_thrustEnabled = False
		_reverseEnabled = False
		
		If (thrustKey <> 0) Then
			_thrustKey = thrustKey
			_thrustSpeed = thrustSpeed
			_thrustEnabled = True
		Endif
		
		If (reverseKey <> 0)
			_reverseKey = reverseKey
			_reverseSpeed = reverseSpeed
			_reverseEnabled = True
		Endif
	End Method
	
	'/**
	'* Sets the maximum speed (in pixels per second) that the FlxSprite can move. You can set the horizontal and vertical speeds independantly.<br>
	'* When the FlxSprite is accelerating (movement type MOVEMENT_ACCELERATES) its speed won't increase above this value.<br>
	'* However Flixel allows the velocity of an FlxSprite to be set to anything. So if you'd like to check the value and restrain it, then enable "limitVelocity".
	'* 
	'* @param	xSpeed			The maximum speed in pixels per second in which the sprite can move horizontally
	'* @param	ySpeed			The maximum speed in pixels per second in which the sprite can move vertically
	'* @param	limitVelocity	If true the velocity of the FlxSprite will be checked and kept within the limit. If false it can be set to anything.
	 '*/
	Method SetMaximumSpeed:Void(xSpeed:Int, ySpeed:Int, limitVelocity:Bool = True)
		_entity.maxVelocity.x = xSpeed
		_entity.maxVelocity.y = ySpeed
		
		_capVelocity = limitVelocity
	End Method
	
	'/**
	'* Deceleration is a speed (in pixels per second) that is applied to the sprite if stopping type is "DECELERATES" and if no acceleration is taking place.<br>
	'* The velocity of the sprite will be reduced until it reaches zero, and can be configured separately per axis.
	'* 
	'* @param	xSpeed		The speed in pixels per second at which the sprite will have its horizontal speed decreased
	'* @param	ySpeed		The speed in pixels per second at which the sprite will have its vertical speed decreased
	 '*/
	Method SetDeceleration:Void(xSpeed:Int, ySpeed:Int)
		_entity.drag.x = xSpeed
		_entity.drag.y = ySpeed
	End Method
	
	'/**
	'* Gravity can be applied to the sprite, pulling it in any direction.<br>
	'* Gravity is given in pixels per second and is applied as acceleration. The speed the sprite reaches under gravity will never exceed the Maximum Movement Speeds set.<br>
	'* If you don't want gravity for a specific direction pass a value of zero.
	'* 
	'* @param	xForce	A positive value applies gravity dragging the sprite to the right. A negative value drags the sprite to the left. Zero disables horizontal gravity.
	'* @param	yForce	A positive value applies gravity dragging the sprite down. A negative value drags the sprite up. Zero disables vertical gravity.
	 '*/
	Method SetGravity:Void(xForce:Int, yForce:Int)
		_gravityX = xForce
		_gravityY = yForce
		
		_entity.acceleration.x = _gravityX
		_entity.acceleration.y = _gravityY
	End Method
	
	'/**
	'* Switches the gravity applied to the sprite. If gravity was +400 Y (pulling them down) this will swap it to -400 Y (pulling them up)<br>
	'* To reset call flipGravity again
	 '*/
	Method FlipGravity:Void()
		If (_gravityX <> 0) Then
			_gravityX = -_gravityX
			_entity.acceleration.x = _gravityX
		Endif
		
		If (_gravityY <> 0) Then
			_gravityY = -_gravityY
			_entity.acceleration.y = _gravityY
		Endif
	End Method
	
	'/**
	'* TODO
	'* 
	'* @param	xFactor
	'* @param	yFactor
	 '*/
	Method SpeedUp:Void(xFactor:Float, yFactor:Float)
	End Method
	
	'/**
	'* TODO
	'* 
	'* @param	xFactor
	'* @param	yFactor
	 '*/
	Method SlowDown:Void(xFactor:Float, yFactor:Float)
	End Method
	
	'/**
	'* TODO
	'* 
	'* @param	xFactor
	'* @param	yFactor
	 '*/
	Method ResetSpeeds:Void(resetX:Bool = True, resetY:Bool = True)
		If (resetX) Then
			_xSpeedAdjust = 0
		Endif
		
		If (resetY) Then
			_ySpeedAdjust = 0
		Endif
	End Method
	
	'/**
	'* Creates a new Hot Key, which can be bound to any function you specify (such as "swap weapon", "quit", etc)
	'* 
	'* @param	key			The key to use as the hot key (String from org.flixel.system.input.Keyboard, i.e. "SPACE", "CONTROL", "Q", etc)
	'* @param	callback	The function to call when the key is pressed
	'* @param	keymode		The keymode that will trigger the callback, either KEYMODE_PRESSED, KEYMODE_JUST_DOWN or KEYMODE_RELEASED
	 '*/
	Method AddHotKey:Void(key:String, callback:FunctionInfo, keymode:Int)
		
	End Method
	
	'/**
	'* Removes a previously defined hot key
	'* 
	'* @param	key		The key to use as the hot key (String from org.flixel.system.input.Keyboard, i.e. "SPACE", "CONTROL", "Q", etc)
	'* @return	true if the key was found and removed, false if the key couldn't be found
	 '*/
	Method RemoveHotKey:Bool(key:String)
		Return True
	End Method
	
	'/**
	'* Set sound effects for the movement events jumping, firing, walking and thrust.
	'* 
	'* @param	jump	The FlxSound to play when the user jumps
	'* @param	fire	The FlxSound to play when the user fires
	'* @param	walk	The FlxSound to play when the user walks
	'* @param	thrust	The FlxSound to play when the user thrusts
	 '*/
	Method SetSounds:Void(jump:FlxSound = Null, fire:FlxSound = Null, walk:FlxSound = Null, thrust:FlxSound = Null)
		If (jump) Then
			_jumpSound = jump
		Endif
		
		If (fire) Then
			_fireSound = fire
		Endif
		
		If (walk) Then
			_walkSound = walk
		Endif
		
		If (thrust) Then
			_thrustSound = thrust
		Endif
	End Method
	
	'/**
	'* Enable a fire button
	'* 
	'* @param	key				The key to use as the fire button (String from org.flixel.system.input.Keyboard, i.e. "SPACE", "CONTROL")
	'* @param	keymode			The FlxControlHandler KEYMODE value (KEYMODE_PRESSED, KEYMODE_JUST_DOWN, KEYMODE_RELEASED)
	'* @param	repeatDelay		Time delay in ms between which the fire action can repeat (0 means instant, 250 would allow it to fire approx. 4 times per second)
	'* @param	callback		A user defined function to call when it fires
	'* @param	altKey			Specify an alternative fire key that works AS WELL AS the primary fire key (TODO)
	 '*/
	Method SetFireButton:Void(key:Int, keymode:Int, repeatDelay:Int,fireObj:Object, callback:MethodInfo, fireParams:Object[] = [], altKey:Int = 0)
		_fireKey = key
		_fireKeyMode = keymode
		_fireRate = repeatDelay
		_fireObject = fireObj
		_fireCallback = callback
		_fireParams = fireParams
		
		If (altKey <> 0) Then
			_altFireKey = altKey
		Endif
		
		_fire = True
	End Method
	
	'/**
	'* Enable a jump button
	'* 
	'* @param	key				The key to use as the jump button (String from org.flixel.system.input.Keyboard, i.e. "SPACE", "CONTROL")
	'* @param	keymode			The FlxControlHandler KEYMODE value (KEYMODE_PRESSED, KEYMODE_JUST_DOWN, KEYMODE_RELEASED)
	'* @param	height			The height in pixels/sec that the Sprite will attempt to jump (gravity and acceleration can influence this actual height obtained)
	'* @param	surface			A bitwise combination of all valid surfaces the Sprite can jump off (from FlxObject, such as FlxObject.FLOOR)
	'* @param	repeatDelay		Time delay in ms between which the jumping can repeat (250 would be 4 times per second)
	'* @param	jumpFromFall	A time in ms that allows the Sprite to still jump even if it's just fallen off a platform, if still within ths time limit
	'* @param	callback		A user defined function to call when the Sprite jumps
	'* @param	altKey			Specify an alternative jump key that works AS WELL AS the primary jump key (TODO)
	 '*/
	Method SetJumpButton:Void(key:Int, keymode:Int, height:Int, surface:Int, repeatDelay:Int = 250, jumpFromFall:Int = 0, jumpObj:Object = Null, callback:MethodInfo = Null, jumpParams:Object[] = [], altKey:Int = 0)
		_jumpKey = key
		_jumpKeyMode = keymode
		_jumpHeight = height
		_jumpSurface = surface
		_jumpRate = repeatDelay
		_jumpFromFallTime = jumpFromFall
		_jumpObject = jumpObj
		_jumpCallback = callback
		_jumpParams = jumpParams
		
		If (altKey <> 0) Then
			_altJumpKey = altKey
		Endif
		
		_jump = True
	End Method
	
	'/**
	'* Limits the sprite to only be allowed within this rectangle. If its x/y coordinates go outside it will be repositioned back inside.<br>
	'* Coordinates should be given in GAME WORLD pixel values (not screen value, although often they are the two same things)
	'* 
	'* @param	x		The x coordinate of the top left corner of the area (in game world pixels)
	'* @param	y		The y coordinate of the top left corner of the area (in game world pixels)
	'* @param	width	The width of the area (in pixels)
	'* @param	height	The height of the area (in pixels)
	 '*/
	Method SetBounds:Void(x:Int, y:Int, width:Int, height:Int)
		_bounds = New FlxRect(x, y, width, height)
	End Method
	
	'/**
	'* Clears any previously set sprite bounds
	 '*/
	Method RemoveBounds:Void()
		_bounds = Null
	End Method
	
Private 
	Method CheckKeyPressed:Bool(key:Int)
		If (analogOnScreenControl) Then
			Local a:FlxPoint = New FlxPoint(_onScreenKnob.x + _onScreenKnob.width/2, _onScreenKnob.y + _onScreenKnob.height/2)
			Local b:FlxPoint = New FlxPoint(_onScreenBase.x + _onScreenBase.width/2, _onScreenBase.y + _onScreenBase.height/2)
			Local dx:Int = Abs(a.x - b.x)
			Local dy:Int = Abs(a.y - b.y)
			
			If ( (dx > 1 Or dy > 1) And _onScreenKnob.isPressed) Then
				Local angel:Float = FlxVelocity.AngleBetweenPoints(b, a, True)
		
				If (_digitalControl) Then
					If (angel > -40 And angel < 40) Then 'Move right
						angel = 0
					Else If (angel > -130 And angel < -50 ) 'move Up
						angel = -90
					Else If (angel < -140 Or angel > 140) 'move left
						angel = 180
					Else If (angel > 50 And angel < 130) 'move down
						angel = 90
					Else 
						Return False	
					Endif
				Endif
		
				If (angel > -80 And angel < 80 And key = _rightKey) Then 'Move right
					Return True
				Else If (angel > -170 And angel < -10 And key = _upKey ) 'move Up
					Return True
				Else If (angel < -100 Or angel > 100 And key = _leftKey) 'move left
					Return True
				Else If (angel > 10 And angel < 170 And key = _downKey) 'move down
					Return True
				Endif
			Endif
		Else
			Return FlxG.Keys.Pressed(key)
		Endif
		Return false
	End Method
	
	Method MoveUp:Bool()
		Local move:Bool = False
		
		If (CheckKeyPressed(_upKey)) Then
			move = True
			isPressedUp = True
			
			If (_yFacing) Then
				_entity.Facing = FlxObject.UP
			Endif
			
			If (_movement = MOVEMENT_INSTANT) Then
				_entity.velocity.y = _upMoveSpeed
			Else If (_movement = MOVEMENT_ACCELERATES) Then
				_entity.acceleration.y = _upMoveSpeed
			Endif
			
			If (_bounds And _entity.y < _bounds.Top) Then
				_entity.y = _bounds.Top
			Endif
		Endif
		
		Return move
	End Method
	
	Method MoveDown:Bool()
		Local move:Bool = False
		
		If (CheckKeyPressed(_downKey)) Then
			move = True
			isPressedDown = True
			
			If (_yFacing) Then
				_entity.Facing = FlxObject.DOWN
			Endif
			
			If (_movement = MOVEMENT_INSTANT) Then
				_entity.velocity.y = _downMoveSpeed
			Else If (_movement = MOVEMENT_ACCELERATES) Then
				_entity.acceleration.y = _downMoveSpeed
			Endif
			
			If (_bounds And _entity.y > _bounds.Bottom) Then
				_entity.y = _bounds.Bottom
			Endif
			
		Endif
		
		Return move
	End Method
	
	Method MoveLeft:Bool()
		Local move:Bool = False
		
		If (CheckKeyPressed(_leftKey)) Then
			move = True
			isPressedLeft = True
			
			If (_xFacing) Then
				_entity.Facing = FlxObject.LEFT
			Endif
			
			If (_movement = MOVEMENT_INSTANT) Then
				_entity.velocity.x = _leftMoveSpeed
			Else If (_movement = MOVEMENT_ACCELERATES) Then
				_entity.acceleration.x = _leftMoveSpeed
			Endif
			
			If (_bounds And _entity.x < _bounds.x) Then
				_entity.x = _bounds.x
			Endif
		Endif
		
		Return move
	End Method
	
	Method MoveRight:Bool()
		Local move:Bool = False
		
		If (CheckKeyPressed(_rightKey)) Then
			move = True
			isPressedRight = True
			
			If (_xFacing)Then
				_entity.Facing = FlxObject.RIGHT
			Endif
			
			If (_movement = MOVEMENT_INSTANT) Then
				_entity.velocity.x = _rightMoveSpeed
			Else If (_movement = MOVEMENT_ACCELERATES)
				_entity.acceleration.x = _rightMoveSpeed
			Endif
			
			If (_bounds And _entity.x > _bounds.Right)
				_entity.x = _bounds.Right
			Endif
		Endif
		
		Return move
	End Method
	
	Method MoveAntiClockwise:Bool()
		Local move:Bool = False
		
		If (FlxG.Keys.Pressed(_antiClockwiseKey)) Then
			move = True
			
			If (_rotation = ROTATION_INSTANT) Then
				_entity.angularVelocity = _antiClockwiseRotationSpeed
			Else If (_rotation = ROTATION_ACCELERATES) Then
				_entity.angularAcceleration = _antiClockwiseRotationSpeed
			Endif

			If (_enforceAngleLimits) Then
				_entity.angle = FlxMath.AngleLimit(_entity.angle, _minAngle, _maxAngle)
			Endif
		Endif
		
		Return move
	End Method
	
	Method MoveClockwise:Bool()
		Local move:Bool = False
		
		If (FlxG.Keys.Pressed(_clockwiseKey)) Then
			move = True
			
			If (_rotation = ROTATION_INSTANT) Then
				_entity.angularVelocity = _clockwiseRotationSpeed
			Else If (_rotation = ROTATION_ACCELERATES) Then
				_entity.angularAcceleration = _clockwiseRotationSpeed
			Endif
			
			If (_enforceAngleLimits) Then
				_entity.angle = FlxMath.AngleLimit(_entity.angle, _minAngle, _maxAngle)
			Endif
		Endif
		
		Return move
	End Method
	
	Method MoveThrust:Bool()
		Local move:Bool = False
		
		If (FlxG.Keys.Pressed(_thrustKey)) Then
			move = True
			
			Local motion:FlxPoint = FlxVelocity.VelocityFromAngle(_entity.angle, _thrustSpeed)
			
			If (_movement = MOVEMENT_INSTANT) Then
				_entity.velocity.x = motion.x
				_entity.velocity.y = motion.y
			Else If (_movement = MOVEMENT_ACCELERATES) Then
				_entity.acceleration.x = motion.x
				_entity.acceleration.y = motion.y
			Endif
			
			If (_bounds And _entity.x < -_bounds.x) Then
				_entity.x = _bounds.x
			Endif
		Endif
		
		If (move And _thrustSound) Then
			_thrustSound.Play(False)
		Endif
		
		Return move
	End Method
	
	Method MoveReverse:Bool()
		Local move:Bool = False
		
		If (FlxG.Keys.Pressed(_reverseKey)) Then
			move = True
			
			Local motion:FlxPoint = FlxVelocity.VelocityFromAngle(_entity.angle, _reverseSpeed)
			
			If (_movement = MOVEMENT_INSTANT) Then
				_entity.velocity.x = -motion.x
				_entity.velocity.y = -motion.y
			Else If (_movement = MOVEMENT_ACCELERATES) Then
				_entity.acceleration.x = -motion.x
				_entity.acceleration.y = -motion.y
			Endif
			
			If (_bounds And _entity.x < _bounds.x) Then
				_entity.x = _bounds.x
			Endif
		Endif
		
		Return move
	End Method
	
	Method RunFire:Bool()
		Local fired:Bool = False
		
		'//	0 = Pressed
		'//	1 = Just Down
		'//	2 = Just Released
		If ((_fireKeyMode = 0 And FlxG.Keys.Pressed(_fireKey)) Or (_fireKeyMode = 1 And FlxG.Keys.JustPressed(_fireKey)) Or (_fireKeyMode = 2 And FlxG.Keys.JustReleased(_fireKey))) Then
			If (_fireRate > 0) Then
				If (Millisecs() > _nextFireTime) Then
					_lastFiredTime = Millisecs()
					
					_fireCallback.Invoke(_fireObject,_fireParams)
					
					fired = True
					
					_nextFireTime = _lastFiredTime + _fireRate
				Endif
			Else
				_lastFiredTime = Millisecs()
				
				_fireCallback.Invoke(_fireObject,_fireParams)
				
				fired = True
			Endif
			
		Endif
		
		If (fired And _fireSound) Then
			_fireSound.Play(True)
		Endif
		
		Return fired
	End Method
	
	Method RunJump:Bool()
		Local jumped:Bool = False
		
		'//	This should be called regardless if they've pressed jump or not
		If (_entity.IsTouching(_jumpSurface)) Then
			_extraSurfaceTime = Millisecs() + _jumpFromFallTime
		Endif
		
		If ((_jumpKeyMode = KEYMODE_PRESSED And FlxG.Keys.Pressed(_jumpKey)) Or (_jumpKeyMode = KEYMODE_JUST_DOWN And FlxG.Keys.JustPressed(_jumpKey)) Or (_jumpKeyMode = KEYMODE_RELEASED And FlxG.Keys.JustReleased(_jumpKey))) Then
			'//	Sprite not touching a valid jump surface
			If (_entity.IsTouching(_jumpSurface) = False) Then
				'//	They've run out of time to jump
				If (Millisecs() > _extraSurfaceTime) Then
					Return jumped
				Else
					'//	Still within the fall-jump window of time, but have jumped recently
					If (_lastJumpTime > (_extraSurfaceTime - _jumpFromFallTime)) Then
						Return jumped
					Endif
				Endif
				
				'//	If there is a jump Repeat rate set And we're still less than it then return
				If (Millisecs() < _nextJumpTime) Then
					Return jumped
				Endif
			Else
				'//	If there is a jump repeat rate set and we're still less than it then return
				If (Millisecs() < _nextJumpTime) Then
					Return jumped
				Endif
			Endif

			If (_gravityY > 0) Then
				'//	Gravity is pulling them down to earth, so they are jumping up (negative)
				_entity.velocity.y = -_jumpHeight
			Else
				'//	Gravity is pulling them up, so they are jumping down (positive)
				_entity.velocity.y = _jumpHeight
			Endif
			
			If (_jumpCallback) Then
				_jumpCallback.Invoke(_jumpObject,_jumpParams)
			Endif
			
			_lastJumpTime = Millisecs()
			_nextJumpTime = _lastJumpTime + _jumpRate
				
			jumped = True
		Endif
		
		If (jumped And _jumpSound) Then
			_jumpSound.Play(True)
		Endif
		
		Return jumped
	End Method

Public	
	'/**
	'* Called by the FlxControl plugin
	 '*/
	Method Update:Void()
		If (_entity = Null) Then
			Return
		Endif
		
		'//	Reset the helper Bools
		isPressedUp = False
		isPressedDown = False
		isPressedLeft = False
		isPressedRight = False
		
		If (_stopping = STOPPING_INSTANT) Then
			If (_movement = MOVEMENT_INSTANT) Then
				_entity.velocity.x = 0
				_entity.velocity.y = 0
			Else If (_movement = MOVEMENT_ACCELERATES) Then
				_entity.acceleration.x = 0
				_entity.acceleration.y = 0
			Endif	
		Else If (_stopping = STOPPING_DECELERATES) Then
			If (_movement = MOVEMENT_INSTANT) Then
				_entity.velocity.x = 0
				_entity.velocity.y = 0
			Else If (_movement = MOVEMENT_ACCELERATES)
				'//	By Default these are zero anyway, so it's safe to set like this
				_entity.acceleration.x = _gravityX
				_entity.acceleration.y = _gravityY
			Endif	
		Endif
		
		'//	Rotation
		If (_isRotating) Then
			If (_rotationStopping = ROTATION_STOPPING_INSTANT) Then
				If (_rotation = ROTATION_INSTANT) Then
					_entity.angularVelocity = 0
				Else If (_rotation = ROTATION_ACCELERATES) Then
					_entity.angularAcceleration = 0
				Endif
			Else If (_rotationStopping = ROTATION_STOPPING_DECELERATES) Then
				If (_rotation = ROTATION_INSTANT) Then
					_entity.angularVelocity = 0
				Endif
			Endif
			
			Local hasRotatedAntiClockwise:Bool = False
			Local hasRotatedClockwise:Bool = False
			
			hasRotatedAntiClockwise = MoveAntiClockwise()
			
			If (hasRotatedAntiClockwise = False) Then
				hasRotatedClockwise = MoveClockwise()
			Endif
			
			If (_rotationStopping = ROTATION_STOPPING_DECELERATES) Then
				If (_rotation = ROTATION_ACCELERATES And hasRotatedAntiClockwise = False And hasRotatedClockwise = False)
					_entity.angularAcceleration = 0
				Endif
			Endif
			
			'//	If they have got instant stopping with acceleration and are NOT pressing a key, then stop the rotation. Otherwise we let it carry on
			If (_rotationStopping = ROTATION_STOPPING_INSTANT And _rotation = ROTATION_ACCELERATES And hasRotatedAntiClockwise = False And hasRotatedClockwise = False)
				_entity.angularVelocity = 0
				_entity.angularAcceleration = 0
			Endif
		Endif
		
		'//	Thrust
		If (_thrustEnabled Or _reverseEnabled) Then
			Local moved:Bool = False
			
			If (_thrustEnabled) Then
				moved = MoveThrust()
			Endif
			
			If (moved = False And _reverseEnabled) Then
				moved = MoveReverse()
			Endif
		Else
			Local movedX:Bool = False
			Local movedY:Bool = False		
			
			If (_up) Then
				movedY = MoveUp()
			Endif
			
			If (_down And movedY = False) Then
				movedY = MoveDown()
			Endif
			
			If (_left) Then
				movedX = MoveLeft()
			Endif
			
			If (_right And movedX = False) Then
				movedX = MoveRight()
			Endif
		Endif
		
		If (_fire) Then
			RunFire()
		Endif
		
		If (_jump) Then
			RunJump()
		Endif
		
		If (_capVelocity) Then
			If (_entity.velocity.x > _entity.maxVelocity.x) Then
				_entity.velocity.x = _entity.maxVelocity.x
			Endif
			
			If (_entity.velocity.y > _entity.maxVelocity.y) Then
				_entity.velocity.y = _entity.maxVelocity.y
			Endif
		Endif
		
		If (_walkSound) Then
			If ((_movement = MOVEMENT_INSTANT And _entity.velocity.x <> 0) Or (_movement = MOVEMENT_ACCELERATES And _entity.acceleration.x <> 0)) Then
				_walkSound.Play(False)
			Else
				_walkSound.Stop()
			Endif
		Endif

	End Method
	
	'/**
	'* Sets Custom Key controls. Useful if none of the pre-defined sets work. All String values should be taken from org.flixel.system.input.Keyboard
	'* Pass a blank (empty) String to disable that key from being checked.
	'* 
	'* @param	customUpKey		The String to use for the Up key.
	'* @param	customDownKey	The String to use for the Down key.
	'* @param	customLeftKey	The String to use for the Left key.
	'* @param	customRightKey	The String to use for the Right key.
	 '*/
	Method SetCustomKeys:Void(customUpKey:int, customDownKey:int, customLeftKey:int, customRightKey:int)
		If (customUpKey <> 0) Then
			_up = True
			_upKey = customUpKey
		Endif
		
		If (customDownKey <> 0) Then
			_down = True
			_downKey = customDownKey
		Endif
		
		If (customLeftKey <> 0) Then
			_left = True
			_leftKey = customLeftKey
		Endif
		
		If (customRightKey <> 0) Then
			_right = True
			_rightKey = customRightKey
		Endif
	End Method
	
	'/**
	'* Enables Cursor/Arrow Key controls. Can be set on a per-key basis. Useful if you only want to allow a few keys.<br>
	'* For example in a Space Invaders game you'd only enable LEFT and RIGHT.
	'* 
	'* @param	allowUp		Enable the UP key
	'* @param	allowDown	Enable the DOWN key
	'* @param	allowLeft	Enable the LEFT key
	'* @param	allowRight	Enable the RIGHT key
	 '*/
	Method SetCursorControl:Void(allowUp:Bool = True, allowDown:Bool = True, allowLeft:Bool = True, allowRight:Bool = True)
		_up = allowUp
		_down = allowDown
		_left = allowLeft
		_right = allowRight
		
		_upKey = KEY_UP
		_downKey = KEY_DOWN
		_leftKey = KEY_LEFT
		_rightKey = KEY_RIGHT
	End Method
	
	'/**
	'* Enables WASD controls. Can be set on a per-key basis. Useful if you only want to allow a few keys.<br>
	'* For example in a Space Invaders game you'd only enable LEFT and RIGHT.
	'* 
	'* @param	allowUp		Enable the up (W) key
	'* @param	allowDown	Enable the down (S) key
	'* @param	allowLeft	Enable the left (A) key
	'* @param	allowRight	Enable the right (D) key
	 '*/
	Method SetWASDControl:Void(allowUp:Bool = True, allowDown:Bool = True, allowLeft:Bool = True, allowRight:Bool = True)
		_up = allowUp
		_down = allowDown
		_left = allowLeft
		_right = allowRight
		
		_upKey = KEY_W
		_downKey = KEY_S
		_leftKey = KEY_A
		_rightKey = KEY_D
	End Method
	
	'/**
	'* Enables ESDF (home row) controls. Can be set on a per-key basis. Useful if you only want to allow a few keys.<br>
	'* For example in a Space Invaders game you'd only enable LEFT and RIGHT.
	'* 
	'* @param	allowUp		Enable the up (E) key
	'* @param	allowDown	Enable the down (D) key
	'* @param	allowLeft	Enable the left (S) key
	'* @param	allowRight	Enable the right (F) key
	 '*/
	Method SetESDFControl:Void(allowUp:Bool = True, allowDown:Bool = True, allowLeft:Bool = True, allowRight:Bool = True)
		_up = allowUp
		_down = allowDown
		_left = allowLeft
		_right = allowRight
		
		_upKey = KEY_E
		_downKey = KEY_D
		_leftKey = KEY_S
		_rightKey = KEY_F
	End Method
	
	'/**
	'* Enables IJKL (right-sided or secondary player) controls. Can be set on a per-key basis. Useful if you only want to allow a few keys.<br>
	'* For example in a Space Invaders game you'd only enable LEFT and RIGHT.
	'* 
	'* @param	allowUp		Enable the up (I) key
	'* @param	allowDown	Enable the down (K) key
	'* @param	allowLeft	Enable the left (J) key
	'* @param	allowRight	Enable the right (L) key
	 '*/
	Method SetIJKLControl:Void(allowUp:Bool = True, allowDown:Bool = True, allowLeft:Bool = True, allowRight:Bool = True)
		_up = allowUp
		_down = allowDown
		_left = allowLeft
		_right = allowRight
		
		_upKey = KEY_I
		_downKey = KEY_K
		_leftKey = KEY_J
		_rightKey = KEY_L
	End Method
	
	'/**
	'* Enables HJKL (Rogue / Net-Hack) controls. Can be set on a per-key basis. Useful if you only want to allow a few keys.<br>
	'* For example in a Space Invaders game you'd only enable LEFT and RIGHT.
	'* 
	'* @param	allowUp		Enable the up (K) key
	'* @param	allowDown	Enable the down (J) key
	'* @param	allowLeft	Enable the left (H) key
	'* @param	allowRight	Enable the right (L) key
	 '*/
	Method SetHJKLControl:Void(allowUp:Bool = True, allowDown:Bool = True, allowLeft:Bool = True, allowRight:Bool = True)
		_up = allowUp
		_down = allowDown
		_left = allowLeft
		_right = allowRight
		
		_upKey = KEY_K
		_downKey = KEY_J
		_leftKey = KEY_H
		_rightKey = KEY_L
	End Method
	
	'/**
	'* Enables ZQSD (Azerty keyboard) controls. Can be set on a per-key basis. Useful if you only want to allow a few keys.<br>
	'* For example in a Space Invaders game you'd only enable LEFT and RIGHT.
	'* 
	'* @param	allowUp		Enable the up (Z) key
	'* @param	allowDown	Enable the down (Q) key
	'* @param	allowLeft	Enable the left (S) key
	'* @param	allowRight	Enable the right (D) key
	 '*/
	Method SetZQSDControl:Void(allowUp:Bool = True, allowDown:Bool = True, allowLeft:Bool = True, allowRight:Bool = True)
		_up = allowUp
		_down = allowDown
		_left = allowLeft
		_right = allowRight
		
		_upKey = KEY_Z
		_downKey = KEY_S
		_leftKey = KEY_Q
		_rightKey = KEY_D
	End Method
	
	'/**
	'* Enables Dvoark Simplified Controls. Can be set on a per-key basis. Useful if you only want to allow a few keys.<br>
	'* For example in a Space Invaders game you'd only enable LEFT and RIGHT.
	'* 
	'* @param	allowUp		Enable the up (COMMA) key
	'* @param	allowDown	Enable the down (A) key
	'* @param	allowLeft	Enable the left (O) key
	'* @param	allowRight	Enable the right (E) key
	 '*/
	Method SetDvorakSimplifiedControl:Void(allowUp:Bool = True, allowDown:Bool = True, allowLeft:Bool = True, allowRight:Bool = True)
		_up = allowUp
		_down = allowDown
		_left = allowLeft
		_right = allowRight
		
		_upKey = KEY_COMMA
		_downKey = KEY_O
		_leftKey = KEY_A
		_rightKey = KEY_E
	End Method
	
	Method SetOnScreenControlBase:Void(X:Float = 0, Y:Float = 0, simpleGraphic:String = "")	
		If (simpleGraphic.Length() = 0)
			simpleGraphic = "onscreen_control_base"
		Endif		
		_onScreenBase = New FlxExtendedSprite(X,Y,simpleGraphic)
	
		_onScreenBase.scale.x = _analogControlSize/_onScreenBase.width
		_onScreenBase.scale.y = _analogControlSize/_onScreenBase.height
		_onScreenBase.width = _analogControlSize
		_onScreenBase.height = _analogControlSize			
		_onScreenBase.CenterOffsets()
		_onScreenBase.x = X
		If (Y = 0) Then
			_onScreenBase.y = FlxG.Height - _analogControlSize
		Else
			_onScreenBase.y = Y
		Endif	
		SetOnScreenControlKnob()
	End Method
	
	Method SetOnScreenControlKnob:Void(simpleGraphic:String = "")
		
		If (simpleGraphic.Length() = 0)
			simpleGraphic = "onscreen_control_knob"
		Endif
		
		_onScreenKnob = New FlxExtendedSprite(0,0,simpleGraphic)

		_onScreenKnob.scale.x = _analogControlSize/2/_onScreenKnob.width
		_onScreenKnob.scale.y = _analogControlSize/2/_onScreenKnob.height
		_onScreenKnob.width = _analogControlSize/2
		_onScreenKnob.height = _analogControlSize/2
		_onScreenKnob.frameWidth = _onScreenKnob.width
		_onScreenKnob.frameHeight = _onScreenKnob.height
		_onScreenKnob.SetOriginToCorner()
		_onScreenKnob.x = _onScreenBase.x + _onScreenBase.width/2 - _onScreenKnob.width/2
		_onScreenKnob.y = _onScreenBase.y + _onScreenBase.height/2 - _onScreenKnob.height/2
				
		_onScreenKnob.EnableMouseDrag(True, True, 255,, _onScreenBase)
		_onScreenKnob.EnablePointSpring(New FlxPoint(_onScreenKnob.x,_onScreenKnob.y)) 
	End Method
	
	'/**
	'* Enables Analog Onscreen Controls. Can be set on a per-key basis. Useful if you only want to allow a few keys.<br>
	'* Only for IOS and Android
	'* 
	'* @param	allowUp		Enable the up (COMMA) key
	'* @param	allowDown	Enable the down (A) key
	'* @param	allowLeft	Enable the left (O) key
	'* @param	allowRight	Enable the right (E) key
	 '*/
	Method SetAnalogOnScreenControl:Void(size:Int = 50,isDigital:Bool = False, allowUp:Bool = True, allowDown:Bool = True, allowLeft:Bool = True, allowRight:Bool = True)
		#If TARGET <> "ios" And TARGET <> "android" And TARGET <> "xna" Then
			Return
		#Endif
			
		If (Not FlxG.Mobile) Then 
			Return
		Endif	
		
		_up = allowUp
		_down = allowDown
		_left = allowLeft
		_right = allowRight
		
		_digitalControl = isDigital
		If (Not allowUp And Not allowDown) Then
			_onScreenKnob.SetDragLock(true, false)
		Endif
		
		If (Not allowLeft And Not allowRight) Then
			_onScreenKnob.SetDragLock(false, true)
		Endif
		
		_analogControlSize = size
		
		If (_onScreenBase <> Null Or _onScreenKnob <> Null) Then
			analogOnScreenControl = New FlxGroup(2)
			analogOnScreenControl.Add(_onScreenBase)
			analogOnScreenControl.Add(_onScreenKnob)
		Endif
	End Method
	
	'/**
	'* Enables Numpad (left-handed) Controls. Can be set on a per-key basis. Useful if you only want to allow a few keys.<br>
	'* For example in a Space Invaders game you'd only enable LEFT and RIGHT.
	'* 
	'* @param	allowUp		Enable the up (NUMPADEIGHT) key
	'* @param	allowDown	Enable the down (NUMPADTWO) key
	'* @param	allowLeft	Enable the left (NUMPADFOUR) key
	'* @param	allowRight	Enable the right (NUMPADSIX) key
	 '*/
	 #rem
	Method setNumpadControl(allowUp:Bool = True, allowDown:Bool = True, allowLeft:Bool = True, allowRight:Bool = True):Void
		up = allowUp
		down = allowDown
		left = allowLeft
		right = allowRight
		
		upKey = "NUMPADEIGHT"
		downKey = "NUMPADTWO"
		leftKey = "NUMPADFOUR"
		rightKey = "NUMPADSIX"
	End Method
	#End
End Class
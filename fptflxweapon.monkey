'/**
' * FlxColor
' * -- Part of the Flixel Power Tools set
' * 
' * v1.5 Added RGBtoWebString
' * v1.4 getHSVColorWheel now supports an alpha value per color
' * v1.3 Added getAlphaFloat
' * v1.2 Updated for the Flixel 2.5 Plugin system
' * 
' * @version 1.5 - August 4th 2011
' * @link http://www.photonstorm.com
' * @author Richard Davey / Photon Storm
' * @see Depends upon FlxMath
' Copyright: Monkey port - 2012 Aleksey 'KaaPex' Kazantsev
'*/
Strict
Import reflection
Import flixel
Import flixel.plugin.photonstorm.basetypes.fptbullet
Import flixel.plugin.photonstorm.fptflxvelocity

'/**
 '* TODO
 '* ----
 '* 
 '* Angled bullets
 '* Baked Rotation support for angled bullets
 '* Bullet death styles (particle effects)
 '* Bullet trails - blur FX style and Missile Command "draw lines" style? (could be another FX plugin)
 '* Homing Missiles
 '* Bullet uses random sprite from sprite sheet (for rainbow style bullets), or cycles through them in sequence?
 '* Some Weapon base classes like shotgun, lazer, etc?
 '*/

Class FptFlxWeapon 

Public
	'/**
	 '* Internal name For this weapon (i.e. "pulse rifle")
	 '*/
 	Field name:String
	
	'/**
	 '* The FlxGroup into which all the bullets for this weapon are drawn. This should be added to your display and collision checked against it.
	 '*/
	Field group:FlxGroup
	
	'//	Bullet values
	Field bounds:FlxRect
	
Private
	Field _bulletSpeed:Int
	Field _rotateToAngle:Bool
	
	'//	When firing from a fixed position (i.e. Missile Command)
	Field _fireFromPosition:Bool
	Field _fireX:Int
	Field _fireY:Int
	
	Field _lastFired:Int = 0
	Field _nextFire:Int = 0
	Field _fireRate:Int = 0
	
	'//	When firing from a parent sprites position (i.e. Space Invaders)
	Field _fireFromParent:Bool
	Field _parent:FlxSprite
	Field _parentXVariable:String
	Field _parentYVariable:String
	Field _positionOffset:FlxPoint
	Field _directionFromParent:Bool
	Field _angleFromParent:Bool
	
	Field _velocity:FlxPoint
	
	Field _multiShot:Int = 0
	
	Field _bulletLifeSpan:Int = 0
	Field _bulletElasticity:Float = 0
	
	Field _rndFactorAngle:Int = 0
	Field _rndFactorLifeSpan:Int = 0
	Field _rndFactorSpeed:Int = 0
	Field _rndFactorPosition:FlxPoint = New FlxPoint()
	
Public	
	'/**
	 '* A reference to the Bullet that was fired
	 '*/
	Field currentBullet:FptBullet
	
	'//	Callbacks
	Field onPreFireCallback:FunctionInfo
	Field onFireCallback:FunctionInfo
	Field onPostFireCallback:FunctionInfo
	
	'//	Sounds
	Field onPreFireSound:FlxSound
	Field onFireSound:FlxSound
	Field onPostFireSound:FlxSound
	
	'//	Quick firing direction angle constants
	Const BULLET_UP:Int = -90
	Const BULLET_DOWN:Int = 90
	Const BULLET_LEFT:Int = 180
	Const BULLET_RIGHT:Int = 0
	Const BULLET_NORTH_EAST:Int = -45
	Const BULLET_NORTH_WEST:Int = -135
	Const BULLET_SOUTH_EAST:Int = 45
	Const BULLET_SOUTH_WEST:Int = 135
	
	'/**
	 '* Keeps a tally of how many bullets have been fired by this weapon
	 '*/
	Field bulletsFired:Int = 0
	
Private	
	'//	TODO :)
	Field _currentMagazine:Int
	'//private var currentBullet:int
	Field _magazineCount:Int
	Field _bulletsPerMagazine:Int
	Field _magazineSwapDelay:Int
	'Field magazineSwapCallback:Function
	Field _magazineSwapSound:FlxSound
	
	const FIRE:int = 0
	const FIRE_AT_MOUSE:int = 1
	const FIRE_AT_POSITION:int = 2
	const FIRE_AT_TARGET:int = 3
	const FIRE_FROM_ANGLE:int = 4
	const FIRE_FROM_PARENT_ANGLE:int = 5
	
	'/**
	 '* Creates the FlxWeapon class which will fire your bullets.<br>
	 '* You should call one of the makeBullet functions to visually create the bullets.<br>
	 '* Then either use setDirection with fire() or one of the fireAt functions to launch them.
	 '* 
	 '* @param	name		The name of your weapon (i.e. "lazer" or "shotgun"). For your internal reference really, but could be displayed in-game.
	 '* @param	parentRef	If this weapon belongs to a parent sprite, specify it here (bullets will fire from the sprites x/y vars as defined below).
	 '* @param	xVariable	The x axis variable of the parent to use when firing. Typically "x", but could be "screenX" or any public getter that exposes the x coordinate.
	 '* @param	yVariable	The y axis variable of the parent to use when firing. Typically "y", but could be "screenY" or any public getter that exposes the y coordinate.
	 '*/
	Method New(name:String, parentRef:FlxSprite = Null, xVariable:String = "x", yVariable:String = "y")
		self.name = name;
		
		bounds = new FlxRect(0, 0, FlxG.Width, FlxG.Height);
		
		_positionOffset = new FlxPoint;
		
		_velocity = New FlxPoint;
		
		If (parentRef) Then
			SetParent(parentRef, xVariable, yVariable)
		Endif
	End Method
	
	'/**
	 '* Makes a pixel bullet sprite (rather than an image). You can set the width/height and color of the bullet.
	 '* 
	 '* @param	quantity	How many bullets do you need to make? This value should be high enough to cover all bullets you need on-screen *at once* plus probably a few extra spare!
	 '* @param	width		The width (in pixels) of the bullets
	 '* @param	height		The height (in pixels) of the bullets
	 '* @param	color		The color of the bullets. Must be given in 0xAARRGGBB format
	 '* @param	offsetX		When the bullet is fired if you need to offset it on the x axis, for example to line it up with the "nose" of a space ship, set the amount here (positive or negative)
	 '* @param	offsetY		When the bullet is fired if you need to offset it on the y axis, for example to line it up with the "nose" of a space ship, set the amount here (positive or negative)
	 '*/
	Method MakePixelBullet:Void(quantity:Int, width:Int = 2, height:Int = 2, color:Int = $ffffffff, offsetX:Int = 0, offsetY:Int = 0)
		group = New FlxGroup(quantity)
		
		For Local b:Int = 0 Until quantity
			Local tempBullet:FptBullet = New FptBullet(Self, b)
			
			tempBullet.MakeGraphic(width, height, color)
			
			group.Add(tempBullet)
		Next
		
		_positionOffset.x = offsetX
		_positionOffset.y = offsetY
	End Method
	
	'/**
	 '* Makes a bullet sprite from the given image. It will use the width/height of the image.
	 '* 
	 '* @param	quantity		How many bullets do you need to make? This value should be high enough to cover all bullets you need on-screen *at once* plus probably a few extra spare!
	 '* @param	image			The image used to create the bullet from
	 '* @param	offsetX			When the bullet is fired if you need to offset it on the x axis, for example to line it up with the "nose" of a space ship, set the amount here (positive or negative)
	 '* @param	offsetY			When the bullet is fired if you need to offset it on the y axis, for example to line it up with the "nose" of a space ship, set the amount here (positive or negative)
	 '* @param	autoRotate		When true the bullet sprite will rotate to match the angle of the parent sprite. Call fireFromParentAngle or fromFromAngle to fire it using an angle as the velocity.
	 '* @param	frame			If the image has a single row of square animation frames on it, you can specify which of the frames you want to use here. Default is -1, or "use whole graphic"
	 '* @param	rotations		The number of rotation frames the final sprite should have.  For small sprites this can be quite a large number (360 even) without any problems.
	 '* @param	antiAliasing	Whether to use high quality rotations when creating the graphic. Default is false.
	 '* @param	autoBuffer		Whether to automatically increase the image size to accomodate rotated corners. Default is false. Will create frames that are 150% larger on each axis than the original frame or graphic.
	 '*/
	Method MakeImageBullet:Void(quantity:Int, image:String, offsetX:Int = 0, offsetY:Int = 0, autoRotate:Bool = False, rotations:Int = 16, frame:Int = -1)
		group = New FlxGroup(quantity)
		
		_rotateToAngle = autoRotate
		
		For Local b:Int = 0 Until quantity
			Local tempBullet:FptBullet = New FptBullet(Self, b)
			
			If (autoRotate) Then
				tempBullet.LoadRotatedGraphic(image, rotations, frame)
			Else
				tempBullet.LoadGraphic(image)
			Endif
			
			group.Add(tempBullet)
		Next
		
		_positionOffset.x = offsetX;
		_positionOffset.y = offsetY;
	End Method
	
	'/**
	 '* Makes an animated bullet from the image and frame data given.
	 '* 
	 '* @param	quantity		How many bullets do you need to make? This value should be high enough to cover all bullets you need on-screen *at once* plus probably a few extra spare!
	 '* @param	imageSequence	The image used to created the animated bullet from
	 '* @param	frameWidth		The width of each frame in the animation
	 '* @param	frameHeight		The height of each frame in the animation
	 '* @param	frames			An array of numbers indicating what frames to play in what order (e.g. 1, 2, 3)
	 '* @param	frameRate		The speed in frames per second that the animation should play at (e.g. 40 fps)
	 '* @param	looped			Whether or not the animation is looped or just plays once
	 '* @param	offsetX			When the bullet is fired if you need to offset it on the x axis, for example to line it up with the "nose" of a space ship, set the amount here (positive or negative)
	 '* @param	offsetY			When the bullet is fired if you need to offset it on the y axis, for example to line it up with the "nose" of a space ship, set the amount here (positive or negative)
	 '*/
	Method MakeAnimatedBullet:Void(quantity:Int, imageSequence:String, frameWidth:Int, frameHeight:Int, frames:Int[], frameRate:Int, looped:Bool, offsetX:Int = 0, offsetY:Int = 0)
		group = New FlxGroup(quantity)
		
		For Local b:Int = 0 Until quantity
			Local tempBullet:FptBullet = New FptBullet(Self, b)
			
			tempBullet.LoadGraphic(imageSequence, True, False, frameWidth, frameHeight)
			
			tempBullet.AddAnimation("fire", frames, frameRate, looped)
			
			group.Add(tempBullet)
		Next
		
		_positionOffset.x = offsetX;
		_positionOffset.y = offsetY;
	End Method
	
	'/**
	 '* Internal function that handles the actual firing of the bullets
	 '* 
	 '* @param	method
	 '* @param	x
	 '* @param	y
	 '* @param	target
	 '* @return	true if a bullet was fired or false if one wasn't available. The bullet last fired is stored in FlxWeapon.prevBullet
	 '*/
	Method RunFire:Bool(meth:Int, x:Int = 0, y:Int = 0, target:FlxSprite = Null, angle:Int = 0)
		If (_fireRate > 0 And (FlxG.Elapsed < _nextFire)) Then
			Return False
		Endif
		
		currentBullet = GetFreeBullet()
		
		If (currentBullet = Null) Then
			Return False
		Endif

		If (onPreFireCallback) Then
			onPreFireCallback.Invoke([])
		Endif
		
		If (onPreFireSound) Then
			onPreFireSound.Play()
		Endif
		
		'//	Clear any velocity that may have been previously set from the pool
		currentBullet.velocity.x = 0
		currentBullet.velocity.y = 0
		
		'lastFired = getTimer();
		_nextFire = FlxG.Elapsed + _fireRate
		
		Local launchX:Int = _positionOffset.x
		Local launchY:Int = _positionOffset.y
		
		If (_fireFromParent) Then
			launchX += _parent.x
			launchY += _parent.y
		Else If (_fireFromPosition) Then
			launchX += _fireX
			launchY += _fireY
		Endif
		
		If (_directionFromParent) Then
			_velocity = FptFlxVelocity.VelocityFromFacing(_parent, _bulletSpeed)
		Endif
		
		'//	Faster (less CPU) to use this small if-else ladder than a switch statement
		If (meth = FIRE) Then
			currentBullet.Fire(launchX, launchY, _velocity.x, _velocity.y)
		Else If (meth = FIRE_AT_MOUSE) Then
			currentBullet.FireAtMouse(launchX, launchY, _bulletSpeed)
		Else If (meth = FIRE_AT_POSITION) Then
			currentBullet.FireAtPosition(launchX, launchY, x, y, _bulletSpeed)
		Else If (meth = FIRE_AT_TARGET) Then
			currentBullet.FireAtTarget(launchX, launchY, target, _bulletSpeed)
		Else If (meth = FIRE_FROM_ANGLE) Then
			currentBullet.FireFromAngle(launchX, launchY, angle, _bulletSpeed)
		Else If (meth = FIRE_FROM_PARENT_ANGLE) Then
			currentBullet.FireFromAngle(launchX, launchY, _parent.angle, _bulletSpeed)
		Endif
		
		If (onPostFireCallback) Then
			onPostFireCallback.Invoke([])
		Endif 
		
		If (onPostFireSound) Then
			onPostFireSound.Play()
		Endif
		
		bulletsFired += 1
		
		Return True
	End Method
	
	'/**
	 '* Fires a bullet (if one is available). The bullet will be given the velocity defined in setBulletDirection and fired at the rate set in setFireRate.
	 '* 
	 '* @return	true if a bullet was fired or false if one wasn't available. A reference to the bullet fired is stored in FlxWeapon.currentBullet.
	 '*/
	Method Fire:Bool()
		Return RunFire(FIRE)
	End Method
	
	'/**
	 '* Fires a bullet (if one is available) at the mouse coordinates, using the speed set in setBulletSpeed and the rate set in setFireRate.
	 '* 
	 '* @return	true if a bullet was fired or false if one wasn't available. A reference to the bullet fired is stored in FlxWeapon.currentBullet.
	 '*/
	Method FireAtMouse:Bool()
		return RunFire(FIRE_AT_MOUSE)
	End Method
	
	'/**
	 '* Fires a bullet (if one is available) at the given x/y coordinates, using the speed set in setBulletSpeed and the rate set in setFireRate.
	 '* 
	 '* @param	x	The x coordinate (in game world pixels) to fire at
	 '* @param	y	The y coordinate (in game world pixels) to fire at
	 '* @return	true if a bullet was fired or false if one wasn't available. A reference to the bullet fired is stored in FlxWeapon.currentBullet.
	 '*/
	Method FireAtPosition:Bool(x:int, y:int)
		Return RunFire(FIRE_AT_POSITION, x, y)
	End Method
	
	'/**
	 '* Fires a bullet (if one is available) at the given targets x/y coordinates, using the speed set in setBulletSpeed and the rate set in setFireRate.
	 '* 
	 '* @param	target	The FlxSprite you wish to fire the bullet at
	 '* @return	true if a bullet was fired or false if one wasn't available. A reference to the bullet fired is stored in FlxWeapon.currentBullet.
	 '*/
	Method FireAtTarget:Bool(target:FlxSprite)
		Return RunFire(FIRE_AT_TARGET, 0, 0, target)
	End Method
	
	'/**
	 '* Fires a bullet (if one is available) based on the given angle
	 '* 
	 '* @param	angle	The angle (in degrees) calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
	 '* @return	true if a bullet was fired or false if one wasn't available. A reference to the bullet fired is stored in FlxWeapon.currentBullet.
	 '*/
	Method FireFromAngle:Bool(angle:int)
		Return RunFire(FIRE_FROM_ANGLE, 0, 0, Null, angle)
	End Method
	
	'/**
	 '* Fires a bullet (if one is available) based on the angle of the Weapons parent
	 '* 
	 '* @return	true if a bullet was fired or false if one wasn't available. A reference to the bullet fired is stored in FlxWeapon.currentBullet.
	 '*/
	Method FireFromParentAngle:Bool()
		Return RunFire(FIRE_FROM_PARENT_ANGLE)
	End Method
	
	'/**
	 '* Causes the Weapon to fire from the parents x/y value, as seen in Space Invaders and most shoot-em-ups.
	 '* 
	 '* @param	parentRef		If this weapon belongs to a parent sprite, specify it here (bullets will fire from the sprites x/y vars as defined below).
	 '* @param	xVariable		The x axis variable of the parent to use when firing. Typically "x", but could be "screenX" or any public getter that exposes the x coordinate.
	 '* @param	yVariable		The y axis variable of the parent to use when firing. Typically "y", but could be "screenY" or any public getter that exposes the y coordinate.
	 '* @param	offsetX			When the bullet is fired if you need to offset it on the x axis, for example to line it up with the "nose" of a space ship, set the amount here (positive or negative)
	 '* @param	offsetY			When the bullet is fired if you need to offset it on the y axis, for example to line it up with the "nose" of a space ship, set the amount here (positive or negative)
	 '* @param	useDirection	When fired the bullet direction is based on parent sprites facing value (up/down/left/right)
	 '*/
	Method SetParent:Void(parentRef:FlxSprite, xVariable:String, yVariable:String, offsetX:Int = 0, offsetY:Int = 0, useDirection:Bool = False)
		If (parentRef) Then
			_fireFromParent = True
			
			_parent = parentRef
			
			_parentXVariable = xVariable
			_parentYVariable = yVariable
		
			_positionOffset.x = offsetX
			_positionOffset.y = offsetY
			
			_directionFromParent = useDirection
		Endif
	End Method
	
	'/**
	 '* Causes the Weapon to fire from a fixed x/y position on the screen, like in the game Missile Command.<br>
	 '* If set this over-rides a call to setParent (which causes the Weapon to fire from the parents x/y position)
	 '* 
	 '* @param	x	The x coordinate (in game world pixels) to fire from
	 '* @param	y	The y coordinate (in game world pixels) to fire from
	 '* @param	offsetX		When the bullet is fired if you need to offset it on the x axis, for example to line it up with the "nose" of a space ship, set the amount here (positive or negative)
	 '* @param	offsetY		When the bullet is fired if you need to offset it on the y axis, for example to line it up with the "nose" of a space ship, set the amount here (positive or negative)
	 '*/
	Method SetFiringPosition:Void(x:Int, y:Int, offsetX:Int = 0, offsetY:Int = 0)
		_fireFromPosition = True
		_fireX = x
		_fireY = y
		
		_positionOffset.x = offsetX
		_positionOffset.y = offsetY
	End Method
	
	'/**
	 '* The speed in pixels/sec (sq) that the bullet travels at when fired via fireAtMouse, fireAtPosition or fireAtTarget.
	 '* You can update this value in real-time, should you need to speed-up or slow-down your bullets (i.e. collecting a power-up)
	 '* 
	 '* @param	speed		The speed it will move, in pixels per second (sq)
	 '*/
	Method SetBulletSpeed:Void(speed:Int)
		_bulletSpeed = speed
	End Method
	
	'/**
	 '* The speed in pixels/sec (sq) that the bullet travels at when fired via fireAtMouse, fireAtPosition or fireAtTarget.
	 '* 
	 '* @return	The speed the bullet moves at, in pixels per second (sq)
	 '*/
	Method GetBulletSpeed:Int()
		Return _bulletSpeed
	End Method
	
	'/**
	 '* Sets the firing rate of the Weapon. By default there is no rate, as it can be controlled by FlxControl.setFireButton.
	 '* However if you are firing using the mouse you may wish to set a firing rate.
	 '* 
	 '* @param	rate	The delay in milliseconds (ms) between which each bullet is fired, set to zero to clear
	 '*/
	Method SetFireRate:Void(rate:Int)
		_fireRate = rate
	End Method
	
	'/**
	 '* When a bullet goes outside of this bounds it will be automatically killed, freeing it up for firing again.
	 '* TODO - Needs testing with a scrolling map (when not using single screen display)
	 '* 
	 '* @param	bounds	An FlxRect area. Inside this area the bullet should be considered alive, once outside it will be killed.
	 '*/
	Method SetBulletBounds:Void(bounds:FlxRect)
		Self.bounds = bounds
	End Method
	
	'/**
	 '* Set the direction the bullet will travel when fired.
	 '* You can use one of the consts such as BULLET_UP, BULLET_DOWN or BULLET_NORTH_EAST to set the angle easily.
	 '* Speed should be given in pixels/sec (sq) and is the speed at which the bullet travels when fired.
	 '* 
	 '* @param	angle		The angle of the bullet. In clockwise positive direction: Right = 0, Down = 90, Left = 180, Up = -90. You can use one of the consts such as BULLET_UP, etc
	 '* @param	speed		The speed it will move, in pixels per second (sq)
	 '*/
	Method SetBulletDirection:void(angle:int, speed:int)
		_velocity = FptFlxVelocity.VelocityFromAngle(angle, speed)
	End Method
	
	'/**
	 '* Sets gravity on all currently created bullets<br>
	 '* This will update ALL bullets, even those currently "in flight", so be careful about when you call this!
	 '* 
	 '* @param	xForce	A positive value applies gravity dragging the bullet to the right. A negative value drags the bullet to the left. Zero disables horizontal gravity.
	 '* @param	yforce	A positive value applies gravity dragging the bullet down. A negative value drags the bullet up. Zero disables vertical gravity.
	 '*/
	Method SetBulletGravity:void(xForce:int, yForce:int)
		group.SetAll("xGravity",  BoxFloat(xForce))
		group.SetAll("yGravity",  BoxFloat(yForce))
	End Method
	
	'/**
	 '* If you'd like your bullets to accelerate to their top speed rather than be launched already at it, then set the acceleration value here.
	 '* If you've previously set the acceleration then setting it to zero will cancel the effect.
	 '* This will update ALL bullets, even those currently "in flight", so be careful about when you call this!
	 '* 
	 '* @param	xAcceleration		Acceleration speed in pixels per second to apply to the sprites horizontal movement, set to zero to cancel. Negative values move left, positive move right.
	 '* @param	yAcceleration		Acceleration speed in pixels per second to apply to the sprites vertical movement, set to zero to cancel. Negative values move up, positive move down.
	 '* @param	xSpeedMax			The maximum speed in pixels per second in which the sprite can move horizontally
	 '* @param	ySpeedMax			The maximum speed in pixels per second in which the sprite can move vertically
	 '*/
	Method SetBulletAcceleration:Void(xAcceleration:Int, yAcceleration:Int, xSpeedMax:Int, ySpeedMax:Int)
		If (xAcceleration = 0 And yAcceleration = 0) Then
			group.SetAll("accelerates", BoxBool(False))
		Else
			group.SetAll("accelerates",  BoxBool(True))
			group.SetAll("xAcceleration",  BoxInt(xAcceleration))
			group.SetAll("yAcceleration", BoxInt(yAcceleration))
			group.SetAll("maxVelocityX", BoxInt(xSpeedMax))
			group.SetAll("maxVelocityY", BoxInt(ySpeedMax))
		Endif
	End Method
	
	'/**
	 '* When the bullet is fired from a parent (or fixed position) it will do so from their x/y coordinate.<br>
	 '* Often you need to align a bullet with the sprite, i.e. to make it look like it came out of the "nose" of a space ship.<br>
	 '* Use this offset x/y value to achieve that effect.
	 '* 
	 '* @param	offsetX		The x coordinate offset to add to the launch location (positive or negative)
	 '* @param	offsetY		The y coordinate offset to add to the launch location (positive or negative)
	 '*/
	Method SetBulletOffset:Void(offsetX:Int, offsetY:Int)
		_positionOffset.x = offsetX
		_positionOffset.y = offsetY
	End Method
	
	'/**
	 '* Give the bullet a random factor to its angle, speed, position or lifespan when fired. Can create a nice "scatter gun" effect.
	 '* 
	 '* @param	randomAngle		The +- value applied to the angle when fired. For example 20 means the bullet can fire up to 20 degrees under or over its angle when fired.
	 '* @param	randomSpeed		The +- value applied to the bullet speed when fired. For example 10 means the bullet speed varies by +- 10px/sec
	 '* @param	randomPosition	The +- values applied to the x/y coordinates the bullet is fired from.
	 '* @param	randomLifeSpan	The +- values applied to the life span of the bullet.
	 '*/
	Method SetBulletRandomFactor:Void(randomAngle:Int = 0, randomSpeed:Int = 0, randomPosition:FlxPoint = Null, randomLifeSpan:Int = 0)
		_rndFactorAngle = randomAngle
		_rndFactorSpeed = randomSpeed
		
		If (randomPosition <> Null) Then
			_rndFactorPosition = randomPosition
		Endif
		
		_rndFactorLifeSpan = randomLifeSpan
	End Method
	
	Method RndFactorAngle:Int() Property
		Return _rndFactorAngle
	End Method
		
	Method RndFactorPosition:FlxPoint() Property
		Return _rndFactorPosition
	End Method
	
	Method RndFactorSpeed:Int() Property
		Return _rndFactorSpeed
	End Method	
	
	Method RndFactorLifeSpan:Int() Property
		Return _rndFactorLifeSpan
	End Method	
	
	'/**
	 '* If the bullet should have a fixed life span use this function to set it.
	 '* The bullet will be killed once it passes this lifespan (if still alive and in bounds)
	 '* 
	 '* @param	lifespan	The lifespan of the bullet in ms, calculated when the bullet is fired. Set to zero to disable bullet lifespan.
	 '*/
	Method SetBulletLifeSpan:Void(lifespan:Int)
		_bulletLifeSpan = lifespan
	End Method
	
	Method BulletLifeSpan:Int() Property
		Return _bulletLifeSpan
	End Method
	
	'/**
	 '* The elasticity of the fired bullet controls how much it rebounds off collision surfaces.
	 '* 
	 '* @param	elasticity	The elasticity of the bullet between 0 and 1 (0 being no rebound, 1 being 100% force rebound). Set to zero to disable.
	 '*/
	Method SetBulletElasticity:void(elasticity:Float)
		_bulletElasticity = elasticity
	End Method
	
	Method BulletElasticity:Float() Property
		Return _bulletElasticity
	End Method
	
	'/**
	 '* Internal function that returns the next available bullet from the pool (if any)
	 '* 
	 '* @return	A bullet
	 '*/
	Method GetFreeBullet:FptBullet()
		Local result:FptBullet = Null
		
		If (group = Null Or group.Length = 0)
			FlxG.Log("FptFlxWeapon.monkey cannot fire a bullet until one has been created via a call to makePixelBullet or makeImageBullet")
			Return Null
		Endif
		
		For Local bullet:FlxBasic = Eachin group.Members
			If (bullet.exists = False) Then
				result = FptBullet(bullet)
				Exit
			Endif
		Next
		
		Return result
	End Method
	
	'/**
	 '* Sets a pre-fire callback function and sound. These are played immediately before the bullet is fired.
	 '* 
	 '* @param	callback	The function to call
	 '* @param	sound		An FlxSound to play
	 '*/
	Method SetPreFireCallback:void(callback:FunctionInfo = null, sound:FlxSound = null)
		onPreFireCallback = callback
		onPreFireSound = sound
	End Method
	
	'/**
	 '* Sets a fire callback function and sound. These are played immediately as the bullet is fired.
	 '* 
	 '* @param	callback	The function to call
	 '* @param	sound		An FlxSound to play
	 '*/
	Method SetFireCallback:void(callback:FunctionInfo = null, sound:FlxSound = null)
		onFireCallback = callback
		onFireSound = sound
	End Method
	
	'/**
	 '* Sets a post-fire callback function and sound. These are played immediately after the bullet is fired.
	 '* 
	 '* @param	callback	The function to call
	 '* @param	sound		An FlxSound to play
	 '*/
	Method SetPostFireCallback:Void(callback:FunctionInfo = Null, sound:FlxSound = Null)
		onPostFireCallback = callback
		onPostFireSound = sound
	End Method
	
	'// TODO
	Method TODOcreateBulletPattern:Void(pattern:Int[])
		'//	Launches this many bullets
	End Method
	
	
	Method Update:Void()
		'// ???
	End Method
		
End Class		
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

	'import flash.accessibility.Accessibility;
Import flixel
Import fptflxmath
	
Class FptFlxVelocity 
	
	'/**
	 '* Sets the source FlxSprite x/y velocity so it will move directly towards the destination FlxSprite at the speed given (in pixels per second)<br>
	 '* If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
	 '* Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
	 '* The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
	 '* If you need the object to accelerate, see accelerateTowardsObject() instead
	 '* Note: Doesn't take into account acceleration, maxVelocity or drag (if you set drag or acceleration too high this object may not move at all)
	 '* 
	 '* @param	source		The FlxSprite on which the velocity will be set
	 '* @param	dest		The FlxSprite where the source object will move to
	 '* @param	speed		The speed it will move, in pixels per second (default is 60 pixels/sec)
	 '* @param	maxTime		Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
	 '*/
	Function MoveTowardsObject:Void(source:FlxSprite, dest:FlxSprite, speed:Int = 60, maxTime:Int = 0)
		Local a:Float = AngleBetween(source, dest)
		
		If (maxTime > 0) Then
			Local d:int = DistanceBetween(source, dest)
			
			'//	We know how many pixels we need to move, but how fast?
			speed = d / (maxTime / 1000)
		Endif
		
		source.velocity.x = Cosr(a) * speed
		source.velocity.y = Sinr(a) * speed
	End Function
		
	'/**
	 '* Sets the x/y acceleration on the source FlxSprite so it will move towards the destination FlxSprite at the speed given (in pixels per second)<br>
	 '* You must give a maximum speed value, beyond which the FlxSprite won't go any faster.<br>
	 '* If you don't need acceleration look at moveTowardsObject() instead.
	 '* 
	 '* @param	source			The FlxSprite on which the acceleration will be set
	 '* @param	dest			The FlxSprite where the source object will move towards
	 '* @param	speed			The speed it will accelerate in pixels per second
	 '* @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
	 '* @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
	 '*/
	Function AccelerateTowardsObject:Void(source:FlxSprite, dest:FlxSprite, speed:Int, xSpeedMax:Int, ySpeedMax:Int)
		Local a:Float = AngleBetween(source, dest)
		
		source.velocity.x = 0
		source.velocity.y = 0
		
		source.acceleration.x = Cosr(a) * speed
		source.acceleration.y = Sinr(a) * speed
		
		source.maxVelocity.x = xSpeedMax
		source.maxVelocity.y = ySpeedMax
	End Function
		
	'/**
	 '* Move the given FlxSprite towards the mouse pointer coordinates at a steady velocity
	 '* If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
	 '* Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
	 '* The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
	 '* 
	 '* @param	source		The FlxSprite to move
	 '* @param	speed		The speed it will move, in pixels per second (default is 60 pixels/sec)
	 '* @param	maxTime		Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
	 '*/
	Function MoveTowardsMouse:Void(source:FlxSprite, speed:Int = 60, maxTime:Int = 0)
		Local a:Float = AngleBetweenMouse(source)
			
		If (maxTime > 0) Then
			Local d:int = DistanceToMouse(source)
			
			'//	We know how many pixels we need to move, but how fast?
			speed = d / (maxTime / 1000)
		Endif
		
		source.velocity.x = Cosr(a) * speed
		source.velocity.y = Sinr(a) * speed
	End Function
		
	'/**
	 '* Sets the x/y acceleration on the source FlxSprite so it will move towards the mouse coordinates at the speed given (in pixels per second)<br>
	 '* You must give a maximum speed value, beyond which the FlxSprite won't go any faster.<br>
	 '* If you don't need acceleration look at moveTowardsMouse() instead.
	 '* 
	 '* @param	source			The FlxSprite on which the acceleration will be set
	 '* @param	speed			The speed it will accelerate in pixels per second
	 '* @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
	 '* @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
	 '*/
	Function AccelerateTowardsMouse:Void(source:FlxSprite, speed:Int, xSpeedMax:int, ySpeedMax:int)
		Local a:Float = AngleBetweenMouse(source)
		
		source.velocity.x = 0
		source.velocity.y = 0
		
		source.acceleration.x = Cosr(a) * speed
		source.acceleration.y = Sinr(a) * speed
		
		source.maxVelocity.x = xSpeedMax
		source.maxVelocity.y = ySpeedMax
	End Function
		
	'/**
	 '* Sets the x/y velocity on the source FlxSprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
	 '* If you specify a maxTime then it will adjust the speed (over-writing what you set) so it arrives at the destination in that number of seconds.<br>
	 '* Timings are approximate due to the way Flash timers work, and irrespective of SWF frame rate. Allow for a variance of +- 50ms.<br>
	 '* The source object doesn't stop moving automatically should it ever reach the destination coordinates.<br>
	 '* 
	 '* @param	source		The FlxSprite to move
	 '* @param	target		The FlxPoint coordinates to move the source FlxSprite towards
	 '* @param	speed		The speed it will move, in pixels per second (default is 60 pixels/sec)
	 '* @param	maxTime		Time given in milliseconds (1000 = 1 sec). If set the speed is adjusted so the source will arrive at destination in the given number of ms
	 '*/
	Function MoveTowardsPoint:Void(source:FlxSprite, target:FlxPoint, speed:Int = 60, maxTime:Int = 0)
		Local a:Float = AngleBetweenPoint(source, target)
		
		If (maxTime > 0) Then
			Local d:Int = DistanceToPoint(source, target)
			
			'//	We know how many pixels we need to move, but how fast?
			speed = d / (maxTime / 1000)
		Endif
		
		source.velocity.x = Cosr(a) * speed
		source.velocity.y = Sinr(a) * speed
	End Function
		
	'/**
	 '* Sets the x/y acceleration on the source FlxSprite so it will move towards the target coordinates at the speed given (in pixels per second)<br>
	 '* You must give a maximum speed value, beyond which the FlxSprite won't go any faster.<br>
	 '* If you don't need acceleration look at moveTowardsPoint() instead.
	 '* 
	 '* @param	source			The FlxSprite on which the acceleration will be set
	 '* @param	target			The FlxPoint coordinates to move the source FlxSprite towards
	 '* @param	speed			The speed it will accelerate in pixels per second
	 '* @param	xSpeedMax		The maximum speed in pixels per second in which the sprite can move horizontally
	 '* @param	ySpeedMax		The maximum speed in pixels per second in which the sprite can move vertically
	 '*/
	Function AccelerateTowardsPoint:Void(source:FlxSprite, target:FlxPoint, speed:Int, xSpeedMax:Int, ySpeedMax:Int)
		Local a:Float = AngleBetweenPoint(source, target)
		
		source.velocity.x = 0
		source.velocity.y = 0
		
		source.acceleration.x = Cosr(a) * speed
		source.acceleration.y = Sinr(a) * speed
		
		source.maxVelocity.x = xSpeedMax
		source.maxVelocity.y = ySpeedMax
	End Function
		
	'/**
	 '* Find the distance (in pixels, rounded) between two FlxSprites, taking their origin into account
	 '* 
	 '* @param	a	The first FlxSprite
	 '* @param	b	The second FlxSprite
	 '* @return	int	Distance (in pixels)
	 '*/
	Function DistanceBetween:Int(a:FlxSprite, b:FlxSprite)
		Local dx:Float = (a.x + a.origin.x) - (b.x + b.origin.x)
		Local dy:Float = (a.y + a.origin.y) - (b.y + b.origin.y)
	
		Return Int(FptFlxMath.VectorLength(dx, dy))
	End Function
		
	'/**
	 '* Find the distance (in pixels, rounded) from an FlxSprite to the given FlxPoint, taking the source origin into account
	 '* 
	 '* @param	a		The first FlxSprite
	 '* @param	target	The FlxPoint
	 '* @return	int		Distance (in pixels)
	 '*/
	Function DistanceToPoint:Int(a:FlxSprite, target:FlxPoint)
		Local dx:Float = (a.x + a.origin.x) - (target.x)
		Local dy:Float = (a.y + a.origin.y) - (target.y)

		Return Int(FptFlxMath.VectorLength(dx, dy))
	End Function
		
	'/**
	 '* Find the distance (in pixels, rounded) from the Object x/y And the mouse x/y
	 '* 
	 '* @param	a	The FlxSprite to test against
	 '* @return	int	The distance between the given sprite and the mouse coordinates
	 '*/
	Function DistanceToMouse:Int(a:FlxSprite)
		Local dx:Float = (a.x + a.origin.x) - FlxG.Mouse.screenX
		Local dy:Float = (a.y + a.origin.y) - FlxG.Mouse.screenY
		
		Return Int(FptFlxMath.VectorLength(dx, dy))
	End Function
		
	'/**
	 '* Find the angle (in radians) between an FlxSprite and an FlxPoint. The source sprite takes its x/y and origin into account.
	 '* The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
	 '* 
	 '* @param	a			The FlxSprite to test from
	 '* @param	target		The FlxPoint to angle the FlxSprite towards
	 '* @param	asDegrees	If you need the value in degrees instead of radians, set to true
	 '* 
	 '* @return	Number The angle (in radians unless asDegrees is true)
	 '*/
	Function AngleBetweenPoint:Float(a:FlxSprite, target:FlxPoint, asDegrees:Bool = False)
		Local dx:Float = (target.x) - (a.x + a.origin.x)
		Local dy:Float = (target.y) - (a.y + a.origin.y)
		
		If (asDegrees) Then
			Return FptFlxMath.AsDegrees(ATan2r(dy, dx))
		Else
			Return ATan2r(dy, dx)
		Endif
	End Function
		
	'/**
	 '* Find the angle (in radians) between the two FlxSprite, taking their x/y and origin into account.
	 '* The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
	 '* 
	 '* @param	a			The FlxSprite to test from
	 '* @param	b			The FlxSprite to test to
	 '* @param	asDegrees	If you need the value in degrees instead of radians, set to true
	 '* 
	 '* @return	Number The angle (in radians unless asDegrees is true)
	 '*/
	Function AngleBetween:Float(a:FlxSprite, b:FlxSprite, asDegrees:Bool = False)
		Local dx:Float = (b.x + b.origin.x) - (a.x + a.origin.x)
		Local dy:Float = (b.y + b.origin.y) - (a.y + a.origin.y)
		
		If (asDegrees) Then
			Return FptFlxMath.AsDegrees(ATan2r(dy, dx))
		Else
			Return ATan2r(dy, dx)
		Endif
	End Function
		
	'/**
	 '* Given the angle and speed calculate the velocity and return it as an FlxPoint
	 '* 
	 '* @param	angle	The angle (in degrees) calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
	 '* @param	speed	The speed it will move, in pixels per second sq
	 '* 
	 '* @return	An FlxPoint where FlxPoint.x contains the velocity x value and FlxPoint.y contains the velocity y value
	 '*/
	Function VelocityFromAngle:FlxPoint(angle:Float, speed:Int)
		Local result:FlxPoint = New FlxPoint()
		
		result.x = Cos(angle) * speed
		result.y = Sin(angle) * speed
		
		Return result
	End Function
		
	'/**
	 '* Given the FlxSprite and speed calculate the velocity and return it as an FlxPoint based on the direction the sprite is facing
	 '* 
	 '* @param	parent	The FlxSprite to get the facing value from
	 '* @param	speed	The speed it will move, in pixels per second sq
	 '* 
	 '* @return	An FlxPoint where FlxPoint.x contains the velocity x value and FlxPoint.y contains the velocity y value
	 '*/
	Function VelocityFromFacing:FlxPoint(parent:FlxSprite, speed:Int)
		Local a:Float
		
		If (parent.Facing = FlxObject.LEFT) Then
			a = 180
		Else If (parent.Facing = FlxObject.RIGHT) Then
			a = 0
		Else If (parent.Facing = FlxObject.UP) Then
			a = -90
		Else If (parent.Facing = FlxObject.DOWN) Then
			a = 90
		Endif
		
		Local result:FlxPoint = New FlxPoint()
		
		result.x = Cos(a) * speed
		result.y = Sin(a) * speed
		
		Return result
	End Function
		
	'/**
	 '* Find the angle (in radians) between an FlxSprite and the mouse, taking their x/y and origin into account.
	 '* The angle is calculated in clockwise positive direction (down = 90 degrees positive, right = 0 degrees positive, up = 90 degrees negative)
	 '* 
	 '* @param	a			The FlxObject to test from
	 '* @param	asDegrees	If you need the value in degrees instead of radians, set to true
	 '* 
	 '* @return	Number The angle (in radians unless asDegrees is true)
	 '*/
	Function AngleBetweenMouse:Float(a:FlxSprite, asDegrees:Bool = False)
		'//	In order to get the angle between the object and mouse, we need the objects screen coordinates (rather than world coordinates)
		Local p:FlxPoint = a.GetScreenXY()
			
		Local dx:Float = FlxG.Mouse.screenX - p.x
		Local dy:Float = FlxG.Mouse.screenY - p.y
			
		If (asDegrees) Then
			Return FptFlxMath.AsDegrees(ATan2r(dy, dx))
		Else
			Return ATan2r(dy, dx)
		Endif
	End Function
        
End Class
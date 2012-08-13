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

Import flixel.flxpoint
Import flixel.flxsprite
Import flixel.flxg
Import flixel.plugin.photonstorm.fptflxmath
Import flixel.plugin.photonstorm.fptflxvelocity
Import flixel.plugin.photonstorm.fptflxweapon

Class FptBullet Extends FlxSprite

	Field weapon:FptFlxWeapon
	
	Field bulletSpeed:Int
Public	
	'//	Acceleration or Velocity?
	Field accelerates:Bool
	Field xAcceleration:Int
	Field yAcceleration:Int
	
	Field rndFactorAngle:Int
	Field rndFactorSpeed:Int
	Field rndFactorLifeSpan:Int
	Field lifespan:Int
	Field launchTime:Int
	Field expiresTime:Int
	
	Field animated:Bool
	
Private
		
	Method New(weapon:FptFlxWeapon, id:Int)
		Super.New(0, 0)
		
		Self.weapon = weapon
		Self.ID = id
		
		'//	Safe defaults
		accelerates = False
		animated = False
		bulletSpeed = 0
		
		exists = False
	End Method
	
	'/**
	 '* Adds a new animation to the sprite.
	 '* 
	 '* @param	Name		What this animation should be called (e.g. "run").
	 '* @param	Frames		An array of numbers indicating what frames to play in what order (e.g. 1, 2, 3).
	 '* @param	FrameRate	The speed in frames per second that the animation should play at (e.g. 40 fps).
	 '* @param	Looped		Whether or not the animation is looped or just plays once.
	 '*/
	Method AddAnimation:Void(Name:String, Frames:Int[], FrameRate:Float = 0, Looped:Bool = True)
		Super.AddAnimation(Name, Frames, FrameRate, Looped)
		
		animated = True
	End Method
	
	Method Fire:Void(fromX:Int, fromY:Int, velX:Int, velY:Int)
		x = fromX + FptFlxMath.Rand( -weapon.RndFactorPosition.x, weapon.RndFactorPosition.x)
		y = fromY + FptFlxMath.Rand( -weapon.RndFactorPosition.y, weapon.RndFactorPosition.y)
		
		If (accelerates) Then
			acceleration.x = xAcceleration + FptFlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed)
			acceleration.y = yAcceleration + FptFlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed)
		Else
			velocity.x = velX + FptFlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed)
			velocity.y = velY + FptFlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed)
		Endif
		
		PostFire()
	End Method
	
	Method FireAtMouse:Void(fromX:Int, fromY:Int, speed:Int)
		x = fromX + FptFlxMath.Rand( -weapon.RndFactorPosition.x, weapon.RndFactorPosition.x)
		y = fromY + FptFlxMath.Rand( -weapon.RndFactorPosition.y, weapon.RndFactorPosition.y)
		
		If (accelerates) Then
			FptFlxVelocity.AccelerateTowardsMouse(Self, speed + FptFlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed), maxVelocity.x, maxVelocity.y)
		Else
			FptFlxVelocity.MoveTowardsMouse(Self, speed + FptFlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed))
		Endif
		
		PostFire()
	End Method
	
	Method FireAtPosition:Void(fromX:Int, fromY:Int, toX:Int, toY:Int, speed:Int)
		x = fromX + FptFlxMath.Rand( -weapon.RndFactorPosition.x, weapon.RndFactorPosition.x)
		y = fromY + FptFlxMath.Rand( -weapon.RndFactorPosition.y, weapon.RndFactorPosition.y)
		
		If (accelerates) Then
			FptFlxVelocity.AccelerateTowardsPoint(Self, New FlxPoint(toX, toY), speed + FptFlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed), maxVelocity.x, maxVelocity.y)
		Else
			FptFlxVelocity.MoveTowardsPoint(Self, New FlxPoint(toX, toY), speed + FptFlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed))
		Endif
				
		PostFire()
	End Method
	
	Method FireAtTarget:Void(fromX:Int, fromY:Int, target:FlxSprite, speed:Int)
		x = fromX + FptFlxMath.Rand( -weapon.RndFactorPosition.x, weapon.RndFactorPosition.x)
		y = fromY + FptFlxMath.Rand( -weapon.RndFactorPosition.y, weapon.RndFactorPosition.y)
		
		If (accelerates)
			FptFlxVelocity.AccelerateTowardsObject(Self, target, speed + FptFlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed), maxVelocity.x, maxVelocity.y)
		Else
			FptFlxVelocity.MoveTowardsObject(Self, target, speed + FptFlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed))
		Endif
		
		PostFire();
	End Method
	
	Method FireFromAngle:Void(fromX:Int, fromY:Int, fireAngle:Int, speed:Int)
		x = fromX + FptFlxMath.Rand( -weapon.RndFactorPosition.x, weapon.RndFactorPosition.x)
		y = fromY + FptFlxMath.Rand( -weapon.RndFactorPosition.y, weapon.RndFactorPosition.y)
		
		Local newVelocity:FlxPoint = FptFlxVelocity.VelocityFromAngle(fireAngle + FptFlxMath.Rand( -weapon.RndFactorAngle, weapon.RndFactorAngle), speed + FptFlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed))
		
		If (accelerates) Then
			acceleration.x = newVelocity.x
			acceleration.y = newVelocity.y
		Else
			velocity.x = newVelocity.x
			velocity.y = newVelocity.y
		Endif
		
		PostFire()
	End Method
	
	Method PostFire:Void()
		If (animated) Then
			Play("fire")
		Endif
		
		If (weapon.BulletElasticity > 0) Then
			elasticity = weapon.BulletElasticity
		Endif
		
		exists = True
		
		'launchTime = getTimer();
		
		If (weapon.BulletLifeSpan > 0) Then
			lifespan = weapon.BulletLifeSpan + FptFlxMath.Rand( -weapon.RndFactorLifeSpan, weapon.RndFactorLifeSpan)
			expiresTime = FlxG.Elapsed + lifespan
		Endif
		
'		If (weapon.onFireCallback is Function) Then
'			weapon.onFireCallback.apply()
'		Endif
		
'		If (weapon.onFireSound) Then
'			weapon.onFireSound.play()
'		Endif
	End Method
	
	Method XGravity:Void(gx:Int) Property
		acceleration.x = gx;
	End Method
	
	Method YGravity:Void(gy:Int) Property
		acceleration.y = gy;
	End Method
	
	Method MaxVelocityX:Void(mx:Int) Property
		maxVelocity.x = mx;
	End Method
	
	Method MaxVelocityY:Void(my:Int) Property
		maxVelocity.y = my
	End Method
	
	Method Update:Void()
		If (lifespan > 0 And FlxG.Elapsed > expiresTime) Then
			Kill()
		Endif
		
		If (FptFlxMath.PointInFlxRect(x, y, weapon.bounds) = False) Then
			Kill()
		Endif
		
	End Method
		
End Class
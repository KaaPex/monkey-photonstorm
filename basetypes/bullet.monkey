'/**
 '* FlxColor
 '* -- Part of the Flixel Power Tools set
 '* 
 '* v1.5 Added RGBtoWebString
 '* v1.4 getHSVColorWheel now supports an alpha value per color
 '* v1.3 Added getAlphaFloat
 '* v1.2 Updated for the Flixel 2.5 Plugin system
 '* 
 '* @version 1.5 - August 4th 2011
 '* @link http://www.photonstorm.com
 '* @author Richard Davey / Photon Storm
 '* @see Depends upon FlxMath
 '* Copyright: Monkey port - 2012 Aleksey 'KaaPex' Kazantsev
'*/
Strict

Import flixel.flxpoint
Import flixel.flxsprite
Import flixel.flxg
Import flixel.plugin.photonstorm.flxmath
Import flixel.plugin.photonstorm.flxvelocity
Import flixel.plugin.photonstorm.flxweapon

Class Bullet Extends FlxSprite

	Field weapon:FlxWeapon
	
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
		
	Method New(weapon:FlxWeapon, id:Int)
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
		x = fromX + FlxMath.Rand( -weapon.RndFactorPosition.x, weapon.RndFactorPosition.x)
		y = fromY + FlxMath.Rand( -weapon.RndFactorPosition.y, weapon.RndFactorPosition.y)
		
		If (accelerates) Then
			acceleration.x = xAcceleration + FlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed)
			acceleration.y = yAcceleration + FlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed)
		Else
			velocity.x = velX + FlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed)
			velocity.y = velY + FlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed)
		Endif
		
		PostFire()
	End Method
	
	Method FireAtMouse:Void(fromX:Int, fromY:Int, speed:Int)
		x = fromX + FlxMath.Rand( -weapon.RndFactorPosition.x, weapon.RndFactorPosition.x)
		y = fromY + FlxMath.Rand( -weapon.RndFactorPosition.y, weapon.RndFactorPosition.y)
		
		If (accelerates) Then
			FlxVelocity.AccelerateTowardsMouse(Self, speed + FlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed), maxVelocity.x, maxVelocity.y)
		Else
			FlxVelocity.MoveTowardsMouse(Self, speed + FlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed))
		Endif
		
		PostFire()
	End Method
	
	Method FireAtPosition:Void(fromX:Int, fromY:Int, toX:Int, toY:Int, speed:Int)
		x = fromX + FlxMath.Rand( -weapon.RndFactorPosition.x, weapon.RndFactorPosition.x)
		y = fromY + FlxMath.Rand( -weapon.RndFactorPosition.y, weapon.RndFactorPosition.y)
		
		If (accelerates) Then
			FlxVelocity.AccelerateTowardsPoint(Self, New FlxPoint(toX, toY), speed + FlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed), maxVelocity.x, maxVelocity.y)
		Else
			FlxVelocity.MoveTowardsPoint(Self, New FlxPoint(toX, toY), speed + FlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed))
		Endif
				
		PostFire()
	End Method
	
	Method FireAtTarget:Void(fromX:Int, fromY:Int, target:FlxSprite, speed:Int)
		x = fromX + FlxMath.Rand( -weapon.RndFactorPosition.x, weapon.RndFactorPosition.x)
		y = fromY + FlxMath.Rand( -weapon.RndFactorPosition.y, weapon.RndFactorPosition.y)
		
		If (accelerates)
			FlxVelocity.AccelerateTowardsObject(Self, target, speed + FlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed), maxVelocity.x, maxVelocity.y)
		Else
			FlxVelocity.MoveTowardsObject(Self, target, speed + FlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed))
		Endif
		
		PostFire();
	End Method
	
	Method FireFromAngle:Void(fromX:Int, fromY:Int, fireAngle:Int, speed:Int)
		x = fromX + FlxMath.Rand( -weapon.RndFactorPosition.x, weapon.RndFactorPosition.x)
		y = fromY + FlxMath.Rand( -weapon.RndFactorPosition.y, weapon.RndFactorPosition.y)
		
		Local newVelocity:FlxPoint = FlxVelocity.VelocityFromAngle(fireAngle + FlxMath.Rand( -weapon.RndFactorAngle, weapon.RndFactorAngle), speed + FlxMath.Rand( -weapon.RndFactorSpeed, weapon.RndFactorSpeed))
		
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
		
		launchTime = Millisecs()
		
		If (weapon.BulletLifeSpan > 0) Then
			lifespan = weapon.BulletLifeSpan + FlxMath.Rand( -weapon.RndFactorLifeSpan, weapon.RndFactorLifeSpan)			
			expiresTime = Millisecs() + lifespan
		Endif
		
		If (weapon.onFireCallback) Then
			weapon.onFireCallback.Invoke([])
		Endif
		
		If (weapon.onFireSound) Then
			weapon.onFireSound.Play()
		Endif
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
		If (lifespan > 0 And Millisecs() > expiresTime) Then
			Kill()
		Endif
		
		If (FlxMath.PointInFlxRect(x, y, weapon.bounds) = False) Then
			Kill()
		Endif
	End Method
		
End Class
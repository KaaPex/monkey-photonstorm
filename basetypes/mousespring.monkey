
Import flixel
Import flixel.plugin.photonstorm.flxextendedsprite
	
Class MouseSpring 

	Field sprite:FlxExtendedSprite
	
	'/**
	 '* The tension of the spring, smaller Floats create springs closer To the mouse pointer
	 '* @Default 0.1
	 '*/
	Field tension:Float = 0.1
	
	'/**
	 '* The friction applied To the spring as it moves
	 '* @Default 0.95
	 '*/
	Field friction:Float = 0.95
	
	'/**
	 '* The gravity controls how far "down" the spring hangs (use a negative value For it To hang up!)
	 '* @Default 0
	 '*/
	Field gravity:Float = 0
	
Private 
	Field _retainVelocity:Bool = False
	
	Field _vx:Float = 0
	Field _vy:Float = 0

	Field _dx:Float = 0
	Field _dy:Float = 0
	
	Field _ax:Float = 0
	Field _ay:Float = 0
	
Public	
	'/**
	 '* Adds a spring between the mouse And a Sprite.
	 '* 
	 '* @param	sprite				The FlxExtendedSprite To which this spring is attached
	 '* @param	retainVelocity		True To retain the velocity of the spring when the mouse is released, Or False To clear it
	 '* @param	tension				The tension of the spring, smaller Floats create springs closer To the mouse pointer
	 '* @param	friction			The friction applied To the spring as it moves
	 '* @param	gravity				The gravity controls how far "down" the spring hangs (use a negative value For it To hang up!)
	 '*/
	 Method New(sprite:FlxExtendedSprite, retainVelocity:Bool = False, tension:Float = 0.1, friction:Float = 0.95, gravity:Float = 0)
		self.sprite = sprite
		self._retainVelocity = retainVelocity
		self.tension = tension
		self.friction = friction
		self.gravity = gravity
	End Method
	
	'/**
	 '* Updates the spring physics And repositions the sprite
	 '*/
	Method Update:Void()
		_dx = FlxG.Mouse.x - sprite.SpringX
		_dy = FlxG.Mouse.y - sprite.SpringY
		
		_ax = _dx * tension
		_ay = _dy * tension
		
		_vx += _ax
		_vy += _ay
		
		_vy += gravity
		_vx *= friction
		_vy *= friction
		
		sprite.x += _vx
		sprite.y += _vy
	End Method
	
	'/**
	 '* Resets the internal spring physics
	 '*/
	Method Reset:Void()
		_vx = 0
		_vy = 0
	
		_dx = 0
		_dy = 0
		
		_ax = 0
		_ay = 0
	End Method
		
End Class
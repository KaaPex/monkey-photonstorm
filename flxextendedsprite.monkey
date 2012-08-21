'/**
 '* FlxExtendedSprite
 '* -- Part of the Flixel Power Tools set
 '* 
 '* v1.4 Added MouseSpring, plugin checks and all the missing documentation
 '* v1.3 Added Gravity, Friction and Tolerance support
 '* v1.2 Now works fully with FlxMouseControl to be completely clickable and draggable!
 '* v1.1 Added "setMouseDrag" and "mouse over" states
 '* v1.0 Updated for the Flixel 2.5 Plugin system
 '* 
 '* @version 1.4 - July 29th 2011
 '* @link http://www.photonstorm.com
 '* @author Richard Davey / Photon Storm
 '* Copyright: Monkey port - 2012 Aleksey 'KaaPex' Kazantsev
'*/
Strict
Import reflection
Import monkey.math
Import flixel
Import flxmousecontrol
Import flxcollision
Import basetypes.mousespring

'/**
 '* An enhanced FlxSprite that is capable of receiving mouse clicks, being dragged and thrown, mouse springs, gravity and other useful things
 '*/
Class FlxExtendedSprite Extends FlxSprite
Global ClassObject:Object
Public
		'/**
		 '* Used by FlxMouseControl when multiple sprites overlap and register clicks, and you need to determine which sprite has priority
		 '*/
		Field priorityID:Float
		
		'/**
		 '* If the mouse currently pressed down on this sprite?
		 '* @default false
		 '*/
		Field isPressed:Bool = False
		
		'/**
		 '* Is this sprite allowed to be clicked?
		 '* @default false
		 '*/
		Field clickable:Bool = False
		
Private 
		Field _clickOnRelease:Bool = False
		Field _clickPixelPerfect:Bool = False
		Field _clickPixelPerfectAlpha:Int
		Field _clickCounter:Int
		
		'/**
		 '* Function called when the mouse is pressed down on this sprite. Function is passed these parameters: obj:FlxExtendedSprite, x:int, y:int
		 '* @default null
		 '*/
Public 
		Field mousePressedCallback:FlxExtendedSpriteListerner
		
		'/**
		 '* Function called when the mouse is released from this sprite. Function is passed these parameters: obj:FlxExtendedSprite, x:int, y:int
		 '* @default null
		 '*/
		Field mouseReleasedCallback:FlxExtendedSpriteListerner
		
		'/**
		 '* Is this sprite allowed to be thrown?
		 '* @default false
		 '*/
		Field isThrowable:Bool = False
		Private Field _throwXFactor:Int
		Private Field _throwYFactor:Int
		
		'/**
		 '* Does this sprite have gravity applied to it?
		 '* @default false
		 '*/
		Public Field hasGravity:Bool = False
		
		'/**
		 '* The x axis gravity influence
		 '*/
		Public Field gravityX:Int
		
		'/**
		 '* The y axis gravity influence
		 '*/
		Public Field gravityY:Int
		
		'/**
		 '* Determines how quickly the Sprite come to rest on the walls if the sprite has x gravity enabled
		 '* @default 500
		 '*/
		Public Field frictionX:Float
		
		'/**
		 '* Determines how quickly the Sprite come to rest on the ground if the sprite has y gravity enabled
		 '* @default 500
		 '*/
		Public Field frictionY:Float
		
		'/**
		 '* If the velocity.x of this sprite falls between zero and this amount, then the sprite will come to a halt (have velocity.x set to zero)
		 '*/
		Public Field toleranceX:Float
		
		'/**
		 '* If the velocity.y of this sprite falls between zero and this amount, then the sprite will come to a halt (have velocity.y set to zero)
		 '*/
		Public Field toleranceY:Float
		
		'/**
		 '* Is this sprite being dragged by the mouse or not?
		 '* @default false
		 '*/
		Public Field isDragged:Bool = False
		
		'/**
		 '* Is this sprite allowed to be dragged by the mouse? true = yes, false = no
		 '* @default false
		 '*/
		Public Field draggable:Bool = False
		Private Field _dragPixelPerfect:Bool = False
		Private Field _dragPixelPerfectAlpha:Int
		Private Field _dragOffsetX:Float
		Private Field _dragOffsetY:Float
		Private Field _dragFromPoint:Bool
		Private Field _allowHorizontalDrag:Bool = True
		Private Field _allowVerticalDrag:Bool = True
		
		'/**
		 '* Function called when the mouse starts to drag this sprite. Function is passed these parameters: obj:FlxExtendedSprite, x:int, y:int
		 '* @default null
		 '*/
		Public Field mouseStartDragCallback:FlxExtendedSpriteListerner
		
		'/**
		 '* Function called when the mouse stops dragging this sprite. Function is passed these parameters: obj:FlxExtendedSprite, x:int, y:int
		 '* @default null
		 '*/
		Public Field mouseStopDragCallback:FlxExtendedSpriteListerner
		
		'/**
		 '* An FlxRect region of the game world within which the sprite is restricted during mouse drag
		 '* @default null
		 '*/
		Public Field boundsRect:FlxRect = Null
		
		'/**
		 '* An FlxSprite the bounds of which this sprite is restricted during mouse drag
		 '* @default null
		 '*/
		Public Field boundsSprite:FlxSprite = Null
		
		Private Field _snapOnDrag:Bool = False
		Private Field _snapOnRelease:Bool = False
		Private Field _snapX:Int
		Private Field _snapY:Int
		
		'/**
		 '* Is this sprite using a mouse spring?
		 '* @default false
		 '*/
		Public Field hasMouseSpring:Bool = False
		
		'/**
		 '* Will the Mouse Spring be active always (false) or only when pressed (true)
		 '* @default true
		 '*/
		Public Field springOnPressed:Bool = True
		
		'/**
		 '* The MouseSpring object which is used to tie this sprite to the mouse
		 '*/
		Public Field mouseSpring:MouseSpring
		
		'/**
		 '* By default the spring attaches to the top left of the sprite. To change this location provide an x offset (in pixels)
		 '*/
		Public Field springOffsetX:Int
		
		'/**
		 '* By default the spring attaches to the top left of the sprite. To change this location provide a y offset (in pixels)
		 '*/
		Public Field springOffsetY:Int
		
		'/**
		 '* Creates a white 8x8 square <code>FlxExtendedSprite</code> at the specified position.
		 '* Optionally can load a simple, one-frame graphic instead.
		 '* 
		 '* @param	X				The initial X position of the sprite.
		 '* @param	Y				The initial Y position of the sprite.
		 '* @param	SimpleGraphic	The graphic you want to display (OPTIONAL - for simple stuff only, do NOT use for animated images!).
		 '*/
		Method New(X:Float = 0, Y:Float = 0, SimpleGraphic:String = "")
			Super.New(X, Y, SimpleGraphic)
		End Method
		
		'/**
		 '* Allow this Sprite to receive mouse clicks, the total Float of times this sprite is clicked is stored in this.clicks<br>
		 '* You can add callbacks via mousePressedCallback and mouseReleasedCallback
		 '* 
		 '* @param	onRelease			Register the click when the mouse is pressed down (false) or when it's released (true). Note that callbacks still fire regardless of this setting.
		 '* @param	pixelPerfect		If true it will use a pixel perfect test to see if you clicked the Sprite. False uses the bounding box.
		 '* @param	alphaThreshold		If using pixel perfect collision this specifies the alpha level from 0 to 255 above which a collision is processed (default 255)
		 '*/
		Method EnableMouseClicks:Void(onRelease:Bool, pixelPerfect:Bool = False, alphaThreshold:Int = 255)
			If (FlxG.GetPlugin(reflection.GetClass("FlxMouseControl")) = Null) Then
				Error("FlxExtendedSprite.EnableMouseClicks called but FlxMouseControl plugin not activated")
			Endif
			
			clickable = True
			
			_clickOnRelease = onRelease
			_clickPixelPerfect = pixelPerfect
			_clickPixelPerfectAlpha = alphaThreshold
			_clickCounter = 0
		End Method
		
		'/**
		 '* Stops this sprite from checking for mouse clicks and clears any set callbacks
		 '*/
		Method DisableMouseClicks:Void()
			clickable = False
			mousePressedCallback = Null
			mouseReleasedCallback = Null
		End Method
		
		'/**
		 '* Returns the Float of times this sprite has been clicked (can be reset by setting clicks to zero)
		 '*/
		Method Clicks:Int() Property
			Return _clickCounter
		End Method
		
		'/**
		 '* Sets the Float of clicks this item has received. Usually you'd only set it to zero.
		 '*/
		Method Clicks:Void(i:Int) Property
			_clickCounter = i
		End Method
		
		'/**
		 '* Make this Sprite draggable by the mouse. You can also optionally set mouseStartDragCallback and mouseStopDragCallback
		 '* 
		 '* @param	lockCenter			If false the Sprite will drag from where you click it. If true it will center itself to the tip of the mouse pointer.
		 '* @param	pixelPerfect		If true it will use a pixel perfect test to see if you clicked the Sprite. False uses the bounding box.
		 '* @param	alphaThreshold		If using pixel perfect collision this specifies the alpha level from 0 to 255 above which a collision is processed (default 255)
		 '* @param	boundsRect			If you want to restrict the drag of this sprite to a specific FlxRect, pass the FlxRect here, otherwise it's free to drag anywhere
		 '* @param	boundsSprite		If you want to restrict the drag of this sprite to within the bounding box of another sprite, pass it here
		 '*/
		Method EnableMouseDrag:Void(lockCenter:Bool = False, pixelPerfect:Bool = False, alphaThreshold:Int = 255, boundsRect:FlxRect = Null, boundsSprite:FlxSprite = Null)
			If (FlxG.GetPlugin(reflection.GetClass("FlxMouseControl")) = Null) Then
				Error("FlxExtendedSprite.EnableMouseDrag called but FlxMouseControl plugin not activated")
			Endif
			
			draggable = True
			
			_dragFromPoint = lockCenter
			_dragPixelPerfect = pixelPerfect
			_dragPixelPerfectAlpha = alphaThreshold
			
			If (boundsRect) Then
				Self.boundsRect = boundsRect
			Endif
			
			If (boundsSprite) Then
				Self.boundsSprite = boundsSprite
			Endif
		End Method
		
		'/**
		 '* Stops this sprite from being able to be dragged. If it is currently the target of an active drag it will be stopped immediately. Also disables any set callbacks.
		 '*/
		Method DisableMouseDrag:Void()
			If (isDragged) Then
				FlxMouseControl.dragTarget = Null
				FlxMouseControl.isDragging = False
			Endif
			
			isDragged = False
			draggable = False
			
			mouseStartDragCallback = Null
			mouseStopDragCallback = Null
		End Method
		 
		'/**
		'* Restricts this sprite to drag movement only on the given axis. Note: If both are set to false the sprite will never move!
		 '* 
		 '* @param	allowHorizontal		To enable the sprite to be dragged horizontally set to true, otherwise false
		 '* @param	allowVertical		To enable the sprite to be dragged vertically set to true, otherwise false
		 '*/
		Method SetDragLock:Void(allowHorizontal:Bool = True, allowVertical:Bool = True)
			_allowHorizontalDrag = allowHorizontal
			_allowVerticalDrag = allowVertical
		End Method
		
		'/**
		 '* Make this Sprite throwable by the mouse. The sprite is thrown only when the mouse button is released.
		 '* 
		 '* @param	xFactor		The sprites velocity is set to FlxMouseControl.speedX '* xFactor. Try a value around 50+
		 '* @param	yFactor		The sprites velocity is set to FlxMouseControl.speedY '* yFactor. Try a value around 50+
		 '*/
		Method EnableMouseThrow:Void(xFactor:Int, yFactor:Int)
			If (FlxG.GetPlugin(reflection.GetClass("FlxMouseControl")) = Null) Then
				Error("FlxExtendedSprite.EnableMouseThrow called but FlxMouseControl plugin not activated")
			Endif
			
			isThrowable = True
			_throwXFactor = xFactor
			_throwYFactor = yFactor
			
			If (clickable = False And draggable = False) Then
				clickable = True
			Endif
		End Method
		
		'/**
		 '* Stops this sprite from being able to be thrown. If it currently has velocity this is NOT removed from it.
		 '*/
		Method DisableMouseThrow:Void()
			isThrowable = False
		End Method
		
		'/**
		 '* Make this Sprite snap to the given grid either during drag or when it's released.
		 '* For example 16x16 as the snapX and snapY would make the sprite snap to every 16 pixels.
		 '* 
		 '* @param	snapX		The width of the grid cell in pixels
		 '* @param	snapY		The height of the grid cell in pixels
		 '* @param	onDrag		If true the sprite will snap to the grid while being dragged
		 '* @param	onRelease	If true the sprite will snap to the grid when released
		 '*/
		Method EnableMouseSnap:Void(snapX:Int, snapY:Int, onDrag:Bool = True, onRelease:Bool = False)
			_snapOnDrag = onDrag
			_snapOnRelease = onRelease
			_snapX = snapX
			_snapY = snapY
		End Method
		
		'/**
		 '* Stops the sprite from snapping to a grid during drag or release.
		 '*/
		Method DisableMouseSnap:Void()
			_snapOnDrag = False
			_snapOnRelease = False
		End Method
		
		'/**
		 '* Adds a simple spring between the mouse and this Sprite. The spring can be activated either when the mouse is pressed (default), or enabled all the time.
		 '* Note that nearly always the Spring will over-ride any other motion setting the sprite has (like velocity or gravity)
		 '* 
		 '* @param	onPressed			true if the spring should only be active when the mouse is pressed down on this sprite
		 '* @param	retainVelocity		true to retain the velocity of the spring when the mouse is released, or false to clear it
		 '* @param	tension				The tension of the spring, smaller Floats create springs closer to the mouse pointer
		 '* @param	friction			The friction applied to the spring as it moves
		 '* @param	gravity				The gravity controls how far "down" the spring hangs (use a negative value for it to hang up!)
		 '* 
		 '* @return	The MouseSpring object if you wish to perform further chaining on it. Also available via FlxExtendedSprite.mouseSpring
		 '*/ 
		Method EnableMouseSpring:MouseSpring(onPressed:Bool = True, retainVelocity:Bool = False, tension:Float = 0.1, friction:Float = 0.95, gravity:Float = 0)
			If (FlxG.GetPlugin(reflection.GetClass("FlxMouseControl")) = Null) Then
				Error("FlxExtendedSprite.EnableMouseSpring called but FlxMouseControl plugin not activated")
			Endif
			
			hasMouseSpring = True
			springOnPressed = onPressed
			
			If (mouseSpring = Null) Then
				mouseSpring = New MouseSpring(Self, retainVelocity, tension, friction, gravity)
			Else
				mouseSpring.tension = tension
				mouseSpring.friction = friction
				mouseSpring.gravity = gravity
			Endif
			
			If (clickable = False And draggable = False) Then
				clickable = True
			Endif
			
			Return mouseSpring
		End Method
		
		'/**
		 '* Stops the sprite to mouse spring from being active
		 '*/
		Method DisableMouseSpring:Void()
			hasMouseSpring = False
			
			mouseSpring = Null
		End Method
		
		'/**
		 '* The spring x coordinate in game world space. Consists of sprite.x + springOffsetX
		 '*/
		Method SpringX:Int() Property
			Return x + springOffsetX
		End Method
		
		'/**
		 '* The spring y coordinate in game world space. Consists of sprite.y + springOffsetY
		 '*/
		Method SpringY:Int() Property
			Return y + springOffsetY
		End Method
		
		'/**
		 '* Core update loop
		 '*/
		Method Update:Void()
			If (draggable And isDragged) Then
				UpdateDrag()
			Endif
			
			If (isPressed = False And FlxG.Mouse.JustPressed()) Then
				CheckForClick()
			Endif
			
			If (hasGravity) Then
				UpdateGravity()
			Endif
			
			If (hasMouseSpring) Then
				If (springOnPressed = False)
					mouseSpring.Update()
				Else
					If (isPressed = True) Then
						mouseSpring.Update()
					Else
						mouseSpring.Reset()
					Endif
				Endif
			Endif
			
			Super.Update()
		End Method
		
Private 		
		'/**
		 '* Called by update, applies friction if the sprite has gravity to stop jittery motion when slowing down
		 '*/
		Method UpdateGravity:Void()
			'//	A sprite can have horizontal and/or vertical gravity in each direction (positiive / negative)
			
			'//	First let's check the x movement
			
			If (velocity.x <> 0) Then
				If (acceleration.x < 0) Then
					'//	Gravity is pulling them left
					If (touching & WALL) Then
						drag.y = frictionY
						
						If ((wasTouching & WALL) = False) Then
							If (velocity.x < toleranceX) Then
								'//trace("(left) velocity.x", velocity.x, "stopped via tolerance break", toleranceX)
								velocity.x = 0
							Endif
						Endif
					Else
						drag.y = 0
					Endif
				Else If (acceleration.x > 0) Then
					'//	Gravity is pulling them right
					If (touching & WALL) Then
						'//	Stop them sliding like on ice
						drag.y = frictionY
						
						If ((wasTouching & WALL) = False) Then
							If (velocity.x > -toleranceX) Then
								'//trace("(right) velocity.x", velocity.x, "stopped via tolerance break", toleranceX)
								velocity.x = 0
							Endif
						Endif
					Else
						drag.y = 0
					Endif
				Endif
			Endif
			
			'//	Now check the y movement
			
			If (velocity.y <> 0) Then
				If (acceleration.y < 0) Then
					'//	Gravity is pulling them up (velocity is negative)
					If (touching & CEILING) Then
						drag.x = frictionX
						
						If ((wasTouching & CEILING) = False) Then
							If (velocity.y < toleranceY) Then
								'//trace("(down) velocity.y", velocity.y, "stopped via tolerance break", toleranceY)
								velocity.y = 0
							Endif
						Endif
					Else
						drag.x = 0
					Endif
				Else If (acceleration.y > 0) Then
					'//	Gravity is pulling them down (velocity is positive)
					If (touching & FLOOR) Then
						'//	Stop them sliding like on ice
						drag.x = frictionX
						
						If ((wasTouching & FLOOR) = False) Then
							If (velocity.y > -toleranceY) Then
								'//trace("(down) velocity.y", velocity.y, "stopped via tolerance break", toleranceY)
								velocity.y = 0
							Endif
						Endif
					Else
						drag.x = 0
					Endif
				Endif
			Endif
		End Method
		
		'/**
		 '* Updates the Mouse Drag on this Sprite.
		 '*/
		Method UpdateDrag:Void()
			'//FlxG.mouse.getWorldPosition(null, tempPoint)
			
			If (_allowHorizontalDrag) Then
				x = FlxG.Mouse.x - _dragOffsetX
			Endif
			
			If (_allowVerticalDrag) Then
				y = FlxG.Mouse.y - _dragOffsetY
			Endif
			
			If (boundsRect) Then
				CheckBoundsRect()
			Endif

			If (boundsSprite) Then
				CheckBoundsSprite()
			Endif
			
			If (_snapOnDrag) Then
				x = Floor(x / _snapX) * _snapX
				y = Floor(y / _snapY) * _snapY
			Endif
		End Method
		
		'/**
		 '* Checks if the mouse is over this sprite and pressed, then does a pixel perfect check if needed and adds it to the FlxMouseControl check stack
		 '*/
		Method CheckForClick:Void()
			If (MouseOver And FlxG.Mouse.JustPressed()) Then
				'//	If we don't need a pixel perfect check, then don't bother running one! By this point we know the mouse is over the sprite already
				If (_clickPixelPerfect = False And _dragPixelPerfect = False)
					FlxMouseControl.AddToStack(Self)
					Return
				Endif
				
				If (_clickPixelPerfect And FlxCollision.PixelPerfectPointCheck(FlxG.Mouse.x, FlxG.Mouse.y, Self, _clickPixelPerfectAlpha)) Then
					FlxMouseControl.AddToStack(Self)
					Return
				Endif
				
				If (_dragPixelPerfect And FlxCollision.PixelPerfectPointCheck(FlxG.Mouse.x, FlxG.Mouse.y, Self, _dragPixelPerfectAlpha)) Then
					FlxMouseControl.AddToStack(Self)
					Return
				Endif
			Endif
		End Method

Public		
		'/**
		 '* Called by FlxMouseControl when this sprite is clicked. Should not usually be called directly.
		 '*/
		Method MousePressedHandler:Void()
			isPressed = True
			
			If (clickable And _clickOnRelease = False) Then
				_clickCounter += 1
			Endif
			
			If (mousePressedCallback <> Null) Then
				mousePressedCallback.MousePressed( Self, MouseX, MouseY )
			Endif
		End Method
		
		'/**
		 '* Called by FlxMouseControl when this sprite is released from a click. Should not usually be called directly.
		 '*/
		Method MouseReleasedHandler:Void()
			isPressed = False
			
			If (isDragged) Then
				StopDrag()
			Endif
			
			If (clickable And _clickOnRelease = True) Then
				_clickCounter += 1
			Endif
			
			If (isThrowable) Then
				velocity.x = FlxMouseControl.speedX * _throwXFactor
				velocity.y = FlxMouseControl.speedY * _throwYFactor
			Endif
			
			If (mouseReleasedCallback <> Null) Then
				mouseReleasedCallback.MouseReleased( Self, MouseX, MouseY )
			Endif
		End Method
		
		'/**
		 '* Called by FlxMouseControl when Mouse Drag starts on this Sprite. Should not usually be called directly.
		 '*/
		Method StartDrag:Void()
			isDragged = True
			
			If (_dragFromPoint = False) Then
				_dragOffsetX = FlxG.Mouse.x - x
				_dragOffsetY = FlxG.Mouse.y - y
			Else
				'//	Move the sprite To the middle of the mouse
				_dragOffsetX = frameWidth / 2
				_dragOffsetY = frameHeight / 2
			Endif
		End Method
		
Private		
		'/**
		 '* Bounds Rect check for the sprite drag
		 '*/
		Method CheckBoundsRect:Void()
			If (x < boundsRect.Left) Then
				x = boundsRect.x
			Else If ((x + width) > boundsRect.Right) Then
				x = boundsRect.Right - width
			Endif
			
			If (y < boundsRect.Top) Then
				y = boundsRect.Top
			Else If ((y + height) > boundsRect.Bottom) Then
				y = boundsRect.Bottom - height
			Endif
		End Method
		
		'/**
		 '* Parent Sprite Bounds check for the sprite drag
		 '*/
		Method CheckBoundsSprite:Void()
			If (x < boundsSprite.x) Then
				x = boundsSprite.x
			Else If ((x + width) > (boundsSprite.x + boundsSprite.width)) Then
				x = (boundsSprite.x + boundsSprite.width) - width
			Endif
			
			If (y < boundsSprite.y) Then
				y = boundsSprite.y
			Else If ((y + height) > (boundsSprite.y + boundsSprite.height)) Then
				y = (boundsSprite.y + boundsSprite.height) - height
			Endif
		End Method
		
Public		
		'/**
		 '* Called by FlxMouseControl when Mouse Drag is stopped on this Sprite. Should not usually be called directly.
		 '*/
		Method StopDrag:Void()
			isDragged = False
			
			If (_snapOnRelease) Then
				x = Floor(x / _snapX) * _snapX
				y = Floor(y / _snapY) * _snapY
			Endif
		End Method
		
		'/**
		 '* Gravity can be applied to the sprite, pulling it in any direction. Gravity is given in pixels per second and is applied as acceleration.
		 '* If you don't want gravity for a specific direction pass a value of zero. To cancel it entirely pass both values as zero.
		 '* 
		 '* @param	gravityX	A positive value applies gravity dragging the sprite to the right. A negative value drags the sprite to the left. Zero disables horizontal gravity.
		 '* @param	gravityY	A positive value applies gravity dragging the sprite down. A negative value drags the sprite up. Zero disables vertical gravity.
		 '* @param	frictionX	The amount of friction applied to the sprite if it hits a wall. Allows it to come to a stop without constantly jittering.
		 '* @param	frictionY	The amount of friction applied to the sprite if it hits the floor/roof. Allows it to come to a stop without constantly jittering.
		 '* @param	toleranceX	If the velocity.x of the sprite falls between 0 and +- this value, it is set to stop (velocity.x = 0)
		 '* @param	toleranceY	If the velocity.y of the sprite falls between 0 and +- this value, it is set to stop (velocity.y = 0)
		 '*/
		Method SetGravity:Void(gravityX:Int, gravityY:Int, frictionX:Float = 500, frictionY:Float = 500, toleranceX:Float = 10, toleranceY:Float = 10)
			hasGravity = True
			
			Self.gravityX = gravityX
			Self.gravityY = gravityY
			
			Self.frictionX = frictionX
			Self.frictionY = frictionY
			
			Self.toleranceX = toleranceX
			Self.toleranceY = toleranceY
			
			If (gravityX = 0 And gravityY = 0) Then
				hasGravity = False
			Endif
			
			acceleration.x = gravityX
			acceleration.y = gravityY
		End Method
		
		'/**
		 '* Switches the gravity applied to the sprite. If gravity was +400 Y (pulling them down) this will swap it to -400 Y (pulling them up)<br>
		 '* To reset call flipGravity again
		 '*/
		Method FlipGravity:Void()
			If (gravityX <> 0) Then
				gravityX = -gravityX
				acceleration.x = gravityX
			Endif
			
			If (gravityY <> 0) Then
				gravityY = -gravityY
				acceleration.y = gravityY
			Endif
		End Method
		
		'/**
		 '* Returns an FlxPoint consisting of this sprites world x/y coordinates
		 '*/
		Method Point:FlxPoint() Property
			Return _point
		End Method
		
		Method Point:Void(p:FlxPoint) Property
			_point = p
		End Method
		
		'/**
		 '* Return true if the mouse is over this Sprite, otherwise false. Only takes the Sprites bounding box into consideration and does not check if there 
		 '* are other sprites potentially on-top of this one. Check the value of this.isPressed if you need to know if the mouse is currently clicked on this sprite.
		 '*/
		Method MouseOver:Bool() Property
			Return FlxMath.PointInCoordinates(FlxG.Mouse.x, FlxG.Mouse.y, x, y, width, height)
		End Method
		
		'/**
		 '* Returns how many horizontal pixels the mouse pointer is inside this sprite from the top left corner. Returns -1 if outside.
		 '*/
		Method MouseX:Int() Property
			If (MouseOver) Then
				Return FlxG.Mouse.x - x
			Endif
			
			Return -1
		End Method
		
		'/**
		 '* Returns how many vertical pixels the mouse pointer is inside this sprite from the top left corner. Returns -1 if outside.
		 '*/
		Method MouseY:Int() Property
			If (MouseOver) Then
				Return FlxG.Mouse.y - y
			Endif
			
			Return -1
		End Method
		
		'/**
		 '* Returns an FlxRect consisting of the bounds of this Sprite.
		 '*/
		Method Rect:FlxRect() Property
			_rect.x = x
			_rect.y = y
			_rect.width = width
			_rect.height = height
			
			Return _rect
		End Method
		
End Class

Interface FlxExtendedSpriteListerner
	Method MousePressed:Void (obj:FlxExtendedSprite, x:Int, y:Int)
	Method MouseReleased:Void (obj:FlxExtendedSprite, x:Int, y:Int)
	Method StartDrag:Void (obj:FlxExtendedSprite, x:Int, y:Int)
	Method StopDrag:Void (obj:FlxExtendedSprite, x:Int, y:Int)	
End Interface
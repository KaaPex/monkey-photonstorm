'/**
 '* FlxMouseControl
 '* -- Part of the Flixel Power Tools set
 '* 
 '* v1.2 Added Mouse Zone, Mouse Speed and refactored addToStack process
 '* v1.1 Moved to a native plugin
 '* v1.0 First release
 '* 
 '* @version 1.2 - July 28th 2011
 '* @link http://www.photonstorm.com
 '* @author Richard Davey / Photon Storm
'*/
Strict
Import monkey.list
Import flixel
Import flxmath
Import flxextendedsprite

Class FlxMouseControl Extends FlxBasic
	Global __CLASS__:Object
	'/**
	 '* Use with <code>sort()</code> to sort in ascending order.
	 '*/
	Public Const ASCENDING:Int = -1
	
	'/**
	 '* Use with <code>sort()</code> to sort in descending order.
	 '*/
	Public Const DESCENDING:Int = 1
	
	'/**
	 '* The value that the FlxExtendedSprites are sorted by before deciding which is "on-top" for click select
	 '*/
	Global sortIndex:String = "y"
	
	'/**
	 '* The sorting order. If the sortIndex is "y" and the order is ASCENDING then a sprite with a Y value of 200 would be "on-top" of one with a Y value of 100.
	 '*/
	Global sortOrder:Int = ASCENDING
	
	'/**
	 '* Is the mouse currently dragging a sprite? If you have just clicked but NOT yet moved the mouse then this might return false.
	 '*/
	Global isDragging:Bool = False
	
	'/**
	 '* The FlxExtendedSprite that is currently being dragged, If any.
	 '*/
	Global dragTarget:FlxExtendedSprite
	
	'/**
	 '* The FlxExtendedSprite that currently has the mouse button pressed on it
	 '*/
	Global clickTarget:FlxExtendedSprite
	Global clickStack:SortList<FlxExtendedSprite> = New SortList<FlxExtendedSprite>()
	Private Field clickCoords:FlxPoint
	Global hasClickTarget:Bool = False
	
	Private Field oldX:Int
	Private Field oldY:Int

Public	
	'/**
	 '* The speed the mouse is moving on the X axis in pixels per frame
	 '*/
	Global speedX:Int
	
	'/**
	 '* The speed the mouse is moving on the Y axis in pixels per frame
	 '*/
	Global speedY:Int
	
	'/**
	 '* The mouse can be set To only be active within a specific FlxRect region of the game world.
	 '* If outside this FlxRect no clicks, drags or throws will be processed.
	 '* If the mouse leaves this region while still dragging then the sprite is automatically dropped and its release handler is called.
	 '* Set the FlxRect to null to disable the zone.
	 '*/
	Global mouseZone:FlxRect
	
	'/**
	 '* Instead of using a mouseZone (which is calculated in world coordinates) you can limit the mouse to the FlxG.camera.deadzone area instead.
	 '* If set to true the mouse will use the camera deadzone. If false (or the deadzone is null) no check will take place.
	 '* Note that this takes priority over the mouseZone above. If the mouseZone and deadzone are set, the deadzone is used.
	 '*/
	Global linkToDeadZone:Bool = False
	
	'/**
	 '* Adds the given FlxExtendedSprite to the stack of potential sprites that were clicked, the stack is then sorted and the final sprite is selected from that
	 '* 
	 '* @param	item	The FlxExtendedSprite that was clicked by the mouse
	 '*/
	Function AddToStack:Void(item:FlxExtendedSprite)
		If (mouseZone)
			If (FlxMath.PointInFlxRect(FlxG.Mouse.x, FlxG.Mouse.y, mouseZone) = True)
				clickStack.AddLast(item)
			Endif
		Else
			clickStack.AddLast(item)
		Endif
	End Function
	
	'/**
	 '* Main Update Loop - checks mouse status and updates FlxExtendedSprites accordingly
	 '*/
	Method Update:Void()
		'//	Update mouse speed
		speedX = FlxG.Mouse.screenX - oldX
		speedY = FlxG.Mouse.screenY - oldY
		
		oldX = FlxG.Mouse.screenX
		oldY = FlxG.Mouse.screenY
		
		'//	Is the mouse currently pressed down on a target?
		If (hasClickTarget) Then
			If (FlxG.Mouse.Pressed()) Then
				'//	Has the mouse moved? If so then we're candidate for a drag
				If (isDragging = False And clickTarget.draggable And (clickCoords.x <> FlxG.Mouse.x Or clickCoords.y <> FlxG.Mouse.y))
					'//	Drag on
					isDragging = True
					
					dragTarget = clickTarget
					
					dragTarget.StartDrag()
				Endif
			Else
				ReleaseMouse()
			Endif
			
			If (linkToDeadZone) Then
				If (FlxMath.MouseInFlxRect(False, FlxG.Camera.deadzone) = False) Then
					ReleaseMouse()
				Endif
			Else If (FlxMath.MouseInFlxRect(True, mouseZone) = False) Then
				'//	Is a mouse zone enabled? In which case check if we're still in it
				ReleaseMouse()
			Endif
		Else
			'//	No target, but is the mouse down?
			
			If (FlxG.Mouse.JustPressed()) Then
				clickStack.Clear()
			Endif
			
			'//	If you are wondering how the brand new array can have anything in it by now, it's because FlxExtendedSprite
			'//	adds itself to the clickStack
			
			If (FlxG.Mouse.Pressed() And clickStack.Count() > 0) Then
				AssignClickedSprite()
			Endif
		Endif
	End Method

Private	
	'/**
	 '* Internal function used to release the click / drag targets and reset the mouse state
	 '*/
	Method ReleaseMouse:Void()

		'//	Mouse is no longer down, so tell the click target it's free - this will also stop dragging if happening
		clickTarget.MouseReleasedHandler()
		
		hasClickTarget = false
		clickTarget = null
		
		isDragging = false
		dragTarget = null
	End Method
	
	'/**
	 '* Once the clickStack is created this sorts it and then picks the sprite with the highest priority (based on sortIndex and sortOrder)
	 '*/
	Method AssignClickedSprite:Void()
		'//	If there is more than one potential target then sort them
		If (clickStack.Count() > 1)
			clickStack.Sort(sortOrder)
		Endif
		
		clickTarget = clickStack.Last()
		clickStack.RemoveLast()
		
		clickCoords = clickTarget.Point
		
		hasClickTarget = True
		
		clickTarget.MousePressedHandler()
		
		clickStack.Clear()
	End Method	

Public	
	'/**
	 '* Removes all references to any click / drag targets and resets this class
	 '*/
	Function Clear:Void()
		hasClickTarget = False
		
		If (clickTarget) Then
			clickTarget.MouseReleasedHandler()
		Endif
		
		clickTarget = Null
		
		isDragging = False
		
		If (dragTarget) Then
			dragTarget.StopDrag()
		Endif
		
		speedX = 0
		speedY = 0
		dragTarget = Null
		mouseZone = Null
		linkToDeadZone = False
	End Function
	
	'/**
	 '* Runs when this plugin is destroyed
	 '*/
	Method Destroy:Void()
		Clear()
	End Method
	
End Class

Private Class SortList<T> Extends List<T>
	Method Compare:Int( lhs:T,rhs:T )
		Local item1:FlxExtendedSprite = lhs 
		Local item2:FlxExtendedSprite = rhs
		Local value1:Float = UnboxFloat(item1.GetClassInfo().GetField(FlxMouseControl.sortIndex).GetValue(item1))
		Local value2:Float = UnboxFloat(item2.GetClassInfo().GetField(FlxMouseControl.sortIndex).GetValue(item2))

		If (value1 < value2) Then
			Return FlxMouseControl.sortOrder
		Else If (value1 > value2) Then
			Return -FlxMouseControl.sortOrder
		Endif
		
		Return 0
	End Method
End Class
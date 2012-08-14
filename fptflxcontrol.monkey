'/**
 '* FlxControl
 '* -- Part of the Flixel Power Tools set
 '* 
 '* v1.1 Fixed and added documentation
 '* v1.0 First release
 '* 
 '* @version 1.1 - July 21st 2011
 '* @link http://www.photonstorm.com
 '* @author Richard Davey / Photon Storm
 ' Copyright: Monkey port - 2012 Aleksey 'KaaPex' Kazantsev
'*/
Strict
Import monkey.list
Import flixel
Import fptflxcontrolhandler

Class FptFlxControl Extends FlxBasic

Global ClassObject:Object

'//	Quick references
	Global player1:FptFlxControlHandler
	Global player2:FptFlxControlHandler
	Global player3:FptFlxControlHandler
	Global player4:FptFlxControlHandler
	
	'//	Additional control handlers
	Global _members:List<FptFlxControlHandler> = New List<FptFlxControlHandler>()
	
	'/**
	 '* Creates a new FptFlxControlHandler. You can have as many FptFlxControlHandlers as you like, but you usually only have one per player. The first handler you make
	 '* will be assigned to the FlxControl.player1 var. The 2nd to FlxControl.player2 and so on for player3 and player4. Beyond this you need to keep a reference to the
	 '* handler yourself.
	 '* 
	 '* @param	source			The FlxSprite you want this class to control. It can only control one FlxSprite at once.
	 '* @param	movementType	Set to either MOVEMENT_INSTANT or MOVEMENT_ACCELERATES
	 '* @param	stoppingType	Set to STOPPING_INSTANT, STOPPING_DECELERATES or STOPPING_NEVER
	 '* @param	updateFacing	If true it sets the FlxSprite.facing value to the direction pressed (default false)
	 '* @param	enableArrowKeys	If true it will enable all arrow keys (default) - see setCursorControl for more fine-grained control
	 '* 
	 '* @return	The new FptFlxControlHandler
	 '*/
Public 
	Function Create:FptFlxControlHandler(source:FlxSprite, movementType:Int, stoppingType:Int, player:Int = 1, updateFacing:Bool = False, enableArrowKeys:Bool = True)
		Local result:FptFlxControlHandler
		
		If (player = 1) Then
			player1 = New FptFlxControlHandler(source, movementType, stoppingType, updateFacing, enableArrowKeys)
			_members.AddLast(player1)
			result = player1
		Else If (player = 2) Then
			player2 = New FptFlxControlHandler(source, movementType, stoppingType, updateFacing, enableArrowKeys)
			_members.AddLast(player2)
			result = player2
		Else If (player = 3) Then
			player3 = New FptFlxControlHandler(source, movementType, stoppingType, updateFacing, enableArrowKeys)
			_members.AddLast(player3)
			result = player3
		Else If (player = 4) Then
			player4 = New FptFlxControlHandler(source, movementType, stoppingType, updateFacing, enableArrowKeys)
			_members.AddLast(player4)
			result = player4
		Else
			Local newControlHandler:FptFlxControlHandler = New FptFlxControlHandler(source, movementType, stoppingType, updateFacing, enableArrowKeys)
			_members.AddLast(newControlHandler)
			result = newControlHandler
		Endif
		
		Return result
	End Function
	
	'/**
	 '* Removes an FptFlxControlHandler 
	 '* 
	 '* @param	source	The FptFlxControlHandler to delete
	 '* @return	Boolean	true if the FptFlxControlHandler was removed, otherwise false.
	 '*/
	Function Remove:Bool(source:FptFlxControlHandler)
		If (_members.Contains(source)) Then
			_members.RemoveEach(source)			
			Return True
		Endif
		
		Return False
	End Function
	
	'/**
	 '* Removes all FptFlxControlHandlers.<br />
	 '* This is called automatically if this plugin is ever destroyed.
	 '*/
	Function Clear:void()
		_members.Clear()
	End Function
	
	'/**
	 '* Starts updating the given FptFlxControlHandler, enabling keyboard actions for it. If no FptFlxControlHandler is given it starts updating all FptFlxControlHandlers currently added.<br />
	 '* Updating is enabled by default, but this can be used to re-start it if you have stopped it via stop().<br />
	 '* 
	 '* @param	source	The FptFlxControlHandler to start updating on. If left as null it will start updating all handlers.
	 '*/
	Function Start:Void(source:FptFlxControlHandler = Null)
		For Local handler:FptFlxControlHandler = Eachin _members
			If (source And source = handler ) Then				
				handler.enabled = True
				Exit
			Else
				handler.enabled = True
			Endif	
		Next
	End Function
	
	'/**
	 '* Stops updating the given FptFlxControlHandler. If no FptFlxControlHandler is given it stops updating all FptFlxControlHandlers currently added.<br />
	 '* Updating is enabled by default, but this can be used to stop it, for example if you paused your game (see start() to restart it again).<br />
	 '* 
	 '* @param	source	The FptFlxControlHandler to stop updating. If left as null it will stop updating all handlers.
	 '*/
	Function Stop:void(source:FptFlxControlHandler = null)
		For Local handler:FptFlxControlHandler = Eachin _members
			If (source And source = handler ) Then				
				handler.enabled = False
				Exit
			Else
				handler.enabled = False
			Endif	
		Next
	End Function
	
	'/**
	 '* Runs update on all currently active FptFlxControlHandlers
	 '*/
	Method Draw:void()
		For Local handler:FptFlxControlHandler = Eachin _members
			If (handler.enabled = True) Then
				handler.Update()
			Endif
		Next
	End Method
	
	'/**
	 '* Runs when this plugin is destroyed
	 '*/
	Method Destroy:Void()
		Clear()
	End Method
		
End Class


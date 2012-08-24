'/**
 '* FlxDelay
 '* -- Part of the Flixel Power Tools set
 '* 
 '* v1.4 Modified abort so it no longer runs the stop callback (thanks to Cambrian-Man)
 '* v1.3 Added secondsElapsed and secondsRemaining and some more documentation
 '* v1.2 Added callback support
 '* v1.1 Updated for the Flixel 2.5 Plugin system
 '* 
 '* @version 1.4 - July 31st 2011
 '* @link http://www.photonstorm.com
 '* @author Richard Davey / Photon Storm
 '* Copyright: Monkey port - 2012 Aleksey 'KaaPex' Kazantsev 
'*/
	
Import flixel

'/**
 '* A useful timer that can be used to trigger events after certain amounts of time are up.
 '* Uses getTimer so is low on resources and avoids using Flash events.
 '* Also takes into consideration the Pause state of your game.
 '* If your game pauses, when it starts again the timer notices and adjusts the _expires time accordingly.
 '*/

Class FlxDelay Extends FlxBasic

	'/**
	 '* true if the timer is currently running, otherwise false
	 '*/
	Field isRunning:Bool
	
	'/**
	 '* If you wish to call a function once the timer _completes, set it here
	 '*/
	Field callback:FlxDelayCallback
	
	'/**
	 '* The duration of the Delay in milliseconds
	 '*/
	Field duration:Int
	
Private 
	Field _started:Int
	Field _expires:Int
	Field _pause_started:Int
	Field _pausedTimerRunning:Bool
	Field _complete:Bool
	
	'/**
	 '* Create a new timer which will run for the given amount of ms (1000 = 1 second real time)
	 '* 
	 '* @param	runFor	The duration of this timer in ms. Call start() to set it going.
	 '*/
	Method New(runFor:Int)
		duration = runFor
	End Method
	
	'/**
	 '* Starts the timer running
	 '*/
	Method Start:Void()
		_started = Millisecs()
		_expires = _started + duration
		isRunning = true
		_complete = false
		
		_pause_started = 0
		_pausedTimerRunning = false

	End Method
	
	'/**
	 '* Has the timer finished?
	 '*/
	Method HasExpired:Bool() Property
		return _complete
	End Method
	
	'/**
	 '* Restart the timer using the new duration
	 '* 
	 '* @param	newDuration	The duration of this timer in ms.
	 '*/
	Method Reset:Void(newDuration:Int)
		duration = newDuration
		
		Start()
	End Method
	
	'/**
	 '* The amount of seconds that have elapsed since the timer was _started
	 '*/
	Method SecondsElapsed:Int() Property
		Return Int((Millisecs() - _started) / 1000)
	End Method
	
	'/**
	 '* The amount of seconds that are remaining until the timer _completes
	 '*/
	Method SecondsRemaining:Int() Property
		Return Int((_expires - Millisecs()) / 1000)
	End Method
	
	'/**
	 '* Abors a currently active timer without firing any callbacks (if set)
	 '*/
	Method Abort:Void()
		Stop(False)
	End Method
	
Private
	Method Update:Void()
		'//	Has the game been paused?
		If (_pausedTimerRunning = True And FlxG.Paused = False) Then
			_pausedTimerRunning = False
			
			'//	Add the time the game was paused for onto the _expires timer
			_expires += (Millisecs() - _pause_started)
		Else If (FlxG.Paused = True And _pausedTimerRunning = False) Then
			_pause_started = Millisecs()
			_pausedTimerRunning = True
		Endif

		If (isRunning And _pausedTimerRunning = False And Millisecs() > _expires) Then
			Stop()
		Endif
	End Method

	Method Stop:Void(runCallback:Bool = True)
		
		isRunning = false
		_complete = true
		
		If (callback And runCallback = True)
			callback.Call()
		Endif
		
	End Method
		
End Class

Interface FlxDelayCallback
	Method Call:Void()
End Interface
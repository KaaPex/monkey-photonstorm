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
Import monkey.math
Import monkey.list
Import flixel.flxrect
Import flixel.flxg

Class FlxMath

	Const RAND_MAX:Int = 999999999
	Const RADTODEG:Float = 180 / PI
	Const DEGTORAD:Float = PI / 180
	
Private
	 Field _mr:Int = 0
	 Field _cosTable:Float[]
	 Field _sinTable:Float[]
	 Const coefficient1:Float = PI / 4
Public	 

	'/**
	 '* Returns true if the given x/y coordinate is within the given rectangular block
	 '* 
	 '* @param	pointX		The X value to test
	 '* @param	pointY		The Y value to test
	 '* @param	rectX		The X value of the region to test within
	 '* @param	rectY		The Y value of the region to test within
	 '* @param	rectWidth	The width of the region to test within
	 '* @param	rectHeight	The height of the region to test within
	 '* 
	 '* @return	true if pointX/pointY is within the region, otherwise false
	 '*/
	Function PointInCoordinates:Bool(pointX:Int, pointY:Int, rectX:Int, rectY:Int, rectWidth:Int, rectHeight:Int)
		If (pointX >= rectX And pointX <= (rectX + rectWidth)) Then
			If (pointY >= rectY And pointY <= (rectY + rectHeight)) Then
				Return True
			Endif
		Endif
		
		Return False
	End Function
	
	'/**
	 '* Returns true if the given x/y coordinate is within the given rectangular block
	 '* 
	 '* @param	pointX		The X value to test
	 '* @param	pointY		The Y value to test
	 '* @param	rect		The FlxRect to test within
	 '* @return	true if pointX/pointY is within the FlxRect, otherwise false
	 '*/
	Function PointInFlxRect:Bool(pointX:Int, pointY:Int, rect:FlxRect)
		If (pointX >= rect.x And pointX <= rect.Right And pointY >= rect.y And pointY <= rect.Bottom)
			Return True
		Endif
		
		Return False
	End Function
	
	'/**
	 '* Returns true if the mouse world x/y coordinate are within the given rectangular block
	 '* 
	 '* @param	useWorldCoords	If true the world x/y coordinates of the mouse will be used, otherwise screen x/y
	 '* @param	rect			The FlxRect to test within. If this is null for any reason this function always returns true.
	 '* 
	 '* @return	true if mouse is within the FlxRect, otherwise false
	 '*/
	Function MouseInFlxRect:Bool(useWorldCoords:Bool, rect:FlxRect)
		If (rect = Null) Then
			Return True
		Endif
		
		If (useWorldCoords) Then
			Return PointInFlxRect(FlxG.Mouse.x, FlxG.Mouse.y, rect)
		Else
			Return PointInFlxRect(FlxG.Mouse.screenX, FlxG.Mouse.screenY, rect)
		Endif
	End Function
	
	'/**
	 '* Returns True If the given x/y coordinate is within the Rectangle
	 '* 
	 '* @param	pointX		The X value to test
	 '* @param	pointY		The Y value to test
	 '* @param	rect		The Rectangle to test within
	 '* @return	true if pointX/pointY is within the Rectangle, otherwise false
	 '*/
	Function PointInRectangle:Bool(pointX:Int, pointY:Int, rect:FlxRect)
		If (pointX >= rect.x and pointX <= rect.Right and pointY >= rect.y and pointY <= rect.Bottom)
			Return True
		Endif
		
		Return False
	End Function
	
	'/**
	 '* A faster (but much less accurate) version of Math.atan2(). For close range / loose comparisons this works very well, 
	 '* but avoid for long-distance or high accuracy simulations.
	 '* Based on: http://blog.gamingyourway.com/PermaLink,guid,78341247-3344-4a7a-acb2-c742742edbb1.aspx
	 '* <p>
	 '* Computes and returns the angle of the point y/x in radians, when measured counterclockwise from a circle's x axis 
	 '* (where 0,0 represents the center of the circle). The return value is between positive pi and negative pi. 
	 '* Note that the first parameter to atan2 is always the y coordinate.
	 '* </p>
	 '* @param y The y coordinate of the point
	 '* @param x The x coordinate of the point
	 '* @return The angle of the point x/y in radians
	 '*/
	Function Atan2:Float(y:Float, x:Float)
		Local absY:Float = Abs(y)
		Local coefficient2:Float = 3 * coefficient1
		Local r:Float
		Local angle:Float		

		If (x >= 0) Then
			r = (x - absY) / (x + absY)
			angle = coefficient1 - coefficient1 * r
		Else
			r = (x + absY) / (absY - x)
			angle = coefficient2 - coefficient1 * r
		Endif
    
    	If ( y < 0 ) Then
    		Return -angle
    	Else	
			Return angle
		Endif	
	End Function
	
	'/**
	 '* Generate a sine and cosine table simultaneously and extremely quickly. Based on research by Franky of scene.at
	 '* <p>
	 '* The parameters allow you to specify the length, amplitude and frequency of the wave. Once you have called this function
	 '* you should get the results via getSinTable() and getCosTable(). This generator is fast enough to be used in real-time.
	 '* </p>
	 '* @param length 		The length of the wave
	 '* @param sinAmplitude 	The amplitude to apply to the sine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
	 '* @param cosAmplitude 	The amplitude to apply to the cosine table (default 1.0) if you need values between say -+ 125 then give 125 as the value
	 '* @param frequency 	The frequency of the sine and cosine table data
	 '* @return	Returns the sine table
	 '* @see getSinTable
	 '* @see getCosTable
	 '*/
	Method SinCosGenerator:Float[](length:Int, sinAmplitude:Float = 1.0, cosAmplitude:Float = 1.0, frequency:Float = 1.0)

		Local sin:Float = sinAmplitude;
		Local cos:Float = cosAmplitude;
		Local frq:Float = frequency * PI / length
		
		_cosTable = New Float[length]
		_sinTable = New Float[length]
		
		For Local c:Int = 0 Until length
			cos -= sin * frq
			sin += cos * frq
			
			_cosTable[c] = cos
			_sinTable[c] = sin
		Next
		
		Return _sinTable
	End Method
	
	'/**
	 '* Returns the sine table generated by sinCosGenerator(), or an empty array object if not yet populated
	 '* @return Array of sine wave data
	 '* @see sinCosGenerator
	 '*/
	Method GetSinTable:Float[]()
		Return _sinTable
	End Method
	
	'/**
	 '* Returns the cosine table generated by sinCosGenerator(), or an empty array object if not yet populated
	 '* @return Array of cosine wave data
	 '* @see sinCosGenerator
	 '*/
	Method GetCosTable:Float[]()
		Return _cosTable
	End Method
	
	'/**
	 '* A faster version of Math.sqrt
	 '* <p>
	 '* Computes and returns the square root of the specified number.
	 '* </p>
	 '* @link http://osflash.org/as3_speed_optimizations#as3_speed_tests
	 '* @param val A number greater than or equal to 0
	 '* @return If the parameter val is greater than or equal to zero, a number; otherwise NaN (not a number).
	 '*/
	 #rem
	 '//TO-DO :)
	Function Sqrt:Float(val:Float = 0)
		
		Local thresh:Float = 0.002
		Local b:Float = val * 0.25
		Local a:Float = 0
		Local c:Float
		
		If (val = 0) Then
			Return 0
		Endif		
		
		While (a > thresh)
			c = val / b
			b = (b + c) * 0.5
			a = b - c
			If (a < 0) Then
				a = -a
			Endif	
		Wend
		
		Return b
	End Function
		#end
	'/**
	 '* Generates a small random number between 0 and 65535 very quickly
	 '* <p>
	 '* Generates a small random number between 0 and 65535 using an extremely fast cyclical generator, 
	 '* with an even spread of numbers. After the 65536th call to this function the value resets.
	 '* </p>
	 '* @return A pseudo random value between 0 and 65536 inclusive.
	 '*/
	Method MiniRand:Int()

		Local result:Int = _mr
		
		result += 1
		result *= 75
		result Mod= 65537
		result -= 1
		
		_mr += 1
		
		If (_mr = 65536) Then
			_mr = 0
		Endif
		
		Return result
	End Method

	'/**
	 '* Generate a random integer
	 '* <p>
	 '* If called without the optional min, max arguments rand() returns a peudo-random integer between 0 and getrandmax().
	 '* If you want a random number between 5 and 15, for example, (inclusive) use rand(5, 15)
	 '* Parameter order is insignificant, the return will always be between the lowest and highest value.
	 '* </p>
	 '* @param min The lowest value to return (default: 0)
	 '* @param max The highest value to return (default: getrandmax)
	 '* @param excludes An Array of integers that will NOT be returned (default: null)
	 '* @return A pseudo-random value between min (or 0) and max (or getrandmax, inclusive)
	 '*/
	Function Rand:Int(min:Float = 0.0, max:Float = RAND_MAX , excludes:Int[] = [])
		
		If (min = max) Then
			Return min
		Endif
		
		If (excludes.Length() > 0) Then
			Local exl:IntList = New IntList ()
			For Local i:Int = Eachin excludes
				exl.AddLast(i)
			Next
			 
			Local result:Int
			
			While (Not exl.Contains(result))
				If (min < max)
					result = min + (Rnd() * (max - min))
				Else
					result = max + (Rnd() * (min - max))
				Endif
			Wend		
			
			Return result
		Else
			'//	Reverse check
			If (min < max) Then
				Return min + (Rnd() * (max - min))
			Else
				Return max + (Rnd() * (min - max))
			Endif
		Endif
	End Function
	
	'/**
	 '* Generate a random float (number)
	 '* <p>
	 '* If called without the optional min, max arguments rand() returns a peudo-random float between 0 and getrandmax().
	 '* If you want a random number between 5 and 15, for example, (inclusive) use rand(5, 15)
	 '* Parameter order is insignificant, the return will always be between the lowest and highest value.
	 '* </p>
	 '* @param min The lowest value to return (default: 0)
	 '* @param max The highest value to return (default: getrandmax)
	 '* @return A pseudo random value between min (or 0) and max (or getrandmax, inclusive)
	 '*/
	Function RandFloat:Float(min:Float = 0, max:Float = RAND_MAX)
		If (min = max) Then
			Return min
		Else If (min < max)
			Return min + (Rnd() * (max - min + 1))
		Else
			Return max + (Rnd() * (min - max + 1))
		endif
	End Function
	
	'/**
	 '* Generate a random boolean result based on the chance value
	 '* <p>
	 '* Returns true or false based on the chance value (default 50%). For example if you wanted a player to have a 30% chance
	 '* of getting a bonus, call chanceRoll(30) - true means the chance passed, false means it failed.
	 '* </p>
	 '* @param chance The chance of receiving the value. Should be given as a uint between 0 and 100 (effectively 0% to 100%)
	 '* @return true if the roll passed, or false
	 '*/
	Function ChanceRoll:Bool(chance:Int = 50)
		If (chance <= 0) Then
			Return False
		Else If (chance >= 100) Then
			Return True
		Else
			If (Rnd() * 100 >= chance) Then
				Return False
			Else
				Return True
			Endif
		Endif
	End Function
	
	'/**
	 '* Adds the given amount to the value, but never lets the value go over the specified maximum
	 '* 
	 '* @param value The value to add the amount to
	 '* @param amount The amount to add to the value
	 '* @param max The maximum the value is allowed to be
	 '* @return The new value
	 '*/
	Function MaxAdd:Int(value:Int, amount:Int, max:Int)
		value += amount
		
		If (value > max) Then
			value = max
		Endif
		
		Return value
	End Function
	
	'/**
	 '* Adds value to amount and ensures that the result always stays between 0 and max, by wrapping the value around.
	 '* <p>Values must be positive integers, and are passed through Math.abs</p>
	 '* 
	 '* @param value The value to add the amount to
	 '* @param amount The amount to add to the value
	 '* @param max The maximum the value is allowed to be
	 '* @return The wrapped value
	 '*/
	Function WrapValue:Int(value:Int, amount:Int, max:Int)
		Local diff:Int

		value = Abs(value)
		amount = Abs(amount)
		max = Abs(max)
		
		diff = (value + amount) Mod max
		
		Return diff
	End Function
	
	'/**
	 '* Finds the length of the given vector
	 '* 
	 '* @param	dx
	 '* @param	dy
	 '* 
	 '* @return
	 '*/
	Function VectorLength:Float(dx:Float, dy:Float)
    	Return Sqrt(dx * dx + dy * dy)
	End Function
	
	'/**
	 '* Finds the dot product value of two vectors
	 '* 
	 '* @param	ax		Vector X
	 '* @param	ay		Vector Y
	 '* @param	bx		Vector X
	 '* @param	by		Vector Y
	 '* 
	 '* @return	Dot product
	 '*/
	Function DotProduct:Float(ax:Float, ay:Float, bx:Float, by:Float)
		Return ax * bx + ay * by
	End Function
    
	'/**
	 '* Randomly returns either a 1 or -1
	 '* 
	 '* @return	1 or -1
	 '*/
	Function RandomSign:Float()
		Local r:Float = Rnd()
		If (r > 0.5) Then
			Return 1
		Else
			Return -1
		Endif	
	End Function
	
	'/**
	 '* Returns true if the number given is odd.
	 '* 
	 '* @param	n	The number to check
	 '* 
	 '* @return	True if the given number is odd. False if the given number is even.
	 '*/
	Function IsOdd:Bool(n:Float)
		If (n & 1) Then
			Return True
		Else
			Return False
		Endif
	End Function
		
	
	'/**
	 '* Returns true if the number given is even.
	 '* 
	 '* @param	n	The number to check
	 '* 
	 '* @return	True if the given number is even. False if the given number is odd.
	 '*/
	Function IsEven:Bool(n:Float)
		if (n & 1)
			Return False
		Else
			Return True
		Endif
	End Function

	'/**
	 '* Keeps an angle value between -180 and +180<br>
	 '* Should be called whenever the angle is updated on the FlxSprite to stop it from going insane.
	 '* 
	 '* @param	angle	The angle value to check
	 '* 
	 '* @return	The new angle value, returns the same as the input angle if it was within bounds
	 '*/
	Function WrapAngle:Int(angle:Float)
		Local result:Int = Int(angle)
		
		If (angle > 180) Then
			result = -180
		Else If (angle < -180) Then
			result = 180
		Endif
		
		Return result
	End Function
	
	'/**
	 '* Keeps an angle value between the given min and max values
	 '* 
	 '* @param	angle	The angle value to check. Must be between -180 and +180
	 '* @param	min		The minimum angle that is allowed (must be -180 or greater)
	 '* @param	max		The maximum angle that is allowed (must be 180 or less)
	 '* 
	 '* @return	The new angle value, returns the same as the input angle if it was within bounds
	 '*/
	Function AngleLimit:Int(angle:Int, min:Int, max:Int)
		Local result:Int = angle
		
		If (angle > max) Then
			result = max
		Else If (angle < min) Then
			result = min
		Endif
		
		Return result
	End Function
	
	'/**
	 '* Converts a Radian value into a Degree
	 '* <p>
	 '* Converts the radians value into degrees and returns
	 '* </p>
	 '* @param radians The value in radians
	 '* @return Number Degrees
	 '*/
	Function AsDegrees:Float(radians:Float)
		Return radians * RADTODEG
	End Function

	'/**
	 '* Converts a Degrees value into a Radian
	 '* <p>
	 '* Converts the degrees value into radians and returns
	 '* </p>
	 '* @param degrees The value in degrees
	 '* @return Number Radians
	 '*/
	Function AsRadians:Float(degrees:Float)
		Return degrees * DEGTORAD
	End Function	
End Class
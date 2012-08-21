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
Import flixel.flxg
Import flxmath

Class FlxExtendedColor Extends FlxColor

	'/**
	 '* Get HSV color wheel values in an array which will be 360 elements in size
	 '* 
	 '* @param	alpha	Alpha value for each color of the color wheel, between 0 (transparent) and 255 (opaque)
	 '* 
	 '* @return	Array
	 '*/
	Function GetHSVColorWheel:Int[](alpha:Int = 255)
		Local colors:Int[359]
		
		For Local c:Int = 0 Until 359
			colors[c] = HSVtoRGB(c, 1.0, 1.0, alpha)
		Next
		
		Return colors
	End Function
	
	'/**
	 '* Returns a Complementary Color Harmony for the given color.
	 '* <p>A complementary hue is one directly opposite the color given on the color wheel</p>
	 '* <p>Value returned in 0xAARRGGBB format with Alpha set to 255.</p>
	 '* 
	 '* @param	color The color to base the harmony on
	 '* 
	 '* @return 0xAARRGGBB format color value
	 '*/
	Function GetComplementHarmony:Int(color:Int)
		Local hsv:HSV = RGBtoHSV(color)
		
		Local opposite:Int = FlxMath.WrapValue(hsv.hue, 180, 359)
		
		Return HSVtoRGB(opposite, 1.0, 1.0)
	End Function

	'/**
	 '* Returns an Analogous Color Harmony for the given color.
	 '* <p>An Analogous harmony are hues adjacent to each other on the color wheel</p>
	 '* <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
	 '* 
	 '* @param	color The color to base the harmony on
	 '* @param	threshold Control how adjacent the colors will be (default +- 30 degrees)
	 '* 
	 '* @return 	Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
	 '*/
	Function GetAnalogousHarmony:Harmony(color:Int, threshold:Int = 30)
	
		Local hsv:HSV = RGBtoHSV(color)
		
		If (threshold > 359 Or threshold < 0) Then
			FlxG.Log("FlxColor Warning: Invalid threshold given to GetAnalogousHarmony()")
			Return Null
		Endif
		
		Local h:Harmony = New Harmony()
		h.hue1 = hsv.hue
		h.hue2 = FlxMath.WrapValue(hsv.hue, 359 - threshold, 359)
		h.hue3 = FlxMath.WrapValue(hsv.hue, threshold, 359)
		
		h.color1 = color
		h.color2 = HSVtoRGB(h.hue2, 1.0, 1.0)
		h.color3 = HSVtoRGB(h.hue3, 1.0, 1.0)
		
		Return h
	End Function
	
	'/**
	 '* Returns an Split Complement Color Harmony for the given color.
	 '* <p>A Split Complement harmony are the two hues on either side of the color's Complement</p>
	 '* <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
	 '* 
	 '* @param	color The color to base the harmony on
	 '* @param	threshold Control how adjacent the colors will be to the Complement (default +- 30 degrees)
	 '* 
	 '* @return 	Object containing 3 properties: color1 (the original color), color2 (the warmer analogous color) and color3 (the colder analogous color)
	 '*/
	Function GetSplitComplementHarmony:Harmony(color:Int, threshold:Int = 30)
		Local hsv:HSV = RGBtoHSV(color)
		
		If (threshold >= 359 Or threshold <= 0) Then 
			FlxG.Log("FlxColor Warning: Invalid threshold given to GetSplitComplementHarmony()");
			Return Null
		Endif
		
		Local opposite:Int = FlxMath.WrapValue(hsv.hue, 180, 359)
		
		Local h:Harmony = New Harmony()
		h.hue1 = hsv.hue
		h.hue2 = FlxMath.WrapValue(hsv.hue, opposite - threshold, 359)
		h.hue3 = FlxMath.WrapValue(hsv.hue, opposite + threshold, 359)
		
		h.color1 = color
		h.color2 = HSVtoRGB(h.hue2, hsv.saturation, hsv.value)
		h.color3 = HSVtoRGB(h.hue3, hsv.saturation, hsv.value)
		
		'FlxG.log("hue: " + hsv.hue + " opposite: " + opposite + " warmer: " + h.rhue + " colder: " + h.colderhue);
		
		Return h		
	End Function
	
	'/**
	 '* Returns a Triadic Color Harmony for the given color.
	 '* <p>A Triadic harmony are 3 hues equidistant from each other on the color wheel</p>
	 '* <p>Values returned in 0xAARRGGBB format with Alpha set to 255.</p>
	 '* 
	 '* @param	color The color to base the harmony on
	 '* 
	 '* @return 	Object containing 3 properties: color1 (the original color), color2 and color3 (the equidistant colors)
	 '*/
	Function GetTriadicHarmony:Harmony(color:Int)
		Local hsv:HSV = RGBtoHSV(color)
		
		Local triadic1:Int = FlxMath.WrapValue(hsv.hue, 120, 359)
		Local triadic2:Int = FlxMath.WrapValue(triadic1, 120, 359)
		
		Local h:Harmony = New Harmony()
		
		h.color1 = color
		h.color2 = HSVtoRGB(triadic1, 1.0, 1.0)
		h.color3 = HSVtoRGB(triadic2, 1.0, 1.0)
		
		Return h
	End Function
	
	
	'/**
	 '* Returns a String containing handy information about the given color including String hex value,
	 '* RGB format information and HSL information. Each section starts on a newline, 3 lines in total.
	 '* 
	 '* @param	color A color value in the format 0xAARRGGBB
	 '* 
	 '* @return	String containing the 3 lines of information
	 '*/
	Function GetColorInfo:String(color:Int)
		Local argb:FlxColor = FlxColor.ARGB(color)
		Local hsl:HSV = RGBtoHSV(color)
		
		'//	Hex format
		Local result:String = RGBtoHexString(color) + "\n"
		
		'//	RGB format
		result = result.Join(["Alpha: ", argb.a, " Red: ", argb.r, " Green: ", argb.g, " Blue: ", argb.b]) + "\n"
		
		'//	HSL info
		result = result.Join(["Hue: ", hsl.hue, " Saturation: ", hsl.saturation, " Lightnes: ", hsl.lightness])
		
		Return result
	End Function

	
	'/**
	 '* Return a String representation of the color in the format 0xAARRGGBB
	 '* 
	 '* @param	color The color to get the String representation for
	 '* 
	 '* @return	A string of length 10 characters in the format 0xAARRGGBB
	 '*/
	Function RGBtoHexString:String(color:Int)
		Local src:FlxColor = FlxColor.ARGB(color)
		Return "0x" + ColorToHexString(src.r) + ColorToHexString(src.r) + ColorToHexString(src.g) + ColorToHexString(src.b)
	End Function
	
	'/**
	 '* Return a String representation of the color in the format #RRGGBB
	 '* 
	 '* @param	color The color to get the String representation for
	 '* 
	 '* @return	A string of length 10 characters in the format 0xAARRGGBB
	 '*/
	Function RGBtoWebString:String(color:Int)
		Local src:FlxColor = FlxColor.ARGB(color)
		Return "#" + ColorToHexString(src.r) + ColorToHexString(src.g) + ColorToHexString(src.b)
	End Function

	'/**
	 '* Return a String containing a hex representation of the given color
	 '* 
	 '* @param	color The color channel to get the hex value for, must be a value between 0 and 255)
	 '* 
	 '* @return	A string of length 2 characters, i.e. 255 = FF, 0 = 00
	 '*/
	Function ColorToHexString:String(color:Int)
		Local digits:String = "0123456789ABCDEF"
		
		Local lsd:Int = color Mod 16
		Local msd:int = (color - lsd) / 16
		Local hexified:String = digits[msd..msd+1] + digits[lsd..lsd+1]
		
		Return hexified
	End Function
	
	'/**
	 '* Convert a HSV (hue, saturation, lightness) color space value to an RGB color
	 '* 
	 '* @param	h 		Hue degree, between 0 and 359
	 '* @param	s 		Saturation, between 0.0 (grey) and 1.0
	 '* @param	v 		Value, between 0.0 (black) and 1.0
	 '* @param	alpha	Alpha value to set per color (between 0 and 255)
	 '* 
	 '* @return 32-bit ARGB color value (0xAARRGGBB)
	 '*/
	Function HSVtoRGB:Int(h:Float, s:Float, v:Float, alpha:Int = 255)
		Local result:Int
		
		If (s = 0.0) Then
			result = GetColor32(alpha, v * 255, v * 255, v * 255)
		Else
			h = h / 60.0
			Local f:Float = h - Int(h)
			Local p:Float = v * (1.0 - s)
			Local q:Float = v * (1.0 - s * f)
			Local t:Float = v * (1.0 - s * (1.0 - f))
			
			Select (Int(h))
				Case 0
					result = GetColor32(alpha, v * 255, t * 255, p * 255)
				Case 1
					result = GetColor32(alpha, q * 255, v * 255, p * 255)
				Case 2
					result = GetColor32(alpha, p * 255, v * 255, t * 255)
				Case 3
					result = GetColor32(alpha, p * 255, q * 255, v * 255)
				Case 4
					result = GetColor32(alpha, t * 255, p * 255, v * 255)
				Case 5
					result = GetColor32(alpha, v * 255, p * 255, q * 255)
				Default
					FlxG.Log("FlxColor Error: HSVtoRGB : Unknown color")
			End
		Endif
		
		Return result
	End Function
	

	'/**
	 '* Convert an RGB color value to an object containing the HSV color space values: Hue, Saturation and Lightness
	 '* 
	 '* @param	color In format 0xRRGGBB
	 '* 
	 '* @return 	Object with the properties hue (from 0 to 360), saturation (from 0 to 1.0) and lightness (from 0 to 1.0, also available under .value)
	 '*/
	Function RGBtoHSV:HSV(color:Int)
		Local rgb:FlxColor = FlxColor.ARGB(color)
		
		Local red:Float = rgb.r / 255
		Local green:Float = rgb.g / 255
		Local blue:Float = rgb.b / 255
		
		Local min:Float = Min(red, green)
		min = Min( min, blue)
		
		Local max:Float = Max(red, green)
		max = Max(max, blue)
		
		Local delta:Float = max - min
		
		Local hsv:HSV = New HSV()
		Local hue:Float
		hsv.lightness = (max + min) / 2
		
		'//  Grey color, no chroma
		If (delta = 0) Then
			hue = 0
			hsv.saturation = 0
		Else
			If (hsv.lightness < 0.5) Then
				hsv.saturation = delta / (max + min)
			Else
				hsv.saturation = delta / (2 - max - min)
			Endif
                
			Local delta_r:Float = (((max - red) / 6) + (delta / 2)) / delta
			Local delta_g:Float = (((max - green) / 6) + (delta / 2)) / delta
			Local delta_b:Float = (((max - blue) / 6) + (delta / 2)) / delta
                
			If (red = max) Then
				hue = delta_b - delta_g
			Else If (green = max) Then
				hue = (1 / 3) + delta_r - delta_b
			Else If (blue = max) Then
				hue = (2 / 3) + delta_g - delta_r
			Endif
                
			If (hue < 0) Then
				hue += 1
			Endif
                
			If (hue > 1)
				hue -= 1
			Endif
		Endif
            
		'//	Keep the value with 0 To 359
		hue *= 360
		hsv.hue = Int(hue)
		hsv.value = hsv.lightness
		
		'//	Testing
		'//saturation *= 100;
		'//lightness *= 100;
		
        Return hsv
	End Function 	
   	
	Function InterpolateColor:Int(color1:Int, color2:Int, steps:Int, currentStep:Int, alpha:Int = 255)
		Local src1:FlxColor = FlxColor.ARGB(color1)
		Local src2:FlxColor = FlxColor.ARGB(color2)
		
        Local r:Float = (((src2.r - src1.r) * currentStep) / steps) + src1.r
        Local g:Float = (((src2.g - src1.g) * currentStep) / steps) + src1.g
        Local b:Float = (((src2.b - src1.b) * currentStep) / steps) + src1.b
            
		Return GetColor32(alpha, Int(r), Int(g), Int(b))

	End Function

	Function InterpolateColorWithRGB:Int(color:Int, r2:float, g2:float, b2:float, steps:Int, currentStep:Int)
		Local src:FlxColor = FlxColor.ARGB(color)

		Local r:Float = (((r2 - Float(src.r)) * currentStep) / steps) + Float(src.r)
		Local g:Float = (((g2 - Float(src.g)) * currentStep) / steps) + Float(src.g)
		Local b:Float = (((b2 - Float(src.b)) * currentStep) / steps) + Float(src.b)	

		Return GetColor24(r, g, b)
	End Function

	Function InterpolateRGB:Int(r1:float, g1:float, b1:float, r2:float, g2:float, b2:float, steps:Int, currentStep:Int)
		
		Local r:Float = (((r2 - r1) * currentStep) / steps) + r1
		Local g:Float = (((g2 - g1) * currentStep) / steps) + g1
		Local b:Float = (((b2 - b1) * currentStep) / steps) + b1

		Return GetColor24(Int(r), Int(g), Int(b))
	End Function
	
	'/**
	 '* Returns a random color value between black and white
	 '* <p>Set the min value to start each channel from the given offset.</p>
	 '* <p>Set the max value to restrict the maximum color used per channel</p>
	 '* 
	 '* @param	min		The lowest value to use for the color
	 '* @param	max 	The highest value to use for the color
	 '* @param	alpha	The alpha value of the returning color (default 255 = fully opaque)
	 '* 
	 '* @return 32-bit color value with alpha
	 '*/
	Function GetRandomColor:Int(min:Int = 0, max:Int = 255, alpha:Int = 255)
		'//	Sanity checks
		If (max > 255) Then
			FlxG.Log("FlxColor Warning: getRandomColor - max value too high")
			Return GetColor24(255, 255, 255)
		Endif
		
		If (min > max) Then
			FlxG.Log("FlxColor Warning: getRandomColor - min value higher than max")
			Return GetColor24(255, 255, 255)
		Endif
		
		Local red:Int = min + Int(Rnd() * (max - min))
		Local green:Int = min + Int(Rnd() * (max - min))
		Local blue:Int = min + Int(Rnd() * (max - min))
		
		Return GetColor32(alpha, red, green, blue)
	End Function
	
	'/**
	 '* Given an alpha and 3 color values this will return an integer representation of it
	 '* 
	 '* @param	alpha	The Alpha value (between 0 and 255)
	 '* @param	red		The Red channel value (between 0 and 255)
	 '* @param	green	The Green channel value (between 0 and 255)
	 '* @param	blue	The Blue channel value (between 0 and 255)
	 '* 
	 '* @return	A native color value integer (format: 0xAARRGGBB)
	 '*/
	Function GetColor32:Int(alpha:int, red:Int, green:Int, blue:Int)
		Return alpha Shl 24 | red Shl 16 | green Shl 8 | blue
	End Function
	
	'/**
	 '* Given 3 color values this will return an integer representation of it
	 '* 
	 '* @param	red		The Red channel value (between 0 and 255)
	 '* @param	green	The Green channel value (between 0 and 255)
	 '* @param	blue	The Blue channel value (between 0 and 255)
	 '* 
	 '* @return	A native color value integer (format: 0xRRGGBB)
	 '*/
	Function GetColor24:Int(red:int, green:int, blue:int)
		Return red Shl 16 | green Shl 8 | blue
	End Function
	
	'/**
	 '* Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component, as a value between 0 and 255
	 '* 
	 '* @param	color	In the format 0xAARRGGBB
	 '* 
	 '* @return	The Alpha component of the color, will be between 0 and 255 (0 being no Alpha, 255 full Alpha)
	 '*/
	Function GetAlpha:Int(color:Int)
		Return color Shr 24 & $FF
	End Function
	
	'/**
	 '* Given a native color value (in the format 0xAARRGGBB) this will return the Alpha component as a value between 0 and 1
	 '* 
	 '* @param	color	In the format 0xAARRGGBB
	 '* 
	 '* @return	The Alpha component of the color, will be between 0 and 1 (0 being no Alpha (opaque), 1 full Alpha (transparent))
	 '*/
	Function GetAlphaFloat:Float(color:Int)
		Local f:Int = color Shr 24
		
		Return f / 255
	End Function
	
	'/**
	 '* Given a native color value (in the format 0xAARRGGBB) this will return the Red component, as a value between 0 and 255
	 '* 
	 '* @param	color	In the format 0xAARRGGBB
	 '* 
	 '* @return	The Red component of the color, will be between 0 and 255 (0 being no color, 255 full Red)
	 '*/
	Function GetRed:Int(color:Int)
		Return color Shr 16 & $FF
	End Function
	
	'/**
	 '* Given a Native color value (in the format 0xAARRGGBB) this will Return the Green component, as a value between 0 And 255
	 '* 
	 '* @param	color	In the format 0xAARRGGBB
	 '* 
	 '* @return	The Green component of the color, will be between 0 and 255 (0 being no color, 255 full Green)
	 '*/
	Function GetGreen:Int(color:int)
		Return color Shr 8 & $FF
	End Function
	
	'/**
	 '* Given a native color value (in the format 0xAARRGGBB) this will return the Blue component, as a value between 0 and 255
	 '* 
	 '* @param	color	In the format 0xAARRGGBB
	 '* 
	 '* @return	The Blue component of the color, will be between 0 and 255 (0 being no color, 255 full Blue)
	 '*/
	Function GetBlue:Int(color:Int)
		Return color & $FF
	End Function

End Class

'Object with the properties hue (from 0 to 360), saturation (from 0 to 1.0) and lightness (from 0 to 1.0, also available under .value)
Class HSV Final
Public
	Field hue:Int
	Field saturation:Float
	Field lightness:Float
	Field value:Float
End Class

Class Harmony Final
Public
	Field hue1:Int
	Field hue2:Int
	Field hue3:Int
		
	Field color1:Int
	Field color2:Int
	Field color3:Int
End class



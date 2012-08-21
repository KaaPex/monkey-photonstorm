Import flixel

Class FlxExtendedRect Extends FlxRect

Public
	Method New(x:Float = 0, y:Float = 0, width:Float = 0, height:Float = 0)
		Super.New(x,y,width,height)
	End Method
	
	Method BottomRight:FlxPoint() Property
		Return New FlxPoint(Right(), Bottom())
	End Method

	Method TopLeft:FlxPoint() Property
		Return New FlxPoint(x, y)
	End Method
	
	Method Contains:Bool(x:Float,y:Float)
 		Return (x >= Left() And x <= Right() And y >= Top() And y <= Bottom())
 	End Method
 
 	Method ContainsPoint:Bool(point:FlxPoint)
 		Return Contains(point.x, point.y)
 	End Method
 
 	Method ContainsRect:Bool(rect:FlxExtendedRect)
 		Return ContainsPoint(rect.TopLeft) And ContainsPoint(rect.BottomRight)
 	End Method
 
 	Method Equals:Bool(toCompare:FlxExtendedRect)
 		Return Null <> toCompare And x = toCompare.x And y = toCompare.y And width = toCompare.width And height = toCompare.height
 	End Method
 
 	Method Inflate(dx:Float, dy:Float)
 		x = x - dx
 		y = y - dy
 		width = width + 2.0 * dx
 		height = height + 2.0 * dy
 	End Method
 
 	Method InflatePoint(point:FlxPoint)
 		Inflate(point.x, point.y)
 	End Method
 
	Method Clone:FlxExtendedRect()
 		Return New FlxExtendedRect(x, y, width, height)
 	End Method
 
 	Method Intersection:FlxExtendedRect(toIntersect:FlxExtendedRect)
 		Local containsTopLeft:Bool = ContainsPoint(toIntersect.TopLeft)
 		Local containsBottomRight:Bool = ContainsPoint(toIntersect.BottomRight)
 
 		If(containsTopLeft And containsBottomRight) Then
			Return toIntersect.Clone()
		Else If(containsTopLeft) Then
			Local p:FlxPoint = toIntersect.TopLeft()
			Return New FlxExtendedRect(p.x, p.y, Right - p.x, Bottom - p.y)
		Else If(containsBottomRight)
			Local p:FlxPoint = toIntersect.BottomRight()
			Return New FlxExtendedRect(x, y, p.x - x, p.y - y)
		Else
			Return New FlxExtendedRect()
		Endif
	End Method

	Method Intersects:Bool(toIntersect:FlxExtendedRect)
		Return ContainsPoint(toIntersect.TopLeft) Or ContainsPoint(toIntersect.BottomRight)
	End Method

End Class
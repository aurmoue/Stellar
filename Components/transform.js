export class TRect
{
    constructor(x,y,w,h)
    {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    top()
    {
        return this.y;
    }
    left()
    {
        return this.x;
    }
    bottom()
    {
        return (this.y+this.h);
    }
    right()
    {
        return (this.x+this.w);
    }
}

export class Pos
{
    constructor(x,y)
    {
        this.x=x;
        this.y=y;
    }
}
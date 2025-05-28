import { Pos } from "./transform.js";

export class AccuracyFX
{
    constructor(accuracy, x,y)
    {
        this.accuracy = accuracy;
        this.x = x;
        this.y = y;
        this.alpha = 1;
        this.active = true;
    }

    render(rr)
    {
        if (!this.active) return;
        rr.write([AccuracyList[this.accuracy]], "white", new Pos(this.x,this.y), 32, new Pos(0,0), 0, false, this.alpha);
        this.y-=1;
        this.alpha-=0.05;
        if (this.alpha <= 0)
            this.active = false;
    }
}

const AccuracyList=
{
    "-1":"MISS",
    "0":"perfect",
    "1":"good",
    "2":"BAD"
}
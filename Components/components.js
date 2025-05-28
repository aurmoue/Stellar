import { rr } from "../main.js";
import { Pos, TRect } from "./transform.js";

export class Word
{
    constructor(word,P, size = 64, oP = new Pos(0,-0.5), border = false)
    {
        this.word = word;
        this.size = size;
        this.P = P;
        this.oP = oP;
        this.border = border;
    }

    render(rr)
    {
        rr.write(this.word, "white", this.P, this.size, this.oP, 0, this.border);
    }
}

function pointCollideRect(point, T)
{
    return (point.x <= T.right() && point.x >= T.left() && point.y <= T.bottom() && point.y >= T.top());
}

export class Button
{
    constructor(action = () =>{console.log("FOOL! This button doesn't do jack shit!!")}, word = [""], T, size = 64)
    {
        this.word = word;
        this.T = T,
        this.size = size;
        this.offset = new Pos(-0.5,-0.5);

        this.action = this.action;

        this.event = (e) =>
        {
            const coords = rr.toCanvasCoords(e.pageX, e.pageY);

            const tt = new TRect(this.T.x-this.T.w*0.5, this.T.y-this.T.h*0.5, this.T.w, this.T.h);
            if (pointCollideRect(coords, tt))
            {
                action(this);
            }
        };
        this.activate();
    }

    activate()
    {
        window.addEventListener("mousedown", this.event);
    }

    deactivate()
    {
        window.removeEventListener("mousedown", this.event);
    }

    render(rr)
    {
        rr.write(this.word, "white", this.T, this.size, this.offset);
        // rr.strokeRect(new TRect(this.T.x+(this.offset.x*this.T.w), this.T.y+(this.offset.y*this.T.h), this.T.w,this.T.h), "white", 0, true);
    }
}
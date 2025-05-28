import { Ani, Frame, GenerateSet } from "./animator.js";
import { Pos } from "./transform.js";


export class Sprite
{
    constructor(T, folderName, w, h, folderSize, loop, looping = true, active = true, alpha = 1, startTime = 0)
    {
        this.T = T;
        this.active = active;
        this.alpha = alpha;
        this.looping = looping;

        let loop2 = loop;

        if (loop*0 == 0)
        {
            loop2 = [];
            for (let i = 0; i < folderSize; i++)
            {
                loop2.push(new Frame(i, loop));
            }
        }

        this.animation = new Ani(GenerateSet(folderName, w, h, folderSize));
        this.animation.init(loop2, startTime);
    }

    play(time)
    {
        this.active = true;
        this.animation.startTime = time;
        this.animation.update(time);
    }

    updatePos(P)
    {
        this.T.x = P.x;
        this.T.y = P.y;
    }

    update(time, P)
    {
        if (P!=undefined)this.updatePos(P);
        this.animation.update(time);

        if (!this.looping && time-this.animation.startTime > this.animation.loopTime) this.active = false;
    }

    render(rr)
    {
        if (this.active) rr.drawImg(this.T, this.animation.currentImg, 0, this.alpha);
    }
}
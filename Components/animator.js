export function GenerateSet(folderName, w, h, folderSize)
{
    let set = [];
    for (let i = 0; i < folderSize; i++)
    {
        set.push(new Image(w, h));
        set[i].src = "../Assets/Sprites/"+folderName+"/"+i+".png";
    }
    return set;
}

export class Frame
{
    constructor(index, duration)
    {
        this.index = index;
        this.duration = duration;
    }
}

export class Ani
{
    constructor(spriteSet)
    {
        this.paused = false;
        this.set = spriteSet;
        this.loop = [];
        this.loopTime = 0;
        this.lastTimeMargin = 0;
        this.currentIndex = 0;

        this.startTime = 0;
        this.currentImg = undefined;
    }

    setAnimationLoop(loop)
    {
        this.loop = loop;
        this.loopTime = 0;
        for (let i = 0; i < this.loop.length; i++)
        {
            this.loopTime += this.loop[i].duration;
        }
    }

    getCurrentIndex(relativeTime)
    {
        let accumulatedTime = 0;
        for (let i = 0; i < this.loop.length; i++)
        {
            accumulatedTime += this.loop[i].duration;
            if (accumulatedTime >= relativeTime) return i;
        }
        
    }

    getCurrentImg(relativeTime)
    {
        this.currentIndex = this.getCurrentIndex(relativeTime);
        return this.set[this.loop[this.currentIndex].index];
    }

    init(loop, startTime)
    {
        this.setAnimationLoop(loop);
        this.startTime = startTime;
        this.currentImg = this.getCurrentImg(Math.min(0,this.startTime % this.loopTime));
    }

    pause()
    {
        this.paused = true;
    }
    play()
    {
        this.paused = false;
    }

    update(time)
    {
        if (!this.paused)
            this.currentImg = this.getCurrentImg((time-this.startTime) % this.loopTime);
    }
}

export const animations = [];
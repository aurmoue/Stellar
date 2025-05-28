import { Button, Word } from "./components.js";
import { Pos, TRect } from "./transform.js";

export class LevelSlot
{
    constructor(level, back)
    {
        this.oy = 0;
        this.play = false;
        this.level = level;
        this.active = false;
        this.content = [];

        this.i = 0;
    }

    activate()
    {
        for (const e of this.content) if (e.activate) e.activate();
    }
    deactivate()
    {
        for (const e of this.content) if (e.deactivate) e.deactivate();
    }

    setActive()
    {
        this.active = true;
        for (const e of this.content) if (e.deactivate) e.deactivate();
        this.content = [new Word([this.level.chartName], new Pos(288,16+this.oy)),new Word([this.level.composer], new Pos(320,16+this.oy+48),48), new Word([`[${this.level.score}]`], new Pos(1184,42+this.oy)), new Button(()=>{this.play = true;}, ">", new TRect(1616, 42+this.oy, 64,64), 64)];
    }

    setBack()
    {
        this.active = false;
        for (const e of this.content) if (e.deactivate) e.deactivate();
        this.content = [new Word([this.level.chartName], new Pos(288,16+this.oy)), new Word([`[${this.level.score}]`], new Pos(1184,16+this.oy))];
    }

    update()
    {
        this.oy = 500+this.i*(this.i == 1 ? 144 : 96)+(this.i > 1 ? 48 : 0);
        if (this.i == 0)
            this.setActive();
        else
            this.setBack();
    }

    render(rr)
    {
        for (const e of this.content)
        {
            e.render(rr);
        }
        if (this.active) rr.strokeRect(new TRect(256, this.oy-36, 1408, 144), "white");
    }
}
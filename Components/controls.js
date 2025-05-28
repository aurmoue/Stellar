import { keyBinds } from "../Engine/input.js";
import { Button, Word } from "./components.js";
import { KeyBind } from "./keybind.js";
import { Pos, TRect } from "./transform.js";

export class ControlMenu
{
    constructor(back)
    {
        this.back = new Button(()=>{back()}, ["<<"], new TRect(192, 1014, 64,64), 64);
        this.active = false;
        this.binds = [];
        
        {let i = 0;
        for (const key of Object.keys(keyBinds))
        {
            this.binds.push(new KeyBind(key, 256, i > 0 ? this.binds : undefined))
            i++;
        }}
        this.line = new Word(["*  '  *  '  *  '  *  '  *  '  *  '  *  '  *  '  *  '  *  '  *  '  *  '  *"], new Pos(960, 256-32), 32, new Pos(-0.5,0));

        this.deactivate();
    }

    activate()
    {
        this.active = true;
        for (const e of this.binds)
            e.activate();
        this.back.activate();
    }

    deactivate()
    {
        this.active = false;
        for (const e of this.binds)
            e.deactivate();
        this.back.deactivate();
    }

    update()
    {
    }

    render(rr)
    {
        let toUpdate = 0;
        for (const e of this.binds)
        {
            toUpdate += e.toUpdate;
        }
        if (toUpdate > 0) for (const e of this.binds)
        {
            e.update();
        }
        for (const e of this.binds)
        {
            e.render(rr);
        }
        this.line.render(rr);
        this.back.render(rr);
    }
}
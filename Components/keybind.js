import { keyBinds } from "../Engine/input.js";
import { Button, Word } from "./components.js";
import { Pos, TRect } from "./transform.js";

export class KeyBind
{
    constructor(bind, y, prev)
    {
        this.toUpdate = false;

        this.prev = [];
        this.bind = bind;
        this.y = y;
        
        let h = 0;
        if (prev) for (const e of prev)
        {
            this.prev.push(e);
            h+=e.height;
        }
        let binds = [];
        for (let e of keyBinds[bind])
        {
            switch (e)
            {
                case 0:
                    e = "LMB";
                    break;
                case 1:
                    e = "MMB";
                    break;
                case 2:
                    e = "RMB";
                    break;
            }
            binds.push("["+e+"]");
        }
        this.height = keyBinds[bind].length*64+32;

        this.add = (e) =>
        {
            this.toUpdate = true;
            if (e.code == "Escape")
            {
                window.removeEventListener("keydown", this.add);
                window.removeEventListener("mousedown", this.add);
                this.activate();
            }

            if (e.code != undefined)
                if (keyBinds[this.bind][0] == "") keyBinds[this.bind][0] = e.code;
                else keyBinds[this.bind][1] = e.code;
            else if (e.button != undefined)
                if (keyBinds[this.bind][0] == "") keyBinds[this.bind][0] = e.button;
                else keyBinds[this.bind][1] = e.button;
            window.removeEventListener("keydown", this.add);
            window.removeEventListener("mousedown", this.add);
            this.activate();
        }

        this.pendingAdd = () =>
        {
            console.log(keyBinds[this.bind])
            if (keyBinds[this.bind][keyBinds[this.bind].length-1] != "") return;
            window.addEventListener("keydown", this.add);
            window.addEventListener("mousedown", this.add);
            this.deactivate();
        }

        this.e =
        [
            new Word([bind.slice(0,1).toUpperCase()+bind.slice(1,bind.length)], new Pos(288, y+h), 64),
            new Word(binds, new Pos(1648, y+h), 64, new Pos(-1,-0.5)),
            new Word(["*  '  *  '  *  '  *  '  *  '  *  '  *  '  *  '  *  '  *  '  *  '  *  '  *"], new Pos(960, y+h+this.height-32), 32, new Pos(-0.5,0)),
            new Button(()=>{this.pendingAdd()}, ["Add"], new TRect(288+64, y+h+72, 112, 48),48),
            new Button(()=>{this.clear()}, ["Clear"], new TRect(576, y+h+72, 160, 48),48)
        ];
    }

    clearMsg()
    {
        this.msg = "";
    }

    activate()
    {
        for (const e of this.e)
            if (e.activate) e.activate();
    }

    deactivate()
    {
        for (const e of this.e)
            if (e.deactivate) e.deactivate();
    }

    clear()
    {
        this.toUpdate = true;
        keyBinds[this.bind] = ["",""];
    }
    
    update()
    {
        this.toUpdate = false;
        let h = 0;
        if (this.prev) for (const e of this.prev)
        {
            h+=e.height;
        }
        let binds = [];
        for (let e of keyBinds[this.bind])
        {
            switch (e)
            {
                case 0:
                    e = "LMB";
                    break;
                case 1:
                    e = "MMB";
                    break;
                case 2:
                    e = "RMB";
                    break;
            }
            binds.push("["+e+"]");
        }
        this.e[0] = new Word([this.bind.slice(0,1).toUpperCase()+this.bind.slice(1,this.bind.length)], new Pos(288, this.y+h), 64);
        this.e[1] = new Word(binds, new Pos(1648, this.y+h), 64, new Pos(-1,-0.5));
    }

    render(rr)
    {
        for (const e of this.e)
        {
            e.render(rr);
        }
    }
}
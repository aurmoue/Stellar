import { Input, inputTypes, typeIndex } from "../Engine/input.js";
import { Ani, Frame, GenerateSet } from "./animator.js";
import { AccuracyFX } from "./FX.js";
import { Sprite } from "./sprite.js";
import { Pos, TRect } from "./transform.js";

export class Reader
{
    constructor(rr, chart, speed = 4)
    {
        this.enemyI = 0;

        this.up = new Image(100,100);
        this.up.src = "../Assets/Sprites/UpO/0.png";
        
        this.down = new Image(100,100);
        this.down.src = "../Assets/Sprites/UpO/i/0.png";

        this.sprites =
        [{
        "N":
        {
            "enemy": new Ani(GenerateSet("Enemy", 64,64,4)),
            "projectile": new Ani(GenerateSet("Projectile", 64,64,3))
        },
        "I":
        {
            "enemy": new Ani(GenerateSet("Enemy/i", 64,64,4)),
            "projectile": new Ani(GenerateSet("Projectile/i", 64,64,3))
        }
        },
        {
        "N":
        {
            "enemy": new Ani(GenerateSet("Enemy", 64,64,4)),
            "projectile": new Ani(GenerateSet("Projectile", 64,64,3))
        },
        "I":
        {
            "enemy": new Ani(GenerateSet("Enemy/i", 64,64,4)),
            "projectile": new Ani(GenerateSet("Projectile/i", 64,64,3))
        }
        }];
        const d = 0.8;
        this.sprites[0].N.enemy.init([new Frame(0,d),new Frame(1,d),new Frame(2,d),new Frame(3,d)], 0);
        this.sprites[0].I.enemy.init([new Frame(0,d),new Frame(1,d),new Frame(2,d),new Frame(3,d)], 0);
        this.sprites[1].N.enemy.init([new Frame(1,d),new Frame(2,d),new Frame(3,d),new Frame(0,d)], 0);
        this.sprites[1].I.enemy.init([new Frame(1,d),new Frame(2,d),new Frame(3,d),new Frame(0,d)], 0);
        this.sprites[0].N.projectile.init([new Frame(0,d),new Frame(1,d),new Frame(2,d)], 0);
        this.sprites[0].I.projectile.init([new Frame(0,d),new Frame(1,d),new Frame(2,d)], 0);
        this.sprites[1].N.projectile.init([new Frame(1,d),new Frame(2,d),new Frame(0,d)], 0);
        this.sprites[1].I.projectile.init([new Frame(1,d),new Frame(2,d),new Frame(0,d)], 0);

        this.score = 0;
        this.pts =
        {
            0:1000000/chart.chart.length,
            1:1000000/chart.chart.length*0.5,
            2:1000000/chart.chart.length*0.2
        }
        this.time = 0;
        this.clearedNoteType = "";

        this.rr = rr;
        this.toY = 0;
        this.y = 0;

        this.missed = false;

        // Speed is defined by how many seconds it takes to go from the right side of the screen to the left
        this.speed = speed;
        this.hitpos = 0.2;
        this.input = new Input();

        this.perfectDelay = 0.05;
        this.goodDelay = 0.1;
        this.badDelay = 0.2;

        this.accuracyUI = [];
        this.fx = [];

        this.chart = chart;
        this.lastI = 0;
        this.closestI = 0;
    }

    start()
    {
        this.chart.play();
    }

    end()
    {

    }

    spawnExplosion(note)
    {
        switch (note.type)
        {
            case 0: this.fx.push(new Sprite(new TRect(this.timeToX(note.time)-64, note.y-128, 256,256), "Projectile/e",64,64,8,0.005,false,false));break;
            case 1: this.fx.push(new Sprite(new TRect(this.timeToX(note.time)-64, note.y-128, 256,256), "Projectile/e",64,64,8,0.005,false,false));break;
            case 2: this.fx.push(new Sprite(new TRect(this.timeToX(note.time)-64, note.y-128, 256,256), "Projectile/e",64,64,8,0.005,false,false));break;
            case 3: this.fx.push(new Sprite(new TRect(this.timeToX(note.time)-64, note.y-128, 256,256), "Projectile/e",64,64,8,0.005,false,false));break;
        }
        this.fx[this.fx.length-1].play(this.time);
    }

    killNote(note)
    {
        note.active = false;
        this.spawnExplosion(note)
    }

    miss(note)
    {
        this.missed = true;
        this.killNote(note);
        this.accuracyUI.push(new AccuracyFX(-1, this.timeToX(this.chart.track.currentTime), this.y));
        if (note.type == 2) this.toY = 1;
        else if (note.type == 3) this.toY = -1;
    }

    getNote(index)
    {
        return this.chart.chart[index];
    }

    timeToX(time)
    {
        return ( (this.speed*this.hitpos)+(time-this.chart.track.currentTime) ) / this.speed * this.rr.ctx[0].canvas.width;
    }

    updateLastIndex()
    {
        let i = this.lastI;
        while (this.getNote(i) != undefined && this.getNote(i).time < this.chart.track.currentTime-(this.speed*this.hitpos))
            i++;
        this.lastI = i;
    }
    updateClosestIndex()
    {
        let i = this.closestI;
        if (this.getNote(i) != undefined) this.getNote(i).closest = false;
        while (this.getNote(i) != undefined && (this.getNote(i).time < this.chart.track.currentTime-this.goodDelay || !this.getNote(i).active))
            i++;
        if (this.getNote(i) != undefined) this.getNote(i).closest = true;

        if (this.closestI != i && this.getNote(this.closestI).active)
        {
            this.miss(this.getNote(this.closestI));
        }

        this.closestI = i;
    }

    checkAccuracy(type = 0)
    {
        if (this.chart.chart[this.closestI].type != type) return -1;
        const delay = Math.abs(this.chart.track.currentTime-this.chart.chart[this.closestI].time)
        if (delay > this.badDelay) return -1;
        if (delay > this.goodDelay) return 2;
        if (delay > this.perfectDelay) return 1;
        return 0;
    }

    resolveInput()
    {
        for (const type of inputTypes)
        {
            if (this.input.checkInput(type))
            {
                const accuracy = this.checkAccuracy(typeIndex[type]);
                if (accuracy >= 0)
                {
                    this.score+=this.pts[accuracy];
                    this.killNote(this.getNote(this.closestI));
                    this.accuracyUI.push(new AccuracyFX(accuracy, this.timeToX(this.chart.chart[this.closestI].time),this.y));
                    this.clearedNoteType = type;
                }
            }
        }
    }

    update(y)
    {
        // update the index
        this.time = this.chart.track.currentTime;
        this.clearedNoteType = "";
        this.toY = 0;
        this.y = y;

        this.missed = false;

        this.updateLastIndex();
        
        if (this.chart.chart[this.lastI] == undefined)
        {
            this.end();
            return;
        }

        this.updateClosestIndex();

        this.resolveInput();

        for (const sprite of this.fx) if (sprite != undefined) sprite.update(this.time);
    }

    renderType(x, note)
    {
        const stroke = note.closest ? "gray" : "black";
        note.y += ((note.time-this.chart.track.currentTime > 0.5) ? 0.2 : 0.5)*(this.y-note.y)
        const T = new TRect(x, note.y, 128,128);
        switch(note.type)
        {
            case 0:
                this.rr.drawImg(new TRect(x-64, note.y-128, 256,256), this.sprites[note.i][this.invert].enemy.currentImg, 0, this.alpha);
                break;
            case 1:
                this.rr.drawImg(new TRect(x-64, note.y-128, 256,256), this.sprites[note.i][this.invert].projectile.currentImg, 0, this.alpha);
                break;
            case 2:
                this.rr.drawImg(new TRect(x-64, note.y-128, 256,256), this.up, 0, this.alpha);
                break;
            case 3:
                this.rr.drawImg(new TRect(x-64, note.y-128, 256,256), this.down, 0, this.alpha);
                break;
            default:
                console.log("WHAT");
                break;
        }
    }

    renderNoteAt(note)
    {
        this.renderType(this.timeToX(note.time), note);
    }

    setY(index)
    {
        this.getNote(index).y = 1080*0.5;
    }

    iterateActiveNotes(callback)
    {
        for (let i = this.lastI; this.getNote(i) != undefined && this.getNote(i).time < this.chart.track.currentTime + (this.speed*(1-this.hitpos)); i++)
        {
            if (this.getNote(i).y == undefined) this.setY(i);
            if (this.getNote(i).i == undefined && this.getNote(i).type < 3)
            {
                this.getNote(i).i = this.enemyI;
                this.enemyI = (this.enemyI+1)%2;
            }
            if (this.getNote(i).active)
            {
                callback(this.getNote(i));
            }
        }
    }

    render()
    {
        for (let i = 0; i < this.fx.length; i++)
        {
            if (this.fx[i] != undefined)
            {
                this.fx[i].render(this.rr);
                if (!this.fx[i].active) delete this.fx[i];
            }
        }

        for (let i = 0; i < this.sprites.length; i++) for (const key of Object.keys(this.sprites[i][this.invert]))
            this.sprites[i][this.invert][key].update(this.time);

        this.iterateActiveNotes((e) => this.renderNoteAt(e));

        for (let i = 0; i < this.accuracyUI.length; i++)
        {
            if (this.accuracyUI[i]!= undefined) this.accuracyUI[i].render(this.rr);
            if (this.accuracyUI[i] != undefined && !this.accuracyUI[i].active) delete this.accuracyUI[i];
        }

        this.rr.fillRect(new TRect(0,0,(this.time/this.chart.track.duration)*1920,8), "white");

        let s = ("000000" + Math.ceil(this.score)).slice(-7);
        s = s.substring(0,1)+""+s.substring(1,4)+""+s.substring(4,7);
        this.rr.write([s], "white", new Pos(1920-64,64), 64, new Pos(-1,-1));
    }
}
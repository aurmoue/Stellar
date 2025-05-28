import { inputTypes } from "../Engine/input.js";
import { Frame } from "./animator.js";
import { Sprite } from "./sprite.js";
import { Pos, TRect } from "./transform.js";

export class Player
{
    constructor(P=new Pos(0,0))
    {
        this.T = new TRect(P.x,P.y,256,256);
        this.y = P.y+this.T.h*0.75;
        this.invert = "N";
        const w = 256;
        const h = 256;
        this.sprites = {
        "N": {
            "character": new Sprite(new TRect(P.x,P.y,w,h), "Character", 64,64, 4,
            0.2
            , true, true),

            "squish": new Sprite(new TRect(P.x,P.y,w,h), "Squish", 64,64, 5,
            [
                new Frame(0,0.015),
                new Frame(2,0.015),
                new Frame(3,0.015),
                new Frame(4,0.015)
            ], false, false),

            "slash": new Sprite(new TRect(P.x,P.y,w,h), "Slash", 64,64, 8,
            [
                new Frame(0, 0.010),
                new Frame(1, 0.015),
                new Frame(2, 0.015),
                new Frame(3, 0.025),
                new Frame(4, 0.020),
                new Frame(5, 0.025),
                new Frame(6, 0.030),
                new Frame(7, 0.030)
            ], false, false),
            
            "parry": new Sprite(new TRect(P.x,P.y,w,h), "Parry", 64,64, 4,
            [
                new Frame(1, 0.01),
                new Frame(3, 0.02)
            ], false, false),

            "dmg": new Sprite(new TRect(P.x,P.y,w,h), "Dmg", 64,64, 5,
            [
                new Frame(1, 0.02),
                new Frame(2, 0.02),
                new Frame(3, 0.02),
                new Frame(4, 0.02)
            ], false, false)
        },
        "I": {
            "character": new Sprite(new TRect(P.x,P.y,w,h), "Character/i", 64,64, 4,
            [
                new Frame(0,0.2),
                new Frame(1,0.2),
                new Frame(2,0.2),
                new Frame(3,0.2)
            ], true, true),

            "squish": new Sprite(new TRect(P.x,P.y,w,h), "Squish/i", 64,64, 5,
            [
                new Frame(0,0.015),
                new Frame(2,0.015),
                new Frame(3,0.015),
                new Frame(4,0.015)
            ], false, false),

            "slash": new Sprite(new TRect(P.x,P.y,w,h), "Slash/i", 64,64, 8,
            [
                new Frame(0, 0.010),
                new Frame(1, 0.015),
                new Frame(2, 0.015),
                new Frame(3, 0.025),
                new Frame(4, 0.020),
                new Frame(5, 0.025),
                new Frame(6, 0.030),
                new Frame(7, 0.030)
            ], false, false),
            
            "parry": new Sprite(new TRect(P.x,P.y,w,h), "Parry/i", 64,64, 4,
            [
                new Frame(1, 0.01),
                new Frame(3, 0.02)
            ], false, false),

            "dmg": new Sprite(new TRect(P.x,P.y,w,h), "Dmg/i", 64,64, 5,
            [
                new Frame(1, 0.02),
                new Frame(2, 0.02),
                new Frame(3, 0.02),
                new Frame(4, 0.02)
            ], false, false)
        }};

        this.oSprite = {
            "up": new Sprite(new TRect(0,0,1920,1080), "Up", 256,144, 11,
            [
                new Frame(0, 0.01),
                new Frame(2, 0.01),
                new Frame(3, 0.01),
                new Frame(5, 0.01),
                new Frame(6, 0.01),
                new Frame(7, 0.01),
                new Frame(8, 0.01),
                new Frame(9, 0.01),
                new Frame(10, 0.01)
            ],
            false, false, 0.5),
            
            "down": new Sprite(new TRect(0,0,1920,1080), "Down", 256,144, 11,
            [
                new Frame(0, 0.01),
                new Frame(2, 0.01),
                new Frame(3, 0.01),
                new Frame(5, 0.01),
                new Frame(6, 0.01),
                new Frame(7, 0.01),
                new Frame(8, 0.01),
                new Frame(9, 0.01),
                new Frame(10, 0.01)
            ],
            false, false, 0.5)
        }
    }

    toUp(time)
    {
        this.T.y = 64;
        this.y = 160-32;
        this.invert = "I";
        this.oSprite["up"].play(time);
    }
    toDown(time)
    {
        this.T.y = 1080-this.T.h-64;
        this.y = this.T.y+this.T.h*0.75;
        this.invert = "N";
        this.oSprite["down"].play(time);
    }

    checkInput(input, clearedNoteType, time)
    {
        for (const type of inputTypes)
        {
            if (clearedNoteType == type && input.checkInput(type))
            {
                if (type == "up") this.toUp(time);
                else if (type == "down") this.toDown(time);
                else if (this.sprites[this.invert][type] != undefined) this.sprites[this.invert][type].play(time);
            }
        }
    }

    update(reader)
    {
        if (reader.toY == 1) this.toUp(reader.time);
        else if (reader.toY == -1) this.toDown(reader.time);
        if (reader.input.active) this.sprites[this.invert]["squish"].play(reader.time);
        if (reader.clearedNoteType != "") this.checkInput(reader.input, reader.clearedNoteType, reader.time);

        if (reader.missed) this.sprites[this.invert]["dmg"].play(reader.time);

        for (const key of Object.keys(this.sprites[this.invert]))
            if (this.sprites[this.invert][key] != undefined) this.sprites[this.invert][key].update(reader.time, this.T);
        for (const key of Object.keys(this.oSprite))
            this.oSprite[key].update(reader.time);
    }

    render(rr)
    {
        if (this.sprites[this.invert]["squish"].active) this.sprites[this.invert]["character"].active = false;
        else this.sprites[this.invert]["character"].active = true;
        
        for (const key of Object.keys(this.sprites[this.invert]))
            if (this.sprites[this.invert][key] != undefined) this.sprites[this.invert][key].render(rr);
        for (const key of Object.keys(this.oSprite))
            this.oSprite[key].render(rr);
    }
}
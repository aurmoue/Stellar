import { Button } from "./components.js";
import { ControlMenu } from "./controls.js";
import { LevelSelection } from "./levelSelect.js";
import { Pos, TRect } from "./transform.js";

export class Menu
{
    constructor()
    {
        this.active = false;

        this.state = 0;

        this.back = () =>
        {
            if (this.state == 1) this.levelSelect.deactivate();
            else if (this.state == 2) this.control.deactivate();
            this.state = 0;
            this.activate();
        }
        this.levelSelect = new LevelSelection(this.back);
        this.control = new ControlMenu(this.back);

        this.elements =
        [
            new Button(() => {this.state = 1;this.levelSelect.activate();this.deactivateButtons();this.elements[0].activate();}, ["Jouer"], new TRect(960, 508, 160, 64), 64),
            new Button(() => {this.state = 2;this.control.activate();this.deactivateButtons();this.elements[1].activate();}, ["Contrôles"], new TRect(960, 672, 320, 64), 64)
        ];

        this.esc = (e) =>
        {
            if (e.code == "Escape")
            {
                this.back();
            }
        }
    }

    deactivateButtons()
    {
        for (const e of this.elements)
        {
            if (e.deactivate) e.deactivate();
        }
    }

    activate()
    {
        this.active = true;
        this.state = 0;
        for (const e of this.elements)
        {
            if (e.activate) e.activate();
        }
        window.addEventListener("keydown", this.esc);
    }

    deactivate()
    {
        this.active = false;
        this.levelSelect.deactivate();
        this.deactivateButtons();
        window.removeEventListener("keydown", this.esc);
    }

    render(rr, reader, chart)
    {
        switch (this.state)
        {
            case 0:
                for (const e of this.elements)
                {
                    e.render(rr);
                }
                break;
            case 1:
                if (reader == undefined)
                {
                    if (chart.fresh && chart.fetching)
                    {
                        rr.write(["loading..."], "white", new Pos(960,540), 64, new Pos(-0.5,-0.5));
                    }
                    else
                    {
                        this.levelSelect.render(rr);
                    }
                }
                break;
            case 2:
                this.control.render(rr);
                break;
        }
    }
}
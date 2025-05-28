import { Frame } from "./Components/animator.js";
import { Chart } from "./Components/chart.js";
import { Player } from "./Components/player.js";
import { Reader } from "./Components/reader.js";
import { Sprite } from "./Components/sprite.js";
import { Pos, TRect } from "./Components/transform.js";
import { Engine } from "./Engine/engine.js";
import { Renderer } from "./Engine/renderer.js";
import { LevelSelection } from "./Components/levelSelect.js";
import { Menu } from "./Components/menu.js";

export const rr = new Renderer(document.querySelector("canvas"), 1);

const menu = new Menu();
menu.activate();

let chart = new Chart();
let reader;

const player = new Player(new Pos(176,rr.ctx[0].canvas.height-256-64));

const stars = new Sprite(new TRect(0,0,1920,1080), "Stars", 256,144, 4,
[
    new Frame(0,4),
    new Frame(2,4),
    new Frame(1,4),
    new Frame(3,4)
], true, true);

function update(dt)
{
    if (menu.levelSelect.check())
    {
        menu.deactivate();
        chart.title = menu.levelSelect.levelSlots[menu.levelSelect.i].level.chartName;
        chart.FetchChart(menu.levelSelect.levelSlots[menu.levelSelect.i].level.chartPath);
    }
    if (chart.fresh && chart.chart != undefined)
    {
        reader = new Reader(rr, chart, 2);
        chart.start();
    }

    if (reader == undefined)
    {
        stars.update(engine.TIME);
        stars.alpha = (0.5-Math.abs((engine.TIME*0.25)-(Math.floor(engine.TIME*0.25)+0.5)));
        return;
    }

    reader.update(player.y);
    player.update(reader);
    stars.update(reader.time);
    stars.alpha = (0.5-Math.abs((reader.time*0.25)-(Math.floor(reader.time*0.25)+0.5)));
    reader.invert = player.invert;
    
    reader.input.clear();
}

function render()
{
    rr.fillBackground("black");
    stars.render(rr);

    if (menu.active)
    {
        menu.render(rr, reader, chart);
        rr.render();
        return;
    }
    else if (reader != undefined)
    {
        reader.render();
        rr.fillRect(new TRect(( (4*0.2) ) / 4 * rr.ctx[0].canvas.width, 0, 4, 1080), "white", 0, 0.2);
        player.render(rr);
    }


    rr.render();
}

// window.addEventListener("keyup", (e) =>
// {
//     if (e.code == "Escape")
//     {
//         chart.reset();
//         menu.activate();
//         reader = undefined;
//     }
// })

const engine = new Engine(60, update, render);
engine.start();

const ratio = 9/16;
window.addEventListener("load", () => rr.resize(window.innerWidth, window.innerHeight, ratio));
rr.resize(window.innerWidth, window.innerHeight, ratio);
window.addEventListener("resize", () => rr.resize(window.innerWidth, window.innerHeight, ratio));
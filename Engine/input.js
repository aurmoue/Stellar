export class Input
{
    constructor()
    {
        this.inputs = {};
        this.held = {};

        this.active = false;

        this.keydown = window.addEventListener("keydown", (e) =>
        {
            if (!this.held[e.code])
            {
                this.active = true;
                this.inputs[e.code] = true;
            }
            this.held[e.code] = true;
        });
        this.keyup = window.addEventListener("keyup", (e) =>
        {
            delete this.held[e.code];
        })

        this.mousedown = window.addEventListener("mousedown", (e) =>
        {
            this.active = true;
            this.inputs[e.button] = true;
        });
    }

    checkInput(type = "slash")
    {
        for (let i = 0; i < keyBinds[type].length; i++)
        {
            if (this.inputs[keyBinds[type][i]]) return true;
        }
        return false;
    }

    clear()
    {
        this.inputs = {};
        this.active = false;
    }
}

export const inputTypes = ["slash", "parry", "up", "down"];

export const typeIndex =
{
    "slash" :0,
    "parry" :1,
    "up"    :2,
    "down"  :3
};

export let keyBinds =
{
    "up": ["KeyW",""],
    "down": ["KeyS",""],
    "slash": [0,""],
    "parry": [2,""]
}
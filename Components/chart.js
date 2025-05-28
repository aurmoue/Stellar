import { Fetch } from "./fetcher.js";

export class Chart
{
    constructor()
    {
        this.title = "";

        this.fetching = false;
        this.chart;
        this.totalNotes = 0;
        this.track = new Audio();
        this.track.volume = 0.8;

        this.fresh = true;
    }

    reset()
    {
        this.fresh = true;
        this.track.pause();
        this.track.currentTime = 0;
        this.track.src = "";

        this.chart = undefined;
    }

    async FetchChart(path)
    {
        this.fetching = true;
        await Fetch((result) => this.chart = result, "../Assets/Charts/"+path+"/chart.json");
        this.fetching = false;
        this.chart[0].y = 1;
        this.track.src = "../Assets/Charts/"+path+"/track.wav";
        this.track.currentTime = 0;
        this.totalNotes = this.chart.length;
    }

    start()
    {
        this.fresh = false;
        this.track.play();
    }
}
export default class Calculator {
    private _width: number;
    private _height: number;
    private _round: number;

    constructor() {
        this._width = 0;
        this._height = 0;
        this._round = 0;
    }

    public get width(): number {
        return this._width;
    }

    public set width(value: number) {
        this._width = value;
    }

    public get height(): number {
        return this._height;
    }

    public set height(value: number) {
        this._height = value;
    }

    public get round(): number {
        return this._round;
    }
    
    public set round(value: number) {
        this._round = value;
    }

    public getLatitude(y: number): number {
        return (y - this.height / 2) / (this.height / 180);
    }

    public getLongitude(x: number): number {
        return (x - this.width / 2) / (this.width / 360); 
    }

    public static readonly RAD = Math.PI / 180;
}
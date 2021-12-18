import 'styles/homePage/index';

export default class HomePage {
    private _hi: string = 'Hello';

    sayHi = (say: string = 'mate') => {
        console.log(`${this._hi} ${say}`);
    };
}

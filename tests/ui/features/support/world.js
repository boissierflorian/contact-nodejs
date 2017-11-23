const Zombie = require('zombie');
const { setWorldConstructor } = require('cucumber');

class CustomWorld {
    constructor() {
        this.browser = new Zombie({ site : 'http://localhost:3000' });
    }
}

setWorldConstructor(CustomWorld);
/*control*/
const btnIncDamage = document.getElementById('game-boost-dmg');
const btnIncHit = document.getElementById('game-boost-hit');
const btnCall = document.getElementById('game-call');
const btnRestart = document.getElementById('game-restart');

/*data sources*/
const basePlayer = document.getElementById('game-player_data');
const baseDog = document.getElementById('game-dog_data');
const baseSnake = document.getElementById('game-snake_data');
const baseWolf = document.getElementById('game-wolf_data');

let gameOver = false;

class Entity {
    constructor(name, health, atk){
        this.name = name;
        this.health = health;
        this.atk = atk;
    }
}

class Player extends Entity {
    constructor(name, health, atk) {
        super(name, health, atk);
        this.hitBonus = 0;
        this.atkBonus = 0;
    }
}


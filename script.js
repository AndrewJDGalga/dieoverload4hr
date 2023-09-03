/*control*/
const btnIncDamage = document.getElementById('game-boost-dmg');
const btnIncHit = document.getElementById('game-boost-hit');
const btnCall = document.getElementById('game-call');
const btnRestart = document.getElementById('game-restart');
const feedback = document.getElementById('game-feedback');
const enemyWindow = document.getElementById('game-enemy');

/*data sources*/
const basePlayer = document.getElementById('game-player_data');
const baseDog = document.getElementById('game-dog_data');
const baseSnake = document.getElementById('game-snake_data');
const baseWolf = document.getElementById('game-wolf_data');
const baseApe = document.getElementById('game-ape_data');
const baseTiger = document.getElementById('game-tiger_data');
const baseBear = document.getElementById('game-bear_data');
const baseTrapper = document.getElementById('game-trapper_data');

let gameOver = false;
let enemySequence = [];
let dog = null;
let player = null;

class Entity {
    constructor(name, health, atk){
        this.name = name;
        this.health = health;
        this.atk = atk;
    }
    get entityName() { return this.name;}
    get entityHealth() { return this.health; }
    get entityAttack() { return this.atk; }
    set entityHealth(newVal) { this.health = newVal; }
    isDead() { return this.health <= 0; }
}

class Player extends Entity {
    constructor(name, health, atk) {
        super(name, health, atk);
        this.hitBonus = 0;
        this.atkBonus = 0;
    }
    get playerHealth() {return this.health;}
    get playerAttack() { return this.atk + this.atkBonus;}
    get playerHitBonus() { return this.hitBonus; }
    get playerAttackBonus() { return this.atkBonus; }
    set playerHitBonus(newVal) { this.hitBonus = newVal; }
    set playerAttackBonus(newVal) { this.atkBonus = newVal; }
}

const setupEntity = (dataSource) => {
    return new Entity(dataSource.dataset.name, dataSource.dataset.health, dataSource.dataset.attack);
}

const setupPlayer = () => {
    return new Player(basePlayer.dataset.name, basePlayer.dataset.health, basePlayer.dataset.attack);
}

const setEnemySequence = () => {
    enemySequence[0] = setupEntity(baseSnake);
    enemySequence[1] = setupEntity(baseWolf);
    enemySequence[2] = setupEntity(baseApe);
    enemySequence[3] = setupEntity(baseTiger);
    enemySequence[4] = setupEntity(baseBear);
    enemySequence[5] = setupEntity(baseTrapper);
};

const rollDie = () => {
    return Math.floor(Math.random() * 6) + 1;
}
console.log(rollDie());

const textObj = (marker, entity="", number="") => {
    let txt = "";
    switch(marker){
        case 'fight-1':
            txt = "You enter the forest. A snake emerges from the bushes.";
            break;
        case 'end-normal':
            txt = `${entity} was defeated. ${entity} has joined you.`;
            break;
        case 'fight-2':
            txt = "You come upon the ruins you seek. As you approach, a growling wolf emerges. It's a warning, but you won't be turning around.";
            break;
        case 'fight-3':
            txt = "The interior of the ruins is not as dark as you feared. However, you don't see the ape until it's almost on you. The creature is unlike anything you've seen before, its fur matted in what looks to be an attempt at camouflage, and you wonder if this is where your quest ends.";
            break;
        case 'fight-4':
            txt = "The tiger does not bother to hide itself. It lies across your path, so unnaturally calm you almost don't notice it. You may've had a chance to run, but as you watch the animal roll to its feet, you know that chance has passed.";
            break;
        case 'fight-5':
            txt = "You emerge from the ruins into a grassy field. Nearby, a bear is ambling back and forth almost comically. As you emerge it sees you, and it ambles over on two legs almost as if wants to ask you a question. However, as the bear nears, the creature opens its arms and jaws to receive you. You decide it would be best to defend yourself.";
            break;
        case 'fight-6':
            txt = "The trapper does not speak to you. He mearly growls his distaste.";
            break;
        case 'end-final':
            txt = `${entity} defeated!`
            break;
        case 'end-game':
            txt = "Congratulations! That's all the game there is, and you beat the whole thing. Hope it was interesting.";
            break;
        case 'miss':
            txt = `${entity} misses!`;
            break;
        case 'hit':
            txt = `${entity} hit, doing ${number} damage!`;
            break;
        case 'call-success':
            txt = `${entity} called!`;
            break;
        case 'call-fail':
            txt = "You called for aid, but nothing came!";
        case 'banished':
            txt = `${entity} left!`;
            break;
        case 'hit-chance':
            txt = `You increased your hit chance by ${number}!`;
        case 'damage-boost':
            txt = `You increased your damage by ${number}!`;
            break;
    }
    return txt;
}

const setEnemyWindow = (index) => {
    if(index < enemySequence.length) {
        const enemyNameNode = enemyWindow.querySelector('#game-enemy_name');
        const enemyHealthNode = enemyWindow.querySelector('#game-enemy_health');
        const enemyAtkNode = enemyWindow.querySelector('#game-enemy_atk');
        enemyNameNode.innerText = enemySequence[index].entityName;
        enemyHealthNode.innerText = enemySequence[index].entityHealth;
        enemyAtkNode.innerText = enemySequence[index].entityAttack;
    }
}

const initGame = ()=> {
    dog = setupEntity(baseDog);
    player = setupPlayer();
    setEnemySequence();
    setEnemyWindow(0);

    feedback.innerText = textObj('fight-1');
};
initGame();

btnIncDamage.addEventListener('click', ()=>{

});

btnIncHit.addEventListener('click', ()=>{

});

btnCall.addEventListener('click', ()=>{

});

btnRestart.addEventListener('click', ()=>{

});
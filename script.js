/*control*/
const btnIncDamage = document.getElementById('game-boost-dmg');
const btnIncHit = document.getElementById('game-boost-hit');
const btnCall = document.getElementById('game-call');
const btnRestart = document.getElementById('game-restart');
const feedback = document.getElementById('game-feedback');
const enemyWindow = document.getElementById('game-enemy');
const playerWindow = document.getElementById('game-player');

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
let unlockedAllies = [];
let summonedAllies = [];
let player = null;
let gameProgress = 0;


class Die {
    constructor(limit){
        this.size = limit;
    }
    roll() {
        return Math.floor(Math.random() * this.size) + 1;
    }
}

class Entity {
    constructor(name, health, atk){
        this.name = name;
        this.health = health;
        this.atk = Number(atk);
        this.dmgBonus = 0;
        this.hitBonus = 0;
        this.die = new Die(6);
    }
    get entityName() { return this.name;}
    get entityHealth() { return this.health; }
    get entityAttack() { return this.atk + this.dmgBonus; }
    set entityHealth(newVal) { this.health = newVal; }
    isDead() { return this.health <= 0; }
    getRoll() { return this.die.roll() + this.hitBonus; }
}

class Player extends Entity {
    constructor(name, health, atk) {
        super(name, health, atk);
        this.dmgBonus = 0;
        this.hitBonus = 0;
    }
    get playerDMGBonus() { return this.dmgBonus; }
    get playerHitBonus() { return this.hitBonus; }
    set playerHitBonus(newVal) { this.hitBonus = newVal; }
    set playerDMGBonus(newVal) { this.dmgBonus = newVal; }
    resetPlayerBonuses() { 
        this.dmgBonus = 0;
        this.hitBonus = 0;
    }
}

const setupEntity = (dataSource) => {
    return new Entity(dataSource.dataset.name, dataSource.dataset.health, dataSource.dataset.attack);
}

const setupPlayerObj = () => {
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
            txt = `${entity} hit, receiving ${number} damage!`;
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

const updatePlayerWindow = () => {
    const playerHealth = playerWindow.querySelector('#game-player_health');
    const playerAttack = playerWindow.querySelector('#game-player_atk');
    const playerDMGBonus = playerWindow.querySelector('#game-player_damage_bonus');
    const playerHitBonus = playerWindow.querySelector('#game-player_hit');
    playerHealth.innerText = 'HP: ' + player.entityHealth;
    playerAttack.innerText = 'Damage: ' + player.entityAttack;
    playerDMGBonus.innerText = 'Damage Bonus: ' + player.playerDMGBonus;
    playerHitBonus.innerText = 'Hit Bonus: ' + player.playerHitBonus;
}

const updateEntityWindow = (entity, window) => {
    const windows = Array.from(window.children);
    windows[0].innerText = entity.entityName;
    windows[1].innerText = entity.entityHealth;
    windows[2].innerText = entity.entityAttack;
}

const resolveCombat = (combatant1, combatant2, combatant1Window, combatant2Window, output, txt) => {
    (combatant1.entityName === player.entityName) ? updatePlayerWindow() : updateEntityWindow(combatant1, combatant1Window);
    (combatant2.entityName === player.entityName) ? updatePlayerWindow() : updateEntityWindow(combatant2, combatant2Window);

    output.innerText = txt;
}

const combatHandler = (combatant1, combatant2, combatant1Window, combatant2Window, txtSource) => {
    const combatant1Roll = combatant1.getRoll();
    const combatant2Roll = combatant2.getRoll();
    let outcome = txtSource('miss', combatant1.entityName) + ",  " + txtSource('miss', combatant2.entityName);
    let damage = 0;

    if(combatant1Roll > combatant2Roll) {
        outcome = textObj('hit', combatant2.entityName, combatant2.entityAttack);
        damage = combatant1.entityAttack;
        combatant2.entityHealth -= damage;
    } else if (combatant1Roll < combatant2Roll) {
        outcome = textObj('hit', combatant1.entityName, combatant1.entityAttack);
        damage = combatant2.entityAttack;
        combatant1.entityHealth -= damage;
    }

    resolveCombat(combatant1, combatant2, combatant1Window, combatant2Window, feedback, outcome);
}

const initGame = ()=> {
    player = setupPlayerObj();
    updatePlayerWindow();
    setEnemySequence();
    updateEntityWindow(enemySequence[0], enemyWindow);

    feedback.innerText = textObj('fight-1');
};
initGame();

//combatHandler(player, enemySequence[0], playerWindow, enemyWindow, textObj);

btnIncDamage.addEventListener('click', ()=>{
    player.playerDMGBonus += 1;
    combatHandler(player, enemySequence[gameProgress], playerWindow, enemyWindow, textObj);
});

btnIncHit.addEventListener('click', ()=>{
    player.playerHitBonus += 1;
    combatHandler(player, enemySequence[gameProgress], playerWindow, enemyWindow, textObj);
});

btnCall.addEventListener('click', ()=>{

});

btnRestart.addEventListener('click', ()=>{

});
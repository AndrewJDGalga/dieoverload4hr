
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
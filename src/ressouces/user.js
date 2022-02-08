const Challenge = require("./challenges")

class User{
    constructor(nom, score, id, position, challenges){
        this.nom = nom;
        this.score = score;
        this.id = id;
        this.position = position;
        this.challenges = challenges;
    }
}
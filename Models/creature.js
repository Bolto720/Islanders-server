class Creature
{
    constructor(name, current_island, pos_x, pos_y)
    {
        this.name = name;
        this.current_island = current_island;
        this.pos_x = pos_x;
        this.pos_y = pos_y;
    }

    move() 
    {
        if(Math.random() > 0.4)
        {
            if(Math.random() > 0.4)
            {
                this.pos_x += 24;
            }
            else
            {
                this.pos_x -= 24;
            }
        }
        else
        {
            if(Math.random() > 0.4)
            {
                this.pos_y += 24;
            }
            else
            {
                this.pos_y -= 24;
            }
        }

        return {"Creature": this.name, "Command": "creature", 
            "Pos_x": this.pos_x, "Pos_y": this.pos_y};   
    };
}

module.exports = Creature


// function creature(name, current_island, pos_x, pos_y) 
// {
//     this.name = name;
//     this.current_island = current_island;
//     this.pos_x = pos_x;
//     this.pos_y = pos_y;
// }
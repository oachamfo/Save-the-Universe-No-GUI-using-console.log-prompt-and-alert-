//declare globals
let mainPlayer; //field to hold the main player singleton
let numberOfAlienShips; //the number of alien ships to battle 
let alienShips=[];  //array to hold alien ship objects
let enemyIndex = 0; //global scoped zero-based index of alien ships
let enemyIsAlive; //boolean of whether alien ship that got hit is alive or not
let mainPlayerIsAlive; //boolean of whether mainPlayer is alive or not
let message; //message to output
let enemyStats; //stats about the current enemy ship
let mainPlayerStats; //stats about the mainPlayer

//get user input
function mainPlayerInput(){
    
    do{
        input = prompt("You destroyed an alien ship. Enter 'retreat' to retreat and 'attack' to attack: Omit the quotation marks!");
    }while(input == null || input == "" || input != "attack" && input != "retreat" );
    
    if(input=='retreat'){
        App.retreat()
    }else if (input=='attack'){
        return;
    }

}

//API: Instantiating Objects
//Always invoke getInstance() method on a class to get an instance
//Do not use new keyword to instantiate to prevent creating unnecessary objects

class App{

    //creates all the ships needed for the game
    static createShips(numberOfAlienShipsArg){
    //create USSAssemnly singleton
    mainPlayer = USSAssembly.getInstance(); //returns one and only one USSAssembly
    
    //set numberOfAlienShips to at least one
    if(!numberOfAlienShipsArg){
        numberOfAlienShipsArg = 1;
    }
    numberOfAlienShips = numberOfAlienShipsArg;
    //for loop to create alien ships
    for (let i=0; i<numberOfAlienShips; i++){
       // window["alienShip"+i] = AlienShip.getInstance(); 
       alienShips[i] = AlienShip.getInstance();
    }
    //console.log(alienShips);  //uncomment for a log of alienShips
    }
    
    static startGame(){
            message = 'Warfare has commenced...';
            console.log(message);
            alert(message);
        
            message = 'USS Assembly has launched an attack.';
            console.log(message);
            alert(message);
            
            mainPlayer.attack();
       
        }
    
    static mainPlayerDead(){
        message ='Game Over...You have been killed.';
        console.log(message);
        alert(message);
        mainPlayer.hull = 'game over';
        alienShips[enemyIndex].hull=0;
    }

    static youWin(){
        message = 'You win. All enemies destroyed.';
        console.log(message);
        alert(message);
        mainPlayer.hull = 'game over';
        return;
    }

    static retreat(){
        mainPlayer.hull = 'game over'; 
        alienShips[enemyIndex].hull=0; 
        mainPlayerIsAlive = false;
        alienShips=[];
        message = 'Game Over. You retreated.';
        console.log(message);
        alert(message);
           }
    }

class Ship{
    //declare fields
    hull; firePower; accuracy;

}

class USSAssembly extends Ship{    
    //constructor
    constructor(){
    super();
    this.hull = 20;
    this.firePower = 5;
    this.accuracy = 0.7;
    }

    //factory method
    static getInstance(){
        let USSAssemblySingleton;
        if(!USSAssemblySingleton){
            USSAssemblySingleton = new USSAssembly();
        }
        return USSAssemblySingleton;
    };

    attack(){
        //check to make sure enemyIndex is not an out of bounds index
        if (enemyIndex>=alienShips.length){
            enemyIndex = alienShips.length - 1;
            return;
        }
       //arbitrarily pick random number between accuracy on ship and 1.
        //constraints: 1>= accuracy >= 0; accuracy has to be greater than or equal to zero, 
        //but less than or equal to 1
        
        
        //modify the DOM with stats about mainPlayer
        mainPlayerStats = document.querySelector('.playerStats');
        mainPlayerStats.innerHTML = " Hull : " + mainPlayer.hull +"<br>" + "FirePower : " + mainPlayer.firePower 
        + "<br>" + "Accuracy : " + mainPlayer.accuracy + "<br>";


        //modify the DOM with current enemy ship
        enemyStats = document.querySelector('.enemyStats');
        enemyStats.innerHTML = " Hull : " + alienShips[enemyIndex].hull +"<br>" + "FirePower : " + alienShips[enemyIndex].firePower 
        + "<br>" + "Accuracy : " + alienShips[enemyIndex].accuracy + "<br>";

     
        //stats about current enemy ship: alert and console.log
        message = 'Current enemy: AlienShip ' + [enemyIndex]+ ' with an accuracy of ' + alienShips[enemyIndex].accuracy + ' Click OK or press ENTER to attack';
        console.log(message);
        alert(message);


        let randomNumber = Math.floor(Math.random() * (1 - alienShips[enemyIndex].accuracy + 1)+alienShips[enemyIndex].accuracy);
          
        if (randomNumber == 1) { 
            //if randomNumber is 1 then mainPlayer will hit enemy
            message = 'Target of the strike: AlienShip ' + [enemyIndex] + ' Target has been hit.';
            console.log(message);
            alert(message);
            //subtract firePower from target's hull
            alienShips[enemyIndex].hull = alienShips[enemyIndex].hull - mainPlayer.firePower;
            //console.log the remaining hull
            message = 'The remaing hull at destruction of AlienShip ' + [enemyIndex] + ' is '+ alienShips[enemyIndex].hull;
            console.log(message);
            alert(message);
            
            //check health of enemy ship
            alienShips[enemyIndex].checkHealth();
            
            if(enemyIsAlive == false){
                if(enemyIndex<alienShips.length){
                    enemyIndex++
                }   
                mainPlayer.attack();
            }else{alienShips[enemyIndex].attack();}
        } //closing tag for if randomNumber is 1
            else{
                // else randomNumber is zero and mainPlayer gets hit
            message = 'You have been hit by AlienShip '+ [enemyIndex]+'.';
            console.log(message);
            alert(message);

            message = 'Your hull before you got hit: ' + mainPlayer.hull;
            console.log(message);
            alert(message);
            //subtract firePower from mainPlayer.hull
            mainPlayer.hull = mainPlayer.hull - alienShips[enemyIndex].firePower
            message = 'Your hull after you got hit: '+mainPlayer.hull;
            console.log(message);
            alert(message);
        }
            
            //check health of mainPlayer after hit
            mainPlayer.checkHealth();
              
               //if mainPlayer is alive then have mainPlayer attack
                if(mainPlayerIsAlive == true){
                    mainPlayer.attack();
                          }else{
                //Do nothing here
                //You could call App.mainPlayerDead() here
                //But checkHealth() already handles calling that function
                //And even if checkHealth() did not, 
                //doing so here could cause App.mainPlayerDead()
                //to be called more than once depending on the test case
                   }
  
    }
 
   

    //check health of mainPlayer
    checkHealth(){
        //hull is less than or equal to zero; included undefined to cover all possibilities
        if (mainPlayer.hull<=0 || mainPlayer.hull == undefined){
            mainPlayer.hull = 'game over'; 
            alienShips[enemyIndex].hull=0; 
            mainPlayerIsAlive = false;
            App.mainPlayerDead();
        //hull is greater than zero   
        }else if(mainPlayer.hull>0){
            message = 'You are still alive';
            console.log(message);
            alert(message);
            return mainPlayerIsAlive = true;   
               }else{return mainPlayerIsAlive=false}; //to cover any other possibility
    }

   
}


class AlienShip extends Ship{
    //declare fields
    alienShipInstance = true;
    
    //constructor
    constructor(){
        super();

        //Math.floor(Math.random() * (max - min + 1) + min);
        this.hull = Math.floor(Math.random() * (6 - 3 + 1)+3); //hull: between 3 and 6, inclusive
        this.firePower = Math.floor(Math.random() * (4 - 2 + 1)+2); //firePower: between 2 and 4, inclusive
        
        //set accuracy from 0.6 to 0.8, inclusive
        //random number between 1 and 3, inclusive; 
        //assign 0.6 to 1, 0.7 to 2, and 0.8 to 3 
        const randomNumOutOfThree = Math.floor((Math.random() * (3 - 1 + 1)+1));
        if (randomNumOutOfThree==1){
            this.accuracy = 0.6; 
        }
        if (randomNumOutOfThree==2){
            this.accuracy = 0.7;
        }
        if (randomNumOutOfThree==3){
            this.accuracy = 0.8;
        }
    }
    
    //factory method
    static getInstance(){
        this.alienShipInstance = new AlienShip();
        return this.alienShipInstance; 
    }

    //alien ship attacks
    attack(){

        message = 'Your accuracy: ' + mainPlayer.accuracy + '. To be or not to be? Will you hit an alien ship or will an alien ship hit you?';
        console.log(message);
        alert(message);
        
        //arbitrarily pick random number between accuracy on ship and 1.
        //constraints: 1>= accuracy >= 0; accuracy has to be greater than or equal to zero, 
        //but less than or equal to 1
        let randomNumber = Math.floor(Math.random() * (1 - alienShips[enemyIndex].accuracy + 1)+alienShips[enemyIndex].accuracy);
                
        if (randomNumber == 1) { 
            //if randomNumber is 1 then mainPlayer will be hit by enemy
            message = 'You have been hit by AlienShip ' + [enemyIndex] + '.';
            console.log(message);
            alert(message);

            //subtract firePower from mainPlayer's hull
            mainPlayer.hull = mainPlayer.hull - alienShips[enemyIndex].firePower;
            //console.log the remaining hull
            message = 'The remaing hull for you: ' + mainPlayer.hull;
            console.log(message);
            alert(message);
            
            //check health of mainPlayer
            mainPlayer.checkHealth();
            
            if(mainPlayerIsAlive == false){
                //Do nothing here
                //You could call App.mainPlayerDead() here
                //But checkHealth() already handles calling that function
                //And even if checkHealth() did not, 
                //doing so here could cause App.mainPlayerDead()
                //to be called more than once depending on the test case
            }else{mainPlayer.attack(); //mainPlayer will attack
                } //closing for the else statement portion
        } //closing tag for if randomNumber is 1
            else{
                // else randomNumber is zero and mainPlayer does not get hit
            message = 'AlienShip ' + [enemyIndex]+ ' missed a shot at you.';
            console.log(message);
            alert(message);

            message = 'You have counter attacked.';
            console.log(message);
            alert(message);

            mainPlayer.attack();  //mainPlayer counter attacks
           
            }

    } //class AlienShip closing bracket
    
    //check health of alien ship
    checkHealth(){
        //hull of alien ship is less than or equal to zero
        if (alienShips[enemyIndex].hull<=0){
            message = 'Target has been destroyed.';
            console.log(message);
            alert(message);

            mainPlayerInput(); //mainPlayer can retreat or attack

                if(alienShips.length-1==enemyIndex){
                    App.youWin();
                }
            return enemyIsAlive = false;
        
        }else{
            //hull of alien ship is greater than zero   
            message = 'Target is still alive';
            console.log(message);
            alert(message);

            return enemyIsAlive = true;   
               }
    }
}




//wait for DOM to load before doing anything
window.addEventListener('load', (e) => {
    //create all the ships needed for the game
    //argument passed to createShips() is the number of alien ships to create
    //USS Assembly singleton gets created by default by createShips();
    App.createShips(6);
    
    //start the warfare
    App.startGame();});

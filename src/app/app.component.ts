import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  // Assets De Sonido
  AudioEmber = "assets/Ember.mp3";
  AudioMetalClaw ="assets/Metal Claw part 1.mp3";
  AudioTackle = "assets/Tackle.mp3";
  AudioProtect = "assets/Protect.mp3";
  AudioSpore = "assets/Sleep Powder part 1.mp3";
  AudioAbsorb = "assets/Absorb.mp3";
  AudioSolarCharge = "assets/Solar Beam part 1.mp3";
  AudioSolarBeam = "assets/Solar Beam part 2.mp3";
  BackGroundAudio = new Audio("assets/1-09. Battle! (Wild Pokémon).mp3");
  AudioVictory = new Audio("assets/1-10. Victory! (Wild Pokémon).mp3");
  // Booleanos de Sonidos
  BattleAudioPlaying = false;
  VictoryAudioPlaying = false;
  // Booleanos de Animacion de los Ataques
  showEmber = false;
  showMetalclaw = false;
  showTackle = false;
  showProtection = false;
  showSolarCharge = false;
  showSolarBeam = false;
  showSpore = false;
  showTackleRival = false;
  showProtectEnemy = false;
  showAbsorb = false;
  // Variables de la Logica Del Juego
  Inicio_Del_Juego = false;
  Fin_Del_Juego = false;
  PrimerTurno = true;
  Ganador = '';
  // Variables Pokemon Jugador
  playerOneName ='Charmeleon';
  playerOneAttacks = ['Ember', 'Protection', 'Metal Claw', 'Tackle'];
  playerOneHealth = 60;
  playerOnePuedeAtacar = true;
  playerOneEstaDormido = false;
  playerOneTurnosDormidos= 0;
  playerOnePuedeRecibirDano = true;
  playerOneYaUsoProteccion = false;
  @ViewChild('p1Health') playerOneHealthBar!: ElementRef<HTMLDivElement>;
  @ViewChild('countP1') playerOneHealthCount!: ElementRef<HTMLSpanElement>;
  // Variables Pokemon Rival
  playerTwoName ='Ivysaour';
  playerTwoAttacks = ['Solar Beam', 'Spore', 'Absorb', 'Tackle'];
  playerTwoHealth = 70;
  playerTwoPuedeAtacar = true;
  playerTwoEstaDormido = false;
  playerTwoTurnosDormidos= 0;
  playerTwoPuedeRecibirDano = true
  playerTwoYaUsoProteccion = false;
  @ViewChild('p2Health') playerTwoHealthBar!: ElementRef<HTMLDivElement>;
  @ViewChild('countP2') playerTwoHealthCount!: ElementRef<HTMLSpanElement>;
  // Variables De Objetos HTML
  @ViewChild('gameStateText') gameStateText!: ElementRef<HTMLDivElement>;
  @ViewChild('attackContainer') attackContainer!: ElementRef<HTMLDivElement>;

  //Funcioiones de Logica Del juego
    startGame(){
      //Fuciones Con el Audio
      this.BattleAudioPlaying = false;
      this.VictoryAudioPlaying = true;
      this.playVictoryMusic()
      // Establece el Audio en un Loop
      this.BackGroundAudio.loop = true;
      // Establece el Volumen del Audio
      this.BackGroundAudio.volume = 0.1;
      this.playGameMusic()
      //Reinicio de Variables Boleana
      this.PrimerTurno = true;
      this.Inicio_Del_Juego = true;
      this.playerTwoPuedeAtacar = true;
      this.playerOneEstaDormido = false;
      this.playerOnePuedeRecibirDano = true;
      this.Fin_Del_Juego = false;
      //Reinicio del Nombre del Pokemon Ganador
      this.Ganador = '';
      //Reinicio del las variables de Vida de los Pokemones
      this.playerOneHealth = 60;
      this.playerTwoHealth = 70;
      //Reinicio de los contenedores que representan las variables de vida de los Pokemones
      this.playerOneHealthCount.nativeElement.innerText = `${this.playerOneHealth} / 60`;
      this.playerTwoHealthCount.nativeElement.innerText = `${this.playerTwoHealth} / 70`;
      this.playerOneHealthBar.nativeElement.style.width = '130%';
      this.playerTwoHealthBar.nativeElement.style.width = '130%';
      this.playerOneHealthBar.nativeElement.style.backgroundColor = 'green';
      this.playerTwoHealthBar.nativeElement.style.backgroundColor = 'green';
      //Reinicio de los contenedores que representan el texto de lo que pasa y donde estan los botones de ataque
      this.gameStateText.nativeElement.style.display = 'none';
      this.attackContainer.nativeElement.style.display = 'grid';
      this.gameStateText.nativeElement.innerText = ``;
    }
    checkFinDelJuego(){
      if(this.Fin_Del_Juego){
        return true
      }
      else{
        return false
      }
    }
    checkWinner() {
      if (this.playerTwoHealth <= 0) {
        this.endGame(this.playerOneName);
        return true;
      }
      else if (this.playerOneHealth <= 0) {
        this.endGame(this.playerTwoName);
        return true;
      }
      return false;
    }
    endGame(winner: string){
      this.VictoryAudioPlaying = false;
      this.stopGameMusic()
      this.playVictoryMusic()
      this.AudioVictory.volume = 0.4; // Ajusta volumen si querés
      this.Ganador = winner;
      this.gameStateText.nativeElement.innerText = ``;
      this.gameStateText.nativeElement.style.display = 'none';
      this.attackContainer.nativeElement.style.display = 'none';
      this.Fin_Del_Juego = true;
    }
    restartGame() {
      //Fuciones Con el Audio
      this.VictoryAudioPlaying = true
      this.stopVictoryMusic()
      this.BackGroundAudio.loop = true; // Para que se repita
      this.BackGroundAudio.volume = 0.1; // Ajusta volumen si querés
      //Reinicio del Bolleano para mostrar la pantalla de inicio
      this.Inicio_Del_Juego = false;
      this.gameStateText.nativeElement.innerText = ``;
    }
  //Funciones que actualizan Objetos HTML
    //Funcion que actualiza el color de la Barra de Vida
    healthColor(playerHealth: number, playerBar: HTMLElement) {
      playerBar.style.backgroundColor = playerHealth < 25 ? 'red' : playerHealth < 50 ? '#cee809' : 'green';
    }
    //Funcion que actualiza los contenedores de el jugador
    ModifyPlayerOneContainer(NombreDelAtaque:string, DanoDelAtaque:number){
      if(this.playerOneHealth < 0){
        this.playerOneHealth = 0
      }
      this.playerOneHealthBar.nativeElement.style.width = `${this.playerOneHealth}%`;
      this.playerOneHealthBar.nativeElement.style.transition = '1.4s';
      this.healthColor(this.playerOneHealth, this.playerOneHealthBar.nativeElement)
      this.playerOneHealthCount.nativeElement.innerText = `${this.playerOneHealth} / 60`;
      this.gameStateText.nativeElement.innerText = `IvySaur used ${NombreDelAtaque}! It took away ${DanoDelAtaque} HP!`;
      this.attackContainer.nativeElement.style.display = 'none';
      if(NombreDelAtaque === "Absorb"){
        this.PlayerTwoHealing(NombreDelAtaque, DanoDelAtaque)
      }
    }
    //Funcion que actualiza los contenedores de el Pokemon Rival
    ModifyPlayerTwoContainer(NombreDelAtaque:string, DanoDelAtaque:number){
      if(this.playerTwoHealth < 0){
            this.playerTwoHealth = 0;
      }
      this.playerTwoHealthBar.nativeElement.style.width = `${this.playerTwoHealth}%`;
      this.playerTwoHealthBar.nativeElement.style.transition = '1.4s';
      this.playerTwoHealthCount.nativeElement.innerText = `${this.playerTwoHealth} / 70`;
      this.gameStateText.nativeElement.innerText = `Charmeleon used ${NombreDelAtaque}! It took away ${DanoDelAtaque} HP!`;
      this.attackContainer.nativeElement.style.display = 'none';
    }
    //Funcion que muestra un mensaje en caso que el pokemon rival se cure con un ataque
    PlayerTwoHealing(NombreDelAtaque:string, DanoDelAtaque:number){
      if(this.playerTwoHealth < 70){
        this.playerTwoHealth += DanoDelAtaque/2;
        if(this.playerTwoHealth > 70){
            this,this.playerTwoHealth = 70;
          }
        }
        this.playerTwoHealthBar.nativeElement.style.width = `${this.playerTwoHealth}%`;
        this.playerTwoHealthBar.nativeElement.style.transition = '1.4s';
        this.healthColor(this.playerTwoHealth, this.playerTwoHealthBar.nativeElement)
        this.playerTwoHealthCount.nativeElement.innerText = `${this.playerTwoHealth} / 70`;
        this.gameStateText.nativeElement.innerText = `IvySaur used ${NombreDelAtaque}! It Healed ${DanoDelAtaque/2} HP!`;
        this.attackContainer.nativeElement.style.display = 'none';

    }
  //Funciones de Los Ataques de Los Pokemones
    // Funciones de efectos de ataques
    EstadoDormir(EstePokemonEstaDormido: Boolean, NombrePokemon: string, NumeroDeTurnosDormidos:number){
      if(EstePokemonEstaDormido){
        if(NumeroDeTurnosDormidos === 3){
          setTimeout(() => {
            this.gameStateText.nativeElement.style.display = 'block';
            this.attackContainer.nativeElement.style.display = 'none';
          }, 2);
          this.gameStateText.nativeElement.innerText = `${NombrePokemon} Wake up`;
          this.attackContainer.nativeElement.style.display = 'none';
          if(NombrePokemon === this.playerOneName){
            this.playerOneTurnosDormidos = 0
            this.playerOneEstaDormido = false;
            return false
          }
          else{
            this.playerTwoTurnosDormidos = 0;
            this.playerTwoEstaDormido = false
            return false
          }
        }
        else{
            const random = Math.floor(Math.random() * 3) + 1;
            if(random !== 1){
              if(NombrePokemon === this.playerOneName){
                this.playerOneEstaDormido = false;
                this.playerOneTurnosDormidos = 0;
                setTimeout(() => {
                  this.gameStateText.nativeElement.style.display = 'block';
                  this.attackContainer.nativeElement.style.display = 'none';
                }, 2);
                this.gameStateText.nativeElement.innerText = `${NombrePokemon} Wake up`;
                this.attackContainer.nativeElement.style.display = 'none';
                console.log("wake up")
                return false
              }
              else{
                this.playerTwoEstaDormido = false
                this.playerTwoTurnosDormidos = 0;
                this.gameStateText.nativeElement.innerText = `${NombrePokemon} Wake up`;
                this.attackContainer.nativeElement.style.display = 'none';
                return false
              }

            }
            else{
              if(NombrePokemon === this.playerOneName){
                console.log("Sleep")
                this.playerOneTurnosDormidos += 1;
                this.gameStateText.nativeElement.innerText = `${NombrePokemon} Its sleep`;
                this.playerOneEstaDormido = true;
                return true
              }
              else{
                this.playerTwoTurnosDormidos += 1;
                this.gameStateText.nativeElement.innerText = `${NombrePokemon} Its sleep`;
                this.playerTwoEstaDormido = true;
                return true
              }
            }
          }
      }
      else{
        return false
      }
    }
    Proteccion(EstePokemonYaProtegio: Boolean, NombrePokemon: string){
      if(!EstePokemonYaProtegio){
        if(NombrePokemon === this.playerOneName){
          this.playerOneYaUsoProteccion = true
          this.playerOnePuedeRecibirDano = false;
          this.gameStateText.nativeElement.innerText = `${this.playerOneName} used Protection Now its Protected`;
          this.intervalFunction();
        }
        else{
          this.playerTwoYaUsoProteccion = true
          this.playerTwoPuedeRecibirDano = false;
          this.gameStateText.nativeElement.innerText = `${this.playerTwoName} used Protection Now its Protected`;
        }
      }
      else{
        const random = Math.floor(Math.random() * 2) + 1;
        if(random !== 1){
          if(NombrePokemon === this.playerOneName){
            this.playerOneYaUsoProteccion = true
            this.playerOnePuedeRecibirDano = false;
            this.gameStateText.nativeElement.innerText = `${this.playerOneName} used Protection Now its Protected`;
            this.intervalFunction();
          }
          else{
            this.playerTwoYaUsoProteccion = true
            this.playerTwoPuedeRecibirDano = false;
            this.gameStateText.nativeElement.innerText = `${this.playerTwoName} used Protection Now its Protected`;
          }
        }
        else{
          if(NombrePokemon === this.playerOneName){
            this.playerOneYaUsoProteccion = false
            this.playerOnePuedeRecibirDano = true;
            this.gameStateText.nativeElement.innerText = `${this.playerOneName} used Protection ... But it missed`;
            this.intervalFunction();
          }
          else{
            this.playerTwoYaUsoProteccion = false
            this.playerTwoPuedeRecibirDano = true;
            this.gameStateText.nativeElement.innerText = `${this.playerTwoName} used Protection ... But it missed`;
          }
        }
      }
    }
    ProteccionAnteriorTurnoCheck(NombrePokemon: string){
      if(NombrePokemon === this.playerOneName){
        if(this.playerOneYaUsoProteccion){
            this.playerOneYaUsoProteccion = false;
        }
      }
      else{
        if(this.playerTwoYaUsoProteccion){
            this.playerTwoYaUsoProteccion = false;
        }
      }
    }
    //Funcion de Ataque del Pokemon Rival
    playerTwoAttack() {
      if(!this.checkFinDelJuego()){
        if(this.PrimerTurno === false){
          if(this.playerTwoPuedeAtacar === true){
            const index = Math.floor(Math.random() * 4);
            const attack = this.playerTwoAttacks[index];
            let subtract = 0, miss = 0;
            switch (attack) {
              case 'Solar Beam': subtract = 30; miss = 100; break;
              case 'Spore': subtract = 0; miss = 100; break;
              case 'Absorb': subtract = 10; miss = 14; break;
              default: subtract = 10; miss = 7;
            }
            if(attack === 'Solar Beam'){
              this.SoundPlaY(this.AudioSolarCharge)
              this.playerTwoPuedeAtacar= false
              this.playerOnePuedeRecibirDano = true
              this.showSolarCharge = true;
              this.gameStateText.nativeElement.innerText = `IvySaur is Charing Energy`;
              setTimeout(() => {
                this.showSolarCharge = false;
              }, 1000);
            }
            else if(attack === 'Spore'){
              const random = Math.floor(Math.random() * miss) + 1;
              if (random !== 1){
                if(this.playerOnePuedeRecibirDano === false){
                  this.protectionAniamtionEnemy();
                  this.gameStateText.nativeElement.innerText = `IvySaur used ${attack}! But Charmeleon Portected himself!`;
                  this.playerOnePuedeRecibirDano= true;
                }
                else if(this.playerOneEstaDormido === true){
                  this.gameStateText.nativeElement.innerText = `IvySaur used ${attack}! But Charmeleon was alredy sleep!`;
                  this.playerOneEstaDormido = true
                }
                else{
                  this.SoundPlaY(this.AudioSpore)
                  this.showSpore = true;
                  setTimeout(() => {
                    this.showSpore = false;
                  }, 2000);
                  this.gameStateText.nativeElement.innerText = `IvySaur used ${attack}! It made Charmeleon sleep!`;
                  this.playerOneEstaDormido = true
                }
              }
              else{
                this.gameStateText.nativeElement.innerText = `IvySaur used ${attack}... But it missed!`;
                this.playerOnePuedeRecibirDano = true;
              }
            }
            else{
              const random = Math.floor(Math.random() * miss) + 1;
              if(random !== 1) {
                if(this.playerOnePuedeRecibirDano===true){
                  this.playerOneHealth -= subtract;
                  if(!this.checkWinner()){
                    if(attack === 'Absorb'){
                      this.SoundPlaY(this.AudioAbsorb)
                      this.showAbsorb = true;
                      setTimeout(() => {
                        this.showAbsorb= false;
                      }, 1000);
                    }
                    else{
                      this.SoundPlaY(this.AudioTackle)
                      this.showTackleRival = true;
                      setTimeout(() => {
                        this.showTackleRival = false;
                      }, 1000);
                    }
                    this.ModifyPlayerOneContainer(attack, subtract)
                  }
                }
                else{
                  this.playerOnePuedeRecibirDano = true
                  this.gameStateText.nativeElement.innerText = `IvySaur used ${attack}! But Charmeleon Portected himself!`;
                  this.attackContainer.nativeElement.style.display = 'none';
                }
              }
              else{
                this.gameStateText.nativeElement.innerText = `IvySaur used ${attack}... But it missed!`;
                this.playerOnePuedeRecibirDano = true;
              }
            }
          }
          else{
            this.playerTwoPuedeAtacar = true
            let subtract = 30, miss = 100;
            if(this.playerOnePuedeRecibirDano===true) {
              this.playerOneHealth -= subtract;
              this.checkWinner();
              this.SoundPlaY(this.AudioSolarBeam)
              this.showSolarBeam = true
              setTimeout(() => {
                this.showSolarBeam = false;
              }, 1000);
              this.ModifyPlayerOneContainer("Solar Beam", subtract)
            }
            else {
              this.protectionAniamtionEnemy()
              this.gameStateText.nativeElement.innerText = `IvySaur used Solar Beam! But Charmeleon Portected himself!`;
              this.playerOnePuedeRecibirDano = true;
            }
          }
        }
        else{
          return
        }
      }
    }
    //Funcion que llama el ataque del Rival y permite la actualizacionde los elemtos html
    intervalFunction() {
      this.healthColor(this.playerTwoHealth, this.playerTwoHealthBar.nativeElement);
      const interval = setInterval(() => {
        this.gameStateText.nativeElement.style.display = 'block';
        this.attackContainer.nativeElement.style.display = 'none';
      }, 1);

      const intervalTwo = setTimeout(() => {
        this.playerTwoAttack();
      }, 2502);

      setTimeout(() => {
        clearInterval(interval);
        if (this.playerOneHealth > 0) {
          this.gameStateText.nativeElement.style.display = 'none';
          this.attackContainer.nativeElement.style.display = 'grid';
        }
      }, 5004);
    }
    //Funciones de Los Ataque del Pokemon Jugable
    playerOneAttack(subtract: number, missCount: number, attackName: string) {
      this.playerOnePuedeRecibirDano = true
      if(!this.checkFinDelJuego()){
        if(this.PrimerTurno===true){
          this.PrimerTurno = false;
        }
          if(attackName === 'Protection'){
            this.Proteccion(this.playerOneYaUsoProteccion, this.playerOneName)
            this.checkWinner()
          }
          else{
            this.ProteccionAnteriorTurnoCheck(this.playerOneName)
            this.playerTwoHealth -= subtract;
            this.checkWinner()
            this.intervalFunction();
            this.ModifyPlayerTwoContainer(attackName, subtract)
          }
      }
    }
    ember(){
      if(this.EstadoDormir(this.playerOneEstaDormido,this.playerOneName,this.playerOneTurnosDormidos) === false){
        const random = Math.floor(Math.random() * 20) + 1;
        if (random !== 1){
          this.SoundPlaY(this.AudioEmber)
          this.showEmber = true
          setTimeout(() => {
            this.showEmber = false;
            this.playerOneAttack(30, 20, 'Ember')
          }, 400);
        }
        else{
          if(this.PrimerTurno=== true){
            this.PrimerTurno = false
          }
          this.gameStateText.nativeElement.innerText = `Charmeleon used Ember... But it missed`;
          this.intervalFunction();
        }
      }
      else{
        this.intervalFunction()
      }
    }
    protection(){
      if(this.EstadoDormir(this.playerOneEstaDormido,this.playerOneName,this.playerOneTurnosDormidos) === false){
        this.SoundPlaY(this.AudioProtect)
        this.playerOnePuedeRecibirDano = false;
        this.showProtection = true;
        setTimeout(() => {
          this.showProtection = false;
          this.playerOneAttack(0,100,'Protection');
        }, 1000);
      }
      else{
        this.intervalFunction()
      }
    }
    metalclaw(){
      if(this.EstadoDormir(this.playerOneEstaDormido,this.playerOneName,this.playerOneTurnosDormidos) === false){
        const random = Math.floor(Math.random() * 4) + 1;
        if (random !== 1){
          this.SoundPlaY(this.AudioMetalClaw)
          this.showMetalclaw = true;
          setTimeout(() => {
          this.showMetalclaw = false;
          this.playerOneAttack(15, 1, 'Meatl Claw')
          }, 600);
        }
        else {
          if(this.PrimerTurno=== true){
            this.PrimerTurno = false
          }
          this.gameStateText.nativeElement.innerText = `Charmeleon used Meatl Claw... But it missed`;
          this.intervalFunction();
        }
      }
      else{
        this.intervalFunction()
      }
    }
    tackle(){
      if(this.EstadoDormir(this.playerOneEstaDormido,this.playerOneName,this.playerOneTurnosDormidos) === false){
        const random = Math.floor(Math.random() * 10) + 1;
        if (random !== 1){
          this.SoundPlaY(this.AudioTackle);
          this.showTackle = true;
          setTimeout(() => {
            this.showTackle = false;
            this.playerOneAttack(10, 10, 'Tackle')
          }, 600);
        }
        else {
          if(this.PrimerTurno=== true){
            this.PrimerTurno = false
          }
          this.gameStateText.nativeElement.innerText = `Charmeleon used Tackle... But it missed`;
          this.intervalFunction();
        }
      }
      else{
        this.intervalFunction()
      }
    }
    protectionAniamtionEnemy(){
      this.SoundPlaY(this.AudioProtect)
      this.showProtectEnemy = true;
        setTimeout(() => {
          console.log("wa")
          this.showProtectEnemy = false;
        }, 1000);
    }

//Funciones de Audio Del Juego
  //Funcion para reproducir los effectos de sonidos de los ataques
  SoundPlaY(aaudio: string){
    let audio = new Audio(aaudio);
    audio.play();
  }
  //Funcion para reporducir la musica de pelea de fondo
   playGameMusic() {
    if (!this.BattleAudioPlaying) {
      this.BackGroundAudio.play().then(() => {
        this.BattleAudioPlaying = true;
      }).catch((err) => {
        console.error('No se pudo reproducir la música del juego:', err);
      });
    }
  }
  //Funcion para parar la musica de pelea de fondo
  stopGameMusic() {
    if (this.BattleAudioPlaying) {
      this.BackGroundAudio.pause();
      this.BackGroundAudio.currentTime = 0;
      this.BattleAudioPlaying = false;
    }
  }
  //Funcion para reproducir la musica de la pantalla de victoria
  playVictoryMusic() {
    if (!this.VictoryAudioPlaying) {
      this.AudioVictory.play().then(() => {
        this.VictoryAudioPlaying = true;
      }).catch((err) => {
        console.error('No se pudo reproducir la música del juego:', err);
      });
    }
  }
  //Funcion para parar la musica de la pantalla de victoria
  stopVictoryMusic() {
    if (this.VictoryAudioPlaying) {
      this.AudioVictory.pause();
      this.AudioVictory.currentTime = 0;
      this.VictoryAudioPlaying = false;
    }
  }

}

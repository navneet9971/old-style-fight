const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
    position: {
        x:0,
        y:0
    },
    imageSrc: './background.png'
})

const shop = new Sprite({
    position: {
        x:600,
        y:154.7
    },
    imageSrc: './shop.png',
    scale: 2.55,
    framesMax: 6
})


const player = new Fighter({
    position: {
    x:0,
    y:0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 0,
        y: 0,
    },
    imageSrc: './Sprites1/Idle.png',
    framesMax: 8,
    scale: 2.2,
    offset:{
        x: 215,
        y: 217
    },
    sprites: {
        idle: {
            imageSrc: './Sprites1/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './Sprites1/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './Sprites1/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Sprites1/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './Sprites1/Attack1.png',
            framesMax: 8
        },
        takeHit: {
            imageSrc: './Sprites1/Take hit.png',
            framesMax: 3
        },
      death: {
        imageSrc: './Sprites1/Death.png',
        framesMax: 7
      }

    },
    attackBox: {
        offset: {
        x: 50,
        y: 20
    },
    width: 190,
    height: 50
  }
})

const enemy = new Fighter({
    position: {
    x: 400,
    y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
    },

    imageSrc: './Kanji/Idle.png',
    framesMax: 4,
    scale: 2.2,
    offset:{
        x: 20,
        y: 130
    },
    sprites: {
        idle: {
            imageSrc: './Kanji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './Kanji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './Kanji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './Kanji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './Kanji/Attack1.png',
            framesMax: 4
        },

        takeHit:{
            imageSrc: './Kanji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc: './Kanji/Death.png',
            framesMax: 7
          }
   },
   attackBox: {
    offset: {
    x: 15,
    y: 50
},
width: 170,
height: 50
}

})



console.log(player)

const keys ={
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
    
}

function rectangularCollision({ rectangle1, rectangle2 }) {
 return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= 
        rectangle2.position.x && 
        rectangle1.attackBox.position.x <= 
        rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= 
        rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
 )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
     }else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
     }else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
}

let timer = 60
let timerId
function decreaseTimer(){
    if(timer > 0) {
  timerId = setTimeout(decreaseTimer, 1000)
timer--
    document.querySelector('#timer').innerHTML = timer
 } 
 
 if (timer === 0) {
    determineWinner({player, enemy})
}
}

decreaseTimer()

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()
    


    player.velocity.x = 0
    enemy.velocity.x = 0

    //player movement
  
    if(keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastkey === 'd') {
        player.switchSprite('run')
        player.velocity.x = 5
    }else {
        player.switchSprite('idle')
    }
    //jumping
    if(player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0){
        player.switchSprite('fall')
    }


     //enemy movement
     if(keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchSprite('run')
    }else{
        enemy.switchSprite('idle')
    }

      //jumping
      if(enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall')
    }

    //detect for collision and enemy gets hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
      }) &&
        player.isAttacking && 
        player.framesCurrent === 2
        ) {
            enemy.takeHit()
            player.isAttacking = false
          
        gsap.to('#enemyHealth', {
         width: enemy.health + '%'
        })
    }

 //if playes misses

 if(player.isAttacking && player.framesCurrent === 2) {
    player.isAttacking = false
}

//this is where our player gets hit
if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
       }) &&
        enemy.isAttacking && 
        enemy.framesCurrent === 2
        ) {
            player.takeHit()
            enemy.isAttacking = false
            
            gsap.to('#playerHealth', {
                width: player.health + '%'
               })
    }

    //if Enemy misses

if(enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
}

    //end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
     determineWinner({player, enemy, timerId})
    }
}

animate()

window.addEventListener('keydown', (event) => {
    if (!player.dead) {

    switch (event.key) {
        case 'd':
            keys.d.pressed = true 
             player.lastkey ='d'

        break
        case 'a':
            keys.a.pressed = true
            player.lastkey = 'a'    
            break
        case 'w':
            player.velocity.y = -20
            break
        case's':
            player.attack()
            break
    }
}

    if( !enemy.dead){
    switch(event.key){
    case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
        
            break
        case 'ArrowLeft':
             keys.ArrowLeft.pressed = true 
             enemy.lastkey = 'ArrowLeft'      
            break
        case 'ArrowUp':
              enemy.velocity.y = -20
            break  
            case 'ArrowDown':
            enemy.attack()    

              break   

    }
}
    
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
        keys.d.pressed = false 
        break
        case 'a':
        keys.a.pressed = false  
        break
    }

    //enemy keys
    switch (event.key) {
        case 'ArrowRight':
        keys.ArrowRight.pressed = false 
        break
        case 'ArrowLeft':
        keys.ArrowLeft.pressed = false  
        break
    } 
    
})




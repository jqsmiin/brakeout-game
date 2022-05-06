const rulesBtn = document.getElementById('rules-btn');
const rules = document.getElementById('rules');
const closeBtn = document.getElementById('close-btn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const bricksRowCount = 9;
const bricksColumnCount = 5;
let score = 0;
// Create ball props
const ball = {
    x : canvas.width / 2,
    y : canvas.height / 2,
    size : 10,
    speed : 4,
    dx : 4,
    dy : -4
}
// Create paddle props
const paddle = {
    x : canvas.width / 2 - 40,
    y : canvas.height -20,
    w : 80,
    h : 10,
    speed : 8,
    dx : 0
}
// Create bricks props
const brickInfo = {
    w : 70,
    h: 20,
    padding : 10,
    offsetX : 45,                       
    offsetY : 60,
    visible : true
}
const bricks = [];
for(let i = 0; i < bricksRowCount; i++){
    bricks[i] = []
    for(let j = 0; j < bricksColumnCount; j++){
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo }
    }
}
// Draw Ball
function drawBall(){
    const {x, y, size} = ball;
    ctx.beginPath()
    ctx.arc(x, y, size, 0, 2 * Math.PI);
    ctx.fillStyle = '#0095dd'
    ctx.fill()
    ctx.closePath()
}
// Draw Paddle
function drawPaddle(){
    const {x, y, w, h} = paddle;
    ctx.beginPath()
    ctx.rect(x, y, w, h)
    ctx.fillStyle = '#0095dd'
    ctx.fill()
    ctx.closePath()
}
// Draw Score
function drawScore(){
    ctx.font = "20px Arial";
    ctx.fillText(`Score : ${score}`, canvas.width -100, 30);
}
// Draw Bricks
function drawBricks(){
    bricks.forEach((column) =>{
        column.forEach((brick)=>{
            const {x, y, w, h} = brick;
            ctx.beginPath()
            ctx.rect(x, y, w, h)
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill()
            ctx.closePath()
        })
    })
}
// Move Paddle
function movePaddle(){
    paddle.x += paddle.dx;

    if(paddle.x + paddle.w > canvas.width){
        paddle.x = canvas.width - paddle.w;
    }
    if(paddle.x < 0){
        paddle.x = 0
    }
}
function moveBall(){
    ball.x += ball.dx;
    ball.y += ball.dy;
    // Wall collision
    if(ball.x + ball.size > canvas.width || ball.x + ball.size < 0){
       ball.dx *= -1;
    }else if(ball.y + ball.size > canvas.height || ball.y + ball.size < 0){
        ball.dy *= -1;
    }
    // Paddle collision
    if(ball.x - ball.size > paddle.x &&
       ball.x + ball.size < paddle.x + paddle.w &&
       ball.y + ball.size > paddle.y  
    ){
        ball.dy = -ball.speed
    }
    // Bricks collision
    bricks.forEach(column =>{
        column.forEach(brick =>{
            if(brick.visible){
                if(
                    ball.x - ball.size > brick.x && // left brick side check
                    ball.x + ball.size < brick.x + brick.w && // right brick side check
                    ball.y + ball.size > brick.y && // top brick side check
                    ball.y - ball.size < brick.y + brick.h // bottom brick side check
                   ){
                       ball.dy *= -1;
                       brick.visible = false;
                       increaseScore()
                   }
            }
        })
    })
    if(ball.y + ball.size > canvas.height){
        score = 0;
        showAllBricks()
    }
}
function increaseScore(){
    score++;
    if(score % (bricksRowCount * bricksRowCount) === 0){
        showAllBricks()
    }
}

function showAllBricks(){
    bricks.forEach(column =>{
      column.forEach(brick => brick.visible = true)
    })
}
// Call Function
function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawPaddle()
    drawBall()
    drawScore()
    drawBricks()
}
// Update
function update(){
    movePaddle()
    moveBall()
    draw()

    requestAnimationFrame(update)
}
update()
function keyDown(e){
    if(e.key === 'ArrowRight' || e.key === 'Arrow'){
        paddle.dx = paddle.speed
    } else if(e.key === 'ArrowLeft' || e.key === 'Left'){
        paddle.dx = -paddle.speed
    }
}
function keyUp(e){
   if(e.key === 'ArrowRight' || e.key === 'Arrow' || 
   e.key === 'ArrowLeft' || e.key === 'Left'){
       paddle.dx = 0;
   }
}


// Event listeners for key
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)



// Rules and close event listeners
rulesBtn.addEventListener('click', () =>{
    rules.classList.add('show')
   })
   closeBtn.addEventListener('click', () =>{
       rules.classList.remove('show')
   })
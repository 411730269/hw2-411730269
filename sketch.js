let countdown = 60; // 設定倒數時間為 60 秒
let points = [[-28,0], [-27,5], [-22,11],
[-18,12], [-15,14], [-14,18], [-14,21],[-13,24], [-11,25], [-8,24], [-8,21],
[-11,16], [-8,20], [-6,22], [-5,22], [-3,20], [-4,18], [-9,10], [-9,8], [-7,7], [-4,7],
[0,8], [5,8], [16,4],[21,-1], [23,-5], [23,-12], [26,-11], [28,-11], [28,-13],
[25,-17], [20,-18], [17,-22], [11,-24], [3,-25], [1,-24], [1,-22], [4,-20], [5,-20],
[-2,-18], [-3,-18], [-6,-22], [-8,-22], [-9,-21], [-10,-23], [-13,-24], [-16,-24],
[-17,-23], [-16,-21], [-13,-19], [-13,-17], [-17,-13], [-20,-7], [-19,-6], [-25,-5],
[-27,-4], [-28,-2],[-28,0], [-27,5], [-22,11]]

let score = 0; // 初始分數為 0
let isGameOver = false; // 初始遊戲狀態為未結束


var stroke_colors = "064789-427aa1-ebf2fa-679436-a5be00".split("-").map(a=>"#"+a)
var fill_colors = "fec5bb-fcd5ce-fae1dd-f8edeb-e8e8e4-d8e2dc-ece4db-ffe5d9-ffd7ba-fec89a".split("-").map(a=>"#"+a)
var monster_color = "064789-427aa1-ebf2fa-679436-a5be00".split("-").map(a=>"#"+a)

function preload(){
  laughing_sound = loadSound("sound/laughing.mp4")
  throwing_sound = loadSound("sound/throwing.wav")
}

//兔子(粒子、類別)//
class Obj{
  constructor(args){ //預設值，基本資料(包含有物件的顏色，位置，大小...)
    //this.p = args.p || {x:random(width),y:random(height)}
    this.p = args.p || createVector(random(width),random(height)) //向量
    //this.v= {x:random(-1,1),y:random(-1,1)}
    this.v= createVector(random(-1,1),random(-1,1)) //產生一個x軸座標值為random(-1,1)，y軸座標值為random(-1,1)
    this.size= random(1,3)
    this.color= random(fill_colors)
    this.stroke= random(stroke_colors)
  }
  draw() //把物件畫出來的函數
  {
    push()
      translate(this.p.x,this.p.y)
      scale((this.v.x<0?1:-1),-1) //放大縮小的指令，this.v.x<0?1:-1 ==> this.v.x<0條件成立的話，則值為1，否則為-1             
      fill(this.color)
      stroke(this.stroke)
      strokeWeight(2)
      beginShape()
      for(var i=0;i<points.length-1;i=i+1){
        //line(points[i][0]*this.size,points[i][1]*this.size,points[i+1][0]*this.size,points[i+1][1]*this.size)
      vertex(points[i][0]*this.size,points[i][1]*this.size)
      }
      endShape()
    pop()
  }

  update(){  //移動後設定位置資料值為何

//移動的程式碼++++++++++++++++++++++++++++++++
    // this.p.x = this.p.x + this.v.x
    // this.p.y = this.p.y + this.v.y
    this.p.add(this.v)  //此行的效果跟上面兩行一樣，add為向量加法

//算出滑鼠位置的向量

//let mouseV = createVector(mouseX,mouseY)  //把目前滑鼠位置轉換成向量值
//let delta = mouseV.sub(this.p).limit(3)  //delta值紀錄與滑鼠方向移動的"單位"距離，sub為向量減法，limit為每次移動單位距離
// let delta = mouseV.sub(this.p).limit(this.v.mag()*2)  //與原本物件速度有關，this.v.mag()==>取得物件的速度值
// this.p.add(delta)

//碰壁的處理程式碼++++++++++++++++++++++++++++++++
    if(this.p.x<=0 || this.p.x>=width)
  {
    this.v.x=-this.v.x
  }
  if(this.p.y<=0 || this.p.y>=height)
  {
    this.v.y=-this.v.y
  }
  } 
  isBallInRanger(x,y){   //判斷有沒有被滑鼠按到
    let d = dist(x,y,this.p.x,this.p.y)
    if(d<this.size*4){  //4的由來:去看座標點最大的值，以此作為被點選方框的高與寬
      return true   //代表距離有在範圍內
    }else{
      return false  //代表距離沒有在範圍內
    }
  }
}


//飼料投餵機//
class Bullet{
  constructor(args){ //預設值，基本資料(包含有物件的顏色，位置，大小...)
    this.r = args.r || 10 //如果飛彈有傳回直徑的大小，就以參數為直徑，否則預設為10
    this.p = args.p || shipP.copy() //飛彈起始的位置(以向量方式表示該座標)，要以中間砲台發射，所以座標為()
    this.v = args.v || createVector(mouseX-width/2,mouseY-height/2).limit(2) //飛彈速度
    this.color= args.color || "red" //飛彈顏色
  }
  draw(){  //劃出飛彈
    push()
      translate(this.p.x,this.p.y)
      fill("orange")
      noStroke()
      ellipse(0,0,this.r)
      //rectMode(CENTER)
      //rect(0,0,20,40)
      //triangle()
    pop()
  }
  update(){  //計算移動後的位置
    this.p.add(this.v)

  }
}

class Monster{
  constructor(args){ //預設值，基本資料(包含有物件的顏色，位置，大小...)
    this.r = args.r || 50 //如果飛彈有傳回直徑的大小，就以參數為直徑，否則預設為10
    this.p = args.p || createVector(random(width),random(height)) //飛彈起始的位置(以向量方式表示該座標)，要以中間砲台發射，所以座標為()
    this.v = args.v || createVector(random(-1,1),random(-1,1))
    this.color= args.color || random(monster_color) //飛彈顏色
    this.mode = random(["happy","bad"])
    this.IsDead = false
    this.timeum=0
  }
  draw(){  
    if(this.IsDead==false){
    push()
      translate(this.p.x,this.p.y)
      fill(this.color)
      noStroke()
      ellipse(0,0,this.r)
      if(this.mode == "happy"){
        fill(255)
        ellipse(0,0,this.r/2)
        fill(0)
        ellipse(0,0,this.r/3)
      }
      else{
        fill(255)
        arc(0,0,this.r/2,this.r/2,0,PI)
        fill(0)
        arc(0,0,this.r/2,this.r/3,0,PI)
      }
      stroke(this.color)
      strokeWeight(4)
      //line(this.r/2,0,this.r,0)
      noFill();
      for(var j=0;j<8;j++){
        rotate(PI/4)
        beginShape()
        for(var i=0;i<30;i++){
        vertex(this.r/2+i,sin(i/5+frameCount/10)*10)
        }
        endShape()
      }  
    pop()
  }
  else{
    this.timeum=this.timeum+1
    push()
    translate(this.p.x,this.p.y)
      fill(this.color)
      noStroke()
      ellipse(0,0,this.r)
      line(-this.r/3,0,this.r/3,0)
      stroke(this.color)
      strokeWeight(4)
      //line(this.r/2,0,this.r,0)
      noFill();
      for(var j=0;j<8;j++){
        rotate(PI/4)
        line(this.r/2,0,this.r,0)
      }
      pop()
  }


  
}
update(){  //計算移動後的位置
  this.p.add(this.v)
  if(this.p.x<=0 || this.p.x>=width)
  {
    this.v.x=-this.v.x
  }
  if(this.p.y<=0 || this.p.y>=height)
  {
    this.v.y=-this.v.y
  }
}
isBallInRanger(x,y){   //判斷有沒有被滑鼠按到
  let d = dist(x,y,this.p.x,this.p.y)
  if(d<this.r/2){  //4的由來:去看座標點最大的值，以此作為被點選方框的高與寬
    return true   //代表距離有在範圍內
  }else{
    return false  //代表距離沒有在範圍內
  }
}
}
var ball  //代表單一個物件，利用這個變數來做正在處理的物件
var balls=[]
var bullet
var bullets = []
var monster
var monsters = []
var shipP


function setup(){  //設定大象倉庫內的資料
  let canvas = createCanvas(windowWidth,windowHeight)
  canvas.position(0, 0); // 設定畫布位置為螢幕左上角
  canvas.style('z-index', '9999'); // 設定畫布的層級為最上方
  textAlign(CENTER, CENTER); // 設定文字對齊方式
  textSize(50); // 設定文字大小
  fill(0); // 設定文字顏色為黑色

  shipP = createVector(width/2,height/2)
  for (var j=0;j<25;j=j+1){
    ball = new Obj({})  //產生一個新物件，"暫時"放在ball中
    balls.push(ball)  //把ball物件放入到balls物件倉庫(陣列)中
  }
 for (var j=0;j<15;j=j+1){
    monster = new Monster({})  //產生一個新物件，"暫時"放在ball中
    monsters.push(monster)  //把ball物件放入到balls物件倉庫(陣列)中
 }
}

function draw(){  //每秒執行60次
  background(220); 
  //for(var k=0;k<balls.length;k=k+1){
  //  ball = balls[k]
  //  ball.draw()
  //  ball.update()
  //}
  let seconds = countdown- floor(millis() / 1000);

  if (seconds >= 0 && !isGameOver) {
    text("倒數         秒    ", width / 2, height / 10)
    text(seconds, width / 2, height / 10); // 在畫布中央顯示倒數秒數
  } else {
    text("Time's up!", width / 2, height / 10); // 倒數結束時顯示訊息
    noLoop(); // 停止 draw() 函數的執行
    isGameOver = true; // 設定遊戲狀態為已結束
    showResult(); // 顯示結果視窗
  }
  
  if(keyIsPressed){
    if(key==" "){
      bullet = new Bullet({
        r:random(10,30),
        color:random(stroke_colors)
      })
      bullets.push(bullet)
      bullet_sound.play()
      } 
    
  if(key=="ArrowLeft" || key=="a"){
    shipP.x = shipP.x-5
  }
  if(key=="ArrowRight" || key=="d"){
    shipP.x = shipP.x+5
  }
  if(key=="ArrowUp" || key=="w"){
    shipP.y = shipP.y-5
  }
  if(key=="ArrowDown" || key=="s"){
    shipP.y = shipP.y+5
  }
}

for(let ball of balls){  //針對陣列變數
  ball.draw()
  ball.update()
  for(let bullet of bullets){
    if(ball.isBallInRanger(bullet.p.x,bullet.p.y))
    {
      score = score + 1
      laughing_sound.play()
      balls.splice(balls.indexOf(ball),1)
      bullets.splice(bullets.indexOf(bullet),1)
    }
}
}

for (let bullet of bullets){  //針對飛彈倉庫內的資料，一筆一筆顯示出來
  bullet.draw()
  bullet.update()
}
  //由此判斷，每隻大象有沒有接觸每個飛彈
for (let monster of monsters){  //針對飛彈倉庫內的資料，一筆一筆顯示出來
  if(monster.IsDead && monster.timeum==3){
  monsters.splice(monsters.indexOf(monster),1)
}
  monster.draw()
  monster.update()
  for(let bullet of bullets){
    if(monster.isBallInRanger(bullet.p.x,bullet.p.y))
    {
      score = score - 1
      //elephant_sound.play()
      //monsters.splice(monsters.indexOf(monster),1)
      monster.IsDead = true
      bullets.splice(bullets.indexOf(bullet),1)
    }
  }
}

textSize(50)
text("分數:",width /15,height / 10)
text(score,width /7,height / 10)

push()
  let dx = mouseX-width/2
  let dy = mouseY-height/2
  let angle = atan2(dy,dx)

  translate(shipP.x,shipP.y)
  rotate(angle)
  noStroke()
  fill("#064789")
  triangle(50,0,-25,-25,-25,25)
pop()

}

function keyPressed() {
  if (keyCode === UP_ARROW && !isGameOver) {
    score++; // 每按一次 UP_ARROW 鍵，分數增加 1
  }
}

function showResult() {
  let result = score >= 5 ? "Win!" : "Lose..."; // 根據分數決定結果文字

  // 顯示結果視窗
  let resultDiv = createDiv(result);
  resultDiv.style('font-size', '150px');
  resultDiv.style('text-align', 'center');
  resultDiv.style('position', 'absolute');
  resultDiv.style('top', '200px');
  resultDiv.style('left', '200px');
  resultDiv.style('width', '450px');
  resultDiv.style('height', '200px');
  resultDiv.style('background-color', 'white');
  resultDiv.style('border', '2px solid black');
  resultDiv.style('z-index', '9999');
}

function mousePressed(){
  
bullet = new Bullet({
  r:random(10,30),
  color:random(stroke_colors)
})
bullets.push(bullet)
throwing_sound.play()
}
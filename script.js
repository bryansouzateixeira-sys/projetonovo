
:root{--bg:#070b1c;--pn:rgba(16,24,52,.88);--tx:#eef2ff;--mu:#97a3cc;--ac:#ffb938;--ln:#2a3868;color-scheme:dark}
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
html,body{margin:0;height:100%;overflow:hidden;background:var(--bg);color:var(--tx);font:500 15px/1.4 Fredoka,ui-rounded,"Trebuchet MS",system-ui,sans-serif;user-select:none;-webkit-user-select:none;touch-action:none}
#c{position:fixed;inset:0;width:100%;height:100%;display:block}
.hud{position:fixed;z-index:2;pointer-events:none;display:none}
.play .hud{display:block}
#sc{left:calc(env(safe-area-inset-left,0px) + 14px);bottom:calc(env(safe-area-inset-bottom,0px) + 14px);background:var(--pn);padding:8px 14px;border-radius:14px}
#sc b{color:var(--ac);font-size:1.2em}
#lb{right:calc(env(safe-area-inset-right,0px) + 12px);top:calc(env(safe-area-inset-top,0px) + 12px);background:var(--pn);padding:10px 12px;border-radius:14px;min-width:164px;font-size:13px}
#lb h4{margin:0 0 6px;font-size:14px;font-weight:700;color:var(--mu)}
#lb div{display:flex;justify-content:space-between;gap:12px;white-space:nowrap}
#lb .me{color:var(--ac);font-weight:700}
#mm{left:calc(env(safe-area-inset-left,0px) + 12px);top:calc(env(safe-area-inset-top,0px) + 12px);width:108px;height:108px;border-radius:50%;background:var(--pn)}
.play #bst{display:none}
.touch.play #bst{display:block;pointer-events:auto;right:calc(env(safe-area-inset-right,0px) + 18px);bottom:calc(env(safe-area-inset-bottom,0px) + 22px);width:88px;height:88px;border-radius:50%;border:2px solid var(--ac);background:rgba(255,185,56,.16);color:var(--ac);font-size:36px}
#ov{position:fixed;inset:0;z-index:5;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(4,6,16,.55)}
.play #ov{display:none}
.card{width:100%;max-width:380px;text-align:center;background:var(--pn);border:1px solid var(--ln);border-radius:24px;padding:28px 22px;backdrop-filter:blur(6px)}
h1{margin:0 0 6px;font-size:36px;font-weight:700}
p{margin:0 0 16px;color:var(--mu)}
input{width:100%;padding:12px 14px;border-radius:14px;border:1px solid var(--ln);background:#0b1230;color:var(--tx);font:500 16px Fredoka,system-ui,sans-serif;text-align:center;user-select:text;-webkit-user-select:text}
#sks{display:flex;justify-content:center;flex-wrap:wrap;gap:8px;margin:14px 0}
.sk{width:32px;height:32px;border-radius:50%;border:2px solid transparent;padding:0;cursor:pointer}
.sk.on{border-color:#fff;transform:scale(1.15)}
#go{width:100%;padding:13px;border:0;border-radius:14px;background:var(--ac);color:#2a1700;font:700 18px Fredoka,system-ui,sans-serif;cursor:pointer}
small{display:block;margin-top:14px;color:var(--mu);font-size:13px}
const $=i=>document.getElementById(i),cv=$('c'),g=cv.getContext('2d'),mg=$('mm').getContext('2d'),de=document.documentElement;
const R=2600,FOOD=850,NB=14,TAU=Math.PI*2,OFF=[-1.9,-1.4,-1,-.65,-.35,-.12,0,.12,.35,.65,1,1.4,1.9];
const SK=[['#4df0a0','#1fa86c'],['#ff5d73','#ffb3bd'],['#4dc3ff','#2a6bff'],['#ffd24d','#ff8a3d'],['#c77dff','#7b4dff'],['#f2f2f2','#98a4c4'],['#ff7ad9','#ffd24d'],['#37e6e6','#ff5d73']];
const FC=['#ff6b6b','#ffd93d','#6bffb0','#6bc8ff','#c77dff','#ff9f43','#ff7ad9'];
const NM=['Jiboia','Sucuri','Naja','Cascavel','Coral','Jararaca','Mamba','Píton','Anaconda','Surucucu','Caninana','Biscoito','Pipoca','Serpentina','Nagini','Kaa','Ssssergio','Dona Cobra','Rastejante','Nhoque'];
let W,H,dpr,z=1,camx=0,camy=0,vx=0,vy=0,state='menu',snakes=[],food=[],rs=[],me=null,mx=0,my=0,md=false,kb=false,tb=false,last=0,hT=0,kills=0,best=0,skin=0;
try{best=+localStorage.getItem('cb')||0}catch(e){}
if('ontouchstart' in window||navigator.maxTouchPoints>0)de.classList.add('touch');
const rnd=(a,b)=>a+Math.random()*(b-a),ad=(a,b)=>((a-b+Math.PI)%TAU+TAU)%TAU-Math.PI;
const rad=m=>Math.min(26,9+Math.sqrt(m)*.38),nseg=m=>Math.min(360,8+Math.floor(m*.3));
const esc=s=>s.replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
function rsz(){dpr=Math.min(2,devicePixelRatio||1);W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr}
addEventListener('resize',rsz);rsz();
const tile=document.createElement('canvas');tile.width=tile.height=72;
const tc=tile.getContext('2d');tc.fillStyle='#111a38';tc.fillRect(0,0,72,72);tc.fillStyle='#1d2a55';
for(const [x,y] of [[18,18],[54,54]]){tc.beginPath();tc.arc(x,y,3,0,TAU);tc.fill()}
const pat=g.createPattern(tile,'repeat');
const sks=$('sks');
SK.forEach((c,i)=>{const b=document.createElement('button');b.className='sk'+(i?'':' on');b.setAttribute('aria-label','Cor '+(i+1));b.style.background='linear-gradient(135deg,'+c[0]+' 50%,'+c[1]+' 50%)';b.onclick=()=>{skin=i;[...sks.children].forEach((x,j)=>x.classList.toggle('on',j===i))};sks.append(b)});
 
function addFood(x,y,v,c){food.push({x,y,v,r:Math.min(9,3+Math.sqrt(v)*1.6),c,p:Math.random()*6})}
function spawnFood(){const a=rnd(0,TAU),d=Math.sqrt(Math.random())*(R-30);addFood(Math.cos(a)*d,Math.sin(a)*d,rnd(1,2.2),FC[Math.random()*FC.length|0])}
 
function mk(name,si,isBot,m){
  let x,y,t=0;
  do{const q=rnd(0,TAU),d=Math.sqrt(Math.random())*R*.8;x=Math.cos(q)*d;y=Math.sin(q)*d}
  while(isBot&&me&&!me.dead&&Math.hypot(x-me.seg[0].x,y-me.seg[0].y)<900&&t++<20);
  const a=rnd(0,TAU),r=rad(m),sp=r*.62,n=nseg(m),seg=[];
  for(let i=0;i<n;i++)seg.push({x:x-Math.cos(a)*sp*i,y:y-Math.sin(a)*sp*i});
  return{name,sk:SK[si],bot:isBot,m,a,want:a,seg,r,sp,dead:false,boost:false,bo:false,bt:0};
}
function mkBot(){
  const k=rnd(.45,.9),s=mk(NM[Math.random()*NM.length|0],Math.random()*SK.length|0,true,rnd(14,50));
  return Object.assign(s,{skill:k,vis:380+k*260,ti:.27-k*.17,tt:0,cd:rnd(2,8),hunt:0,prey:null,dz:0,bb:0,wa:s.a});
}
 
function move(s,dt){
  const r=rad(s.m),sp=r*.62,turn=4.4/(1+r*.025);
  s.r=r;s.sp=sp;
  s.a+=Math.max(-turn*dt,Math.min(turn*dt,ad(s.want,s.a)));
  const bo=s.boost&&s.m>14;s.bo=bo;
  if(bo){s.m-=4*dt;s.bt-=dt;if(s.bt<=0){s.bt=.2;const t=s.seg[s.seg.length-1];addFood(t.x,t.y,.8,s.sk[0])}}
  const v=bo?300:175,sg=s.seg,h=sg[0];
  h.x+=Math.cos(s.a)*v*dt;h.y+=Math.sin(s.a)*v*dt;
  const n=nseg(s.m);
  while(sg.length<n){const t=sg[sg.length-1];sg.push({x:t.x,y:t.y})}
  if(sg.length>n)sg.length=n;
  for(let i=1;i<sg.length;i++){const p=sg[i-1],q=sg[i],dx=p.x-q.x,dy=p.y-q.y,d=Math.hypot(dx,dy);if(d>sp){const k=(d-sp)/d;q.x+=dx*k;q.y+=dy*k}}
}
function eat(s,dt){
  const h=s.seg[0],m2=(s.r+46)*(s.r+46),e2=(s.r+7)*(s.r+7);
  for(let i=food.length-1;i>=0;i--){
    const f=food[i],dx=h.x-f.x,dy=h.y-f.y,d2=dx*dx+dy*dy;
    if(d2>m2)continue;
    if(d2<e2){s.m+=s.bot?f.v*Math.min(1,320/s.m):f.v;food[i]=food[food.length-1];food.pop();continue}
    const d=Math.sqrt(d2),k=Math.min(1,420*dt/d);f.x+=dx*k;f.y+=dy*k;
  }
}
function die(s,k){
  if(s.dead)return;s.dead=true;
  const n=s.seg.length,st=Math.max(1,Math.floor(n/28)),pv=Math.max(1.5,s.m*.6/Math.ceil(n/st));
  for(let i=0;i<n;i+=st){const q=s.seg[i];addFood(q.x+rnd(-8,8),q.y+rnd(-8,8),pv,s.sk[i%2])}
  if(k&&k===me&&s!==me)kills++;
  if(s===me){state='dead';setTimeout(showDead,900)}else rs.push(rnd(1.5,3.5));
}
function coll(){
  const out=[];
  for(const a of snakes){
    if(a.dead)continue;
    const h=a.seg[0];let k=null;
    if(Math.hypot(h.x,h.y)>R-a.r*.3)k=a;
    else for(const b of snakes){
      if(b===a||b.dead)continue;
      const bh=b.seg[0],lim=b.seg.length*b.sp+b.r+a.r+20;
      if(Math.abs(h.x-bh.x)>lim||Math.abs(h.y-bh.y)>lim)continue;
      const t2=(a.r+b.r)*(a.r+b.r)*.52;
      for(let i=0;i<b.seg.length;i++){const q=b.seg[i],dx=h.x-q.x,dy=h.y-q.y;if(dx*dx+dy*dy<t2){k=b;break}}
      if(k)break;
    }
    if(k)out.push([a,k===a?null:k]);
  }
  for(const [a,k] of out)die(a,k);
}
 
function ai(b,dt){b.cd-=dt;b.hunt-=dt;b.dz-=dt;b.tt-=dt;if(b.tt<=0){b.tt=b.ti*rnd(.8,1.25);think(b)}}
function think(b){
  const h=b.seg[0],v2=b.vis*b.vis,th=[];
  if(b.dz<=0&&Math.random()<.02*(1.3-b.skill))b.dz=rnd(.3,.6);
  for(const o of snakes){
    if(o===b||o.dead)continue;
    const oh=o.seg[0],d=Math.hypot(oh.x-h.x,oh.y-h.y);
    if(d>b.vis+o.seg.length*o.sp)continue;
    const hp=b.hunt>0&&b.prey===o;
    for(let i=0;i<o.seg.length;i+=2){const q=o.seg[i],ex=q.x-h.x,ey=q.y-h.y;if(ex*ex+ey*ey<v2)th.push(q.x,q.y,i?o.r:o.r*(hp?1:1.9))}
    if(!hp)th.push(oh.x+Math.cos(o.a)*70,oh.y+Math.sin(o.a)*70,o.r*1.4);
    if(b.hunt<=0&&b.cd<=0&&b.skill>.55&&b.m>30&&d<520&&o.m<b.m*1.5+40&&Math.random()<.15&&(o!==me||snakes.filter(x=>x.hunt>0&&x.prey===me).length<2)){b.prey=o;b.hunt=rnd(2.5,4.5);b.cd=b.hunt+rnd(6,12)}
  }
  let tx,ty,hv=false;
  if(b.hunt>0&&b.prey&&!b.prey.dead){
    const p=b.prey,ph=p.seg[0],dd=Math.hypot(ph.x-h.x,ph.y-h.y),L=Math.max(90,Math.min(260,dd*.7));
    tx=ph.x+Math.cos(p.a)*L;ty=ph.y+Math.sin(p.a)*L;hv=true;
  }else{
    let bs=0;
    for(const f of food){
      const dx=f.x-h.x,dy=f.y-h.y,d2=dx*dx+dy*dy;if(d2>v2)continue;
      const sc=f.v/(Math.sqrt(d2)+70)*(.55+.45*Math.cos(ad(Math.atan2(dy,dx),b.a)));
      if(sc>bs){bs=sc;tx=f.x;ty=f.y}
    }
    if(tx===undefined){
      b.wa=b.a+rnd(-.4,.4);
      if(Math.hypot(h.x,h.y)>R*.78){tx=0;ty=0}else{tx=h.x+Math.cos(b.wa)*300;ty=h.y+Math.sin(b.wa)*300}
    }
  }
  const ta=Math.atan2(ty-h.y,tx-h.x),r=b.r,pad=r*1.2+14,dz=b.dz>0?.45:1,lk=(b.bo?300:175)*.55+30,L3=[lk*.4,lk*.8,lk*1.4],W3=[3,2,1];
  let best=1e9,ba=b.a;
  for(const o of OFF){
    const an=b.a+o,c=Math.cos(an),s=Math.sin(an);let dg=0;
    for(let k=0;k<3;k++){
      const d=L3[k]*dz,px=h.x+c*d,py=h.y+s*d;let mc=R-Math.hypot(px,py)-r;
      for(let i=0;i<th.length;i+=3){const dx=px-th[i],dy=py-th[i+1],cl=Math.sqrt(dx*dx+dy*dy)-th[i+2]-r;if(cl<mc)mc=cl}
      dg+=W3[k]*Math.max(0,Math.min(2,1-mc/pad));
    }
    const cost=dg*9+Math.abs(ad(an,ta))+Math.abs(o)*.3;
    if(cost<best){best=cost;ba=an}
  }
  b.want=ba;
  if(b.bb>0)b.bb-=b.ti;else if(b.m>60&&Math.random()<.012)b.bb=rnd(.4,1);
  let bo=b.bb>0;
  if(hv){const dd=Math.hypot(tx-h.x,ty-h.y);bo=dd<380&&dd>50}
  b.boost=bo&&b.m>30;
}
 
function step(dt){
  if(me&&!me.dead){
    if(Math.hypot(mx-W/2,my-H/2)>12)me.want=Math.atan2(my-H/2,mx-W/2);
    me.boost=(md||kb||tb)&&me.m>14;
  }
  for(const s of snakes){if(s.dead)continue;if(s.bot)ai(s,dt);move(s,dt);eat(s,dt)}
  coll();
  snakes=snakes.filter(s=>!s.dead);
  while(food.length<FOOD)spawnFood();
  for(let i=rs.length-1;i>=0;i--)if((rs[i]-=dt)<=0){rs.splice(i,1);snakes.push(mkBot())}
}
 
function drawS(s){
  const sg=s.seg,r=s.r,n=sg.length,a=s.sk[0],b2=s.sk[1];
  for(let i=n-1;i>=0;i--){
    const q=sg[i];if(Math.abs(q.x-camx)>vx||Math.abs(q.y-camy)>vy)continue;
    const t=n-1-i,rr=t<6?r*(.55+.075*t):r;
    if(s.bo&&i%3===0){g.globalAlpha=.13;g.fillStyle=a;g.beginPath();g.arc(q.x,q.y,rr*1.8,0,TAU);g.fill();g.globalAlpha=1}
    g.fillStyle=i%6<3?a:b2;g.beginPath();g.arc(q.x,q.y,rr,0,TAU);g.fill();
    g.fillStyle='rgba(255,255,255,.16)';g.beginPath();g.arc(q.x-rr*.25,q.y-rr*.3,rr*.55,0,TAU);g.fill();
  }
  const h=sg[0],c=Math.cos(s.a),sn=Math.sin(s.a);
  for(const d of[-1,1]){
    const ex=h.x+c*r*.4-sn*r*.55*d,ey=h.y+sn*r*.4+c*r*.55*d;
    g.fillStyle='#fff';g.beginPath();g.arc(ex,ey,r*.38,0,TAU);g.fill();
    g.fillStyle='#10131f';g.beginPath();g.arc(ex+c*r*.14,ey+sn*r*.14,r*.2,0,TAU);g.fill();
  }
  if(s!==me){g.fillStyle='rgba(255,255,255,.75)';g.fillText(s.name,h.x,h.y-r-8/z)}
}
function draw(){
  const al=me&&!me.dead,hd=al?me.seg[0]:(snakes[0]?snakes[0].seg[0]:{x:camx,y:camy});
  if(al){camx=hd.x;camy=hd.y}else{camx+=(hd.x-camx)*.05;camy+=(hd.y-camy)*.05}
  const tz=Math.min(1,Math.max(.55,Math.min(W,H)/760))/(1+Math.min(me?me.m:16,2500)/1800);
  z+=(tz-z)*.05;vx=W/2/z+80;vy=H/2/z+80;
  g.setTransform(dpr,0,0,dpr,0,0);g.fillStyle='#070b1c';g.fillRect(0,0,W,H);
  g.translate(W/2,H/2);g.scale(z,z);g.translate(-camx,-camy);
  g.beginPath();g.arc(0,0,R,0,TAU);g.fillStyle=pat;g.fill();g.lineWidth=18;g.strokeStyle='rgba(255,61,90,.85)';g.stroke();
  const t=performance.now()/400;
  for(const f of food){
    if(Math.abs(f.x-camx)>vx||Math.abs(f.y-camy)>vy)continue;
    const r=f.r*(1+.12*Math.sin(t+f.p));
    g.fillStyle=f.c;g.globalAlpha=.2;g.beginPath();g.arc(f.x,f.y,r*2.2,0,TAU);g.fill();
    g.globalAlpha=1;g.beginPath();g.arc(f.x,f.y,r,0,TAU);g.fill();
  }
  g.font='600 '+(13/z)+'px Fredoka,system-ui,sans-serif';g.textAlign='center';
  for(const s of snakes)if(s!==me)drawS(s);
  if(al)drawS(me);
  mg.clearRect(0,0,216,216);mg.strokeStyle='#ff3d5a';mg.lineWidth=3;mg.beginPath();mg.arc(108,108,103,0,TAU);mg.stroke();
  for(const s of snakes){const h=s.seg[0];mg.fillStyle=s===me?'#fff':s.sk[0];mg.globalAlpha=s===me?1:.75;mg.beginPath();mg.arc(108+h.x/R*100,108+h.y/R*100,s===me?6:3.5,0,TAU);mg.fill()}
  mg.globalAlpha=1;
}
function hud(){
  const L=snakes.filter(s=>!s.dead).sort((a,b)=>b.m-a.m);
  let h='<h4>Ranking</h4>';
  L.slice(0,8).forEach((s,i)=>{h+='<div class="'+(s===me?'me':'')+'"><span>'+(i+1)+'. '+esc(s.name)+'</span><b>'+(s.m|0)+'</b></div>'});
  const al=me&&!me.dead,r=al?L.indexOf(me):-1;
  if(r>7)h+='<div class="me"><span>'+(r+1)+'. '+esc(me.name)+'</span><b>'+(me.m|0)+'</b></div>';
  $('lb').innerHTML=h;
  if(me)$('sc').innerHTML='<div>Pontuação <b>'+(me.m|0)+'</b></div><div>Abates <b>'+kills+'</b></div>';
}
function showDead(){
  const sc=me.m|0;
  if(sc>best){best=sc;try{localStorage.setItem('cb',best)}catch(e){}}
  $('ttl').textContent='Você morreu 💀';
  $('msg').innerHTML='Pontuação <b>'+sc+'</b><br>Abates <b>'+kills+'</b><br>Recorde <b>'+best+'</b>';
  $('go').textContent='Jogar de novo';de.classList.remove('play');
}
function world(withMe){
  snakes=[];food=[];rs=[];me=null;kills=0;
  for(let i=0;i<FOOD;i++)spawnFood();
  if(withMe){me=mk($('nm').value.trim().slice(0,14)||'Você',skin,false,16);snakes.push(me);md=kb=tb=false}
  for(let i=0;i<NB;i++)snakes.push(mkBot());
}
function start(){
  world(true);state='play';de.classList.add('play');$('ttl').textContent='Cobrinha.io';
  mx=W/2+100;my=H/2;camx=me.seg[0].x;camy=me.seg[0].y;
}
function loop(t){
  const dt=Math.min(.033,(t-last)/1000||0);last=t;
  step(dt);draw();
  if((hT-=dt)<=0){hT=.25;hud()}
  requestAnimationFrame(loop);
}
$('go').onclick=start;
$('nm').addEventListener('keydown',e=>{if(e.key==='Enter')start()});
addEventListener('pointermove',e=>{if(e.target===cv||e.pointerType==='mouse'){mx=e.clientX;my=e.clientY}});
cv.addEventListener('pointerdown',e=>{mx=e.clientX;my=e.clientY;if(e.pointerType==='mouse')md=true});
addEventListener('pointerup',e=>{if(e.pointerType==='mouse')md=false});
const bs=$('bst');bs.addEventListener('pointerdown',e=>{tb=true;e.preventDefault()});
['pointerup','pointercancel','pointerleave'].forEach(v=>bs.addEventListener(v,()=>{tb=false}));
addEventListener('keydown',e=>{if(e.target.tagName==='INPUT')return;if(e.code==='Space'||e.key==='Shift'){kb=true;e.preventDefault()}});
addEventListener('keyup',e=>{if(e.code==='Space'||e.key==='Shift')kb=false});
addEventListener('blur',()=>{md=kb=tb=false});
world(false);requestAnimationFrame(loop);

// Captura dos elementos
const gameContainer = document.getElementById('game-container');
const btnIniciar = document.getElementById('btnIniciar');
const btnFullscreen = document.getElementById('btnFullscreen');

// 1. AÇÃO DO BOTÃO "INICIAR JOGO"
btnIniciar.addEventListener('click', () => {
    // ⚠️ ATENÇÃO: Substitua 'iniciarSeuJogo()' pelo nome da função que começa o seu jogo!
    if (typeof iniciarSeuJogo === 'function') {
        iniciarSeuJogo();
    } else {
        console.log("Substitua 'iniciarSeuJogo()' pelo nome da sua função no JS.");
    }
});

// 2. AÇÃO DO BOTÃO "TELA CHEIA"
btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement && 
        !document.webkitFullscreenElement && 
        !document.msFullscreenElement) {
        
        // Entra em Tela Cheia
        if (gameContainer.requestFullscreen) {
            gameContainer.requestFullscreen();
        } else if (gameContainer.webkitRequestFullscreen) { /* Safari */
            gameContainer.webkitRequestFullscreen();
        } else if (gameContainer.msRequestFullscreen) { /* IE11 */
            gameContainer.msRequestFullscreen();
        }
    } else {
        // Sai da Tela Cheia
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
});
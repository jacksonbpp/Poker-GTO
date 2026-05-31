import { useState, useRef, useCallback } from "react";
import './index.css';

const SUITS = ["♠","♥","♦","♣"];
const RANKS = ["A","K","Q","J","T","9","8","7","6","5","4","3","2"];
const SUIT_COLORS = {"♠":"#e2e8f0","♣":"#a3e635","♥":"#f87171","♦":"#fb923c"};
const POSITIONS = ["UTG","UTG+1","MP","HJ","CO","BTN","SB","BB"];
const STREETS = ["Preflop","Flop","Turn","River"];
const PLAYER_TELLS = ["Hesitação longa","Bet rápido","Olha fichas ao ver flop","Respira fundo","Postura ereta","Postura relaxada","Tremor nas mãos","Evita contato visual","Contato visual forçado","Verbaliza muito","Silêncio incomum","Stack-off no topo"];
const PLAYER_TYPES = ["Desconhecido","TAG","LAG","Nit","Maniac","Fish","Reg","Calling Station"];
const BLINDS = [{lvl:1,sb:25,bb:50},{lvl:2,sb:50,bb:100},{lvl:3,sb:75,bb:150},{lvl:4,sb:100,bb:200},{lvl:5,sb:150,bb:300},{lvl:6,sb:200,bb:400},{lvl:7,sb:300,bb:600},{lvl:8,sb:400,bb:800},{lvl:9,sb:500,bb:1000},{lvl:10,sb:750,bb:1500},{lvl:11,sb:1000,bb:2000},{lvl:12,sb:1500,bb:3000}];
const S = {
  card:{background:"rgba(255,255,255,0.025)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:16,padding:"18px 16px",marginBottom:14},
  title:{fontSize:11,fontWeight:700,color:"#64748b",letterSpacing:2,textTransform:"uppercase",marginBottom:12},
  label:{display:"block",fontSize:11,color:"#64748b",marginBottom:4},
  input:{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"8px 11px",color:"#e2e8f0",fontSize:13,outline:"none",width:"100%"},
};

function CardPicker({label,selected,onChange,max=2}){
  const [open,setOpen]=useState(false);
  const toggle=c=>{if(selected.includes(c)){onChange(selected.filter(x=>x!==c));return;}if(selected.length<max)onChange([...selected,c]);};
  return(<div style={{position:"relative"}}><button onClick={()=>setOpen(!open)} style={{background:selected.length?"rgba(163,230,53,0.12)":"rgba(255,255,255,0.05)",border:`1px solid ${selected.length?"#a3e635":"rgba(255,255,255,0.1)"}`,borderRadius:8,padding:"8px 14px",cursor:"pointer",color:"#e2e8f0",fontSize:13,minWidth:90}}>{selected.length?selected.join(" "):label}</button>{open&&(<div style={{position:"fixed",zIndex:200,top:"50%",left:"50%",transform:"translate(-50%,-50%)",background:"#0d1525",border:"1px solid rgba(163,230,53,0.35)",borderRadius:16,padding:16,width:290,boxShadow:"0 30px 80px rgba(0,0,0,0.9)"}}>{SUITS.map(suit=>(<div key={suit} style={{display:"flex",gap:3,marginBottom:5,flexWrap:"wrap"}}>{RANKS.map(rank=>{const c=rank+suit,sel=selected.includes(c);return(<button key={c} onClick={()=>toggle(c)} style={{width:29,height:38,borderRadius:5,cursor:"pointer",background:sel?SUIT_COLORS[suit]:"rgba(255,255,255,0.06)",border:`1px solid ${sel?SUIT_COLORS[suit]:"rgba(255,255,255,0.1)"}`,color:sel?"#0f172a":SUIT_COLORS[suit],fontSize:10,fontWeight:"bold"}}>{rank}<br/>{suit}</button>);})}</div>))}<div style={{display:"flex",gap:8,marginTop:10}}><button onClick={()=>onChange([])} style={{flex:1,padding:8,borderRadius:8,cursor:"pointer",background:"rgba(248,113,113,0.12)",border:"1px solid rgba(248,113,113,0.3)",color:"#f87171",fontSize:12}}>Limpar</button><button onClick={()=>setOpen(false)} style={{flex:2,padding:8,borderRadius:8,cursor:"pointer",backg
function ScreenshotZone({image,onImage,onClear}){
  const ref=useRef();
  const handleFile=e=>{const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>onImage(ev.target.result);reader.readAsDataURL(file);};
  const handleDrop=e=>{e.preventDefault();const file=e.dataTransfer.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>onImage(ev.target.result);reader.readAsDataURL(file);};
  const handlePaste=useCallback(e=>{const items=e.clipboardData?.items;if(!items)return;for(const item of items){if(item.type.startsWith("image/")){const file=item.getAsFile();const reader=new FileReader();reader.onload=ev=>onImage(ev.target.result);reader.readAsDataURL(file);break;}};},[onImage]);
  return(<div onDrop={handleDrop} onDragOver={e=>e.preventDefault()} onPaste={handlePaste} tabIndex={0} style={{border:`2px dashed ${image?"rgba(163,230,53,0.5)":"rgba(255,255,255,0.12)"}`,borderRadius:14,padding:image?8:28,textAlign:"center",cursor:"pointer",background:image?"rgba(163,230,53,0.04)":"rgba(255,255,255,0.02)",outline:"none",position:"relative"}} onClick={()=>!image&&ref.current.click()}>
    <input ref={ref} type="file" accept="image/*" capture="environment" onChange={handleFile} style={{display:"none"}}/>
    {image?(<><img src={image} alt="screenshot" style={{width:"100%",maxHeight:300,objectFit:"contain",borderRadius:10,display:"block"}}/><button onClick={e=>{e.stopPropagation();onClear();}} style={{position:"absolute",top:12,right:12,background:"rgba(248,113,113,0.85)",border:"none",borderRadius:"50%",width:30,height:30,color:"#fff",cursor:"pointer",fontWeight:700,fontSize:16}}>×</button></>):(<><div style={{fontSize:40,marginBottom:10}}>📸</div><div style={{color:"#a3e635",fontWeight:700,fontSize:14,marginBottom:6}}>Cole, arraste ou tire foto da mesa</div><div style={{color:"#475569",fontSize:12,lineHeight:1.6}}>📋 Ctrl+V para colar print<br/>📱 Toque para abrir câmera/galeria</div></>)}
  </div>);
}

export default function App(){
  const [tab,setTab]=useState("screenshot");
  const [loading,setLoading]=useState(false);
  const [analysis,setAnalysis]=useState(null);
  const [history,setHistory]=useState([]);
  const [handNum,setHandNum]=useState(1);
  const [apiKey,setApiKey]=useState(localStorage.getItem("gto_api_key")||"");
  const [showKey,setShowKey]=useState(false);
  const [screenshot,setScreenshot]=useState(null);
  const [extraNotes,setExtraNotes]=useState("");
  const [myCards,setMyCards]=useState([]);
  const [board,setBoard]=useState([]);
  const [street,setStreet]=useState("Preflop");
  const [pot,setPot]=useState("");
  const [myPos,setMyPos]=useState("BTN");
  const [situation,setSituation]=useState("");
  const [tourney,setTourney]=useState({level:1,myStack:10000,remaining:50,total:50});
  const [players,setPlayers]=useState([
    {name:"",pos:"UTG",stack:10000,type:"Desconhecido",tells:[],notes:""},
    {name:"",pos:"MP",stack:10000,type:"Desconhecido",tells:[],notes:""},
    {name:"",pos:"CO",stack:10000,type:"Desconhecido",tells:[],notes:""},
  ]);
  const blinds=BLINDS[tourney.level-1];
  const bb=blinds.bb;
  const mRatio=(tourney.myStack/(blinds.sb+blinds.bb)).toFixed(1);
  const mColor=+mRatio>20?"#a3e635":+mRatio>10?"#fb923c":"#f87171";
  const updP=(i,k,v)=>setPlayers(prev=>prev.map((p,idx)=>idx===i?{...p,[k]:v}:p));
  const saveKey=k=>{localStorage.setItem("gto_api_key",k);setApiKey(k);};
  const tCtx=()=>`TORNEIO: Nível ${tourney.level} | Blinds ${blinds.sb}/${blinds.bb} | Stack: ${tourney.myStack} (${(tourney.myStack/bb).toFixed(1)} BBs) | M-Ratio: ${mRatio} | Jogadores: ${tourney.remaining}/${tourney.total}`;
  const pCtx=()=>{const a=players.filter(p=>p.name||p.tells.length||p.notes);if(!a.length)return"Sem perfis.";return a.map((p,i)=>`Oponente ${i+1}${p.name?` (${p.name})`:""}: ${p.pos} | ${p.stack} fichas | ${p.type}${p.tells.length?` | Tells: ${p.tells.join(", ")}`:""}${p.notes?` | ${p.notes}`:""}`).join("\n");};
  const inst=()=>`\nAnalise em português:\n🎯 LEITURA DA MÃO\n🧠 ANÁLISE GTO\n🔍 READS & TELLS\n⚡ DECISÃO RECOMENDADA\n🏆 FATOR TORNEIO\n⚠️ ALERTAS`;
    const analyzeScreenshot=async()=>{
    if(!screenshot){alert("Adicione uma imagem!");return;}
    if(!apiKey){alert("Configure sua API Key no ⚙️");return;}
    setLoading(true);setAnalysis(null);
    try{
      const base64=screenshot.split(",")[1];
      const mediaType=screenshot.split(";")[0].split(":")[1];
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-opus-4-5",max_tokens:1500,messages:[{role:"user",content:[{type:"image",source:{type:"base64",media_type:mediaType,data:base64}},{type:"text",text:`Você é coach de poker GTO.\n${tCtx()}\n${pCtx()}\nNotas: ${extraNotes||"Nenhuma"}\nAnalise esta screenshot da mesa. Identifique cartas, pot, stacks, posições e dê análise completa.${inst()}`}]}]})});
      const data=await res.json();
      if(data.error)throw new Error(data.error.message);
      const text=data.content?.map(b=>b.text||"").join("")||"Erro.";
      setAnalysis(text);
      setHistory(prev=>[{id:handNum,timestamp:new Date().toLocaleTimeString("pt-BR"),type:"screenshot",image:screenshot,analysis:text},...prev]);
      setHandNum(n=>n+1);
    }catch(e){setAnalysis(`❌ Erro: ${e.message}`);}
    setLoading(false);
  };

  const analyzeManual=async()=>{
    if(myCards.length<2){alert("Selecione suas 2 cartas!");return;}
    if(!apiKey){alert("Configure sua API Key no ⚙️");return;}
    setLoading(true);setAnalysis(null);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":apiKey,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:"claude-opus-4-5",max_tokens:1500,messages:[{role:"user",content:`Você é coach de poker GTO.\n${tCtx()}\nPosição: ${myPos}\nCartas: ${myCards.join(" ")}\nStreet: ${street}\nBoard: ${board.length?board.join(" "):"preflop"}\nPot: ${pot||"não informado"}\nSituação: ${situation||"não descrita"}\n${pCtx()}${inst()}`}]})});
      const data=await res.json();
      if(data.error)throw new Error(data.error.message);
      const text=data.content?.map(b=>b.text||"").join("")||"Erro.";
      setAnalysis(text);
      setHistory(prev=>[{id:handNum,timestamp:new Date().toLocaleTimeString("pt-BR"),type:"manual",myCards:[...myCards],board:[...board],street,analysis:text},...prev]);
      setHandNum(n=>n+1);
    }catch(e){setAnalysis(`❌ Erro: ${e.message}`);}
    setLoading(false);
  };

  const reset=()=>{setAnalysis(null);setScreenshot(null);setExtraNotes("");setMyCards([]);setBoard([]);setPot("");setSituation("");};
  const renderA=txt=>txt.split("\n").map((line,i)=>{const h=/^[🎯🧠🔍⚡🏆⚠️]/.test(line);return<div key={i} style={{marginBottom:h?10:3,marginTop:h?16:0,color:h?"#a3e635":"#cbd5e1",fontWeight:h?700:400,fontSize:h?14:13,lineHeight:1.7}}>{line}</div>;});
                                         return(<div style={{minHeight:"100vh",background:"#080c14",paddingBottom:80}}>
    <div style={{background:"linear-gradient(180deg,#0d1525,#080c14)",borderBottom:"1px solid rgba(163,230,53,0.15)",padding:"14px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:50}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:24}}>🃏</span>
        <div><div style={{color:"#a3e635",fontSize:16,fontWeight:700}}>GTO POKER AI</div><div style={{fontSize:10,color:"#475569"}}>Tournament Analyzer</div></div>
      </div>
      <div style={{display:"flex",gap:14,alignItems:"center"}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:9,color:"#475569"}}>M-RATIO</div><div style={{fontSize:14,color:mColor,fontWeight:700}}>{mRatio}</div></div>
        <button onClick={()=>setShowKey(!showKey)} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:8,padding:"6px 10px",cursor:"pointer",color:"#94a3b8",fontSize:16}}>⚙️</button>
      </div>
    </div>
    {showKey&&(<div style={{background:"#0d1525",borderBottom:"1px solid rgba(163,230,53,0.2)",padding:"14px 16px"}}>
      <label style={S.label}>Chave API Anthropic</label>
      <div style={{display:"flex",gap:8}}>
        <input type="password" value={apiKey} onChange={e=>saveKey(e.target.value)} placeholder="sk-ant-api03-..." style={S.input}/>
        <button onClick={()=>setShowKey(false)} style={{padding:"8px 14px",borderRadius:8,background:"rgba(163,230,53,0.15)",border:"1px solid rgba(163,230,53,0.3)",color:"#a3e635",cursor:"pointer",fontWeight:700}}>OK</button>
      </div>
      <div style={{fontSize:11,color:"#475569",marginTop:6}}>Obtenha em: console.anthropic.com → API Keys</div>
    </div>)}
    <div style={{maxWidth:640,margin:"0 auto",padding:"16px 14px"}}>
      <div style={{display:"flex",background:"rgba(255,255,255,0.03)",borderRadius:12,padding:4,marginBottom:16,gap:4}}>
        {[["screenshot","📸"],["manual","🃏"],["players","👥"],["tourney","🏆"],["history","📋"]].map(([id,lbl])=>(
          <button key={id} onClick={()=>{setTab(id);setAnalysis(null);}} style={{flex:1,padding:"8px 4px",borderRadius:9,border:"none",cursor:"pointer",background:tab===id?"rgba(163,230,53,0.15)":"transparent",color:tab===id?"#a3e635":"#64748b",fontWeight:tab===id?700:400,fontSize:13}}>{lbl}</button>
        ))}
      </div>
      {tab==="screenshot"&&(<div>
        <div style={S.card}>
          <ScreenshotZone image={screenshot} onImage={setScreenshot} onClear={()=>setScreenshot(null)}/>
          {screenshot&&<textarea value={extraNotes} onChange={e=>setExtraNotes(e.target.value)} placeholder="Notas adicionais..." rows={3} style={{...S.input,marginTop:12,resize:"vertical"}}/>}
        </div>
        {screenshot&&<button onClick={analyzeScreenshot} disabled={loading} style={{width:"100%",padding:"15px",borderRadius:12,cursor:loading?"not-allowed":"pointer",background:loading?"rgba(163,230,53,0.15)":"linear-gradient(135deg,#65a30d,#a3e635)",border:"none",color:loading?"#a3e635":"#0f172a",fontWeight:800,fontSize:16}}>{loading?"⏳ Analisando...":"🧠 ANALISAR SCREENSHOT"}</button>}
        {!screenshot&&<div style={{...S.card,textAlign:"center",padding:"24px 20px",color:"#475569",fontSize:13,lineHeight:2}}>📱 <b style={{color:"#a3e635"}}>Celular:</b> tire print → selecione da galeria<br/>💻 <b style={{color:"#a3e635"}}>PC:</b> Ctrl+V para colar direto</div>}
      </div>)}
      {tab==="manual"&&(<div>
        <div style={S.card}>
          <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:14}}>
            <div><label style={S.label}>Minhas cartas</label><CardPicker label="Selecionar" selected={myCards} onChange={setMyCards} max={2}/></div>
            <div><label style={S.label}>Street</label><select value={street} onChange={e=>setStreet(e.target.value)} style={{...S.input,width:"auto"}}>{STREETS.map(s=><option key={s}>{s}</option>)}</select></div>
            <div><label style={S.label}>Posição</label><select value={myPos} onChange={e=>setMyPos(e.target.value)} style={{...S.input,width:"auto"}}>{POSITIONS.map(p=><option key={p}>{p}</option>)}</select></div>
          </div>
          {street!=="Preflop"&&<div style={{marginBottom:14}}><label style={S.label}>Board</label><CardPicker label="Board" selected={board} onChange={setBoard} max={street==="Flop"?3:street==="Turn"?4:5}/></div>}
          <input type="number" value={pot} onChange={e=>setPot(e.target.value)} placeholder="Pot em fichas" style={{...S.input,marginBottom:10}}/>
          <textarea value={situation} onChange={e=>setSituation(e.target.value)} placeholder="Descreva a situação..." rows={3} style={{...S.input,resize:"vertical"}}/>
        </div>
        <button onClick={analyzeManual} disabled={loading} style={{width:"100%",padding:"15px",borderRadius:12,cursor:loading?"not-allowed":"pointer",background:loading?"rgba(163,230,53,0.15)":"linear-gradient(135deg,#65a30d,#a3e635)",border:"none",color:loading?"#a3e635":"#0f172a",fontWeight:800,fontSize:16}}>{loading?"⏳ Analisando...":"🧠 ANALISAR COM GTO AI"}</button>
      </div>)}
{tab==="tourney"&&(<div style={S.card}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
          {[["Meu Stack","myStack"],["Restantes","remaining"],["Total","total"]].map(([lbl,key])=>(
            <div key={key}><label style={S.label}>{lbl}</label><input type="number" value={tourney[key]} onChange={e=>setTourney(prev=>({...prev,[key]:+e.target.value}))} style={S.input}/></div>
          ))}
          <div><label style={S.label}>Nível</label><select value={tourney.level} onChange={e=>setTourney(prev=>({...prev,level:+e.target.value}))} style={S.input}>{BLINDS.map(b=><option key={b.lvl} value={b.lvl}>Nv {b.lvl} — {b.sb}/{b.bb}</option>)}</select></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[["BBs",(tourney.myStack/bb).toFixed(1),"#a3e635"],["M-Ratio",mRatio,mColor],["Zona",+mRatio<=10?"PUSH/FOLD":+mRatio<=20?"CAUTELA":"NORMAL",+mRatio<=10?"#f87171":+mRatio<=20?"#fb923c":"#a3e635"]].map(([lbl,val,col])=>(
            <div key={lbl} style={{background:"rgba(255,255,255,0.03)",borderRadius:10,padding:14,textAlign:"center"}}><div style={{fontSize:10,color:"#475569",marginBottom:6}}>{lbl}</div><div style={{fontSize:18,fontWeight:800,color:col}}>{val}</div></div>
          ))}
        </div>
      </div>)}
      {tab==="players"&&players.map((p,i)=>(
        <div key={i} style={{...S.card}}>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            <input value={p.name} onChange={e=>updP(i,"name",e.target.value)} placeholder={`Jogador ${i+1}`} style={{...S.input,flex:1}}/>
            <select value={p.type} onChange={e=>updP(i,"type",e.target.value)} style={{...S.input,width:"auto"}}>{PLAYER_TYPES.map(t=><option key={t}>{t}</option>)}</select>
          </div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
            {PLAYER_TELLS.map(tell=>{const on=p.tells.includes(tell);return<button key={tell} onClick={()=>updP(i,"tells",on?p.tells.filter(t=>t!==tell):[...p.tells,tell])} style={{fontSize:10,padding:"4px 9px",borderRadius:20,cursor:"pointer",background:on?"rgba(251,146,60,0.18)":"rgba(255,255,255,0.05)",border:`1px solid ${on?"#fb923c":"rgba(255,255,255,0.09)"}`,color:on?"#fb923c":"#64748b"}}>{tell}</button>;})}
          </div>
        </div>
      ))}
      {tab==="history"&&(<div>
        {history.length===0&&<div style={{textAlign:"center",padding:"50px 20px",color:"#374151"}}><div style={{fontSize:40}}>🃏</div><div>Nenhuma mão analisada ainda</div></div>}
        {history.map(h=>(<details key={h.id} style={{...S.card,marginBottom:10}}>
          <summary style={{cursor:"pointer",display:"flex",gap:10,alignItems:"center"}}>
            <span style={{color:"#a3e635",fontWeight:700}}>#{h.id}</span>
            <span style={{color:"#94a3b8",fontSize:12}}>{h.type==="screenshot"?"📸 Screenshot":"🃏 "+h.myCards?.join(" ")}</span>
            <span style={{marginLeft:"auto",color:"#475569",fontSize:11}}>{h.timestamp}</span>
          </summary>
          <div style={{marginTop:12,borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:12}}>
            {h.image&&<img src={h.image} alt="" style={{width:"100%",maxHeight:160,objectFit:"cover",borderRadius:8,marginBottom:12}}/>}
            {renderA(h.analysis)}
          </div>
        </details>))}
      </div>)}
      {analysis&&(tab==="screenshot"||tab==="manual")&&(<div style={{background:"rgba(13,21,37,0.95)",border:"1px solid rgba(163,230,53,0.25)",borderRadius:16,padding:"18px 16px",marginTop:16}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:14}}>
          <div style={{fontSize:11,fontWeight:700,color:"#a3e635",letterSpacing:2}}>🧠 ANÁLISE GTO — MÃO #{handNum-1}</div>
          <button onClick={reset} style={{padding:"5px 12px",borderRadius:7,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.1)",color:"#64748b",cursor:"pointer",fontSize:11}}>↺ Nova</button>
        </div>
        {renderA(analysis)}
      </div>)}
    </div>
  </div>);
}

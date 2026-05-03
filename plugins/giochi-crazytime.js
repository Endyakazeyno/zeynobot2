global.crazyTime = global.crazyTime || {}
const f = (n) => new Intl.NumberFormat('it-IT').format(n)
import fetch from 'node-fetch';

const MENU_IMAGE_URL = 'https://i.ibb.co/TM079xF2/IMG-2037.webp';

const WHEEL = [
    { name: '1', mul: 1, weight: 21 }, { name: '2', mul: 2, weight: 13 },
    { name: '5', mul: 5, weight: 7 }, { name: '10', mul: 10, weight: 4 },
    { name: 'COIN', mul: 0, weight: 4 }, { name: 'PACHINKO', mul: 0, weight: 2 }, 
    { name: 'CASH', mul: 0, weight: 2 }, { name: 'CRAZY', mul: 0, weight: 1 }     
]

function spinWheel() {
    let totalWeight = WHEEL.reduce((acc, s) => acc + s.weight, 0); let random = Math.random() * totalWeight;
    for (let s of WHEEL) { if (random < s.weight) return s; random -= s.weight; }
}

function fillRoundRect(ctx, x, y, w, h, r, fillColor) {
    ctx.fillStyle = fillColor; ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); ctx.fill();
}

// Colori leggermente più profondi per adattarsi alla Dark Mode
const colors = {
    '1': ['#1e3a8a', '#172554'], '2': ['#b45309', '#78350f'], '5': ['#be185d', '#831843'], '10': ['#6b21a8', '#3b0764'],
    'COIN': ['#0369a1', '#0c4a6e'], 'PACHINKO': ['#86198f', '#4a044e'], 'CASH': ['#15803d', '#14532d'], 'CRAZY': ['#b91c1c', '#7f1d1d']
};

async function generateTicket(username, pick, amount, round) {
    let createCanvas; try { const canvasLib = await import('canvas'); createCanvas = canvasLib.createCanvas; } catch (e) { return null; }
    const cvs = createCanvas(500, 250); const ctx = cvs.getContext('2d');

    // Sfondo Dark Minimal
    let bg = ctx.createLinearGradient(0, 0, 500, 250); bg.addColorStop(0, '#09090b'); bg.addColorStop(1, '#18181b');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 500, 250);
    ctx.strokeStyle = '#3f3f46'; ctx.lineWidth = 2; ctx.strokeRect(10, 10, 480, 230);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)'; ctx.lineWidth = 1; ctx.strokeRect(15, 15, 470, 220);

    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 22px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('NEW ERA BET • VIP TICKET', 250, 45);
    ctx.fillStyle = '#27272a'; ctx.fillRect(50, 60, 400, 2);

    ctx.fillStyle = '#a1a1aa'; ctx.font = '16px sans-serif'; ctx.textAlign = 'left'; ctx.fillText(`Utente: @${username}`, 40, 95);
    ctx.textAlign = 'right'; ctx.fillText(`Round: ${round}/5`, 460, 95);

    fillRoundRect(ctx, 40, 115, 200, 70, 8, '#27272a');
    ctx.fillStyle = '#a1a1aa'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('PRONOSTICO', 140, 135);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 30px sans-serif'; ctx.fillText(pick, 140, 170);

    fillRoundRect(ctx, 260, 115, 200, 70, 8, '#27272a');
    ctx.fillStyle = '#a1a1aa'; ctx.font = '14px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('IMPORTO (€)', 360, 135);
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 26px sans-serif'; ctx.fillText(f(amount), 360, 168);

    ctx.fillStyle = '#3f3f46'; for (let i = 0; i < 60; i++) { let bw = Math.random() > 0.5 ? 2 : 4; ctx.fillRect(50 + (i * 6.5), 200, bw, 20); }
    return cvs.toBuffer('image/png');
}

async function drawHDWheel(winner, isSpinning = false) {
    let createCanvas; try { const canvasLib = await import('canvas'); createCanvas = canvasLib.createCanvas; } catch (e) { return null; }
    const cvs = createCanvas(800, 800); const ctx = cvs.getContext('2d');

    // Sfondo Dark Mode profondo
    ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, 800, 800);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)'; ctx.lineWidth = 1;
    for (let i = -800; i < 800; i += 20) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 800, 800); ctx.stroke(); }

    const cx = 400; const cy = 400; const r = 300; const segments = 16; const anglePerSegment = (Math.PI * 2) / segments;

    let wheelItems = [winner];
    let allKeys = Object.keys(colors);
    for(let i=1; i<segments; i++) wheelItems.push(allKeys[Math.floor(Math.random() * allKeys.length)]);

    ctx.beginPath(); ctx.arc(cx, cy, r + 15, 0, Math.PI*2); ctx.fillStyle = '#18181b'; ctx.fill(); // Bordo esterno scuro

    if (isSpinning) { ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.random() * Math.PI); ctx.translate(-cx, -cy); }

    for(let i=0; i<segments; i++) {
        let startAngle = -Math.PI/2 - (anglePerSegment/2) + (i * anglePerSegment);
        let endAngle = startAngle + anglePerSegment;
        let item = wheelItems[i]; let color = colors[item][i % 2]; 

        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, startAngle, endAngle); ctx.closePath();
        ctx.fillStyle = color; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#27272a'; ctx.stroke(); // Rimosso l'oro, bordi scuri

        ctx.save(); ctx.translate(cx, cy); ctx.rotate(startAngle + anglePerSegment/2);
        ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillStyle = "#ffffff"; ctx.font = "bold 40px sans-serif";
        
        if (isSpinning) { ctx.shadowColor = color; ctx.shadowBlur = 20; } 
        else { ctx.shadowColor = "rgba(0,0,0,0.8)"; ctx.shadowBlur = 10; }
        
        ctx.fillText(item, r - 20, 0); ctx.restore();
    }
    if (isSpinning) ctx.restore();

    // Centro della ruota New Era
    ctx.beginPath(); ctx.arc(cx, cy, 60, 0, Math.PI*2); ctx.fillStyle = '#09090b'; ctx.fill();
    ctx.lineWidth = 6; ctx.strokeStyle = '#3f3f46'; ctx.stroke();
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 20px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('NEW ERA', cx, cy);

    // Puntatore in alto
    ctx.shadowColor = 'rgba(0,0,0,0.8)'; ctx.shadowBlur = 15; ctx.beginPath();
    ctx.moveTo(400, 30); ctx.lineTo(440, 0); 
    if (isSpinning) ctx.lineTo(400, 110); 
    else ctx.lineTo(400, 130); 
    ctx.lineTo(360, 0); ctx.closePath();
    ctx.fillStyle = '#ef4444'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#ffffff'; ctx.stroke(); ctx.shadowBlur = 0;

    // Display inferiore
    fillRoundRect(ctx, 150, 680, 500, 80, 12, '#18181b');
    ctx.strokeStyle = '#3f3f46'; ctx.lineWidth = 2; ctx.strokeRect(150, 680, 500, 80); 
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 45px sans-serif'; ctx.textAlign = 'center';
    
    if (isSpinning) ctx.fillText(`SPINNING...`, 400, 735);
    else ctx.fillText(`WINNER: ${winner}`, 400, 735);

    return cvs.toBuffer('image/png');
}

let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
    let chatId = m.chat; let user = global.db.data.users[m.sender];

    if (command === 'resetct' || command === 'stopct') {
        if (!isOwner) return m.reply(`⚠️ Azione riservata all'Owner.`)
        let game = global.crazyTime[chatId]; if (!game) return m.reply(`⚠️ Nessuna sessione attiva.`)
        if (game.timer) clearTimeout(game.timer);
        if (game.bets && game.bets.length > 0) {
            for (let b of game.bets) if (global.db.data.users[b.sender]) global.db.data.users[b.sender].euro += b.amount;
            m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System_\n───────────────\nSessione annullata. Ticket rimborsati.`)
        } else m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System_\n───────────────\nSessione annullata.`)
        delete global.crazyTime[chatId]; return
    }

    if (command === 'crazytime' || command === 'ct') {
        if (global.crazyTime[chatId]) return m.reply(`⚠️ Sessione già in corso!`)
        global.crazyTime[chatId] = { state: 'betting', round: 1, maxRounds: 5, bets: [], timer: null }
        apriLobby(conn, chatId, usedPrefix); return
    }

    if (command === 'betct') {
        let game = global.crazyTime[chatId]; if (!game) return m.reply(`⚠️ Nessuna sessione. Usa ${usedPrefix}ct`)
        if (game.state !== 'betting') return m.reply(`⚠️ Botteghino chiuso!`)
        if (!args[0] || !args[1]) return m.reply(`👉 Uso: *${usedPrefix}betct <segmento> <importo>*`)

        let pick = args[0].toUpperCase(); let amount = parseInt(args[1]); let validPicks = WHEEL.map(s => s.name);
        if (!validPicks.includes(pick)) return m.reply(`⚠️ Segmento non valido.`)
        if (isNaN(amount) || amount <= 0) return m.reply(`⚠️ Puntata non valida.`)
        if (user.euro < amount) return m.reply(`⚠️ Fondi insufficienti.`)

        user.euro -= amount; game.bets.push({ sender: m.sender, pick, amount })

        let username = m.sender.split('@')[0];
        let ticketImg = await generateTicket(username, pick, amount, game.round);
        if (ticketImg) await conn.sendMessage(chatId, { image: ticketImg, caption: `Ticket registrato con successo.` }, { quoted: m });
        else m.reply(`✅ Ticket: ${pick} - ${amount}€`); 
    }
}

async function apriLobby(conn, chatId, usedPrefix) {
    let game = global.crazyTime[chatId]; if (!game) return
    let tempo = game.round === 1 ? 40000 : 25000 
    
    let lobbyTesto = `
*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Crazy Time_
───────────────
🔄 *ROUND ${game.round} / ${game.maxRounds}*
Il banco è aperto. Effettua le tue puntate.

*SEGMENTI DISPONIBILI:*
[1] • [2] • [5] • [10]
[COIN] • [PACHINKO] • [CASH] • [CRAZY]

👉 Sintassi: *${usedPrefix}betct <segmento> <importo>*
⏱️ Chiusura in: ${tempo/1000}s
───────────────`.trim()

    // Rimossa la variabile legamCtx completamente
    if (game.round === 1) {
        try {
            let imgRes = await fetch(MENU_IMAGE_URL);
            let imgBuffer = Buffer.from(await imgRes.arrayBuffer());
            await conn.sendMessage(chatId, { image: imgBuffer, caption: lobbyTesto });
        } catch (e) {
            await conn.sendMessage(chatId, { text: lobbyTesto });
        }
    } else {
        await conn.sendMessage(chatId, { text: lobbyTesto })
    }

    game.timer = setTimeout(() => startSpin(conn, chatId), tempo)
}

async function startSpin(conn, chatId) {
    let game = global.crazyTime[chatId]; if (!game) return
    game.state = 'spinning'
    await conn.sendMessage(chatId, { text: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System_\n───────────────\n⚠️ *PUNTATE CHIUSE*\nInizializzazione estrazione in corso...` })
    if (!global.crazyTime[chatId]) return 

    let tsSegment = WHEEL[Math.floor(Math.random() * WHEEL.length)].name; let tsMultiplier = [2, 3, 5, 7, 10, 15, 20, 50][Math.floor(Math.random() * 8)]; let tsHit = Math.random() > 0.6 
    let result = spinWheel(); let finalMultiplier = result.mul; let isBonus = result.mul === 0; let bonusTS = (tsHit && tsSegment === result.name) ? tsMultiplier : 1

    let tsMsg = tsHit ? `🔥 *TOP SLOT HIT!* 🔥\n[ *${tsSegment}* ] ➻ *${tsMultiplier}x*` : `💨 *TOP SLOT MISS*`

    let spinImg = await drawHDWheel(result.name, true);
    if (spinImg) await conn.sendMessage(chatId, { image: spinImg, caption: `${tsMsg}\n\nLa ruota sta girando...` });
    
    await new Promise(r => setTimeout(r, 4500)); 
    if (!global.crazyTime[chatId]) return 

    let winImg = await drawHDWheel(result.name, false);
    if (winImg) await conn.sendMessage(chatId, { image: winImg, caption: `La ruota si ferma su: [ *${result.name}* ]` });

    await new Promise(r => setTimeout(r, 2000));
    if (!global.crazyTime[chatId]) return 

    if (isBonus) await handleBonus(conn, chatId, result.name, game, bonusTS)
    else await finalizeRound(conn, chatId, result.name, finalMultiplier * bonusTS, game)
}

async function handleBonus(conn, chatId, type, game, ts) {
    if (!global.crazyTime[chatId]) return
    let winMul = 0;
    switch(type) {
        case 'COIN': await conn.sendMessage(chatId, { text: `🪙 Inizializzazione **COIN FLIP**...` }); await new Promise(r => setTimeout(r, 3000)); winMul = Math.random() > 0.5 ? 5 : Math.floor(Math.random() * 20) + 10; break;
        case 'PACHINKO': await conn.sendMessage(chatId, { text: `🏮 Inizializzazione **PACHINKO**...` }); await new Promise(r => setTimeout(r, 4000)); winMul = [10, 20, 30, 50, 100][Math.floor(Math.random() * 5)]; break;
        case 'CASH': await conn.sendMessage(chatId, { text: `🎯 Inizializzazione **CASH HUNT**...` }); await new Promise(r => setTimeout(r, 4000)); winMul = Math.floor(Math.random() * 80) + 10; break;
        case 'CRAZY': await conn.sendMessage(chatId, { text: `🌈 Ingresso nel **CRAZY TIME**...` }); await new Promise(r => setTimeout(r, 5000)); winMul = [50, 100, 200, 500, 1000][Math.floor(Math.random() * 5)]; break;
    }
    if (!global.crazyTime[chatId]) return
    await conn.sendMessage(chatId, { text: `MOLTIPLICATORE ASSEGNATO: *${winMul}x*` })
    await finalizeRound(conn, chatId, type, winMul * ts, game)
}

async function finalizeRound(conn, chatId, resultName, totalMul, game) {
    if (!global.crazyTime[chatId]) return
    let winners = ""; let participants = game.bets.map(b => b.sender);
    for (let b of game.bets) {
        if (b.pick === resultName) {
            let winAmount = Math.floor(b.amount * totalMul); global.db.data.users[b.sender].euro += (winAmount + b.amount); winners += `• @${b.sender.split('@')[0]} vince +${f(winAmount)} €\n`
        } else { winners += `• @${b.sender.split('@')[0]} perde -${f(b.amount)} €\n` }
    }

    let report = `
*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Round ${game.round} / ${game.maxRounds}_
───────────────
🎯 *ESITO:* [ ${resultName} ]
📈 *Moltiplicatore:* ${totalMul}x

*RESOCONTO SCOMMESSE:*
${game.bets.length > 0 ? winners.trim() : "Nessuna giocata registrata."}
───────────────`.trim()
    
    await conn.sendMessage(chatId, { text: report, mentions: participants })

    if (game.round < game.maxRounds) {
        await new Promise(r => setTimeout(r, 4000)); if (!global.crazyTime[chatId]) return; game.round++; game.bets = []; game.state = 'betting'; await apriLobby(conn, chatId, ".") 
    } else {
        await new Promise(r => setTimeout(r, 3000)); if (!global.crazyTime[chatId]) return; await conn.sendMessage(chatId, { text: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System_\n───────────────\nSessione conclusa.\nGrazie per aver partecipato.` }); delete global.crazyTime[chatId]
    }
}

handler.command = /^(crazytime|ct|betct|resetct|stopct)$/i; handler.group = true; export default handler;

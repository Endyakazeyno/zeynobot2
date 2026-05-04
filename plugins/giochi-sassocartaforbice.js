import { createCanvas, loadImage } from 'canvas';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

let handler = async (m, { conn, text, args, usedPrefix, command }) => {
  let wm = '𝐍𝐄𝐖 𝐄𝐑𝐀 • 𝐒𝐲𝐬𝐭𝐞𝐦';
  let defaultAvatar = 'https://i.ibb.co/BKHtdBNp/default-avatar-profile-icon-1280x1280.jpg';
  
  // Funzione per creare l'immagine VS
  const createVSImage = async (player1Name, player2Name, avatar1, avatar2) => {
    try {
      const canvas = createCanvas(800, 400);
      const ctx = canvas.getContext('2d');

      // Sfondo gradiente Dark Mode (New Era Style)
      const gradient = ctx.createLinearGradient(0, 0, 800, 0);
      gradient.addColorStop(0, '#09090b');
      gradient.addColorStop(0.5, '#18181b');
      gradient.addColorStop(1, '#09090b');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 800, 400);

      // Overlay pattern o scurimento
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, 0, 800, 400);

      // Carica e disegna avatar
      const img1 = await loadImage(avatar1).catch(() => loadImage(defaultAvatar));
      const img2 = await loadImage(avatar2).catch(() => loadImage(defaultAvatar));

      // Avatar circolari
      const drawCircularAvatar = (img, x, y, size) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(img, x, y, size, size);
        ctx.restore();
        
        // Bordo avatar Minimal Dark
        ctx.strokeStyle = '#3f3f46'; // Grigio scuro New Era
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
        ctx.stroke();
      };

      drawCircularAvatar(img1, 100, 100, 150);
      drawCircularAvatar(img2, 550, 100, 150);

      // Testo VS centrale
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 65px Arial';
      ctx.textAlign = 'center';
      
      // Ombra rossa cyber per il testo VS
      ctx.fillStyle = 'rgba(239, 68, 68, 0.6)';
      ctx.fillText('VS', 403, 203);
      ctx.fillStyle = '#ffffff';
      ctx.fillText('VS', 400, 200);

      // Nomi giocatori
      ctx.font = 'bold 24px Arial';
      ctx.fillStyle = '#ffffff';
      
      // Nome player 1
      ctx.textAlign = 'center';
      ctx.fillText(player1Name.length > 15 ? player1Name.substring(0, 15) + '...' : player1Name, 175, 300);
      
      // Nome player 2  
      ctx.fillText(player2Name.length > 15 ? player2Name.substring(0, 15) + '...' : player2Name, 625, 300);

      // Decorazioni orizzontali minimal
      ctx.fillStyle = '#27272a';
      ctx.fillRect(0, 0, 800, 4);
      ctx.fillRect(0, 396, 800, 4);

      // Emoji decorative rimosse a favore di icone pulite, ma lasciamo i simboli
      ctx.font = '30px Arial';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillText('🪨', 50, 50);
      ctx.fillText('📄', 400, 50);
      ctx.fillText('✂️', 750, 50);

      const timestamp = Date.now();
      const filename = `vs_${timestamp}.png`;
      const filepath = join('./temp', filename);

      // Crea directory temp se non esiste
      try {
        await import('fs').then(fs => fs.mkdirSync('./temp', { recursive: true }));
      } catch {}

      const buffer = canvas.toBuffer('image/png');
      writeFileSync(filepath, buffer);
      
      return { filepath, filename };
    } catch (error) {
      console.error('Errore creazione immagine VS:', error);
      return null;
    }
  };
  
  if (args[0] === 'stats') {
    let user = global.db.data.users[m.sender];
    let win = user.scf_win || 0;
    let lose = user.scf_lose || 0;
    let draw = user.scf_draw || 0;
    let tot = win + lose + draw;
    let perc = tot ? ((win / tot) * 100).toFixed(1) : 0;
    
    let buttons = [
      { buttonId: `${usedPrefix}scf regole`, buttonText: { displayText: '📜 Regole' }, type: 1 },
    ];
    
    let buttonMessage = {
      text: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _User Statistics_
───────────────
🏆 *Vittorie:* ${win}
💀 *Sconfitte:* ${lose}
🤝 *Pareggi:* ${draw}
🎮 *Match Totali:* ${tot}
📊 *Win Rate:* ${perc}%
───────────────`.trim(),
      footer: wm,
      buttons: buttons,
      headerType: 1
    };
    return conn.sendMessage(m.chat, buttonMessage, { quoted: m });
  }
  
  if (args[0] === 'regole') {
    let buttons = [
      { buttonId: `${usedPrefix}scf stats`, buttonText: { displayText: '📊 Statistiche' }, type: 1 },
    ];
    
    let buttonMessage = {
      text: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Combat Rules_
───────────────
🪨 *Sasso* distrugge Forbici
✂️ *Forbici* tagliano Carta
📄 *Carta* avvolge Sasso

👉 *Uso:* ${usedPrefix}scf @utente
💬 *Alternativa:* Quota un messaggio
───────────────`.trim(),
      footer: wm,
      buttons: buttons,
      headerType: 1
    };
    return conn.sendMessage(m.chat, buttonMessage, { quoted: m });
  }

  // Controllo se è stato quotato un messaggio
  let player2;
  if (m.quoted && m.quoted.sender) {
    player2 = m.quoted.sender;
  } else if (m.mentionedJid[0]) {
    player2 = m.mentionedJid[0];
  } else {
    let buttons = [
      { buttonId: `${usedPrefix}scf regole`, buttonText: { displayText: '📜 Come Giocare' }, type: 1 },
      { buttonId: `${usedPrefix}scf stats`, buttonText: { displayText: '📊 Le Mie Stats' }, type: 1 }
    ];
    
    let buttonMessage = {
      text: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Target Error_
───────────────
⚠️ *Azione richiesta:* Devi taggare o quotare un avversario per iniziare lo scontro.

👉 *Esempio:* ${usedPrefix + command} @utente
───────────────`.trim(),
      footer: wm,
      buttons: buttons,
      headerType: 1
    };
    return conn.sendMessage(m.chat, buttonMessage, { quoted: m });
  }

  let player1 = m.sender;
  
  if (player1 === player2) {
    let buttons = [
      { buttonId: `${usedPrefix}scf regole`, buttonText: { displayText: '📜 Come Giocare' }, type: 1 },
    ];
    
    let buttonMessage = {
      text: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_
───────────────
❌ Errore di logica: Non puoi sfidare te stesso.
───────────────`.trim(),
      footer: wm,
      buttons: buttons,
      headerType: 1
    };
    return conn.sendMessage(m.chat, buttonMessage, { quoted: m });
  }
  
  if (player2 === conn.user.jid) {
    let buttons = [
      { buttonId: `${usedPrefix}scf regole`, buttonText: { displayText: '📜 Come Giocare' }, type: 1 },
    ];
    
    let buttonMessage = {
      text: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_
───────────────
🤖 Errore di selezione: I bot di sistema non partecipano ai giochi di fortuna.
───────────────`.trim(),
      footer: wm,
      buttons: buttons,
      headerType: 1
    };
    return conn.sendMessage(m.chat, buttonMessage, { quoted: m });
  }

  // Ottieni avatar e nomi
  let player1Avatar, player2Avatar;
  try {
    player1Avatar = await conn.profilePictureUrl(player1, 'image').catch(() => defaultAvatar);
    player2Avatar = await conn.profilePictureUrl(player2, 'image').catch(() => defaultAvatar);
  } catch {
    player1Avatar = defaultAvatar;
    player2Avatar = defaultAvatar;
  }

  let player1Name = conn.getName(player1);
  let player2Name = conn.getName(player2);

  // Invia i messaggi privati con bottoni per le scelte
  let choiceButtons = [
    { buttonId: `scf_choice_sasso_${Date.now()}`, buttonText: { displayText: '🪨 Sasso' }, type: 1 },
    { buttonId: `scf_choice_carta_${Date.now()}`, buttonText: { displayText: '📄 Carta' }, type: 1 },
    { buttonId: `scf_choice_forbici_${Date.now()}`, buttonText: { displayText: '✂️ Forbici' }, type: 1 }
  ];

  let choiceMessageText = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Combat Phase_
───────────────
🎯 *Fai la tua mossa:*
• 🪨 Sasso
• 📄 Carta
• ✂️ Forbici
───────────────`.trim();

  let choiceMessage1 = {
    text: choiceMessageText,
    footer: `⏳ Hai 60 secondi per decidere.`,
    buttons: choiceButtons,
    headerType: 1
  };

  let choiceMessage2 = {
    text: choiceMessageText,
    footer: `⏳ Hai 60 secondi per decidere.`,
    buttons: choiceButtons,
    headerType: 1
  };

  await conn.sendMessage(player1, choiceMessage1);
  await conn.sendMessage(player2, choiceMessage2);

  const choices = new Map();
  
  const waitResponse = async (player) => {
    try {
      return await new Promise((resolve, reject) => {
        let timeout = setTimeout(() => {
          conn.ev.off('messages.upsert', messageHandler)
          reject('timeout')
        }, 60000) // 60 secondi timeout
        
        const messageHandler = (m) => {
          const msg = m.messages[0]
          if (msg.key.remoteJid === player && !msg.key.fromMe) {
            let txt = (msg.message?.conversation || msg.message?.extendedTextMessage?.text || '').toLowerCase().trim()
            
            // Gestione bottoni
            if (msg.message?.buttonsResponseMessage?.selectedButtonId) {
              let buttonId = msg.message.buttonsResponseMessage.selectedButtonId;
              if (buttonId.includes('scf_choice_')) {
                let choice = buttonId.split('_')[2]; // sasso, carta, forbici
                if (['sasso', 'carta', 'forbici'].includes(choice)) {
                  clearTimeout(timeout)
                  conn.ev.off('messages.upsert', messageHandler)
                  choices.set(player, choice)
                  resolve(choice)
                }
              }
            }
            
            // Gestione testo normale
            if(['sasso', 'carta', 'forbici'].includes(txt)) {
              clearTimeout(timeout)
              conn.ev.off('messages.upsert', messageHandler)
              choices.set(player, txt)
              resolve(txt)
            }
          }
        }
        conn.ev.on('messages.upsert', messageHandler)
      })
    } catch (e) {
      console.log('Errore in waitResponse:', e)
      return null
    }
  }

  // Crea immagine VS
  const vsImage = await createVSImage(player1Name, player2Name, player1Avatar, player2Avatar);

  let startButtons = [
    { buttonId: `${usedPrefix}scf regole`, buttonText: { displayText: '📜 Regole' }, type: 1 },
    { buttonId: `${usedPrefix}scf stats`, buttonText: { displayText: '📊 Stats' }, type: 1 }
  ];

  let startMessage = {
    caption: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Match Initiated_
───────────────
⚔️ *Sfidante:* @${player1.split('@')[0]}
🎯 *Sfidato:* @${player2.split('@')[0]}

📱 _Controllate i messaggi privati per scegliere._
⏳ _Tempo limite: 60 secondi._
───────────────`.trim(),
    footer: wm,
    buttons: startButtons,
    headerType: 4,
    mentions: [player1, player2]
  };

  if (vsImage) {
    startMessage.image = { url: vsImage.filepath };
    await conn.sendMessage(m.chat, startMessage);
  } else {
    delete startMessage.image;
    await conn.sendMessage(m.chat, startMessage);
  }

  try {
    const [scelta1, scelta2] = await Promise.all([
      waitResponse(player1),
      waitResponse(player2)
    ])
    
    console.log('Scelte ricevute:', {
      player1: scelta1,
      player2: scelta2,
      choices: Array.from(choices.entries())
    })
    
    if (!scelta1 || !scelta2) {
      let timeoutButtons = [
        { buttonId: `${usedPrefix}scf @${player2.split('@')[0]}`, buttonText: { displayText: '🔄 Riprova' }, type: 1 },
      ];
      
      let timeoutMessage = {
        text: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Timeout_
───────────────
⏰ *Scontro Annullato*
Uno o entrambi i giocatori (@${player1.split('@')[0]}, @${player2.split('@')[0]}) non hanno effettuato la mossa in tempo.
───────────────`.trim(),
        footer: wm,
        buttons: timeoutButtons,
        headerType: 1,
        mentions: [player1, player2]
      };
      
      // Pulisci file temporaneo
      if (vsImage) {
        try { unlinkSync(vsImage.filepath); } catch {}
      }
      
      return conn.sendMessage(m.chat, timeoutMessage);
    }

    const emoji = { sasso: '🪨', carta: '📄', forbici: '✂️' };
    let result = '';
    let winner = null;
    let loser = null;
    let resultButtons = [];

    if (scelta1 === scelta2) {
      result = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Match Draw_
───────────────
👤 @${player1.split('@')[0]}: ${emoji[scelta1]}
👤 @${player2.split('@')[0]}: ${emoji[scelta2]}

🤝 *Esito:* Pareggio tattico.
───────────────`.trim();
      
      resultButtons = [
        { buttonId: `${usedPrefix}scf @${player2.split('@')[0]}`, buttonText: { displayText: '🔄 Rivincita' }, type: 1 },
        { buttonId: `${usedPrefix}scf stats`, buttonText: { displayText: '📊 Statistiche' }, type: 1 }
      ];
    } else if (
      (scelta1 === 'carta' && scelta2 === 'sasso') ||
      (scelta1 === 'forbici' && scelta2 === 'carta') ||
      (scelta1 === 'sasso' && scelta2 === 'forbici')
    ) {
      winner = player1;
      loser = player2;
      result = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Match Result_
───────────────
🏆 *Vincitore:* @${player1.split('@')[0]} [ ${emoji[scelta1]} ]
💀 *Sconfitto:* @${player2.split('@')[0]} [ ${emoji[scelta2]} ]

⚡ *Dinamica:* ${emoji[scelta1]} annienta ${emoji[scelta2]}
───────────────`.trim();
      
      resultButtons = [
        { buttonId: `${usedPrefix}scf @${player2.split('@')[0]}`, buttonText: { displayText: '🔄 Rivincita' }, type: 1 },
        { buttonId: `${usedPrefix}scf stats`, buttonText: { displayText: '📊 Le Mie Stats' }, type: 1 }
      ];
    } else {
      winner = player2;
      loser = player1;
      result = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Match Result_
───────────────
🏆 *Vincitore:* @${player2.split('@')[0]} [ ${emoji[scelta2]} ]
💀 *Sconfitto:* @${player1.split('@')[0]} [ ${emoji[scelta1]} ]

⚡ *Dinamica:* ${emoji[scelta2]} annienta ${emoji[scelta1]}
───────────────`.trim();
      
      resultButtons = [
        { buttonId: `${usedPrefix}scf @${player1.split('@')[0]}`, buttonText: { displayText: '🔄 Rivincita' }, type: 1 },
        { buttonId: `${usedPrefix}scf stats`, buttonText: { displayText: '📊 Le Mie Stats' }, type: 1 }
      ];
    }

    let resultMessage = {
      caption: result,
      footer: wm,
      buttons: resultButtons,
      headerType: 4,
      mentions: [player1, player2]
    };

    if (vsImage) {
      resultMessage.image = { url: vsImage.filepath };
      await conn.sendMessage(m.chat, resultMessage);
      
      // Pulisci file temporaneo dopo l'invio
      setTimeout(() => {
        try { unlinkSync(vsImage.filepath); } catch {}
      }, 5000);
    } else {
      delete resultMessage.image;
      await conn.sendMessage(m.chat, resultMessage);
    }

    let randomXP = Math.floor(Math.random() * 1500) + 1;
    let randomStars = Math.floor(Math.random() * 250) + 1;

    let user1 = global.db.data.users[player1];
    let user2 = global.db.data.users[player2];
    user1.scf_win = user1.scf_win || 0;
    user1.scf_lose = user1.scf_lose || 0;
    user1.scf_draw = user1.scf_draw || 0;
    user2.scf_win = user2.scf_win || 0;
    user2.scf_lose = user2.scf_lose || 0;
    user2.scf_draw = user2.scf_draw || 0;

    if (scelta1 === scelta2) {
      user1.exp = (user1.exp || 0) + randomXP;
      user2.exp = (user2.exp || 0) + randomXP;
      user1.stars = (user1.stars || 0) + randomStars;
      user2.stars = (user2.stars || 0) + randomStars;
      user1.scf_draw++;
      user2.scf_draw++;
    } else if (
      (scelta1 === 'carta' && scelta2 === 'sasso') ||
      (scelta1 === 'forbici' && scelta2 === 'carta') ||
      (scelta1 === 'sasso' && scelta2 === 'forbici')
    ) {
      user1.exp = (user1.exp || 0) + randomXP;
      user1.stars = (user1.stars || 0) + randomStars;
      user2.exp = (user2.exp || 0) - randomXP;
      user2.stars = Math.max((user2.stars || 0) - randomStars, 0);
      user1.scf_win++;
      user2.scf_lose++;
    } else {
      user2.exp = (user2.exp || 0) + randomXP;
      user2.stars = (user2.stars || 0) + randomStars;
      user1.exp = (user1.exp || 0) - randomXP;
      user1.stars = Math.max((user1.stars || 0) - randomStars, 0);
      user2.scf_win++;
      user1.scf_lose++;
    }

  } catch (error) {
    console.error('Errore durante il gioco:', error);
    
    // Pulisci file temporaneo in caso di errore
    if (vsImage) {
      try { unlinkSync(vsImage.filepath); } catch {}
    }
    
    let errorButtons = [
      { buttonId: `${usedPrefix}scf regole`, buttonText: { displayText: '📜 Come Giocare' }, type: 1 },
    ];
    
    let errorMessage = {
      text: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_
───────────────
⚠️ Si è verificato un errore critico durante l'esecuzione del match.
───────────────`.trim(),
      footer: wm,
      buttons: errorButtons,
      headerType: 1
    };
    return conn.sendMessage(m.chat, errorMessage, { quoted: m });
  }
};

handler.help = ['scf @utente'];
handler.tags = ['giochi'];
handler.command = ['sassocartaforbici', 'scf'];
handler.group = true;
handler.register = true;
export default handler;
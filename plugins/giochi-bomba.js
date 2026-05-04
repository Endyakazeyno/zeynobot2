let handler = async (m, { conn, command, usedPrefix }) => {
    // Inizializza l'oggetto globale per tracciare le bombe nei vari gruppi
    global.bomba = global.bomba || {};
    let chatId = m.chat;

    //bomba
    if (command === 'bomba') {
        if (global.bomba[chatId]) return m.reply("*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System_\n───────────────\n⚠️ Un ordigno è già attivo in questo settore!");

        // Chi digita il comando innesca la bomba e ce l'ha tra le mani
        let holder = m.sender;
        let time = 30000; // 30 secondi prima dell'esplosione

        let initMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Hazard Alert_
───────────────
⚠️ *𝐎𝐑𝐃𝐈𝐆𝐍𝐎 𝐈𝐍𝐍𝐄𝐒𝐂𝐀𝐓𝐎* ⚠️

• *Bersaglio attuale:* @${holder.split('@')[0]}
• *Stato:* Ticchettio in corso...

👉 _Usa_ \`${usedPrefix}passa @utente\` _o rispondi per cederla._
───────────────
_30 secondi all'esplosione_`.trim();

        await conn.sendMessage(chatId, { text: initMsg, mentions: [holder] });

        // Timer di esplosione
        global.bomba[chatId] = {
            holder: holder,
            timer: setTimeout(async () => {
                let loser = global.bomba[chatId].holder;
                let penalty = 500; // Multa per chi esplode

                // Rimuovi i soldi al perdente se registrato nel DB
                if (global.db.data.users[loser]) {
                    global.db.data.users[loser].euro -= penalty;
                }

                let expMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Detonation_
───────────────
💥 *𝐁 𝐎 𝐎 𝐌 !* 💥

L'ordigno è esploso tra le mani di @${loser.split('@')[0]}.
• *Penalità di sistema:* -${penalty}€

_Bersaglio eliminato dal radar._
───────────────`.trim();

                await conn.sendMessage(chatId, { text: expMsg, mentions: [loser] });
                
                // Pulisce l'oggetto del gruppo a fine gioco
                delete global.bomba[chatId];
            }, time)
        };
        return;
    }

    // ==========================================
    // 🔄 TRASFERIMENTO DELLA BOMBA
    // ==========================================
    if (command === 'passa') {
        if (!global.bomba[chatId]) return m.reply("*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System_\n───────────────\n⚠️ Nessun ordigno attivo al momento.");
        if (global.bomba[chatId].holder !== m.sender) return m.reply("⚠️ Non hai tu l'ordigno in mano! Non puoi passarlo.");

        // Identifica il bersaglio (Taggato o tramite risposta)
        let target = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        
        if (!target) return m.reply("👉 Devi taggare un utente o rispondere a un suo messaggio per passargli l'ordigno.");
        if (target === m.sender) return m.reply("⚠️ Errore di mira: non puoi passare l'ordigno a te stesso.");
        if (target === conn.user.jid) return m.reply("⚠️ Sicurezza di Rete: Il bot è immune agli ordigni.");

        // Aggiorna il possessore della bomba
        global.bomba[chatId].holder = target;

        let passMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Hazard Transfer_
───────────────
🔄 *𝐎𝐑𝐃𝐈𝐆𝐍𝐎 𝐓𝐑𝐀𝐒𝐅𝐄𝐑𝐈𝐓𝐎*

• *Nuovo bersaglio:* @${target.split('@')[0]}

⏳ _Il countdown continua..._
───────────────`.trim();

        await conn.sendMessage(chatId, { text: passMsg, mentions: [target] });
    }
};

handler.help = ['bomba', 'passa @user'];
handler.tags = ['giochi'];
handler.command = /^(bomba|passa)$/i;
handler.group = true;

export default handler;
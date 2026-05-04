let handler = async (m, { conn, text }) => {
    if (!m.isGroup) return;

    let db = global.db.data.users;
    const getNum = (jid) => (jid || '').split('@')[0].split(':')[0];

    // Se tagga qualcuno, vede la famiglia del taggato, altrimenti la propria
    let targetUser = m.sender;
    if (m.mentionedJid && m.mentionedJid[0]) {
        targetUser = m.mentionedJid[0];
    } else if (m.quoted && m.quoted.sender) {
        targetUser = m.quoted.sender;
    }

    if (!db[targetUser]) {
        return m.reply("*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_\n───────────────\n❌ Utente non registrato nel database.");
    }

    // Assicuriamoci che i dati esistano
    let partner = db[targetUser].partner || null;
    let genitori = db[targetUser].genitori || [];
    let figli = db[targetUser].figli || [];

    let mentionsArr = [targetUser];

    // Costruzione stringa Partner
    let partnerStr = "Nessuno 💔";
    if (partner) {
        partnerStr = `@${getNum(partner)} 💍`;
        mentionsArr.push(partner);
    }

    // Costruzione stringa Genitori
    let genitoriStr = "Nessuno. È orfano. 🍂";
    if (genitori.length > 0) {
        genitoriStr = genitori.map(g => {
            mentionsArr.push(g);
            return `@${getNum(g)}`;
        }).join(' & ');
    }

    // Costruzione stringa Figli
    let figliStr = "Nessun erede. 🏜️";
    if (figli.length > 0) {
        figliStr = "\n" + figli.map(f => {
            mentionsArr.push(f);
            return `  > 👶🏻 @${getNum(f)}`;
        }).join('\n');
    }

    let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Family Tree_
───────────────
👤 *Dinastia di:* @${getNum(targetUser)}

💍 *Partner:* ${partnerStr}
👴🏼 *Genitori:* ${genitoriStr}
🍼 *Figli:* ${figliStr}
───────────────`.trim();

    // Rimosso contextInfo / inoltro canale
    await conn.sendMessage(m.chat, { 
        text: msg, 
        mentions: [...new Set(mentionsArr)] // Rimuove eventuali doppioni
    }, { quoted: m });
};

handler.help = ['famiglia [@tag]'];
handler.tags = ['giochi'];
handler.command = /^(famiglia|albero|dinastia)$/i;
handler.group = true;

export default handler;

import fetch from 'node-fetch';

let handler = async (m, { conn, text, command, isOwner, isAdmin }) => {
    if (!m.isGroup) return;

    
    let hasPower = isAdmin || isOwner;
    
    if (!hasPower) {
        let meta = await conn.groupMetadata(m.chat).catch(_ => null);
        if (meta) {
            let senderRaw = (m.sender || '').split('@')[0].split(':')[0];
            hasPower = meta.participants.some(p => {
                let partRaw = (p.id || '').split('@')[0].split(':')[0];
                return partRaw === senderRaw && (p.admin === 'admin' || p.admin === 'superadmin');
            });
        }
    }

    if (!hasPower) {
        return m.reply("𝐍𝐄𝐖 𝐄𝐑𝐀 • _System_\n───────────────\n⚠️ Accesso negato: Solo lo Staff può eseguire questa azione.");
    }

    
    const chat = global.db.data.chats[m.chat] || {};
    if (chat.antinuke && !isOwner) {
        let deniedMsg = `𝐍𝐄𝐖 𝐄𝐑𝐀 • _Security Override_\n───────────────\n🛡️ *Stato:* Antinuke Attivo\n⚠️ *Blocco:* Le modifiche gerarchiche sono bloccate. Solo l'Owner può intervenire.`;
        return m.reply(deniedMsg);
    }

    let action = ['promote', 'promuovi', 'p'].includes(command.toLowerCase()) ? 'promote' : 'demote';
    
    let targetUser;
    if (m.mentionedJid && m.mentionedJid[0]) targetUser = m.mentionedJid[0];
    else if (m.quoted && m.quoted.sender) targetUser = m.quoted.sender;
    else if (text) {
        let match = text.match(/\d+/g);
        if (match) targetUser = match.join('') + '@s.whatsapp.net';
    }

    if (!targetUser) return m.reply("*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Input Error_\n───────────────\n👉 Tagga o rispondi all'utente bersaglio.");

    
    try {
        await conn.groupParticipantsUpdate(m.chat, [targetUser], action);
    } catch (e) {
        console.error('[ERRORE PROMOTE/DEMOTE]', e);
        m.reply("⚠️ *ERRORE SISTEMA:*\nL'azione è fallita. Verifica i permessi del bot.");
    }
};


handler.before = async function (m, { conn }) {
    if (!m.isGroup || !m.messageStubType) return true;
    if (m.messageStubType !== 29 && m.messageStubType !== 30) return true;

    let isPromote = m.messageStubType === 29;
    let targetUser = m.messageStubParameters[0];
    let executor = m.sender;

    const getNum = (jid) => (jid || '').split('@')[0].split(':')[0];
    const botNum = getNum(conn.user.id || conn.user.jid);
    const executorNum = getNum(executor);

    const chat = global.db.data.chats[m.chat] || {};
    let isExecutorOwner = executorNum === botNum || (global.owner && global.owner.some(o => getNum(o[0]) === executorNum));
    
    if (chat.antinuke && !isExecutorOwner) return true;

    let promotedUsername = getNum(targetUser);
    let senderUsername = executorNum;

    let titleStr = isPromote ? '👑 𝐏𝐫𝐨𝐦𝐨𝐳𝐢𝐨𝐧𝐞' : '🔻 𝐑𝐞𝐭𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐨𝐧𝐞 ';
    let actionTxt = isPromote ? '𝐩𝐫𝐨𝐦𝐨𝐬𝐬𝐨 𝐚 𝐫𝐮𝐨𝐥𝐨 𝐝𝐢 𝐚𝐦𝐦𝐢𝐧𝐢𝐬𝐭𝐫𝐚𝐭𝐨𝐫𝐞 ' : '𝐫𝐞𝐯𝐨𝐜𝐚𝐭𝐨 𝐢 𝐩𝐨𝐭𝐞𝐫𝐢 𝐚 ';

    let finalMessage = `𝐔𝐭𝐞𝐧𝐭𝐞 @${senderUsername} 𝐡𝐚 ${actionTxt} @${promotedUsername}.
`.trim();

    let profilePicture;
    try { profilePicture = await conn.profilePictureUrl(targetUser, 'image'); } 
    catch (e) { profilePicture = 'https://files.catbox.moe/pyp87f.jpg'; }

    const getBuffer = async (url) => {
        try { const res = await fetch(url); return Buffer.from(await res.arrayBuffer()); } 
        catch (e) { return null; }
    };
    let imageBuffer = await getBuffer(profilePicture);

    // Invio con Fake Quote, Inoltro Newsletter Fake
    await conn.sendMessage(m.chat, {
        text: finalMessage,
        contextInfo: {
            mentionedJid: [targetUser, executor], 
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363233544482011@newsletter', 
                serverMessageId: 100,
                newsletterName: "🛡️ 𝐍𝐄𝐖 𝐄𝐑𝐀 • 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲"
            },
            externalAdReply: {
                title: titleStr,
                body: '𝐍𝐄𝐖 𝐄𝐑𝐀 • 𝐒𝐲𝐬𝐭𝐞𝐦',
                thumbnail: imageBuffer,
                sourceUrl: '', 
                mediaType: 1,  
                renderLargerThumbnail: false 
            }
        }
    });
    return true;
};

handler.help = ['promuovi', 'retrocedi'];
handler.tags = ['gruppo'];
handler.command = /^(promote|promuovi|p|demote|retrocedi|r|d)$/i;
handler.group = true;

export default handler;
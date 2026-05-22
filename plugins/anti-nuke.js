
import fetch from 'node-fetch'

const legamHeader = `*𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓* • _System Protection_
───────────────
· ☢️ 𝐀 𝐍 𝐓 𝐈 𝐍 𝐔 𝐊 𝐄 ☢️ ·
───────────────`;

let handler = async (m, { conn, text, command, usedPrefix, isOwner }) => {
    if (!m.isGroup) return m.reply("*𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓* • _System_\n───────────────\n⚠️ Questo comando funziona solo nei gruppi.");

    const chat = global.db.data.chats[m.chat] || (global.db.data.chats[m.chat] = {});
    if (!chat.whitelist) chat.whitelist = [];

    const action = text ? text.toLowerCase().trim() : '';

    // --- LOGICA COMANDI ---
    if (command === 'antinuke' || command === 'contronuke') {
        if (!isOwner) return m.reply("❌ Solo l'Owner può attivare il protocollo Anti-Nuke.");
        if (action === 'on') {
            chat.antinuke = true;
            return m.reply(`${legamHeader}\n\n🛡️ *𝐒𝐢𝐬𝐭𝐞𝐦𝐚 𝐝𝐢 𝐝𝐢𝐟𝐞𝐬𝐚 𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐨*\n_Ogni azione amministrativa non autorizzata comporterà la rimozione immediata degli Admin._\n\n───────────────`);
        } else if (action === 'off') {
            chat.antinuke = false;
            return m.reply(`${legamHeader}\n\n❌ *𝐒𝐢𝐬𝐭𝐞𝐦𝐚 𝐝𝐢𝐬𝐚𝐭𝐭𝐢𝐯𝐚𝐭𝐨*\n_Il gruppo è ora vulnerabile ad attacchi interni._\n\n───────────────`);
        } else {
            return m.reply(`*𝐔𝐬𝐨 𝐜𝐨𝐫𝐫𝐞𝐭𝐭𝐨:*\n👉 ${usedPrefix + command} on/off`);
        }
    }

    if (command === 'addwhitelist') {
        if (!isOwner) return m.reply("❌ Solo l'Owner può aggiungere membri alla Whitelist.");
        let who = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        if (!who) return m.reply("👉 Taggare l'utente o rispondere a un suo messaggio.");
        if (chat.whitelist.includes(who)) return m.reply("⚠️ L'utente è già presente nella Whitelist.");
        chat.whitelist.push(who);
        return m.reply(`✅ @${who.split('@')[0]} è stato aggiunto alla Whitelist e può operare durante l'Anti-Nuke.`, null, { mentions: [who] });
    }

    if (command === 'delwhitelist') {
        if (!isOwner) return m.reply("❌ Solo l'Owner può rimuovere membri dalla Whitelist.");
        let who = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : null);
        if (!who) return m.reply("👉 Taggare l'utente o rispondere a un suo messaggio.");
        chat.whitelist = chat.whitelist.filter(u => u !== who);
        return m.reply(`🗑️ @${who.split('@')[0]} rimosso dalla Whitelist.`, null, { mentions: [who] });
    }

    if (command === 'resetwhitelist') {
        if (!isOwner) return m.reply("❌ Solo l'Owner può resettare la Whitelist.");
        chat.whitelist = [];
        return m.reply("💥 Whitelist resettata completamente.");
    }
};

handler.before = async function (m, { conn, isBotAdmin }) {
    if (!m.isGroup || !isBotAdmin) return;

    const chat = global.db.data.chats[m.chat];
    if (!chat?.antinuke) return;

    const stub = m.messageStubType;
    if (![21, 22, 29, 30].includes(stub)) return;

    let meta = await conn.groupMetadata(m.chat).catch(_ => null);
    if (!meta) return;

    const sender = m.key?.participant || m.participant || m.sender;
    const botId = conn.user.id.split(':')[0] + '@s.whatsapp.net';
    const founder = meta.owner;
    const owners = global.owner.map(o => o[0] + '@s.whatsapp.net');
    const whitelist = chat.whitelist || [];

    // 🛡️ IMMUNITÀ (Bot, Founder, Owners, Whitelist)
    if (sender === botId || sender === founder || owners.includes(sender) || whitelist.includes(sender)) return;

    // ❌ AZIONE NON AUTORIZZATA ❌
    // Retrocessione di tutti gli Admin sospetti
    const adminsToDemote = meta.participants
        .filter(p => p.admin === 'admin' || p.admin === 'superadmin')
        .map(p => p.id)
        .filter(jid => {
            return jid !== botId && jid !== founder && !owners.includes(jid) && !whitelist.includes(jid);
        });

    // Esecuzione protocollo sicurezza
    if (adminsToDemote.length > 0) {
        try { await conn.groupParticipantsUpdate(m.chat, adminsToDemote, 'demote'); } catch (e) {}
    }
    try { await conn.groupSettingUpdate(m.chat, 'announcement'); } catch (e) {}

    const actionName = stub === 21 ? 'Ha modificato il nome' :
                       stub === 22 ? 'Ha cambiato l\'icona' :
                       stub === 29 ? 'Ha promosso un utente' :
                       'Ha retrocesso un Admin';

    // Costruzione messaggio con Fix Tag nomi
    const alertText = `${legamHeader}

🚨 *𝐀𝐙𝐈𝐎𝐍𝐄 𝐍𝐎𝐍 𝐀𝐔𝐓𝐎𝐑𝐈𝐙𝐙𝐀𝐓𝐀*

👤 *𝐄𝐬𝐞𝐜𝐮𝐭𝐨𝐫𝐞:* @${sender.split('@')[0]}
🛑 *𝐀𝐳𝐢𝐨𝐧𝐞:* ${actionName}

🔻 *𝐑𝐞𝐭𝐫𝐨𝐜𝐞𝐬𝐬𝐢𝐨𝐧𝐞 𝐝𝐢 𝐦𝐚𝐬𝐬𝐚:*
${adminsToDemote.length > 0 ? adminsToDemote.map(jid => `• @${jid.split('@')[0]}`).join('\n') : '_Nessun admin rilevato_'}

🔒 *𝐋𝐨𝐜𝐤𝐝𝐨𝐰𝐧:* _Il gruppo è stato chiuso._
───────────────`.trim();

    let mentionsArr = [sender, ...adminsToDemote];
    
    await conn.sendMessage(m.chat, { 
        text: alertText, 
        mentions: mentionsArr,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363233544482011@newsletter',
                serverMessageId: 100,
                newsletterName: "🛡️ 𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓 • 𝐒𝐞𝐜𝐮𝐫𝐢𝐭𝐲"
            }
        }
    });
};

handler.help = ['antinuke on/off', 'addwhitelist @user', 'delwhitelist @user'];
handler.tags = ['gruppo'];
handler.command = /^(contronuke|antinuke|addwhitelist|delwhitelist|resetwhitelist)$/i;
handler.owner = true;
handler.group = true;

export default handler;
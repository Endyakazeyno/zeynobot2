
import fetch from 'node-fetch';

const PERM = { ADMIN: 'admin', OWNER: 'owner', sam: 'sam' };

const featureRegistry = [
  { key: 'welcome', store: 'chat', perm: PERM.ADMIN, aliases: ['benvenuto'], groupOnly: true, name: 'Welcome', desc: 'Messaggio di benvenuto' },
  { key: 'goodbye', store: 'chat', perm: PERM.ADMIN, aliases: ['addio'], groupOnly: true, name: 'Addio', desc: 'Messaggio di addio' },
  { key: 'antispam', store: 'chat', perm: PERM.ADMIN, aliases: [], name: 'Antispam', desc: 'Antispam testuale' },
  { key: 'antispamcomandi', store: 'chat', perm: PERM.ADMIN, aliases: ['antispambot'], name: 'Anti-spam comandi', desc: 'Limita spam comandi' },
  { key: 'antisondaggi', store: 'chat', perm: PERM.ADMIN, aliases: [], name: 'Anti-sondaggi', desc: 'Blocca sondaggi' },
  { key: 'antiparolacce', store: 'chat', perm: PERM.ADMIN, aliases: ['antitossici'], name: 'Filtro parolacce', desc: 'Rimuove insulti' },
  { key: 'bestemmiometro', store: 'chat', perm: PERM.ADMIN, aliases: ['bestemmie', 'antibestemmie'], groupOnly: true, name: 'Bestemmiometro', desc: 'Contatore bestemmie' },
  { key: 'antiBot', store: 'chat', perm: PERM.ADMIN, aliases: ['antibot', 'antibots'], name: 'Antibot', desc: 'Rimuove bot' },
  { key: 'antiBot2', store: 'chat', perm: PERM.ADMIN, aliases: ['antisubbots', 'antisub'], name: 'Anti-subbots', desc: 'Blocca sub-bot' },
  { key: 'antitrava', store: 'chat', perm: PERM.ADMIN, aliases: [], name: 'Antitrava', desc: 'Blocca messaggi trava' },
  { key: 'antimedia', store: 'chat', perm: PERM.ADMIN, aliases: [], groupOnly: true, name: 'Antimedia', desc: 'Elimina foto/video' },
  { key: 'antioneview', store: 'chat', perm: PERM.ADMIN, aliases: ['antiviewonce'], groupOnly: true, name: 'Antiviewonce', desc: 'Apre i viewonce' },
  { key: 'antitagall', store: 'chat', perm: PERM.ADMIN, aliases: ['anti-tagall', 'antimentioni'], groupOnly: true, name: 'Anti-tagall', desc: 'Evita menzioni massive' },
  { key: 'autotrascrizione', store: 'chat', perm: PERM.ADMIN, aliases: ['autotrascrivi'], groupOnly: true, name: 'Auto-trascrizione', desc: 'Trascrive gli audio' },
  { key: 'autotraduzione', store: 'chat', perm: PERM.ADMIN, aliases: ['autotraduci'], groupOnly: true, name: 'Auto-traduzione', desc: 'Traduce in italiano' },
  { key: 'rileva', store: 'chat', perm: PERM.ADMIN, aliases: ['detect'], groupOnly: true, name: 'Rileva', desc: 'Rileva eventi gruppo' },
  { key: 'antiporno', store: 'chat', perm: PERM.ADMIN, aliases: ['antiporn', 'antinsfw'], name: 'Antiporno', desc: 'Filtro NSFW' },
  { key: 'antigore', store: 'chat', perm: PERM.ADMIN, aliases: [], name: 'Antigore', desc: 'Filtro violenti' },
  { key: 'modoadmin', store: 'chat', perm: PERM.ADMIN, aliases: ['soloadmin'], name: 'Soloadmin', desc: 'Solo admin usano bot' },
  { key: 'ai', store: 'chat', perm: PERM.ADMIN, aliases: ['ia'], groupOnly: true, name: 'IA', desc: 'Intelligenza artificiale' },
  { key: 'vocali', store: 'chat', perm: PERM.ADMIN, aliases: ['siri'], groupOnly: true, name: 'Siri', desc: 'Risponde con audio' },
  { key: 'antivoip', store: 'chat', perm: PERM.ADMIN, aliases: [], name: 'Antivoip', desc: 'Blocca numeri voip' },
  { key: 'antiLink', store: 'chat', perm: PERM.ADMIN, aliases: ['antilink', 'nolink'], name: 'Antilink', desc: 'Antilink WhatsApp' },
  { key: 'antiLinkUni', store: 'chat', perm: PERM.ADMIN, aliases: ['antilinkuni'], name: 'Antilink Uni', desc: 'Blocca tutti i link' },
  { key: 'antiLink2', store: 'chat', perm: PERM.ADMIN, aliases: ['antilink2'], name: 'Antilink Social', desc: 'Blocca social link' },
  { key: 'reaction', store: 'chat', perm: PERM.ADMIN, aliases: ['reazioni'], groupOnly: true, name: 'Reazioni', desc: 'Reazioni automatiche' },
  { key: 'autolevelup', store: 'chat', perm: PERM.ADMIN, aliases: ['autolivello'], name: 'Autolivello', desc: 'Messaggio livello' },
  { key: 'antiprivato', store: 'bot', perm: PERM.OWNER, aliases: ['antipriv'], name: 'Blocco privato', desc: 'Blocca chat privata' },
  { key: 'soloe', store: 'bot', perm: PERM.sam, aliases: ['solocreatore'], name: 'Solocreatore', desc: 'Solo owner' },
  { key: 'multiprefix', store: 'bot', perm: PERM.OWNER, aliases: ['multiprefisso'], name: 'Multiprefix', desc: 'Più prefissi' },
  { key: 'jadibotmd', store: 'bot', perm: PERM.OWNER, aliases: ['subbots'], name: 'Subbots', desc: 'Bot multi-sessione' },
  { key: 'autoread', store: 'bot', perm: PERM.OWNER, aliases: ['read', 'lettura'], name: 'Lettura', desc: 'Autolettura msg' },
  { key: 'anticall', store: 'bot', perm: PERM.sam, aliases: [], name: 'Antichiamate', desc: 'Rifiuta chiamate' },
  { key: 'registrazioni', store: 'bot', perm: PERM.OWNER, aliases: ['registrazione'], name: 'Registrazione', desc: 'Obbligo registrazione' },
];

const aliasMap = new Map();
featureRegistry.forEach(f => {
    aliasMap.set(f.key.toLowerCase(), f);
    f.aliases.forEach(a => aliasMap.set(a.toLowerCase(), f));
});

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isSam }) => {
    let isEnable = /attiva|enable|on|1/i.test(command);
    
    global.db.data.chats = global.db.data.chats || {};
    global.db.data.settings = global.db.data.settings || {};
    let chat = global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};
    let bot = global.db.data.settings[conn.user.jid] = global.db.data.settings[conn.user.jid] || {};

    // Helper per l'immagine
    const getBuffer = async (url) => {
        try { 
            const res = await fetch(url); 
            return Buffer.from(await res.arrayBuffer()); 
        } catch (e) { return null; }
    };

    let profilePicture;
    try { 
        profilePicture = await conn.profilePictureUrl(conn.user.jid, 'image'); 
    } catch (e) { 
        profilePicture = 'https://files.catbox.moe/pyp87f.jpg'; 
    }
    let imageBuffer = await getBuffer(profilePicture);

    if (!args.length) {
        let menuText = `Ｎ Ｅ Ｗ Ｅ Ｒ Ａ  ｜  ＣＯＮＴＲＯＬ\n\n◤  𝐔𝐓𝐄𝐍𝐓𝐄 ﹕ @${m.sender.split('@')[0]}\n◣  𝐒𝐓𝐀𝐓𝐎   ﹕ Gestione Moduli\n\n───────────────\n_Usa ${usedPrefix}${command} [nome modulo] per configurare il sistema._`.trim();
        
        return await conn.sendMessage(m.chat, {
            text: menuText,
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363233544482011@newsletter', 
                    serverMessageId: 100,
                    newsletterName: "• 𝐍𝐄𝐖 𝐄𝐑𝐀 •"
                },
                externalAdReply: {
                    title: `⚙️ 𝐂𝐎𝐍𝐓𝐑𝐎𝐋 𝐂𝐄𝐍𝐓𝐄𝐑`, 
                    body: '𝐍𝐄𝐖 𝐄𝐑𝐀 • 𝐒𝐲𝐬𝐭𝐞𝐦',
                    thumbnail: imageBuffer,
                    mediaType: 1, 
                    renderLargerThumbnail: false,
                    sourceUrl: null
                },
                mentionedJid: [m.sender]
            }
        }, { quoted: m });
    }

    let type = args[0].toLowerCase();
    const feat = aliasMap.get(type);

    if (!feat) return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Error_\n───────────────\n❌ Modulo *${type}* non trovato.`);

    // Check Permessi
    if (feat.perm === PERM.sam && !isSam) return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Access Denied_\n───────────────\n⛔ Solo il Creatore può gestire questo modulo.`);
    if (feat.perm === PERM.OWNER && !isOwner && !isSam) return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Access Denied_\n───────────────\n⛔ Solo l'Owner può gestire questo modulo.`);
    if (feat.perm === PERM.ADMIN && m.isGroup && !(isAdmin || isOwner || isSam)) return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Access Denied_\n───────────────\n⛔ Solo gli Admin possono gestire questo modulo.`);

    const target = feat.store === 'bot' ? bot : chat;
    
    if (target[feat.key] === isEnable) {
        return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Warning_\n───────────────\n⚠️ Il modulo *${feat.name}* è già ${isEnable ? 'ATTIVO' : 'DISATTIVO'}.`);
    }

    target[feat.key] = isEnable;

    let statusEmoji = isEnable ? '🟢' : '🔴';
    let statusTitle = isEnable ? '𝐌𝐎𝐃𝐔𝐋𝐎 𝐀𝐓𝐓𝐈𝐕𝐀𝐓𝐎' : '𝐌𝐎𝐃𝐔𝐋𝐎 𝐃𝐈𝐒𝐀𝐓𝐓𝐈𝐕𝐀𝐓𝐎';

    let log = `ＮＥＷ ＥＲＡ  ｜  ＣＯＮＦＩＲＭ\n\n`;
    log += `◤  𝐌𝐎𝐃𝐔𝐋𝐎 ﹕ ${feat.name.toUpperCase()}\n`;
    log += `◣  𝐒𝐓𝐀𝐓𝐎   ﹕ ${statusEmoji} ${statusTitle}\n\n`;
    log += `───────────────\n`;
    log += `_Configurazione aggiornata con successo._`;

    await conn.sendMessage(m.chat, {
        text: log,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363233544482011@newsletter', 
                serverMessageId: 100,
                newsletterName: "• 𝐍𝐄𝐖 𝐄𝐑𝐀 •"
            },
            externalAdReply: {
                title: `${statusEmoji} ${statusTitle}`, 
                body: `System: ${feat.name}`,
                thumbnail: imageBuffer,
                mediaType: 1, 
                renderLargerThumbnail: false,
                sourceUrl: null
            }
        }
    }, { quoted: m });
};

handler.help = ['attiva', 'disattiva'];
handler.tags = ['main'];
handler.command = ['enable', 'disable', 'attiva', 'disattiva', 'on', 'off']; 

export default handler;
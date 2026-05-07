import fetch from 'node-fetch';

const PERM = {
  ADMIN: 'admin',
  OWNER: 'owner',
  sam: 'sam',
};

// ─── REGISTRO COMPLETO DELLE FUNZIONI (Logica Originale) ───
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
  { key: 'multiprefix', store: 'bot', perm: PERM.OWNER, aliases: ['multiprefisso'], onToggle: 'multiprefix', name: 'Multiprefix', desc: 'Più prefissi' },
  { key: 'jadibotmd', store: 'bot', perm: PERM.OWNER, aliases: ['subbots', 'jadibotmd'], name: 'Subbots', desc: 'Bot multi-sessione' },
  { key: 'autoread', store: 'bot', perm: PERM.OWNER, aliases: ['read', 'lettura'], name: 'Lettura', desc: 'Autolettura msg' },
  { key: 'anticall', store: 'bot', perm: PERM.sam, aliases: [], name: 'Antichiamate', desc: 'Rifiuta chiamate' },
  { key: 'registrazioni', store: 'bot', perm: PERM.OWNER, aliases: ['registrazione'], name: 'Registrazione', desc: 'Obbligo registrazione' },
];

const aliasMap = new Map();
for (const feat of featureRegistry) {
  aliasMap.set(feat.key.toLowerCase(), feat);
  for (const alias of feat.aliases) {
    aliasMap.set(alias.toLowerCase(), feat);
  }
}

const adminkeyz = new Set(['welcome', 'goodbye', 'antispam', 'antispamcomandi', 'antisondaggi', 'antiparolacce', 'bestemmiometro', 'antiBot', 'antitrava', 'antimedia', 'antioneview', 'antitagall', 'autotrascrizione', 'autotraduzione', 'rileva', 'antiporno', 'antigore', 'modoadmin', 'ai', 'vocali', 'antivoip', 'antiLink', 'antiLinkUni', 'antiLink2', 'reaction', 'autolevelup']);
const ownerkeyz = new Set(['antiprivato', 'soloe', 'multiprefix', 'jadibotmd', 'autoread', 'anticall', 'registrazioni']);

const adminz = featureRegistry.filter(f => adminkeyz.has(f.key));
const ownerz = featureRegistry.filter(f => ownerkeyz.has(f.key));

function checkPermission(feat, { m, isAdmin, isOwner, isSam }) {
  if (feat.groupOnly && !m.isGroup && !isOwner) {
    return `◤  𝐒𝐘𝐒𝐓𝐄𝐌 𝐖𝐀𝐑𝐍𝐈𝐍𝐆\n◣  Stato: Solo Gruppi`;
  }
  switch (feat.perm) {
    case PERM.sam:
      if (!isSam) return `◤  𝐒𝐘𝐒𝐓𝐄𝐌 𝐖𝐀𝐑𝐍𝐈𝐍𝐆\n◣  Stato: Solo Creatore`;
      break;
    case PERM.OWNER:
      if (feat.store === 'bot' && !isOwner && !isSam) return `◤  𝐒𝐘𝐒𝐓𝐄𝐌 𝐖𝐀𝐑𝐍𝐈𝐍𝐆\n◣  Stato: Solo Owner`;
      if (feat.store === 'chat' && m.isGroup && !(isAdmin || isOwner || isSam))
        return `◤  𝐒𝐘𝐒𝐓𝐄𝐌 𝐖𝐀𝐑𝐍𝐈𝐍𝐆\n◣  Stato: Solo Admin`;
      break;
    case PERM.ADMIN:
      if (m.isGroup && !(isAdmin || isOwner || isSam))
        return `◤  𝐒𝐘𝐒𝐓𝐄𝐌 𝐖𝐀𝐑𝐍𝐈𝐍𝐆\n◣  Stato: Solo Admin`;
      break;
  }
  return null;
}

let handler = async (m, { conn, usedPrefix, command, args, isOwner, isAdmin, isSam }) => {
  let isEnable = /true|enable|attiva|(turn)?on|1/i.test(command);
  if (/disable|disattiva|off|0/i.test(command)) isEnable = false;

  global.db.data.chats = global.db.data.chats || {};
  global.db.data.settings = global.db.data.settings || {};
  global.db.data.chats[m.chat] = global.db.data.chats[m.chat] || {};
  
  const botJid = conn.decodeJid(conn.user.jid);
  global.db.data.settings[botJid] = global.db.data.settings[botJid] || {};
  
  let chat = global.db.data.chats[m.chat];
  let bot = global.db.data.settings[botJid];

  const getStatus = (key) => {
    const feat = aliasMap.get(key.toLowerCase());
    if (!feat) return false;
    const target = feat.store === 'bot' ? bot : chat;
    return target[feat.key] || false;
  };

  const createSections = (features) => {
    const active = features.filter(f => getStatus(f.key));
    const inactive = features.filter(f => !getStatus(f.key));
    return [
      { title: '🔴 DISATTIVATI', rows: inactive.map(f => ({ title: f.name, description: f.desc, id: `${usedPrefix}attiva ${f.key}` })) },
      { title: '🟢 ATTIVATI', rows: active.map(f => ({ title: f.name, description: f.desc, id: `${usedPrefix}disattiva ${f.key}` })) }
    ];
  };

  if (!args.length) {
    const adminSections = createSections(adminz);
    const ownerSections = createSections(ownerz);

    const adminCard = {
      image: { url: 'https://files.catbox.moe/pyp87f.jpg' }, 
      title: '◤ 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 𝐀𝐃𝐌𝐈𝐍',
      body: 'Moduli di gestione gruppo.',
      footer: 'ɴ ᴇ ᴡ ᴇ ʀ ᴀ  ᴄ ᴏ ʀ ᴇ',
      buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '⚙️ CONFIGURA', sections: adminSections }) }]
    };

    let cards = [adminCard];
    if (isOwner || isSam) {
      cards.push({
        image: { url: 'https://files.catbox.moe/pyp87f.jpg' }, 
        title: '◤ 𝐒𝐄𝐓𝐓𝐈𝐍𝐆𝐒 𝐎𝐖𝐍𝐄𝐑',
        body: 'Moduli di sistema core.',
        footer: 'ɴ ᴇ ᴡ ᴇ ʀ ᴀ  ᴄ ᴏ ʀ ᴇ',
        buttons: [{ name: 'single_select', buttonParamsJson: JSON.stringify({ title: '⚙️ CONFIGURA', sections: ownerSections }) }]
      });
    }

    let menuText = `Ｎ Ｅ Ｗ Ｅ Ｒ Ａ  ｜  ＣＯＮＴＲＯＬ\n\n◤  𝐔𝐓𝐄𝐍𝐓𝐄  ﹕ @${m.sender.split('@')[0]}\n─── ꜱᴇʟᴇᴢɪᴏɴᴀ ᴜɴᴀ ᴄᴀᴛᴇɢᴏʀɪᴀ ───`.trim();

    return conn.sendMessage(m.chat, {
      text: menuText,
      cards,
      mentions: [m.sender]
    }, { quoted: m });
  }

  let results = [];
  for (let type of args.map(arg => arg.toLowerCase())) {
    let result = { type, status: '', success: false };

    const feat = aliasMap.get(type);
    if (!feat) {
      result.status = '❌ Sconosciuto';
      results.push(result);
      continue;
    }

    const permError = checkPermission(feat, { m, isAdmin, isOwner, isSam });
    if (permError) {
      result.status = '⛔ Negato';
      results.push(result);
      continue;
    }

    const target = feat.store === 'bot' ? bot : chat;
    if (target[feat.key] === isEnable) {
      result.status = `⚠️ Già ${isEnable ? 'Attivo' : 'Disattivo'}`;
      results.push(result);
      continue;
    }

    target[feat.key] = isEnable;
    result.status = isEnable ? '🟢 𝐀𝐓𝐓𝐈𝐕𝐀𝐓𝐎' : '🔴 𝐃𝐈𝐒𝐀𝐓𝐓𝐈𝐕𝐀𝐓𝐎';
    result.success = true;
    results.push(result);
  }

  // LOG FINALE COMPATTO STILE NEWERA
  let log = `ＮＥＷ ＥＲＡ  ｜  ＣＯＮＦＩＲＭ\n\n`;
  for (const res of results) {
    const cleanType = String(res.type || '').toUpperCase();
    log += `◤  𝐌𝐎𝐃𝐔𝐋𝐎 ﹕ ${cleanType}\n`;
    log += `◣  𝐒𝐓𝐀𝐓𝐎   ﹕ ${res.status}\n\n`;
  }
  log += `─── ꜱʏꜱᴛᴇᴍ ᴜᴘᴅᴀᴛᴇᴅ ───`;

  await conn.sendMessage(m.chat, { text: log.trim(), mentions: [m.sender] }, { quoted: m });
};

handler.help = ['attiva', 'disattiva'];
handler.tags = ['main'];
handler.command = ['enable', 'disable', 'attiva', 'disattiva']; 

export default handler;
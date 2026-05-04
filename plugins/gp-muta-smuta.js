
let mutedUsers = new Map();
let spamWarnings = new Map();

function formatTimeLeft(timestamp) {
    if (!timestamp) return '∞ Permanente'
    const diff = timestamp - Date.now()
    if (diff <= 0) return '✅ Scaduto'
    const minutes = Math.ceil(diff / 60000)
    if (minutes === 0) return '< 1 min'
    return `${minutes} min`
}

function normalizeId(id) {
    if (!id) return '';
    let normalizedId = id.replace('@s.whatsapp.net', '').replace('@lid', '').split('@')[0]
    if (normalizedId.startsWith('39')) {
        normalizedId = normalizedId.substring(2)
    }
    return normalizedId
}

global.gpMutaSmuta = global.gpMutaSmuta || {}
global.gpMutaSmuta.mutedUsers = mutedUsers
global.gpMutaSmuta.normalizeId = normalizeId

function getUserName(userId, participants) {
    if (!participants || !Array.isArray(participants)) return normalizeId(userId)
    const normalizedUserId = normalizeId(userId)
    let participant = participants.find(p => normalizeId(p.id) === normalizedUserId)
    if (!participant) participant = participants.find(p => p.jid && normalizeId(p.jid) === normalizedUserId)
    if (!participant) {
        const alternativeId = normalizedUserId.startsWith('39') ? normalizedUserId.substring(2) : '39' + normalizedUserId
        participant = participants.find(p => normalizeId(p.id) === alternativeId)
        if (!participant) participant = participants.find(p => p.jid && normalizeId(p.jid) === alternativeId)
    }
    return participant?.notify || participant?.name || normalizedUserId
}


const legamContext = (title, mentions = []) => ({
    mentionedJid: mentions,
    isForwarded: true,
    forwardingScore: 999,
    forwardedNewsletterMessageInfo: {
        newsletterJid: '120363259442839354@newsletter',
        serverMessageId: 100,
        newsletterName: `𖠇`
    }
});

let handler = async (m, { conn, command, args, participants, usedPrefix }) => {
    try {
        const isMute = command === 'muta'
        const isUnmute = command === 'smuta'
        const isList = command === 'listamutati'

        const decodedSender = conn.decodeJid(m.sender);
        const executorIsOwner = global.owner.map(([n]) => n + '@s.whatsapp.net').includes(decodedSender) || m.fromMe;

        
        if (isList) {
            if (!mutedUsers.size) {
                let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Sanction Registry_
───────────────
📭 *𝐋𝐈𝐒𝐓𝐀 𝐌𝐔𝐓𝐀𝐓𝐈*

• _Nessun utente è attualmente mutato._
───────────────`.trim();
                return conn.sendMessage(m.chat, { text: msg, contextInfo: legamContext('Lista Pulita') }, { quoted: m });
            }
            
            let text = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Sanction Registry_
───────────────
📭 *𝐋𝐈𝐒𝐓𝐀 𝐌𝐔𝐓𝐀𝐓𝐈*\n\n`
            let mentions = []
            for (let [normalized, data] of mutedUsers.entries()) {
                let timeLeft = formatTimeLeft(data.timestamp)
                let userJid = data.displayNumber.startsWith('39') && data.displayNumber.length === 12 ? data.displayNumber + '@s.whatsapp.net' : data.displayNumber + '@lid'
                let currentName = getUserName(userJid, participants) || data.displayNumber
                
                text += `│ 🔇 @${currentName}\n`
                text += `│ ⏱️ *Scadenza:* ${timeLeft}\n`
                text += `│ 📝 *Motivo:* _${data.reason}_\n`
                text += `│ 🛡️ *Autore:* _${data.mutedByOwner ? '👑 Owner Supremo' : '👥 Admin'}_\n`
                text += `╰───────────────⬣\n`
                mentions.push(userJid)
            }
            text += `\n───────────────`.trim()
            return conn.sendMessage(m.chat, { text, contextInfo: legamContext('Registro Punizioni', mentions) }, { quoted: m });
        }

        
        let users = []
        if (m.mentionedJid?.length) {
            users = m.mentionedJid
            args = args.filter(arg => !arg.startsWith('@'))
        } else if (m.quoted) {
            users = [m.quoted.sender]
        }

        if (!users.length) {
            let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_
───────────────
⚠️ *𝐄𝐑𝐑𝐎𝐑𝐄 𝐒𝐈𝐍𝐓𝐀𝐒𝐒𝐈*

• *Uso:* ${usedPrefix}${command} @user [minuti] [motivo]
• *Esempio:* _Rispondi a un messaggio_
───────────────`.trim();
            return conn.sendMessage(m.chat, { text: msg, contextInfo: legamContext('Errore Sintassi') }, { quoted: m });
        }

        const validUsers = []
        const userParticipantMap = new Map()
        for (const user of users) {
            const decodedId = conn.decodeJid(user)
            const normalizedUserId = normalizeId(decodedId)
            let isValid = false
            let matchedParticipant = participants.find(p => normalizeId(p.id) === normalizedUserId)
            if (!matchedParticipant) matchedParticipant = participants.find(p => p.jid && normalizeId(p.jid) === normalizedUserId)
            if (!matchedParticipant) {
                const alternativeId = normalizedUserId.startsWith('39') ? normalizedUserId.substring(2) : '39' + normalizedUserId
                matchedParticipant = participants.find(p => normalizeId(p.id) === alternativeId)
                if (!matchedParticipant) matchedParticipant = participants.find(p => p.jid && normalizeId(p.jid) === alternativeId)
            }
            if (!isValid && m.quoted && decodedId === conn.decodeJid(m.quoted.sender)) {
                isValid = true
                matchedParticipant = participants.find(p => p.jid && conn.decodeJid(p.jid) === decodedId)
            }
            if (matchedParticipant || isValid) {
                validUsers.push(decodedId)
                userParticipantMap.set(decodedId, matchedParticipant)
            }
        }
        users = validUsers

        if (!users.length) {
            let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_
───────────────
❌ *𝐓𝐀𝐑𝐆𝐄𝐓 𝐈𝐍𝐕𝐀𝐋𝐈𝐃𝐎*

• _Utente non valido o non nel gruppo._
───────────────`.trim();
            return conn.sendMessage(m.chat, { text: msg, contextInfo: legamContext('Target Invalido') }, { quoted: m });
        }
        
        let time = 0
        let reason = 'Violazione delle regole del gruppo'

        if (args.length) {
            let timeArg = args[0].toLowerCase()
            let timeMatch = timeArg.match(/^(\d+)(s|sec|m|min)?$/)

            if (timeMatch) {
                let value = parseInt(timeMatch[1])
                let unit = timeMatch[2] || 'm'
                time = unit.startsWith('s') ? value * 1000 : value * 60000
                reason = args.slice(1).join(' ') || reason
            } else {
                reason = args.join(' ')
            }
        }

        let results = []

        for (let i = 0; i < users.length; i++) {
            const user = users[i]
            const jid = conn.decodeJid(user)
            const matched = userParticipantMap.get(user)
            const preferredJid = matched && matched.jid ? conn.decodeJid(matched.jid) : jid
            const normalized = normalizeId(preferredJid)
            const displayNumber = preferredJid.split('@')[0]
            let isTargetOwner = global.owner.map(([n]) => n + '@s.whatsapp.net').includes(jid)
            
            if (isTargetOwner && isMute) {
                const normalizedPunish = normalizeId(conn.decodeJid(m.sender))
                mutedUsers.set(normalizedPunish, { timestamp: Date.now() + (2 * 60000), reason: 'Tentativo di mutare l\'Owner 👀', lastNotification: 0, displayNumber: conn.decodeJid(m.sender).split('@')[0], mutedByOwner: true })
                let punMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Divine Punishment_
───────────────
⚡ *𝐏𝐔𝐍𝐈𝐙𝐈𝐎𝐍𝐄 𝐀𝐔𝐓𝐎𝐌𝐀𝐓𝐈𝐂𝐀*

• *Errore:* Non puoi mutare l'Owner.
• *Effetto:* Sei mutato per 2 minuti.
───────────────`.trim();
                return conn.sendMessage(m.chat, { text: punMsg, contextInfo: legamContext('Punizione Divina', [m.sender]) }, { quoted: m });
            }

            if (isTargetOwner && isUnmute) {
                let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_\n───────────────\n❌ Azione negata: Un Owner è immutabile.`;
                return conn.sendMessage(m.chat, { text: msg, contextInfo: legamContext('Azione Negata') }, { quoted: m });
            }
            if (jid === conn.user.jid) {
                let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_\n───────────────\n🤖 Azione negata: Non puoi ${command}re il bot.`;
                return conn.sendMessage(m.chat, { text: msg, contextInfo: legamContext('Azione Negata') }, { quoted: m });
            }

            if (isMute) {
                const muteData = { timestamp: time ? Date.now() + time : 0, reason, lastNotification: 0, displayNumber, mutedByOwner: executorIsOwner };
                mutedUsers.set(normalized, muteData);
                results.push(`@${displayNumber}`);
            } else if (isUnmute) {
                const normalizedTargetId = normalizeId(preferredJid);
                let muteData = mutedUsers.get(normalizedTargetId);

                if (muteData) {
                    if (muteData.mutedByOwner && !executorIsOwner) {
                        let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Hierarchy Protection_
───────────────
⚠️ *𝐀𝐂𝐂𝐄𝐒𝐒𝐎 𝐍𝐄𝐆𝐀𝐓𝐎*

• _Muto imposto da un Owner Supremo._
• _Autorità Admin insufficiente._
───────────────`.trim();
                        return conn.sendMessage(m.chat, { text: msg, contextInfo: legamContext('Gerarchia Violata', [preferredJid]) }, { quoted: m });
                    }
                    
                    mutedUsers.delete(normalizedTargetId);
                    results.push(`@${displayNumber}`);
                } else if (users.length === 1) {
                    let infoMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Information_\n───────────────\n💡 L'utente @${displayNumber} non è mutato.`;
                    return conn.sendMessage(m.chat, { text: infoMsg, contextInfo: legamContext('Stato Utente', [preferredJid]) }, { quoted: m });
                }
            }
        }

       
        if (results.length > 0) {
            let titleMute = isMute ? '𝐒𝐈𝐒𝐓𝐄𝐌𝐀 𝐌𝐔𝐓𝐄' : '𝐒𝐈𝐒𝐓𝐄𝐌𝐀 𝐒𝐌𝐔𝐓𝐄';
            let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Security Core_
───────────────
🛡️ *${titleMute}*

• *Utenti:* ${results.join(', ')}
• *Azione:* ${isMute ? 'Inibizione Chat' : 'Ripristino Voce'}
• *Durata:* ${isMute ? (time ? `${time / 60000} minuti` : '∞ Permanente') : 'Immediata'}
• *Motivo:* _${reason}_

👑 _Azione autorizzata da ${executorIsOwner ? 'Owner' : 'Admin'}._
───────────────`.trim()

            await conn.sendMessage(m.chat, {
                text: msg,
                contextInfo: legamContext(`Legam OS Security`, users)
            }, { quoted: m });
        }

    } catch (e) {
        console.error('Errore nel comando muta:', e);
    }
}


handler.before = async (m, { conn, isCommand }) => {
    try {
        if (!m.sender || m.sender === conn.user.jid) return

        const senderJid = conn.decodeJid(m.sender)
        let normalizedSender = normalizeId(senderJid)

        if (senderJid.endsWith('@lid')) {
            const gm = await conn.groupMetadata(m.chat).catch(() => null)
            if (gm) {
                const participant = gm.participants.find(p => conn.decodeJid(p.id) === senderJid)
                if (participant && participant.jid) normalizedSender = normalizeId(conn.decodeJid(participant.jid))
            }
        }
        
        const isMuted = mutedUsers.has(normalizedSender)
        if (!isMuted) return
        if (isCommand && m.isAdmin) return true

        const data = mutedUsers.get(normalizedSender)
        
        if (data.timestamp && Date.now() > data.timestamp) {
            mutedUsers.delete(normalizedSender)
            let unMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Update_
───────────────
🔓 *𝐌𝐔𝐓𝐄 𝐒𝐂𝐀𝐃𝐔𝐓𝐎*

• *Utente:* @${m.sender.split('@')[0]}
• *Stato:* Smutato automaticamente.
───────────────`.trim();
            await conn.sendMessage(m.chat, { text: unMsg, contextInfo: legamContext('Mute Scaduto', [m.sender]) })
            return
        }

        conn.sendMessage(m.chat, { delete: m.key }).catch(() => {})

        const now = Date.now()
        const userWarnings = spamWarnings.get(m.sender) || { count: 0, lastMessage: 0, warned: false }
        
        if (now - userWarnings.lastMessage < 2000) userWarnings.count++
        else userWarnings.count = 1
        
        userWarnings.lastMessage = now
        spamWarnings.set(m.sender, userWarnings)
        
        if (userWarnings.count >= 3 && !userWarnings.warned) {
            let warnMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Warning_
───────────────
⚠️ *𝐀𝐕𝐕𝐄𝐑𝐓𝐈𝐌𝐄𝐍𝐓𝐎 𝐒𝐏𝐀𝐌*

• *Utente:* @${m.sender.split('@')[0]}
• *Soglia:* ${userWarnings.count}/7
• *Rischio:* Rimozione forzata.
───────────────`.trim();
            await conn.sendMessage(m.chat, { text: warnMsg, contextInfo: legamContext('Spam Rilevato', [m.sender]) })
            userWarnings.warned = true
            spamWarnings.set(m.sender, userWarnings)
        }
        
        if (userWarnings.count >= 7) {
            try {
                let kickMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Enforcement_
───────────────
🔨 *𝐔𝐓𝐄𝐍𝐓𝐄 𝐑𝐈𝐌𝐎𝐒𝐒𝐎*

• *Utente:* @${m.sender.split('@')[0]}
• *Motivo:* Spam estremo durante il muto.
───────────────`.trim();
                await conn.sendMessage(m.chat, { text: kickMsg, contextInfo: legamContext('KICK AUTOMATICO', [m.sender]) })
                await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
                spamWarnings.delete(m.sender)
                mutedUsers.delete(normalizedSender)
            } catch (e) {
                const currentData = mutedUsers.get(normalizedSender)
                mutedUsers.set(normalizedSender, { ...currentData, timestamp: Date.now() + (60 * 60000), reason: currentData.reason + ' + spam eccessivo' })
            }
        }

        const shouldNotify = !data.lastNotification || (now - data.lastNotification) > 300000 
        
        if (shouldNotify) {
            let remaining = formatTimeLeft(data.timestamp)
            let nMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Silence Protocol_
───────────────
🤫 *𝐒𝐈𝐋𝐄𝐍𝐙𝐈𝐎*

• *Status:* Non puoi parlare.
• *Motivo:* _${data.reason}_
• *Restano:* ${remaining}
───────────────`.trim();
            try {
                await conn.sendMessage(m.chat, { text: nMsg, contextInfo: legamContext('𖠇', [m.sender]) })
                data.lastNotification = now
                mutedUsers.set(normalizedSender, data)
            } catch (e) {}
        }
    } catch (err) {}
    return false 
}

setInterval(() => {
    const now = Date.now()
    for (let [user, data] of mutedUsers.entries()) {
        if (data.timestamp && now > data.timestamp) mutedUsers.delete(user)
    }
    for (let [user, warnings] of spamWarnings.entries()) {
        if (now - warnings.lastMessage > 300000) spamWarnings.delete(user)
    }
}, 60000)

handler.help = ['muta', 'smuta', 'listamutati']
handler.tags = ['gruppo']
handler.command = /^(muta|smuta|listamutati)$/i
handler.group = true
handler.admin = true
handler.botAdmin = true

export default handler
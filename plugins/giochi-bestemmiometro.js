
let handler = async (m, { conn }) => {
    let chat = global.db.data.chats[m.chat] || {}
    let user = global.db.data.users[m.sender] || {}

    // Il bot agisce solo se il monitoraggio è attivo nel gruppo
    if (!chat.bestemmiometro) return

    // Incrementa il contatore delle bestemmie dell'utente
    user.blasphemy = (user.blasphemy || 0) + 1

    // Messaggio in stile New Era senza inoltri canale
    let msg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Blasphemy Radar_
───────────────
🤬 *𝐁𝐄𝐒𝐓𝐄𝐌𝐌𝐈𝐎𝐌𝐄𝐓𝐑𝐎* 🤬
───────────────

👤 *𝐏𝐞𝐜𝐜𝐚𝐭𝐨𝐫𝐞:* @${m.sender.split('@')[0]}
📊 *𝐂𝐨𝐧𝐭𝐨 𝐓𝐨𝐭𝐚𝐥𝐞:* \`${user.blasphemy}\` imprecazioni.

⚠️ _Datti una calmata, il sistema sta registrando ogni tua parola._
───────────────`.trim()

    // Invia il messaggio con menzione semplice
    await conn.sendMessage(m.chat, { 
        text: msg, 
        mentions: [m.sender] 
    }, { quoted: m })
}

// Lista di rilevamento (RegExp)
handler.customPrefix = /(porco dio|porcodio|dio bastardo|dio cane|porcamadonna|madonnaporca|porca madonna|madonna porca|dio cristo|diocristo|dio maiale|diomaiale|jesucristo|jesu cristo|cristo madonna|madonna impanata|dio cristo|cristo dio|dio frocio|dio gay|dio madonna|dio infuocato|dio crocifissato|madonna puttana|madonna vacca|madonna inculata|maremma maiala|padre pio|jesu impanato|jesu porco|diocane|dio capra|capra dio|padre pio ti spio)/i
handler.command = new RegExp
handler.group = true

export default handler

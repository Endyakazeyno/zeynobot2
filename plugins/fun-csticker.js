
import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Controllo input New Era
    if (!text) {
        let usageMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Elite Sticker Engine_
───────────────
⚠️ *𝐄𝐑𝐑𝐎𝐑𝐄 𝐒𝐈𝐍𝐓𝐀𝐒𝐒𝐈*

• *Uso:* ${usedPrefix}${command} [testo]
• *Esempio:* ${usedPrefix}${command} Legam OS
───────────────`.trim()
        return m.reply(usageMsg)
    }

    // Feedback immediato per la gara
    await m.react('⏳')

    try {
        // API Primaria (Ritorna direttamente il video dell'animazione)
        let apiUrl = `https://api.vreden.my.id/api/brat-animated?text=${encodeURIComponent(text)}`
        let res = await fetch(apiUrl)
        let json = await res.json()
        
        let videoUrl = json.result
        if (!videoUrl) throw new Error('API non ha restituito URL')

        // Scarichiamo il video come buffer
        let videoRes = await fetch(videoUrl)
        let videoBuffer = await videoRes.buffer()

        const packName = global.authsticker || '✧˚⭐️ 𝐍𝐄𝐖 𝐄𝐑𝐀 ⭐️˚✧'
        const authorName = global.nomepack || '✧˚⭐️ 𝐒𝐲𝐬𝐭𝐞𝐦 ⭐️˚✧'

        // Creazione sticker usando la tua funzione interna lib/sticker.js
        // Passiamo il buffer, la funzione sticker si occuperà di FFmpeg
        let stiker = await sticker(videoBuffer, false, packName, authorName)

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true, { quoted: m })
            await m.react('✅')
        } else {
            throw new Error('Funzione sticker ha restituito null')
        }

    } catch (e) {
        console.error('Errore Csticker:', e)
        
        // FALLBACK DI EMERGENZA - API Secondaria se la prima fallisce
        try {
            let fallbackRes = await fetch(`https://api.siputzx.my.id/api/maker/brat/animate?text=${encodeURIComponent(text)}`)
            let fallbackBuffer = await fallbackRes.buffer()
            
            let stikerFallback = await sticker(fallbackBuffer, false, global.authsticker, global.nomepack)
            
            if (stikerFallback) {
                await conn.sendFile(m.chat, stikerFallback, 'sticker.webp', '', m, true, { quoted: m })
                await m.react('✅')
            } else {
                throw new Error('Fallback fallito')
            }
        } catch (err) {
            await m.react('❌')
            let errorMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Critical Error_
───────────────
❌ *𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐀𝐌𝐄𝐍𝐓𝐎 𝐅𝐀𝐋𝐋𝐈𝐓𝐎*

• *Causa:* Errore interno FFmpeg o Buffer corrotto.
• *Consiglio:* Prova con una parola singola.
───────────────`.trim()
            await m.reply(errorMsg)
        }
    }
}

handler.help = ['csticker']
handler.tags = ['sticker']
handler.command = /^(csticker|brat)$/i
handler.register = true

export default handler
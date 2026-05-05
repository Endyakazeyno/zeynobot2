
import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Controllo input New Era
    if (!text) {
        let usageMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Sticker Engine_
───────────────
⚠️ *𝐄𝐑𝐑𝐎𝐑𝐄 𝐒𝐈𝐍𝐓𝐀𝐒𝐒𝐈*

• *Uso:* ${usedPrefix}${command} [testo]
• *Esempio:* ${usedPrefix}${command} Legam OS
───────────────`.trim()
        return m.reply(usageMsg)
    }

    // Feedback immediato
    await m.react('⏳')

    try {
        // API che genera il video dell'animazione Brat
        let res = await fetch(`https://api.vreden.my.id/api/brat-animated?text=${encodeURIComponent(text)}`)
        if (!res.ok) throw new Error('API Error')
        
        let json = await res.json()
        let videoUrl = json.result // URL del video animato
        
        if (!videoUrl) throw new Error('No Video URL')

        // SCARICHIAMO IL BUFFER DEL VIDEO
        let response = await fetch(videoUrl)
        let buffer = await response.buffer()

        // DEFINIAMO I PACKNAME (usa i tuoi global o quelli di default)
        const packName = global.authsticker || '✧˚⭐️ 𝐍𝐄𝐖 𝐄𝐑𝐀 ⭐️˚✧'
        const authorName = global.nomepack || '✧˚⭐️ 𝐒𝐲𝐬𝐭𝐞𝐦 ⭐️˚✧'

        // USIAMO LA TUA LIBRERIA INTERNA PER CREARE LO STICKER
        // Questo passaggio è fondamentale per evitare "impossibile scaricare"
        let stiker = await sticker(buffer, false, packName, authorName)

        if (stiker) {
            // INVIO TRAMITE IL TUO METODO DI SISTEMA
            await conn.sendFile(
                m.chat,
                stiker,
                'sticker.webp',
                '',
                m,
                false, // 'false' perché è già un webp pronto
                { quoted: m }
            )
            await m.react('✅')
        } else {
            throw new Error('Sticker processing failed')
        }

    } catch (e) {
        console.error(e)
        // Fallback statico veloce se l'animazione fallisce (per non restare a mani vuote in gara)
        try {
            let resStatic = await fetch(`https://api.vreden.my.id/api/brat?text=${encodeURIComponent(text)}`)
            let jsonStatic = await resStatic.json()
            let stikerStatic = await sticker(false, jsonStatic.result, global.authsticker, global.nomepack)
            await conn.sendFile(m.chat, stikerStatic, 'sticker.webp', '', m, false, { quoted: m })
            await m.react('⚠️')
        } catch (err) {
            await m.react('❌')
            m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Critical Error_\n───────────────\n❌ Errore nel processamento dello sticker.\nAssicurati che FFmpeg sia attivo.`)
        }
    }
}

handler.help = ['csticker']
handler.tags = ['sticker']
handler.command = /^(csticker|brat)$/i

export default handler
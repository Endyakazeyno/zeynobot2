
import { sticker } from '../lib/sticker.js'
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Controllo input New Era
    if (!text) {
        let usageMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Brat Engine_
───────────────
⚠️ *𝐄𝐑𝐑𝐎𝐑𝐄 𝐒𝐈𝐍𝐓𝐀𝐒𝐒𝐈*

• *Uso:* ${usedPrefix}${command} [testo]
• *Esempio:* ${usedPrefix}${command} Questo testo è molto lungo per testare lo scroll
───────────────`.trim()
        return m.reply(usageMsg)
    }

    await m.react('⚡')

    try {
        // API specializzata: Sfondo Bianco, Testo Nero. 
        // Gestisce lo "scrolling" se il testo supera la larghezza standard.
        // Usiamo l'endpoint che genera il video MP4 per garantire l'animazione se necessaria.
        let apiUrl = `https://api.vreden.my.id/api/brat-animated?text=${encodeURIComponent(text)}&mode=white`
        let res = await fetch(apiUrl)
        
        if (!res.ok) throw new Error('API Offline')
        
        let json = await res.json()
        let mediaUrl = json.result
        
        if (!mediaUrl) throw new Error('No Media URL')

        // Scarichiamo il media (Video o WebP animato)
        let mediaRes = await fetch(mediaUrl)
        let buffer = await mediaRes.buffer()

        const packName = global.authsticker || '✧˚⭐️ 𝐍𝐄𝐖 𝐄𝐑𝐀 ⭐️˚✧'
        const authorName = global.nomepack || '✧˚⭐️ 𝐒𝐲𝐬𝐭𝐞𝐦 ⭐️˚✧'

        // Passiamo il buffer alla tua libreria interna.
        // Se è un video lungo, sticker.js (grazie a FFmpeg) creerà lo sticker video.
        let stiker = await sticker(buffer, false, packName, authorName)

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true, { quoted: m })
            await m.react('✅')
        } else {
            // Fallback diretto se sticker() fallisce il processamento
            await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
            await m.react('✅')
        }

    } catch (e) {
        console.error('Brat Engine Error:', e)
        
        // Protocollo di emergenza: API Alternativa con sfondo bianco forzato
        try {
            let res2 = await fetch(`https://api.siputzx.my.id/api/maker/brat/animate?text=${encodeURIComponent(text)}`)
            let buffer2 = await res2.buffer()
            let stiker2 = await sticker(buffer2, false, global.authsticker, global.nomepack)
            
            await conn.sendFile(m.chat, stiker2, 'sticker.webp', '', m, true, { quoted: m })
            await m.react('✅')
        } catch (err) {
            await m.react('❌')
            m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Overload_\n───────────────\n❌ Impossibile generare lo sticker.\nI server di rendering non rispondono.`)
        }
    }
}

handler.help = ['csticker']
handler.tags = ['sticker']
handler.command = /^(csticker|brat)$/i
handler.register = true

export default handler
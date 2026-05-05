
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Controllo input con estetica New Era
    if (!text) {
        let usageMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Sticker Engine_
───────────────
⚠️ *𝐄𝐑𝐑𝐎𝐑𝐄 𝐒𝐈𝐍𝐓𝐀𝐒𝐒𝐈*

• *Uso:* ${usedPrefix}${command} [testo]
• *Esempio:* ${usedPrefix}${command} haii maniezz
───────────────`.trim()
        return m.reply(usageMsg)
    }

    // Feedback visivo di caricamento
    await m.react('⏳')

    try {
        // Questa API genera la versione ANIMATA (un file MP4)
        let apiUrl = `https://api.ryzendesu.vip/api/maker/bratVideo?text=${encodeURIComponent(text)}`
        let res = await fetch(apiUrl)
        
        if (!res.ok) throw new Error('API Offline')
        
        let buffer = await res.arrayBuffer()
        let buff = Buffer.from(buffer)

        // ==========================================
        // TENTATIVO 1: CONVERSIONE STICKER NATIVA
        // ==========================================
        // Prova a usare il convertitore ffmpeg integrato nel bot per fare un vero sticker
        try {
            if (conn.sendVideoAsSticker) {
                await conn.sendVideoAsSticker(m.chat, buff, m, { packname: '𝐍𝐄𝐖 𝐄𝐑𝐀', author: '𝐒𝐲𝐬𝐭𝐞𝐦' })
                await m.react('✅')
                return // Se ha successo, il comando finisce qui.
            }
        } catch (e) {
            console.log("Conversione WebP fallita. Avvio protocollo GIF di emergenza.")
        }

        // ==========================================
        // TENTATIVO 2: FALLBACK GIF INFALLIBILE
        // ==========================================
        // Se il bot non riesce a convertirlo, lo invia come video a riproduzione automatica (GIF).
        // Questo risolve il problema dello screen 1 ed è identico allo screen 2.
        await conn.sendMessage(m.chat, { 
            video: buff, 
            gifPlayback: true, // Lo fa riprodurre in loop automatico come uno sticker
            caption: `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Brat Engine_`
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        // Messaggio di errore New Era
        let errorMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Error_
───────────────
❌ *𝐆𝐄𝐍𝐄𝐑𝐀𝐙𝐈𝐎𝐍𝐄 𝐅𝐀𝐋𝐋𝐈𝐓𝐀*

• *Dettaglio:* Impossibile contattare il server di rendering grafico.
• *Azione:* Riprova tra qualche minuto.
───────────────`.trim()
        await m.reply(errorMsg)
        await m.react('❌')
    }
}

handler.help = ['csticker <testo>', 'brat <testo>']
handler.tags = ['sticker']
// Si attiva sia con .csticker che con .brat
handler.command = /^(csticker|brat)$/i

export default handler
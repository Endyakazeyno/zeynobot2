
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Controllo input New Era
    if (!text) {
        let usageMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Elite Sticker Engine_
───────────────
⚠️ *𝐄𝐑𝐑𝐎𝐑𝐄 𝐒𝐈𝐍𝐓𝐀𝐒𝐒𝐈*

• *Uso:* ${usedPrefix}${command} [testo]
• *Esempio:* ${usedPrefix}${command} Forza Legam!
───────────────`.trim()
        return m.reply(usageMsg)
    }

    // Reazione per dare conferma immediata
    await m.react('🔥')

    try {
        // Questa API genera DIRETTAMENTE un WebP animato di alta qualità (Brat Animato)
        // Usiamo un endpoint che restituisce il file già ottimizzato per WhatsApp
        let apiUrl = `https://api.vreden.my.id/api/brat-animated?text=${encodeURIComponent(text)}`
        let res = await fetch(apiUrl)
        
        if (!res.ok) throw new Error('API Primaria Offline')
        
        let json = await res.json()
        let stickerUrl = json.result // L'API restituisce il link al file .webp animato

        if (!stickerUrl) throw new Error('Nessun risultato dall\'API')

        // Scarichiamo lo sticker
        let sticRes = await fetch(stickerUrl)
        let buffer = await sticRes.buffer()

        // Invio dello sticker con metadati New Era
        // Usiamo sendMessage con la chiave 'sticker' per la massima velocità
        await conn.sendMessage(m.chat, { 
            sticker: buffer,
            contextInfo: {
                externalAdReply: {
                    title: "✨ 𝐍𝐄𝐖 𝐄𝐑𝐀 𝐁𝐑𝐀𝐓 ✨",
                    body: "Generazione Animata Completata",
                    previewType: "PHOTO",
                    thumbnailUrl: "https://telegra.ph/file/08269e9a4f484196144e5.jpg", // Placeholder estetico
                    sourceUrl: "https://github.com"
                }
            }
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        // FALLBACK DI EMERGENZA (API Alternativa se la prima muore durante la gara)
        try {
            let fallbackUrl = `https://widipe.com/brat?text=${encodeURIComponent(text)}`
            let res2 = await fetch(fallbackUrl)
            let buffer2 = await res2.buffer()
            
            // Invia come sticker base se l'animato fallisce del tutto
            await conn.sendMessage(m.chat, { 
                sticker: buffer2 
            }, { quoted: m })
            
            await m.react('⚠️') // Segnala che è uscito statico per colpa del server
        } catch (err) {
            let errorMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Critical Failure_
───────────────
❌ *𝐄𝐑𝐑𝐎𝐑𝐄 𝐃𝐈 𝐑𝐄𝐍𝐃𝐄𝐑𝐈𝐍𝐆*

• *Stato:* I server grafici sono sovraccarichi.
• *Azione:* Riprova tra 10 secondi.
───────────────`.trim()
            await m.reply(errorMsg)
            await m.react('💀')
        }
    }
}

handler.help = ['csticker <testo>']
handler.tags = ['sticker']
handler.command = /^(csticker|brat)$/i

export default handler
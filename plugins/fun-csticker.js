
import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System_\n───────────────\n⚠️ Inserisci il testo.\nEsempio: ${usedPrefix}${command} Legam`)
    }

    await m.react('⏳')

    try {
        // API 1: Restituisce direttamente il file WEBP animato già compilato
        // Questo bypassa FFmpeg del tuo bot evitandoti l'errore di processamento
        let res = await fetch(`https://api.alyachan.dev/api/brat-video?text=${encodeURIComponent(text)}&apikey=Gatogpt`)
        let json = await res.json()
        
        if (!json.status) throw new Error('API Error')
        
        let stickerBuffer = await (await fetch(json.data.url)).buffer()

        // Invio diretto: saltiamo lib/sticker.js perché il file è già uno sticker perfetto
        await conn.sendMessage(m.chat, { 
            sticker: stickerBuffer,
            contextInfo: {
                externalAdReply: {
                    title: "✨ 𝐍𝐄𝐖 𝐄𝐑𝐀 𝐁𝐑𝐀𝐓 ✨",
                    body: "Sticker Animato Generato",
                    previewType: "PHOTO",
                    thumbnailUrl: "https://telegra.ph/file/08269e9a4f484196144e5.jpg",
                    sourceUrl: "https://github.com"
                }
            }
        }, { quoted: m })

        await m.react('✅')

    } catch (e) {
        console.error(e)
        // FALLBACK 2: Se la prima API è lenta, usiamo questa che è un fulmine
        try {
            let res2 = await fetch(`https://api.vreden.my.id/api/brat-animated?text=${encodeURIComponent(text)}`)
            let json2 = await res2.json()
            let stickerUrl = json2.result
            
            let buffer2 = await (await fetch(stickerUrl)).buffer()

            await conn.sendMessage(m.chat, { 
                sticker: buffer2 
            }, { quoted: m })
            
            await m.react('✅')
        } catch (err) {
            await m.react('❌')
            m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Emergency Fallback_
───────────────
❌ *ERRORE CRITICO*

I server sono saturi per la gara. 
Riprova tra 5 secondi esatti.`.trim())
        }
    }
}

handler.help = ['csticker']
handler.tags = ['sticker']
handler.command = /^(csticker|brat)$/i
handler.register = true

export default handler


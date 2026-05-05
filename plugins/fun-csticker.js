
import { sticker } from '../lib/sticker.js'
import { createCanvas } from 'canvas'
import GIFEncoder from 'gifencoder'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Canvas Engine_\n───────────────\n⚠️ Inserisci il testo.\nEsempio: ${usedPrefix}${command} Testo lungo che deve scorrere nello sticker`)
    }

    await m.react('🎨')

    try {
        const size = 512
        const canvas = createCanvas(size, size)
        const ctx = canvas.getContext('2d')
        
        // Font compatto e leggibile
        const fontSize = 60
        ctx.font = `bold ${fontSize}px Sans-Serif`
        
        const textWidth = ctx.measureText(text).width
        const isLong = textWidth > (size - 60)
        
        // Inizializziamo l'encoder GIF per creare l'animazione
        const encoder = new GIFEncoder(size, size)
        encoder.start()
        encoder.setRepeat(0)   // Loop infinito
        encoder.setDelay(40)   // Velocità scorrimento
        encoder.setQuality(10)
        
        // Se il testo è lungo facciamo 40 frame di scorrimento, altrimenti 1 frame statico
        const totalFrames = isLong ? 40 : 1

        for (let i = 0; i < totalFrames; i++) {
            // Sfondo Bianco
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, size, size)
            
            // Testo Nero
            ctx.fillStyle = '#000000'
            ctx.textBaseline = 'middle'
            
            if (isLong) {
                // Logica Marquee: il testo scorre da destra a sinistra
                ctx.textAlign = 'left'
                const offset = (textWidth + size) * (i / totalFrames)
                const x = size - offset
                ctx.fillText(text, x, size / 2)
            } else {
                // Testo corto: Centrato e statico
                ctx.textAlign = 'center'
                ctx.fillText(text, size / 2, size / 2)
            }
            
            encoder.addFrame(ctx)
        }

        encoder.finish()
        const buffer = encoder.out.getData()

        const packName = global.authsticker || '✧˚⭐️ 𝐍𝐄𝐖 𝐄𝐑𝐀 ⭐️˚✧'
        const authorName = global.nomepack || '✧˚⭐️ 𝐒𝐲𝐬𝐭𝐞𝐦 ⭐️˚✧'

        // Usiamo la tua libreria interna che hai confermato funzionare con .s
        let stiker = await sticker(buffer, false, packName, authorName)

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, false, { quoted: m })
            await m.react('✅')
        } else {
            // Fallback: invio del buffer GIF se la conversione webp fallisce
            await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
            await m.react('✅')
        }

    } catch (e) {
        console.error('Canvas Error:', e)
        await m.react('❌')
        // Messaggio di errore se mancano le librerie sul server
        m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Internal Error_\n───────────────\n❌ Errore critico nel rendering locale.\n\nAssicurati che siano installati:\n1. canvas\n2. gifencoder`)
    }
}

handler.help = ['csticker']
handler.tags = ['sticker']
handler.command = /^(csticker|brat)$/i
handler.register = true

export default handler
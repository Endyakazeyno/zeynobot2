
import { sticker } from '../lib/sticker.js'
import { createCanvas } from 'canvas'
import GIFEncoder from 'gifencoder'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        return m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Canvas Engine_\n───────────────\n⚠️ Inserisci il testo.\nEsempio: ${usedPrefix}${command} Questo testo è molto lungo e scorrerà nello sticker!`)
    }

    await m.react('🎨')

    try {
        const size = 512
        const canvas = createCanvas(size, size)
        const ctx = canvas.getContext('2d')
        const fontSize = 70
        
        ctx.font = `bold ${fontSize}px Arial`
        const textWidth = ctx.measureText(text).width
        
        // Se il testo entra nello sticker, facciamo un'animazione semplice o statica
        // Se il testo è più largo dello sticker, attiviamo lo scroll
        const isLongText = textWidth > (size - 40)
        const encoder = new GIFEncoder(size, size)
        
        // Inizializziamo l'encoder GIF
        encoder.start()
        encoder.setRepeat(0)   // 0 = loop
        encoder.setDelay(50)   // velocità frame
        encoder.setQuality(10) // qualità (1-30)
        encoder.setTransparent(null)

        const frames = isLongText ? 30 : 1 // Numero di frame

        for (let i = 0; i < frames; i++) {
            // Sfondo Bianco (come richiesto)
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, size, size)
            
            // Testo Nero
            ctx.fillStyle = '#000000'
            ctx.textAlign = 'left'
            ctx.textBaseline = 'middle'
            
            let x
            if (isLongText) {
                // Calcolo dello scorrimento: il testo parte da destra e finisce a sinistra
                const totalScroll = textWidth + size
                const progress = i / frames
                x = size - (totalScroll * progress)
            } else {
                // Testo corto: centrato
                ctx.textAlign = 'center'
                x = size / 2
            }
            
            ctx.fillText(text, x, size / 2)
            encoder.addFrame(ctx)
        }

        encoder.finish()
        const buffer = encoder.out.getData()

        const packName = global.authsticker || '✧˚⭐️ 𝐍𝐄𝐖 𝐄𝐑𝐀 ⭐️˚✧'
        const authorName = global.nomepack || '✧˚⭐️ 𝐒𝐲𝐬𝐭𝐞𝐦 ⭐️˚✧'

        // Passiamo la GIF generata da Canvas alla tua lib/sticker.js
        let stiker = await sticker(buffer, false, packName, authorName)

        if (stiker) {
            await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m, true, { quoted: m })
            await m.react('✅')
        } else {
            // Se la conversione fallisce, inviamo il buffer grezzo come sticker
            await conn.sendMessage(m.chat, { sticker: buffer }, { quoted: m })
            await m.react('✅')
        }

    } catch (e) {
        console.error(e)
        await m.react('❌')
        m.reply(`*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Internal Error_\n───────────────\n❌ Errore durante il rendering Canvas.\nAssicurati di avere \`canvas\` e \`gifencoder\` installati.`)
    }
}

handler.help = ['csticker']
handler.tags = ['sticker']
handler.command = /^(csticker|brat)$/i

export default handler
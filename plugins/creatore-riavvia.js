import { spawn } from 'child_process'

let handler = async (m, { conn, isOwner, usedPrefix, command }) => {
    // Usiamo isOwner che è più comune, o controlliamo direttamente il numero
    // Se isOwner fallisce, il comando non partirà mai.
    if (!m.fromMe && !isOwner) {
        return // Silenzioso se non sei l'owner
    }

    let restartMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Recovery_
───────────────
🔄 *𝐄𝐒𝐄𝐂𝐔𝐙𝐈𝐎𝐍𝐄 𝐑𝐄𝐒𝐓𝐀𝐑𝐓*

• *Metodo:* NPM Force Spawn
• *Target:* \`package.json -> start\`

_Il core si scollegherà ora._
───────────────`.trim()

    try {
        await conn.sendMessage(m.chat, { text: restartMsg }, { quoted: m })
        
        // Aspettiamo un secondo per il buffer di invio
        await new Promise(resolve => setTimeout(resolve, 1500))

        // Eseguiamo il comando di avvio esterno
        const child = spawn('npm', ['start'], {
            cwd: process.cwd(),
            detached: true,
            stdio: 'inherit',
            shell: true
        })

        child.unref()

        // Uccidiamo il processo attuale
        process.exit(0)
        
    } catch (e) {
        // Se c'è un errore nell'invio del messaggio o nello spawn
        console.error(e)
        process.exit(1) // Esci comunque, il restart è la priorità
    }
}

handler.help = ['restart']
handler.tags = ['owner']
// Comandi multipli per sicurezza
handler.command = /^(restart|riavvia|reboot|power)$/i

// Rimuoviamo restrizioni troppo specifiche che potrebbero bloccare il comando
handler.owner = true 

export default handler
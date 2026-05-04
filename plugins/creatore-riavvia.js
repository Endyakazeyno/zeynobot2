import { spawn } from 'child_process'
import path from 'path'

let handler = async (m, { conn, isROwner }) => {
    // Sicurezza: Solo l'Owner può toccare il core
    if (!isROwner) return

    let restartMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _Core Engine_
───────────────
🔄 *𝐀𝐔𝐓𝐎-𝐑𝐈𝐀𝐕𝐕𝐈𝐎 𝐃𝐈𝐑𝐄𝐓𝐓𝐎*

• *Metodo:* Spawn Indipendente
• *Stato:* Generazione nuovo processo...

_Il sistema si scollegherà e ricollegherà autonomamente._
───────────────`.trim()

    await m.reply(restartMsg)

    // Aspettiamo un secondo per garantire l'invio del messaggio
    setTimeout(() => {
        // Otteniamo il percorso del file principale (solitamente index.js)
        const args = [path.join(process.cwd(), 'index.js'), ...process.argv.slice(2)]
        
        // Creiamo il nuovo processo "figlio"
        const child = spawn(process.argv[0], args, {
            cwd: process.cwd(),
            detached: true, // Fondamentale: rende il processo indipendente
            stdio: 'inherit'
        })

        // Sganciamo il figlio dal padre
        child.unref()

        // Uccidiamo il processo attuale
        process.exit()
    }, 2000)
}

handler.help = ['restart']
handler.tags = ['owner']
handler.command = /^(restart|riavvia|reboot)$/i

handler.rowner = true

export default handler
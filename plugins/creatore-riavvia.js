
import { spawn } from 'child_process'

let handler = async (m, { conn, isROwner }) => {
    // Protocollo di sicurezza: Accesso riservato all'Owner
    if (!isROwner) return

    let restartMsg = `*𝐍𝐄𝐖 𝐄𝐑𝐀* • _System Core_
───────────────
🔄 *𝐑𝐄𝐒𝐓𝐀𝐑𝐓 𝐓𝐑𝐀𝐌𝐈𝐓𝐄 𝐍𝐏𝐌*

• *Comando:* \`npm start\`
• *Stato:* Inizializzazione nuova istanza...

_Il sistema verrà ricaricato completamente._
───────────────`.trim()

    await m.reply(restartMsg)

    // Breve delay per assicurare la consegna del messaggio su WhatsApp
    setTimeout(() => {
        // Avviamo un nuovo processo 'npm start'
        // 'shell: true' è necessario per eseguire comandi npm su molti sistemi (specialmente Windows)
        const child = spawn('npm', ['start'], {
            cwd: process.cwd(),
            detached: true,
            stdio: 'inherit',
            shell: true 
        })

        // Rendiamo il processo figlio indipendente dal padre
        child.unref()

        // Terminiamo l'esecuzione del bot attuale
        process.exit()
    }, 2000)
}

handler.help = ['restart']
handler.tags = ['owner']
handler.command = /^(restart|riavvia)$/i

handler.rowner = true

export default handler
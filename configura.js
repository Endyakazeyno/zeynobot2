import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import chalk from 'chalk'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

// --- CONFIGURAZIONE NEWERA ---

global.prefisso = '!' 
global.sam = ['393501989497']

global.owner = [
  ['393501989497', 'ꪶ𝑬𝛮𝜞𝐲ꫂ', true],
  ['77787623522', 'ksav', true],
  ['212693877842', 'medalis', true],
  ['254790385731', 'zak', true]
]

global.mods = ['393501989497', '212693877842']
global.prems = ['393501989497', '212693877842']

// --- INFO BOT ---

global.nomepack = '𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓'
global.nomebot = '𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓'
global.wm = '𝛧𝚵𝐘𝐍𝐎 𝚩𝚯𝐓'
global.autore = 'ꪶ𝑬𝛮𝜞𝐲ꫂ'
global.dev = 'ꪶ𝑬𝛮𝜞𝐲ꫂ'
global.testobot = 'ZEYNO CORE'
global.versione = pkg.version
global.errore = '‼️ Errore di sistema. Usa !segnala per avvisare lo staff.'

// --- LINK ---

global.repobot = 'https://github.com/Endyakazeyno/zeynobot2'
global.gruppo = 'https://chat.whatsapp.com/FdA61ZKYPB43WOIK6rUs8L?s=cl&p=a&mlu=3'
global.canale = 'https://whatsapp.com/channel/0029VbBsqvyF1YlXIC2zUh1N'
global.insta = 'https://www.instagram.com/Endy.2011_'

// --- API KEYS ---

global.APIKeys = {
    spotifyclientid: 'varebot',
    spotifysecret: 'varebot',
    browserless: 'varebot',
    tmdb: 'varebot',
    ocrspace: 'jjjsheu',
    assemblyai: 'varebot',
    google: 'varebot',
    googleCX: 'varebot',
    genius: 'varebot',
    removebg: 'varebot',
    openrouter: 'varebot',
    sightengine_user: 'varebot',
    sightengine_secret: 'varebot',
    lastfm: '36f859a1fc4121e7f0e931806507d5f9',
}

// --- SISTEMA ---

global.multiplier = 1

// --- ESTETICA MINIMAL ---

global.logoLegam = 'https://i.ibb.co/gMDMVjJn/IMG-1824.png'

global.rcanal = {
    contextInfo: {
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: "120363259442839354@newsletter",
            newsletterName: "newera | core system",
            serverMessageId: 100
        },
        externalAdReply: {
            showAdAttribution: true,
            title: "N E W E R A",
            body: "system online",
            mediaType: 1,
            renderLargerThumbnail: false,
            thumbnailUrl: global.logoLegam,
            sourceUrl: global.insta
        }
    }
}

global.fake = global.rcanal;

// --- RELOAD ---

let filePath = fileURLToPath(import.meta.url)
let fileUrl = pathToFileURL(filePath).href

const reloadConfig = async () => {
  console.log(chalk.white("[*] config.js aggiornato"))
  try {
    await import(`${fileUrl}?update=${Date.now()}`)
  } catch (e) {
    console.error('[!] Errore reload config:', e)
  }
}

watchFile(filePath, reloadConfig)

export default {}

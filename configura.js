import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath, pathToFileURL } from 'url'
import chalk from 'chalk'
import fs from 'fs'

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

// --- CONFIGURAZIONE NEWERA ---

global.prefisso = '.' 
global.sam = ['972552451710']

global.owner = [
  ['', '', true],
  ['972552451710', 'giuse', true],
  ['', '', true],
  ['', '', true]
]

global.mods = ['972552451710', '972552451710']
global.prems = ['972552451710', '972552451710']

// --- INFO BOT ---

global.nomepack = 'newera pack'
global.nomebot = 'newera bot'
global.wm = 'newera bot'
global.autore = 'giuse'
global.dev = 'giuse'
global.testobot = 'NEWERA CORE'
global.versione = pkg.version
global.errore = '[!] Errore di sistema. Usa .segnala per avvisare lo staff.'

// --- LINK ---

global.repobot = 'https://github.com/giuseakanex-cmyk/newera'
global.gruppo = 'https://chat.whatsapp.com/bysamakavare'
global.canale = 'https://whatsapp.com/channel/0029VbB41Sa1Hsq1JhsC1Z1z'
global.insta = 'https://www.instagram.com/tessere____'

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

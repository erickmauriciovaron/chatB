const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')
require("dotenv").config()

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
//const MockAdapter = require('@bot-whatsapp/database/mock')
const MongoAdapter = require('@bot-whatsapp/database/mongo')
const path = require("path")
const fs = require("fs")
const chat = require("./chatGPT")
const { handlerAI } = require("./whisper")

const menuPath = path.join(__dirname, "mensajes", "menu.txt")
const promptConsultas = fs.readFileSync(menuPath, "utf8")

const pathConsultas = path.join(__dirname, "mensajes", "promptConsultas.txt")
const menu = fs.readFileSync(menuPath, "utf8")

const flowVoice = addKeyword(EVENTS.VOICE_NOTE).addAnswer("esta es una nota de voz", null, async (ctx, ctxFn) => {
    const text = await handlerAI(ctx)
    const prompt = promptConsultas
        const consulta = text
        const answer = await chat(prompt, consulta)
        await ctxFn.flowDynamic(answer.content)
})

const flowMenurest = addKeyword(EVENTS.ACTION)
    .addAnswer('Si quieres regresar al menu de opciones escribe *Menu*',{
        media: "https://i.pinimg.com/474x/a4/0b/31/a40b31bd7dd2b93fc548515e4e079179.jpg"
    })
    

const flowReservar = addKeyword(EVENTS.ACTION)
    .addAnswer('aqui puedes reservar: https://hesegoingenieria.com/')
    .addAnswer('Si quieres regresar al menu de opciones escribe *Menu*')
    
const flowConsultas = addKeyword(EVENTS.ACTION)
    .addAnswer('aqui puedes consultar')
    .addAnswer("haz tu consulta", { capture: true }, async (ctx, ctxFn) => {
        const prompt = promptConsultas
        const consulta = ctx.body
        const answer = await chat(prompt, consulta)
        await ctxFn.flowDynamic(answer.content)
    })
    
    
const flowWelcome = addKeyword(EVENTS.WELCOME)  
    .addAnswer("Hesego ingenieria esta configurando el *ChatBot*, si quieres ver como esta quedando escribe *Menu* y explora lo que hay en el momento", {
        delay: 100,
        media: "https://i.pinimg.com/236x/f9/5c/03/f95c03ba4333a7a25629396014c37271.jpg"
    },

async (ctx, ctxFn) => {
    if (ctx.body.includes("Casas")) {
        await ctxFn.flowDynamic("Hesego ingenieria se compromete con sus clientes y colaboradores")
    } else {
        await ctxFn.flowDynamic("Hesego ingenieria se compromete con sus clientes y colaboradores")
    }
})
    
const menuFlow = addKeyword("Menu").addAnswer(
    menu,
        { capture: true },
        async (ctx, { gotoFlow, fallBack, flowDynamic}) => {
            if (!["1", "2", "3", "0"].includes(ctx.body)) {
                return fallBack(
                    "Respuesta no valida, por favor seleccionar una de las opciones."
                );
            }
            switch (ctx.body) {
                case "1":
                    return gotoFlow(flowMenurest);
                case "2":
                    return gotoFlow(flowReservar);
                case "3":
                    return gotoFlow(flowConsultas);
                case "0":
                    return await flowDynamic("Saliendo... Puedes volver a acceder a este menu escribiendo *Menu*"

                    );
                     
            }
        }
    );    


const main = async () => {
    const adapterDB = new MongoAdapter({
        dbUri: process.env.MONGO_DB_URI,
        dbName: "chatB2"

    })
    const adapterFlow = createFlow([flowWelcome, menuFlow, flowMenurest, flowReservar, flowConsultas, flowVoice])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()

// ⬇️ IMPORTAR EXPRESS
const express = require('express');
const app = express();

// ⬇️ PUERTO DE RAILWAY O 3000 LOCAL
const PORT = process.env.PORT || 3000;

// ⬇️ RUTA BÁSICA PARA QUE RAILWAY VEA QUE FUNCIONA
app.get('/', (req, res) => {
    res.send('Chatbot de Hesego Ingeniería activo 🚀');
});

// ⬇️ INICIAR EL SERVIDOR
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


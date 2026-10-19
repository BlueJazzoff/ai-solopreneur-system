# AI Solopreneur System — Website MVP

## Cosa contiene
- `/` landing page pubblica del prodotto
- `/app` workspace chat AI nel browser
- `/access` pagina informativa per i percorsi di accesso
- `/api/chat` backend che inoltra i messaggi al modello AI
- `render.yaml` configurazione iniziale per hosting Render

## Stato reale del progetto
Questo è un MVP tecnico da configurare, testare e completare. Non è ancora un servizio pronto per essere venduto pubblicamente: l'autenticazione e la verifica degli acquisti Whop NON sono implementate. Non inserire link ai clienti e non promuoverlo come protetto finché non è stata completata l'integrazione di accesso.

## Avvio locale
Requisiti: Node.js 20+
1. Estrai la cartella.
2. Esegui `npm install`.
3. Copia `.env.example` in `.env`.
4. Inserisci `OPENAI_API_KEY` nel file `.env`.
5. Inserisci i link reali dei prodotti Whop nelle variabili `WHOP_MEMBER_URL` e `WHOP_AI_URL`.
6. Esegui `npm start`.
7. Visita `http://localhost:3000`.

Non mettere mai la chiave API in HTML/JavaScript del browser, in GitHub o in una pagina pubblica. `.env` è escluso da Git.

## Pubblicazione semplice (preparata, non eseguita)
Il file `render.yaml` prepara un servizio web Render. Per pubblicare:
1. Crea un account GitHub e un repository privato.
2. Carica il contenuto di questa cartella nel repository, senza il file `.env`.
3. Crea un account Render e collega il repository.
4. In Render seleziona il deploy tramite `render.yaml`/Blueprint.
5. Inserisci i valori segreti nella sezione Environment del servizio, in particolare `OPENAI_API_KEY`.
6. Attendi il deploy e verifica `/health`.

Documentazione ufficiale Render:
- https://render.com/docs/deploy-node-express-app
- https://render.com/docs/configure-environment-variables

Il piano gratuito può andare in sospensione dopo inattività e può avere limiti: è adatto a test iniziali, non necessariamente a un prodotto commerciale con utenti paganti. Verifica prezzi e condizioni correnti prima del lancio.

## Whop: cosa bisogna configurare
Il prodotto Whop non è stato creato o modificato da questo progetto. Devi creare il prodotto e il piano/prezzo dal tuo account Whop, poi copiare i link corretti. Non abbiamo accesso al tuo account e non possiamo creare pagamenti o abbonamenti per tuo conto.

Per la versione pubblica:
- implementare autenticazione con gli strumenti ufficiali Whop oppure un flusso server-side di verifica acquisto/entitlement;
- controllare sul server, a ogni richiesta, che l'utente abbia diritto al piano selezionato;
- distinguere membership preesistente, AI Plus e futuri livelli;
- applicare quote e limiti per utente, non solo per indirizzo IP;
- salvare le sessioni in modo sicuro, proteggere gli endpoint e testare revoche/rimborsi.

Documentazione ufficiale per sviluppare una Whop App:
- https://dev.whop.com/
- https://docs.whop.com/

Valutazione architetturale: per l'esperienza più integrata, una Whop App può fornire autenticazione e accesso all'interno di Whop. Per il percorso più semplice da collegare al sito esistente, il sito esterno può essere ospitato su un servizio Node e collegato da Whop. La scelta definitiva va fatta prima di implementare l'autenticazione, perché il flusso tecnico cambia.

## Funzionalità non incluse
- Login e verifica acquisti/abbonamenti Whop
- Cronologia persistente su database
- Upload e analisi effettiva di file
- Ricerca web, generazione immagini e strumenti esterni
- Pannello admin, pagamenti, limiti/quote per piano e analytics
- Informativa privacy, termini, GDPR, monitoraggio e hardening produzione

Non usare il servizio pubblicamente con API key attiva finché l'autenticazione e le quote per utente non sono state completate.

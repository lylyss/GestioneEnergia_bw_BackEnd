// main.js
// Gestione base della UI clienti

document.addEventListener("DOMContentLoaded", function () {
  const app = document.getElementById("app");
  app.innerHTML = `
        <h2>Gestione Clienti</h2>
        <form id="cliente-form">
            <h3>Aggiungi nuovo cliente</h3>
            <input type="text" name="ragioneSociale" placeholder="Ragione Sociale" required />
            <input type="text" name="partitaIva" placeholder="Partita IVA" required />
            <input type="email" name="email" placeholder="Email" required />
            <input type="date" name="dataInserimento" placeholder="Data Inserimento" required />
            <input type="date" name="dataUltimoContatto" placeholder="Data Ultimo Contatto" required />
            <input type="number" name="fatturatoAnnuale" placeholder="Fatturato Annuale" required />
            <input type="email" name="pec" placeholder="PEC" required />
            <input type="tel" name="telefono" placeholder="Telefono" required />
            <input type="email" name="emailContatto" placeholder="Email Contatto" required />
            <input type="text" name="nomeContatto" placeholder="Nome Contatto" required />
            <input type="text" name="cognomeContatto" placeholder="Cognome Contatto" required />
            <input type="tel" name="telefonoContatto" placeholder="Telefono Contatto" required />
            <input type="text" name="logoAziendale" placeholder="Logo Aziendale (URL)" />
            <button type="submit">Aggiungi Cliente</button>
        </form>
        <h3>Elenco Clienti</h3>
        <table id="clienti-table">
            <thead>
                <tr>
                    <th>Ragione Sociale</th>
                    <th>Partita IVA</th>
                    <th>Email</th>
                    <th>Fatturato</th>
                    <th>Azioni</th>
                </tr>
            </thead>
            <tbody>
                <!-- Clienti verranno inseriti qui -->
            </tbody>
        </table>
    `;
  // Qui in futuro aggiungeremo la logica per gestire il form e la tabella
});

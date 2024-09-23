const axios = require('axios');

class Trashmail {
  constructor() {
    this.address = '';
    this.sessionId = '';
    this.active = true;
    this.lastInbox = [];
    this.intervalId = null;
    this.initialize();
  }


  async initialize() {
    try {
      const response = await axios.get('https://futquest.com/generate/email');
      const data = response.data;
      this.address = data.email;
      this.sessionId = data.sessionId;
      this.lastInbox = [];
      console.log(`Initialisiert mit E-Mail: ${this.address}`);
    } catch (error) {
      console.error('Fehler bei der Initialisierung von Trashmail:', error.message);
    }
  }


  getAddress() {
    return this.address;
  }


  revokeAddress() {
    this.address = '';
    this.sessionId = '';
    this.lastInbox = [];
    console.log('E-Mail-Adresse widerrufen.');
    return true;
  }


  async renewAddress() {
    try {
      const response = await axios.get('https://futquest.com/generate/email');
      const data = response.data;
      this.address = data.email;
      this.sessionId = data.sessionId;
      this.lastInbox = [];
      console.log(`E-Mail-Adresse erneuert: ${this.address}`);
      return this.address;
    } catch (error) {
      console.error('Fehler beim Erneuern der E-Mail-Adresse:', error.message);
      return null;
    }
  }


  async getInbox() {
    if (!this.address || !this.sessionId) {
      console.warn('Keine aktive E-Mail-Adresse oder Session ID vorhanden.');
      return null;
    }

    try {
      const url = `https://futquest.com/inbox/${encodeURIComponent(this.address)}?sessionId=${encodeURIComponent(this.sessionId)}`;
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Fehler beim Abrufen des Posteingangs:', error.message);
      return null;
    }
  }


  onEmail(callback) {
    if (this.intervalId) {
      console.warn('Email-Listener ist bereits aktiv.');
      return;
    }

    this.intervalId = setInterval(async () => {
      if (!this.active) return;

      const currentInbox = await this.getInbox();
      if (!currentInbox) return;

      if (JSON.stringify(currentInbox) !== JSON.stringify(this.lastInbox)) {
        const newEmails = currentInbox.filter(email => !this.lastInbox.includes(email));
        if (newEmails.length > 0) {
          callback(newEmails);
        }
        this.lastInbox = currentInbox;
      }
    }, 3000);

    console.log('Begonnen mit dem Hören auf neue E-Mails.');
  }

  stopListening() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      this.active = false;
      console.log('Hören auf E-Mails gestoppt.');
    }
  }
}

module.exports = Trashmail;

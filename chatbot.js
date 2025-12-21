class ChatHistory {
  constructor() {
    this.messages = [];
  }
  addMessage(message) {
    this.messages.push(message);
  }
  getHistory() {
    return this.messages;
  }
}

let historyMessages = new ChatHistory();
let intents = [];

function showMessage(message, type) {
  const chatBox = document.getElementById("chat-box");
  if (!chatBox) return;

  const msgElement = document.createElement("div");
  msgElement.classList.add(type);
  msgElement.textContent = message;
  chatBox.appendChild(msgElement);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function processMessage(message) {
  let response = "Je suis désolé, je ne comprends pas votre question.";

  if (intents && intents.length > 0) {
    intents.forEach((intent) => {
      intent.patterns.forEach((pattern) => {
        if (message.toLowerCase().includes(pattern.toLowerCase())) {
          response =
            intent.responses[Math.floor(Math.random() * intent.responses.length)];
        }
      });
    });
  }

  return response;
}

function sendMessage() {
  const input = document.getElementById("user-input");
  if (!input) return;

  const userInput = input.value.trim();
  if (userInput === "") return;

  showMessage(userInput, "user");
  historyMessages.addMessage({ message: userInput, sender: "user" });

  const response = processMessage(userInput);
  showMessage(response, "bot");
  historyMessages.addMessage({ message: response, sender: "bot" });

  input.value = "";
}

function fetchIntents(url) {
  fetch(url)
    .then((response) => {
      if (!response.ok) throw new Error(`Erreur HTTP! Statut: ${response.status}`);
      return response.json();
    })
    .then((data) => {
      if (!data.intents || data.intents.length === 0) {
        throw new Error("Le fichier JSON est vide ou mal formaté.");
      }
      intents = data.intents;
    })
    .catch((error) => {
      console.error("Erreur lors du chargement des intents:", error);
      intents = [
        {
          patterns: ["association", "asso", "associations"],
          responses: [
            "Tu peux me demander : WEI, BDE, BDS, Hock'Efrei, Efrei Para, Efreestyle, Efrei Chess, 4eSport, Efrei Poker, Live, Rename, New-Lix."
          ],
        },
      ];
    });
}

function saveMessages() {
  sessionStorage.setItem("chatHistory", JSON.stringify(historyMessages.getHistory()));
}

function loadMessages() {
  const chatHistory = JSON.parse(sessionStorage.getItem("chatHistory"));
  if (chatHistory) {
    chatHistory.forEach((msg) => {
      showMessage(msg.message, msg.sender);
      historyMessages.addMessage(msg);
    });
  }
}

window.addEventListener("beforeunload", saveMessages);
window.addEventListener("load", () => {
  showMessage("Bonjour ! Tape le nom d’une association pour en savoir plus 🙂", "bot");

  loadMessages();
  fetchIntents("../JSON/intents.json");

  const input = document.getElementById("user-input");
  if (input) {
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });
  }
});

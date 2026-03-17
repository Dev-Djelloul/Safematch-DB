import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "REMPLACE_ICI",
  authDomain: "REMPLACE_ICI.firebaseapp.com",
  projectId: "REMPLACE_ICI",
  storageBucket: "REMPLACE_ICI.firebasestorage.app",
  messagingSenderId: "REMPLACE_ICI",
  appId: "REMPLACE_ICI"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const form = document.getElementById("waitlistForm");
const feedback = document.getElementById("formFeedback");
const submitButton = form?.querySelector("button[type='submit']");

function sanitize(value) {
  return String(value || "").trim();
}

function showFeedback(message, isError = false) {
  feedback.textContent = message;
  feedback.style.color = isError ? "#b00020" : "#831735";
}

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!form.checkValidity()) {
    showFeedback("Merci de compléter correctement le formulaire.", true);
    return;
  }

  const formData = new FormData(form);

  const payload = {
    email: sanitize(formData.get("email")).toLowerCase(),
    city: sanitize(formData.get("city")),
    consent: formData.get("consent") === "on",
    source: "landing-page-safe-b",
    variant: "B",
    createdAt: serverTimestamp()
  };

  if (!payload.email || !payload.consent) {
    showFeedback("Certaines informations sont manquantes.", true);
    return;
  }

  try {
    submitButton.disabled = true;
    submitButton.textContent = "Envoi en cours...";

    await addDoc(collection(db, "waitlist"), payload);

    form.reset();
    showFeedback("Merci ! Vous êtes bien préinscrit. Nous vous informerons du lancement de SAFE.");
  } catch (error) {
    console.error("Erreur Firestore :", error);
    showFeedback("Une erreur est survenue. Merci de réessayer.", true);
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "Je veux accéder au lancement";
  }
});
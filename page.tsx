import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "./firebase";

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;             
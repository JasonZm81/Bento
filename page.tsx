import firebase from "./src/firebase";
import { getAnalytics } from "firebase/analytics";

const analytics = getAnalytics(firebase);

export default firebase;             
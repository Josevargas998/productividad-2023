import React, { useState, useEffect } from 'react';import { initializeApp } from 'firebase/app';import {getAuth,signInAnonymously,onAuthStateChanged,signInWithCustomToken} from 'firebase/auth';import {getFirestore,collection,addDoc,onSnapshot,query,serverTimestamp} from 'firebase/firestore';import {Save, Users, Download, Share2, Plus, Trash2,FileText, Book, Code, Presentation, GraduationCap, CheckCircle, ExternalLink} from 'lucide-react';// CONFIGURACIÓN DE FIREBASE// REEMPLAZA ESTOS VALORES con los de tu proyecto real en Firebase Consoleconst getFirebaseConfig = () => {if (typeof __firebase_config !== 'undefined') {return JSON.parse(__firebase_config);}return {apiKey: "TU_API_KEY_AQUÍ",authDomain: "TU_https://www.google.com/search?q=PROYECTO.firebaseapp.com",projectId: "TU_PROYECTO_ID",storageBucket: "TU_https://www.google.com/search?q=PROYECTO.appspot.com",messagingSenderId: "TU_SENDER_ID",appId: "TU_APP_ID"};};const firebaseConfig = getFirebaseConfig();const app = initializeApp(firebaseConfig);const auth = getAuth(app);const db = getFirestore(app);const appId = typeof __app_id !== 'undefined' ? __app_id : 'uniquindio-prod-2023';const App = () => {const [user, setUser] = useState(null);const [submissions, setSubmissions] = useState([]);const [loading, setLoading] = useState(true);const [success, setSuccess] = useState(false);// Estado del Formularioconst [tipo, setTipo] = useState('Revista Indexada');const [facultad, setFacultad] = useState('');const [programa, setPrograma] = useState('');const [titulo, setTitulo] = useState('');const [identificacion, setIdentificacion] = useState('');const [fuente, setFuente] = useState('');const [autores, setAutores] = useState([{ nombre: '', categoria: 'Titular', escolaridad: 'Doctorado' }]);useEffect(() => {const initAuth = async () => {try {if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {await signInWithCustomToken(auth, __initial_auth_token);} else {await signInAnonymously(auth);}} catch (e) { console.error("Error de Auth:", e); }};initAuth();const unsubscribe = onAuthStateChanged(auth, setUser);return () => unsubscribe();}, []);useEffect(() => {if (!user) return;const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'registros'));const unsub = onSnapshot(q, (snap) => {setSubmissions(snap.docs.map(d => ({ id: d.id, ...d.data() })));setLoading(false);}, (err) => {console.error("Error de Firestore:", err);setLoading(false);});return () => unsub();}, [user]);const agregarAutor = () => setAutores([...autores, { nombre: '', categoria: 'Titular', escolaridad: 'Doctorado' }]);const actualizarAutor = (index, campo, valor) => {const nuevos = [...autores];nuevos[index][campo] = valor;setAutores(nuevos);};const guardar = async (e) => {e.preventDefault();if (!user) return;try {
  const colRef = collection(db, 'artifacts', appId, 'public', 'data', 'registros');
  const promesas = autores.map(autor => addDoc(colRef, {
    AÑO: '2023',
    TIPO_PRODUCTO: tipo,
    FACULTAD: facultad,
    PROGRAMA: programa,
    TITULO_PRODUCTO: titulo,
    ID_ISSN_ISBN: identificacion,
    FUENTE_EDITORIAL: fuente,
    AUTOR_NOMBRE: autor.nombre,
    AUTOR_CATEGORIA: autor.categoria,
    AUTOR_ESCOLARIDAD: autor.escolaridad,
    fecha_registro: serverTimestamp()
  }));

  await Promise.all(promesas);
  setSuccess(true);
  setTitulo('');
  setIdentificacion('');
  setFuente('');
  setAutores([{ nombre: '', categoria: 'Titular', escolaridad: 'Doctorado' }]);
  setTimeout(() => setSuccess(false), 3000);
} catch (err) {
  console.error("Error al guardar:", err);
}
};if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Cargando sistema...</div>;return (<div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans"><div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-200"><h1 className="text-xl font-black mb-6">Captura Uniquindio 2023</h1><form onSubmit={guardar} className="space-y-6"><input required value={facultad} onChange={e => setFacultad(e.target.value)} placeholder="Facultad" className="w-full p-4 bg-slate-50 rounded-xl" /><input required value={programa} onChange={e => setPrograma(e.target.value)} placeholder="Programa" className="w-full p-4 bg-slate-50 rounded-xl" /><textarea required value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título del Producto" className="w-full p-4 bg-slate-50 rounded-xl h-24" /><button type="submit" className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl">GUARDAR REGISTRO</button>{success && <div className="text-center text-emerald-600 font-bold italic">¡Sincronizado!</div>}</form></div></div>);};export default App;
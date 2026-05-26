export interface FaqPair {
  id: string;
  question: string;
  answer: string;
  details?: string[];
}

export const faqPairs: FaqPair[] = [
  {
    id: "que-es-un-galgo",
    question: "¿Qué es un galgo y por qué adoptar uno?",
    answer:
      "Un galgo es un perro sensible, tranquilo en casa y muy compañero. Rescatamos galgos porque vemos de cerca un abandono que se repite demasiado, pero también vemos lo que pasa después. Con cuidado, rutina y una familia segura, vuelven a confiar. Adoptar uno es abrirle la puerta a un perro que puede hacer la vida diaria más bonita.",
  },
  {
    id: "cuanto-ejercicio",
    question: "¿Cuánto ejercicio necesita un galgo?",
    answer:
      "Menos de lo que mucha gente imagina. Son atletas de carrera corta, rápidos por momentos y serenos en casa. Para la mayoría, dos caminatas al día y una rutina tranquila son suficientes. No necesitan horas de ejercicio ni un patio enorme. Necesitan paseos seguros, descanso y compañía.",
  },
  {
    id: "galgo-en-departamento",
    question: "¿Puedo tener un galgo si vivo en departamento?",
    answer:
      "Sí. Muchos galgos se adaptan muy bien a vivir en departamento porque pasan gran parte del día descansando y no ocupan mucho espacio. Lo importante no es tener una casa grande. Es ofrecer un lugar seguro, una camita cómoda, paseos diarios y compañía.",
  },
  {
    id: "proceso-de-adopcion",
    question: "¿Cómo es el proceso de adopción paso a paso?",
    answer: "El proceso tiene cuatro pasos. De tu primer mensaje al galgo en tu sillón, estamos contigo en cada etapa.",
    details: [
      "Nos escribes por WhatsApp o completas el formulario.",
      "Conversamos sobre tu rutina, tu espacio y tus expectativas.",
      "Te hacemos el match con un galgo que puede estar bien contigo.",
      "Empiezas un período de prueba en casa y seguimos acompañándote paso a paso.",
    ],
  },
  {
    id: "costo-de-adopcion",
    question: "¿Cuánto cuesta adoptar un galgo y qué incluye?",
    answer:
      "Adoptar un galgo con nosotros no tiene costo. No pedimos un aporte obligatorio ni condicionamos la adopción a una donación. Lo que sí necesitamos es compromiso, cuidados, tiempo, paciencia y una vida segura. Si después quieres donar para ayudar a otros rescates, puedes hacerlo, pero es completamente voluntario.",
  },
  {
    id: "convivencia-ninos-animales",
    question: "¿Se llevan bien con niños y otros animales?",
    answer:
      "Muchos galgos conviven muy bien con niños y otros perros, sobre todo cuando la presentación se hace con calma y cuidado. Con gatos y animales pequeños hay que mirar caso a caso. Algunos pueden convivir bien, otros tienen un instinto de presa más alto y no serían una alternativa segura. Si tienes gatos u otras mascotas pequeñas, cuéntanos desde el primer mensaje. Conocemos a cada galgo y te diremos honestamente si hay uno que pueda estar bien en tu hogar.",
  },
  {
    id: "experiencia-previa",
    question: "¿Necesito tener experiencia previa con perros?",
    answer:
      "No. No necesitas ser experto ni tener años de experiencia. Necesitas tiempo, paciencia y ganas de aprender. Te contamos lo que necesitas saber antes de la llegada y seguimos acompañándote después de la adopción, para que tú y el galgo no tengan que resolver todo solos.",
  },
  {
    id: "que-es-hogar-temporal",
    question: "¿Qué es el hogar temporal y cuánto dura?",
    answer:
      "El hogar temporal es abrir tu casa por un tiempo para que un galgo esté seguro, acompañado y mejor preparado para encontrar familia. Puede durar desde unas semanas hasta unos pocos meses, según cada galgo y tu disponibilidad. Para ti es temporal. Para ese galgo puede ser el puente entre el abandono y una familia definitiva.",
  },
  {
    id: "gastos-hogar-temporal",
    question: "¿Brigada cubre los gastos veterinarios durante el hogar temporal?",
    answer:
      "Sí. Cubrimos atención veterinaria, vacunas, antiparasitarios y alimentación. Tú aportas un espacio seguro en casa, caminatas diarias y paciencia. No necesitas una casa grande. Necesitas un rincón tranquilo, una rutina amable y ganas de marcar una diferencia.",
  },
  {
    id: "como-donar",
    question: "¿Cómo puedo donar y en qué se usa mi aporte?",
    answer:
      "La forma principal de apoyarnos es transferir directamente a la cuenta de la fundación. Puedes hacer un aporte único o configurar transferencias recurrentes desde tu banco. Los datos están en nuestra página de donaciones. También puedes suscribirte como apadrinante vía eSponsor. Los montos varían según cada rescate, pero estas referencias muestran lo que tu aporte ayuda a sostener.",
    details: [
      "Con $5.000 pones comida de calidad en el plato de un galgo rescatado durante una semana.",
      "Con $10.000 cubres vacunas y antiparasitarios de un recién rescatado.",
      "Con $20.000 costeas una consulta veterinaria de urgencia.",
      "Con $50.000 apoyas el costo completo de un galgo en rehabilitación por un mes.",
    ],
  },
  {
    id: "financiamiento-estatal",
    question: "¿Reciben financiamiento del Estado o de empresas?",
    answer:
      "No recibimos financiamiento estatal. Algunas empresas nos apoyan puntualmente y las puedes conocer en nuestra página de colaboradores, pero no dependemos de ellas. La mayor parte de nuestros recursos viene de personas que se preocupan por los galgos como tú. Ese apoyo nos permite rescatar, tratar y reubicar galgos en Chile.",
  },
  {
    id: "si-la-adopcion-no-funciona",
    question: "¿Qué pasa si la adopción no funciona?",
    answer:
      "Si el match no funciona, no te dejamos solo con el problema. Trabajamos juntos para encontrar la mejor solución para ti y para el galgo. Preferimos que nos escribas temprano, aunque sea por una duda pequeña, antes de que la preocupación crezca en silencio.",
  },
];

export const faqGroups = [
  {
    eyebrow: "SOBRE LOS GALGOS",
    ids: [0, 1, 2],
  },
  {
    eyebrow: "ADOPCIÓN",
    ids: [3, 4, 5, 6],
  },
  {
    eyebrow: "HOGAR TEMPORAL",
    ids: [7, 8],
  },
  {
    eyebrow: "DONACIONES Y APOYO",
    ids: [9, 10],
  },
  {
    eyebrow: "GARANTÍAS",
    ids: [11],
  },
];

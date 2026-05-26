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
      "Rescatamos galgos porque vemos de cerca un abandono que se repite demasiado. Son perros tranquilos, agradecidos y profundamente leales. Cuando adoptas un galgo, no recibes solo un perro: recibes un compañero que transforma la rutina en algo más bonito.",
  },
  {
    id: "cuanto-ejercicio",
    question: "¿Cuánto ejercicio necesita un galgo?",
    answer:
      "Son atletas de carrera corta: explosivos en pista, pero serenos en casa. Con dos caminatas al día están felices. No necesitan horas de ejercicio ni grandes patios. Necesitan una rutina tranquila y alguien que los acompañe.",
  },
  {
    id: "galgo-en-departamento",
    question: "¿Puedo tener un galgo si vivo en departamento?",
    answer:
      "Sí. La mayoría se adapta muy bien a departamentos. Son perros que pasan gran parte del día durmiendo y ocupan poco espacio físico. Lo que necesitan es un lugar seguro, una camita cómoda y tu compañía.",
  },
  {
    id: "proceso-de-adopcion",
    question: "¿Cómo es el proceso de adopción paso a paso?",
    answer: "El proceso tiene cuatro pasos. De tu primer mensaje al galgo en tu sillón, te acompañamos en cada etapa.",
    details: [
      "Nos escribes por WhatsApp o completas el formulario.",
      "Conversamos sobre tu rutina, espacio y expectativas.",
      "Te hacemos el match con un galgo que puede estar bien contigo.",
      "Empiezas un período de prueba en casa y estamos contigo paso a paso.",
    ],
  },
  {
    id: "costo-de-adopcion",
    question: "¿Cuánto cuesta adoptar un galgo y qué incluye?",
    answer:
      "Adoptar un galgo con nosotros no tiene costo. Nunca pedimos un aporte obligatorio: lo que necesitamos es que te comprometas a cuidarlo. Si después quieres donar para ayudar a otros rescates, puedes hacerlo, pero eso es completamente voluntario y nunca condiciona la adopción.",
  },
  {
    id: "convivencia-ninos-animales",
    question: "¿Se llevan bien con niños y otros animales?",
    answer:
      "Los galgos son excelentes con niños y perros, en especial cuando se hace una presentación adecuada. Con gatos y otros animales pequeños, la situación es más compleja. Los galgos son perros de caza y pueden tener un instinto de presa alto, dependiendo del pasado de cada perro. Algunos conviven perfectamente con gatos, pero otros no lo logran. Si tienes gatos u otras mascotas pequeñas, cuéntanos desde el primer mensaje. Conocemos a cada galgo y te diremos honestamente si hay uno que pueda estar bien en tu hogar.",
  },
  {
    id: "experiencia-previa",
    question: "¿Necesito tener experiencia previa con perros?",
    answer:
      "No. No necesitas ser experto ni tener años de experiencia. Necesitas tiempo, paciencia y el compromiso de tratar a un galgo como parte de tu familia. Te enseñamos todo lo que necesitas saber y seguimos acompañándote después de la adopción.",
  },
  {
    id: "que-es-hogar-temporal",
    question: "¿Qué es el hogar temporal y cuánto dura?",
    answer:
      "El hogar temporal es abrir tu casa por un tiempo para que un galgo esté seguro, acompañado y mejor preparado para encontrar familia. Puede durar desde unas semanas hasta unos pocos meses, dependiendo del galgo y de tu disponibilidad. Puedes cambiar una vida aunque no puedas adoptar.",
  },
  {
    id: "gastos-hogar-temporal",
    question: "¿Brigada cubre los gastos veterinarios durante el hogar temporal?",
    answer:
      "Sí. Nosotros cubrimos la atención veterinaria, vacunas, antiparasitarios y alimentación. Tú aportas un espacio seguro en casa, caminatas diarias y tu paciencia. No necesitas casa grande; necesitas un rincón tranquilo y ganas de marcar una diferencia.",
  },
  {
    id: "como-donar",
    question: "¿Cómo puedo donar y en qué se usa mi aporte?",
    answer:
      "La forma principal de apoyarnos es transferir directamente a la cuenta de la fundación. Puedes hacer una transferencia de una vez o configurar transferencias recurrentes desde tu banco. Los datos están en nuestra página de donaciones. También puedes suscribirte como apadrinante vía eSponsor. Estos montos son aproximados y varían según cada rescate, pero te dan una idea concreta de lo que tu aporte hace posible:",
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
      "No recibimos financiamiento estatal. Algunas empresas nos apoyan puntualmente y las puedes conocer en nuestra página de colaboradores, pero no dependemos de ellas. El grueso de nuestros recursos viene de personas que se preocupan por los galgos como tú. Tu apoyo es la razón por la que podemos rescatar, tratar y reubicar galgos en Chile.",
  },
  {
    id: "si-la-adopcion-no-funciona",
    question: "¿Qué pasa si la adopción no funciona?",
    answer:
      "Si el match no funciona, trabajamos juntos para encontrar la mejor solución para ti y para el galgo. Preferimos la conversación abierta a la preocupación silenciosa. Puedes escribirnos en cualquier momento y buscaremos la alternativa que más les convenga a ambos.",
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

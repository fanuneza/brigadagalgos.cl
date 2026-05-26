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
    answer:
      "El proceso tiene cuatro pasos. De tu primer mensaje al galgo en tu sillón, te acompañamos en cada etapa.",
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
      "La adopción tiene un aporte que nos ayuda a cubrir parte de lo que invertimos en cada rescate: esterilización, vacunas, desparasitación, microchip y revisión veterinaria completa. Antes de entregarlo, tu galgo está listo para vivir sano. Te contamos el monto exacto cuando conversamos; no hay cargos ocultos.",
  },
  {
    id: "convivencia-ninos-animales",
    question: "¿Se llevan bien con niños y otros animales?",
    answer:
      "La mayoría se lleva bien con niños y otros animales cuando se hace una presentación adecuada. Nosotros conocemos a cada galgo y te ayudamos a evaluar si su temperamento es adecuado para tu familia. Nunca te dejamos solo con una adopción que no esté preparada para convivir.",
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
      "El hogar temporal es abrir tu casa por un tiempo para que un galgo esté seguro, acompañado y mejor preparado para encontrar familia. Puede durar desde unas semanas hasta unos pocos meses, dependiendo del galgo y de tu disponibilidad. No necesitas adoptar para cambiar una vida.",
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
      "Puedes donar a través de nuestra página de donaciones o contactarnos directamente. Tu aporte cubre alimento, atención veterinaria, medicamentos, traslados y todo lo que un galgo necesita mientras espera familia.",
    details: [
      "Con $5.000 pones comida de calidad en el plato de un galgo rescatado durante una semana.",
      "Con $10.000 cubres vacunas y antiparasitarios de un recién rescatado.",
      "Con $20.000 costeas una consulta veterinaria de urgencia.",
      "Con $50.000 apoyas el costo completo de un galgo en rehabilitación por un mes.",
    ],
  },
  {
    id: "financiamiento-estatal",
    question: "¿Reciben financiamiento del Estado o de la industria?",
    answer:
      "No recibimos financiamiento estatal ni de la industria. Cada peso viene de personas que se preocupan por los galgos como tú. Tu apoyo es la razón por la que podemos rescatar, tratar y reubicar galgos en Chile.",
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

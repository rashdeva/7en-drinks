export const NOTIFICATION_MESSAGES = {
  // Welcome message
  WELCOME: {
    en: 'Welcome to *7en Drinks*! 🍹\n\nThank you for joining our community. Get ready to explore our exclusive drinks and participate in exciting quests.',
    ru: 'Добро пожаловать в *7en Drinks*! 🍹\n\nСпасибо, что присоединились к нашему сообществу. Готовьтесь исследовать наши эксклюзивные напитки и участвовать в увлекательных квестах.',
  },

  // Button text
  START_BUTTON_TEXT: {
    en: 'Start Exploring',
    ru: 'Начать Исследование',
  },

  SUBSCRIBE_CHANNEL: {
    en: 'Subscribe to Channel',
    ru: 'Подписаться на Канал',
  },

  START_DRINK_WATER: {
    en: 'Start Drinking',
    ru: 'Начать Пить',
  },
  RETENTION_24H: {
    en: "Hey! 👋 It's been 24 hours since you joined *7en Drinks*. Have you checked out our latest offers?",
    ru: 'Привет! 👋 Прошло 24 часа с момента вашего присоединения к *7en Drinks*. Вы уже ознакомились с нашими последними предложениями?',
  },
  RETENTION_48H: {
    en: "Hello again! 🌟 It's been 48 hours since you joined *7en Drinks*. Don't miss out on our exclusive deals!",
    ru: 'И снова здравствуйте! 🌟 Прошло 48 часов с момента вашего присоединения к *7en Drinks*. Не пропустите наши эксклюзивные предложения!',
  },
  RETENTION_7D: {
    en: "We miss you! 🍸 It's been a week since you joined *7en Drinks*. Come back and explore what's new!",
    ru: 'Мы скучаем по вам! 🍸 Прошла неделя с момента вашего присоединения к *7en Drinks*. Возвращайтесь и узнайте, что нового!',
  },
};

export function getNotificationMessage(
  type:
    | 'welcome'
    | 'retention_24h'
    | 'retention_48h'
    | 'retention_7d'
    | 'start_button_text'
    | 'subscribe_channel'
    | 'start_drink_water',
  lang: string = 'en',
): string {
  const supportedLang = ['en', 'ru'].includes(lang) ? lang : 'en';

  switch (type) {
    case 'welcome':
      return NOTIFICATION_MESSAGES.WELCOME[supportedLang];
    case 'retention_24h':
      return NOTIFICATION_MESSAGES.RETENTION_24H[supportedLang];
    case 'retention_48h':
      return NOTIFICATION_MESSAGES.RETENTION_48H[supportedLang];
    case 'retention_7d':
      return NOTIFICATION_MESSAGES.RETENTION_7D[supportedLang];
    case 'start_button_text':
      return NOTIFICATION_MESSAGES.START_BUTTON_TEXT[supportedLang];
    case 'subscribe_channel':
      return NOTIFICATION_MESSAGES.SUBSCRIBE_CHANNEL[supportedLang];
    case 'start_drink_water':
      return NOTIFICATION_MESSAGES.START_DRINK_WATER[supportedLang];
    default:
      return NOTIFICATION_MESSAGES.WELCOME[supportedLang];
  }
}

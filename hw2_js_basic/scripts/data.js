// Экспортируем объект со всеми данными для свадебного сайта

/**
 * weddingData - главный объект с данными
 * Содержит всю информацию о паре, мероприятии, навигации и секциях сайта
 */
export const weddingData = {
    // Информация о паре
    couple: {
        bride: "Jenny",           // Имя невесты
        groom: "Jason",           // Имя жениха
        initials: "J & J"         // Инициалы для логотипа
    },

    // Информация о мероприятии
    event: {
        date: "Saturday, September 20, 2025",      // Дата свадьбы
        venue: "The Golden Elm Manor",             // Место проведения
        location: "St. Augustine, New York"        // Город/адрес
    },

    // Массив пунктов навигационного меню
    navigation: [
        { href: "#home", label: "HOME" },
        { href: "#our-story", label: "OUR STORY" },
        { href: "#details", label: "DETAILS" },
        { href: "#rsvp", label: "RSVP" }
    ],

    // Массив секций контента (карточки)
    sections: [
        {
            id: "our-story",
            title: "OUR STORY",
            description: "The story of Jenny and Jason",
            theme: "dark-brown"
        },
        {
            id: "details",
            title: "THE DETAILS",
            description: "Wedding day logistics and information",
            theme: "gold"
        },
        {
            id: "rsvp",
            title: "RSVP",
            description: "Respond to the wedding invitation",
            theme: "soft-brown"
        },
        {
            id: "registry",
            title: "REGISTRY",
            description: "Wedding gift registry",
            theme: "beige"
        }
    ],

    // Данные для секции реестра подарков
    registry: {
        title: "Registry",
        description: "Your presence is the most cherished gift. Should you wish to contribute, we've created a honeymoon registry to help us embark on a memorable adventure to the Amalfi Coast.",
        buttonText: "GO TO REGISTRY",
        link: "#"
    }
};
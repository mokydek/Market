export type Lang = 'ru' | 'en' | 'kk'

// Russian is the source of truth. Its keys define TranslationKey, and the
// `satisfies` below forces en and kk to provide every one of them, so a
// missing translation is a build error rather than a silent fallback.
// Rules for every string: no hyphens, no emoji.
const ru = {
  // App
  appName: 'Market',
  tagline: 'Лучшие товары по цене и качеству',

  // Transitional placeholder copy (replaced as real pages land)
  landingNote: 'Настоящий лендинг появится в Фазе 4',
  appTitle: 'Основное приложение',
  appNote: 'Поиск по маркетплейсам появится начиная с Фазы 6',

  // Search
  searchPlaceholder: 'Введите название товара',
  searchButton: 'Найти',
  photoButton: 'Поиск по фото',

  // Auth
  signIn: 'Войти',
  signUp: 'Регистрация',
  signOut: 'Выйти',
  email: 'Почта',
  password: 'Пароль',

  // Account
  profile: 'Профиль',
  history: 'История',
  favorites: 'Избранное',

  // Results
  resultsFor: 'Результаты по запросу',
  noResults: 'Ничего не найдено',
  loading: 'Загрузка',
  bestValue: 'Лучшая выгода',
  cheapest: 'Самая низкая цена',
  topRated: 'Высокий рейтинг',
  priceLabel: 'Цена',
  ratingLabel: 'Рейтинг',
  reviewsLabel: 'Отзывы',
  openOnMarketplace: 'Открыть на маркетплейсе',
  addFavorite: 'В избранное',
  removeFavorite: 'Убрать из избранного',

  // States and badges
  errorGeneric: 'Произошла ошибка. Попробуйте позже',
  marketplaceBlocked: 'Некоторые маркетплейсы временно недоступны',
  b2bBadge: 'Оптом',
} as const

export type TranslationKey = keyof typeof ru

export const translations = {
  ru,
  en: {
    appName: 'Market',
    tagline: 'The best products by price and quality',
    landingNote: 'The real landing page arrives in Phase 4',
    appTitle: 'Main application',
    appNote: 'Marketplace search arrives starting from Phase 6',
    searchPlaceholder: 'Enter a product name',
    searchButton: 'Search',
    photoButton: 'Search by photo',
    signIn: 'Sign in',
    signUp: 'Sign up',
    signOut: 'Sign out',
    email: 'Email',
    password: 'Password',
    profile: 'Profile',
    history: 'History',
    favorites: 'Favorites',
    resultsFor: 'Results for',
    noResults: 'Nothing found',
    loading: 'Loading',
    bestValue: 'Best value',
    cheapest: 'Lowest price',
    topRated: 'Top rated',
    priceLabel: 'Price',
    ratingLabel: 'Rating',
    reviewsLabel: 'Reviews',
    openOnMarketplace: 'Open on marketplace',
    addFavorite: 'Add to favorites',
    removeFavorite: 'Remove from favorites',
    errorGeneric: 'Something went wrong. Please try again later',
    marketplaceBlocked: 'Some marketplaces are temporarily unavailable',
    b2bBadge: 'Wholesale',
  },
  kk: {
    appName: 'Market',
    tagline: 'Баға мен сапа бойынша үздік тауарлар',
    landingNote: 'Нағыз лендинг 4 фазада пайда болады',
    appTitle: 'Негізгі қосымша',
    appNote: 'Маркетплейс іздеу 6 фазадан бастап қосылады',
    searchPlaceholder: 'Тауар атауын енгізіңіз',
    searchButton: 'Іздеу',
    photoButton: 'Фото бойынша іздеу',
    signIn: 'Кіру',
    signUp: 'Тіркелу',
    signOut: 'Шығу',
    email: 'Пошта',
    password: 'Құпия сөз',
    profile: 'Профиль',
    history: 'Тарих',
    favorites: 'Таңдаулылар',
    resultsFor: 'Сұраныс бойынша нәтижелер',
    noResults: 'Ештеңе табылмады',
    loading: 'Жүктелуде',
    bestValue: 'Ең тиімді',
    cheapest: 'Ең төмен баға',
    topRated: 'Жоғары рейтинг',
    priceLabel: 'Баға',
    ratingLabel: 'Рейтинг',
    reviewsLabel: 'Пікірлер',
    openOnMarketplace: 'Маркетплейсте ашу',
    addFavorite: 'Таңдаулыларға қосу',
    removeFavorite: 'Таңдаулылардан алып тастау',
    errorGeneric: 'Қате пайда болды. Кейінірек қайталап көріңіз',
    marketplaceBlocked: 'Кейбір маркетплейстер уақытша қолжетімсіз',
    b2bBadge: 'Көтерме',
  },
} satisfies Record<Lang, Record<TranslationKey, string>>

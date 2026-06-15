import '@testing-library/jest-dom';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

if (!i18n.isInitialized) {
	i18n.use(initReactI18next).init({
		lng: 'en',
		fallbackLng: 'en',
		resources: { en: { translation: {} } },
		interpolation: { escapeValue: false },
	});
}

// jsdom does not implement ResizeObserver — polyfill for components that use it (e.g. input-otp)
window.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
};

// jsdom does not implement matchMedia — polyfill for theme detection
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	configurable: true,
	value: (query: string): MediaQueryList =>
		({
			matches: false,
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}) as MediaQueryList,
});

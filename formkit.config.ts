import { en } from '@formkit/i18n';
import { genesisIcons } from "@formkit/icons";
import { rootClasses } from "./formkit.theme"
import { createProPlugin, inputs } from '@formkit/pro';
import { createInput } from '@formkit/vue';
import { h, ref } from 'vue';

import AutoComplete from './src/components/elements/AutoComplete.vue';
import Rating from '@/components/elements/Rating.vue';

const pro = createProPlugin('fk-2fd67a0bf', inputs);

const createFormkitInput = (component, props = []) => {
  return createInput(component, { props });
};

// Define your phone input component
const PhoneInput = {
  props: ['defaultCountryCode'],
  setup(props, context) {
    const countryCode = ref(props.defaultCountryCode || '+1');
    const phoneNumber = ref('');

    const updateValue = () => {
      const fullNumber = `${countryCode.value}${phoneNumber.value}`;
      context.node.input(fullNumber);
    };

    return () => h('div', { class: 'formkit-phone-input' }, [
      h('select', {
        class: 'formkit-input formkit-country-code',
        value: countryCode.value,
        onChange: (e) => {
          countryCode.value = e.target.value;
          updateValue();
        }
      }, [
        h('option', { value: '+1' }, '+1 (US)'),
        h('option', { value: '+44' }, '+44 (UK)'),
        h('option', { value: '+91' }, '+91 (IN)'),
        // Add more country codes as needed
      ]),
      h('input', {
        class: 'formkit-input formkit-phone-number',
        type: 'tel',
        placeholder: 'Phone number',
        value: phoneNumber.value,
        onInput: (e) => {
          phoneNumber.value = e.target.value;
          updateValue();
        }
      })
    ]);
  }
};

const config = {
  plugins: [pro],
  icons: { ...genesisIcons },
  locale: 'en',
  locales: { en },
  config: { rootClasses },
  inputs: {
    autosearch: createFormkitInput(AutoComplete, ['options', 'keymap', 'multiple', 'dataUrl', 'hasSearch', 'placeholder', 'hasOptions', 'dataUrl']),
    rating: createFormkitInput(Rating, ['ratingType', 'ratingProps']),
    phone: createFormkitInput(PhoneInput, ['defaultCountryCode']),
  }
};

export default config;
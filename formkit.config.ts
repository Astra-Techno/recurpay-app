import { en } from '@formkit/i18n';
import { genesisIcons } from "@formkit/icons";
import { rootClasses } from "./formkit.theme"
import { createProPlugin, inputs } from '@formkit/pro';
import { createInput } from '@formkit/vue';

import AutoComplete from './src/components/elements/AutoComplete.vue';
import Rating from '@/components/elements/Rating.vue';

const pro = createProPlugin('fk-2fd67a0bf', inputs);

const createFormkitInput = (component, props = {}) => {
  return createInput(component, { props });
};

const config = {
  plugins: [pro],
  icons: { ...genesisIcons },
  config: { rootClasses },
  inputs: {
    autosearch: createFormkitInput(AutoComplete, ['options', 'keymap', 'multiple', 'dataUrl', 'hasSearch', 'placeholder', 'hasOptions', 'dataUrl']),
    rating: createFormkitInput(Rating, ['ratingType', 'ratingProps']),
  }
};

export default config;

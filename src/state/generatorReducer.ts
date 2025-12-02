export type GeneratorStep = 'FORM' | 'CONFIRM' | 'LINK_GENERATED';

export interface GeneratorState {
  step: GeneratorStep;
  customerName: string;
  customerEmail: string;
  amount: string;
  currency: string;
  gateway: string;
  description: string;
  generatedLink: string | null;
  error: string | null;
}

export type GeneratorAction =
  | { type: 'SET_FIELD'; field: keyof GeneratorState; value: string }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'SET_GENERATED_LINK'; link: string }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'RESET' };

export const initialGeneratorState: GeneratorState = {
  step: 'FORM',
  customerName: '',
  customerEmail: '',
  amount: '',
  currency: 'USD',
  gateway: 'stripe',
  description: '',
  generatedLink: null,
  error: null,
};

export function generatorReducer(
  state: GeneratorState,
  action: GeneratorAction
): GeneratorState {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value, error: null };
    case 'NEXT_STEP':
      if (state.step === 'FORM') return { ...state, step: 'CONFIRM' };
      if (state.step === 'CONFIRM') return { ...state, step: 'LINK_GENERATED' };
      return state;
    case 'PREV_STEP':
      if (state.step === 'CONFIRM') return { ...state, step: 'FORM' };
      if (state.step === 'LINK_GENERATED') return { ...state, step: 'CONFIRM' };
      return state;
    case 'SET_GENERATED_LINK':
      return { ...state, generatedLink: action.link, step: 'LINK_GENERATED' };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'RESET':
      return initialGeneratorState;
    default:
      return state;
  }
}

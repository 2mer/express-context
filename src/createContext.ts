import { AsyncLocalStorage } from 'node:async_hooks';

export const Settings = { silentUseContext: false }

export default function createContext<T>(defaultValue?: T) {
	const ctx = new AsyncLocalStorage<{ value: T }>();

	const use = ({ silent = Settings.silentUseContext } = {}): T => {
		const store = ctx.getStore();

		if (!store) {
			if (silent) {
				if (!defaultValue) throw new Error('Context used in silent mode with no default value!\nContext should either have a default value or not be silent')
				return defaultValue;
			}

			throw new Error('Context used outside of context provider!\nDid you forget to wrap your code with the appropriate `context.run` block?')
		}

		return store?.value;
	}

	const run = <TCallback extends () => any>(value: T, callback: TCallback) => {
		return ctx.run<ReturnType<TCallback>, []>({ value }, callback)
	}

	return {
		use,
		run,
	};
}

const ctx = createContext<number>();

ctx.run(1, () => {
	const v = ctx.use();
})
interface Transaction {
  id: string;
  amount: number;
  date: Date;
  description: string;
  category: 'food' | 'transport' | 'subscription' | 'other'
}

function pickFields<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    return keys.reduce((result, key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
        return result;
    }, {} as Pick<T, K>);
}

function isValidCategory(value: string): value is Transaction['category'] {
    return ['food', 'transport', 'subscription', 'other'].includes(value);
}


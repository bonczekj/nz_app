export const required = value => (value ? undefined : 'Povinné pole');
export const number = value => value && isNaN(Number(value)) ? 'Musí být číslo' : undefined;
export const email = value => {
    value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
        ? 'Chybná emailová adresa'
        : undefined;
};
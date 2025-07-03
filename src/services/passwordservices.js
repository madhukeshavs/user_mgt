import bcrypt  from 'bcrypt';


export const hashPassword = async (password) => {
    let hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
}

export const verifyPassword = async (password, hashedPassword) => {
    let isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}
export const isValidEmail = (email)=>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const isValidPassword = (password) => {
    // Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
}

export const isValidName = (name) => {
    // Name must be at least 2 characters long and can contain letters, spaces, and hyphens
    const nameRegex = /^[A-Za-z\s-]{2,}$/;
    return nameRegex.test(name);
}

export const isValidPhoneNumber = (phoneNumber) => {
    // Phone number must be 10 digits long
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
}

export const isValidUrl = (url) => {
    // URL must start with http:// or https://
    const urlRegex = /^(https?:\/\/)[^\s/$.?#].[^\s]*$/;
    return urlRegex.test(url);
}

export const isValidDate = (date) => {
    // Date must be in DD-MM-YYYY format
    const dateRegex = /^\d{2}-\d{2}-\d{4}$/;
    return dateRegex.test(date);
}



